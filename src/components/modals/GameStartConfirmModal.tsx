import React from "react";
import { Video } from "lucide-react";
import { PanelBackground } from "../PanelBackground";
import { Language } from "../../locales";

export interface GameStartConfirmModalProps {
  showMemoryConfirm: boolean;
  setShowMemoryConfirm: (show: boolean) => void;
  language: Language;
  pendingMemoryMode: "solo" | "vsBot" | "twoPlayers";
  pendingDifficulty: string;
  vsBotTrophies: number;
  t: Record<string, any>;
  synth: {
    playSelect: () => void;
  };
  restoreSavedVsBotMatch: (saved: any) => void;
  setMemoryMode: (mode: "solo" | "vsBot" | "twoPlayers") => void;
  setDifficulty: (diff: string) => void;
  generateMemoryGame: (diff: string) => void;
  getBoardSizeForTrophies: (trophies: number) => string;
  isBoardSizeUnlocked: (diff: string, mode: "solo" | "vsBot" | "twoPlayers") => boolean;
  handleUnlockBoardSize: (diff: any, callback: () => void) => void;
}

export const GameStartConfirmModal: React.FC<GameStartConfirmModalProps> = ({
  showMemoryConfirm,
  setShowMemoryConfirm,
  language,
  pendingMemoryMode,
  pendingDifficulty,
  vsBotTrophies,
  t,
  synth,
  restoreSavedVsBotMatch,
  setMemoryMode,
  setDifficulty,
  generateMemoryGame,
  getBoardSizeForTrophies,
  isBoardSizeUnlocked,
  handleUnlockBoardSize,
}) => {
  if (!showMemoryConfirm) return null;

  const getConfirmText = () => {
    switch (language) {
      case "vi":
        return {
          title: "Sẵn sàng bắt đầu?",
          message: "Cấu hình trò chơi của bạn đã sẵn sàng. Nhấn Bắt đầu khi bạn đã sẵn sàng.",
          start: "Bắt đầu",
          cancel: "Hủy",
        };
      case "es":
        return {
          title: "¿Listo para comenzar?",
          message: "Tus ajustes de juego están listos. Presiona Empezar cuando estés listo para comenzar.",
          start: "Empezar",
          cancel: "Cancelar",
        };
      case "pt":
        return {
          title: "Pronto para começar?",
          message: "As suas configurações de jogo estão prontas. Pressione Começar quando estiver pronto.",
          start: "Começar",
          cancel: "Cancelar",
        };
      default:
        return {
          title: "Ready to Start?",
          message: "Your game settings are ready. Press Start when you're ready to begin.",
          start: "Start Game",
          cancel: "Cancel",
        };
    }
  };

  const confirmText = getConfirmText();

  const saved = localStorage.getItem("emoji_brainpop_saved_vs_bot_match");
  let parsedSaved: any = null;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.memoryCards && parsed.memoryCards.length > 0 && !parsed.memoryFinished) {
        parsedSaved = parsed;
      }
    } catch (e) {}
  }

  return (
    <div
      id="memory-confirm-backdrop"
      className="fixed inset-0 bg-[#0d101b]/80 backdrop-blur-md z-[130] flex items-center justify-center p-4 animate-fade-in-backdrop pointer-events-auto touch-manipulation"
      onClick={() => setShowMemoryConfirm(false)}
    >
      <div
        id="memory-confirm-content"
        className="bg-[#252f67]/95 md:backdrop-blur-xl backdrop-blur-none border-2 border-[#546bbf]/60 rounded-3xl w-full max-w-sm p-6 shadow-[0_16px_40px_rgba(10,14,35,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] relative overflow-hidden text-slate-100 animate-scale-up-fade"
        onClick={(e) => e.stopPropagation()}
      >
        <PanelBackground showTopBar={true} />
        {/* Top border indicator line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-amber-400"></div>

        {/* Title */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="w-12 h-12 bg-indigo-500/20 text-indigo-300 rounded-2xl flex items-center justify-center mb-3 border-2 border-indigo-400/30 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
            <span className="text-2xl animate-bounce">🎮</span>
          </div>
          <h3 className="text-xl font-black tracking-tight text-white">{confirmText.title}</h3>
        </div>

        {/* Message */}
        <p className="text-slate-200 text-sm leading-relaxed text-center mb-6 font-bold">
          {confirmText.message}
        </p>

        {/* Selected Specs display as secondary helper details */}
        <div className="bg-[#1e2552]/70 rounded-2xl p-3 mb-6 border-2 border-[#3f509d]/40 text-xs flex justify-around shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.12)]">
          <div className="flex flex-col items-center">
            <span className="text-slate-300 font-black uppercase text-[9px] mb-0.5 tracking-wider">{t.playModeLabel || "Mode"}</span>
            <span className="text-cyan-300 font-black uppercase text-[10px] tracking-wide">
              {pendingMemoryMode === "solo" ? t.modeClassic : pendingMemoryMode === "twoPlayers" ? t.modeTwoPlayers : t.modeBattle}
            </span>
          </div>
          <div className="h-6 w-[2px] bg-[#3f509d]/40"></div>
          <div className="flex flex-col items-center">
            <span className="text-slate-300 font-black uppercase text-[9px] mb-0.5 tracking-wider">{t.challengeLevel?.replace(":", "") || "Grid"}</span>
            <span className="text-amber-300 font-black uppercase text-[10px] tracking-wide">
              {pendingMemoryMode === "vsBot"
                ? t.boardSizeLabels[getBoardSizeForTrophies(vsBotTrophies)]
                : t.boardSizeLabels[pendingDifficulty as keyof typeof t.boardSizeLabels] || pendingDifficulty}
            </span>
          </div>
        </div>

        {/* Buttons */}
        {pendingMemoryMode === "vsBot" && parsedSaved ? (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
              <button
                id="btn-confirm-resume"
                onClick={() => {
                  synth.playSelect();
                  restoreSavedVsBotMatch(parsedSaved);
                  setMemoryMode("vsBot");
                  setShowMemoryConfirm(false);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider transition-colors duration-150 shadow-none border-transparent cursor-pointer text-center"
              >
                {t.resumeGameText}
              </button>
              <button
                id="btn-confirm-new"
                onClick={() => {
                  synth.playSelect();
                  localStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
                  const finalDiff = getBoardSizeForTrophies(vsBotTrophies);
                  setDifficulty(finalDiff);
                  setMemoryMode("vsBot");
                  generateMemoryGame(finalDiff, "vsBot", true);
                  setShowMemoryConfirm(false);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#34448e] hover:bg-[#3e51aa] text-slate-100 font-black text-xs tracking-wider transition-all duration-200 border-2 border-[#546bbf]/40 active:scale-95 cursor-pointer text-center"
              >
                {t.newGameText}
              </button>
            </div>
            <button
              id="btn-confirm-cancel"
              onClick={() => {
                synth.playSelect();
                setShowMemoryConfirm(false);
              }}
              className="py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-300 font-extrabold text-xs tracking-wider transition-all duration-200 active:scale-95 cursor-pointer text-center"
            >
              {confirmText.cancel}
            </button>
          </div>
        ) : (
          <div className="flex gap-3 w-full">
            <button
              id="btn-confirm-cancel"
              onClick={() => {
                synth.playSelect();
                setShowMemoryConfirm(false);
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#34448e] hover:bg-[#3e51aa] text-slate-100 font-black text-xs tracking-wider transition-all duration-200 border-2 border-[#546bbf]/40 active:scale-95 cursor-pointer"
            >
              {confirmText.cancel}
            </button>
            <button
              id="btn-confirm-start"
              onClick={() => {
                const finalDiff = pendingMemoryMode === "vsBot" 
                  ? getBoardSizeForTrophies(vsBotTrophies) 
                  : pendingDifficulty;

                if (!isBoardSizeUnlocked(finalDiff, pendingMemoryMode)) {
                  handleUnlockBoardSize(finalDiff as any, () => {
                    setDifficulty(finalDiff);
                    setMemoryMode(pendingMemoryMode);
                    generateMemoryGame(finalDiff);
                    setShowMemoryConfirm(false);
                  });
                } else {
                  synth.playSelect();
                  setDifficulty(finalDiff);
                  setMemoryMode(pendingMemoryMode);
                  generateMemoryGame(finalDiff);
                  setShowMemoryConfirm(false);
                }
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs tracking-wider transition-colors duration-150 shadow-none border-transparent cursor-pointer flex items-center justify-center gap-1.5"
            >
              {!isBoardSizeUnlocked(pendingDifficulty, pendingMemoryMode) && (
                <Video className="w-3.5 h-3.5 text-slate-950 shrink-0 fill-slate-950/20" />
              )}
              <span>{confirmText.start}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
