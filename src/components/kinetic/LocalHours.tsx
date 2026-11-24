"use client";

import { useEffect, useState } from "react";
import { contact, person } from "@/data/portfolio";

const IST_OFFSET = 330; // minutes ahead of UTC

/** A time of day in IST, as minutes past midnight, shown in `zone` (or IST when null). */
function format(istMinutes: number, zone: string | null) {
  const now = new Date();
  const utc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    istMinutes - IST_OFFSET,
  );
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: zone ?? person.timeZone,
  }).format(utc);
}

function istNow() {
  const now = new Date();
  const minutes =
    (now.getUTCHours() * 60 + now.getUTCMinutes() + IST_OFFSET) % 1440;
  const dayShift =
    now.getUTCHours() * 60 + now.getUTCMinutes() + IST_OFFSET >= 1440 ? 1 : 0;
  const day = (now.getUTCDay() + dayShift) % 7; // 0 is Sunday
  return { minutes, day };
}

function status() {
  const { minutes, day } = istNow();
  const today =
    day === 0 ? null : day === 6 ? contact.hours[1] : contact.hours[0];
  const clock = format(minutes, null);
  if (today && minutes >= today.from * 60 && minutes < today.to * 60) {
    return `It's ${clock} in Kerala. Ashish is at his desk, so expect a reply today.`;
  }
  return `It's ${clock} in Kerala. Ashish is offline; he replies from 10:00 IST on the next working day.`;
}

// The working hours, shown in the visitor's own time zone once the page knows it.
export function LocalHours() {
  const [zone, setZone] = useState<string | null>(null);
  const [inIst, setInIst] = useState(false);
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    // Read after hydration: the server cannot know the visitor's zone or clock.
    const tick = () => setNow(status());
    const first = window.setTimeout(() => {
      const visitor = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (visitor && visitor !== person.timeZone && visitor !== "Asia/Calcutta")
        setZone(visitor);
      tick();
    }, 0);
    const id = window.setInterval(tick, 30_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  const shown = zone && !inIst ? zone : null;
  const label = shown
    ? `In your time, ${shown.replace(/_/g, " ").split("/").pop()}`
    : "In IST, Kerala time";

  return (
    <div className="kx-hours">
      <div className="kx-hours__head">
        <span aria-live="polite">{label}</span>
        {zone && (
          <button
            type="button"
            className="kx-hours__toggle"
            onClick={() => setInIst((v) => !v)}
          >
            {inIst ? "Show my time" : "Show IST"}
          </button>
        )}
      </div>
      {contact.hours.map((row) => (
        <div key={row.days} className="kx-hours__row">
          <span>{row.days}</span>
          <span>
            {format(row.from * 60, shown)} to {format(row.to * 60, shown)}
          </span>
        </div>
      ))}
      <div className="kx-hours__row">
        <span>{contact.closed}</span>
        <span>Closed</span>
      </div>
      {now && <p className="kx-hours__now">{now}</p>}
    </div>
  );
}
