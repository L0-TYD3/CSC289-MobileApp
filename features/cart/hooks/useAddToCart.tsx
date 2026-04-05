import { apiClient } from '@/lib/apiClient';
import { appToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AddItemToCartRequest } from '../types';
import { cartQueryKeys } from './shared';

/** Adds a product to the current user's cart. Invalidates cart cache on success. */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddItemToCartRequest) => {
      const { data, error } = await apiClient.POST('/api/cart/add', {
        body: payload,
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
      appToast.success('Added!');
    },
  });
};
