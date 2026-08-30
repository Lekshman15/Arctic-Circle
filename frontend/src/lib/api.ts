// Thin client for the Arctic Circle Express + Prisma backend.
// See express-backend/backend/CONTEXT.md for the full API contract.

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8081/api";

const TOKEN_KEY = "ac_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  // 204/empty-body responses (none currently, but keep this safe)
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

// ---------- Types matching the Express/Prisma contract ----------

export type Role = "ADMIN" | "CUSTOMER";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: Role;
};

export type AuthResponse = { token: string; user: PublicUser };

export type ProductType = "SPLIT" | "WINDOW";

export type Product = {
  id: string;
  brand: string;
  modelName: string;
  tonnage: number;
  starRating: number;
  type: ProductType;
  price: number;
  imageUrl: string | null;
  createdAt: string;
};

export type OrderStatus = "PLACED" | "DELIVERED";

export type OrderSummary = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  customer: { name: string; phone: string | null };
  product: { id: string; brand: string; modelName: string; price: number };
};

export type ApplianceType = "AC" | "WASHING_MACHINE" | "FRIDGE";
export type TicketStatus = "OPEN" | "COMPLETED";

export type TicketSummary = {
  id: string;
  appliance: ApplianceType;
  complaint: string;
  address: string;
  preferredTimings: string;
  status: TicketStatus;
  rating: number | null;
  feedback: string | null;
  createdAt: string;
  completedAt: string | null;
  customer: { name: string; phone: string | null };
};

// ---------- Auth ----------

export const authApi = {
  register(data: { name: string; email: string; password: string; phone?: string; address?: string }) {
    return request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) });
  },
  login(email: string, password: string) {
    return request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  },
};

// ---------- Users ----------

export const usersApi = {
  getMe() {
    return request<PublicUser>("/users/me");
  },
  updateMe(data: { name?: string; phone?: string; address?: string }) {
    return request<PublicUser>("/users/me", { method: "PUT", body: JSON.stringify(data) });
  },
  changePassword(currentPassword: string, newPassword: string) {
    return request<{ message: string }>("/users/me/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// ---------- Products ----------

export type ProductSort = "cost-asc" | "cost-desc" | "rating-desc" | "tonnage" | "brand";

export const productsApi = {
  list(params?: { brand?: string; type?: ProductType; sort?: ProductSort }) {
    const qs = new URLSearchParams();
    if (params?.brand) qs.set("brand", params.brand);
    if (params?.type) qs.set("type", params.type);
    if (params?.sort) qs.set("sort", params.sort);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return request<Product[]>(`/products${suffix}`);
  },
  get(id: string) {
    return request<Product>(`/products/${id}`);
  },
  create(data: {
    brand: string;
    modelName: string;
    tonnage: number;
    starRating: number;
    type: ProductType;
    price: number;
    imageUrl?: string;
  }) {
    return request<Product>("/products", { method: "POST", body: JSON.stringify(data) });
  },
};

// ---------- Orders ----------

export const ordersApi = {
  place(productId: string) {
    return request<OrderSummary>("/orders", { method: "POST", body: JSON.stringify({ productId }) });
  },
  getMine() {
    return request<OrderSummary[]>("/orders/me");
  },
  getAll() {
    return request<OrderSummary[]>("/orders");
  },
  markDelivered(id: string) {
    return request<OrderSummary>(`/orders/${id}/deliver`, { method: "PATCH" });
  },
};

// ---------- Tickets ----------

export const ticketsApi = {
  raise(data: { appliance: ApplianceType; complaint?: string; address: string; preferredTimings: string }) {
    return request<TicketSummary>("/tickets", { method: "POST", body: JSON.stringify(data) });
  },
  getMine() {
    return request<TicketSummary[]>("/tickets/me");
  },
  getAll() {
    return request<TicketSummary[]>("/tickets");
  },
  complete(id: string) {
    return request<TicketSummary>(`/tickets/${id}/complete`, { method: "PATCH" });
  },
  submitFeedback(id: string, rating: number, feedback?: string) {
    return request<TicketSummary>(`/tickets/${id}/feedback`, {
      method: "POST",
      body: JSON.stringify({ rating, feedback }),
    });
  },
};
