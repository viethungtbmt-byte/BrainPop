import React from "react";
import { Crown, Sparkles, X } from "lucide-react";

export interface ResultFrameShellProps {
  title?: string;
  subtitle?: string;
  ribbonColor?: "red" | "blue" | "gold" | "emerald";
  showCrown?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const ResultFrameShell: React.FC<ResultFrameShellProps> = ({
  title,
  subtitle,
  ribbonColor = "gold",
  showCrown = true,
  onClose,
  children,
  className = "",
}) => {
  // Ribbon gradient themes based on outcome
  const ribbonGradients = {
    gold: {
      bg: "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600",
      border: "border-amber-200",
      text: "text-slate-950 font-black",
      tails: "bg-gradient-to-b from-amber-700 to-amber-900 border-amber-300",
      shadow: "shadow-[0_4px_14px_rgba(245,158,11,0.5)]",
    },
    red: {
      bg: "bg-gradient-to-r from-rose-700 via-red-500 to-rose-700",
      border: "border-amber-300",
      text: "text-white font-black",
      tails: "bg-gradient-to-b from-rose-800 to-red-950 border-amber-400",
      shadow: "shadow-[0_4px_14px_rgba(225,29,72,0.5)]",
    },
    blue: {
      bg: "bg-gradient-to-r from-blue-700 via-sky-500 to-blue-700",
      border: "border-amber-300",
      text: "text-white font-black",
      tails: "bg-gradient-to-b from-blue-800 to-indigo-950 border-amber-400",
      shadow: "shadow-[0_4px_14px_rgba(14,165,233,0.5)]",
    },
    emerald: {
      bg: "bg-gradient-to-r from-emerald-700 via-teal-500 to-emerald-700",
      border: "border-amber-300",
      text: "text-white font-black",
      tails: "bg-gradient-to-b from-emerald-800 to-teal-950 border-amber-400",
      shadow: "shadow-[0_4px_14px_rgba(16,185,129,0.5)]",
    },
  }[ribbonColor];

  return (
    <div
      className={`relative w-full max-w-[350px] sm:max-w-sm md:max-w-md landscape:max-w-2xl mx-auto transition-all duration-300 select-none flex flex-col min-h-0 max-h-[min(96dvh,600px)] landscape:max-h-[min(96dvh,400px)] ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. TOP CROWN & ARCHED CREST HEADER (Elevated above frame) */}
      <div className="relative z-30 flex flex-col items-center -mb-3 sm:-mb-4 landscape:-mb-2.5 pointer-events-none shrink-0">
        {showCrown && (
          <div className="relative flex items-center justify-center -mb-1 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
            {/* SVG 3-Point Royal Crown with Inset Gem */}
            <svg
              className="w-10 h-7 sm:w-12 sm:h-8 landscape:w-8 landscape:h-5.5"
              viewBox="0 0 48 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="goldCrownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff2a3" />
                  <stop offset="40%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="gemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#9f1239" />
                </linearGradient>
              </defs>
              {/* Crown Base and Spikes */}
              <path
                d="M4 28L8 10L18 20L24 4L30 20L40 10L44 28H4Z"
                fill="url(#goldCrownGrad)"
                stroke="#ffe680"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {/* Spheres on Tips */}
              <circle cx="8" cy="10" r="2.5" fill="#fff" stroke="#f59e0b" strokeWidth="1" />
              <circle cx="24" cy="4" r="3" fill="#fff" stroke="#f59e0b" strokeWidth="1.2" />
              <circle cx="40" cy="10" r="2.5" fill="#fff" stroke="#f59e0b" strokeWidth="1" />
              <polygon
                points="24,14 27,20 24,26 21,20"
                fill="url(#gemGrad)"
                stroke="#ffe680"
                strokeWidth="1"
              />
              {/* Base Rim with Jeweled Accents */}
              <rect x="5" y="24" width="38" height="4" rx="1" fill="#78350f" />
              <circle cx="12" cy="26" r="1" fill="#38bdf8" />
              <circle cx="24" cy="26" r="1.2" fill="#f43f5e" />
              <circle cx="36" cy="26" r="1" fill="#38bdf8" />
            </svg>
          </div>
        )}

        {/* 3D Flowing Ribbon / Banner */}
        {title && (
          <div className="relative flex items-center justify-center max-w-[92%] sm:max-w-[85%]">
            {/* Left Ribbon Tail */}
            <div
              className={`absolute -left-3 sm:-left-4 top-1 sm:top-1.5 w-4 sm:w-5 h-6 sm:h-7 ${ribbonGradients.tails} border-y-2 border-l-2 rounded-l-sm transform -skew-y-6 shadow-md pointer-events-none`}
            />
            {/* Right Ribbon Tail */}
            <div
              className={`absolute -right-3 sm:-right-4 top-1 sm:top-1.5 w-4 sm:w-5 h-6 sm:h-7 ${ribbonGradients.tails} border-y-2 border-r-2 rounded-r-sm transform skew-y-6 shadow-md pointer-events-none`}
            />

            {/* Central Curved Ribbon Plaque */}
            <div
              className={`relative z-10 px-5 sm:px-8 landscape:px-5 py-1 sm:py-1.5 landscape:py-0.5 rounded-lg border-2 ${ribbonGradients.border} ${ribbonGradients.bg} ${ribbonGradients.shadow} flex items-center justify-center`}
            >
              <h2
                className={`text-xs sm:text-sm md:text-base landscape:text-xs tracking-[0.18em] uppercase ${ribbonGradients.text} drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] whitespace-nowrap`}
              >
                {title}
              </h2>
            </div>
          </div>
        )}
      </div>

      {/* 2. GOLDEN BEVELED OUTER FRAME SHELL */}
      <div className="relative flex-1 w-full min-h-0 rounded-3xl p-1.5 sm:p-2.5 landscape:p-1.5 bg-gradient-to-b from-[#ffe785] via-[#cf991c] to-[#734304] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.25)] border border-[#fff2a8]/60 flex flex-col overflow-hidden">
        {/* Inner Secondary Bevel Ring */}
        <div className="relative flex-1 w-full min-h-0 rounded-[22px] p-1 sm:p-1.5 landscape:p-1 bg-gradient-to-b from-[#4d2d02] via-[#211200] to-[#593402] border border-[#a16c09]/80 flex flex-col overflow-hidden">
          
          {/* Symmetrical Heraldic Side Diamond Gems with Blue Sapphire Stones */}
          <div className="absolute -left-2.5 sm:-left-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rotate-45 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-amber-200 rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.6)] flex items-center justify-center">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-cyan-300 to-blue-600 rounded-xs shadow-[0_0_4px_rgba(14,165,233,0.8)]" />
            </div>
          </div>

          <div className="absolute -right-2.5 sm:-right-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rotate-45 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-amber-200 rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.6)] flex items-center justify-center">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-cyan-300 to-blue-600 rounded-xs shadow-[0_0_4px_rgba(14,165,233,0.8)]" />
            </div>
          </div>

          {/* 3. VELVET ROYAL CORE CONTENT CONTAINER */}
          <div className="relative z-10 flex-1 w-full min-h-0 rounded-[18px] bg-gradient-to-b from-[#18112d] via-[#0f0a1d] to-[#090613] border border-amber-400/30 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8),0_0_15px_rgba(0,0,0,0.5)] p-3 sm:p-5 pt-4 sm:pt-5.5 landscape:p-2 landscape:pt-2.5 flex flex-col items-center justify-start overflow-hidden">
            
            {/* Subtle background radial ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),transparent_70%)] pointer-events-none" />

            {/* Corner Ornamental Filigree Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400/60 rounded-tl-sm pointer-events-none z-20" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400/60 rounded-tr-sm pointer-events-none z-20" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400/60 rounded-bl-sm pointer-events-none z-20" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400/60 rounded-br-sm pointer-events-none z-20" />

            {/* Top-Right Jeweled Close Button */}
            {onClose && (
              <button
                type="button"
                id="btn-close-result-frame"
                onClick={onClose}
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 landscape:top-1.5 landscape:right-1.5 p-1.5 sm:p-2 landscape:p-1 rounded-full bg-[#1e1436] hover:bg-[#301c56] border-2 border-amber-400/80 text-amber-200 hover:text-white transition-all z-50 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.5),0_0_8px_rgba(245,158,11,0.3)] active:scale-95 touch-manipulation pointer-events-auto"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
            )}

            {/* Inner Content Body with internal scrolling support */}
            <div className="relative z-10 w-full flex-1 min-h-0 flex flex-col items-center overflow-y-auto custom-scrollbar">
              {children}
            </div>

            {/* Bottom Symmetrical Gold Accent Notch */}
            <div className="relative z-10 mt-1.5 sm:mt-2.5 landscape:mt-1 flex items-center justify-center pointer-events-none shrink-0">
              <div className="w-16 sm:w-24 h-0.5 sm:h-1 rounded-full bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
