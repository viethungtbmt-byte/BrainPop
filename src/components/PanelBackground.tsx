import React from "react";

interface PanelBackgroundProps {
  /** Optional theme accent line at the top, default is gold/amber gradient */
  accentLine?: string;
  /** Optional subtle top lighting glow gradient, default is cyan/indigo */
  lightGlowColor?: string;
  /** Whether to show the top gold/amber accent bar */
  showTopBar?: boolean;
  className?: string;
}

export const PanelBackground: React.FC<PanelBackgroundProps> = ({
  accentLine = "from-amber-400 via-amber-300 to-amber-500",
  lightGlowColor = "from-cyan-400/12 via-indigo-500/6 to-transparent",
  showTopBar = true,
  className = "",
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden rounded-inherit z-0 ${className}`}
    >
      {/* 1. Top Gentle Lighting / Soft Sheen Layer */}
      <div
        className={`absolute inset-x-0 top-0 h-36 bg-gradient-to-b ${lightGlowColor} pointer-events-none z-0`}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-cyan-400/8 blur-2xl rounded-full pointer-events-none z-0" />

      {/* 2. Soft Ambient Radial Glow Blobs for Depth */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 3. Subtle Square Grid Background Texture Overlay */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none z-0"
      >
        <defs>
          <pattern
            id="panel-square-grid-texture"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#panel-square-grid-texture)" />
      </svg>

      {/* 4. Top Accent Bar (Gold / Amber / Accent) */}
      {showTopBar && (
        <div
          className={`absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r ${accentLine} z-20 shadow-[0_1px_8px_rgba(245,158,11,0.5)]`}
        />
      )}
    </div>
  );
};
