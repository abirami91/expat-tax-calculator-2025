// Tarrif breakpoints and coefficients for 2025 tax year(simplified)
//  - We implement the official peicewise definitions
//  - Up to Grundfreibetrag : 0 tax
//  - Zone 2 and 3: quadratic polynomials in y/z
//  - Zone 4: 42% linear minus constant
//  - Zone 5: 45% linear minus constant
export const TARIFF_2025 = {
    grundfreibetrag: 12096,
    zone2End: 17443,
    zone3End: 68480,
    zone4End: 277825,
    yA: 979.18,
    yB: 1400,
    zA: 192.59,
    zB: 2397,
    addC: 1025.38,
    zone4A: 0.42,
    zone4B: 10042.54,
    zone5A: 0.45,
    zone5B: 18383.74
};

// Incometax (zve): returns annual income tax in EUR(rounded down to full EUR)
// incomeTax2025(zvE): returns annual income tax in EUR (rounded down)
export function incomeTax2025(zvE: number) {
    const t = TARIFF_2025;
    const x = Math.floor(Math.max(0, zvE)); // zvE must be an integer >= 0
  
    if (x <= t.grundfreibetrag) return 0;
  
    // Zone 2: polynomial in y = (x - Grundfreibetrag)/10k
    if (x <= t.zone2End) {
      const y = (x - t.grundfreibetrag) / 10000;
      return Math.floor((t.yA * y + t.yB) * y);
    }
  
    // Zone 3: polynomial in z = (x - zone2End)/10k plus constant
    if (x <= t.zone3End) {
      const z = (x - t.zone2End) / 10000;
      return Math.floor((t.zA * z + t.zB) * z + t.addC);
    }
  
    // Zone 4/5: linear with different slopes/offsets
    if (x <= t.zone4End) return Math.floor(t.zone4A * x - t.zone4B);
    return Math.floor(t.zone5A * x - t.zone5B);
  }
  
  // splittingTax2025(total zvE): Ehegattensplitting = 2 * tax(zvE/2)
  export function splittingTax2025(zvEcombined: number) {
    return 2 * incomeTax2025(zvEcombined / 2);
  }
  