/** Government tax + service charge, shown as one line on every quote. */
export const TAX_RATE = 0.12;

export function quote(unitPrice: number, units: number) {
  const subtotal = unitPrice * units;
  const taxes = Math.round(subtotal * TAX_RATE);
  return { subtotal, taxes, total: subtotal + taxes };
}

/** Rough per-person, per-night land cost for the journey planner. */
export const STYLE_RATES = {
  Easygoing: { perNight: 120, label: "Guesthouses & eco lodges" },
  Boutique: { perNight: 240, label: "Design hotels & villas" },
  Indulgent: { perNight: 450, label: "The finest suites, private guides" },
} as const;
export type TravelStyle = keyof typeof STYLE_RATES;
