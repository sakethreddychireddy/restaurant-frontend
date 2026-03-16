import { useCartStore } from "../../../store/cartStore";
import { formatCurrency } from "../../../utils/formatCurrency";
import type { CartItem as CartItemType } from "../../../types";

export const CartItemRow = ({ item }: { item: CartItemType }) => {
  const { updateQuantity, removeItem } = useCartStore();
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-100 hover:border-brand-200 transition-colors">
      <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-brand-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
        {item.imageUrl}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-stone-800 truncate">{item.name}</h3>
        <p className="text-brand-500 font-semibold text-sm">
          {formatCurrency(item.price)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold transition-colors"
        >
          −
        </button>
        <span className="w-8 text-center font-bold text-stone-800">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold transition-colors"
        >
          +
        </button>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-stone-800">
          {formatCurrency(item.price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
