import { Link } from "react-router-dom";
import { OrderCard } from "@/components/features/orders/OrderCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { useMyOrders } from "@/hooks/useOrders";

export const OrdersPage = () => {
  const { data: orders = [], isLoading } = useMyOrders();

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black font-display text-stone-800">
            My Orders
          </h1>
          <Link to="/menu">
            <Button variant="secondary" size="sm">
              + New Order
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              // wrap each card in a Link to order detail
              <Link key={order.id} to={`/orders/${order.id}`}>
                <OrderCard order={order} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-8xl mb-6">📋</p>
            <h3 className="text-xl font-bold text-stone-700 mb-2">
              No orders yet
            </h3>
            <p className="text-stone-400 mb-8">
              Place your first order and it'll appear here
            </p>
            <Link to="/menu">
              <Button size="lg">Browse Menu</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
