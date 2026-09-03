import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Satori has no WebGL, so the card carries the mark as flat vector rather
 * than a screenshot of the hero. Every element needs an explicit `display`.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#05060a",
          backgroundImage:
            "radial-gradient(60% 60% at 85% 110%, rgba(255,46,31,0.34), transparent 70%)",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#7f8ea8",
            letterSpacing: 6,
          }}
        >
          CRASH INSURANCE · SOLD AS A MEMECOIN
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 104,
                lineHeight: 1,
                color: "#e9e6e0",
                letterSpacing: -2,
              }}
            >
              GET PAID
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 104,
                lineHeight: 1.05,
                color: "#e9e6e0",
                letterSpacing: -2,
              }}
            >
              ON THE WAY
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 104,
                lineHeight: 1.05,
                color: "#ff2e1f",
                letterSpacing: -2,
              }}
            >
              DOWN.
            </div>
          </div>
          <svg width="150" height="200" viewBox="0 0 120 160">
            <path d="M44 6h32v78h30L60 154 14 84h30z" fill="#ff2e1f" />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#7f8ea8",
            letterSpacing: 4,
          }}
        >
          <div style={{ display: "flex" }}>{siteConfig.ticker}</div>
          <div style={{ display: "flex" }}>USDG ON EVERY RED DAY</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
