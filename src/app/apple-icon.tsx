import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          color: "#fafafa",
          fontSize: 120,
          fontWeight: 600,
          letterSpacing: "-0.04em",
        }}
      >
        {site.name.charAt(0)}
      </div>
    ),
    { ...size },
  );
}
