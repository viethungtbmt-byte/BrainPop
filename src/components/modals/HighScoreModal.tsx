import React from "react";
import { Sparkles, Trophy } from "lucide-react";
import { PanelBackground } from "../PanelBackground";

export interface HighScoreModalProps {
  showHighScorePopup: boolean;
  setShowHighScorePopup: (show: boolean) => void;
  newHighScoreValue: number;
  t: Record<string, any>;
  synth: {
    playConfirm: () => void;
  };
}

export const HighScoreModal: React.FC<HighScoreModalProps> = ({
  showHighScorePopup,
  setShowHighScorePopup,
  newHighScoreValue,
  t,
  synth,
}) => {
  if (!showHighScorePopup) return null;

  return (
    <div 
      id="highscore-popup-backdrop"
      className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-fade-in-backdrop animate-duration-200 pointer-events-auto"
      onClick={() => setShowHighScorePopup(false)}
    >
      {/* Subtle sparkles/particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(8)].map((_, i) => {
          const left = Math.random() * 80 + 10;
          const top = Math.random() * 80 + 10;
          const size = Math.random() * 10 + 6;
          const delay = Math.random() * 0.5;
          return (
            <Sparkles
              key={`hs-sparkle-${i}`}
              className="absolute text-amber-400 animate-pulse"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: "1.5s",
              }}
            />
          );
        })}
      </div>

      <div 
        id="highscore-popup-content"
        className="bg-[#252f67]/95 backdrop-blur-xl border-2 border-emerald-400/80 rounded-3xl p-6 max-w-xs w-full shadow-[0_16px_40px_rgba(16,185,129,0.25),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] relative overflow-hidden z-10 flex flex-col items-center gap-4 text-center animate-scale-up animate-duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <PanelBackground showTopBar={true} />
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-emerald-500/20 border-2 border-emerald-400/40 rounded-full text-emerald-300 animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="font-black text-xl sm:text-2xl text-emerald-300 tracking-wider uppercase leading-none mt-2">
            {t.newHighScoreTitle}
          </h3>
        </div>

        <div className="bg-[#1e2552]/70 border-2 border-emerald-500/40 rounded-2xl py-3.5 px-6 w-full shadow-[0_4px_10px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col items-center">
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mb-1">
            {t.recordScoreLabel}
          </span>
          <span className="font-mono text-3xl font-black text-emerald-300 drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)]">
            {newHighScoreValue}
          </span>
        </div>

        <p className="text-xs text-slate-200 font-bold px-2 leading-relaxed">
          {t.congratsHighScore}
        </p>

        <button
          id="btn-highscore-ok"
          onClick={() => {
            synth.playConfirm();
            setShowHighScorePopup(false);
          }}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-b from-emerald-400 to-[#10b981] text-slate-950 text-xs font-black uppercase tracking-wider shadow-md border-2 border-emerald-300/80 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          {t.okText}
        </button>
      </div>
    </div>
  );
};
