import React from "react";

export interface GameViewportFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Optional theme ID from Cosmetics Shop (e.g. 'theme_midnight_blue', 'theme_spring', etc.) */
  equippedThemeId?: string;
  themeId?: string;
  /** Optional legacy theme override for frame accents */
  variant?: string;
  /** Optional title or badge text displayed on top center of the frame */
  title?: string;
  /** Corner radius style for outer container: false (sharp, original game board) or true (rounded, menu panel) */
  rounded?: boolean;
}

export const GameViewportFrame: React.FC<GameViewportFrameProps> = ({
  children,
  className = "",
  equippedThemeId,
  themeId,
  variant = "cyan",
  title,
  rounded = false,
}) => {
  const activeKey = equippedThemeId || themeId || variant || "theme_midnight_blue";

  // Theme styling configurations matching equipped theme's primary color
  const themeStyles = (() => {
    switch (activeKey) {
      case "theme_spring":
        return {
          borderGlow: "shadow-[0_0_24px_rgba(236,72,153,0.45)]",
          borderColor: "border-pink-400",
          gradientFrom: "from-pink-400 via-rose-500 to-emerald-400",
          cornerColor: "text-pink-400",
          cornerFill: "#be185d",
          cornerGlow: "drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]",
          topTicks: "bg-pink-400 shadow-[0_0_6px_rgba(244,114,182,0.8)]",
          topTicksDim: "bg-emerald-500/50",
          sideBracket: "from-pink-400 via-rose-500 to-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.7)]",
          outerGlowRing: "ring-1 ring-pink-400/60",
          ventBorder: "border-pink-500/60",
          titleGradient: "from-pink-300 via-rose-200 to-emerald-300",
        };
      case "theme_summer":
        return {
          borderGlow: "shadow-[0_0_24px_rgba(245,158,11,0.45)]",
          borderColor: "border-amber-400",
          gradientFrom: "from-amber-400 via-yellow-400 to-sky-400",
          cornerColor: "text-amber-400",
          cornerFill: "#b45309",
          cornerGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]",
          topTicks: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]",
          topTicksDim: "bg-sky-500/50",
          sideBracket: "from-amber-400 via-yellow-400 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]",
          outerGlowRing: "ring-1 ring-amber-400/60",
          ventBorder: "border-amber-500/60",
          titleGradient: "from-amber-300 via-yellow-200 to-sky-300",
        };
      case "theme_autumn":
        return {
          borderGlow: "shadow-[0_0_24px_rgba(249,115,22,0.45)]",
          borderColor: "border-orange-400",
          gradientFrom: "from-orange-400 via-amber-500 to-red-500",
          cornerColor: "text-orange-400",
          cornerFill: "#c2410c",
          cornerGlow: "drop-shadow-[0_0_8px_rgba(251,146,60,0.9)]",
          topTicks: "bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.8)]",
          topTicksDim: "bg-amber-600/50",
          sideBracket: "from-orange-400 via-amber-500 to-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.7)]",
          outerGlowRing: "ring-1 ring-orange-400/60",
          ventBorder: "border-orange-500/60",
          titleGradient: "from-orange-300 via-amber-200 to-yellow-300",
        };
      case "theme_winter":
        return {
          borderGlow: "shadow-[0_0_24px_rgba(56,189,248,0.45)]",
          borderColor: "border-sky-300",
          gradientFrom: "from-sky-300 via-cyan-300 to-blue-400",
          cornerColor: "text-sky-300",
          cornerFill: "#0284c7",
          cornerGlow: "drop-shadow-[0_0_8px_rgba(125,211,252,0.9)]",
          topTicks: "bg-sky-300 shadow-[0_0_6px_rgba(125,211,252,0.8)]",
          topTicksDim: "bg-blue-400/50",
          sideBracket: "from-sky-300 via-cyan-300 to-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.7)]",
          outerGlowRing: "ring-1 ring-sky-300/60",
          ventBorder: "border-sky-400/60",
          titleGradient: "from-sky-200 via-cyan-100 to-blue-200",
        };
      case "theme_ocean":
        return {
          borderGlow: "shadow-[0_0_24px_rgba(6,182,212,0.45)]",
          borderColor: "border-cyan-400",
          gradientFrom: "from-cyan-400 via-teal-400 to-blue-600",
          cornerColor: "text-cyan-400",
          cornerFill: "#0e7490",
          cornerGlow: "drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]",
          topTicks: "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]",
          topTicksDim: "bg-teal-500/50",
          sideBracket: "from-cyan-400 via-teal-400 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]",
          outerGlowRing: "ring-1 ring-cyan-400/60",
          ventBorder: "border-cyan-500/60",
          titleGradient: "from-cyan-300 via-teal-200 to-blue-200",
        };
      case "theme_desert":
        return {
          borderGlow: "shadow-[0_0_24px_rgba(217,119,6,0.45)]",
          borderColor: "border-amber-500",
          gradientFrom: "from-amber-500 via-orange-500 to-teal-600",
          cornerColor: "text-amber-500",
          cornerFill: "#78350f",
          cornerGlow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]",
          topTicks: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]",
          topTicksDim: "bg-teal-600/50",
          sideBracket: "from-amber-500 via-orange-500 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]",
          outerGlowRing: "ring-1 ring-amber-500/60",
          ventBorder: "border-amber-500/60",
          titleGradient: "from-amber-300 via-orange-200 to-teal-300",
        };
      case "indigo":
        return {
          borderGlow: "shadow-[0_0_24px_rgba(99,102,241,0.4)]",
          borderColor: "border-indigo-400",
          gradientFrom: "from-indigo-400 via-purple-500 to-pink-500",
          cornerColor: "text-indigo-400",
          cornerFill: "#3730a3",
          cornerGlow: "drop-shadow-[0_0_8px_rgba(129,140,248,0.9)]",
          topTicks: "bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.8)]",
          topTicksDim: "bg-purple-500/50",
          sideBracket: "from-indigo-400 via-purple-500 to-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.7)]",
          outerGlowRing: "ring-1 ring-indigo-400/60",
          ventBorder: "border-indigo-500/60",
          titleGradient: "from-indigo-300 via-purple-200 to-pink-300",
        };
      case "amber":
        return {
          borderGlow: "shadow-[0_0_24px_rgba(245,158,11,0.4)]",
          borderColor: "border-amber-400",
          gradientFrom: "from-amber-400 via-amber-500 to-orange-500",
          cornerColor: "text-amber-400",
          cornerFill: "#92400e",
          cornerGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]",
          topTicks: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]",
          topTicksDim: "bg-orange-500/50",
          sideBracket: "from-amber-400 via-orange-500 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]",
          outerGlowRing: "ring-1 ring-amber-400/60",
          ventBorder: "border-amber-500/60",
          titleGradient: "from-amber-300 via-orange-200 to-yellow-300",
        };
      case "theme_midnight_blue":
      case "cyan":
      default:
        return {
          borderGlow: "shadow-[0_0_24px_rgba(14,165,233,0.4)]",
          borderColor: "border-cyan-400",
          gradientFrom: "from-cyan-400 via-sky-500 to-indigo-500",
          cornerColor: "text-cyan-400",
          cornerFill: "#0369a1",
          cornerGlow: "drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]",
          topTicks: "bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]",
          topTicksDim: "bg-indigo-500/50",
          sideBracket: "from-cyan-400 via-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.7)]",
          outerGlowRing: "ring-1 ring-cyan-400/60",
          ventBorder: "border-cyan-500/60",
          titleGradient: "from-cyan-300 via-indigo-200 to-sky-300",
        };
    }
  })();

  const roundedOuterClass = rounded ? "rounded-3xl" : "rounded-none";
  const roundedInnerClass = rounded ? "rounded-[22px]" : "rounded-none";
  const roundedContentClass = rounded ? "rounded-2xl" : "rounded-none";
  const backgroundClass = rounded
    ? "bg-gradient-to-b from-[#0f1738]/98 via-[#0b112c]/98 to-[#070c20]/98 border-2 border-indigo-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(99,102,241,0.2)]"
    : `bg-slate-950/95 border-2 ${themeStyles.borderColor} ${themeStyles.outerGlowRing}`;

  return (
    <div
      className={`game-viewport-frame relative w-full h-full flex flex-col min-h-0 ${roundedOuterClass} ${themeStyles.borderGlow} transition-all duration-300 ${className}`}
    >
      {/* 1. SOLID SEALED OUTULATION FRAME - Smooth Rounded Outer Corners */}
      <div
        className={`absolute inset-0 pointer-events-none z-0 ${roundedOuterClass} ${backgroundClass} transition-all duration-300 overflow-hidden`}
      >
        {/* Hairline Inner Accent Frame */}
        <div className={`absolute inset-1 border border-white/10 pointer-events-none ${roundedInnerClass}`} />

        {/* Subtle Background Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${themeStyles.gradientFrom} opacity-10 pointer-events-none`} />
      </div>

      {/* 2. OVERLAY STRUCTURAL SCI-FI ACCENTS (Pointer-events-none) */}
      <div className={`absolute inset-0 pointer-events-none z-30 select-none overflow-hidden ${roundedOuterClass}`}>
        
        {/* CORNER TECH ACCENTS */}
        {rounded ? (
          /* Smooth Rounded Corner Tech Glow Brackets */
          <>
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg border-cyan-400/80 pointer-events-none opacity-80" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg border-cyan-400/80 pointer-events-none opacity-80" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg border-cyan-400/80 pointer-events-none opacity-80" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg border-cyan-400/80 pointer-events-none opacity-80" />
          </>
        ) : (
          /* Filled 90-degree Corner Tech Guards for sharp mode */
          <>
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
          </>
        )}

        {/* TOP CENTER SCI-FI VENT / TICK MARKS ARRAY */}
        {title && (
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-3.5 sm:h-4 flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-5 bg-slate-950 border-b border-x ${themeStyles.ventBorder} rounded-b-xl shadow-[0_4px_12px_rgba(0,0,0,0.8)] z-40`}>
            {[...Array(14)].map((_, i) => (
              <div
                key={`tick-${i}`}
                className={`w-0.5 sm:w-1 h-1.5 sm:h-2 rounded-full ${
                  i % 2 === 0 ? themeStyles.topTicks : themeStyles.topTicksDim
                }`}
              />
            ))}
            <span className={`ml-1 sm:ml-2 text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${themeStyles.titleGradient} bg-clip-text text-transparent px-1 drop-shadow-sm leading-none`}>
              {title}
            </span>
          </div>
        )}

        {/* LEFT & RIGHT SIDE SCI-FI TECH NOTCH BRACKETS */}
        <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b ${themeStyles.sideBracket} rounded-r-md`} />
        <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b ${themeStyles.sideBracket} rounded-l-md`} />
      </div>

      {/* 3. INNER VIEWPORT CONTENT CONTAINER */}
      <div className={`game-viewport-content relative z-10 w-full h-full flex flex-col min-h-0 overflow-hidden ${roundedContentClass} ${rounded ? "p-1 sm:p-2 pt-1.5 sm:pt-2" : "p-0.5 sm:p-2 pt-2.5 sm:pt-3.5"}`}>
        {children}
      </div>
    </div>
  );
};

