// src/components/CareerVaultLogo.tsx
// Asset: place careervault-logo-polished.png at src/assets/careervault-logo-polished.png

import type { JSX } from "react";

interface CareerVaultLogoProps {
  /** Height/width of the square icon in px */
  iconSize?: number;
  /** Show the "CareerVault" wordmark beside the icon */
  showText?: boolean;
  /** Import path: import logo from "../assets/careervault-logo-polished.png" */
  src: string;
  className?: string;
  /** White text mode for dark backgrounds */
  dark?: boolean;
}

export default function CareerVaultLogo({
  iconSize = 36,
  showText = true,
  src,
  className = "",
  dark = false,
}: CareerVaultLogoProps): JSX.Element {
  const textSize    = Math.round(iconSize * 0.43);
  const taglineSize = Math.round(iconSize * 0.27);
  const gap         = Math.round(iconSize * 0.28);
  const radius      = Math.round(iconSize * 0.27);

  return (
    <div
      className={`flex items-center select-none ${className}`}
      style={{ gap }}
    >
      {/* ── Icon tile ── */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: radius,
          flexShrink: 0,
          overflow: "hidden",
          boxShadow: [
            "0 0 0 1.5px rgba(201,169,110,0.28)",
            "0 4px 16px rgba(15,26,46,0.20)",
          ].join(", "),
        }}
      >
        <img
          src={src}
          alt="CareerVault"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          draggable={false}
        />
      </div>

      {/* ── Wordmark ── */}
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          {/* Brand name */}
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontSize: textSize,
              letterSpacing: "0.01em",
              color: dark ? "#ffffff" : "#0F1A2E",
              lineHeight: 1.15,
              whiteSpace: "nowrap",
            }}
          >
            Career
            <span style={{ color: "#C9A96E" }}>Vault</span>
          </span>

          {/* Tagline — only renders when icon is big enough */}
          {iconSize >= 30 && (
            <span
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: taglineSize,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: dark ? "rgba(255,255,255,0.36)" : "rgba(15,26,46,0.33)",
                marginTop: 2,
                whiteSpace: "nowrap",
              }}
            >
              Career Tracker
            </span>
          )}
        </div>
      )}
    </div>
  );
}