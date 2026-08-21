import React from "react";

export interface RibbonBannerProps {
  text: string;
  icon?: React.ReactNode;
  color?: "gold" | "blue" | "red" | "emerald";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RibbonBanner: React.FC<RibbonBannerProps> = ({
  text,
  icon,
  color = "gold",
  size = "md",
  className = "",
}) => {
  const colorStyles = {
    gold: {
      bg: "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600",
      border: "border-amber-200",
      text: "text-slate-950 font-black",
      tails: "bg-gradient-to-b from-amber-700 to-amber-950 border-amber-300",
      shadow: "shadow-[0_4px_14px_rgba(245,158,11,0.5)]",
    },
    blue: {
      bg: "bg-gradient-to-r from-blue-700 via-sky-400 to-blue-700",
      border: "border-sky-200",
      text: "text-white font-black",
      tails: "bg-gradient-to-b from-blue-800 to-indigo-950 border-sky-300",
      shadow: "shadow-[0_4px_14px_rgba(14,165,233,0.5)]",
    },
    red: {
      bg: "bg-gradient-to-r from-rose-700 via-red-500 to-rose-700",
      border: "border-rose-200",
      text: "text-white font-black",
      tails: "bg-gradient-to-b from-rose-800 to-red-950 border-rose-300",
      shadow: "shadow-[0_4px_14px_rgba(225,29,72,0.5)]",
    },
    emerald: {
      bg: "bg-gradient-to-r from-emerald-700 via-teal-400 to-emerald-700",
      border: "border-emerald-200",
      text: "text-white font-black",
      tails: "bg-gradient-to-b from-emerald-800 to-teal-950 border-emerald-300",
      shadow: "shadow-[0_4px_14px_rgba(16,185,129,0.5)]",
    },
  }[color];

  const sizeStyles = {
    sm: {
      plaque: "px-3.5 sm:px-5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs",
      tailWidth: "w-3 sm:w-4 h-4 sm:h-5",
      tailOffset: "-left-2.5 sm:-left-3.5 -right-2.5 sm:-right-3.5 top-0.5 sm:top-1",
    },
    md: {
      plaque: "px-5 sm:px-8 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm",
      tailWidth: "w-4 sm:w-5 h-5 sm:h-6",
      tailOffset: "-left-3 sm:-left-4 -right-3 sm:-right-4 top-1",
    },
    lg: {
      plaque: "px-7 sm:px-10 py-1.5 sm:py-2 rounded-xl text-sm sm:text-base",
      tailWidth: "w-5 sm:w-6 h-6 sm:h-8",
      tailOffset: "-left-4 sm:-left-5 -right-4 sm:-right-5 top-1.5",
    },
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Left Ribbon Tail with 3D Fold & Skew Angle */}
      <div
        className={`absolute -left-3 sm:-left-4 top-1 sm:top-1.5 w-4 sm:w-5 h-5 sm:h-6 ${colorStyles.tails} border-y-2 border-l-2 rounded-l-sm transform -skew-y-6 shadow-md`}
      />
      {/* Right Ribbon Tail with 3D Fold & Skew Angle */}
      <div
        className={`absolute -right-3 sm:-right-4 top-1 sm:top-1.5 w-4 sm:w-5 h-5 sm:h-6 ${colorStyles.tails} border-y-2 border-r-2 rounded-r-sm transform skew-y-6 shadow-md`}
      />

      {/* Central Curved Ribbon Plaque */}
      <div
        className={`relative z-10 ${sizeStyles.plaque} border-2 ${colorStyles.border} ${colorStyles.bg} ${colorStyles.shadow} flex items-center justify-center gap-1.5 sm:gap-2`}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span
          className={`tracking-[0.18em] uppercase ${colorStyles.text} drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] whitespace-nowrap leading-tight`}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
