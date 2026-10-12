"use client";

import { useEffect, useState } from "react";

/** Ticking local time for a fixed timezone; a stable placeholder on the server. */
export function LiveClock({
  timeZone,
  className = "",
}: {
  timeZone: string;
  className?: string;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const text = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : "--:--:--";

  return <time className={`tabular-nums ${className}`}>{text}</time>;
}
