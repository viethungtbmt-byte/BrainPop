import React from "react";
import { X, Lightbulb, Zap, Video } from "lucide-react";
import { PanelBackground } from "../PanelBackground";

export interface HintModalProps {
  isHintModalOpen: boolean;
  setIsHintModalOpen: (open: boolean) => void;
  memoryMode: "vsBot" | "solo" | "twoPlayers";
  memoryFinished: boolean;
  synth: {
    playSelect: () => void;
  };
  t: Record<string, any>;
  hintsCount: number;
  memoryBusy: boolean;
  executeHint: () => void;
  handleRewardedAd: (callback: () => void) => void;
  updateHintsCount: (updater: (prev: number) => number) => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isHintModalOpen,
  setIsHintModalOpen,
  memoryMode,
  memoryFinished,
  synth,
  t,
  hintsCount,
  memoryBusy,
  executeHint,
  handleRewardedAd,
  updateHintsCount,
}) => {
  if (!isHintModalOpen || memoryMode !== "solo" || memoryFinished) return null;

  return (
    <div
      id="memory-hint-modal-overlay"
      className="absolute inset-0 bg-[#0a0d18]/85 backdrop-blur-md z-50 rounded-2xl sm:rounded-3xl flex items-center justify-center p-4 select-none animate-fade-in"
    >
      <div className="bg-gradient-to-br from-[#1d2547]/95 via-[#151a36]/95 to-[#0e1226]/95 backdrop-blur-xl border-2 border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_25px_rgba(245,158,11,0.2)] flex flex-col items-center gap-4 max-w-xs w-full relative overflow-hidden animate-scale-up">
        <PanelBackground showTopBar={true} />
        {/* Close button */}
        <button
          id="btn-close-hint-modal"
          onClick={() => {
            synth.playSelect();
            setIsHintModalOpen(false);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
          title={t.settingsClose}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header / Emblem */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
            <Lightbulb className="w-6 h-6 fill-slate-950 text-slate-950" />
          </div>
          <h3 className="font-black text-slate-100 text-lg tracking-wide">
            {t.hintLabel}
          </h3>
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-inner">
            <span className="text-slate-300">{t.availableText}</span>
            <span className="font-black text-amber-400 text-sm">{hintsCount}</span>
          </div>
        </div>

        {/* Options Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          {/* 1. Use Hint */}
          <button
            id="btn-modal-use-hint"
            onClick={() => {
              if (hintsCount > 0 && !memoryBusy) {
                setIsHintModalOpen(false);
                executeHint();
              }
            }}
            disabled={hintsCount <= 0 || memoryBusy}
            className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              hintsCount > 0 && !memoryBusy
                ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-[#132257] border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] hover:from-[#ffe066] hover:to-[#fcae00] -translate-y-[1px] active:translate-y-0"
                : "bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60"
            }`}
          >
            <Zap className={`w-4 h-4 ${hintsCount > 0 ? "fill-[#132257] text-[#132257]" : "text-slate-500"}`} />
            <span>{t.useHintText(hintsCount)}</span>
          </button>

          {/* 2. Watch Ad to get +1 Hint */}
          <button
            id="btn-modal-watch-ad-hint"
            onClick={() => {
              synth.playSelect();
              handleRewardedAd(() => {
                updateHintsCount((prev) => prev + 1);
              });
            }}
            className="w-full py-3 px-4 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 border-2 border-emerald-300/80 shadow-[0_4px_12px_rgba(16,185,129,0.3),inset_0_1.5px_1px_rgba(255,255,255,0.4)] -translate-y-[1px] active:translate-y-0"
          >
            <Video className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>{t.watchAdGetHint}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
