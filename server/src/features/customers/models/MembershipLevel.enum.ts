export const MembershipLevel = {
  REGULAR: 'REGULAR',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
  DIAMOND: 'DIAMOND',
} as const;

export type MembershipLevel =
  (typeof MembershipLevel)[keyof typeof MembershipLevel];
