import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The mark is the object in the hero, flattened: one arrow, pointing down. */
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
          background: "#05060a",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 120 160">
          <path d="M44 6h32v78h30L60 154 14 84h30z" fill="#ff2e1f" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
