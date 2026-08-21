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
    <div className="flex-1 flex flex-col justify-between min-h-0 h-full overflow-hidden gap-2 md:gap-3 w-full max-w-4xl mx-auto text-slate-100 selection:bg-cyan-900 select-none pt-0">
      {/* A. NESTED HEADER - Right-aligned Action Controls */}
      <div className="flex items-center justify-end pt-0.5 pb-1.5 md:pb-2 border-b border-slate-800/80 shrink-0 min-h-9 md:min-h-10 gap-2">
        {/* Right Section: Trophies (Battle mode only), Shop, Settings, and Resume */}
        <div className="flex items-center justify-end gap-1.5 md:gap-2 lg:gap-2.5 min-w-0">
          {/* Trophies badge - Battle Mode only */}
          {memoryMode === "vsBot" && (
            <div className="flex items-center gap-1 bg-[#1e2552]/80 border border-[#3f509d]/50 rounded-full px-2 py-0.5 md:px-2.5 md:py-1 text-[9px] md:text-[10.5px] lg:text-xs font-black uppercase text-slate-300 shadow-inner whitespace-nowrap">
              <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-amber-500 animate-pulse" />
              <span>{t.trophiesLabel || "TROPHIES"}</span>
              <span className="text-amber-300 ml-0.5 font-mono">{vsBotTrophies}</span>
            </div>
          )}

          {/* Shop Button */}
          <button
            id="btn-mobile-landscape-shop"
            onClick={() => {
              synth.playSelect();
              setIsShopOpen(true);
            }}
            className="py-1 px-2.5 sm:px-3 md:py-1.5 md:px-3.5 lg:py-2 lg:px-4 rounded-lg bg-[#28346e] hover:bg-[#32418a] border border-[#546bbf]/40 text-slate-100 text-[10px] sm:text-xs lg:text-sm font-extrabold flex items-center gap-1 md:gap-1.5 transition-colors duration-150 focus:outline-none cursor-pointer whitespace-nowrap active:scale-95"
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
            className="py-1 px-2.5 sm:px-3 md:py-1.5 md:px-3.5 lg:py-2 lg:px-4 rounded-lg bg-[#28346e] hover:bg-[#32418a] border border-[#546bbf]/40 text-slate-100 text-[10px] sm:text-xs lg:text-sm font-extrabold flex items-center gap-1 md:gap-1.5 transition-colors duration-150 focus:outline-none cursor-pointer whitespace-nowrap active:scale-95"
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
              ensureGameGenerated?.();
              setIsMobileConfigOpen(false); // Close the Mobile Landscape Menu
              setIsPaused(false); // Resume the game if it is paused
            }}
            className="py-1 px-3 sm:px-3.5 md:py-1.5 md:px-4 lg:py-2 lg:px-5 rounded-lg bg-blue-600 border border-transparent hover:bg-blue-500 text-white text-[10px] sm:text-xs lg:text-sm font-extrabold uppercase tracking-wider cursor-pointer transition-colors duration-150 flex items-center gap-1 md:gap-1.5 shadow-none whitespace-nowrap active:scale-95"
          >
            <Play className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 fill-current" />
            <span>{t.startOrResume}</span>
          </button>
        </div>
      </div>

      {/* B. MAIN CONTENT: CLEAN BALANCED FULL-WIDTH PANEL */}
      <div className="flex-1 min-h-0 bg-[#131b3e]/85 border border-[#3b4c8a]/40 rounded-xl p-2.5 md:p-3.5 lg:p-4 flex flex-col justify-between gap-2 md:gap-3">
        {/* Play Mode Selector */}
        <div className="flex flex-col gap-1 md:gap-1.5 shrink-0">
          <div className="flex items-center justify-between shrink-0">
            <span className="text-[9px] md:text-[10.5px] lg:text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
              {t.playModeTitle}
            </span>
          </div>

          {/* Play Mode Buttons */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 shrink-0 h-8 md:h-9.5 lg:h-11">
            {/* Classic Mode */}
            <button
              onClick={() => {
                synth.playSelect();
                if (memoryMode !== "solo") {
                  setDifficulty("3x4");
                  setMemoryMode("solo");
                }
              }}
              className={`h-full rounded-xl text-[10px] md:text-xs lg:text-sm tracking-wide transition-colors duration-150 border flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer ${
                memoryMode === "solo"
                  ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                  : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
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
                  const finalDiff = (difficulty === "5x5" || difficulty === "6x6" || difficulty === "6x8" || difficulty === "7x8") ? difficulty : "5x5";
                  setDifficulty(finalDiff);
                  setMemoryMode("twoPlayers");
                }
              }}
              className={`h-full rounded-xl text-[10px] md:text-xs lg:text-sm tracking-wide transition-colors duration-150 border flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer ${
                memoryMode === "twoPlayers"
                  ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                  : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
              }`}
            >
              <Users className={`w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 ${memoryMode === "twoPlayers" ? "text-slate-950" : "text-rose-400"}`} />
              <span className="whitespace-nowrap">{t.modeTwoPlayers}</span>
            </button>

            {/* Battle Mode */}
            <button
              onClick={() => {
                synth.playSelect();
                if (memoryMode !== "vsBot") {
                  const finalDiff = getBoardSizeForTrophies(vsBotTrophies);
                  setDifficulty(finalDiff);
                  setMemoryMode("vsBot");
                }
              }}
              className={`h-full rounded-xl text-[10px] md:text-xs lg:text-sm tracking-wide transition-colors duration-150 border flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer ${
                memoryMode === "vsBot"
                  ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                  : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
              }`}
            >
              <Bot className={`w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 ${memoryMode === "vsBot" ? "text-slate-950" : "text-cyan-400"}`} />
              <span className="whitespace-nowrap">{t.modeBattle}</span>
            </button>
          </div>
        </div>

        {/* Selected Mode Detail Container */}
        <div className="flex-1 min-h-0 bg-[#1a2554]/90 border border-[#485da6]/30 rounded-xl p-2.5 md:p-3.5 flex flex-col justify-center gap-2">
          {memoryMode === "vsBot" && (
            <div className="flex flex-col justify-center w-full h-full max-w-xl mx-auto gap-2.5 md:gap-3.5">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5 md:gap-3">
                  <div className={`p-1.5 md:p-2 rounded-xl border ${currentRank.bg} ${currentRank.border} shrink-0 flex items-center justify-center`}>
                    {currentRank.badgeType === "shield" ? (
                      <Shield className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${currentRank.color}`} fill={currentRank.fill} />
                    ) : (
                      <Crown className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${currentRank.color}`} fill={currentRank.fill} />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[8.5px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                      {t.currentRankLabel ? t.currentRankLabel.toUpperCase() : "CURRENT RANK"}
                    </span>
                    <span className={`font-black text-sm md:text-base uppercase ${currentRank.color} leading-none`}>
                      {t[currentRank.nameKey]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-wider text-slate-300">
                  <span>{t.progressLabel ? `${t.progressLabel.toUpperCase()} PROGRESS` : "RANK PROGRESS"}</span>
                  <span className="font-mono text-cyan-400 font-black text-sm md:text-base">
                    {rankProgressDisplay}
                  </span>
                </div>
              </div>

              <div className="w-full h-5 md:h-6 lg:h-7 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 p-0.5 relative">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${rankProgressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {memoryMode === "solo" && (
            <div className="flex flex-col gap-2 md:gap-2.5 w-full justify-center">
              {/* Prominent Score Indicators in 2 Columns */}
              <div className="grid grid-cols-2 gap-2.5 max-w-xl mx-auto w-full">
                <div className="flex items-center justify-between p-1.5 px-3 md:p-2 md:px-4 rounded-xl bg-slate-950/40 border border-white/5 text-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                    <span className="font-extrabold text-[9px] md:text-xs uppercase tracking-wider leading-none whitespace-nowrap">{t.totalScore.replace(":", "")}</span>
                  </div>
                  <span className="font-mono font-black text-xs md:text-sm bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-500/30">{currentScore}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 px-3 md:p-2 md:px-4 rounded-xl bg-slate-950/40 border border-white/5 text-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-[9px] md:text-xs uppercase tracking-wider leading-none whitespace-nowrap">{t.highScore.replace(":", "")}</span>
                  </div>
                  <span className="font-mono font-black text-xs md:text-sm bg-amber-950/50 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-500/30">{currentHighScore}</span>
                </div>
              </div>

              {/* Board Size Selection with Clear Divider and Heading */}
              <div className="flex flex-col gap-1 w-full border-t border-white/10 pt-1.5">
                <span className="text-[8.5px] md:text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest text-left leading-none">
                  {t.challengeLevel}
                </span>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2 w-full">
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
                        className={`py-1.5 px-2 md:py-2 md:px-2.5 rounded-lg text-[9.5px] md:text-xs font-black transition-colors duration-150 border flex items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                            : isLocked
                            ? "bg-slate-900 text-amber-300 border border-amber-500/40 shadow-none"
                            : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Video className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-400 fill-amber-400/20 shrink-0" />
                            <span className="whitespace-nowrap">{opt.label}</span>
                            <span className="text-[7px] md:text-[8px] font-black uppercase text-amber-300 bg-amber-400/20 px-0.5 rounded border border-amber-400/40 shrink-0">AD</span>
                          </>
                        ) : (
                          <>
                            <span className="whitespace-nowrap">{opt.label}</span>
                            {remainingTime && (
                              <span className="text-[7px] md:text-[8px] font-extrabold text-amber-400/90 bg-amber-400/10 px-0.5 rounded shrink-0 leading-none">{remainingTime}</span>
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

          {memoryMode === "twoPlayers" && (
            <div className="flex flex-col justify-center w-full h-full gap-2 md:gap-3">
              <div className="flex items-center justify-between w-full gap-3 max-w-xl mx-auto">
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {/* Player 1 */}
                  <div className="flex items-center justify-between p-1.5 px-3 md:p-2 md:px-4 rounded-xl bg-slate-950/40 border border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-350">
                      <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)] animate-pulse" />
                      <span className="font-extrabold text-[9px] md:text-xs uppercase tracking-wider">P1</span>
                    </div>
                    <span className="text-blue-300 font-black text-xs md:text-sm font-mono bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/30">
                      {winsP1}
                    </span>
                  </div>

                  {/* Player 2 */}
                  <div className="flex items-center justify-between p-1.5 px-3 md:p-2 md:px-4 rounded-xl bg-slate-950/40 border border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-350">
                      <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_4px_rgba(251,113,133,0.8)] animate-pulse" />
                      <span className="font-extrabold text-[9px] md:text-xs uppercase tracking-wider">P2</span>
                    </div>
                    <span className="text-rose-300 font-black text-xs md:text-sm font-mono bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/30">
                      {winsP2}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    synth.playSelect();
                    setShowResetConfirm(true);
                  }}
                  className="py-1.5 px-3 md:py-2 md:px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/40 text-rose-300 text-[9.5px] md:text-xs font-black uppercase tracking-wider cursor-pointer transition-colors duration-150 shrink-0 whitespace-nowrap"
                >
                  Reset
                </button>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <span className="text-[8.5px] md:text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest leading-none text-left">
                  {t.challengeLevel}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
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
                        className={`py-1.5 px-2 md:py-2 md:px-3 rounded-lg text-[9.5px] md:text-xs font-black transition-colors duration-150 border flex items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                            : isLocked
                            ? "bg-slate-900 text-amber-300 border border-amber-500/40 shadow-none"
                            : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Video className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-400 fill-amber-400/20 shrink-0" />
                            <span className="whitespace-nowrap">{opt.label}</span>
                            <span className="text-[7px] md:text-[8px] font-black uppercase text-amber-300 bg-amber-400/20 px-0.5 rounded border border-amber-400/40 shrink-0">AD</span>
                          </>
                        ) : (
                          <>
                            <span className="whitespace-nowrap">{opt.label}</span>
                            {remainingTime && (
                              <span className="text-[7px] md:text-[8px] font-extrabold text-amber-400/90 bg-amber-400/10 px-0.5 rounded shrink-0 leading-none">{remainingTime}</span>
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
    </div>
  );
};
