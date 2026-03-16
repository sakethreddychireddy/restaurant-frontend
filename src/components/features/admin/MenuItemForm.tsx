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
  emoji: "🍽️",
  isVegetarian: false,
  badge: null,
};

type ImageMode = "none" | "upload" | "url";

export const MenuItemForm = ({ onClose, editItem }: Props) => {
  const initialForm = useMemo(() => {
    if (editItem) {
      return {
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        category: editItem.category,
        emoji: editItem.emoji,
        isVegetarian: editItem.isVegetarian,
        badge: editItem.badge,
      };
    }
    return INITIAL;
  }, [editItem]);

  const [form, setForm] = useState<CreateMenuItemRequest>(initialForm);
  const [imageMode, setImageMode] = useState<ImageMode>(
    editItem?.imageUrl ? "url" : "none",
  );
  const [imageUrl, setImageUrl] = useState(editItem?.imageUrl ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editItem?.imageUrl
      ? `${import.meta.env.VITE_MENU_API_URL}${editItem.imageUrl}`
      : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: create, isPending: creating } = useCreateMenuItem();
  const { mutate: update, isPending: updating } = useUpdateMenuItem();
  const { mutate: uploadImage } = useUploadMenuItemImage();
  const { mutate: updateImageUrl } = useUpdateMenuItemImageUrl();
  const isPending = creating || updating;

  const set = (
    key: keyof CreateMenuItemRequest,
    value: string | number | boolean | null,
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      badge: form.badge || null,
    };

    if (editItem) {
      update(
        { id: editItem.id, data: payload },
        {
          onSuccess: (updated) => {
            // handle image after update
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
      create(payload, {
        onSuccess: (created) => {
          // handle image after create
          if (imageMode === "upload" && imageFile) {
            uploadImage(
              { id: created.id, file: imageFile },
              { onSuccess: onClose },
            );
          } else if (imageMode === "url" && imageUrl) {
            updateImageUrl(
              { id: created.id, imageUrl },
              { onSuccess: onClose },
            );
          } else {
            onClose();
          }
        },
      });
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
          label="Emoji"
          required
          value={form.emoji}
          onChange={(e) => set("emoji", e.target.value)}
          placeholder="🍕"
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
          label="Category"
          required
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          placeholder="pizza"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Badge (optional)"
          value={form.badge || ""}
          onChange={(e) => set("badge", e.target.value || null)}
          placeholder="New, Popular..."
        />
        <div className="flex items-center gap-3 pt-7">
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
      </div>

      {/* ── Image Section ───────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-700">
          Image (optional)
        </label>

        {/* Mode selector */}
        <div className="flex gap-2">
          {(["none", "upload", "url"] as ImageMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setImageMode(mode);
                setImageFile(null);
                setImagePreview(null);
                setImageUrl("");
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-body font-semibold transition-all ${
                imageMode === mode
                  ? "bg-terra-500 text-white"
                  : "bg-cream-100 text-warm-500 hover:bg-cream-200"
              }`}
            >
              {mode === "none" && "No Image"}
              {mode === "upload" && "Upload File"}
              {mode === "url" && "Paste URL"}
            </button>
          ))}
        </div>

        {/* Upload file */}
        {imageMode === "upload" && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-cream-300 rounded-xl p-4 text-center cursor-pointer hover:border-terra-400 transition-colors"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 mx-auto object-cover rounded-lg"
              />
            ) : (
              <div className="text-warm-400 font-body text-sm">
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

        {/* Paste URL */}
        {imageMode === "url" && (
          <div className="space-y-2">
            <Input
              label="Image URL"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value || null);
              }}
              placeholder="https://example.com/image.jpg"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 rounded-lg object-cover"
                onError={() => setImagePreview(null)}
              />
            )}
          </div>
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
