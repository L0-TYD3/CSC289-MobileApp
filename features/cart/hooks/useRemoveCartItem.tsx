import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RemoveItemFromCartRequest, ShoppingCart } from '../types';
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
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: cartQueryKeys.cart });
      const prevData = queryClient.getQueryData<ShoppingCart>(cartQueryKeys.cart);
      if (!prevData) return { prevData: null };

      const updatedData = {
        ...prevData,
        items: prevData.items.filter((i) => i.inventoryId !== payload.dto.inventoryId),
      };
      queryClient.setQueryData(cartQueryKeys.cart, updatedData);
      return { prevData };
    },
    onError: (error, _, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(cartQueryKeys.cart, ctx.prevData);
      }
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
