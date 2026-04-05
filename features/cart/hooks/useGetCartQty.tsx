import { apiClient } from '@/lib/apiClient';
import { unwrapResponse } from '@/lib/unwrapResponse';
import { QueryOptions } from '@/types/QueryOptions';
import { useQuery } from '@tanstack/react-query';
import { GetCartQtyResponse } from '../types';
import { cartQueryKeys } from './shared';

export const useGetCartQty = (options?: QueryOptions<GetCartQtyResponse | null>) =>
  useQuery({
    queryKey: cartQueryKeys.qty(),
    queryFn: () => apiClient.GET('/api/cart/qty').then(unwrapResponse).then((data) => data ?? null),
    ...options,
  });
