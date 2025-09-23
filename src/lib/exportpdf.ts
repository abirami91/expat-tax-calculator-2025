import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";         // ✅ default import only at runtime
import type { RowInput } from "jspdf-autotable"; // ✅ type-only import (erased at runtime)
import html2canvas from "html2canvas";


export type CalcSnapshot = {
  mode: "single" | "married";
  grossAnnual: number;
  partnerGrossAnnual: number;
  healthPublic: boolean;
  kvZusatz: number;
  pkvAnnual: number;
  pkvDeductible: number;
  kids: number;
  you: {
    zvE: number; est: number; net: number;
    rvEE: number; avEE: number; kvEE: number; pvEE: number; socialEE: number;
  };
  partner: { zvE: number; rvEE: number; avEE: number; social: number };
  household: { zvECombined: number; estSplitting: number; net: number };
  euro: (n: number) => string;
};

export function exportSmokePdf() {
    const pdf = new jsPDF();
    pdf.text("Hello from jsPDF!", 10, 10);
    pdf.save("smoke.pdf");
  }

export async function exportDetailedReport(calc: CalcSnapshot) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // Header
  pdf.setFontSize(16);
  pdf.text("Expat Tax Calculator — Report", 14, 16);
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

  // Small logo (optional)
  try {
    const img = new Image();
    img.src = "/logo.png";
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 48; c.height = 48;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 48, 48);
    pdf.addImage(c.toDataURL("image/png"), "PNG", pageW - 26, 10, 12, 12);
  } catch {}

  // Inputs table
  autoTable(pdf, {
    startY: 30,
    head: [["Input", "Value"]],
    body: [
      ["Mode", calc.mode === "single" ? "Single" : "Married (splitting)"],
      ["Gross (you)", calc.euro(calc.grossAnnual)],
      ...(calc.mode === "married" ? [["Gross (partner)", calc.euro(calc.partnerGrossAnnual)]] : []),
      ["Public health insurance", calc.healthPublic ? "Yes" : "No (private)"],
      ["Zusatz (you, %)", `${calc.kvZusatz}%`],
      ...(!calc.healthPublic ? [
        ["Private premium (you)", calc.euro(calc.pkvAnnual)],
        ["PKV deductible (you)", calc.euro(calc.pkvDeductible)],
      ] : []),
      ["Children", String(calc.kids)],
    ] as RowInput[],
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 10, cellPadding: 2 },
  });

  // You
  autoTable(pdf, {
    startY: (pdf as any).lastAutoTable.finalY + 6,
    head: [["You", "Amount"]],
    body: [
      ["Taxable income (zvE)", calc.euro(calc.you.zvE)],
      ["Income tax (ESt)", calc.euro(calc.you.est)],
      ["Pension (RV, employee)", calc.euro(calc.you.rvEE)],
      ["Unemployment (AV, employee)", calc.euro(calc.you.avEE)],
      ...(calc.healthPublic ? [
        ["Health (KV, employee)", calc.euro(calc.you.kvEE)],
        ["Care (PV, employee)", calc.euro(calc.you.pvEE)],
      ] : []),
      ["Total social (employee)", calc.euro(calc.you.socialEE)],
      ["Net income (you)", calc.euro(calc.you.net)],
    ],
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 2 },
  });

  // Partner & household (if married)
  if (calc.mode === "married") {
    autoTable(pdf, {
      startY: (pdf as any).lastAutoTable.finalY + 6,
      head: [["Partner (simplified public RV/AV)", "Amount"]],
      body: [
        ["Taxable income (zvE)", calc.euro(calc.partner.zvE)],
        ["Pension (RV, employee)", calc.euro(calc.partner.rvEE)],
        ["Unemployment (AV, employee)", calc.euro(calc.partner.avEE)],
        ["Total social (employee)", calc.euro(calc.partner.social)],
      ],
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 2 },
    });

    autoTable(pdf, {
      startY: (pdf as any).lastAutoTable.finalY + 6,
      head: [["Household (splitting)", "Amount"]],
      body: [
        ["Combined zvE", calc.euro(calc.household.zvECombined)],
        ["Tax (splitting)", calc.euro(calc.household.estSplitting)],
        ["Net household", calc.euro(calc.household.net)],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
    });
  }

  // Page 2: Chart snapshot
  pdf.addPage();
  pdf.setFontSize(13);
  pdf.text("Net income vs Gross income", 14, 16);
  const chartEl = document.getElementById("net-chart");
  if (chartEl) {
    const scale = Math.max(2, Math.min(3, window.devicePixelRatio || 2));
    const canvas = await html2canvas(chartEl, { scale, backgroundColor: "#111827" });
    const img = canvas.toDataURL("image/png");
    const maxW = pageW - 28;
    const ratio = maxW / canvas.width;
    pdf.addImage(img, "PNG", 14, 24, maxW, canvas.height * ratio, undefined, "FAST");
  } else {
    pdf.setFontSize(10);
    pdf.text("Chart not available.", 14, 24);
  }

  // Page 3: Notes
  pdf.addPage();
  pdf.setFontSize(12);
  pdf.text("Assumptions & Notes", 14, 16);
  pdf.setFontSize(10);
  [
    "2025 tariff zones (Grundtarif) with floor rounding.",
    "Employee shares and annual ceilings (BBG) for social contributions.",
    "Public insurance: KV + PV applied on your side. Partner modeled with RV/AV only (simplified).",
    "Private insurance: full premium reduces net; only deductible share reduces zvE.",
    "No Solidaritätszuschlag or church tax included.",
    "Educational tool only; not tax advice.",
  ].forEach((n, i) => pdf.text(`• ${n}`, 14, 24 + i * 6));

  pdf.setFontSize(8);
  pdf.text("Disclaimer: Educational only. No tax advice.", 14, pageH - 10);
  pdf.save("tax-report.pdf");
}
