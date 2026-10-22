"use client";

import { useSyncExternalStore } from "react";

const format = () =>
  new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
};

/** The visitor's clock, refreshed every 15 seconds. Placeholder on the server. */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, format, () => "--:--");
  return <time className="tabular-nums">{time}</time>;
}
