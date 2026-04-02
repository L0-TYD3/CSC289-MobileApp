import { ValueOf } from '@/types/ValueOf';

export const MembershipLevel = {
  REGULAR: 'REGULAR',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
  DIAMOND: 'DIAMOND',
} as const;

export type MembershipLevel = ValueOf<typeof MembershipLevel>;
