import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useMenuItem } from "@/hooks/useMenu";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/format";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface Props {
  itemId: string | null;
  onClose: () => void;
}

const hasValidBadge = (badge: string | null): boolean =>
  !!badge && badge !== "none" && badge.trim() !== "";

export const MenuItemModal = ({ itemId, onClose }: Props) => {
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const { data: item, isLoading } = useMenuItem(itemId ?? "");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleAdd = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items");
      return;
    }
    if (item) {
      addItem(item);
      toast.success(`${item.imageUrl} Added to cart!`, { duration: 1500 });
      onClose();
    }
  };

  if (!itemId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-up overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-stone-100 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : item ? (
          <>
            {/* Image / Emoji Section */}
            <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-brand-50 h-52 flex items-center justify-center overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={`${import.meta.env.VITE_MENU_API_URL}${item.imageUrl}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove(
                      "hidden",
                    );
                  }}
                />
              ) : null}
              <span
                className={`text-9xl select-none ${item.imageUrl ? "hidden" : ""}`}
              >
                {item.imageUrl}
              </span>

              {item.isVegetarian && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-green-500 text-white px-2.5 py-1 rounded-full z-10">
                  <span className="text-xs font-bold">V</span>
                  <span className="text-xs font-semibold">Vegetarian</span>
                </div>
              )}
              {hasValidBadge(item.badge) && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge label={item.badge!} variant="warning" />
                </div>
              )}
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <span className="text-xs font-semibold text-brand-500 capitalize tracking-widest">
                  {item.category}
                </span>
                <h2 className="text-2xl font-black font-display text-stone-800 mt-1">
                  {item.name}
                </h2>
              </div>

              <p className="text-stone-500 leading-relaxed mb-6">
                {item.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-stone-50 rounded-xl">
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">
                    Price
                  </p>
                  <p className="text-2xl font-black text-stone-800">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">
                    Category
                  </p>
                  <p className="text-sm font-semibold text-stone-700 capitalize">
                    {item.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">
                    Diet
                  </p>
                  <p className="text-sm font-semibold text-stone-700">
                    {item.isVegetarian ? "🥦 Vegetarian" : "🍖 Non-Vegetarian"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <p
                    className={`text-sm font-semibold ${item.isAvailable ? "text-green-600" : "text-red-500"}`}
                  >
                    {item.isAvailable ? "✅ Available" : "❌ Unavailable"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  disabled={!item.isAvailable}
                  onClick={handleAdd}
                >
                  {item.isAvailable
                    ? `Add to Cart · ${formatCurrency(item.price)}`
                    : "Unavailable"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <p className="text-stone-400">Item not found</p>
          </div>
        )}
      </div>
    </div>
  );
};
