// ⛔ remove this static import
// import { exportDetailedReport } from "../../lib/exportpdf";

import React, { useState } from "react";
import { Brand } from "../../components/Brand";
import { Inputs } from "./Inputs";
import { Results } from "./Results";
import { NetChart } from "./NetChart";
import { useCalculator } from "./hooks/useCalculator";

export function Calculator() {
  const calc = useCalculator();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      // ✅ dynamic import so the UI can render even if PDF deps hiccup
      const { exportDetailedReport } = await import("../../lib/exportpdf");
      await exportDetailedReport({
        mode: calc.mode,
        grossAnnual: calc.grossAnnual,
        partnerGrossAnnual: calc.partnerGrossAnnual,
        healthPublic: calc.healthPublic,
        kvZusatz: calc.kvZusatz,
        pkvAnnual: calc.pkvAnnual,
        pkvDeductible: calc.pkvDeductible,
        kids: calc.kids,
        you: calc.you,
        partner: calc.partner,
        household: calc.household,
        euro: calc.fmt.euro,
      });
    } catch (e) {
      console.error(e);
      alert("Report export failed. See console for details.");
    } finally {
      setExporting(false);
    }
  };

  // const handleExport = async () => {
  //   if (exporting) return;
  //   setExporting(true);
  //   try {
  //     const { exportSmokePdf } = await import("../../lib/exportpdf"); // path/case must match the file exactly
  //     exportSmokePdf(); // <-- smoke test
  //   } catch (e) {
  //     console.error(e);
  //     alert("Smoke test failed. See console.");
  //   } finally {
  //     setExporting(false);
  //   }
  // };

  return (
    <div id="calculator-root" className="container-max py-6">
      <header className="mb-6 flex items-center justify-between">
        <Brand subtitle="UI scaffold (now with logic)" />
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-60"
        >
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Inputs calc={calc} />
        <Results calc={calc} />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium mb-3">Net income vs Gross income</h2>
        <NetChart data={calc.chartData} />
      </section>

      <p className="mt-6 text-xs text-slate-500">
        <strong>Disclaimer:</strong> This is a simplified educational calculator; not tax advice.
      </p>
    </div>
  );
}
