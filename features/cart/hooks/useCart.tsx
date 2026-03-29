import { apiClient } from "@/lib/apiClient";
import { unwrapResponse } from "@/lib/unwrapResponse";
import { useQuery } from "@tanstack/react-query";
import { cartQueryKeys } from "./shared";

/** Fetches the current user's shopping cart. */
export const useCart = () => {
  return useQuery({
    queryKey: cartQueryKeys.cart,
    queryFn: async () => apiClient.GET("/api/cart").then(unwrapResponse),
  });
};
