"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] bg-white transition-opacity duration-1000"
      style={{ opacity: hidden ? 0 : 1, pointerEvents: hidden ? "none" : "auto" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin" />
        <p className="text-black font-body text-xs uppercase tracking-widest opacity-50 animate-pulse">
          ashcode / booting
        </p>
      </div>
    </div>
  );
}
