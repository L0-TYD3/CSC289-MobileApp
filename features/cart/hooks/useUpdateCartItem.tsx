import { apiClient } from '@/lib/apiClient';
import { handleOptimisticError, handleOptimisticUpdateGuarded } from '@/lib/optimistic-updates';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CartItem, type UpdateItemQuantityRequest } from '../types';
import { Actions, cartQueryKeys } from './shared';

/** Updates the quantity of an item in the cart. Invalidates cart cache on success. */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      cartId: number;
      original: CartItem;
      dto: UpdateItemQuantityRequest;
    }) => {
      const { data, error } = await apiClient.PATCH('/api/cart/items/{cartId}', {
        params: { path: { cartId: payload.cartId } },
        body: payload.dto,
      });
      if (error) throw error;
      return data;
    },
    onMutate: (payload) => {
      return handleOptimisticUpdateGuarded(
        queryClient,
        cartQueryKeys.cart,
        Actions.update({
          ...payload.original,
          inventoryId: payload.dto.inventoryId,
          quantity: payload.dto.quantity,
        }),
      );
    },
    onError: (error, _, ctx) => {
      handleOptimisticError(queryClient, ctx?.prevData);
      appToast.error(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.qty(),
      });
      appToast.success('Item quantity updated!');
    },
  });
};
