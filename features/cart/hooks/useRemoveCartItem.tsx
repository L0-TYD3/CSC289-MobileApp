import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RemoveItemFromCartRequest } from '../types';
import { cartQueryKeys } from './shared';

/** Removes a single item from the cart by product ID. Invalidates cart cache on success. */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { cartId: number; dto: RemoveItemFromCartRequest }) => {
      const { data, error } = await apiClient.DELETE('/api/cart/items/{cartId}', {
        params: { path: { cartId: payload.cartId } },
        body: payload.dto,
      });
      if (error) throw error;
      return data;
    },
    onError: (error) => {
      appToast.error(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.cart,
      });
      await queryClient.invalidateQueries({
        queryKey: cartQueryKeys.qty(),
      });
      appToast.success('Item removed from cart!');
    },
  });
};
