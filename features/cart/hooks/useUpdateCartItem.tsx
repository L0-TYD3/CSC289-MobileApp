import { apiClient } from "@/lib/apiClient";
import { unwrapResponse } from "@/lib/unwrapResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateItemQuantityRequest } from "../types";
import { cartQueryKeys } from "./shared";

/** Updates the quantity of an item in the cart. Invalidates cart cache on success. */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateItemQuantityRequest) =>
      apiClient
        .PATCH("/api/cart/items/{productId}", {
          body: payload,
        })
        .then(unwrapResponse),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
    },
  });
};
