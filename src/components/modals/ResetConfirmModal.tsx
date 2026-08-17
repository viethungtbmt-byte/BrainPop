import React from "react";
import { RotateCcw } from "lucide-react";
import { PanelBackground } from "../PanelBackground";

export interface ResetConfirmModalProps {
  showResetConfirm: boolean;
  setShowResetConfirm: (show: boolean) => void;
  synth: {
    playSelect: () => void;
  };
  t: Record<string, any>;
  setWinsP1: (wins: number) => void;
  setWinsP2: (wins: number) => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  showResetConfirm,
  setShowResetConfirm,
  synth,
  t,
  setWinsP1,
  setWinsP2,
}) => {
  if (!showResetConfirm) return null;

  return (
    <div
      id="reset-confirm-backdrop"
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[130] flex items-center justify-center p-4 animate-fade-in-backdrop animate-duration-200 pointer-events-auto touch-manipulation"
      onClick={() => setShowResetConfirm(false)}
    >
      <div
        id="reset-confirm-content"
        className="bg-slate-900/95 border-2 border-rose-500/30 rounded-3xl p-6 max-w-xs w-full shadow-2xl relative overflow-hidden z-10 flex flex-col items-center gap-4 text-center animate-scale-up animate-duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <PanelBackground showTopBar={true} />
        {/* Warning indicator */}
        <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center border border-rose-500/20">
          <RotateCcw className="w-6 h-6 animate-spin-reverse" />
        </div>

        {/* Title */}
        <h3 className="font-black text-lg text-white uppercase tracking-wider leading-tight">
          {t.resetMatchRecordTitle}
        </h3>

        {/* Message */}
        <p className="text-xs text-slate-350 leading-relaxed px-1">
          {t.resetMatchRecordConfirm}
        </p>

        {/* Buttons */}
        <div className="flex gap-2.5 w-full mt-2">
          <button
            id="btn-reset-cancel"
            onClick={() => {
              try { synth.playSelect(); } catch (e) {}
              setShowResetConfirm(false);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer touch-manipulation pointer-events-auto"
          >
            {t.cancelText}
          </button>
          <button
            id="btn-reset-confirm"
            onClick={() => {
              try { synth.playSelect(); } catch (e) {}
              setWinsP1(0);
              setWinsP2(0);
              localStorage.removeItem("emoji_brainpop_2p_wins_p1");
              localStorage.removeItem("emoji_brainpop_2p_wins_p2");
              setShowResetConfirm(false);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md touch-manipulation pointer-events-auto"
          >
            {t.resetButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
