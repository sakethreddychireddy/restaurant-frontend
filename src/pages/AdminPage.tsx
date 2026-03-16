import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { MenuItemForm } from "@/components/features/admin/MenuItemForm";
import {
  useAllMenu,
  useDisableMenuItem,
  useDeleteMenuItem,
  useUpdateMenuItem,
} from "@/hooks/useMenu";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { formatCurrency, formatDate, formatOrderId } from "@/utils/format";
import type { MenuItem, OrderStatus } from "@/types";

const STATUSES: OrderStatus[] = [
  "Confirmed",
  "Preparing",
  "Delivered",
  "Cancelled",
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-cream-200 text-warm-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-olive-100 text-olive-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export const AdminPage = () => {
  const [tab, setTab] = useState<"menu" | "orders">("menu");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const { data: menuItems = [], isLoading: menuLoading } = useAllMenu();
  const { data: orders = [], isLoading: ordersLoading } = useAllOrders();
  const { mutate: disableItem } = useDisableMenuItem();
  const { mutate: deleteItem } = useDeleteMenuItem();
  const { mutate: updateItem } = useUpdateMenuItem();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const handleEdit = (item: MenuItem) => {
    setEditItem(item);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setEditItem(null);
  };

  const handleToggle = (item: MenuItem) => {
    if (item.isAvailable) {
      disableItem(item.id);
    } else {
      updateItem({ id: item.id, data: { isAvailable: true } });
    }
  };

  const handleDelete = (item: MenuItem) => {
    if (window.confirm(`Delete "${item.name}"?`)) deleteItem(item.id);
  };

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div>
            <h1 className="font-display text-4xl font-700 text-charcoal">
              Admin Dashboard
            </h1>
            <p className="text-warm-400 font-body mt-1">
              Manage your restaurant
            </p>
          </div>
          {tab === "menu" && (
            <Button
              onClick={() => {
                setEditItem(null);
                setShowForm(true);
              }}
            >
              + Add Item
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Items",
              value: menuItems.length,
              emoji: "🍽️",
              color: "bg-cream-100",
            },
            {
              label: "Available",
              value: menuItems.filter((i) => i.isAvailable).length,
              emoji: "✅",
              color: "bg-olive-50",
            },
            {
              label: "Total Orders",
              value: orders.length,
              emoji: "📋",
              color: "bg-blue-50",
            },
            {
              label: "Pending",
              value: orders.filter((o) => o.status === "Pending").length,
              emoji: "⏳",
              color: "bg-terra-50",
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`${stat.color} rounded-3xl p-5 border border-cream-200 shadow-warm-sm animate-fade-up`}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationFillMode: "both",
              }}
            >
              <p className="text-2xl mb-2">{stat.emoji}</p>
              <p className="font-display text-3xl font-700 text-charcoal">
                {stat.value}
              </p>
              <p className="text-sm text-warm-400 font-body">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-cream-100 p-1.5 rounded-2xl w-fit">
          {(["menu", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-xl font-body font-700 capitalize transition-all duration-200
                ${
                  tab === t
                    ? "bg-white text-charcoal shadow-warm-sm"
                    : "text-warm-500 hover:text-charcoal"
                }`}
            >
              {t === "menu" ? "🍽️ Menu Items" : "📋 Orders"}
            </button>
          ))}
        </div>

        {/* Menu Tab */}
        {tab === "menu" &&
          (menuLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56" />
              ))}
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">🍽️</p>
              <h3 className="font-display text-2xl font-700 text-charcoal mb-2">
                No menu items yet
              </h3>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                + Add First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item, i) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl p-5 border shadow-warm-sm transition-all animate-fade-up
                    ${item.isAvailable ? "border-cream-200" : "border-red-100 opacity-70"}`}
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{item.imageUrl}</span>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {item.badge && item.badge !== "none" && (
                        <Badge label={item.badge} variant="warning" />
                      )}
                      <Badge
                        label={
                          item.isAvailable ? "✅ Available" : "❌ Disabled"
                        }
                        variant={item.isAvailable ? "success" : "danger"}
                      />
                    </div>
                  </div>
                  <h3 className="font-display font-700 text-charcoal text-xl mb-0.5">
                    {item.name}
                  </h3>
                  <p className="text-xs text-warm-400 font-body mb-1">
                    {item.category}
                  </p>
                  <p className="text-sm text-warm-500 font-body line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  {item.isVegetarian && (
                    <span className="inline-flex items-center gap-1 text-xs text-olive-600 font-body font-700 mb-3">
                      <span className="w-4 h-4 bg-olive-500 rounded-full flex items-center justify-center text-white text-xs">
                        V
                      </span>
                      Vegetarian
                    </span>
                  )}
                  <p className="font-display text-2xl font-700 text-terra-500 mb-4">
                    {formatCurrency(item.price)}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="py-2 px-3 text-xs font-body font-700 bg-cream-100 hover:bg-cream-200 text-charcoal rounded-xl transition-colors"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleToggle(item)}
                      className="py-2 px-3 text-xs font-body font-700 bg-cream-100 hover:bg-cream-200 text-charcoal rounded-xl transition-colors"
                    >
                      {item.isAvailable ? "🚫 Disable" : "✅ Enable"}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="py-2 px-3 text-xs font-body font-700 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* Orders Tab */}
        {tab === "orders" &&
          (ordersLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">📋</p>
              <h3 className="font-display text-2xl font-700 text-charcoal mb-2">
                No orders yet
              </h3>
              <p className="text-warm-400 font-body">
                Customer orders will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-cream-200 p-5 shadow-warm-sm hover:shadow-warm-md transition-shadow animate-fade-up"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-mono text-xs text-warm-400">
                        {formatOrderId(order.id)}
                      </p>
                      <p className="text-sm text-warm-500 font-body mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm text-warm-600 font-body mt-1">
                        📍 {order.deliveryAddress}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-body font-700 ${STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </span>
                      <p className="font-display text-2xl font-700 text-charcoal">
                        {formatCurrency(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-4 pb-4 border-b border-cream-100">
                    {order.items.map((item, j) => (
                      <div
                        key={j}
                        className="flex justify-between text-sm font-body"
                      >
                        <span className="text-warm-600">
                          {item.menuItemName}{" "}
                          <span className="text-warm-400">
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="font-700 text-charcoal">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-body font-700 text-warm-400 mb-2">
                      UPDATE STATUS
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus({ id: order.id, status })}
                          disabled={order.status === status}
                          className={`px-3 py-1.5 rounded-xl text-xs font-body font-700 transition-all border
                            ${
                              order.status === status
                                ? "bg-cream-100 text-warm-300 border-cream-100 cursor-not-allowed"
                                : "bg-white text-warm-600 border-cream-200 hover:bg-terra-50 hover:text-terra-600 hover:border-terra-200"
                            }`}
                        >
                          → {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editItem ? `Edit — ${editItem.name}` : "Add Menu Item"}
      >
        <MenuItemForm onClose={handleCloseForm} editItem={editItem} />
      </Modal>
    </div>
  );
};
