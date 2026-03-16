import { menuApi } from "@/lib/axios";
import type {
  MenuItem,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  UpdateImageUrlRequest,
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

  // create: async (data: CreateMenuItemRequest): Promise<MenuItem> =>
  //   (await menuApi.post("/api/MenuItems", data)).data,
  create: async (
    data: CreateMenuItemRequest,
    imageFile?: File,
  ): Promise<MenuItem> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    formData.append("isVegetarian", data.isVegetarian.toString());
    if (data.badge) formData.append("badge", data.badge);

    if (imageFile) {
      formData.append("imageFile", imageFile);
    } else if (data.imageUrl) {
      formData.append("imageUrl", data.imageUrl);
    }

    return (
      await menuApi.post("/api/MenuItems", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },

  update: async (id: string, data: UpdateMenuItemRequest): Promise<MenuItem> =>
    (await menuApi.put(`/api/MenuItems/${id}`, data)).data,

  disable: async (id: string): Promise<void> =>
    (await menuApi.patch(`/api/MenuItems/${id}/disable`)).data,

  delete: async (id: string): Promise<void> =>
    (await menuApi.delete(`/api/MenuItems/${id}`)).data,

  // ── Image ────────────────────────────────────────────────────
  uploadImage: async (id: string, file: File): Promise<MenuItem> => {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await menuApi.post(`/api/MenuItems/${id}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;
  },

  updateImageUrl: async (
    id: string,
    data: UpdateImageUrlRequest,
  ): Promise<MenuItem> =>
    (await menuApi.patch(`/api/MenuItems/${id}/image-url`, data)).data,
};
