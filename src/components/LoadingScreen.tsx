import React, { useEffect, useState, useRef } from "react";
import { Brain, Sparkles, Zap } from "lucide-react";
import { AssetPreloader, PreloadProgressState, TOTAL_ESTIMATED_BYTES } from "../utils/preloader";
import gameLogo from "../assets/images/emoji_brainpop_thumb_1784707895737.jpg";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  // Target state emitted by AssetPreloader
  const [targetState, setTargetState] = useState<PreloadProgressState>({
    percentage: 0,
    loadedBytes: 0,
    totalBytes: TOTAL_ESTIMATED_BYTES,
    currentTaskName: "Connecting to Emoji Brainpop...",
    isComplete: false,
  });

  // Smooth lerped progress state for 60fps animations
  const [lerpedPercentage, setLerpedPercentage] = useState<number>(0);
  const [lerpedBytes, setLerpedBytes] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const requestRef = useRef<number | null>(null);
  const targetStateRef = useRef<PreloadProgressState>(targetState);
  targetStateRef.current = targetState;

  // Start preloader on mount
  useEffect(() => {
    const preloader = new AssetPreloader((state) => {
      setTargetState(state);
    });

    preloader.startPreload();

    // Lerp loop for silky-smooth progress updates
    const animate = () => {
      setLerpedPercentage((prevPct) => {
        const targetPct = targetStateRef.current.percentage;
        const diff = targetPct - prevPct;

        // Smooth ease-out lerp step
        if (Math.abs(diff) < 0.1) {
          return targetPct;
        }
        return prevPct + diff * 0.12;
      });

      setLerpedBytes((prevBytes) => {
        const targetBytes = targetStateRef.current.loadedBytes;
        const diff = targetBytes - prevBytes;
        if (Math.abs(diff) < 1000) {
          return targetBytes;
        }
        return prevBytes + diff * 0.12;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // When lerped percentage reaches ~100% and preloader is complete, trigger fade out
  useEffect(() => {
    if (targetState.isComplete && lerpedPercentage >= 99.5 && !isFadingOut) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setIsDone(true);
        onLoadingComplete();
      }, 550); // 550ms CSS fade-out duration
      return () => clearTimeout(timer);
    }
  }, [targetState.isComplete, lerpedPercentage, isFadingOut, onLoadingComplete]);

  if (isDone) {
    return null;
  }

  const formattedLoadedMB = (lerpedBytes / (1024 * 1024)).toFixed(1);
  const formattedTotalMB = (targetState.totalBytes / (1024 * 1024)).toFixed(1);
  const displayPct = Math.min(100, Math.round(lerpedPercentage));

  return (
    <div
      id="loading-screen-container"
      className={`fixed inset-0 z-[150] flex flex-col items-center justify-between p-3 sm:p-8 landscape:py-2 landscape:px-4 select-none overflow-hidden bg-slate-950 text-slate-100 transition-all duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* GLOWING AMBIENT BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep cyan & indigo radial glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/15 to-pink-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[100px]" />

        {/* Subtle SVG Grid Watermark */}
        <svg width="100%" height="100%" className="w-full h-full opacity-[0.03] grayscale">
          <defs>
            <pattern
              id="loading-pattern"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-20)"
            >
              <text x="20" y="30" fontSize="18" fill="#ffffff">🧠</text>
              <text x="80" y="30" fontSize="18" fill="#ffffff">⚡</text>
              <text x="50" y="90" fontSize="18" fill="#ffffff">💡</text>
              <text x="100" y="90" fontSize="18" fill="#ffffff">⭐</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loading-pattern)" />
        </svg>
      </div>

      {/* TOP HEADER BRANDING */}
      <div className="relative z-10 flex items-center gap-2 pt-1 sm:pt-4 landscape:pt-0.5">
        <span className="flex items-center gap-1.5 px-3 py-1 landscape:px-2.5 landscape:py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] landscape:text-[10px] font-semibold text-slate-300 shadow-sm backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 landscape:w-3 landscape:h-3 text-cyan-400 animate-pulse" />
          <span>HTML5 GAME ENGINE</span>
        </span>
      </div>

      {/* CENTER LOGO & ARTWORK DISPLAY */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2 sm:py-6 landscape:py-1 text-center shrink">
        {/* LOGO ICON CONTAINER WITH GLOWING HALO */}
        <div className="relative group">
          {/* Pulsing Backlight Halo */}
          <div className="absolute inset-0 -m-3 sm:-m-4 landscape:-m-2 rounded-3xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 opacity-70 blur-xl animate-pulse" />

          {/* Glossy Icon Frame */}
          <div className="relative w-20 h-20 sm:w-36 sm:h-36 landscape:w-14 landscape:h-14 sm:landscape:w-20 sm:landscape:h-20 rounded-2xl sm:rounded-3xl landscape:rounded-xl bg-slate-900 border-2 border-slate-700/80 p-1.5 sm:p-2 landscape:p-1 shadow-2xl flex items-center justify-center overflow-hidden">
            <img
              src={gameLogo}
              alt="Emoji BrainPop Logo"
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl landscape:rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Floating Brain Badge */}
          <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 landscape:-top-1.5 landscape:-right-1.5 p-1.5 sm:p-2 landscape:p-1 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl landscape:rounded-lg text-white shadow-lg border border-cyan-300/40">
            <Brain className="w-4 h-4 sm:w-6 sm:h-6 landscape:w-3.5 landscape:h-3.5" />
          </div>
        </div>

        {/* GAME TITLE */}
        <h1 className="mt-2.5 sm:mt-6 landscape:mt-1 text-xl sm:text-4xl landscape:text-lg sm:landscape:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent drop-shadow-md">
          Emoji BrainPop
        </h1>

        {/* SUBTITLE */}
        <p className="mt-1 sm:mt-1.5 landscape:mt-0.5 text-[10px] sm:text-sm landscape:text-[10px] font-semibold tracking-wide text-cyan-300/90 uppercase">
          Smart Memory Match
        </p>
      </div>

      {/* BOTTOM PROGRESS SECTION */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg landscape:max-w-md px-2 sm:px-4 pb-2 sm:pb-6 landscape:pb-1 flex flex-col gap-2 sm:gap-2.5 landscape:gap-1.5 shrink-0">
        {/* TASK STATUS & METRIC READOUT */}
        <div className="flex items-center justify-between text-xs sm:text-sm landscape:text-[11px] font-semibold text-slate-300 px-1">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate max-w-[62%]">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 landscape:w-3 landscape:h-3 text-cyan-400 shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
            <span className="truncate text-slate-300">{targetState.currentTaskName}</span>
          </div>

          {/* SIZE & PERCENTAGE DISPLAY */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-right font-mono text-cyan-300 shrink-0">
            <span className="text-slate-400 text-[10px] sm:text-xs landscape:text-[10px]">
              {formattedLoadedMB} / {formattedTotalMB} MB
            </span>
            <span className="text-xs sm:text-sm landscape:text-xs font-bold text-cyan-400 min-w-[36px] sm:min-w-[42px] text-right">
              {displayPct}%
            </span>
          </div>
        </div>

        {/* PROGRESS BAR CONTAINER */}
        <div className="relative w-full h-3.5 sm:h-5 landscape:h-3 rounded-full bg-slate-900/90 border border-slate-700/80 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Animated Fill Bar */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 transition-all duration-75 relative overflow-hidden shadow-[0_0_16px_rgba(6,182,212,0.6)]"
            style={{ width: `${Math.max(3, displayPct)}%` }}
          >
            {/* Glossy Shimmer Light Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* ENGINE BADGES FOOTER */}
        <div className="flex items-center justify-center gap-2 pt-1.5 sm:pt-2 landscape:pt-1 text-[9px] sm:text-xs landscape:text-[9px] text-slate-400 font-mono font-medium px-1 border-t border-slate-800/60 mt-0.5 landscape:mt-0">
          <span>HTML5</span>
          <span>•</span>
          <span>WEBGL</span>
          <span>•</span>
          <span>WEB AUDIO</span>
        </div>
      </div>
    </div>
  );
};
