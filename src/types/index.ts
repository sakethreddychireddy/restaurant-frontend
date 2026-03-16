export interface User {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Admin";
}
export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: "Customer" | "Admin";
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

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isVegetarian: boolean;
  badge: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isVegetarian: boolean;
  badge?: string | null;
}

export interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  badge?: string | null;
  isAvailable?: boolean;
}

// ── New image DTOs ─────────────────────────────────────────────
export interface UpdateImageUrlRequest {
  imageUrl: string;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Delivered"
  | "Cancelled";

export interface OrderItemRequest {
  menuItemId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  deliveryAddress: string;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  menuItemId: string;
  menuItemName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CartItem extends MenuItem {
  quantity: number;
}
