import { useState, useMemo, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  useCreateMenuItem,
  useUpdateMenuItem,
  useUploadMenuItemImage,
  useUpdateMenuItemImageUrl,
} from "@/hooks/useMenu";
import type { CreateMenuItemRequest, MenuItem } from "@/types";

interface Props {
  onClose: () => void;
  editItem?: MenuItem | null;
}

const INITIAL: CreateMenuItemRequest = {
  name: "",
  description: "",
  price: 0,
  category: "",
  imageUrl: "",
  isVegetarian: false,
  badge: null,
};

type ImageMode = "upload" | "url";

const MENU_API = import.meta.env.VITE_MENU_API_URL;

export const MenuItemForm = ({ onClose, editItem }: Props) => {
  const initialForm = useMemo(() => {
    if (editItem) {
      return {
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        category: editItem.category,
        imageUrl: editItem.imageUrl ?? "",
        isVegetarian: editItem.isVegetarian,
        badge: editItem.badge,
      };
    }
    return INITIAL;
  }, [editItem]);

  const [form, setForm] = useState<CreateMenuItemRequest>(initialForm);
  const [imageMode, setImageMode] = useState<ImageMode>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(
    editItem?.imageUrl?.startsWith("http") ? editItem.imageUrl : "",
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    editItem?.imageUrl
      ? editItem.imageUrl.startsWith("http")
        ? editItem.imageUrl
        : `${MENU_API}${editItem.imageUrl}`
      : null,
  );
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: create, isPending: creating } = useCreateMenuItem();
  const { mutate: update, isPending: updating } = useUpdateMenuItem();
  const { mutate: uploadImage, isPending: uploading } =
    useUploadMenuItemImage();
  const { mutate: updateImageUrl, isPending: updatingUrl } =
    useUpdateMenuItemImageUrl();

  const isPending = creating || updating || uploading || updatingUrl;

  const set = (
    key: keyof CreateMenuItemRequest,
    value: string | number | boolean | null,
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError("");
  };

  const validateImage = (): boolean => {
    if (imageMode === "upload" && !imageFile && !editItem?.imageUrl) {
      setImageError("Please upload an image");
      return false;
    }
    if (imageMode === "url" && !imageUrl.trim() && !editItem?.imageUrl) {
      setImageError("Please provide an image URL");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateImage()) return;

    const payload = {
      ...form,
      price: Number(form.price),
      badge: form.badge || null,
      imageUrl: imageMode === "url" ? imageUrl : form.imageUrl,
    };

    if (editItem) {
      update(
        { id: editItem.id, data: payload },
        {
          onSuccess: (updated) => {
            if (imageMode === "upload" && imageFile) {
              uploadImage(
                { id: updated.id, file: imageFile },
                { onSuccess: onClose },
              );
            } else if (imageMode === "url" && imageUrl) {
              updateImageUrl(
                { id: updated.id, imageUrl },
                { onSuccess: onClose },
              );
            } else {
              onClose();
            }
          },
        },
      );
    } else {
      // create — pass imageFile directly
      create(
        {
          data: payload,
          imageFile:
            imageMode === "upload" ? (imageFile ?? undefined) : undefined,
        },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Margherita Pizza"
        />
        <Input
          label="Category"
          required
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          placeholder="pizza"
        />
      </div>

      <Input
        label="Description"
        required
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="Describe the dish..."
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price ($)"
          type="number"
          required
          min="0"
          step="0.01"
          value={form.price || ""}
          onChange={(e) => set("price", e.target.value)}
          placeholder="12.99"
        />
        <Input
          label="Badge (optional)"
          value={form.badge || ""}
          onChange={(e) => set("badge", e.target.value || null)}
          placeholder="New, Popular..."
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="veg"
          checked={form.isVegetarian}
          onChange={(e) => set("isVegetarian", e.target.checked)}
          className="w-4 h-4 accent-brand-500"
        />
        <label htmlFor="veg" className="text-sm font-semibold text-stone-700">
          Vegetarian
        </label>
      </div>

      {/* ── Image Section (Required) ─────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-stone-700">
            Image <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {(["upload", "url"] as ImageMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setImageMode(mode);
                  setImageError("");
                  if (mode === "upload") {
                    setImageUrl("");
                  } else {
                    setImageFile(null);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  imageMode === mode
                    ? "bg-terra-500 text-white"
                    : "bg-cream-100 text-warm-500 hover:bg-cream-200"
                }`}
              >
                {mode === "upload" ? "Upload File" : "Paste URL"}
              </button>
            ))}
          </div>
        </div>

        {/* Upload */}
        {imageMode === "upload" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
              imageError
                ? "border-red-300 bg-red-50"
                : "border-cream-300 hover:border-terra-400"
            }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 mx-auto object-cover rounded-lg"
              />
            ) : (
              <div className="text-warm-400 text-sm">
                <p className="text-2xl mb-1">📁</p>
                <p>Click to upload image</p>
                <p className="text-xs mt-1">JPEG, PNG, WebP — max 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* URL */}
        {imageMode === "url" && (
          <div className="space-y-2">
            <Input
              label="Image URL"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value || null);
                setImageError("");
              }}
              placeholder="https://example.com/image.jpg"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 rounded-lg object-cover w-full"
                onError={() => setImagePreview(null)}
              />
            )}
          </div>
        )}

        {/* Error */}
        {imageError && (
          <p className="text-red-500 text-xs font-body">{imageError}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" loading={isPending} className="flex-1">
          {editItem ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  );
};
