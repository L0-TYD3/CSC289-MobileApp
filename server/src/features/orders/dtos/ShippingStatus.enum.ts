import { ValueOf } from '@/types/ValueOf';

export const ShippingStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type ShippingStatus = ValueOf<typeof ShippingStatus>;
