import { apiClient } from "@/lib/apiClient";
import { unwrapResponse } from "@/lib/unwrapResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQueryKeys } from "./shared";

/** Clears the entire cart. Invalidates cart cache on success. */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => apiClient.DELETE("/api/cart").then(unwrapResponse),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
    },
  });
};
