import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Taimoor Alam, Shopify Plus Developer & CRO Specialist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/images/taimoor.png"));
  const src = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#060608",
          color: "#efeee9",
          padding: 64,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -160,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(139,92,246,0.55), transparent 65%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#8b8a85" }}>SHOPIFY PLUS × CRO</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 0.9, letterSpacing: -6 }}>TAIMOOR</div>
            <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 0.9, letterSpacing: -6 }}>ALAM</div>
            <div style={{ fontSize: 34, marginTop: 24, color: "#c8ff2e" }}>Shopify Plus Developer & CRO Specialist</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {["+41% RPV", "+44% subscription share", "4+ years"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  border: "2px solid rgba(239,238,233,0.2)",
                  borderRadius: 999,
                  padding: "10px 22px",
                  fontSize: 24,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <img
          src={src}
          alt=""
          width={380}
          height={502}
          style={{ objectFit: "cover", borderRadius: "190px 190px 32px 32px", alignSelf: "center" }}
        />
      </div>
    ),
    size,
  );
}
