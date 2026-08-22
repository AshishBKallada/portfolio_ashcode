"use client";

import { useEffect, useState } from "react";

function format(now: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(now);
}

export function LiveClock({
  timezone,
  label,
}: {
  timezone: string;
  label: string;
}) {
  const [time, setTime] = useState(() => format(new Date(), timezone));

  useEffect(() => {
    const tick = () => setTime(format(new Date(), timezone));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timezone]);

  return (
    <span className="font-sans tabular-nums" suppressHydrationWarning>
      {time} {label}
    </span>
  );
}
