import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/woocommerce";
import { getDiscount } from "@/lib/constants";

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// In-memory store: keyed by IP, 5 requests per 60 seconds
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// ─── Idempotency Cache ────────────────────────────────────────────────────────
// Prevents duplicate orders on double-submit / network retry
// TTL: 24 hours
interface CachedOrder {
  orderId: number;
  orderKey: string;
  createdAt: number;
}
const idempotencyStore = new Map<string, CachedOrder>();

function getCachedOrder(key: string): CachedOrder | null {
  const cached = idempotencyStore.get(key);
  if (!cached) return null;
  if (Date.now() - cached.createdAt > 24 * 60 * 60 * 1000) {
    idempotencyStore.delete(key);
    return null;
  }
  return cached;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderItem {
  productId: number;
  quantity: number;
  variationId?: number;
  selectedAttributes?: Record<string, string>;
  personalization?: string;
  expectedPrice?: number;
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    // 2. Idempotency — return cached response for duplicate requests
    const idempotencyKey = req.headers.get("X-Idempotency-Key");
    if (idempotencyKey) {
      const cached = getCachedOrder(idempotencyKey);
      if (cached) {
        return NextResponse.json({
          success: true,
          orderId: cached.orderId,
          orderKey: cached.orderKey,
        });
      }
    }

    const body = await req.json();
    const { items, ...formData }: { items: OrderItem[] } & Record<string, string> = body;

    // 3. Basic payload validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty." }, { status: 400 });
    }
    if (!formData.email || !formData.firstName || !formData.address || !formData.city) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // 4. Server-side stock validation
    // Fetches each product/variation from WooCommerce to confirm availability
    const validationErrors: string[] = [];

    for (const item of items) {
      try {
        const endpoint = item.variationId
          ? `products/${item.productId}/variations/${item.variationId}`
          : `products/${item.productId}`;
        const { data: wcProduct } = await api.get(endpoint);

        // Stock check
        if (wcProduct.stock_status === "outofstock") {
          validationErrors.push(
            `"${wcProduct.name || `Product #${item.productId}`}" is currently out of stock.`
          );
          continue;
        }
        if (
          wcProduct.stock_quantity !== null &&
          wcProduct.stock_quantity < item.quantity
        ) {
          validationErrors.push(
            `Only ${wcProduct.stock_quantity} left for "${wcProduct.name || `Product #${item.productId}`}". Please update your cart.`
          );
        }

        // Price change detection — warn if price drifted since cart was built
        if (item.expectedPrice !== undefined) {
          const serverPrice = parseFloat(wcProduct.price || "0");
          if (serverPrice > 0 && Math.abs(serverPrice - item.expectedPrice) > 0.01) {
            validationErrors.push(
              `The price for "${wcProduct.name}" has changed (now $${serverPrice.toFixed(2)}). Please refresh your cart.`
            );
          }
        }
      } catch {
        // If we can't reach WC API for a specific product, skip silently
        // (don't block the order — availability check is best-effort)
        continue;
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: validationErrors.join("\n"), errors: validationErrors },
        { status: 422 }
      );
    }

    // 5. Build line items with personalization as WC meta_data
    const lineItems = items.map((item) => {
      const metaData: { key: string; value: string }[] = [];

      // Store personalization text as line item meta
      if (item.personalization?.trim()) {
        metaData.push({ key: "Personalization", value: item.personalization.trim() });
      }
      // Store selected variation attributes as meta
      if (item.selectedAttributes) {
        Object.entries(item.selectedAttributes).forEach(([k, v]) => {
          metaData.push({ key: k, value: v });
        });
      }

      return {
        product_id: item.productId,
        quantity: item.quantity,
        ...(item.variationId ? { variation_id: item.variationId } : {}),
        ...(metaData.length > 0 ? { meta_data: metaData } : {}),
      };
    });

    // 6. Calculate Buy More Save More discount and add as fee_lines
    const subtotal = items.reduce(
      (sum, item) => sum + (item.expectedPrice || 0) * item.quantity,
      0
    );
    const discountRate = getDiscount(items.length);
    const discountAmount = subtotal * discountRate;

    const feeLines =
      discountAmount > 0
        ? [
            {
              name: `Buy More Save More (${Math.round(discountRate * 100)}% off)`,
              tax_status: "none",
              total: `-${discountAmount.toFixed(2)}`,
            },
          ]
        : [];

    // 7. Build comprehensive customer note
    // Aggregates: form note + all per-item personalization for easy fulfillment
    const personalizationLines = items
      .filter((item) => item.personalization?.trim())
      .map(
        (item, idx) =>
          `Item ${idx + 1} (Product #${item.productId}): ${item.personalization!.trim()}`
      );

    const customerNote = [
      formData.note?.trim(),
      personalizationLines.length > 0
        ? `--- Personalization ---\n${personalizationLines.join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n")
      .trim();

    // 8. Create order in WooCommerce
    const paymentMethod: string = (formData.paymentMethod as string) || "mecom_paypal";
    const paymentMethodTitle = paymentMethod === "mecom_paypal" ? "PayPal & Cards" : "Cash on Delivery";

    const orderData = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethodTitle,
      set_paid: false,
      status: "pending",
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || "",
        address_1: formData.address,
        address_2: formData.address2 || "",
        city: formData.city,
        state: formData.state || "",
        postcode: formData.postcode || "",
        country: formData.country || "US",
      },
      shipping: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        address_2: formData.address2 || "",
        city: formData.city,
        state: formData.state || "",
        postcode: formData.postcode || "",
        country: formData.country || "US",
      },
      line_items: lineItems,
      fee_lines: feeLines,
      customer_note: customerNote,
    };

    const { data } = await api.post("orders", orderData);

    // 9. Cache result for idempotency
    if (idempotencyKey) {
      idempotencyStore.set(idempotencyKey, {
        orderId: data.id,
        orderKey: data.order_key,
        createdAt: Date.now(),
      });
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      orderKey: data.order_key,
      // payment_url returned by WooCommerce for redirect-based gateways (PayPal)
      paymentUrl: data.payment_url || null,
    });
  } catch (err: unknown) {
    console.error("[orders] POST error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
