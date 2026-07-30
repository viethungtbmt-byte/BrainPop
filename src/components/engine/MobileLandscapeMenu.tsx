import React from "react";
import {
  Brain,
  Trophy,
  Award,
  Store,
  Settings,
  Play,
  X,
  Bot,
  Zap,
  Users,
  Shield,
  Crown,
  Video,
  SquareStack,
  Info,
} from "lucide-react";

export interface RankInfo {
  nameKey: string;
  bg: string;
  border: string;
  shadow: string;
  badgeType: "shield" | "crown" | string;
  color: string;
  fill: string;
}

export interface HelpConfig {
  iconName: string;
  title: string;
  rules: string;
}

export interface MobileLandscapeMenuProps {
  memoryMode: "vsBot" | "solo" | "twoPlayers";
  vsBotTrophies: number;
  currentScore: number;
  currentHighScore: number;
  difficulty: string;
  t: Record<string, any>;
  synth: {
    playSelect: () => void;
  };
  setIsShopOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsMobileConfigOpen: (open: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  getBoardSizeForTrophies: (trophies: number) => string;
  setDifficulty: (diff: string) => void;
  setMemoryMode: (mode: "vsBot" | "solo" | "twoPlayers") => void;
  generateMemoryGame: (diff: string) => void;
  currentRank: RankInfo;
  rankProgressDisplay: string;
  rankProgressPercentage: number;
  isBoardSizeUnlocked: (key: string, mode: string) => boolean;
  getRemainingBoardSizeUnlockTimeText: (key: string) => string | null;
  handleUnlockBoardSize: (key: string, onSuccess: () => void) => void;
  winsP1: number;
  winsP2: number;
  setShowResetConfirm: (show: boolean) => void;
  helpConfig: HelpConfig;
}

export const MobileLandscapeMenu: React.FC<MobileLandscapeMenuProps> = ({
  memoryMode,
  vsBotTrophies,
  currentScore,
  currentHighScore,
  difficulty,
  t,
  synth,
  setIsShopOpen,
  setIsSettingsOpen,
  setIsMobileConfigOpen,
  setIsPaused,
  getBoardSizeForTrophies,
  setDifficulty,
  setMemoryMode,
  generateMemoryGame,
  currentRank,
  rankProgressDisplay,
  rankProgressPercentage,
  isBoardSizeUnlocked,
  getRemainingBoardSizeUnlockTimeText,
  handleUnlockBoardSize,
  winsP1,
  winsP2,
  setShowResetConfirm,
  helpConfig,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 h-full overflow-hidden gap-2 md:gap-3 lg:gap-4 w-full max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto text-slate-100 selection:bg-cyan-900 select-none pt-1">
      {/* A. NESTED HEADER */}
      <div className="flex items-center justify-between pt-1 pb-2 md:pb-2.5 border-b border-slate-800/80 shrink-0 min-h-10 md:min-h-11 lg:min-h-12">
        {/* Logo and Name */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="p-1 md:p-1.5 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-lg text-white">
            <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
          </div>
          <span className="text-[10.5px] md:text-xs lg:text-sm font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap">
            Emoji BrainPop
          </span>
        </div>

        {/* Trophies, Score, Shop, Settings, and Resume */}
        <div className="flex items-center gap-1.5 md:gap-2 lg:gap-2.5">
          {/* Trophies badge - Battle Mode only */}
          {memoryMode === "vsBot" && (
            <div className="flex items-center gap-1 bg-[#1e2552]/60 border border-[#3f509d]/40 rounded-full px-2 py-0.5 md:px-2.5 md:py-1 text-[9px] md:text-[10.5px] lg:text-xs font-black uppercase text-slate-300 shadow-inner whitespace-nowrap">
              <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-amber-500 animate-pulse" />
              <span>TROPHIES</span>
              <span className="text-amber-300 ml-0.5 font-mono">{vsBotTrophies}</span>
            </div>
          )}

          {/* Classic score badge - Classic Mode only */}
          {memoryMode === "solo" && (
            <div className="flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 rounded-full px-2 py-0.5 md:px-2.5 md:py-1 text-[9px] md:text-[10.5px] lg:text-xs font-black uppercase text-emerald-300 shadow-inner whitespace-nowrap">
              <Award className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-emerald-400 animate-pulse" />
              <span>{t.totalScore.replace(":", "")}</span>
              <span className="text-emerald-300 ml-0.5 font-mono">{currentScore}</span>
            </div>
          )}

          {/* Shop Button */}
          <button
            id="btn-mobile-landscape-shop"
            onClick={() => {
              synth.playSelect();
              setIsShopOpen(true);
            }}
            className="py-1 px-2.5 md:py-1.5 md:px-3.5 lg:py-2 lg:px-4 rounded-lg bg-gradient-to-b from-[#34448e]/80 to-[#25326d]/80 border border-[#546bbf]/40 hover:from-[#3a4ba1] hover:to-[#2b3a7a] text-slate-100 text-[9.5px] md:text-xs lg:text-sm font-extrabold flex items-center gap-1 md:gap-1.5 transition-all duration-200 focus:outline-none cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)] whitespace-nowrap"
            title={t.shopTitle}
          >
            <Store className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-amber-400" />
            <span>{t.shopTitle}</span>
          </button>

          {/* Settings Button */}
          <button
            id="btn-mobile-landscape-settings"
            onClick={() => {
              synth.playSelect();
              setIsSettingsOpen(true);
            }}
            className="py-1 px-2.5 md:py-1.5 md:px-3.5 lg:py-2 lg:px-4 rounded-lg bg-gradient-to-b from-[#34448e]/80 to-[#25326d]/80 border border-[#546bbf]/40 hover:from-[#3a4ba1] hover:to-[#2b3a7a] text-slate-100 text-[9.5px] md:text-xs lg:text-sm font-extrabold flex items-center gap-1 md:gap-1.5 transition-all duration-200 focus:outline-none cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)] whitespace-nowrap"
            title={t.settingsTitleShort}
          >
            <Settings className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-cyan-400" />
            <span>{t.settingsTitleShort}</span>
          </button>

          {/* Resume Trigger */}
          <button
            id="btn-hud-resume-match"
            onClick={() => {
              synth.playSelect();
              setIsMobileConfigOpen(false); // Close the Mobile Landscape Menu
              setIsPaused(false); // Resume the game if it is paused
            }}
            className="py-1 px-3 md:py-1.5 md:px-4 lg:py-2 lg:px-5 rounded-lg bg-blue-600 border border-blue-500 hover:bg-blue-500 text-white text-[9.5px] md:text-xs lg:text-sm font-extrabold uppercase tracking-wider cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-1 md:gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_18px_rgba(37,99,235,0.5)] whitespace-nowrap"
          >
            <Play className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 fill-current" />
            <span>{t.resumeLabel}</span>
          </button>

          {/* Close Button */}
          <button
            onClick={() => {
              synth.playSelect();
              setIsMobileConfigOpen(false);
            }}
            className="p-1 md:p-1.5 lg:p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-md"
            title="Close Menu"
          >
            <X className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5" />
          </button>
        </div>
      </div>

      {/* B. MAIN CONTENT: 2-COLUMN BENTO-STYLE GRID */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 pb-0.5">
        {/* LEFT COLUMN: GAME MODE SELECTOR & OPTIONS */}
        <div className="bg-[#303c81]/15 backdrop-blur-sm border border-slate-800/60 rounded-xl p-2.5 md:p-3.5 lg:p-4 flex flex-col justify-between min-h-0 h-full gap-2 md:gap-3 shadow-md">
          <div className="flex items-center justify-between shrink-0">
            <span className="text-[9px] md:text-[10.5px] lg:text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
              {t.playModeTitle}
            </span>
          </div>

          {/* Play Mode Buttons */}
          <div className="grid grid-cols-3 gap-1.5 md:gap-2 shrink-0 h-7.5 md:h-9 lg:h-10">
            {/* Battle Mode */}
            <button
              onClick={() => {
                synth.playSelect();
                if (memoryMode !== "vsBot") {
                  const finalDiff = getBoardSizeForTrophies(vsBotTrophies);
                  setDifficulty(finalDiff);
                  setMemoryMode("vsBot");
                  generateMemoryGame(finalDiff);
                }
              }}
              className={`h-full rounded-lg text-[9.5px] md:text-xs lg:text-sm font-black tracking-wide transition-all duration-200 border flex items-center justify-center gap-1.5 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                memoryMode === "vsBot"
                  ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                  : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850/80 shadow-[0_4px_12px_rgba(0,0,0,0.2)] font-bold"
              }`}
            >
              <Bot className={`w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 ${memoryMode === "vsBot" ? "text-slate-950" : "text-cyan-400"}`} />
              <span className="whitespace-nowrap">{t.modeBattle}</span>
            </button>

            {/* Classic Mode */}
            <button
              onClick={() => {
                synth.playSelect();
                if (memoryMode !== "solo") {
                  setDifficulty("3x4");
                  setMemoryMode("solo");
                  generateMemoryGame("3x4");
                }
              }}
              className={`h-full rounded-lg text-[9.5px] md:text-xs lg:text-sm font-black tracking-wide transition-all duration-200 border flex items-center justify-center gap-1.5 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                memoryMode === "solo"
                  ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                  : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850/80 shadow-[0_4px_12px_rgba(0,0,0,0.2)] font-bold"
              }`}
            >
              <Zap className={`w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 ${memoryMode === "solo" ? "text-slate-950" : "text-amber-400"}`} />
              <span className="whitespace-nowrap">{t.modeClassic}</span>
            </button>

            {/* 2 Player Mode */}
            <button
              onClick={() => {
                synth.playSelect();
                if (memoryMode !== "twoPlayers") {
                  const finalDiff = (difficulty === "5x5" || difficulty === "5x6" || difficulty === "6x6") ? difficulty : "5x5";
                  setDifficulty(finalDiff);
                  setMemoryMode("twoPlayers");
                  generateMemoryGame(finalDiff);
                }
              }}
              className={`h-full rounded-lg text-[9.5px] md:text-xs lg:text-sm font-black tracking-wide transition-all duration-200 border flex items-center justify-center gap-1.5 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                memoryMode === "twoPlayers"
                  ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                  : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850/80 shadow-[0_4px_12px_rgba(0,0,0,0.2)] font-bold"
              }`}
            >
              <Users className={`w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 ${memoryMode === "twoPlayers" ? "text-slate-950" : "text-rose-400"}`} />
              <span className="whitespace-nowrap">{t.modeTwoPlayers}</span>
            </button>
          </div>

          {/* Selected Mode Detail Container */}
          <div className="flex-1 min-h-0 bg-slate-950/40 border border-slate-850 rounded-xl px-2.5 py-2 md:px-3.5 md:py-3 lg:px-4 lg:py-3.5 flex flex-col justify-center gap-1.5 md:gap-2.5">
            {memoryMode === "vsBot" && (
              <div className="flex items-center justify-between w-full h-full gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className={`p-1.5 md:p-2 lg:p-2.5 rounded-lg border ${currentRank.bg} ${currentRank.border} ${currentRank.shadow} shadow-md shrink-0 flex items-center justify-center`}>
                    {currentRank.badgeType === "shield" ? (
                      <Shield className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${currentRank.color}`} fill={currentRank.fill} />
                    ) : (
                      <Crown className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${currentRank.color}`} fill={currentRank.fill} />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] md:text-[8px] lg:text-[9.5px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">CURRENT RANK</span>
                    <span className={`font-black text-[10px] md:text-xs lg:text-sm uppercase ${currentRank.color} leading-none`}>
                      {t[currentRank.nameKey]}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-1 md:gap-1.5">
                  <div className="flex items-center justify-between text-[7px] md:text-[8px] lg:text-[9.5px] font-black uppercase tracking-wider text-slate-300 px-0.5 leading-none">
                    <span>RANK PROGRESS</span>
                    <span className="font-sans text-cyan-400 font-black text-[8px] md:text-[10px] lg:text-xs leading-none">
                      {rankProgressDisplay}
                    </span>
                  </div>
                  <div className="w-full h-1.5 md:h-2 lg:h-2.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800/60 relative shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${rankProgressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {memoryMode === "solo" && (
              <div className="flex flex-col gap-1.5 md:gap-2.5 w-full justify-center">
                {/* Prominent Score Indicators for Landscape Mobile Menu */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-1.5 shrink-0">
                  <div className="flex items-center justify-between p-1 px-2.5 md:p-1.5 md:px-3 lg:p-2 lg:px-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                    <span className="font-extrabold text-[8px] md:text-[9.5px] lg:text-xs uppercase tracking-wider leading-none whitespace-nowrap">{t.totalScore.replace(":", "")}</span>
                    <span className="font-mono font-black text-[9.5px] md:text-xs lg:text-sm bg-[#1e2552]/80 px-1.5 py-0.5 rounded border border-[#3f509d]/40 shadow-inner">{currentScore}</span>
                  </div>
                  <div className="flex items-center justify-between p-1 px-2.5 md:p-1.5 md:px-3 lg:p-2 lg:px-3.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300">
                    <span className="font-extrabold text-[8px] md:text-[9.5px] lg:text-xs uppercase tracking-wider leading-none whitespace-nowrap">{t.highScore.replace(":", "")}</span>
                    <span className="font-mono font-black text-[9.5px] md:text-xs lg:text-sm bg-[#1e2552]/80 px-1.5 py-0.5 rounded border border-[#3f509d]/40 shadow-inner">{currentHighScore}</span>
                  </div>
                </div>

                <span className="text-[8px] md:text-[9.5px] lg:text-xs font-black text-slate-400 uppercase tracking-widest text-left leading-none">
                  {t.challengeLevel}
                </span>
                <div className="grid grid-cols-3 gap-1.5 md:gap-2 mt-0.5 w-full">
                  {([
                    { key: "3x4", label: t.boardSizeLabels["3x4"] },
                    { key: "4x5", label: t.boardSizeLabels["4x5"] },
                    { key: "5x5", label: t.boardSizeLabels["5x5"] },
                    { key: "5x6", label: t.boardSizeLabels["5x6"] },
                    { key: "6x6", label: t.boardSizeLabels["6x6"] },
                    { key: "6x8", label: t.boardSizeLabels["6x8"] }
                  ] as const).map((opt) => {
                    const isSelected = difficulty === opt.key;
                    const isLocked = !isBoardSizeUnlocked(opt.key, "solo");
                    const remainingTime = getRemainingBoardSizeUnlockTimeText(opt.key);
                    return (
                      <button
                        key={opt.key}
                        onClick={() => {
                          if (isLocked) {
                            handleUnlockBoardSize(opt.key, () => {
                              setDifficulty(opt.key);
                              setMemoryMode("solo");
                              generateMemoryGame(opt.key);
                            });
                          } else {
                            synth.playSelect();
                            if (difficulty !== opt.key) {
                              setDifficulty(opt.key);
                              setMemoryMode("solo");
                              generateMemoryGame(opt.key);
                            }
                          }
                        }}
                        className={`py-1.5 px-1.5 md:py-2 md:px-2 lg:py-2.5 lg:px-3 rounded-lg text-[9.5px] md:text-xs lg:text-sm font-black transition-all duration-200 border flex items-center justify-center gap-1 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                          isSelected
                            ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                            : isLocked
                            ? "bg-gradient-to-b from-slate-900/90 to-amber-950/40 text-amber-300 border-amber-500/50 hover:bg-amber-900/50 shadow-[0_2px_6px_rgba(245,158,11,0.2)]"
                            : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850 hover:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.18)] font-bold"
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Video className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                            <span className="whitespace-nowrap">{opt.label}</span>
                            <span className="text-[7px] md:text-[8px] lg:text-[9px] font-black uppercase text-amber-300 bg-amber-400/20 px-0.5 rounded border border-amber-400/40 shrink-0">AD</span>
                          </>
                        ) : (
                          <>
                            <span className="whitespace-nowrap">{opt.label}</span>
                            {remainingTime && (
                              <span className="text-[7px] md:text-[8px] lg:text-[9px] font-extrabold text-amber-400/90 bg-amber-400/10 px-0.5 rounded shrink-0 leading-none">{remainingTime}</span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {memoryMode === "twoPlayers" && (
              <div className="flex flex-col justify-center w-full h-full gap-1 md:gap-2">
                <div className="flex items-center justify-between w-full gap-2 md:gap-3">
                  <div className="grid grid-cols-2 gap-2 md:gap-3 flex-1">
                    {/* Player 1 */}
                    <div className="flex items-center justify-between p-1 px-2 md:p-1.5 md:px-3 rounded-lg bg-slate-950/40 border border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-350">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)] animate-pulse" />
                        <span className="font-extrabold text-[8.5px] md:text-xs lg:text-sm uppercase tracking-wider">P1</span>
                      </div>
                      <span className="text-blue-300 font-black text-[10px] md:text-xs lg:text-sm font-mono bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-900/30">
                        {winsP1}
                      </span>
                    </div>

                    {/* Player 2 */}
                    <div className="flex items-center justify-between p-1 px-2 md:p-1.5 md:px-3 rounded-lg bg-slate-950/40 border border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-350">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_rgba(251,113,133,0.8)] animate-pulse" />
                        <span className="font-extrabold text-[8.5px] md:text-xs lg:text-sm uppercase tracking-wider">P2</span>
                      </div>
                      <span className="text-rose-300 font-black text-[10px] md:text-xs lg:text-sm font-mono bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-900/30">
                        {winsP2}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      synth.playSelect();
                      setShowResetConfirm(true);
                    }}
                    className="py-1 px-2 md:py-1.5 md:px-3 lg:py-2 lg:px-3.5 rounded-lg bg-rose-950/60 border border-rose-900/30 text-rose-300 text-[8.5px] md:text-xs lg:text-sm font-black uppercase tracking-wider cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.18)] whitespace-nowrap"
                  >
                    Reset
                  </button>
                </div>

                <div className="flex flex-col gap-1 w-full mt-1">
                  <span className="text-[8px] md:text-[9.5px] lg:text-xs font-black text-slate-400 uppercase tracking-widest leading-none text-left">
                    {t.challengeLevel}
                  </span>
                  <div className="grid grid-cols-2 min-[700px]:grid-cols-4 gap-1.5 md:gap-2 w-full">
                    {([
                      { key: "5x5", label: t.boardSizeLabels["5x5"] },
                      { key: "5x6", label: t.boardSizeLabels["5x6"] },
                      { key: "6x6", label: t.boardSizeLabels["6x6"] },
                      { key: "6x8", label: t.boardSizeLabels["6x8"] }
                    ] as const).map((opt) => {
                      const isSelected = difficulty === opt.key;
                      const isLocked = !isBoardSizeUnlocked(opt.key, "twoPlayers");
                      const remainingTime = getRemainingBoardSizeUnlockTimeText(opt.key);
                      return (
                        <button
                          key={opt.key}
                          onClick={() => {
                            if (isLocked) {
                              handleUnlockBoardSize(opt.key, () => {
                                setDifficulty(opt.key);
                                setMemoryMode("twoPlayers");
                                generateMemoryGame(opt.key);
                              });
                            } else {
                              synth.playSelect();
                              if (difficulty !== opt.key) {
                                setDifficulty(opt.key);
                                setMemoryMode("twoPlayers");
                                generateMemoryGame(opt.key);
                              }
                            }
                          }}
                          className={`py-1 px-1.5 md:py-2 md:px-2 lg:py-2.5 lg:px-3 rounded-lg text-[9px] md:text-xs lg:text-sm font-black transition-all duration-200 border flex items-center justify-center gap-1 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                            isSelected
                              ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                              : isLocked
                              ? "bg-gradient-to-b from-slate-900/90 to-amber-950/40 text-amber-300 border-amber-500/50 hover:bg-amber-900/50 shadow-[0_2px_6px_rgba(245,158,11,0.2)]"
                              : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850 hover:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.18)] font-bold"
                          }`}
                        >
                          {isLocked ? (
                            <>
                              <Video className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                              <span className="whitespace-nowrap">{opt.label}</span>
                              <span className="text-[7px] md:text-[8px] lg:text-[9px] font-black uppercase text-amber-300 bg-amber-400/20 px-0.5 rounded border border-amber-400/40 shrink-0">AD</span>
                            </>
                          ) : (
                            <>
                              <span className="whitespace-nowrap">{opt.label}</span>
                              {remainingTime && (
                                <span className="text-[7px] md:text-[8px] lg:text-[9px] font-extrabold text-amber-400/90 bg-amber-400/10 px-0.5 rounded shrink-0 leading-none">{remainingTime}</span>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REUSED GAME MODE INSTRUCTIONS */}
        <div className="bg-[#303c81]/15 backdrop-blur-sm border border-slate-800/60 rounded-xl p-3 md:p-4 lg:p-5 flex flex-col gap-1.5 md:gap-2.5 shadow-md h-full min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 font-black text-[10px] md:text-xs lg:text-sm text-amber-400 shrink-0 uppercase tracking-widest pb-1 border-b border-slate-800/60">
            {helpConfig.iconName === "SquareStack" ? (
              <SquareStack className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 text-cyan-400 shrink-0" />
            ) : helpConfig.iconName === "Users" ? (
              <Users className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 text-cyan-400 shrink-0" />
            ) : helpConfig.iconName === "Bot" ? (
              <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 text-cyan-400 shrink-0" />
            ) : (
              <Info className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 text-cyan-400 shrink-0" />
            )}
            <span className="truncate">{helpConfig.title}</span>
          </div>
          
          <p className="text-[8px] sm:text-[9.5px] md:text-xs lg:text-sm leading-snug md:leading-normal text-slate-350 whitespace-pre-line overflow-y-auto flex-1 pr-1 scrollbar-thin">
            {helpConfig.rules}
          </p>
        </div>
      </div>
    </div>
  );
};
