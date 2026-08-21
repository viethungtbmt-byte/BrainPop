import React from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { PanelBackground } from "../PanelBackground";
import { safeLocalStorage } from "../../utils/safeStorage";

export interface PauseOverlayProps {
  isPaused: boolean;
  isMobileConfigOpen?: boolean;
  setIsPaused: (paused: boolean) => void;
  synth: {
    playSelect: () => void;
    playResume: () => void;
  };
  t: Record<string, any>;
  generateMemoryGame: (diff: string) => void;
  difficulty: string;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  isPaused,
  isMobileConfigOpen = false,
  setIsPaused,
  synth,
  t,
  generateMemoryGame,
  difficulty,
}) => {
  if (!isPaused || isMobileConfigOpen) return null;

  return (
    <div
      id="memory-paused-overlay"
      className="absolute inset-0 bg-[#0a0d18]/85 backdrop-blur-md z-[100] rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-2.5 sm:p-6 text-center select-none animate-fade-in pointer-events-auto overflow-y-auto"
    >
      <div className="bg-gradient-to-br from-[#1d2547]/95 via-[#151a36]/95 to-[#0e1226]/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-3.5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_20px_rgba(245,158,11,0.15)] flex flex-col items-center gap-2 sm:gap-4 max-w-xs sm:max-w-sm w-full relative overflow-y-auto max-h-full my-auto pointer-events-auto">
        <PanelBackground showTopBar={true} />
        {/* Glowing Pause Emblem */}
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse shrink-0">
          <Pause className="w-5 h-5 sm:w-7 sm:h-7 fill-amber-400/80" />
        </div>

        <div className="shrink-0">
          <h3 className="font-black text-amber-100 text-sm sm:text-xl tracking-wide uppercase">
            {t.gamePaused}
          </h3>
          <p className="text-slate-300/90 text-[11px] sm:text-sm mt-0.5 sm:mt-1 max-w-[260px] mx-auto leading-tight sm:leading-relaxed">
            {t.gamePausedDesc}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 pt-1 shrink-0">
          {/* Manual Resume Button */}
          <button
            id="btn-paused-resume"
            type="button"
            onClick={() => {
              synth.playResume();
              setIsPaused(false);
            }}
            className="w-full py-2 sm:py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase transition-colors duration-150 border-transparent shadow-none cursor-pointer flex items-center justify-center gap-2 touch-manipulation pointer-events-auto"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
            <span>{t.resumeBtn}</span>
          </button>

          {/* Restart Game Option */}
          <button
            id="btn-paused-restart"
            type="button"
            onClick={() => {
              synth.playSelect();
              safeLocalStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
              generateMemoryGame(difficulty, undefined, true);
              setIsPaused(false);
            }}
            className="w-full py-1.5 sm:py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 active:scale-95 text-[11px] sm:text-xs font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)] touch-manipulation pointer-events-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.newGameText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
