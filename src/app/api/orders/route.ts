import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/woocommerce";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const orderData = {
      payment_method: "cod",
      payment_method_title: "Cash on Delivery",
      set_paid: false,
      billing: {
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone,
        address_1: body.address,
        city: body.city,
        state: body.state,
        postcode: body.postcode,
        country: body.country || "US",
      },
      shipping: {
        first_name: body.firstName,
        last_name: body.lastName,
        address_1: body.address,
        city: body.city,
        state: body.state,
        postcode: body.postcode,
        country: body.country || "US",
      },
      line_items: body.items.map((item: { productId: number; quantity: number; variationId?: number }) => ({
        product_id: item.productId,
        quantity: item.quantity,
        ...(item.variationId ? { variation_id: item.variationId } : {}),
      })),
      customer_note: body.note || "",
    };

    const { data } = await api.post("orders", orderData);

    return NextResponse.json({ success: true, orderId: data.id, orderKey: data.order_key });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
