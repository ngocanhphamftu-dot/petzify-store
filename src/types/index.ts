export interface Product {
  id: number;
  name: string;
  slug: string;
  type: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  tags?: { id: number; name: string; slug: string }[];
  attributes: { id: number; name: string; variation: boolean; visible: boolean; options: string[] }[];
  stock_status: string;
  stock_quantity: number | null;
  average_rating: string;
  rating_count: number;
}

export interface WCVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: string;
  stock_quantity: number | null;
  attributes: { id: number; name: string; option: string }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  image: { src: string; alt: string } | null;
}

export interface CartItem {
  cartItemId: string;                          // unique identifier per cart entry
  product: Product;
  quantity: number;
  variationId?: number;                        // WooCommerce variation ID
  selectedAttributes?: Record<string, string>; // e.g. { Size: "XL", Color: "Red" }
  personalization?: string;                    // custom text entered by customer
}
