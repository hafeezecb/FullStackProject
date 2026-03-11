// User models
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Product models
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

// Cart models
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order models
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  userId: number;
  items: { productId: number; productName: string; quantity: number; unitPrice: number }[];
  shippingAddress: string;
}
