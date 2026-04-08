export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://petzify.co";

export const DISCOUNT_TIERS: Record<number, number> = {
  2: 0.15,
  3: 0.20,
  4: 0.25,
};

export function getDiscount(itemCount: number): number {
  if (itemCount >= 4) return DISCOUNT_TIERS[4];
  return DISCOUNT_TIERS[itemCount] ?? 0;
}

export const DELIVERY_DAYS = { min: 10, max: 17 };
export const PRODUCTION_DAYS = { min: 3, max: 5 };
