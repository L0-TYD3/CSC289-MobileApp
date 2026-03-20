import { Order_Item } from '@generated/prisma/client';

export const calculateOrderAmount = (items: Order_Item[]): number => {
  return items.reduce(
    (acc, item) =>
      acc + item.Amount.toNumber() * item.Quantity * (1 + item.Tax.toNumber()),
    0,
  );
};
