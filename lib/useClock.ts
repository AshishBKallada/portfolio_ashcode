"use client";

import { useEffect, useState } from "react";

export function useClock(
  timeZone = "Asia/Kolkata",
  intervalMs = 30_000
) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [timeZone, intervalMs]);
  return time;
}
