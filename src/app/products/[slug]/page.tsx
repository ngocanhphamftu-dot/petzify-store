import api from "@/lib/woocommerce";
import { Product } from "@/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductActions from "@/components/ProductActions";
import ProductAccordions from "@/components/ProductAccordions";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { BASE_URL } from "@/lib/constants";

export const revalidate = 3600; // Re-fetch product data every 1 hour

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await api.get("products", { slug });
    return data[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const price = parseFloat(product.price || product.regular_price || "0");
  const img = product.images?.[0]?.src || "";
  const description = product.short_description
    ? product.short_description.replace(/<[^>]+>/g, "").trim().slice(0, 160)
    : `Buy ${product.name} — personalized just for you at Petzify.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `${BASE_URL}/products/${slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `${BASE_URL}/products/${slug}`,
      type: "website",
      images: img ? [{ url: img, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: img ? [img] : [],
    },
    other: {
      "product:price:amount": price.toFixed(2),
      "product:price:currency": "USD",
    },
  };
}

async function getRelatedProducts(categoryId: number, excludeId: number): Promise<Product[]> {
  try {
    // Fetch 5 from same category, filter out current product, take 4
    const { data: catData } = await api.get("products", {
      category: categoryId,
      per_page: 5,
      status: "publish",
    });
    const fromCat: Product[] = (catData || []).filter((p: Product) => p.id !== excludeId).slice(0, 4);

    if (fromCat.length >= 4) return fromCat;

    // Fill remaining from latest products (any category)
    const needed = 4 - fromCat.length;
    const existingIds = new Set([excludeId, ...fromCat.map((p) => p.id)]);
    const { data: latest } = await api.get("products", {
      per_page: 12,
      status: "publish",
      orderby: "date",
      order: "desc",
    });
    const filler: Product[] = (latest || [])
      .filter((p: Product) => !existingIds.has(p.id))
      .slice(0, needed);

    return [...fromCat, ...filler];
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  const isOnSale = !!(product.sale_price && product.sale_price !== product.regular_price);
  const rating = parseFloat(product.average_rating || "0");

  // Fetch related products from first category
  const firstCategoryId = product.categories[0]?.id;
  const relatedProducts = firstCategoryId
    ? await getRelatedProducts(firstCategoryId, product.id)
    : [];

  const price = parseFloat(product.price || product.regular_price || "0");
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.replace(/<[^>]+>/g, "").trim().slice(0, 500) || product.name,
    image: product.images?.map((img) => img.src) || [],
    brand: { "@type": "Brand", name: "Petzify" },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: "USD",
      price: price.toFixed(2),
      availability:
        product.stock_status === "instock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Petzify" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 5, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 7, maxValue: 14, unitCode: "DAY" },
        },
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${BASE_URL}/products` },
      ...(product.categories[0]
        ? [{ "@type": "ListItem", position: 3, name: product.categories[0].name, item: `${BASE_URL}/products?category=${product.categories[0].slug}` }]
        : []),
      { "@type": "ListItem", position: product.categories[0] ? 4 : 3, name: product.name, item: `${BASE_URL}/products/${product.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#F36621]">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#F36621]">Products</Link>
        {product.categories[0] && (
          <>
            <span>/</span>
            <Link href={`/products?category=${product.categories[0].slug}`} className="hover:text-[#F36621]">
              {product.categories[0].name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-700 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image Gallery */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          isOnSale={isOnSale}
        />

        {/* Right: Product Info */}
        <div className="flex flex-col gap-4">

          {/* Category */}
          {product.categories.length > 0 && (
            <p className="text-[#F36621] text-sm font-medium">
              {product.categories.map((c) => c.name).join(", ")}
            </p>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating_count > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={rating} size="md" />
              <span className="text-sm text-[#F36621] font-medium underline cursor-pointer">
                {product.rating_count} reviews
              </span>
            </div>
          )}

          {/* Short description */}
          {product.short_description && (
            <div
              className="text-gray-600 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          {/* Actions: price, size, buy more, add to cart */}
          <ProductActions product={product} />

          {/* Accordions: Description / Shipping / Personalization */}
          <div className="mt-2">
            <ProductAccordions description={product.description} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">You May Also Like</h2>
            {product.categories[0] && (
              <Link
                href={`/products?category=${product.categories[0].slug}`}
                className="text-[#F36621] text-sm font-semibold hover:underline"
              >
                View All →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
