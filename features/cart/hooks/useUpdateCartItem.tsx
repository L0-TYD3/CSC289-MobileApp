import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CartItem, ShoppingCart, type UpdateItemQuantityRequest } from '../types';
import { cartQueryKeys } from './shared';

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
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: cartQueryKeys.cart });
      const prevData = queryClient.getQueryData<ShoppingCart>(cartQueryKeys.cart);
      if (!prevData) return { prevData: null };

      const updatedData = {
        ...prevData,
        items: prevData.items.map((i) =>
          i.inventoryId === payload.dto.inventoryId ? { ...i, quantity: payload.dto.quantity } : i,
        ),
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
  });
};
