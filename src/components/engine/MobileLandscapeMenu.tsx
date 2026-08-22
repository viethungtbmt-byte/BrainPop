import React from "react";
import {
  Brain,
  Menu,
  Trophy,
  Award,
  Store,
  Settings,
  Play,
  Bot,
  Zap,
  Users,
  Shield,
  Crown,
  Video,
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
  ensureGameGenerated?: () => void;
  currentRank: RankInfo;
  rankProgressDisplay: string;
  rankProgressPercentage: number;
  isBoardSizeUnlocked: (key: string, mode: string) => boolean;
  getRemainingBoardSizeUnlockTimeText: (key: string) => string | null;
  handleUnlockBoardSize: (key: string, onSuccess: () => void) => void;
  winsP1: number;
  winsP2: number;
  setShowResetConfirm: (show: boolean) => void;
  helpConfig?: any;
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
  ensureGameGenerated,
  currentRank,
  rankProgressDisplay,
  rankProgressPercentage,
  isBoardSizeUnlocked,
  getRemainingBoardSizeUnlockTimeText,
  handleUnlockBoardSize,
  winsP1,
  winsP2,
  setShowResetConfirm,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 h-full overflow-hidden gap-1.5 sm:gap-2 w-full max-w-4xl mx-auto text-slate-100 selection:bg-cyan-900 select-none pt-0">
      {/* A. TOP ACTION BAR - Compact, Non-overlapping */}
      <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-slate-800/80 shrink-0 min-h-8 gap-2">
        {/* Left Section: Trophies badge if Battle mode */}
        <div className="flex items-center gap-1.5 min-w-0">
          {memoryMode === "vsBot" ? (
            <div className="flex items-center gap-1 bg-[#1e2552]/90 border border-[#3f509d]/50 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-black uppercase text-slate-300 shadow-inner whitespace-nowrap">
              <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span>{t.trophiesLabel || "TROPHIES"}</span>
              <span className="text-amber-300 ml-0.5 font-mono">{vsBotTrophies}</span>
            </div>
          ) : (
            <span className="text-[9px] sm:text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none truncate">
              {t.playModeTitle || t.playModeLabel || "MAIN MENU"}
            </span>
          )}
        </div>

        {/* Right Section: Shop, Settings, and Play/Resume */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
          {/* Shop Button */}
          <button
            id="btn-mobile-landscape-shop"
            onClick={() => {
              synth.playSelect();
              setIsShopOpen(true);
            }}
            className="py-1 px-2 sm:px-2.5 md:px-3 rounded-lg bg-[#28346e] hover:bg-[#32418a] border border-[#546bbf]/40 text-slate-100 text-[10px] sm:text-xs font-extrabold flex items-center gap-1 transition-colors duration-150 focus:outline-none cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
            title={t.shopTitle}
          >
            <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
            <span>{t.shopTitle}</span>
          </button>

          {/* Settings Button */}
          <button
            id="btn-mobile-landscape-settings"
            onClick={() => {
              synth.playSelect();
              setIsSettingsOpen(true);
            }}
            className="py-1 px-2 sm:px-2.5 md:px-3 rounded-lg bg-[#28346e] hover:bg-[#32418a] border border-[#546bbf]/40 text-slate-100 text-[10px] sm:text-xs font-extrabold flex items-center gap-1 transition-colors duration-150 focus:outline-none cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
            title={t.settingsTitleShort}
          >
            <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
            <span>{t.settingsTitleShort}</span>
          </button>

          {/* Resume Trigger */}
          <button
            id="btn-hud-resume-match"
            onClick={() => {
              synth.playSelect();
              ensureGameGenerated?.();
              setIsMobileConfigOpen(false);
              setIsPaused(false);
            }}
            className="py-1 px-2.5 sm:px-3.5 rounded-lg bg-blue-600 border border-transparent hover:bg-blue-500 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-colors duration-150 flex items-center gap-1 shadow-none whitespace-nowrap active:scale-95 shrink-0"
          >
            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current shrink-0" />
            <span>{t.startOrResume}</span>
          </button>
        </div>
      </div>

      {/* B. MAIN 2-COLUMN BODY: Left Modes Column + Right Feature Details */}
      <div className="flex-1 min-h-0 flex flex-row gap-2 sm:gap-2.5 md:gap-3 w-full overflow-hidden">
        {/* 1. LEFT COLUMN: Vertical Play Mode Selector */}
        <div className="w-32 sm:w-36 md:w-40 lg:w-44 shrink-0 flex flex-col justify-between gap-1.5 h-full">
          <span className="text-[8.5px] sm:text-[9.5px] font-black text-slate-400 uppercase tracking-wider leading-none shrink-0">
            {t.playModeLabel || "MODES"}
          </span>

          <div className="flex-1 flex flex-col justify-between gap-1 sm:gap-1.5 min-h-0">
            {/* Classic Mode */}
            <button
              onClick={() => {
                synth.playSelect();
                if (memoryMode !== "solo") {
                  setDifficulty("3x4");
                  setMemoryMode("solo");
                }
              }}
              className={`flex-1 min-h-[36px] px-2 sm:px-2.5 rounded-xl text-[10.5px] sm:text-xs font-extrabold tracking-wide transition-all duration-150 border flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                memoryMode === "solo"
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md"
                  : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Zap className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${memoryMode === "solo" ? "text-slate-950" : "text-amber-400"}`} />
              <span className="whitespace-nowrap truncate">{t.modeClassic}</span>
            </button>

            {/* 2 Player Mode */}
            <button
              onClick={() => {
                synth.playSelect();
                if (memoryMode !== "twoPlayers") {
                  const finalDiff = (difficulty === "5x5" || difficulty === "6x6" || difficulty === "6x8" || difficulty === "7x8") ? difficulty : "5x5";
                  setDifficulty(finalDiff);
                  setMemoryMode("twoPlayers");
                }
              }}
              className={`flex-1 min-h-[36px] px-2 sm:px-2.5 rounded-xl text-[10.5px] sm:text-xs font-extrabold tracking-wide transition-all duration-150 border flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                memoryMode === "twoPlayers"
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md"
                  : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Users className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${memoryMode === "twoPlayers" ? "text-slate-950" : "text-rose-400"}`} />
              <span className="whitespace-nowrap truncate">{t.modeTwoPlayers}</span>
            </button>

            {/* Battle / Challenge Mode */}
            <button
              onClick={() => {
                synth.playSelect();
                if (memoryMode !== "vsBot") {
                  const finalDiff = getBoardSizeForTrophies(vsBotTrophies);
                  setDifficulty(finalDiff);
                  setMemoryMode("vsBot");
                }
              }}
              className={`flex-1 min-h-[36px] px-2 sm:px-2.5 rounded-xl text-[10.5px] sm:text-xs font-extrabold tracking-wide transition-all duration-150 border flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                memoryMode === "vsBot"
                  ? "bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md"
                  : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Bot className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${memoryMode === "vsBot" ? "text-slate-950" : "text-cyan-400"}`} />
              <span className="whitespace-nowrap truncate">{t.modeBattle}</span>
            </button>
          </div>
        </div>

        {/* 2. RIGHT COLUMN: Selected Mode Details & Configurations */}
        <div className="flex-1 min-h-0 bg-[#131b3e]/85 border border-[#3b4c8a]/40 rounded-xl p-2 sm:p-2.5 md:p-3 flex flex-col justify-center gap-1.5 sm:gap-2 overflow-y-auto custom-scrollbar">
          {/* A. SOLO (CLASSIC) DETAILS */}
          {memoryMode === "solo" && (
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full justify-center">
              {/* Score Indicators */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-950/50 border border-white/5 text-slate-200">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                    <span className="font-extrabold text-[8.5px] sm:text-[10px] md:text-xs uppercase tracking-wider whitespace-nowrap truncate">
                      {t.totalScore.replace(":", "")}
                    </span>
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm bg-emerald-950/50 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                    {currentScore}
                  </span>
                </div>

                <div className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-950/50 border border-white/5 text-slate-200">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-[8.5px] sm:text-[10px] md:text-xs uppercase tracking-wider whitespace-nowrap truncate">
                      {t.highScore.replace(":", "")}
                    </span>
                  </div>
                  <span className="font-mono font-black text-xs sm:text-sm bg-amber-950/50 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
                    {currentHighScore}
                  </span>
                </div>
              </div>

              {/* Board Size Selection */}
              <div className="flex flex-col gap-1 w-full border-t border-white/10 pt-1.5">
                <span className="text-[8px] sm:text-[9.5px] font-black text-slate-400 uppercase tracking-widest text-left leading-none">
                  {t.challengeLevel}
                </span>
                <div className="grid grid-cols-3 gap-1 sm:gap-1.5 w-full">
                  {([
                    { key: "3x4", label: t.boardSizeLabels["3x4"] },
                    { key: "4x5", label: t.boardSizeLabels["4x5"] },
                    { key: "5x5", label: t.boardSizeLabels["5x5"] },
                    { key: "6x6", label: t.boardSizeLabels["6x6"] },
                    { key: "6x8", label: t.boardSizeLabels["6x8"] },
                    { key: "7x8", label: t.boardSizeLabels["7x8"] }
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
                            });
                          } else {
                            synth.playSelect();
                            if (difficulty !== opt.key) {
                              setDifficulty(opt.key);
                              setMemoryMode("solo");
                            }
                          }
                        }}
                        className={`py-1.5 px-1.5 rounded-lg text-[9px] sm:text-[10.5px] font-black transition-colors duration-150 border flex items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                            : isLocked
                            ? "bg-slate-900 text-amber-300 border border-amber-500/40 shadow-none"
                            : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white font-bold"
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Video className="w-2.5 h-2.5 text-amber-400 fill-amber-400/20 shrink-0" />
                            <span className="whitespace-nowrap">{opt.label}</span>
                            <span className="text-[7px] font-black uppercase text-amber-300 bg-amber-400/20 px-0.5 rounded border border-amber-400/40 shrink-0">AD</span>
                          </>
                        ) : (
                          <>
                            <span className="whitespace-nowrap">{opt.label}</span>
                            {remainingTime && (
                              <span className="text-[7px] font-extrabold text-amber-400 bg-amber-400/10 px-0.5 rounded shrink-0 leading-none">{remainingTime}</span>
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

          {/* B. 2 PLAYERS DETAILS */}
          {memoryMode === "twoPlayers" && (
            <div className="flex flex-col justify-center w-full h-full gap-1.5 sm:gap-2">
              <div className="flex items-center justify-between w-full gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {/* Player 1 */}
                  <div className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-950/50 border border-white/5">
                    <div className="flex items-center gap-1 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)] animate-pulse shrink-0" />
                      <span className="font-extrabold text-[8.5px] sm:text-[10px] uppercase tracking-wider">P1</span>
                    </div>
                    <span className="text-blue-300 font-black text-xs sm:text-sm font-mono bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-900/30">
                      {winsP1}
                    </span>
                  </div>

                  {/* Player 2 */}
                  <div className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-950/50 border border-white/5">
                    <div className="flex items-center gap-1 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_4px_rgba(251,113,133,0.8)] animate-pulse shrink-0" />
                      <span className="font-extrabold text-[8.5px] sm:text-[10px] uppercase tracking-wider">P2</span>
                    </div>
                    <span className="text-rose-300 font-black text-xs sm:text-sm font-mono bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-900/30">
                      {winsP2}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    synth.playSelect();
                    setShowResetConfirm(true);
                  }}
                  className="py-1.5 px-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/40 text-rose-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors duration-150 shrink-0 whitespace-nowrap active:scale-95"
                >
                  {t.resetScoreTitle || "Reset"}
                </button>
              </div>

              {/* Board Size Selection */}
              <div className="flex flex-col gap-1 w-full border-t border-white/10 pt-1.5">
                <span className="text-[8px] sm:text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none text-left">
                  {t.challengeLevel}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">
                  {([
                    { key: "5x5", label: t.boardSizeLabels["5x5"] },
                    { key: "6x6", label: t.boardSizeLabels["6x6"] },
                    { key: "6x8", label: t.boardSizeLabels["6x8"] },
                    { key: "7x8", label: t.boardSizeLabels["7x8"] }
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
                            });
                          } else {
                            synth.playSelect();
                            if (difficulty !== opt.key) {
                              setDifficulty(opt.key);
                              setMemoryMode("twoPlayers");
                            }
                          }
                        }}
                        className={`py-1.5 px-1.5 rounded-lg text-[9px] sm:text-[10.5px] font-black transition-colors duration-150 border flex items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                            : isLocked
                            ? "bg-slate-900 text-amber-300 border border-amber-500/40 shadow-none"
                            : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white font-bold"
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Video className="w-2.5 h-2.5 text-amber-400 fill-amber-400/20 shrink-0" />
                            <span className="whitespace-nowrap">{opt.label}</span>
                            <span className="text-[7px] font-black uppercase text-amber-300 bg-amber-400/20 px-0.5 rounded border border-amber-400/40 shrink-0">AD</span>
                          </>
                        ) : (
                          <>
                            <span className="whitespace-nowrap">{opt.label}</span>
                            {remainingTime && (
                              <span className="text-[7px] font-extrabold text-amber-400 bg-amber-400/10 px-0.5 rounded shrink-0 leading-none">{remainingTime}</span>
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

          {/* C. CHALLENGE / BATTLE DETAILS */}
          {memoryMode === "vsBot" && (
            <div className="flex flex-col justify-center w-full h-full gap-2 sm:gap-2.5">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl border ${currentRank.bg} ${currentRank.border} shrink-0 flex items-center justify-center`}>
                    {currentRank.badgeType === "shield" ? (
                      <Shield className={`w-4 h-4 sm:w-5 sm:h-5 ${currentRank.color}`} fill={currentRank.fill} />
                    ) : (
                      <Crown className={`w-4 h-4 sm:w-5 sm:h-5 ${currentRank.color}`} fill={currentRank.fill} />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                      {t.currentRankLabel ? t.currentRankLabel.toUpperCase() : "CURRENT RANK"}
                    </span>
                    <span className={`font-black text-xs sm:text-sm uppercase ${currentRank.color} leading-none`}>
                      {t[currentRank.nameKey]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-300">
                  <span className="hidden sm:inline">{t.progressLabel ? `${t.progressLabel.toUpperCase()} PROGRESS` : "PROGRESS"}</span>
                  <span className="font-mono text-cyan-400 font-black text-xs sm:text-sm bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {rankProgressDisplay}
                  </span>
                </div>
              </div>

              <div className="w-full h-4 sm:h-5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 p-0.5 relative">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${rankProgressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
