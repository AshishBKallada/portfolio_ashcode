"use client";

import { useClock } from "@/lib/useClock";
import { CONTACT_STATS, LOCATION } from "@/lib/constants";

export default function StatsGrid() {
  const time = useClock("Asia/Kolkata", 15_000);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink/15 border-y border-ink/15">
      {CONTACT_STATS.map(({ label, value }) => (
        <div key={label} className="bg-paper px-5 py-5 md:py-6">
          <p className="font-body text-[9px] uppercase tracking-[0.32em] text-ink/45 mb-2">
            {label}
          </p>
          <p className="font-headline italic tracking-[-0.01em] text-lg md:text-2xl text-ink">
            {value}
          </p>
        </div>
      ))}
      <div className="bg-paper px-5 py-5 md:py-6">
        <p className="font-body text-[9px] uppercase tracking-[0.32em] text-ink/45 mb-2">
          Local time
        </p>
        <p className="font-headline italic tracking-[-0.01em] text-lg md:text-2xl text-ink tabular-nums">
          {time || "—:—"}
          <span className="ml-1 font-body text-[10px] uppercase tracking-[0.28em] text-ink/45 align-middle">
            {LOCATION.timezone}
          </span>
        </p>
      </div>
    </div>
  );
}
