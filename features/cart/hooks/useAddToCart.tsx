import { ProductDetail } from '@/features/products/types';
import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart } from '../types';
import { cartQueryKeys } from './shared';

/** Adds a product to the current user's cart. Invalidates cart cache on success. */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { product: ProductDetail; quantity: number }) => {
      const { data, error } = await apiClient.POST('/api/cart/add', {
        body: {
          productId: payload.product.productId,
          quantity: payload.quantity,
        },
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
        items: [
          ...prevData.items.filter((i) => i.product.productId !== payload.product.productId),
          ...payload.product.inventory.map((i) => ({
            inventoryId: i.inventoryId,
            quantity: payload.quantity,
            unitPrice: i.unitPrice,
            lineTotal: i.unitPrice * payload.quantity,
            product: payload.product,
          })),
        ],
      };

      console.log(JSON.stringify(updatedData, null, 2));

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
      appToast.success('Added!');
    },
  });
};
