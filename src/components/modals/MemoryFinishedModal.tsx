import React from "react";
import { Trophy, Sparkles, RefreshCw, Video, ArrowRight, Home, X } from "lucide-react";
import { PanelBackground } from "../PanelBackground";
import { Language } from "../../locales";
import { ResultFrameShell } from "../engine/ResultFrameShell";

export interface MemoryFinishedModalProps {
  memoryFinished: boolean;
  p1Score: number;
  p2Score: number;
  showVictoryCelebration: boolean;
  fadeCelebrationOut: boolean;
  showScoreSummary: boolean;
  memoryMode: "vsBot" | "solo" | "twoPlayers";
  botUsername?: string;
  language: Language;
  currentTheme: {
    dialogBg: string;
    accentText: string;
    textSecondary: string;
    cardBg: string;
    cardBorder: string;
    textMuted: string;
    textPrimary: string;
    buttonPrimary: string;
    buttonSecondary: string;
    [key: string]: any;
  };
  t: Record<string, any>;
  challengeAdWatched: boolean;
  classicAdWatched: boolean;
  isWatchingAd: boolean;
  memoryCards: any[];
  memoryMoves: number;
  memoryTimeLeft: number;
  difficulty: string;
  isThemeDark: boolean;
  synth: {
    playSelect: () => void;
  };
  handleWatchAdChallenge: (scoreDiff: number) => void;
  handleWatchAdClassic: (score: number) => void;
  generateMemoryGame: (diff: string) => void;
  handleBackToMenu: () => void;
}

