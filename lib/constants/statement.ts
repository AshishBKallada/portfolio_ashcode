export type StatementSegment = { text: string; className?: string };

export const STATEMENT_SEGMENTS: StatementSegment[] = [
  { text: "I am Ashish Kallada," },
  { text: "a self-taught engineer.", className: "italic" },
  { text: "I build with React, Node, and TypeScript — from the database up." },
];

export const STATEMENT_BODY =
  "Over the last few years, I have shipped production apps with small teams and solo founders — building React frontends, Node and Express APIs, and the databases behind them. The work has spanned consumer products, internal dashboards, and real-time tools used every day.";

export const STATEMENT_LABELS = {
  eyebrow: "Full-stack engineering",
  terminalTitle: "ashcode — about · 自己紹介 — zsh",
  more: "and more",
} as const;
