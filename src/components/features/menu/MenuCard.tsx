import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/format";
import toast from "react-hot-toast";
import type { MenuItem } from "@/types";

const hasValidBadge = (badge: string | null): boolean =>
  !!badge && badge !== "none" && badge.trim() !== "";

interface Props {
  item: MenuItem;
  onViewDetail: (id: string) => void;
}

export const MenuCard = ({ item, onViewDetail }: Props) => {
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please sign in to add items");
      return;
    }
    addItem(item);
    toast.success(`${item.imageUrl} Added to cart!`, { duration: 1500 });
  };

  return (
    <article
      onClick={() => onViewDetail(item.id)}
      className="bg-white rounded-3xl border border-cream-200 overflow-hidden card-hover cursor-pointer group flex flex-col shadow-warm-sm"
    >
      {/* Image / Emoji section */}
      <div className="relative bg-gradient-to-br from-cream-100 to-cream-200 h-44 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img
            src={`${import.meta.env.VITE_MENU_API_URL}${item.imageUrl}`}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // fallback to emoji if image fails to load
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        {/* Emoji fallback — shown when no image or image fails */}
        <span
          className={`text-7xl group-hover:scale-110 transition-transform duration-300 select-none filter drop-shadow-sm ${
            item.imageUrl ? "hidden" : ""
          }`}
        >
          {item.imageUrl}
        </span>

        {/* Veg indicator */}
        {item.isVegetarian && (
          <div
            className="absolute top-3 left-3 w-6 h-6 bg-olive-500 rounded-full flex items-center justify-center shadow-sm z-10"
            title="Vegetarian"
          >
            <span className="text-white text-xs font-body font-700">V</span>
          </div>
        )}

        {/* Badge */}
        {hasValidBadge(item.badge) && (
          <div className="absolute top-3 right-3 z-10">
            <Badge label={item.badge!} variant="warning" />
          </div>
        )}

        {/* View detail hint */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors duration-300 flex items-center justify-center z-10">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur text-charcoal text-xs font-body font-700 px-3 py-1.5 rounded-full shadow-warm-sm">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs font-body font-700 text-terra-500 tracking-widest mb-1">
          {item.category.toUpperCase()}
        </span>
        <h3 className="font-display font-700 text-charcoal text-xl mb-1.5 leading-tight">
          {item.name}
        </h3>
        <p className="text-warm-500 text-sm leading-relaxed flex-1 line-clamp-2 font-body">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-100">
          <span className="font-display text-2xl font-700 text-charcoal">
            {formatCurrency(item.price)}
          </span>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-terra-500 hover:bg-terra-600 text-white text-sm font-body font-700 rounded-xl transition-all duration-200 shadow-terra hover:shadow-lg active:scale-95"
          >
            + Add
          </button>
        </div>
      </div>
    </article>
  );
};
