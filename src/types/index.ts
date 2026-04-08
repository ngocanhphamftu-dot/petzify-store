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
  attributes: { id: number; name: string; variation: boolean; visible: boolean; options: string[] }[];
  stock_status: string;
  stock_quantity: number | null;
  average_rating: string;
  rating_count: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  image: { src: string; alt: string } | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
