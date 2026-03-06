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
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-purple-100 text-purple-700",
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

  const handleToggleAvailability = (item: MenuItem) => {
    if (item.isAvailable) {
      disableItem(item.id);
    } else {
      updateItem({ id: item.id, data: { isAvailable: true } });
    }
  };

  const handleDelete = (item: MenuItem) => {
    if (window.confirm(`Delete "${item.name}"? This cannot be undone.`)) {
      deleteItem(item.id);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black font-display text-stone-800">
              Admin Dashboard
            </h1>
            <p className="text-stone-400 mt-1">Manage your restaurant</p>
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
            { label: "Total Items", value: menuItems.length, emoji: "🍽️" },
            {
              label: "Available",
              value: menuItems.filter((i) => i.isAvailable).length,
              emoji: "✅",
            },
            { label: "Total Orders", value: orders.length, emoji: "📋" },
            {
              label: "Pending",
              value: orders.filter((o) => o.status === "Pending").length,
              emoji: "⏳",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
            >
              <p className="text-2xl mb-1">{stat.emoji}</p>
              <p className="text-2xl font-black text-stone-800">{stat.value}</p>
              <p className="text-sm text-stone-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["menu", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-xl font-semibold capitalize transition-all
                ${
                  tab === t
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-200"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-brand-50"
                }`}
            >
              {t === "menu" ? "🍽️ Menu Items" : "📋 Orders"}
            </button>
          ))}
        </div>

        {/* ── Menu Tab ────────────────────────────────────────────────── */}
        {tab === "menu" &&
          (menuLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-52" />
              ))}
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">🍽️</p>
              <h3 className="text-xl font-bold text-stone-700 mb-2">
                No menu items yet
              </h3>
              <p className="text-stone-400 mb-6">
                Add your first menu item to get started
              </p>
              <Button onClick={() => setShowForm(true)}>
                + Add First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-5 border transition-all
                    ${item.isAvailable ? "border-stone-100" : "border-red-100 opacity-75"}`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{item.emoji}</span>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge label={item.badge} variant="warning" />
                      )}
                      <Badge
                        label={item.isAvailable ? "Available" : "Disabled"}
                        variant={item.isAvailable ? "success" : "danger"}
                      />
                    </div>
                  </div>

                  {/* Card Info */}
                  <h3 className="font-bold text-stone-800 mb-0.5">
                    {item.name}
                  </h3>
                  <p className="text-sm text-stone-400 capitalize mb-1">
                    {item.category}
                  </p>
                  <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  {item.isVegetarian && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold mb-3">
                      <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                        V
                      </span>
                      Vegetarian
                    </span>
                  )}
                  <p className="text-xl font-black text-brand-500 mb-4">
                    {formatCurrency(item.price)}
                  </p>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleToggleAvailability(item)}
                    >
                      {item.isAvailable ? "🚫 Disable" : "✅ Enable"}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(item)}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* ── Orders Tab ───────────────────────────────────────────────── */}
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
              <h3 className="text-xl font-bold text-stone-700 mb-2">
                No orders yet
              </h3>
              <p className="text-stone-400">
                Orders from customers will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-mono font-bold text-stone-400 text-sm">
                        {formatOrderId(order.id)}
                      </p>
                      <p className="text-sm text-stone-500 mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm text-stone-600 mt-1">
                        📍 {order.deliveryAddress}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </span>
                      <p className="text-xl font-black text-stone-800">
                        {formatCurrency(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-1 mb-4 pb-4 border-b border-stone-50">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-stone-600">
                          {item.menuItemName}{" "}
                          <span className="text-stone-400">
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="font-medium text-stone-800">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Status Actions */}
                  <div>
                    <p className="text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">
                      Update Status
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus({ id: order.id, status })}
                          disabled={order.status === status}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border
                            ${
                              order.status === status
                                ? "bg-stone-100 text-stone-400 border-stone-100 cursor-not-allowed"
                                : "bg-white text-stone-600 border-stone-200 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200"
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

      {/* Add / Edit Modal */}
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
