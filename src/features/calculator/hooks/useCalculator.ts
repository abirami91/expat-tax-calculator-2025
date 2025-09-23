// Purpose: A single react hook that:
//  - stores user inputs (mode, incomes, insurance choice, etc.)
//  - computes you (social contributions, zvE, income tax, net)
//  - computes partner (social contributions, zvE; simplified)
//  - computes household (splitting tax, net)
//  - prepares chart data (net vs gross curve for single perspective)
//  - exposes everything the UI needs

import { useMemo, useState } from "react";
import { cap, euro } from "../../../lib/format";
import { SOCIAL_2025, pvRateForKids } from "../../../lib/social2025";
import { incomeTax2025, splittingTax2025 } from "../../../lib/tax2025";

export type Mode = "single" | "married";

export function useCalculator() {
  // 1) USER INPUTS (state)
  const [mode, setMode] = useState<Mode>("single");
  const [grossAnnual, setGrossAnnual] = useState(60000);
  const [partnerGrossAnnual, setPartnerGrossAnnual] = useState(40000);
  const [healthPublic, setHealthPublic] = useState(true);
  const [kvZusatz, setKvZusatz] = useState(2.5); // public health additional % (employee half)
  const [pkvAnnual, setPkvAnnual] = useState(3600); // private insurance annual premium
  const [pkvDeductible, setPkvDeductible] = useState(2400); // tax-deductible share of private
  const [kids, setKids] = useState(0);

  // 2) YOU (derived values)
  //   - apply ceilings (KV/PV vs RV/AV)
  //   - compute employee shares for rv/av/kv/pv
  //   - subtract standard deductions
  //   - compute zvE, tax, and net (net depends on public/private branch)
  const you = useMemo(() => {
    const kvBase = cap(grossAnnual, SOCIAL_2025.bbgKVYear);
    const rvBase = cap(grossAnnual, SOCIAL_2025.bbgRVYear);

    const rvEE = rvBase * (SOCIAL_2025.rv / 2);
    const avEE = rvBase * (SOCIAL_2025.av / 2);
    const kvEE = healthPublic ? kvBase * (SOCIAL_2025.kvBase / 2 + (kvZusatz / 100) / 2) : 0;
    const pvEE = healthPublic ? kvBase * pvRateForKids(kids) : 0;
    const socialEE = rvEE + avEE + kvEE + pvEE;

    // very basic lump-sum deductions
    const werbungskosten = 1230;
    const sonderausgaben = 36 + (!healthPublic ? pkvDeductible : 0);

    const zvE = Math.max(0, grossAnnual - socialEE - werbungskosten - sonderausgaben);
    const est = incomeTax2025(zvE);

    // In public KV: contributions reduce net directly + they already reduced zvE.
    // In private KV: full premium reduces net; only the deductible part reduces zvE.
    const net = healthPublic
      ? grossAnnual - socialEE - est
      : grossAnnual - est - pkvAnnual;

    return { kvBase, rvBase, rvEE, avEE, kvEE, pvEE, socialEE, zvE, est, net };
  }, [grossAnnual, healthPublic, kvZusatz, kids, pkvAnnual, pkvDeductible]);

  // 3) PARTNER (simplified assumption: public insurance for social contributions)
  const partner = useMemo(() => {
    const rvBase = cap(partnerGrossAnnual, SOCIAL_2025.bbgRVYear);
    const rvEE = rvBase * (SOCIAL_2025.rv / 2);
    const avEE = rvBase * (SOCIAL_2025.av / 2);
    const social = rvEE + avEE; // omit kv/pv for partner in this simplified model

    const zvE = Math.max(0, partnerGrossAnnual - social - 1230 - 36);
    return { rvBase, rvEE, avEE, social, zvE };
  }, [partnerGrossAnnual]);

  // 4) HOUSEHOLD (if married: use splitting tariff; else just mirror 'you')
  const household = useMemo(() => {
    if (mode !== "married") return { zvECombined: you.zvE, estSplitting: 0, net: you.net };

    const zvECombined = you.zvE + partner.zvE;
    const estSplitting = splittingTax2025(zvECombined);

    // If you’re in public health, contributions (you + partner’s rv/av) reduce net.
    // If you’re in private, add your private premium as an extra cash out.
    const socialHousehold = (healthPublic ? you.socialEE : 0) + partner.social;
    const pkvCost = healthPublic ? 0 : pkvAnnual;

    const net = grossAnnual + partnerGrossAnnual - socialHousehold - estSplitting - pkvCost;
    return { zvECombined, estSplitting, net };
  }, [mode, you, partner, grossAnnual, partnerGrossAnnual, healthPublic, pkvAnnual]);

  // 5) CHART (net vs gross for single perspective)
  //    We simulate incomes from 20k to 200k to draw the curve.
  const chartData = useMemo(() => {
    const pts: { gross: number; net: number }[] = [];
    for (let inc = 20000; inc <= 200000; inc += 5000) {
      const kvB = cap(inc, SOCIAL_2025.bbgKVYear);
      const rvB = cap(inc, SOCIAL_2025.bbgRVYear);
      const rv = rvB * (SOCIAL_2025.rv / 2);
      const av = rvB * (SOCIAL_2025.av / 2);
      const kv = healthPublic ? kvB * (SOCIAL_2025.kvBase / 2 + (kvZusatz / 100) / 2) : 0;
      const pv = healthPublic ? kvB * pvRateForKids(kids) : 0;
      const soc = rv + av + kv + pv;
      const werb = 1230;
      const sonder = 36 + (!healthPublic ? pkvDeductible : 0);
      const zvE = Math.max(0, inc - soc - werb - sonder);
      const est = incomeTax2025(zvE);
      const net = healthPublic ? inc - soc - est : inc - est - pkvAnnual;
      pts.push({ gross: inc, net });
    }
    return pts;
  }, [healthPublic, kvZusatz, kids, pkvAnnual, pkvDeductible]);

  // 6) Expose everything the UI needs
  const fmt = { euro };

  return {
    // inputs + setters
    mode, setMode,
    grossAnnual, setGrossAnnual,
    partnerGrossAnnual, setPartnerGrossAnnual,
    healthPublic, setHealthPublic,
    kvZusatz, setKvZusatz,
    pkvAnnual, setPkvAnnual,
    pkvDeductible, setPkvDeductible,
    kids, setKids,

    // computed
    you, partner, household, chartData, fmt,
  };
}
