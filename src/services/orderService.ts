import { orderApi } from "@/lib/axios";
import type { Order, CreateOrderRequest, OrderStatus } from "@/types";

export const orderService = {
  create: async (data: CreateOrderRequest): Promise<Order> =>
    (await orderApi.post("/api/Orders", data)).data,

  getAll: async (): Promise<Order[]> =>
    (await orderApi.get("/api/Orders")).data,

  getMyOrders: async (): Promise<Order[]> =>
    (await orderApi.get("/api/Orders/my")).data,

  getById: async (id: string): Promise<Order> =>
    (await orderApi.get(`/api/Orders/${id}`)).data,

  // Capital S — matches UpdateOrderStatusDto(OrderStatus Status)
  updateStatus: async (id: string, status: OrderStatus): Promise<Order> =>
    (await orderApi.patch(`/api/Orders/${id}/status`, { Status: status })).data,

  // cancel returns 204 NoContent
  cancel: async (id: string): Promise<void> =>
    (await orderApi.patch(`/api/Orders/${id}/cancel`)).data,
};
