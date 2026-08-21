import React from "react";
import { RibbonBanner } from "./RibbonBanner";
import { X } from "lucide-react";

export interface RoyalPanelFrameProps {
  /** Optional title to show in the 3D Ribbon Banner at the top */
  title?: string;
  /** Optional icon in the ribbon */
  ribbonIcon?: React.ReactNode;
  /** Ribbon color style */
  ribbonColor?: "gold" | "blue" | "red" | "emerald";
  /** Ribbon size */
  ribbonSize?: "sm" | "md" | "lg";
  /** Optional close callback */
  onClose?: () => void;
  /** Close button label/title */
  closeTitle?: string;
  /** Whether to show a crown above the ribbon (default: false for Menu/Shop) */
  showCrown?: boolean;
  /** Optional custom header element (if not using the default ribbon) */
  customHeader?: React.ReactNode;
  /** Main panel content */
  children: React.ReactNode;
  /** Outer container extra class */
  className?: string;
  /** Content container extra class */
  contentClassName?: string;
  /** Symmetrical side diamond jewels visibility (default: true) */
  showSideJewels?: boolean;
}

export const RoyalPanelFrame: React.FC<RoyalPanelFrameProps> = ({
  title,
  ribbonIcon,
  ribbonColor = "gold",
  ribbonSize = "md",
  onClose,
  closeTitle = "Close",
  showCrown = false,
  customHeader,
  children,
  className = "",
  contentClassName = "",
  showSideJewels = true,
}) => {
  return (
    <div
      className={`relative w-full h-full flex flex-col min-h-0 select-none ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. TOP CREST & 3D FLOWING RIBBON BANNER */}
      {(title || customHeader || showCrown) && (
        <div className="relative z-30 flex flex-col items-center -mb-3 sm:-mb-4 pointer-events-none shrink-0">
          {/* Optional Crown */}
          {showCrown && (
            <div className="relative flex items-center justify-center -mb-1 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
              <svg
                className="w-10 h-7 sm:w-12 sm:h-8"
                viewBox="0 0 48 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="goldCrownGradRoyal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fff2a3" />
                    <stop offset="40%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <linearGradient id="gemGradRoyal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#9f1239" />
                  </linearGradient>
                </defs>
                <path
                  d="M4 28L8 10L18 20L24 4L30 20L40 10L44 28H4Z"
                  fill="url(#goldCrownGradRoyal)"
                  stroke="#ffe680"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="8" cy="10" r="2.5" fill="#fff" stroke="#f59e0b" strokeWidth="1" />
                <circle cx="24" cy="4" r="3" fill="#fff" stroke="#f59e0b" strokeWidth="1.2" />
                <circle cx="40" cy="10" r="2.5" fill="#fff" stroke="#f59e0b" strokeWidth="1" />
                <polygon
                  points="24,14 27,20 24,26 21,20"
                  fill="url(#gemGradRoyal)"
                  stroke="#ffe680"
                  strokeWidth="1"
                />
                <rect x="5" y="24" width="38" height="4" rx="1" fill="#78350f" />
                <circle cx="12" cy="26" r="1" fill="#38bdf8" />
                <circle cx="24" cy="26" r="1.2" fill="#f43f5e" />
                <circle cx="36" cy="26" r="1" fill="#38bdf8" />
              </svg>
            </div>
          )}

          {/* 3D Flowing Ribbon */}
          {title ? (
            <RibbonBanner
              text={title}
              icon={ribbonIcon}
              color={ribbonColor}
              size={ribbonSize}
              className="max-w-[92%] sm:max-w-[85%]"
            />
          ) : (
            customHeader
          )}
        </div>
      )}

      {/* 2. GENTLE BLUE BEVELED OUTER FRAME SHELL */}
      <div className="relative flex-1 w-full h-full min-h-0 rounded-3xl p-1.5 sm:p-2.5 bg-gradient-to-b from-[#7dd3fc] via-[#0284c7] to-[#075985] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(56,189,248,0.22)] border border-[#bae6fd]/60 flex flex-col">
        {/* Inner Secondary Bevel Ring */}
        <div className="relative flex-1 w-full h-full min-h-0 rounded-[22px] p-1 sm:p-1.5 bg-gradient-to-b from-[#082f49] via-[#031d2e] to-[#0c4a6e] border border-[#0284c7]/70 flex flex-col">
          
          {/* Symmetrical Heraldic Side Diamond Jewels with Ruby Red Gems */}
          {showSideJewels && (
            <>
              <div className="absolute -left-2.5 sm:-left-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rotate-45 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-amber-200 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.6)] flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-red-300 via-rose-500 to-red-700 rounded-xs shadow-[0_0_4px_rgba(244,63,94,0.8)]" />
                </div>
              </div>

              <div className="absolute -right-2.5 sm:-right-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rotate-45 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-2 border-amber-200 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.6)] flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-br from-red-300 via-rose-500 to-red-700 rounded-xs shadow-[0_0_4px_rgba(244,63,94,0.8)]" />
                </div>
              </div>
            </>
          )}

          {/* 3. VELVET ROYAL CORE CONTENT CONTAINER */}
          <div className={`relative z-10 flex-1 w-full h-full min-h-0 rounded-[18px] bg-gradient-to-b from-[#18112d] via-[#0f0a1d] to-[#090613] border border-sky-400/30 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8),0_0_15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden ${contentClassName}`}>
            
            {/* Subtle background ambient radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />

            {/* Corner Ornamental Filigree Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-sky-400/60 rounded-tl-sm pointer-events-none z-20" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-sky-400/60 rounded-tr-sm pointer-events-none z-20" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-sky-400/60 rounded-bl-sm pointer-events-none z-20" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-sky-400/60 rounded-br-sm pointer-events-none z-20" />

            {/* Optional Top-Right Close Button (e.g. for Shop / Modals) */}
            {onClose && (
              <button
                type="button"
                id="btn-close-royal-panel"
                onClick={onClose}
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-[#1e1436] hover:bg-[#301c56] border-2 border-sky-400/80 text-sky-200 hover:text-white transition-all z-50 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.5),0_0_8px_rgba(56,189,248,0.3)] active:scale-95 touch-manipulation pointer-events-auto"
                aria-label={closeTitle}
                title={closeTitle}
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </button>
            )}

            {/* Main Content Area */}
            <div className="relative z-10 w-full h-full flex flex-col min-h-0">
              {children}
            </div>

            {/* Bottom Symmetrical Blue/Gold Accent Line */}
            <div className="relative z-10 my-1 sm:my-1.5 flex items-center justify-center pointer-events-none shrink-0">
              <div className="w-16 sm:w-24 h-0.5 sm:h-1 rounded-full bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
