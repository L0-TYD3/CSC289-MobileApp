export const MembershipLevel = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
} as const;

export type MembershipLevel =
  (typeof MembershipLevel)[keyof typeof MembershipLevel];
