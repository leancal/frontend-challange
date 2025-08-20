export type Tier = { minQty: number; discount: number }; // 0.1 = 10%

export const bestTier = (qty: number, tiers: Tier[]) =>
  tiers
    .filter((t) => qty >= t.minQty)
    .sort((a, b) => b.discount - a.discount)[0] ?? { minQty: 0, discount: 0 };

export const calcPrice = (unit: number, qty: number, tiers: Tier[]) => {
  const { discount } = bestTier(qty, tiers);
  const subtotal = unit * qty;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;
  return { subtotal, discountAmount, total, discount };
};
