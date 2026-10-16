import { ImageResponse } from "next/og";
import { site } from "@/data/site";

// Social card for every page that doesn't set its own: the wordmark and
// tagline in cream on the brand oxblood. Rendered once at build time.
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#6b1414",
          color: "#f4f1ea",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", opacity: 0.75 }}>
          {site.role}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 160, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ marginTop: 28, fontSize: 40, maxWidth: 900, lineHeight: 1.25 }}>
            {site.tagline}
          </div>
        </div>
        <div style={{ height: 6, width: 160, background: "#e63a26" }} />
      </div>
    ),
    size,
  );
}
