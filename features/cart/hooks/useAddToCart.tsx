import { apiClient } from "@/lib/apiClient";
import { unwrapResponse } from "@/lib/unwrapResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AddItemToCartRequest } from "../types";
import { cartQueryKeys } from "./shared";

/** Adds a product to the current user's cart. Invalidates cart cache on success. */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddItemToCartRequest) =>
      apiClient.POST("/api/cart/add", { body: payload }).then(unwrapResponse),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
    },
  });
};
