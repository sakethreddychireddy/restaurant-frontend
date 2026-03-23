export interface User {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Admin";
}
export interface AuthResponse {
  refreshToken: string;
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
// ── Profile ────────────────────────────────────────────────────
export interface ProfileResponse {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isOAuthUser: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export interface AddressResponse {
  id: string;
  label: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  fullAddress: string;
  shortAddress: string;
}

export interface AddressRequest {
  label: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}
// ── OTP ────────────────────────────────────────────────────────
export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  isNewUser: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  name?: string;
}
