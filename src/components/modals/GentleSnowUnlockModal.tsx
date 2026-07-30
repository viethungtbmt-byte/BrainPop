import React from "react";
import { Sparkles } from "lucide-react";
import { PanelBackground } from "../PanelBackground";

export interface GentleSnowUnlockModalProps {
  showGentleSnowModal: boolean;
  setShowGentleSnowModal: (show: boolean) => void;
  t: Record<string, any>;
  synth: {
    playRankUp: () => void;
  };
  setShopHighlightItemId: (id: string | null) => void;
  setIsShopOpen: (open: boolean) => void;
}

export const GentleSnowUnlockModal: React.FC<GentleSnowUnlockModalProps> = ({
  showGentleSnowModal,
  setShowGentleSnowModal,
  t,
  synth,
  setShopHighlightItemId,
  setIsShopOpen,
}) => {
  if (!showGentleSnowModal) return null;

  return (
    <div 
      id="gentle-snow-unlock-dialog"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div 
        id="gentle-snow-unlock-card"
        className="bg-gradient-to-b from-[#1b224c] to-[#121633] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.35)] text-center relative overflow-hidden flex flex-col items-center animate-scale-up"
      >
        <PanelBackground showTopBar={true} />
        {/* Top gradient border accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 via-amber-400 to-indigo-500" />
        
        {/* Floating Sparkles & Snow Icon badge */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-sky-400/20 via-indigo-500/30 to-amber-400/20 border-2 border-amber-300/80 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_8px_20px_rgba(6,182,212,0.3)] my-2 sm:my-3 animate-bounce-subtle">
          ❄️
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent uppercase tracking-wider mt-2 mb-2">
          {t.gentleSnowUnlockTitle || "Special Reward Unlocked!"}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed mb-6 px-2">
          {t.gentleSnowUnlockDesc || "Congratulations! You completed 3 Classic games and permanently unlocked Gentle Snow!"}
        </p>

        {/* Claim Now Button */}
        <button
          id="btn-claim-gentle-snow"
          onClick={() => {
            synth.playRankUp();
            setShowGentleSnowModal(false);
            setShopHighlightItemId("effect_snow");
            setIsShopOpen(true);
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] hover:from-[#ffe066] hover:to-[#fcae00] text-[#132257] border-2 border-amber-300/90 shadow-[0_6px_20px_rgba(234,179,8,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_10px_25px_rgba(234,179,8,0.5)] -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base font-black tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
        >
          <span>{t.claimNowButton || "Claim Now"}</span>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#132257]" />
        </button>
      </div>
    </div>
  );
};
