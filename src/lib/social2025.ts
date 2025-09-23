// Social2025 stores yearly ceilings and total rate
// We always take the *employee* half (e.g., rv/2, av/2, kvBase/2),
// and add an employee PV rate that depends on number of children.
export const SOCIAL_2025 = {
    bbgKVYear: 66150,  // KV/PV contribution ceiling
    bbgRVYear: 96600,  // RV/AV contribution ceiling
    rv: 0.186,         // statutory pension total → employee ~ 0.093
    av: 0.026,         // unemployment total → employee ~ 0.013
    kvBase: 0.146,     // public health base → employee ~ 0.073
    pvEmployeeSharesByKids: {
      0: 0.024,  // childless (>=23): higher
      1: 0.018,
      2: 0.0155,
      3: 0.013,
      4: 0.0105,
      5: 0.008,  // 5+ children: lower
    } as Record<number, number>,
  };
  
  // pvRateForKids(k): clamp k to [0..5] and return the employee PV share to apply
  export function pvRateForKids(kids: number) {
    const k = Math.max(0, Math.min(5, Math.floor(kids)));
    return SOCIAL_2025.pvEmployeeSharesByKids[k];
  }