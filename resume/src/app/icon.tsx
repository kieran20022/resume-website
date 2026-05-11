import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#548687",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "#ffffc7",
            fontSize: 17,
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: -1,
            fontFamily: "serif",
          }}
        >
          KH
        </span>
      </div>
    ),
    { ...size },
  );
}
