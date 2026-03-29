import { apiClient } from "@/lib/apiClient";
import { unwrapResponse } from "@/lib/unwrapResponse";
import { useQuery } from "@tanstack/react-query";
import { orderQueryKeys } from "./shared";

/** Fetches the current user's order history. */
export const useOrders = () => {
  return useQuery({
    queryKey: orderQueryKeys.orders,
    queryFn: async () => apiClient.GET("/api/orders").then(unwrapResponse),
  });
};
