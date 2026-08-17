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
  showTopBar = true,
  className = "",
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden rounded-inherit z-0 ${className}`}
    >
      {/* 1. Subtle Square Grid Background Texture Overlay for Flat Depth */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-0"
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

      {/* 2. Top Accent Bar (Flat 2D) */}
      {showTopBar && (
        <div
          className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${accentLine} z-20`}
        />
      )}
    </div>
  );
};
