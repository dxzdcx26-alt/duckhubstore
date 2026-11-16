export interface DailyRewardTier {
  day: number;
  balanceBonus: number;
  pointsBonus: number;
  spinBonus: number;
  badge?: string;
  highlight?: boolean;
}

export const DAILY_REWARD_TIERS: DailyRewardTier[] = [
  { day: 1, balanceBonus: 5,   pointsBonus: 10, spinBonus: 0 },
  { day: 2, balanceBonus: 10,  pointsBonus: 15, spinBonus: 0 },
  { day: 3, balanceBonus: 15,  pointsBonus: 20, spinBonus: 1, badge: '🎰 +สปิน' },
  { day: 4, balanceBonus: 20,  pointsBonus: 25, spinBonus: 0 },
  { day: 5, balanceBonus: 25,  pointsBonus: 30, spinBonus: 1, badge: '🎰 +สปิน' },
  { day: 6, balanceBonus: 30,  pointsBonus: 40, spinBonus: 0 },
  { day: 7, balanceBonus: 100, pointsBonus: 100, spinBonus: 3, badge: '🏆 แจ็คพอต', highlight: true },
];

export interface DailyRewardStatus {
  canClaim: boolean;
  nextClaimDay: number;
  nextClaimTimestamp: number;
  msRemaining: number;
  isStreakBroken: boolean;
}

export function calculateDailyRewardStatus(
  lastClaim: number | undefined,
  currentStreak: number
): DailyRewardStatus {
  const now = Date.now();
  const CLAIM_INTERVAL = 24 * 60 * 60 * 1000; // 24 ชั่วโมง
  const STREAK_EXPIRE = 48 * 60 * 60 * 1000;  // streak หมดถ้าไม่เข้า 48 ชั่วโมง

  if (!lastClaim) {
    return {
      canClaim: true,
      nextClaimDay: 1,
      nextClaimTimestamp: now,
      msRemaining: 0,
      isStreakBroken: false,
    };
  }

  const timeSinceLast = now - lastClaim;
  const canClaim = timeSinceLast >= CLAIM_INTERVAL;
  const isStreakBroken = timeSinceLast >= STREAK_EXPIRE;
  const nextClaimTimestamp = lastClaim + CLAIM_INTERVAL;
  const msRemaining = Math.max(0, nextClaimTimestamp - now);

  const nextDay = isStreakBroken ? 1 : ((currentStreak % 7) + 1);

  return {
    canClaim,
    nextClaimDay: nextDay,
    nextClaimTimestamp,
    msRemaining,
    isStreakBroken,
  };
}
