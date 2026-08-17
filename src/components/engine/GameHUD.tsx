import React from "react";
import {
  Menu,
  Trophy,
  Play,
  Pause,
  Lightbulb,
  Volume2,
  VolumeX,
  Shield,
  Crown,
} from "lucide-react";
import { getRankForTrophies, getBotRankInfo } from "../../BOT/config";
import { getTargetPairsToWin } from "../../emoji/memory";

export interface GameHUDProps {
  layoutConfig: {
    showHUD: boolean;
    [key: string]: any;
  };
  synth: {
    playSelect: () => void;
    playPause: () => void;
    playResume: () => void;
  };
  setIsMobileConfigOpen: (open: boolean) => void;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  isPaused: boolean;
  activeTab: string;
  memoryMode: "vsBot" | "solo" | "twoPlayers";
  vsBotTrophies: number;
  winsP1: number;
  winsP2: number;
  currentScore: number;
  level: number;
  t: Record<string, any>;
  memoryFinished?: boolean;
  handleOpenHintModal?: () => void;
  hintsCount?: number;
  memoryBusy?: boolean;
  connectionsCount?: number;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  isPortrait?: boolean;
  isMobileLandscape?: boolean;
  isTabletLandscape?: boolean;
  p1Score?: number;
  p2Score?: number;
  activePlayer?: 1 | 2;
  botUsername?: string;
  currentBotDifficulty?: number;
  consecutiveMatches?: number;
  difficulty?: string;
  memoryCards?: any[];
}

