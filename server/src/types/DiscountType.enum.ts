export const DiscountType = {
  PERCENTAGE: 'Percentage',
  FLAT: 'Flat',
} as const;

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];
