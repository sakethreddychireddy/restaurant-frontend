import { menuApi } from "@/lib/axios";
import type {
  MenuItem,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from "@/types";

export const menuService = {
  getAll: async (): Promise<MenuItem[]> =>
    (await menuApi.get("/api/MenuItems")).data,

  getAvailable: async (): Promise<MenuItem[]> =>
    (await menuApi.get("/api/MenuItems/available")).data,

  getByCategory: async (category: string): Promise<MenuItem[]> =>
    (await menuApi.get(`/api/MenuItems/category/${category}`)).data,

  getById: async (id: string): Promise<MenuItem> =>
    (await menuApi.get(`/api/MenuItems/${id}`)).data,

  create: async (data: CreateMenuItemRequest): Promise<MenuItem> =>
    (await menuApi.post("/api/MenuItems", data)).data,

  update: async (id: string, data: UpdateMenuItemRequest): Promise<MenuItem> =>
    (await menuApi.put(`/api/MenuItems/${id}`, data)).data,

  disable: async (id: string): Promise<void> =>
    (await menuApi.patch(`/api/MenuItems/${id}/disable`)).data,

  delete: async (id: string): Promise<void> =>
    (await menuApi.delete(`/api/MenuItems/${id}`)).data,
};
