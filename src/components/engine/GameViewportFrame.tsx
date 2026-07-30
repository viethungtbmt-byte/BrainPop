import React from "react";

export interface GameViewportFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Optional theme override for frame accents */
  variant?: "cyan" | "indigo" | "amber";
  /** Optional title or badge text displayed on top center of the frame */
  title?: string;
  /** Whether to show glowing corner accents */
  showCornerGlow?: boolean;
}

export const GameViewportFrame: React.FC<GameViewportFrameProps> = ({
  children,
  className = "",
  variant = "cyan",
  title,
  showCornerGlow = true,
}) => {
  // Theme styling configurations
  const themeStyles = {
    cyan: {
      borderGlow: "shadow-[0_0_24px_rgba(14,165,233,0.4)]",
      borderColor: "border-cyan-400",
      gradientFrom: "from-cyan-400 via-sky-500 to-indigo-500",
      cornerColor: "text-cyan-400",
      cornerFill: "#0369a1", // Deep rich sky/ocean blue, darker than cyan-400
      cornerGlow: "drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]",
      topTicks: "bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]",
      topTicksDim: "bg-indigo-500/50",
      pulseColor: "bg-cyan-300 shadow-[0_0_8px_#38bdf8]",
      sideBracket: "from-cyan-400 via-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]",
      outerGlowRing: "ring-1 ring-cyan-400/60",
    },
    indigo: {
      borderGlow: "shadow-[0_0_24px_rgba(99,102,241,0.4)]",
      borderColor: "border-indigo-400",
      gradientFrom: "from-indigo-400 via-purple-500 to-pink-500",
      cornerColor: "text-indigo-400",
      cornerFill: "#3730a3", // Deep rich indigo blue
      cornerGlow: "drop-shadow-[0_0_8px_rgba(129,140,248,0.9)]",
      topTicks: "bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.8)]",
      topTicksDim: "bg-purple-500/50",
      pulseColor: "bg-indigo-300 shadow-[0_0_8px_#818cf8]",
      sideBracket: "from-indigo-400 via-purple-500 to-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.7)]",
      outerGlowRing: "ring-1 ring-indigo-400/60",
    },
    amber: {
      borderGlow: "shadow-[0_0_24px_rgba(245,158,11,0.4)]",
      borderColor: "border-amber-400",
      gradientFrom: "from-amber-400 via-amber-500 to-orange-500",
      cornerColor: "text-amber-400",
      cornerFill: "#92400e", // Deep rich dark amber/bronze
      cornerGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]",
      topTicks: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]",
      topTicksDim: "bg-orange-500/50",
      pulseColor: "bg-amber-300 shadow-[0_0_8px_#fbbf24]",
      sideBracket: "from-amber-400 via-orange-500 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]",
      outerGlowRing: "ring-1 ring-amber-400/60",
    },
  }[variant];

  return (
    <div
      className={`game-viewport-frame relative w-full h-full flex flex-col min-h-0 ${themeStyles.borderGlow} transition-all duration-300 ${className}`}
    >
      {/* 1. SOLID SEALED OUTULATION FRAME - Completely covers all 4 outer corners */}
      <div
        className={`absolute inset-0 pointer-events-none z-0 rounded-none bg-slate-950/95 border-2 ${themeStyles.borderColor} ${themeStyles.outerGlowRing} transition-all duration-300`}
      >
        {/* Hairline Inner Accent Frame */}
        <div className="absolute inset-1 border border-white/10 pointer-events-none rounded-none" />

        {/* Subtle Background Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${themeStyles.gradientFrom} opacity-10 pointer-events-none`} />
      </div>

      {/* 2. OVERLAY STRUCTURAL SCI-FI ACCENTS (Pointer-events-none) */}
      <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
        
        {/* CORNER TECH GUARDS (Filled 90-degree outer corners) */}
        {/* Top-Left Corner Guard */}
        <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none flex items-start justify-start">
          <svg
            className={`w-12 h-12 ${themeStyles.cornerColor} ${themeStyles.cornerGlow}`}
            viewBox="0 0 48 48"
            fill="none"
          >
            <polygon points="0,0 24,0 0,24" fill={themeStyles.cornerFill} />
            <path
              d="M 0 0 L 48 0 L 48 6 L 26 6 L 6 26 L 6 48 L 0 48 Z"
              fill="currentColor"
              fillOpacity="0.95"
            />
          </svg>
        </div>

        {/* Top-Right Corner Guard */}
        <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none flex items-start justify-end">
          <svg
            className={`w-12 h-12 ${themeStyles.cornerColor} ${themeStyles.cornerGlow}`}
            viewBox="0 0 48 48"
            fill="none"
          >
            <polygon points="48,0 24,0 48,24" fill={themeStyles.cornerFill} />
            <path
              d="M 48 0 L 0 0 L 0 6 L 22 6 L 42 26 L 42 48 L 48 48 Z"
              fill="currentColor"
              fillOpacity="0.95"
            />
          </svg>
        </div>

        {/* Bottom-Left Corner Guard */}
        <div className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none flex items-end justify-start">
          <svg
            className={`w-12 h-12 ${themeStyles.cornerColor} ${themeStyles.cornerGlow}`}
            viewBox="0 0 48 48"
            fill="none"
          >
            <polygon points="0,48 24,48 0,24" fill={themeStyles.cornerFill} />
            <path
              d="M 0 48 L 48 48 L 48 42 L 26 42 L 6 22 L 6 0 L 0 0 Z"
              fill="currentColor"
              fillOpacity="0.95"
            />
          </svg>
        </div>

        {/* Bottom-Right Corner Guard */}
        <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none flex items-end justify-end">
          <svg
            className={`w-12 h-12 ${themeStyles.cornerColor} ${themeStyles.cornerGlow}`}
            viewBox="0 0 48 48"
            fill="none"
          >
            <polygon points="48,48 24,48 48,24" fill={themeStyles.cornerFill} />
            <path
              d="M 48 48 L 0 48 L 0 42 L 22 42 L 42 22 L 42 0 L 48 0 Z"
              fill="currentColor"
              fillOpacity="0.95"
            />
          </svg>
        </div>

        {/* TOP CENTER SCI-FI VENT / TICK MARKS ARRAY */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3.5 sm:h-4 flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-5 bg-slate-950 border-b border-x border-cyan-500/60 rounded-b-xl shadow-[0_4px_12px_rgba(0,0,0,0.8)] z-40">
          {[...Array(14)].map((_, i) => (
            <div
              key={`tick-${i}`}
              className={`w-0.5 sm:w-1 h-1.5 sm:h-2 rounded-full ${
                i % 2 === 0 ? themeStyles.topTicks : themeStyles.topTicksDim
              }`}
            />
          ))}
          {title && (
            <span className="ml-1 sm:ml-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-cyan-300 via-indigo-200 to-amber-300 bg-clip-text text-transparent px-1 drop-shadow-sm leading-none">
              {title}
            </span>
          )}
        </div>

        {/* LEFT & RIGHT SIDE SCI-FI TECH NOTCH BRACKETS */}
        <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b ${themeStyles.sideBracket} rounded-r-md`} />
        <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b ${themeStyles.sideBracket} rounded-l-md`} />

        {/* CORNER GLOW LIGHTING PULSES */}
        {showCornerGlow && (
          <>
            <div className={`absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full ${themeStyles.pulseColor} animate-pulse z-40`} />
            <div className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${themeStyles.pulseColor} animate-pulse z-40`} />
            <div className={`absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full ${themeStyles.pulseColor} animate-pulse z-40`} />
            <div className={`absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${themeStyles.pulseColor} animate-pulse z-40`} />
          </>
        )}
      </div>

      {/* 3. INNER VIEWPORT CONTENT CONTAINER */}
      <div className="game-viewport-content relative z-10 w-full h-full flex flex-col min-h-0 overflow-hidden rounded-none p-0.5 sm:p-2 pt-2.5 sm:pt-3.5">
        {children}
      </div>
    </div>
  );
};

