
import { Card } from "../../components/Card";
import type { useCalculator } from "./hooks/useCalculator";

export function Results({ calc }: { calc: ReturnType<typeof useCalculator> }) {
  const { you, partner, household, fmt, mode } = calc;

  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-3">Results</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Taxable income (you)" value={fmt.euro(you.zvE)} />
        <Card label="Income tax (you)" value={fmt.euro(you.est)} />
        <Card label="Pension (RV)" value={fmt.euro(you.rvEE)} />
        <Card label="Unemployment (AV)" value={fmt.euro(you.avEE)} />
        <Card label="Health (KV)" value={fmt.euro(you.kvEE)} />
        <Card label="Care (PV)" value={fmt.euro(you.pvEE)} />
        <Card label="Net income (you)" value={fmt.euro(you.net)} highlight />
      </div>

      {mode === "married" && (
        <div className="mt-5">
          <h3 className="mb-2 font-medium">Married (splitting)</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card label="zvE partner" value={fmt.euro(partner.zvE)} />
            <Card label="zvE combined" value={fmt.euro(household.zvECombined)} />
            <Card label="Tax (split)" value={fmt.euro(household.estSplitting)} />
            <Card label="Net household" value={fmt.euro(household.net)} highlight />
          </div>
        </div>
      )}
    </div>
  );
}