const formatBotWinString = (template: string, botName?: string) => {
  const name = botName || "BOT";
  return template
    .replace(/BOT|AI|БОТ|บอท/gi, name)
    .replace(/🤖/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const MemoryFinishedModal: React.FC<MemoryFinishedModalProps> = ({
  memoryFinished,
  p1Score,
  p2Score,
  showVictoryCelebration,
  fadeCelebrationOut,
  showScoreSummary,
  memoryMode,
  botUsername,
  language,
  currentTheme,
  t,
  challengeAdWatched,
  classicAdWatched,
  isWatchingAd,
  memoryCards,
  memoryMoves,
  memoryTimeLeft,
  difficulty,
  isThemeDark,
  synth,
  handleWatchAdChallenge,
  handleWatchAdClassic,
  generateMemoryGame,
  handleBackToMenu,
}) => {
  if (!memoryFinished) return null;

  const p1Winner = p1Score > p2Score;
  const p2Winner = p2Score > p1Score;
  const isDraw = p1Score === p2Score;

  if (showVictoryCelebration) {
    const getCelebrationText = () => {
      switch (language) {
        case "vi":
          return "TUYỆT VỜI!";
        case "es":
          return "¡INCREÍBLE!";
        case "pt":
          return "INCRÍVEL!";
        default:
          return "AMAZING!";
      }
    };
    const celebrationText = getCelebrationText();

    return (
      <div id="victory-celebration-backdrop" className="fixed inset-0 z-[130] flex items-center justify-center p-2.5 sm:p-5 landscape:p-1.5 select-none bg-slate-950/80 backdrop-blur-md transition-all duration-300 pointer-events-auto touch-manipulation overflow-y-auto">
        <ResultFrameShell
          title={celebrationText}
          showCrown={true}
          ribbonColor="gold"
          onClose={handleBackToMenu}
          className={`${fadeCelebrationOut ? "animate-fade-out-celebration" : "animate-fade-in-backdrop"}`}
        >
          {/* Radial soft screen glow */}
          <div className="absolute inset-0 victory-screen-glow animate-pulse-glow pointer-events-none z-0" />

          {/* Colorful Emitter Fireworks around edges of the screen */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(8)].map((_, i) => {
              const left = [10, 85, 15, 80, 20, 75, 45, 55][i];
              const top = [15, 20, 75, 80, 45, 50, 10, 85][i];
              const delay = ([0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4][i]) % 1.5;
              const color = ["#fbbf24", "#f43f5e", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4", "#eab308"][i];
              return (
                <div
                  key={`fw-prem-${i}`}
                  className="absolute w-4 h-4 rounded-full flex items-center justify-center animate-firework-burst-premium"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  {[...Array(12)].map((_, pIdx) => {
                    const angle = (pIdx * 30 * Math.PI) / 180;
                    const distance = 40 + Math.random() * 45;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    return (
                      <div
                        key={`fwp-prem-${pIdx}`}
                        className="absolute w-1.5 h-1.5 rounded-full animate-firework-particle-premium"
                        style={{
                          backgroundColor: color,
                          animationDelay: `${delay}s`,
                          "--tw-x": `${tx}px`,
                          "--tw-y": `${ty}px`,
                        } as any}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Confetti Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(24)].map((_, i) => {
              const left = (i * 4.2) + (Math.random() * 1.5);
              const delay = Math.random() * 1.8;
              const colors = ["#fbbf24", "#34d399", "#60a5fa", "#f472b6", "#a78bfa", "#f87171", "#22d3ee", "#fb7185"];
              const color = colors[i % colors.length];
              const sizeClass = i % 3 === 0 ? "w-2 h-3" : i % 3 === 1 ? "w-1.5 h-2.5" : "w-2.5 h-2.5";
              const rotation = Math.random() * 360;
              return (
                <div
                  key={`confetti-${i}`}
                  className={`absolute rounded-sm animate-confetti ${sizeClass}`}
                  style={{
                    left: `${left}%`,
                    backgroundColor: color,
                    animationDelay: `${delay}s`,
                    transform: `rotate(${rotation}deg)`,
                  }}
                />
              );
            })}
          </div>

          {/* Pop + Bounce + Float Center Text */}
          <div className="relative z-20 flex flex-col items-center justify-center animate-pop-bounce-float my-1.5 sm:my-3 landscape:my-1">
            <div className="text-4xl sm:text-7xl landscape:text-3xl mb-1 sm:mb-3 landscape:mb-0.5 filter drop-shadow-[0_4px_15px_rgba(234,179,8,0.6)]">
              🏆
            </div>
            
            {memoryMode === "twoPlayers" || memoryMode === "vsBot" ? (
              <>
                <h1 className="font-sans font-black text-xl sm:text-3xl landscape:text-lg text-transparent bg-clip-text bg-gradient-to-b from-[#fff2a3] via-[#ffcf40] to-[#e69d00] drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] tracking-wider">
                  {isDraw 
                    ? t.drawText
                    : memoryMode === "vsBot"
                      ? (p1Winner ? t.youWinText : formatBotWinString(t.botWinsText, botUsername))
                      : (p1Winner ? t.p1WinsText : t.p2WinsText)}
                </h1>
                
                <p className={`text-[9px] sm:text-xs landscape:text-[8.5px] font-black tracking-widest uppercase mt-1 sm:mt-3 landscape:mt-0.5 animate-pulse transition-colors duration-300 ${currentTheme.accentText}`}>
                  {isDraw ? t.closeMatchText : t.fantasticVictory}
                </p>
              </>
            ) : (
              <>
                <h1 className="font-sans font-black text-xl sm:text-3xl landscape:text-lg text-transparent bg-clip-text bg-gradient-to-b from-[#fff2a3] via-[#ffcf40] to-[#e69d00] drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] tracking-wider">
                  {celebrationText}
                </h1>
                
                <p className={`text-[9px] sm:text-xs landscape:text-[8.5px] font-black tracking-widest uppercase mt-1 sm:mt-3 landscape:mt-0.5 animate-pulse transition-colors duration-300 ${currentTheme.accentText}`}>
                  {t.levelCompleted}
                </p>
              </>
            )}
          </div>
        </ResultFrameShell>
      </div>
    );
  }

  if (!showScoreSummary) {
    return null;
  }

  if (memoryMode === "twoPlayers" || memoryMode === "vsBot") {
    const ribbonColor = isDraw ? "gold" : p1Winner ? "blue" : "red";
    const bannerTitle = isDraw
      ? (t.drawTitleShort || "DRAW")
      : memoryMode === "vsBot"
        ? (p1Winner ? (t.youWinShort || "VICTORY") : formatBotWinString(t.botWinsShort, botUsername))
        : (p1Winner ? (t.p1WinsShort || "P1 WINS") : (t.p2WinsShort || "P2 WINS"));

    return (
      <div id="memory-finished-2p-backdrop" className="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-4 md:p-6 landscape:p-1.5 bg-slate-950/80 backdrop-blur-md animate-fade-in pointer-events-auto touch-manipulation overflow-y-auto">
        <ResultFrameShell
          title={bannerTitle}
          ribbonColor={ribbonColor}
          showCrown={!isDraw}
          onClose={handleBackToMenu}
          className="animate-score-summary-fade-in"
        >
          {/* Embedded Style Tag for Fireworks animations */}
          <style>{`
            @keyframes firework-burst {
              0% { transform: scale(0.2); opacity: 0; }
              10% { opacity: 1; }
              80% { opacity: 0.9; }
              100% { transform: scale(1.5); opacity: 0; }
            }
            @keyframes firework-particle {
              0% { transform: translate(0, 0); opacity: 1; }
              100% { transform: translate(var(--tw-x), var(--tw-y)); opacity: 0; }
            }
          `}</style>

          {/* Colorful Fireworks celebration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(6)].map((_, i) => {
              const left = [15, 80, 45, 25, 75, 50][i];
              const top = [20, 25, 15, 60, 55, 75][i];
              const delay = [0, 0.4, 0.8, 1.2, 1.6, 2.0][i];
              const color = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"][i];
              return (
                <div 
                  key={`fw-${i}`}
                  className="absolute w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    animation: `firework-burst 2.4s infinite`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  {[...Array(12)].map((_, pIdx) => {
                    const angle = (pIdx * 30 * Math.PI) / 180;
                    const distance = 40 + Math.random() * 50;
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;
                    return (
                      <div 
                        key={`fwp-${pIdx}`}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: color,
                          animation: `firework-particle 2.4s infinite`,
                          animationDelay: `${delay}s`,
                          "--tw-x": `${tx}px`,
                          "--tw-y": `${ty}px`,
                        } as any}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="w-full relative z-10 pt-0.5 flex flex-col items-center gap-2 sm:gap-2.5 landscape:grid landscape:grid-cols-12 landscape:gap-3 landscape:items-center max-w-sm landscape:max-w-none">
            {/* Left Column in Landscape: Header + Scoreboard Breakdown */}
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 landscape:gap-1.5 w-full landscape:col-span-7">
              {/* Header: Trophy Icon + Announcement */}
              <div className="flex flex-col landscape:flex-row items-center gap-1 landscape:gap-2 text-center landscape:text-left">
                <div className="p-1.5 sm:p-2.5 landscape:p-1 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] bg-amber-500/20 border-2 border-amber-400/50 text-amber-300 shrink-0">
                  <Trophy className="w-4 h-4 sm:w-7 sm:h-7 landscape:w-4 landscape:h-4" />
                </div>

                <div className="text-center landscape:text-left">
                  <p className={`text-[10px] sm:text-xs landscape:text-[9.5px] ${currentTheme.textSecondary} font-bold tracking-wider uppercase transition-colors duration-300`}>
                    {isDraw ? t.bothPlayedBrilliantly : t.fantasticVictoryShort}
                  </p>
                </div>
              </div>

              {/* FINAL SCOREBOARD BREAKDOWN */}
              <div className={`w-full ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-xl sm:rounded-2xl p-2 sm:p-3 landscape:p-1.5 flex flex-col gap-1.5 sm:gap-2 landscape:gap-1 shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all duration-300`}>
                <div className={`text-[8.5px] sm:text-[10px] landscape:text-[8px] ${currentTheme.textSecondary} font-extrabold tracking-wider uppercase border-b ${currentTheme.cardBorder} pb-1 sm:pb-1.5 landscape:pb-0.5 transition-colors duration-300 flex items-center justify-between`}>
                  <span>{t.finalScoresTitle}</span>
                  <span className="font-mono text-amber-400 font-bold">{p1Score} - {p2Score}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1.5 sm:gap-3 landscape:gap-1.5 my-0.5">
                  {/* Player 1 final box */}
                  <div className={`p-1.5 sm:p-2.5 md:p-3 landscape:p-1 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden text-center ${
                    p1Winner 
                      ? "bg-blue-500/25 border-blue-400/60 text-blue-200 shadow-[0_0_16px_rgba(59,130,246,0.35)]" 
                      : isDraw 
                        ? "bg-amber-500/15 border-amber-400/40 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                        : `opacity-75 ${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.textMuted}`
                  }`}>
                    <div className="text-2xl sm:text-4xl landscape:text-lg mb-0.5 select-none filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] animate-pop-bounce-float">
                      {p1Winner ? "😁" : p2Winner ? "😭" : "😁"}
                    </div>
                    <span className="text-[9px] sm:text-xs landscape:text-[8px] font-black uppercase tracking-wider text-slate-100">
                      {memoryMode === "vsBot" ? t.labelYou : t.labelP1}
                    </span>
                    <span className={`font-mono font-black text-xl sm:text-3xl landscape:text-base my-0 ${p1Winner ? "text-blue-300" : isDraw ? "text-amber-300" : currentTheme.textPrimary}`}>
                      {p1Score}
                    </span>
                    <span className={`text-[7.5px] sm:text-[9px] landscape:text-[6.5px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-wider ${
                      p1Winner 
                        ? "bg-blue-500/30 text-blue-300 border border-blue-400/40" 
                        : isDraw 
                          ? "bg-amber-500/30 text-amber-300 border border-amber-400/40"
                          : "bg-rose-950/40 text-rose-300/80 border border-rose-500/30"
                    }`}>
                      {p1Winner ? (t.labelWinner || "Winner") : p2Winner ? (t.labelLoser || "Loser") : (t.labelDraw || "Draw")}
                    </span>
                  </div>

                  {/* Player 2 final box */}
                  <div className={`p-1.5 sm:p-2.5 md:p-3 landscape:p-1 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden text-center ${
                    p2Winner 
                      ? "bg-rose-500/25 border-rose-400/60 text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.35)]" 
                      : isDraw 
                        ? "bg-amber-500/15 border-amber-400/40 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                        : `opacity-75 ${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.textMuted}`
                  }`}>
                    <div className="text-2xl sm:text-4xl landscape:text-lg mb-0.5 select-none filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] animate-pop-bounce-float">
                      {p2Winner ? "😁" : p1Winner ? "😭" : "😁"}
                    </div>
                    <span className="text-[9px] sm:text-xs landscape:text-[8px] font-black uppercase tracking-wider text-slate-100">
                      {memoryMode === "vsBot" ? (botUsername || "BOT") : t.labelP2}
                    </span>
                    <span className={`font-mono font-black text-xl sm:text-3xl landscape:text-base my-0 ${p2Winner ? "text-rose-300" : isDraw ? "text-amber-300" : currentTheme.textPrimary}`}>
                      {p2Score}
                    </span>
                    <span className={`text-[7.5px] sm:text-[9px] landscape:text-[6.5px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-wider ${
                      p2Winner 
                        ? "bg-rose-500/30 text-rose-300 border border-rose-400/40" 
                        : isDraw 
                          ? "bg-amber-500/30 text-amber-300 border border-amber-400/40"
                          : "bg-rose-950/40 text-rose-300/80 border border-rose-500/30"
                    }`}>
                      {p2Winner ? (t.labelWinner || "Winner") : p1Winner ? (t.labelLoser || "Loser") : (t.labelDraw || "Draw")}
                    </span>
                  </div>
                </div>
                
                {memoryMode === "vsBot" && (() => {
                  const diffValue = p1Score - p2Score;
                  const isWin = diffValue > 0;
                  const isLoss = diffValue < 0;
                  
                  let trophyText = "";
                  if (isWin) {
                    const finalGain = challengeAdWatched ? diffValue * 2 : diffValue;
                    trophyText = t.trophyEarned ? t.trophyEarned(finalGain) : `+${finalGain} Trophies`;
                  } else if (isLoss) {
                    const lossAmount = Math.abs(diffValue);
                    const recoveryAmount = challengeAdWatched ? Math.max(1, Math.floor(lossAmount / 2)) : 0;
                    const finalLoss = lossAmount - recoveryAmount;
                    trophyText = challengeAdWatched 
                      ? (t.trophyLossProtected ? t.trophyLossProtected(finalLoss) : `-${finalLoss} Trophies (50% Loss Protection)`)
                      : t.trophyLost ? t.trophyLost(diffValue) : `-${lossAmount} Trophies`;
                  } else {
                    trophyText = challengeAdWatched ? (t.trophyBonusOne || "+1 Trophy (Bonus)") : t.trophyNone;
                  }
                  
                  return (
                    <div className={`p-1.5 sm:p-2 landscape:p-1 rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.2)] mt-0.5 transition-all duration-300 ${currentTheme.cardBg} border ${currentTheme.cardBorder}`}>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 landscape:w-3 landscape:h-3 text-amber-400" />
                        <span className={`font-mono font-black text-xs sm:text-base landscape:text-xs transition-colors duration-300 ${
                          isWin 
                            ? (isThemeDark ? "text-emerald-300" : "text-emerald-700") 
                            : isLoss 
                              ? (isThemeDark ? "text-rose-300" : "text-rose-700") 
                              : `${currentTheme.textMuted}`
                        }`}>
                          {trophyText}
                        </span>
                      </div>
                      {challengeAdWatched && (
                        <span className="text-[8px] sm:text-[9px] landscape:text-[7.5px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                          {isWin ? (t.trophyRewardApplied2x || "×2 Trophy Reward Applied!") : isLoss ? (t.lossProtectionApplied50 || "50% Loss Protection Applied!") : (t.bonusTrophyGranted || "Bonus Trophy Granted!")}
                        </span>
                      )}
                    </div>
                  );
                })()}

                <div className={`flex justify-between items-center text-[9px] sm:text-xs landscape:text-[8px] ${currentTheme.textSecondary} font-bold px-1 pt-0.5 border-t ${currentTheme.cardBorder} transition-colors duration-300`}>
                  <span>{t.totalMovesText}</span>
                  <span className={`font-mono font-black text-xs sm:text-sm landscape:text-xs transition-colors duration-300 ${currentTheme.accentText}`}>{memoryMoves}</span>
                </div>
              </div>
            </div>

            {/* Right Column in Landscape: Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 w-full max-w-[280px] landscape:max-w-none landscape:col-span-5 mx-auto">
              {memoryMode === "vsBot" ? (
                <>
                  {/* WATCH AD BUTTON FOR CHALLENGE MODE */}
                  {!challengeAdWatched ? (
                    <button
                      type="button"
                      id="btn-watch-ad-challenge"
                      disabled={isWatchingAd}
                      onClick={() => handleWatchAdChallenge(p1Score - p2Score)}
                      className="w-full px-2.5 py-1.5 sm:py-2.5 landscape:py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-[9.5px] sm:text-xs landscape:text-[9px] tracking-wide shadow-[0_4px_16px_rgba(245,158,11,0.45)] active:scale-95 transition-all flex items-center justify-between cursor-pointer border border-amber-200/60 relative overflow-hidden group touch-manipulation pointer-events-auto"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                      {isWatchingAd ? (
                        <div className="flex items-center justify-center gap-2 w-full py-0.5">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                          <span className="font-extrabold text-[10px] sm:text-xs text-slate-950">{t.loadingAdText || "Loading Ad..."}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="p-1 rounded-lg bg-slate-950/20 text-slate-950">
                              <Video className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col items-start leading-tight text-left">
                              <span className="font-black text-[9.5px] sm:text-xs landscape:text-[9px] text-slate-950">
                                {p1Score > p2Score
                                  ? (t.watchAdDoubleTrophies ? t.watchAdDoubleTrophies(p1Score - p2Score) : `×2 Trophies (+${p1Score - p2Score})`)
                                  : p1Score < p2Score
                                    ? (t.watchAdSaveTrophies ? t.watchAdSaveTrophies(Math.max(1, Math.floor(Math.abs(p1Score - p2Score) / 2))) : `Save 50% Trophies (+${Math.max(1, Math.floor(Math.abs(p1Score - p2Score) / 2))})`)
                                    : (t.watchAdBonusTrophy || "+1 Bonus Trophy")}
                              </span>
                              <span className="text-[8px] sm:text-[9px] landscape:text-[7.5px] font-extrabold text-slate-900/80 uppercase tracking-wider">
                                {t.watchAdText || "Watch Ad"} • {t.adRewardBadge2x || "×2 Reward"}
                              </span>
                            </div>
                          </div>
                          <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse shrink-0" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="w-full px-2.5 py-1.5 sm:py-2 landscape:py-1 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[9.5px] sm:text-xs landscape:text-[9px] flex items-center justify-center gap-1.5 shadow-inner">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t.adRewardApplied || "Ad Reward Applied! 🎉"}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    id="btn-play-again-vsbot"
                    onClick={() => { synth.playSelect(); generateMemoryGame(difficulty); }}
                    className={`w-full px-3 py-1.5 sm:py-2.5 landscape:py-2 rounded-xl sm:rounded-2xl ${currentTheme.buttonPrimary} font-black text-xs landscape:text-[11px] tracking-wide active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation pointer-events-auto shadow-md`}
                  >
                    <span>{t.playAgainText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  id="btn-play-again-2p"
                  onClick={() => { synth.playSelect(); generateMemoryGame(difficulty); }}
                  className={`w-full px-3 py-1.5 sm:py-3 landscape:py-2.5 rounded-xl sm:rounded-2xl ${currentTheme.buttonPrimary} font-black text-xs sm:text-sm landscape:text-xs tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation pointer-events-auto shadow-md hover:shadow-lg`}
                >
                  <span>{t.playAgainText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </ResultFrameShell>
      </div>
    );
  }

  // Solo mode Victory Screen
  const baseScore = Math.round((memoryCards.length * 1) / 2);
  const efficiencyScore = Math.round(Math.max(0, 1000 - memoryMoves * 10) / 100);
  const timeBonus = Math.round((memoryTimeLeft > 0 ? memoryTimeLeft * 2 : 0) / 5);
  const totalLevelScore = baseScore + efficiencyScore + timeBonus;
  const bannerTitleSolo = t.rewardDialogTitle || t.memoryWinTitle || "STAGE CLEAR";

  return (
    <div id="memory-finished-backdrop" className="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-4 md:p-6 landscape:p-1.5 bg-slate-950/80 backdrop-blur-md animate-fade-in pointer-events-auto touch-manipulation overflow-y-auto">
      <ResultFrameShell
        title={bannerTitleSolo}
        ribbonColor="gold"
        showCrown={true}
        onClose={handleBackToMenu}
        className="animate-score-summary-fade-in"
      >
        <div className="w-full relative z-10 pt-0.5 flex flex-col items-center gap-2 sm:gap-2.5 landscape:grid landscape:grid-cols-12 landscape:gap-3 landscape:items-center max-w-sm landscape:max-w-none">
          {/* Left Column in Landscape: Header + Score Breakdown */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 landscape:gap-1.5 w-full landscape:col-span-7">
            {/* Header: Trophy Icon + Stage description */}
            <div className="flex flex-col landscape:flex-row items-center gap-1 landscape:gap-2 text-center landscape:text-left">
              <div className="p-1.5 sm:p-2.5 landscape:p-1 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] bg-amber-500/20 border-2 border-amber-400/50 text-amber-300 shrink-0">
                <Trophy className="w-4 h-4 sm:w-7 sm:h-7 landscape:w-4 landscape:h-4" />
              </div>

              <div className="text-center landscape:text-left">
                <p className={`text-[9px] sm:text-xs landscape:text-[9px] ${currentTheme.textSecondary} mt-0.5 font-bold leading-tight transition-colors duration-300`}>
                  {t.memoryWinDesc(memoryMoves)}
                </p>
              </div>
            </div>

            {/* SCOREBOARD BREAKDOWN */}
            <div className={`w-full ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-xl sm:rounded-2xl p-2 sm:p-3 landscape:p-1.5 text-left text-[10px] sm:text-xs space-y-1 sm:space-y-1.5 landscape:space-y-0.5 font-sans shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all duration-300`}>
              <div className={`flex justify-between items-center ${currentTheme.textSecondary} pb-1 landscape:pb-0.5 border-b ${currentTheme.cardBorder} transition-colors duration-300`}>
                <span className="font-black uppercase tracking-wider text-[8.5px] sm:text-[10px] landscape:text-[8px]">{t.scoringBreakdown}</span>
                <span className="text-amber-400 font-extrabold text-[9.5px] sm:text-[11px] landscape:text-[8.5px] font-mono tracking-wider">{t.boardSizeLabels[difficulty as keyof typeof t.boardSizeLabels] || difficulty}</span>
              </div>

              <div className="flex justify-between items-center font-bold text-[9.5px] sm:text-xs landscape:text-[8.5px]">
                <span className={`transition-colors duration-300 ${currentTheme.textSecondary}`}>{t.baseMatchPoints}:</span>
                <span className={`font-mono ${currentTheme.textPrimary} font-black transition-colors duration-300`}>+{baseScore}</span>
              </div>

              <div className="flex justify-between items-center font-bold text-[9.5px] sm:text-xs landscape:text-[8.5px]">
                <span className={`transition-colors duration-300 ${currentTheme.textSecondary}`}>
                  {t.efficiencyBonus}:
                </span>
                <span className={`font-mono ${currentTheme.textPrimary} font-black transition-colors duration-300`}>+{efficiencyScore}</span>
              </div>

              <div className="flex justify-between items-center font-bold text-[9.5px] sm:text-xs landscape:text-[8.5px]">
                <span className={`transition-colors duration-300 ${currentTheme.textSecondary}`}>
                  {t.timeBonusText}:
                </span>
                <span className={`font-mono ${currentTheme.textPrimary} font-black transition-colors duration-300`}>+{timeBonus}</span>
              </div>

              <div className={`flex justify-between items-center pt-1 landscape:pt-0.5 border-t ${currentTheme.cardBorder} font-black text-xs sm:text-sm landscape:text-xs transition-colors duration-300 ${isThemeDark ? "text-emerald-300" : "text-emerald-700"}`}>
                <span>{t.levelScoreTotal}:</span>
                <div className="flex items-center gap-1.5">
                  {classicAdWatched && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[8px] sm:text-[8.5px] landscape:text-[7.5px] uppercase font-black tracking-wider animate-bounce border border-amber-400/40">
                      {t.x2DoubledTag || "×2 Score! 🎉"}
                    </span>
                  )}
                  <span className="font-mono text-base sm:text-lg landscape:text-sm">
                    +{classicAdWatched ? totalLevelScore * 2 : totalLevelScore}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column in Landscape: Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 w-full max-w-[280px] landscape:max-w-none landscape:col-span-5 mx-auto">
            {/* WATCH AD BUTTON FOR CLASSIC MODE */}
            {!classicAdWatched ? (
              <button
                type="button"
                id="btn-watch-ad-classic"
                disabled={isWatchingAd}
                onClick={() => handleWatchAdClassic(totalLevelScore)}
                className="w-full px-2.5 py-1.5 sm:py-2.5 landscape:py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-[9.5px] sm:text-xs landscape:text-[9px] tracking-wide shadow-[0_4px_16px_rgba(245,158,11,0.45)] active:scale-95 transition-all flex items-center justify-between cursor-pointer border border-amber-200/60 relative overflow-hidden group touch-manipulation pointer-events-auto"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                {isWatchingAd ? (
                  <div className="flex items-center justify-center gap-2 w-full py-0.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                    <span className="font-extrabold text-[10px] sm:text-xs text-slate-950">{t.loadingAdText || "Loading Ad..."}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="p-1 rounded-lg bg-slate-950/20 text-slate-950">
                        <Video className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col items-start leading-tight text-left">
                        <span className="font-black text-[9.5px] sm:text-xs landscape:text-[9px] text-slate-950">
                          {t.watchAdDoubleScore || "×2 Final Score"}
                        </span>
                        <span className="text-[8px] sm:text-[9px] landscape:text-[7.5px] font-extrabold text-slate-900/80 uppercase tracking-wider">
                          {t.watchAdText || "Watch Ad"} • {t.watchAdSubtextBonus ? t.watchAdSubtextBonus(totalLevelScore) : `+${totalLevelScore} Bonus`}
                        </span>
                      </div>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse shrink-0" />
                  </>
                )}
              </button>
            ) : (
              <div className="w-full px-2.5 py-1.5 sm:py-2 landscape:py-1 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[9.5px] sm:text-xs landscape:text-[9px] flex items-center justify-center gap-1.5 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.adScoreRewardApplied || t.adRewardApplied || "×2 Score Reward Applied! 🎉"}</span>
              </div>
            )}

            <button
              type="button"
              id="btn-play-again-memory"
              onClick={() => { synth.playSelect(); generateMemoryGame(difficulty); }}
              className={`px-3 py-1.5 sm:py-2.5 landscape:py-2 w-full rounded-xl sm:rounded-2xl ${currentTheme.buttonPrimary} font-black text-xs landscape:text-[11px] tracking-wide active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation pointer-events-auto shadow-md`}
            >
              {t.newGame}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </ResultFrameShell>
    </div>
  );
};
