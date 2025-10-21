
import type { useCalculator } from "./hooks/useCalculator";

export function Inputs({ calc }: { calc: ReturnType<typeof useCalculator> }) {
  const c = calc;
  return (
    <div className="card">
      <h2 className="text-lg font-medium mb-3">Inputs</h2>

      <div className="mb-4">
        <label className="mr-3 font-medium">Mode</label>
        <select
          className="rounded border px-3 py-2"
          value={c.mode}
          onChange={(e) => c.setMode(e.target.value as any)}
        >
          <option value="single">Single</option>
          <option value="married">Married (split)</option>
        </select>
      </div>

      <fieldset className="border rounded p-3 space-y-3">
        <legend className="text-sm text-slate-500">You</legend>

        <label className="block text-sm font-medium">
          Gross (you): <span className="font-semibold">{c.fmt.euro(c.grossAnnual)}</span>
        </label>
        <input
          type="range" min={20000} max={200000} step={5000}
          className="w-full" value={c.grossAnnual}
          onChange={(e) => c.setGrossAnnual(parseInt(e.target.value))}
        />

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={c.healthPublic}
              onChange={(e) => c.setHealthPublic(e.target.checked)}
            />
            <span>Public health insurance</span>
          </label>
          <label className="ml-auto text-sm">Zusatz (%)</label>
          <input
            type="number" min={0} max={3.5} step={0.1}
            value={c.kvZusatz}
            onChange={(e) => c.setKvZusatz(parseFloat(e.target.value || "0"))}
            className="w-20 rounded border px-2 py-1 text-right"
            disabled={!c.healthPublic}
          />
        </div>

        {!c.healthPublic && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Private premium</label>
              <input
                type="number" min={0} step={100}
                value={c.pkvAnnual}
                onChange={(e) => c.setPkvAnnual(parseInt(e.target.value || "0"))}
                className="w-full rounded border px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Deductible part</label>
              <input
                type="number" min={0} step={100}
                value={c.pkvDeductible}
                onChange={(e) => c.setPkvDeductible(parseInt(e.target.value || "0"))}
                className="w-full rounded border px-2 py-1"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Children</label>
          <input
            type="number" min={0} max={5} value={c.kids}
            onChange={(e) => c.setKids(parseInt(e.target.value || "0"))}
            className="w-24 rounded border px-2 py-1"
            disabled={!c.healthPublic}
          />
        </div>
      </fieldset>

      {c.mode === "married" && (
        <fieldset className="border rounded p-3 space-y-3 mt-4">
          <legend className="text-sm text-slate-500">Partner</legend>
          <label className="block text-sm font-medium">
            Gross (partner): <span className="font-semibold">{c.fmt.euro(c.partnerGrossAnnual)}</span>
          </label>
          <input
            type="range" min={20000} max={200000} step={5000}
            className="w-full" value={c.partnerGrossAnnual}
            onChange={(e) => c.setPartnerGrossAnnual(parseInt(e.target.value))}
          />
        </fieldset>
      )}
    </div>
  );
}