export const GameHUD: React.FC<GameHUDProps> = ({
  layoutConfig,
  synth,
  setIsMobileConfigOpen,
  setIsPaused,
  isPaused,
  activeTab,
  memoryMode,
  vsBotTrophies,
  winsP1,
  winsP2,
  currentScore,
  level,
  t,
  memoryFinished = false,
  handleOpenHintModal,
  hintsCount = 0,
  memoryBusy = false,
  connectionsCount,
  soundOn,
  setSoundOn,
  isPortrait = false,
  isMobileLandscape = false,
  isTabletLandscape = false,
  p1Score = 0,
  p2Score = 0,
  activePlayer = 1,
  botUsername = "ROBOMATCH",
  currentBotDifficulty = 1,
  consecutiveMatches = 0,
  difficulty = "5x5",
  memoryCards = [],
}) => {
  if (!layoutConfig.showHUD) return null;

  const playerRank = getRankForTrophies(vsBotTrophies);
  const botRank = getBotRankInfo(currentBotDifficulty);

  // Integrated Top Player Info Bar for Mobile/Tablet Portrait and Landscape in 2 Players and Challenge (vsBot) modes
  if (
    activeTab === "memory" &&
    (memoryMode === "twoPlayers" || memoryMode === "vsBot") &&
    (isPortrait || isMobileLandscape || isTabletLandscape)
  ) {
    return (
      <div className="relative z-30 flex items-center justify-between gap-1 sm:gap-2 border-b border-white/10 pt-0.5 pb-1 mb-1 w-full shrink-0 select-none">
        {/* Left: Menu Button + Player 1 / YOU Panel */}
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <button
            id="btn-hud-menu"
            onClick={() => {
              synth.playSelect();
              setIsMobileConfigOpen(true);
            }}
            className="py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 border border-amber-300 flex items-center gap-1.5 text-[11px] sm:text-xs font-black cursor-pointer transition-colors shrink-0"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 stroke-[2.5]" />
            <span className="hidden min-[360px]:inline">Menu</span>
          </button>

          {/* Player 1 / YOU Panel */}
          <div
            className={`flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2.5 sm:py-1 rounded-xl border transition-all duration-300 shrink-0 ${
              activePlayer === 1
                ? "bg-gradient-to-r from-blue-600/90 to-indigo-800/90 border-blue-300 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)] ring-1 ring-blue-400/50 scale-[1.02]"
                : "bg-blue-950/70 border-blue-900/40 text-blue-200/70 opacity-60"
            }`}
          >
            {memoryMode !== "vsBot" && (
              <div
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0 ${
                  activePlayer === 1 ? "bg-white text-blue-600 animate-pulse font-black" : "bg-blue-900 text-blue-200 font-bold"
                }`}
              >
                <span className="text-[8px] sm:text-[9px] leading-none">1</span>
              </div>
            )}
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider truncate max-w-[42px] min-[380px]:max-w-[70px] landscape:max-w-[120px] sm:max-w-none">
                {memoryMode === "vsBot" ? (t.labelYou || "YOU") : (t.labelP1 || "P1")}
              </span>
              {memoryMode === "vsBot" ? (
                <div
                  className={`px-1.5 py-0.5 rounded-lg border-2 ${playerRank.border} bg-slate-950/85 shadow-md flex items-center gap-1 shrink-0`}
                  title={t[playerRank.nameKey]}
                >
                  {playerRank.badgeType === "shield" ? (
                    <Shield className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${playerRank.color} drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]`} fill={playerRank.fill} />
                  ) : (
                    <Crown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${playerRank.color} drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]`} fill={playerRank.fill} />
                  )}
                  <span className="text-xs sm:text-sm font-black font-mono text-cyan-300 leading-none">
                    {p1Score}
                  </span>
                </div>
              ) : (
                <span className="text-xs sm:text-base font-black font-mono ml-0.5 text-cyan-300 drop-shadow-sm">
                  {p1Score}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Score Ratio / Match Status (2 Players) or Trophy Info (Challenge Mode) */}
        <div className="flex flex-col items-center justify-center px-1.5 py-0.5 rounded-xl bg-slate-950/70 border border-white/10 shrink-0 min-w-0 shadow-inner">
          {memoryMode === "twoPlayers" ? (
            <>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-black font-mono text-slate-100">
                <span className="text-blue-300">{p1Score}</span>
                <span className="text-slate-500 font-normal">:</span>
                <span className="text-rose-300">{p2Score}</span>
              </div>
              <div className="flex items-center gap-1 text-[7px] sm:text-[9px] font-black uppercase tracking-wider">
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-ping ${
                    activePlayer === 1 ? "bg-blue-400" : "bg-rose-400"
                  }`}
                />
                <span className={activePlayer === 1 ? "text-blue-300" : "text-rose-300"}>
                  {activePlayer === 1 ? "P1 TURN" : "P2 TURN"}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-black font-mono text-amber-300">
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
                <span>{vsBotTrophies}</span>
              </div>
              <div className="flex items-center gap-1 text-[7px] sm:text-[9px] font-black uppercase tracking-wider">
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-ping ${
                    activePlayer === 1 ? "bg-blue-400" : "bg-purple-400"
                  }`}
                />
                <span className={activePlayer === 1 ? "text-blue-300" : "text-purple-300"}>
                  {activePlayer === 1 ? "YOUR TURN" : "BOT TURN"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right: P2 / Bot Panel + Sound Button */}
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <div
            className={`flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2.5 sm:py-1 rounded-xl border transition-all duration-300 shrink-0 ${
              activePlayer === 2
                ? "bg-gradient-to-r from-rose-600/90 to-red-800/90 border-rose-300 text-white shadow-[0_0_10px_rgba(244,63,94,0.6)] ring-1 ring-rose-400/50 scale-[1.02]"
                : "bg-rose-950/70 border-rose-900/40 text-rose-200/70 opacity-60"
            }`}
          >
            {memoryMode === "vsBot" ? (
              <div
                className={`px-1.5 py-0.5 rounded-lg border-2 ${botRank.border} bg-slate-950/85 shadow-md flex items-center gap-1 shrink-0`}
              >
                {botRank.badgeType === "shield" ? (
                  <Shield className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${botRank.color} drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]`} fill={botRank.fill} />
                ) : (
                  <Crown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${botRank.color} drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]`} fill={botRank.fill} />
                )}
                <span className="text-xs sm:text-sm font-black font-mono text-amber-300 leading-none">
                  {p2Score}
                </span>
              </div>
            ) : (
              <span className="text-xs sm:text-base font-black font-mono mr-0.5 text-amber-300 drop-shadow-sm">
                {p2Score}
              </span>
            )}
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider truncate max-w-[42px] min-[380px]:max-w-[70px] landscape:max-w-[120px] sm:max-w-none">
              {memoryMode === "vsBot" ? (botUsername || "BOT") : (t.labelP2 || "P2")}
            </span>
            {memoryMode !== "vsBot" && (
              <div
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0 ${
                  activePlayer === 2 ? "bg-white text-rose-600 animate-pulse font-black" : "bg-rose-900 text-rose-200 font-bold"
                }`}
              >
                <span className="text-[8px] sm:text-[9px] leading-none">2</span>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              synth.playSelect();
              setSoundOn(!soundOn);
            }}
            className="p-1 sm:p-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-slate-200 cursor-pointer active:scale-95 transition-all shrink-0"
            title="Toggle Sound"
          >
            {soundOn ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-30 flex items-center justify-between gap-2 border-b border-white/10 pt-0.5 pb-1.5 mb-1.5 landscape:pb-1 landscape:mb-1 w-full shrink-0">
      {/* Left: Setup Menu Button */}
      <button
        id="btn-hud-menu"
        onClick={() => {
          synth.playSelect();
          setIsMobileConfigOpen(true);
        }}
        className="py-1 px-2.5 md:py-1.5 md:px-3.5 lg:py-2 lg:px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 border border-amber-300 flex items-center gap-1.5 text-[11px] md:text-xs lg:text-sm font-black tracking-wide cursor-pointer transition-colors whitespace-nowrap"
      >
        <Menu className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 text-slate-950 stroke-[2.5]" />
        <span>Menu</span>
      </button>

      {/* Center: Live Stats Info (Compact) */}
      <div className="flex items-center gap-2 text-[10px] md:text-xs lg:text-sm font-extrabold font-mono bg-slate-950/40 px-2.5 py-1 md:px-3.5 md:py-1.5 lg:px-4 lg:py-2 rounded-xl border border-white/5">
        {activeTab === "memory" ? (
          memoryMode === "vsBot" ? (
            <div className="flex items-center gap-1 text-amber-300">
              <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-amber-400" />
              <span>{vsBotTrophies} 🏆</span>
            </div>
          ) : memoryMode === "twoPlayers" ? (
            <div className="flex items-center gap-1.5">
              <span className="text-blue-300">P1: {winsP1}</span>
              <span className="text-slate-500">|</span>
              <span className="text-rose-300">P2: {winsP2}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-emerald-300">
              <span>{currentScore} pts</span>
            </div>
          )
        ) : (
          <div className="text-cyan-300">
            {t.stage} {level}
          </div>
        )}
      </div>

      {/* Right: Grouped Action Icons */}
      <div className="flex items-center gap-1 md:gap-1.5">
        {/* Cables info for connect mode */}
        {activeTab === "connect" && connectionsCount !== undefined && (
          <div className="text-[10px] font-extrabold font-mono bg-slate-950/40 px-2.5 py-1 rounded-xl border border-white/5 text-slate-200">
            {t.cables} <span className="text-cyan-400">{connectionsCount}/3</span>
          </div>
        )}

        {/* Pause Button for Connect mode */}
        {activeTab === "connect" && (
          <button
            id="btn-hud-pause-match"
            onClick={() => {
              if (isPaused) {
                synth.playResume();
              } else {
                synth.playPause();
              }
              setIsPaused((prev) => !prev);
            }}
            className="p-1.5 md:p-2 lg:p-2.5 rounded-lg bg-slate-950/80 border border-white/10 text-slate-200 cursor-pointer active:scale-95 transition-all"
            title={isPaused ? t.resumeBtn : t.pauseBtn}
          >
            {isPaused ? (
              <Play className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 fill-current text-emerald-400" />
            ) : (
              <Pause className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 fill-current text-amber-400" />
            )}
          </button>
        )}

        {/* Pause & Hint Buttons for Memory Solo mode */}
        {activeTab === "memory" && memoryMode === "solo" && !memoryFinished && (
          <>
            <button
              id="btn-hud-pause"
              onClick={() => {
                if (isPaused) {
                  synth.playResume();
                } else {
                  synth.playPause();
                }
                setIsPaused((prev) => !prev);
              }}
              className="p-1.5 md:p-2 lg:p-2.5 rounded-lg bg-slate-950/80 border border-white/10 text-slate-200 cursor-pointer active:scale-95 transition-all"
              title={isPaused ? t.resumeBtn : t.pauseBtn}
            >
              {isPaused ? (
                <Play className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 fill-current text-emerald-400" />
              ) : (
                <Pause className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 fill-current text-amber-400" />
              )}
            </button>

            {handleOpenHintModal && (
              <button
                id="btn-hud-hint"
                onClick={handleOpenHintModal}
                disabled={memoryBusy}
                className={`py-1 px-2.5 md:py-1.5 md:px-3.5 lg:py-2 lg:px-4 rounded-2xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] hover:from-[#ffe066] hover:to-[#fcae00] text-[#132257] border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.45)] hover:shadow-[0_8px_18px_rgba(234,179,8,0.45)] -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  hintsCount > 0 ? "animate-pulse" : "opacity-90"
                }`}
                title={t.hintLabel}
              >
                <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 fill-[#132257] text-[#132257] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
                <span className="text-[9px] md:text-[10px] lg:text-xs font-black px-1.5 py-0.5 rounded text-center leading-none bg-[#132257] text-amber-300 shadow-sm">
                  {hintsCount > 0 ? hintsCount : "+"}
                </span>
              </button>
            )}
          </>
        )}

        {/* Sound Toggle */}
        <button
          onClick={() => {
            synth.playSelect();
            setSoundOn(!soundOn);
          }}
          className="p-1.5 md:p-2 lg:p-2.5 rounded-lg bg-slate-950/80 border border-white/10 text-slate-200 cursor-pointer active:scale-95 transition-all"
        >
          {soundOn ? (
            <Volume2 className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-rose-400" />
          )}
        </button>
      </div>
    </div>
  );
};

