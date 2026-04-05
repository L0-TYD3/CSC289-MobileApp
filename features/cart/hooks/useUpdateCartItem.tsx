import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type UpdateItemQuantityRequest } from '../types';
import { cartQueryKeys } from './shared';

/** Updates the quantity of an item in the cart. Invalidates cart cache on success. */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { cartId: number; dto: UpdateItemQuantityRequest }) => {
      const { data, error } = await apiClient.PATCH('/api/cart/items/{cartId}', {
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
      appToast.success('Item quantity updated!');
    },
  });
};
