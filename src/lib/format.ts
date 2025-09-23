// cap(x, max): clamp a value to an upper bound (used for contribution ceilings)
// euro(n): format a number as German EUR with no cents (UI-friendly)
export const cap = (val: number, max: number) => Math.min(val, max);

export const euro = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