export interface PlayerScoreHUDProps {
  memoryMode: "vsBot" | "solo" | "twoPlayers";
  difficulty: string;
  p1Score: number;
  p2Score: number;
  activePlayer: 1 | 2;
  consecutiveMatches: number;
  botUsername: string;
  currentBotDifficulty: number;
  vsBotTrophies?: number;
  t: Record<string, any>;
  isPortrait?: boolean;
  isMobileLandscape?: boolean;
  isTabletLandscape?: boolean;
  memoryCards?: any[];
}

export const PlayerScoreHUD: React.FC<PlayerScoreHUDProps> = ({
  memoryMode,
  difficulty,
  p1Score,
  p2Score,
  activePlayer,
  consecutiveMatches,
  botUsername,
  currentBotDifficulty,
  vsBotTrophies = 0,
  t,
  isPortrait = false,
  isMobileLandscape = false,
  isTabletLandscape = false,
  memoryCards = [],
}) => {
  if (memoryMode !== "twoPlayers" && memoryMode !== "vsBot") return null;
  if (isPortrait || isMobileLandscape || isTabletLandscape) return null;

  const cardCount = memoryCards?.length || 0;
  const targetPairsToWin = getTargetPairsToWin(difficulty, cardCount);
  const playerRank = getRankForTrophies(vsBotTrophies);
  const botRank = getBotRankInfo(currentBotDifficulty);

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto mb-1 sm:mb-2 px-1 sm:px-2 flex flex-col gap-1 font-sans select-none animate-fade-in shrink-0">
      <style>{`
        @keyframes winning-glow-blue {
          0%, 100% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.6), inset 0 0 10px rgba(59, 130, 246, 0.3); border-color: rgba(147, 197, 253, 0.8); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 1), inset 0 0 15px rgba(255, 255, 255, 0.8); border-color: rgba(255, 255, 255, 1); }
        }
        @keyframes winning-glow-red {
          0%, 100% { box-shadow: 0 0 12px rgba(244, 63, 94, 0.6), inset 0 0 10px rgba(244, 63, 94, 0.3); border-color: rgba(252, 165, 165, 0.8); }
          50% { box-shadow: 0 0 30px rgba(244, 63, 94, 1), inset 0 0 15px rgba(255, 255, 255, 0.8); border-color: rgba(255, 255, 255, 1); }
        }
        .animate-winning-blue {
          animation: winning-glow-blue 1.5s infinite ease-in-out;
        }
        .animate-winning-red {
          animation: winning-glow-red 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* Player Score Cards */}
      <div className="flex items-center justify-between gap-1 sm:gap-3 md:gap-4 py-0.5 sm:py-1.5 md:py-2 landscape:py-0.5 landscape:gap-1.5 w-full min-w-0">
        {/* Player 1 Box (Blue Theme) */}
        <div
          className={`flex-1 min-w-0 p-1 sm:p-2 md:p-2.5 landscape:p-1 landscape:px-2 rounded-lg sm:rounded-xl border transition-all duration-300 flex flex-col gap-0.5 sm:gap-1 landscape:gap-0.5 shadow-md ${
            memoryMode !== "vsBot" && p1Score >= targetPairsToWin
              ? "bg-gradient-to-br from-blue-600 to-indigo-800 text-white border-blue-200 scale-[1.03] animate-winning-blue z-10 border-2 ring-2 ring-blue-500/30"
              : memoryMode !== "vsBot" && p2Score >= targetPairsToWin
              ? "bg-blue-950/90 text-blue-200/50 border-blue-900/20 scale-95 opacity-30 border z-0 filter grayscale-[40%]"
              : activePlayer === 1
              ? "bg-gradient-to-br from-blue-600 to-indigo-800 text-white border-blue-300 scale-[1.02] shadow-[0_0_12px_rgba(59,130,246,0.6)] brightness-110 border-2 z-10"
              : "bg-blue-950/90 text-blue-200/80 border-blue-900/40 scale-100 opacity-60 border z-0"
          }`}
        >
          <div className="flex flex-col landscape:flex-row items-center justify-center landscape:justify-between min-w-0 w-full landscape:gap-1">
            <div className="flex items-center gap-0.5 sm:gap-1.5 justify-center landscape:justify-start min-w-0">
              {memoryMode !== "vsBot" && (
                <div
                  className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 landscape:w-3 landscape:h-3 rounded-full flex items-center justify-center shrink-0 ${
                    activePlayer === 1
                      ? "bg-white text-blue-600 animate-pulse"
                      : "bg-blue-900 text-blue-200"
                  }`}
                >
                  <span className="text-[6px] sm:text-[9px] landscape:text-[7px] font-black">1</span>
                </div>
              )}
              <span className="text-[8px] sm:text-[10px] md:text-[11px] landscape:text-[9px] font-black uppercase tracking-wider truncate">
                {memoryMode === "vsBot" ? t.labelYou : t.labelP1}
              </span>
              {memoryMode === "vsBot" && (
                <div
                  className={`px-1.5 py-0.5 rounded-md border-2 ${playerRank.border} bg-slate-950/85 shadow-sm flex items-center gap-1 shrink-0`}
                  title={t[playerRank.nameKey]}
                >
                  {playerRank.badgeType === "shield" ? (
                    <Shield className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${playerRank.color}`} fill={playerRank.fill} />
                  ) : (
                    <Crown className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${playerRank.color}`} fill={playerRank.fill} />
                  )}
                  <span className="text-[10px] sm:text-xs font-black font-mono text-cyan-300 leading-none">
                    {p1Score}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-0.5 sm:mt-0.5 landscape:mt-0 flex items-baseline gap-0.5 sm:gap-1 justify-center landscape:justify-end shrink-0">
              <span className="text-[7px] sm:text-[8px] uppercase font-black tracking-wider opacity-70 truncate hidden landscape:inline sm:inline">
                Score:
              </span>
              <span className="text-xs sm:text-lg md:text-2xl landscape:text-xs landscape:sm:text-sm font-black font-mono leading-none">
                {p1Score}
              </span>
            </div>
          </div>

          {/* Score Progress Bar */}
          <div className="flex gap-0.5 sm:gap-1 w-full transition-all duration-300 mt-0.5">
            {[...Array(targetPairsToWin)].map((_, i) => {
              const isFilled = p1Score > i;
              return (
                <div
                  key={i}
                  className="flex-1 h-0.5 sm:h-1 landscape:h-0.5 rounded-full overflow-hidden bg-white/20 border border-white/5 relative"
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-cyan-300 to-blue-400 shadow-[0_0_6px_rgba(103,232,249,0.8)]"
                    style={{
                      width: isFilled ? "100%" : "0%",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Turn Indicator in middle */}
        <div className="flex flex-col items-center justify-center shrink-0 px-0.5 sm:px-1">
          <div
            className={`px-1 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[6px] sm:text-[8px] md:text-[9px] landscape:text-[7px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5 sm:gap-1 transition-colors ${
              activePlayer === 1
                ? "bg-blue-100 text-blue-600 border border-blue-200"
                : "bg-rose-100 text-rose-600 border border-rose-200"
            }`}
          >
            <span
              className={`w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full ${
                activePlayer === 1 ? "bg-blue-600" : "bg-rose-600"
              } animate-ping`}
            ></span>
            <span className="truncate max-w-[38px] sm:max-w-none">
              {memoryMode === "vsBot"
                ? activePlayer === 1
                  ? t.yourTurn
                  : t.botTurnText(botUsername)
                : activePlayer === 1
                ? t.p1Turn
                : t.p2Turn}
            </span>
          </div>
          {consecutiveMatches > 0 && (
            <span className="text-[6px] sm:text-[7px] font-extrabold text-amber-600 mt-0.5 uppercase animate-pulse">
              Streak: {consecutiveMatches}/3
            </span>
          )}
        </div>

        {/* Player 2 Box (Red Theme) */}
        <div
          className={`flex-1 min-w-0 p-1 sm:p-2 md:p-2.5 landscape:p-1 landscape:px-2 rounded-lg sm:rounded-xl border transition-all duration-300 flex flex-col gap-0.5 sm:gap-1 landscape:gap-0.5 shadow-md ${
            memoryMode !== "vsBot" && p2Score >= targetPairsToWin
              ? "bg-gradient-to-br from-rose-600 to-red-800 text-white border-rose-200 scale-[1.03] animate-winning-red z-10 border-2 ring-2 ring-rose-500/30"
              : memoryMode !== "vsBot" && p1Score >= targetPairsToWin
              ? "bg-rose-950/90 text-rose-200/50 border-rose-900/20 scale-95 opacity-30 border z-0 filter grayscale-[40%]"
              : activePlayer === 2
              ? "bg-gradient-to-br from-rose-600 to-red-800 text-white border-rose-300 scale-[1.02] shadow-[0_0_12px_rgba(244,63,94,0.6)] brightness-110 border-2 z-10"
              : "bg-rose-950/90 text-rose-200/80 border-rose-900/40 scale-100 opacity-60 border z-0"
          }`}
        >
          <div className="flex flex-col landscape:flex-row items-center justify-center landscape:justify-between min-w-0 w-full landscape:gap-1">
            <div className="flex items-center gap-0.5 sm:gap-1.5 justify-center landscape:justify-start min-w-0">
              {memoryMode !== "vsBot" && (
                <div
                  className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 landscape:w-3 landscape:h-3 rounded-full flex items-center justify-center shrink-0 ${
                    activePlayer === 2
                      ? "bg-white text-rose-600 animate-pulse"
                      : "bg-rose-900 text-rose-200"
                  }`}
                >
                  <span className="text-[6px] sm:text-[9px] landscape:text-[7px] font-black">2</span>
                </div>
              )}
              {memoryMode === "vsBot" && (
                <div
                  className={`px-1.5 py-0.5 rounded-md border-2 ${botRank.border} bg-slate-950/85 shadow-sm flex items-center gap-1 shrink-0`}
                >
                  {botRank.badgeType === "shield" ? (
                    <Shield className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${botRank.color}`} fill={botRank.fill} />
                  ) : (
                    <Crown className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${botRank.color}`} fill={botRank.fill} />
                  )}
                  <span className="text-[10px] sm:text-xs font-black font-mono text-amber-300 leading-none">
                    {p2Score}
                  </span>
                </div>
              )}
              <span className="text-[8px] sm:text-[10px] md:text-[11px] landscape:text-[9px] font-black uppercase tracking-wider truncate">
                {memoryMode === "vsBot" ? `${botUsername} (Lv. ${currentBotDifficulty})` : "Player 2"}
              </span>
            </div>
            <div className="mt-0.5 sm:mt-0.5 landscape:mt-0 flex items-baseline gap-0.5 sm:gap-1 justify-center landscape:justify-end shrink-0">
              <span className="text-[7px] sm:text-[8px] uppercase font-black tracking-wider opacity-70 truncate hidden landscape:inline sm:inline">
                Score:
              </span>
              <span className="text-xs sm:text-lg md:text-2xl landscape:text-xs landscape:sm:text-sm font-black font-mono leading-none">
                {p2Score}
              </span>
            </div>
          </div>

          {/* Score Progress Bar */}
          <div className="flex gap-0.5 sm:gap-1 w-full transition-all duration-300 mt-0.5">
            {[...Array(targetPairsToWin)].map((_, i) => {
              const isFilled = p2Score > i;
              return (
                <div
                  key={i}
                  className="flex-1 h-0.5 sm:h-1 landscape:h-0.5 rounded-full overflow-hidden bg-white/20 border border-white/5 relative"
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-yellow-300 to-rose-400 shadow-[0_0_6px_rgba(253,224,71,0.8)]"
                    style={{
                      width: isFilled ? "100%" : "0%",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
