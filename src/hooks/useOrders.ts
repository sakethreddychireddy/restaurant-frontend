import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { orderService } from "@/services/orderService";
import { useCartStore } from "@/store/cartStore";
import type { CreateOrderRequest, OrderStatus } from "@/types";

export const ORDER_KEYS = {
  mine: ["orders", "mine"] as const,
  all: ["orders", "all"] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export const useMyOrders = () =>
  useQuery({
    queryKey: ORDER_KEYS.mine,
    queryFn: orderService.getMyOrders,
    staleTime: 1000 * 30,
  });

export const useAllOrders = () =>
  useQuery({
    queryKey: ORDER_KEYS.all,
    queryFn: orderService.getAll,
    staleTime: 1000 * 30,
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: () => orderService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });

export const usePlaceOrder = () => {
  const qc = useQueryClient();
  const { clearCart } = useCartStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.create(data),
    onSuccess: () => {
      clearCart();
      qc.invalidateQueries({ queryKey: ORDER_KEYS.mine });
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    },
    onError: (err: string) => toast.error(err || "Failed to place order"),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.all });
      toast.success("Order status updated!");
    },
    onError: (err: string) => toast.error(err || "Failed to update status"),
  });
};

export const useCancelOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.cancel(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.mine });
      qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(id) });
      toast.success("Order cancelled");
    },
    onError: (err: string) => toast.error(err || "Cannot cancel this order"),
  });
};
