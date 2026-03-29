import { apiClient } from "@/lib/apiClient";
import { unwrapResponse } from "@/lib/unwrapResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQueryKeys } from "./shared";

/** Removes a single item from the cart by product ID. Invalidates cart cache on success. */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) =>
      apiClient
        .DELETE("/api/cart/items/{productId}", {
          params: { path: { productId } },
        })
        .then(unwrapResponse),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
    },
  });
};
