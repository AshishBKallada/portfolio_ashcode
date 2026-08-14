import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          borderRadius: 6,
        }}
      >
        {site.name.charAt(0)}
      </div>
    ),
    { ...size },
  );
}
