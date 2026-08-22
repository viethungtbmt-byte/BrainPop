import React, { useEffect, useState, useRef } from "react";
import { Brain, Sparkles, Zap, Trophy, Star, Lightbulb, Target } from "lucide-react";
import { AssetPreloader, PreloadProgressState, TOTAL_ESTIMATED_BYTES } from "../utils/preloader";
import gameLogo from "../assets/images/emoji_brainpop_thumb_1784707895737.jpg";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

// Lightweight decorative vector watermarks for maximum mobile performance and 0% GPU strain
const DECORATIVE_WATERMARKS = [
  { icon: Brain, top: "8%", left: "6%", size: "w-10 h-10 sm:w-14 sm:h-14", rotate: "-12deg" },
  { icon: Zap, top: "26%", left: "14%", size: "w-8 h-8 sm:w-12 sm:h-12", rotate: "15deg" },
  { icon: Lightbulb, top: "10%", right: "8%", size: "w-10 h-10 sm:w-14 sm:h-14", rotate: "12deg" },
  { icon: Star, top: "28%", right: "16%", size: "w-8 h-8 sm:w-12 sm:h-12", rotate: "-15deg" },
  { icon: Target, top: "68%", left: "8%", size: "w-10 h-10 sm:w-14 sm:h-14", rotate: "8deg" },
  { icon: Trophy, top: "70%", right: "8%", size: "w-10 h-10 sm:w-14 sm:h-14", rotate: "-10deg" },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const onLoadingCompleteRef = useRef(onLoadingComplete);
  onLoadingCompleteRef.current = onLoadingComplete;

  const [targetState, setTargetState] = useState<PreloadProgressState>({
    percentage: 0,
    loadedBytes: 0,
    totalBytes: TOTAL_ESTIMATED_BYTES,
    currentTaskName: "Connecting to Emoji BrainPop...",
    isComplete: false,
  });

  const [displayPercentage, setDisplayPercentage] = useState<number>(15);
  const [displayBytes, setDisplayBytes] = useState<number>(TOTAL_ESTIMATED_BYTES * 0.15);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const hasTriggeredCompleteRef = useRef<boolean>(false);

  const triggerFinish = () => {
    if (hasTriggeredCompleteRef.current) return;
    hasTriggeredCompleteRef.current = true;

    setDisplayPercentage(100);
    setDisplayBytes(TOTAL_ESTIMATED_BYTES);
    setIsFadingOut(true);

    setTimeout(() => {
      setIsDone(true);
      if (onLoadingCompleteRef.current) {
        onLoadingCompleteRef.current();
      }
    }, 300);
  };

  useEffect(() => {
    // 1. Start Asset Preloader
    try {
      const preloader = new AssetPreloader((state) => {
        setTargetState(state);
        setDisplayPercentage((prev) => Math.max(prev, state.percentage));
        setDisplayBytes((prev) => Math.max(prev, state.loadedBytes));
        if (state.isComplete) {
          triggerFinish();
        }
      });
      preloader.startPreload().catch(() => {
        triggerFinish();
      });
    } catch {
      triggerFinish();
    }

    // 2. Smooth auto-progress interval (ensures progress moves quickly on mobile)
    const progressInterval = setInterval(() => {
      setDisplayPercentage((prev) => {
        if (prev >= 95) return prev;
        const step = Math.max(6, Math.floor((100 - prev) * 0.3));
        const next = Math.min(96, prev + step);
        setDisplayBytes(Math.round((next / 100) * TOTAL_ESTIMATED_BYTES));
        return next;
      });
    }, 80);

    // 3. Absolute failsafe timeout: dismiss within 0.9s max
    const failsafeTimer = setTimeout(() => {
      triggerFinish();
    }, 900);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(failsafeTimer);
    };
  }, []);

  if (isDone) {
    return null;
  }

  const formattedLoadedMB = (displayBytes / (1024 * 1024)).toFixed(1);
  const formattedTotalMB = (TOTAL_ESTIMATED_BYTES / (1024 * 1024)).toFixed(1);
  const displayPct = Math.min(100, Math.round(displayPercentage));

  return (
    <div
      id="loading-screen-container"
      className={`fixed inset-0 z-[150] flex flex-col items-center justify-between p-3 sm:p-8 landscape:py-2 landscape:px-4 select-none overflow-hidden bg-gradient-to-b from-[#1e2738] via-[#161d2b] to-[#111724] text-slate-100 transition-all duration-300 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* LIGHTWEIGHT AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-pink-500/10 rounded-full blur-2xl" />

        {/* LIGHTWEIGHT VECTOR WATERMARKS */}
        {DECORATIVE_WATERMARKS.map((wm, idx) => {
          const IconComp = wm.icon;
          return (
            <div
              key={`loading-wm-${idx}`}
              className={`absolute pointer-events-none select-none text-slate-400/15 ${wm.size}`}
              style={{
                top: wm.top,
                left: wm.left,
                right: wm.right,
                transform: `rotate(${wm.rotate})`,
              }}
              aria-hidden="true"
            >
              <IconComp className="w-full h-full" />
            </div>
          );
        })}
      </div>

      {/* TOP HEADER BRANDING */}
      <div className="relative z-10 flex items-center gap-2 pt-1 sm:pt-4 landscape:pt-0.5">
        <span className="flex items-center gap-1.5 px-3 py-1 landscape:px-2.5 landscape:py-0.5 rounded-full bg-[#1A2332]/90 border border-slate-700/60 text-[11px] landscape:text-[10px] font-semibold text-slate-200 shadow-sm backdrop-blur-sm">
          <Zap className="w-3.5 h-3.5 landscape:w-3 landscape:h-3 text-cyan-400" />
          <span>HTML5 GAME ENGINE</span>
        </span>
      </div>

      {/* CENTER LOGO & ARTWORK DISPLAY */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2 sm:py-6 landscape:py-1 text-center shrink">
        {/* LOGO ICON CONTAINER WITH GLOW */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/20 blur-xl pointer-events-none" />

          {/* Logo Frame */}
          <div className="relative w-32 h-32 sm:w-52 sm:h-52 md:w-56 md:h-56 landscape:w-24 landscape:h-24 sm:landscape:w-32 sm:landscape:h-32 rounded-2xl sm:rounded-3xl landscape:rounded-xl bg-gradient-to-tr from-[#1E293B] to-[#0F172A] border-2 border-slate-600/70 p-2 sm:p-3 landscape:p-1.5 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Fallback Graphic */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-950 via-indigo-950 to-slate-900 transition-opacity duration-200 ${imageLoaded ? "opacity-0" : "opacity-100"}`}>
              <Brain className="w-12 h-12 sm:w-20 sm:h-20 text-cyan-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-cyan-300 mt-1 tracking-wider uppercase">BrainPop</span>
            </div>

            <img
              src={gameLogo}
              alt="Emoji BrainPop Logo"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
              className={`w-full h-full object-cover rounded-xl sm:rounded-2xl landscape:rounded-lg shadow-md transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </div>

          {/* Floating Brain Badge */}
          <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 landscape:-top-1.5 landscape:-right-1.5 p-1.5 sm:p-2.5 landscape:p-1 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl sm:rounded-2xl landscape:rounded-lg text-white shadow-lg border border-cyan-300/40">
            <Brain className="w-4 h-4 sm:w-6 sm:h-6 landscape:w-3.5 landscape:h-3.5" />
          </div>
        </div>

        {/* GAME TITLE */}
        <h1 className="mt-3 sm:mt-5 landscape:mt-1 text-xl sm:text-3xl landscape:text-lg sm:landscape:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent drop-shadow-sm">
          Emoji BrainPop
        </h1>

        {/* SUBTITLE */}
        <p className="mt-1 text-[10px] sm:text-xs landscape:text-[10px] font-semibold tracking-wide text-cyan-300/90 uppercase">
          Smart Memory Match
        </p>
      </div>

      {/* BOTTOM PROGRESS SECTION */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-md landscape:max-w-xs px-2 pb-2 sm:pb-6 landscape:pb-1 flex flex-col gap-2 shrink-0">
        {/* TASK STATUS & METRIC READOUT */}
        <div className="flex items-center justify-between text-xs sm:text-sm landscape:text-[11px] font-semibold text-slate-300 px-1">
          <div className="flex items-center gap-1.5 truncate max-w-[62%]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
            <span className="truncate text-slate-300">{targetState.currentTaskName}</span>
          </div>

          {/* SIZE & PERCENTAGE DISPLAY */}
          <div className="flex items-center gap-1.5 text-right font-mono text-cyan-300 shrink-0">
            <span className="text-slate-400 text-[10px] sm:text-xs">
              {formattedLoadedMB} / {formattedTotalMB} MB
            </span>
            <span className="text-xs sm:text-sm font-bold text-cyan-400 min-w-[32px] text-right">
              {displayPct}%
            </span>
          </div>
        </div>

        {/* PROGRESS BAR CONTAINER */}
        <div className="relative w-full h-3 sm:h-4 landscape:h-2.5 rounded-full bg-[#141C29] border border-slate-700 p-0.5 shadow-inner overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 transition-all duration-75 relative overflow-hidden"
            style={{ width: `${Math.max(5, displayPct)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* ENGINE BADGES FOOTER */}
        <div className="flex items-center justify-center gap-2 pt-1.5 text-[9px] sm:text-xs text-slate-400 font-mono font-medium border-t border-slate-800">
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

