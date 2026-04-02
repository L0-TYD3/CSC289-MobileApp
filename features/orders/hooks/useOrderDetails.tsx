import { apiClient } from "@/lib/apiClient";
import { unwrapResponse } from "@/lib/unwrapResponse";
import { useQuery } from "@tanstack/react-query";
import { orderQueryKeys } from "./shared";

/**
 * Fetches detailed information for a single order.
 * Query is disabled until a valid orderId is provided.
 * Each order is cached independently by its ID.
 */
export const useOrderDetails = (orderId: number) => {
  return useQuery({
    queryKey: orderQueryKeys.orderDetails(orderId),
    queryFn: async () =>
      apiClient
        .GET("/api/orders/{orderId}", {
          params: { path: { orderId: orderId! } },
        })
        .then(unwrapResponse),
    enabled: !!orderId,
  });
};
