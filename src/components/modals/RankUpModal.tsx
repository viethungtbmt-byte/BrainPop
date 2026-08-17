import React from "react";
import { Sparkles, Shield, Crown } from "lucide-react";
import { PanelBackground } from "../PanelBackground";

export interface RankUpModalProps {
  showRankUpPopup: boolean;
  setShowRankUpPopup: (show: boolean) => void;
  rankUpBadge: {
    nameKey: string;
    bg: string;
    border: string;
    shadow: string;
    badgeType: string;
    color: string;
    fill: string;
  } | null;
  isRankPromotion: boolean;
  vsBotTrophies: number;
  t: Record<string, any>;
  currentTheme: {
    dialogBg: string;
    textSecondary: string;
    buttonPrimary: string;
    [key: string]: any;
  };
  synth: {
    playSelect: () => void;
  };
}

export const RankUpModal: React.FC<RankUpModalProps> = ({
  showRankUpPopup,
  setShowRankUpPopup,
  rankUpBadge,
  isRankPromotion,
  vsBotTrophies,
  t,
  currentTheme,
  synth,
}) => {
  if (!showRankUpPopup || !rankUpBadge) return null;

  const handleDismiss = () => {
    try {
      synth?.playSelect?.();
    } catch (e) {
      console.warn("Audio select error:", e);
    }
    setShowRankUpPopup(false);
  };

  return (
    <div 
      id="rank-up-backdrop"
      className="fixed inset-0 bg-[#0d101b]/80 backdrop-blur-md z-[130] flex items-center justify-center p-4 animate-fade-in-backdrop pointer-events-auto touch-manipulation"
      onClick={handleDismiss}
    >
      {/* Subtle sparkles/particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => {
          const left = Math.random() * 80 + 10;
          const top = Math.random() * 80 + 10;
          const size = Math.random() * 12 + 6;
          const delay = Math.random() * 0.5;
          return (
            <Sparkles
              key={`sparkle-${i}`}
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
        id="rank-up-content"
        className={`${currentTheme.dialogBg} backdrop-blur-xl border-2 border-amber-400/80 rounded-3xl p-6 max-w-xs w-full shadow-[0_16px_40px_rgba(245,158,11,0.25),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] relative overflow-hidden z-10 flex flex-col items-center gap-4 animate-scale-up text-center animate-fade-in-backdrop transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <PanelBackground showTopBar={true} />

        <div className="flex flex-col items-center gap-1.5">
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin-slow" />
          <h3 className="font-black text-xl sm:text-2xl text-amber-400 tracking-wider uppercase leading-none drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
            {isRankPromotion ? t.rankUpTitle : t.rankDownTitle}
          </h3>
          <p className={`text-[10px] ${currentTheme.textSecondary} font-bold uppercase tracking-widest transition-colors duration-300`}>
            {isRankPromotion ? t.newRankAchieved : t.currentRankLabel}
          </p>
        </div>

        {/* Large scale badge icon */}
        <div className={`p-4 rounded-full border-2 ${rankUpBadge.bg} ${rankUpBadge.border} ${rankUpBadge.shadow} shadow-lg flex items-center justify-center animate-badge-scale-up`}>
          {rankUpBadge.badgeType === "shield" ? (
            <Shield 
              className={`w-14 h-14 ${rankUpBadge.color}`} 
              fill={rankUpBadge.fill} 
              strokeWidth={1.5}
            />
          ) : (
            <Crown 
              className={`w-14 h-14 ${rankUpBadge.color}`} 
              fill={rankUpBadge.fill} 
              strokeWidth={1.5}
            />
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className={`font-black text-lg tracking-wide uppercase ${rankUpBadge.color}`}>
            {t[rankUpBadge.nameKey]}
          </span>
          <span className={`text-[11px] ${currentTheme.textSecondary} mt-1 font-bold transition-colors duration-300`}>
            {isRankPromotion ? t.congratsTrophies(vsBotTrophies) : t.currentTrophiesText(vsBotTrophies)}
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className={`w-full py-3 px-4 rounded-2xl ${currentTheme.buttonPrimary} font-black text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer touch-manipulation pointer-events-auto`}
        >
          {isRankPromotion ? t.awesomeText : t.okText}
        </button>
      </div>
    </div>
  );
};
