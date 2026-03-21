export const PaymentMethod = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  PAYPAL: 'PAYPAL',
  GOOGLE_PAY: 'GOOGLE_PAY',
  APPLE_PAY: 'APPLE_PAY',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
