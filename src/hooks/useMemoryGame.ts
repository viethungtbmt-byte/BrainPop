import { useState, useEffect, useRef, useCallback, startTransition } from "react";
import { generateMemoryBoard } from "../emoji/memory";
import { BotDifficulty } from "../BOT/types";

export interface UseMemoryGameProps {
  synth: any;
  soundOn: boolean;
  equippedEffect: string;
  triggerCosmeticEffect: (effectId: string, cardIndex?: number) => void;
  setShowVictoryCelebration: (show: boolean) => void;
  setFadeCelebrationOut: (fade: boolean) => void;
  setShowScoreSummary: (show: boolean) => void;
  setShowRankUpPopup: (show: boolean) => void;
  setRankUpBadge: (badge: string) => void;
  setIsRankPromotion: (isPromo: boolean) => void;
  setNewHighScoreValue: (score: number) => void;
  setShowHighScorePopup: (show: boolean) => void;
}

export function useMemoryGame({
  synth,
  soundOn,
  equippedEffect,
  triggerCosmeticEffect,
  setShowVictoryCelebration,
  setFadeCelebrationOut,
  setShowScoreSummary,
  setShowRankUpPopup,
  setRankUpBadge,
  setIsRankPromotion,
  setNewHighScoreValue,
  setShowHighScorePopup,
}: UseMemoryGameProps) {
  // Game Setup & Mode
  const [activeTab, setActiveTab] = useState<"memory" | "match">("memory");
  const [memoryMode, setMemoryMode] = useState<"vsBot" | "solo" | "twoPlayers">("solo");
  const [difficulty, setDifficulty] = useState<string>("4x4");

  // Game Cards & Interactive State
  const [memoryCards, setMemoryCards] = useState<string[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);
  const [memoryTimeLeft, setMemoryTimeLeft] = useState<number>(120);
  const [memoryTimerActive, setMemoryTimerActive] = useState<boolean>(false);
  const [memoryFinished, setMemoryFinished] = useState<boolean>(false);
  const [memoryBusy, setMemoryBusy] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Player Scores & Turns
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [matchedByP1, setMatchedByP1] = useState<number[]>([]);
  const [matchedByP2, setMatchedByP2] = useState<number[]>([]);
  const [consecutiveMatches, setConsecutiveMatches] = useState<number>(0);

  // Scores & Trophies
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [vsBotTrophies, setVsBotTrophies] = useState<number>(() => {
    const saved = localStorage.getItem("emoji_brainpop_vsbot_trophies");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [winsP1, setWinsP1] = useState<number>(() => {
    const saved = localStorage.getItem("emoji_brainpop_2p_wins_p1");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [winsP2, setWinsP2] = useState<number>(() => {
    const saved = localStorage.getItem("emoji_brainpop_2p_wins_p2");
    return saved ? parseInt(saved, 10) : 0;
  });

  // Hints
  const [hintsCount, setHintsCount] = useState<number>(() => {
    const saved = localStorage.getItem("emoji_brainpop_hints");
    return saved ? parseInt(saved, 10) : 3;
  });
  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);

  // Bot AI
  const [currentBotDifficulty, setCurrentBotDifficulty] = useState<BotDifficulty>(3);
  const botUsername = "BrainPop Bot";
  const botMemoryRef = useRef<Map<number, string>>(new Map());

  // Refs to prevent double trophy/win updates
  const trophiesUpdatedRef = useRef<boolean>(false);
  const p2pWinsUpdatedRef = useRef<boolean>(false);

  // Persist hints
  const updateHintsCount = useCallback((updater: (prev: number) => number) => {
    setHintsCount((prev) => {
      const next = Math.max(0, updater(prev));
      localStorage.setItem("emoji_brainpop_hints", next.toString());
      return next;
    });
  }, []);

  // Generate Memory Game
  const generateMemoryGame = useCallback((targetDifficulty: any, mode: string = "solo") => {
    startTransition(() => {
      const board = generateMemoryBoard(targetDifficulty, mode);
      setMemoryCards(board.randomizedBoard);
      setMemoryFlipped([]);
      setMemoryMoves(0);
      setMemoryTimeLeft(targetDifficulty === "7x8" ? 360 : targetDifficulty === "6x8" ? 180 : targetDifficulty === "5x6" ? 150 : 120);
      setMemoryFinished(false);
      setMemoryTimerActive(true);
      setMemoryBusy(false);
      setIsPaused(false);
      setP1Score(0);
      setP2Score(0);
      setActivePlayer(1);
      setMatchedByP1([]);
      setMatchedByP2([]);
      setConsecutiveMatches(0);
    });
    botMemoryRef.current.clear();
    trophiesUpdatedRef.current = false;
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    if (memoryTimerActive && !memoryFinished && activeTab === "memory" && !isPaused) {
      const timer = setInterval(() => {
        setMemoryTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setMemoryFinished(true);
            setMemoryTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [memoryTimerActive, memoryFinished, activeTab, isPaused]);

  return {
    activeTab,
    setActiveTab,
    memoryMode,
    setMemoryMode,
    difficulty,
    setDifficulty,
    memoryCards,
    setMemoryCards,
    memoryFlipped,
    setMemoryFlipped,
    memoryMoves,
    setMemoryMoves,
    memoryTimeLeft,
    setMemoryTimeLeft,
    memoryTimerActive,
    setMemoryTimerActive,
    memoryFinished,
    setMemoryFinished,
    memoryBusy,
    setMemoryBusy,
    isPaused,
    setIsPaused,
    p1Score,
    setP1Score,
    p2Score,
    setP2Score,
    activePlayer,
    setActivePlayer,
    matchedByP1,
    setMatchedByP1,
    matchedByP2,
    setMatchedByP2,
    consecutiveMatches,
    setConsecutiveMatches,
    currentScore,
    setCurrentScore,
    vsBotTrophies,
    setVsBotTrophies,
    winsP1,
    setWinsP1,
    winsP2,
    setWinsP2,
    hintsCount,
    setHintsCount,
    updateHintsCount,
    isHintModalOpen,
    setIsHintModalOpen,
    currentBotDifficulty,
    setCurrentBotDifficulty,
    botUsername,
    generateMemoryGame,
  };
}
