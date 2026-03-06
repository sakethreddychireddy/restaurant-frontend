import { useParams, useNavigate, Link } from "react-router-dom";
import { useOrder, useCancelOrder } from "@/hooks/useOrders";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency, formatDate, formatOrderId } from "@/utils/format";
import type { OrderStatus } from "@/types";

const STATUS_VARIANT: Record<
  OrderStatus,
  "warning" | "info" | "default" | "success" | "danger"
> = {
  Pending: "warning",
  Confirmed: "info",
  Preparing: "default",
  Delivered: "success",
  Cancelled: "danger",
};

const STATUS_EMOJI: Record<OrderStatus, string> = {
  Pending: "⏳",
  Confirmed: "✅",
  Preparing: "👨‍🍳",
  Delivered: "🎉",
  Cancelled: "❌",
};

const STATUS_MESSAGE: Record<OrderStatus, string> = {
  Pending: "Your order is waiting for confirmation",
  Confirmed: "Your order has been confirmed",
  Preparing: "Your order is being prepared in the kitchen",
  Delivered: "Your order has been delivered. Enjoy!",
  Cancelled: "This order was cancelled",
};

const STEPS: OrderStatus[] = ["Pending", "Confirmed", "Preparing", "Delivered"];

const getStepIndex = (status: OrderStatus) => STEPS.indexOf(status);

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id ?? "");
  const { mutate: cancel, isPending: cancelling } = useCancelOrder();

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      cancel(id!, { onSuccess: () => navigate("/orders") });
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-stone-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">❌</p>
          <h2 className="text-xl font-bold text-stone-700 mb-2">
            Order not found
          </h2>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );

  const stepIndex = getStepIndex(order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-6 group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-4 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-mono text-sm font-bold text-stone-400">
                {formatOrderId(order.id)}
              </p>
              <h1 className="text-2xl font-black font-display text-stone-800 mt-1">
                Order Details
              </h1>
              <p className="text-sm text-stone-400 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge
              label={`${STATUS_EMOJI[order.status]} ${order.status}`}
              variant={STATUS_VARIANT[order.status]}
            />
          </div>
          <p className="text-sm text-stone-500 bg-stone-50 rounded-xl px-4 py-3">
            📍 {order.deliveryAddress}
          </p>
        </div>

        {/* Progress Tracker */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-4 shadow-sm">
            <h2 className="font-bold text-stone-800 mb-6">Order Progress</h2>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-stone-100" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-brand-500 transition-all duration-500"
                style={{
                  width:
                    stepIndex > 0
                      ? `${(stepIndex / (STEPS.length - 1)) * 100}%`
                      : "0%",
                }}
              />
              {/* Steps */}
              <div className="relative flex justify-between">
                {STEPS.map((step, i) => {
                  const isCompleted = i < stepIndex;
                  const isCurrent = i === stepIndex;
                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                        ${
                          isCompleted
                            ? "bg-brand-500 text-white"
                            : isCurrent
                              ? "bg-brand-500 text-white ring-4 ring-brand-100"
                              : "bg-stone-100 text-stone-400"
                        }`}
                      >
                        {isCompleted ? "✓" : STATUS_EMOJI[step]}
                      </div>
                      <span
                        className={`text-xs font-semibold text-center
                        ${isCurrent ? "text-brand-600" : isCompleted ? "text-stone-600" : "text-stone-400"}`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-center text-sm text-stone-500 mt-6 bg-stone-50 rounded-xl py-3 px-4">
              {STATUS_MESSAGE[order.status]}
            </p>
          </div>
        )}

        {/* Cancelled Banner */}
        {isCancelled && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 text-center">
            <p className="text-red-500 font-semibold">
              ❌ {STATUS_MESSAGE[order.status]}
            </p>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-4 shadow-sm">
          <h2 className="font-bold text-stone-800 mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0"
              >
                <div>
                  <p className="font-semibold text-stone-800">
                    {item.menuItemName}
                  </p>
                  <p className="text-sm text-stone-400">
                    {formatCurrency(item.unitPrice)} each × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-stone-800">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-100">
            <span className="font-bold text-stone-800 text-lg">Total</span>
            <span className="text-3xl font-black text-stone-800">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </div>

        {/* Order Meta */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-stone-800 mb-4">Order Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">
                Order ID
              </p>
              <p className="font-mono text-sm text-stone-700">
                {formatOrderId(order.id)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">
                Status
              </p>
              <p className="text-sm font-semibold text-stone-700">
                {order.status}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">
                Placed At
              </p>
              <p className="text-sm text-stone-700">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide mb-1">
                Last Updated
              </p>
              <p className="text-sm text-stone-700">
                {formatDate(order.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/orders" className="flex-1">
            <Button variant="secondary" className="w-full">
              Back to Orders
            </Button>
          </Link>
          {order.status === "Pending" && (
            <Button
              variant="danger"
              className="flex-1"
              loading={cancelling}
              onClick={handleCancel}
            >
              Cancel Order
            </Button>
          )}
          {order.status === "Delivered" && (
            <Link to="/menu" className="flex-1">
              <Button className="w-full">Order Again 🍽️</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
