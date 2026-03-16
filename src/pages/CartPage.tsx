import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { usePlaceOrder } from "@/hooks/useOrders";
import { formatCurrency } from "@/utils/format";
import type { CartItem } from "@/types";

const CartItemRow = ({ item }: { item: CartItem }) => {
  const { updateQuantity, removeItem } = useCartStore();
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-cream-200 shadow-warm-sm hover:shadow-warm-md transition-shadow">
      <div className="w-14 h-14 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <span className="text-3xl">{item.imageUrl}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-700 text-charcoal text-lg leading-tight truncate">
          {item.name}
        </h4>
        <p className="text-terra-500 font-body font-700 text-sm">
          {formatCurrency(item.price)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal font-body font-700 flex items-center justify-center transition-colors"
        >
          −
        </button>
        <span className="w-8 text-center font-body font-700 text-charcoal">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal font-body font-700 flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="font-display font-700 text-charcoal">
          {formatCurrency(item.price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs text-terra-400 hover:text-terra-600 font-body transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export const CartPage = () => {
  const { items, totalPrice, totalItems } = useCartStore();
  const [address, setAddress] = useState("");
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  const handleCheckout = () => {
    if (!address.trim()) return;
    placeOrder({
      deliveryAddress: address,
      items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
    });
  };

  if (items.length === 0)
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-28 h-28 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">🛒</span>
          </div>
          <h2 className="font-display text-3xl font-700 text-charcoal mb-2">
            Your cart is empty
          </h2>
          <p className="text-warm-400 font-body mb-8">
            Add some delicious items from our menu
          </p>
          <Link to="/menu">
            <Button size="lg">Browse Menu</Button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl font-700 text-charcoal mb-2">
          Your Cart
        </h1>
        <p className="text-warm-400 font-body mb-8">
          {totalItems()} items selected
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3 animate-fade-up">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="animate-fade-up-d1">
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-warm-md sticky top-24">
              <h2 className="font-display text-2xl font-700 text-charcoal mb-5">
                Order Summary
              </h2>
              <div className="space-y-3 mb-5">
                {items.map((i) => (
                  <div
                    key={i.id}
                    className="flex justify-between text-sm font-body"
                  >
                    <span className="text-warm-600">
                      {i.name}{" "}
                      <span className="text-warm-400">×{i.quantity}</span>
                    </span>
                    <span className="font-700 text-charcoal">
                      {formatCurrency(i.price * i.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-cream-200 pt-3 flex justify-between items-center">
                  <span className="font-display font-700 text-charcoal text-lg">
                    Total
                  </span>
                  <span className="font-display text-3xl font-700 text-charcoal">
                    {formatCurrency(totalPrice())}
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-body font-700 text-charcoal mb-2">
                  Delivery Address *
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Enter your full delivery address..."
                  className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-terra-400 text-sm font-body resize-none text-charcoal placeholder-warm-300 transition-all"
                />
              </div>

              <Button
                size="lg"
                className="w-full"
                loading={isPending}
                disabled={!address.trim()}
                onClick={handleCheckout}
              >
                Place Order · {formatCurrency(totalPrice())}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
