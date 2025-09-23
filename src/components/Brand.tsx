import React from "react";


export function Brand({ subtitle }: { subtitle?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <img src="/logo.png" alt="Expat Tax Calculator Logo" className="h-20 w-20" />
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">🇩🇪 Expat Tax Calculator</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}


/** The icon/mark only */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Logo"
      className="shrink-0 text-blue-600 dark:text-blue-400"
    >
      {/* rounded tile */}
      <rect
        x="4"
        y="6"
        width="40"
        height="32"
        rx="8"
        className="fill-current opacity-10"
      />
      {/* upward curve (income) */}
      <path
        d="M10 30 C18 18, 28 18, 38 28"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Euro dot */}
      <circle cx="18" cy="18" r="3" className="fill-current" />
      {/* tiny accent spark */}
      <path
        d="M34 12 l3 -3 M34 9 l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-70"
      />
    </svg>
  );
}
