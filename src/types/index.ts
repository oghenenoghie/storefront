export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Currency {
  id: number;
  code: string;
  symbol: string;
}

export interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock_quantity: number;
  is_active: boolean;
  vendor: number;
  category: number;
  category_detail: Category;
  currency: number;
  currency_detail: Currency;
  images: ProductImage[];
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product: number;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  user?: { username: string };
}

export interface WishlistItem {
  id: number;
  product: Product;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  line_total: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: string;
  discount_total: string;
  grand_total: string;
  coupon?: number;
}

export interface TrackingEvent {
  status: string;
  message: string;
  created_at: string;
}

export interface OrderItem {
  product_name: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  subtotal: string;
  discount_total: string;
  shipping_total: string;
  grand_total: string;
  shipping_address: string;
  items: OrderItem[];
  tracking_events: TrackingEvent[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
