import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Info,
  Layers,
  Grid,
  Zap,
  RefreshCw,
  Trophy,
  Settings,
  Store,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Menu,
  Home,
  Shield,
  Crown,
  SquareStack,
  Users,
  Bot,
  Play,
  Pause,
  LogOut,
  Palette,
  Globe,
  Video,
  Lightbulb,
  Lock,
  Unlock
} from "lucide-react";
import { CanvasCard } from "./components/CanvasCard";
import { MemoryCard } from "./components/MemoryCard";
import { MobileLandscapeMenu } from "./components/engine/MobileLandscapeMenu";
import { GameHUD, PlayerScoreHUD } from "./components/engine/GameHUD";
import { GameViewportFrame } from "./components/engine/GameViewportFrame";
import { RoyalPanelFrame } from "./components/engine/RoyalPanelFrame";
import { SettingsModal } from "./components/modals/SettingsModal";
import { ResetConfirmModal } from "./components/modals/ResetConfirmModal";
import { HintModal } from "./components/modals/HintModal";
import { PauseOverlay } from "./components/modals/PauseOverlay";
import { LoadingAdOverlay } from "./components/modals/LoadingAdOverlay";
import { MemoryFinishedModal } from "./components/modals/MemoryFinishedModal";
import { MemoryBoardGrid } from "./components/game/MemoryBoardGrid";
import { MatchConnectionBoard } from "./components/game/MatchConnectionBoard";
import { GentleSnowUnlockModal } from "./components/modals/GentleSnowUnlockModal";
import { GameStartConfirmModal } from "./components/modals/GameStartConfirmModal";
import { RankUpModal } from "./components/modals/RankUpModal";
import { HighScoreModal } from "./components/modals/HighScoreModal";
import { getNextBotUsername } from "./data/botNames";
import { TRANSLATIONS, Language, getAutoDetectedLanguage, SUPPORTED_LANGUAGES } from "./locales";
import { adManager } from "./ads/AdManager";
import { 
  BotMemoryManager, 
  BotDecisionEngine, 
  selectRandomBotDifficulty, 
  getBotConfig,
  selectBotDifficultyForTrophies,
  getBoardSizeForTrophies,
  getRankForTrophies,
  getRankProgressPercentage
} from "./BOT";
import { UNIQUE_EMOJIS } from "./emoji/emojis";
import { generateMemoryBoard, getTargetPairsToWin } from "./emoji/memory";
import { EMBEDDED_PAIRS } from "./emoji/related";
import { synth } from "./audio";
import { 
  EnvironmentalEffects, 
  getEquippedEffect, 
  setEquippedEffect, 
  ShopModal,
  getEquippedCardBack,
  setEquippedCardBack,
  getEquippedTheme,
  setEquippedTheme,
  getEquippedBackground,
  setEquippedBackground,
  getEquippedMusic,
  setEquippedMusic,
  getInventoryState,
  unlockItem
} from "./itemShop";
import { CosmeticEffectType } from "./itemShop/itemTypes";
import { THEME_STYLES, getBoardBackgroundStyle } from "./utils/themeStyles";
import { 
  areCompatible, 
  validateLevelPairs, 
  CardConnectionState, 
  MemoryFlipState, 
  Connection 
} from "./utils/gameRules";
import { useLayoutConfig } from "./hooks/useLayoutConfig";
import { LoadingScreen } from "./components/LoadingScreen";
import { PanelBackground } from "./components/PanelBackground";
import { safeLocalStorage } from "./utils/safeStorage";

export type BoardSizeKey = "3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | "7x8";

export default function App() {
  // Preloader state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    adManager.gameLoadingFinished();
  };

  // Navigation: "match" for Connecting Cards, "memory" for Memory Flip Game
  const [activeTab, setActiveTab] = useState<"match" | "memory">("memory");
  
  // Language configuration ("vi" | "en" | "es" | "pt" | "tr" | "de" | "fr" | "it" | "ru" | "id" | "zh-TW" | "ja" | "ko" | "pl" | "nl" | "th")
  const [language, setLanguage] = useState<Language>((): Language => {
    const saved = safeLocalStorage.getItem("emoji_brainpop_lang");
    if (saved && (SUPPORTED_LANGUAGES as string[]).includes(saved)) {
      return saved as Language;
    }
    return getAutoDetectedLanguage();
  });

  // Settings Modal open state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Shop Modal open state
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);

  // Gentle Snow 3-Game Unlock & Shop Progression state
  const [classicGamesCompleted, setClassicGamesCompleted] = useState<number>(() => {
    const saved = safeLocalStorage.getItem("emoji_brainpop_classic_games_completed");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showGentleSnowModal, setShowGentleSnowModal] = useState<boolean>(false);
  const [hasPendingGentleSnow, setHasPendingGentleSnow] = useState<boolean>(false);
  const [shopHighlightItemId, setShopHighlightItemId] = useState<string | null>(null);

  // One-time interactive guided tutorial state for first-time players
  const [tutorialStep, setTutorialStep] = useState<number>(0); // 0 = inactive, 1 = tap Card A, 2 = tap Card B
  const [tutorialCardA, setTutorialCardA] = useState<number>(-1);
  const [tutorialCardB, setTutorialCardB] = useState<number>(-1);
  const demoHasStartedRef = useRef<boolean>(false);

  // Poki Rewarded Ads state
  const [classicAdWatched, setClassicAdWatched] = useState<boolean>(false);
  const [challengeAdWatched, setChallengeAdWatched] = useState<boolean>(false);
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);

  // Board Size 48-Hour Ad Unlock State per board size (Classic & 2 Players Modes)
  const [boardSizeUnlocks, setBoardSizeUnlocks] = useState<Record<string, number>>(() => {
    try {
      const saved = safeLocalStorage.getItem("emoji_brainpop_board_size_unlocks");
      if (saved) return JSON.parse(saved);
      // Migration from old single key if present
      const oldSaved = safeLocalStorage.getItem("emoji_brainpop_board_sizes_unlocked_until");
      if (oldSaved) {
        const ts = parseInt(oldSaved, 10);
        if (ts > Date.now()) {
          return { "6x8": ts };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const isBoardSizeUnlocked = (sizeKey: string, mode: string = memoryMode) => {
    // Challenge Mode (vsBot) is completely unaffected (trophy based)
    if (mode === "vsBot") return true;
    // Classic & 2 Players: 48 Cards ("6x8") and 56 Cards ("7x8") require ad watch PER board size
    if (sizeKey === "6x8" || sizeKey === "7x8") {
      const until = boardSizeUnlocks[sizeKey] || 0;
      return Date.now() < until;
    }
    return true;
  };

  const handleUnlockBoardSize = (targetSizeKey: string, onUnlocked?: () => void) => {
    if (isWatchingAd) return;
    synth.playSelect();
    handleRewardedAd(() => {
      const newUntil = Date.now() + 48 * 60 * 60 * 1000; // 48 hours
      setBoardSizeUnlocks((prev) => {
        const updated = { ...prev, [targetSizeKey]: newUntil };
        safeLocalStorage.setItem("emoji_brainpop_board_size_unlocks", JSON.stringify(updated));
        return updated;
      });
      synth.playRankUp();
      if (onUnlocked) {
        onUnlocked();
      } else {
        setDifficulty(targetSizeKey);
        generateMemoryGame(targetSizeKey as any);
      }
    });
  };

  const getRemainingBoardSizeUnlockTimeText = (sizeKey: string) => {
    const until = boardSizeUnlocks[sizeKey] || 0;
    if (Date.now() >= until) return "";
    const diffMs = until - Date.now();
    const hoursLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    return `${hoursLeft}h`;
  };

  // Equipped cosmetic effect state
  const [equippedEffect, setEquippedEffectState] = useState<CosmeticEffectType | null>(() => getEquippedEffect());

  const handleSetEquippedEffect = (effect: CosmeticEffectType | null) => {
    setEquippedEffectState(effect);
    setEquippedEffect(effect);
  };

  // Equipped Card Back State
  const [equippedCardBackId, setEquippedCardBackState] = useState<string>(() => getEquippedCardBack());
  
  const handleSetEquippedCardBack = (id: string) => {
    setEquippedCardBackState(id);
    setEquippedCardBack(id);
  };

  // Equipped Theme State
  const [equippedThemeId, setEquippedThemeState] = useState<string>(() => getEquippedTheme());

  const handleSetEquippedTheme = (id: string) => {
    setEquippedThemeState(id);
    setEquippedTheme(id);
  };

  // Theme style resolver
  const currentTheme = THEME_STYLES[equippedThemeId] || THEME_STYLES.theme_midnight_blue;
  const isThemeDark = true;

  // Equipped Background State
  const [equippedBackgroundId, setEquippedBackgroundState] = useState<string>(() => getEquippedBackground());

  const handleSetEquippedBackground = (id: string) => {
    setEquippedBackgroundState(id);
    setEquippedBackground(id);
  };

  // Equipped Music State
  const [equippedMusicId, setEquippedMusicState] = useState<string>(() => getEquippedMusic());

  const handleSetEquippedMusic = (id: string) => {
    setEquippedMusicState(id);
    setEquippedMusic(id);
  };

  // Sync equipped states with inventory (auto-reverts if temporary items expire)
  useEffect(() => {
    const activeEffect = getEquippedEffect();
    if (activeEffect !== equippedEffect) setEquippedEffectState(activeEffect);

    const activeCardBack = getEquippedCardBack();
    if (activeCardBack !== equippedCardBackId) setEquippedCardBackState(activeCardBack);

    const activeTheme = getEquippedTheme();
    if (activeTheme !== equippedThemeId) setEquippedThemeState(activeTheme);

    const activeMusic = getEquippedMusic();
    if (activeMusic !== equippedMusicId) setEquippedMusicState(activeMusic);
  }, [isShopOpen]);

  // Language selection dropdown state
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);

  // Board size selection dropdown state (Desktop/Landscape)
  const [isBoardSizeDropdownOpen, setIsBoardSizeDropdownOpen] = useState<boolean>(false);

  // Board size selection dropdown state (Mobile/Portrait)
  const [isBoardSizeDropdownOpenMobile, setIsBoardSizeDropdownOpenMobile] = useState<boolean>(false);

  // Game type selection dropdown state
  const [isGameTypeDropdownOpen, setIsGameTypeDropdownOpen] = useState<boolean>(false);

  // Play mode selection dropdown state (Desktop/Landscape)
  const [isPlayModeDropdownOpen, setIsPlayModeDropdownOpen] = useState<boolean>(false);

  // Play mode selection dropdown state (Mobile/Portrait)
  const [isPlayModeDropdownOpenMobile, setIsPlayModeDropdownOpenMobile] = useState<boolean>(false);

  // Sidebar collapse state for desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Challenge level selection dropdown open state
  const [isDiffDropdownOpen, setIsDiffDropdownOpen] = useState<boolean>(false);

  const {
    config: layoutConfig,
    isOrienting,
    isPortrait,
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
    isMobilePortrait,
    isTabletPortrait,
    isMobileLandscape,
    isTabletLandscape,
  } = useLayoutConfig();

  const [isMobileConfigOpen, setIsMobileConfigOpen] = useState<boolean>(false);
  const [landscapeMenuTab, setLandscapeMenuTab] = useState<"home" | "settings" | "shop" | "theme" | "language">("home");
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState<boolean>(false);

  // Close temporary popover dropdowns when layout name changes
  useEffect(() => {
    setIsBoardSizeDropdownOpen(false);
    setIsBoardSizeDropdownOpenMobile(false);
    setIsGameTypeDropdownOpen(false);
    setIsPlayModeDropdownOpen(false);
    setIsPlayModeDropdownOpenMobile(false);
    setIsDiffDropdownOpen(false);
    setIsLangDropdownOpen(false);

    if (!layoutConfig.allowMobileConfigMenu) {
      setIsMobileConfigOpen(false);
    }
  }, [layoutConfig.name, layoutConfig.allowMobileConfigMenu]);

  const wasLandscapeRef = useRef<boolean>(!isPortrait);
  useEffect(() => {
    wasLandscapeRef.current = !isPortrait;
  }, [isPortrait]);

  // Localization helper
  const t = TRANSLATIONS[language];

  
  // Game Audio config
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Score states
  const [cardConnectionState, setCardConnectionState] = useState<CardConnectionState>(() => {
    const saved = safeLocalStorage.getItem("novel_match_card_connection_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Backward compatibility check for old highscore
    const oldHigh = safeLocalStorage.getItem("novel_match_highscore");
    const initialHigh = oldHigh ? parseInt(oldHigh) : 0;
    return { score: 0, highScore: initialHigh };
  });

  const [memoryFlipState, setMemoryFlipState] = useState<MemoryFlipState>(() => {
    const saved = safeLocalStorage.getItem("novel_match_memory_flip_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return { score: 0, highScore: 0 };
  });

  const currentScore = activeTab === "match" ? cardConnectionState.score : memoryFlipState.score;
  const currentHighScore = activeTab === "match" ? cardConnectionState.highScore : memoryFlipState.highScore;

  const [streak, setStreak] = useState<number>(0);

  // Memory flip game timer states
  const [memoryTimeLeft, setMemoryTimeLeft] = useState<number>(() => {
    const saved = safeLocalStorage.getItem("emoji_brainpop_saved_vs_bot_match");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.memoryTimeLeft === "number" && !parsed.memoryFinished) {
          return parsed.memoryTimeLeft;
        }
      } catch (e) {}
    }
    return 60;
  });
  const [memoryTimerActive, setMemoryTimerActive] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // --- CLASSIC MODE HINT SYSTEM ---
  const [hintsCount, setHintsCount] = useState<number>(() => {
    const saved = safeLocalStorage.getItem("emoji_brainpop_hints_count");
    if (saved !== null) {
      const val = parseInt(saved, 10);
      return isNaN(val) ? 1 : val;
    }
    return 1; // Default: start with 1 free hint
  });

  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);

  const updateHintsCount = (newVal: number | ((prev: number) => number)) => {
    setHintsCount(prev => {
      const nextVal = typeof newVal === "function" ? newVal(prev) : newVal;
      const bounded = Math.max(0, nextVal);
      try {
        safeLocalStorage.setItem("emoji_brainpop_hints_count", bounded.toString());
      } catch (e) {}
      return bounded;
    });
  };

  // --- TAB 1: CONNECTING CARDS STATE & SYSTEM ---
  const [level, setLevel] = useState<number>(1);
  const [levelHistory, setLevelHistory] = useState<Record<number, { from: string; to: string }[]>>(() => {
    try {
      const saved = safeLocalStorage.getItem("novel_match_level_history");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [leftCards, setLeftCards] = useState<string[]>([]);
  const [rightCards, setRightCards] = useState<string[]>([]);
  
  // Dynamic Emoji Watermark background generator
  const watermarkBg = useMemo(() => {
    if (leftCards.length === 0 && rightCards.length === 0) return "";
    const emojis = [...leftCards, ...rightCards].filter(Boolean);
    if (emojis.length === 0) return "";

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 240;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      // Clear canvas
      ctx.clearRect(0, 0, 240, 240);

      // Setup typography and alignment
      ctx.font = "30px Arial, sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      // Translate and rotate -45 degrees for Word security style diagonal watermark
      ctx.translate(120, 120);
      ctx.rotate((-45 * Math.PI) / 180);

      // Gather unique emojis currently present in the level
      const uniqueEmojis = Array.from(new Set(emojis));

      // Draw repeating pattern of the current emojis
      if (uniqueEmojis[0]) ctx.fillText(uniqueEmojis[0], 0, 0);
      if (uniqueEmojis[1]) ctx.fillText(uniqueEmojis[1], -80, -80);
      if (uniqueEmojis[2]) ctx.fillText(uniqueEmojis[2], 80, 80);
      if (uniqueEmojis[3]) ctx.fillText(uniqueEmojis[3], 80, -80);
      if (uniqueEmojis[4]) ctx.fillText(uniqueEmojis[4], -80, 80);
      
      if (uniqueEmojis[5]) ctx.fillText(uniqueEmojis[5], 0, -120);
      if (uniqueEmojis[0]) ctx.fillText(uniqueEmojis[0], 0, 120);
      if (uniqueEmojis[1]) ctx.fillText(uniqueEmojis[1], -120, 0);
      if (uniqueEmojis[2]) ctx.fillText(uniqueEmojis[2], 120, 0);

      return canvas.toDataURL();
    } catch (e) {
      console.error("Watermark generation failed", e);
      return "";
    }
  }, [leftCards, rightCards]);
  
  // High-performance flexible connection states
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null); // flat index 0-5
  const [connections, setConnections] = useState<[number, number][]>([]); // Pairs of active connected flat indices [min, max]
  const [checked, setChecked] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [wrongFlatIndices, setWrongFlatIndices] = useState<number[]>([]);
  const [pressedMatchCardIdx, setPressedMatchCardIdx] = useState<number | null>(null);
  const [returningMatchCardIdx, setReturningMatchCardIdx] = useState<number | null>(null);

  // Coordinate tracker for drawing cables
  const containerRef = useRef<HTMLDivElement>(null);
  interface LineCoord {
    flatIndex1: number;
    flatIndex2: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isWrong: boolean;
  }
  const [lineCoords, setLineCoords] = useState<LineCoord[]>([]);

  // Drag-to-Connect states
  interface DragStartInfo {
    index: number;
    startX: number;
    startY: number;
    clientX: number;
    clientY: number;
    isDragging: boolean;
  }
  const [dragStartInfo, setDragStartInfo] = useState<DragStartInfo | null>(null);
  const [dragCurrentPos, setDragCurrentPos] = useState<{ x: number; y: number } | null>(null);

  // --- TAB 2: MEMORY FLIP GAME STATE & SYSTEM ---
  // --- SAVED VS BOT MATCH PERSISTENCE & TROPHIES ---
  const savedVsBotMatch = useMemo(() => {
    const saved = safeLocalStorage.getItem("emoji_brainpop_saved_vs_bot_match");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.memoryCards && parsed.memoryCards.length > 0 && !parsed.memoryFinished) {
          const totalPlayable = parsed.memoryCards.filter((c: string) => c !== "BLOCKED").length;
          const matchedCount = new Set((parsed.memoryMatched || []).filter((idx: number) => parsed.memoryCards[idx] !== "BLOCKED")).size;
          if (matchedCount < totalPlayable) {
            return parsed;
          }
        }
      } catch (e) {}
      safeLocalStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
    }
    return null;
  }, []);

  const savedLastMode = useMemo(() => {
    try {
      const saved = safeLocalStorage.getItem("emoji_brainpop_last_mode");
      if (saved === "twoPlayers" || saved === "vsBot" || saved === "solo") {
        return saved as "solo" | "twoPlayers" | "vsBot";
      }
    } catch (e) {}
    return "solo"; // Default mode for new sessions
  }, []);

  // Restore VS Bot match ONLY if player explicitly left while in VS Bot mode
  const shouldRestoreVsBot = useMemo(() => {
    return savedLastMode === "vsBot" && !!savedVsBotMatch;
  }, [savedLastMode, savedVsBotMatch]);

  const isRestoredRef = useRef(shouldRestoreVsBot);
  const trophiesUpdatedRef = useRef<boolean>(false);
  const p2pWinsUpdatedRef = useRef<boolean>(false);

  const [vsBotTrophies, setVsBotTrophies] = useState<number>(() => {
    const savedNew = safeLocalStorage.getItem("emoji_brainpop_vs_bot_trophies");
    if (savedNew !== null) return parseInt(savedNew);
    const savedOld = safeLocalStorage.getItem("emoji_brainpop_vs_bot_rating");
    if (savedOld !== null) return parseInt(savedOld);
    return 0;
  });

  const [memoryMode, setMemoryModeState] = useState<"solo" | "twoPlayers" | "vsBot">(
    shouldRestoreVsBot ? "vsBot" : savedLastMode
  );

  const setMemoryMode = useCallback((action: "solo" | "twoPlayers" | "vsBot" | ((prev: "solo" | "twoPlayers" | "vsBot") => "solo" | "twoPlayers" | "vsBot")) => {
    setMemoryModeState(prev => {
      const nextMode = typeof action === "function" ? action(prev) : action;
      try {
        safeLocalStorage.setItem("emoji_brainpop_last_mode", nextMode);
      } catch (e) {}
      return nextMode;
    });
  }, []);

  const [winsP1, setWinsP1] = useState<number>(() => {
    const saved = safeLocalStorage.getItem("emoji_brainpop_2p_wins_p1");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [winsP2, setWinsP2] = useState<number>(() => {
    const saved = safeLocalStorage.getItem("emoji_brainpop_2p_wins_p2");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const currentRank = useMemo(() => getRankForTrophies(vsBotTrophies), [vsBotTrophies]);

  const rankProgressPercentage = useMemo(() => {
    return getRankProgressPercentage(vsBotTrophies);
  }, [vsBotTrophies]);

  const rankProgressDisplay = useMemo(() => {
    return rankProgressPercentage >= 99 ? "99%+" : `${rankProgressPercentage}%`;
  }, [rankProgressPercentage]);

  const [showRankUpPopup, setShowRankUpPopup] = useState<boolean>(false);
  const [rankUpBadge, setRankUpBadge] = useState<any>(null);
  const [isRankPromotion, setIsRankPromotion] = useState<boolean>(true);
  const lastRankIdRef = useRef<number | null>(null);
  const lastGeneratedConfigRef = useRef<{ diff: string; mode: string } | null>(null);

  useEffect(() => {
    const currentRankInfo = getRankForTrophies(vsBotTrophies);
    if (lastRankIdRef.current === null) {
      lastRankIdRef.current = currentRankInfo.id;
    } else {
      if (currentRankInfo.id > lastRankIdRef.current) {
        setRankUpBadge(currentRankInfo);
        setIsRankPromotion(true);
        setShowRankUpPopup(true);
        synth.playRankUp();
        lastRankIdRef.current = currentRankInfo.id;
      } else if (currentRankInfo.id < lastRankIdRef.current) {
        setRankUpBadge(currentRankInfo);
        setIsRankPromotion(false);
        setShowRankUpPopup(true);
        synth.playFailure();
        lastRankIdRef.current = currentRankInfo.id;
      } else {
        lastRankIdRef.current = currentRankInfo.id;
      }
    }
    if (memoryMode === "vsBot") {
      const requiredDiff = getBoardSizeForTrophies(vsBotTrophies);
      if (difficulty !== requiredDiff) {
        setDifficulty(requiredDiff);
      }
    }
  }, [vsBotTrophies, memoryMode]);

  // 3x4: 12 cards (6 unique pairs)
  // 4x5: 20 cards (10 unique pairs)
  // 5x6: 30 cards (15 unique pairs)
  // 6x6: 36 cards (18 unique pairs)
  // 6x8: 48 cards (24 unique pairs)
  const [matchSessionId, setMatchSessionId] = useState<string>(() => {
    return shouldRestoreVsBot ? (savedVsBotMatch.matchSessionId || Date.now().toString()) : Date.now().toString();
  });
  const [difficulty, setDifficulty] = useState<"3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | any>(() => {
    if (shouldRestoreVsBot && savedVsBotMatch && savedVsBotMatch.memoryCards) {
      if (savedVsBotMatch.memoryCards.length === 12) return "3x4";
      if (savedVsBotMatch.memoryCards.length === 16) return "4x4";
      if (savedVsBotMatch.memoryCards.length === 20) return "4x5";
      if (savedVsBotMatch.memoryCards.length === 24 || savedVsBotMatch.memoryCards.length === 25) return "5x5";
      if (savedVsBotMatch.memoryCards.length === 30) return "5x6";
      if (savedVsBotMatch.memoryCards.length === 36) return "6x6";
      if (savedVsBotMatch.memoryCards.length === 48) return "6x8";
      if (savedVsBotMatch.memoryCards.length === 56) return "7x8";
    }
    if (savedLastMode === "vsBot") {
      return getBoardSizeForTrophies(vsBotTrophies);
    }
    if (savedLastMode === "twoPlayers") {
      return "5x5";
    }
    return "3x4";
  });
  const [memoryCards, setMemoryCards] = useState<string[]>(() => {
    return shouldRestoreVsBot ? savedVsBotMatch.memoryCards : [];
  });
  const [memoryMatched, setMemoryMatched] = useState<number[]>(() => {
    return shouldRestoreVsBot ? savedVsBotMatch.memoryMatched : [];
  });
  const [matchedByP1, setMatchedByP1] = useState<number[]>(() => {
    return shouldRestoreVsBot ? (savedVsBotMatch.matchedByP1 || []) : [];
  });
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>(() => {
    return shouldRestoreVsBot ? savedVsBotMatch.memoryFlipped : [];
  });
  const [memoryMismatch, setMemoryMismatch] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(() => {
    return shouldRestoreVsBot ? savedVsBotMatch.memoryMoves : 0;
  });
  const [memoryFinished, setMemoryFinished] = useState<boolean>(() => {
    return shouldRestoreVsBot ? savedVsBotMatch.memoryFinished : false;
  });
  const [memoryBusy, setMemoryBusy] = useState<boolean>(false);
  const isClickProcessingRef = useRef<boolean>(false);
  const pendingFlippedRef = useRef<number[]>(shouldRestoreVsBot && savedVsBotMatch ? (savedVsBotMatch.memoryFlipped || []) : []);
  const botThinkingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- MEMORY GAME START CONFIRMATION STATE ---
  const [pendingDifficulty, setPendingDifficulty] = useState<"3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | any>(() => {
    return shouldRestoreVsBot ? "5x6" : "3x4";
  });
  const [pendingMemoryMode, setPendingMemoryMode] = useState<"solo" | "twoPlayers" | "vsBot" | any>(() => {
    return shouldRestoreVsBot ? "vsBot" : savedLastMode;
  });
  const [showMemoryConfirm, setShowMemoryConfirm] = useState(false);

  // --- RESPONSIVE DYNAMIC MEMORY CARD GRID SIZING ---
  const memoryGridAreaRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [memoryCardSizing, setMemoryCardSizing] = useState<{
    cardSize: number;
    cardWidth: number;
    cardHeight: number;
    gap: number;
    cols: number;
    rows: number;
    gridWidth: number;
    gridHeight: number;
    hideLockedCard?: boolean;
  }>({
    cardSize: 80,
    cardWidth: 80,
    cardHeight: 80,
    gap: 8,
    cols: 4,
    rows: 4,
    gridWidth: 344,
    gridHeight: 344,
    hideLockedCard: false,
  });

  const calculateSizing = useCallback((overrideDiff?: string, explicitW?: number, explicitH?: number) => {
    if (isMobileConfigOpen) return;
    let w = explicitW || 0;
    let h = explicitH || 0;

    if (w <= 0 || h <= 0) {
      if (gridWrapperRef.current) {
        const rect = gridWrapperRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          w = rect.width;
          h = rect.height;
        }
      }
      if ((w <= 0 || h <= 0) && memoryGridAreaRef.current) {
        const rect = memoryGridAreaRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          w = rect.width;
          h = rect.height;
        }
      }
    }

    const availW = Math.max(0, w - 8);
    const availH = Math.max(0, h - 8);

    if (availW <= 0 || availH <= 0) return;

    const activeDifficulty = overrideDiff || difficulty || "3x4";

    // Dynamic presets tailored for landscape vs standard layout
    type LayoutCandidate = { cols: number; rows: number; hideLockedCard?: boolean };

    const isLandscapeOrientation = isMobileLandscape || (!isPortrait && availW > availH * 1.15);

    let candidates: LayoutCandidate[] = [];

    if (activeDifficulty === "5x5") {
      // 25 Cards mode:
      if (isLandscapeOrientation) {
        candidates = [
          { cols: 8, rows: 3, hideLockedCard: true },  // 24 cards = 3 full rows of 8
          { cols: 6, rows: 4, hideLockedCard: true },  // 24 cards = 4 full rows of 6
          { cols: 5, rows: 5, hideLockedCard: false }, // 25 cards = 5x5 square
        ];
      } else {
        candidates = [
          { cols: 5, rows: 5, hideLockedCard: false }, // 25 cards = 5x5 square
          { cols: 4, rows: 6, hideLockedCard: true },  // 24 cards = 6 full rows of 4
          { cols: 3, rows: 8, hideLockedCard: true },  // 24 cards = 8 full rows of 3
        ];
      }
    } else {
      const MOBILE_LANDSCAPE_PRESETS: Record<string, [number, number][]> = {
        "3x4": [[6, 2], [4, 3], [3, 4]],
        "4x4": [[8, 2], [4, 4]],
        "4x5": [[10, 2], [5, 4], [4, 5]],
        "5x6": [[10, 3], [6, 5], [5, 6]],
        "6x6": [[9, 4], [12, 3], [6, 6]],
        "6x8": [[12, 4], [16, 3], [8, 6], [6, 8]],
        "7x8": [[14, 4], [8, 7], [7, 8]],
      };

      const BOARD_LAYOUT_PRESETS: Record<string, [number, number][]> = {
        "3x4": [[3, 4], [4, 3]],
        "4x4": [[4, 4]],
        "4x5": [[4, 5], [5, 4]],
        "5x6": [[5, 6], [6, 5]],
        "6x6": [[6, 6]],
        "6x8": [[6, 8], [8, 6]],
        "7x8": [[7, 8], [8, 7]],
      };

      const presetList = (isLandscapeOrientation ? MOBILE_LANDSCAPE_PRESETS[activeDifficulty] : BOARD_LAYOUT_PRESETS[activeDifficulty]) || [[4, 4]];
      candidates = presetList.map(([c, r]) => ({ cols: c, rows: r, hideLockedCard: false }));
    }

    const minDim = Math.min(availW, availH);
    const gap = Math.max(2, Math.min(10, Math.floor(minDim / 90)));

    let bestCols = candidates[0].cols;
    let bestRows = candidates[0].rows;
    let bestHideLockedCard = candidates[0].hideLockedCard || false;
    let bestScore = -1;
    let bestCardW = -1;
    let bestCardH = -1;

    for (const cand of candidates) {
      const { cols: c, rows: r, hideLockedCard } = cand;
      const maxCardW = (availW - (c - 1) * gap) / c;
      const maxCardH = (availH - (r - 1) * gap) / r;

      if (maxCardW <= 0 || maxCardH <= 0) continue;

      let cardW = Math.floor(maxCardW);
      let cardH = Math.floor(maxCardH);

      // Gently guard against extreme distortion if aspect ratio is way out of bounds
      const cardRatio = cardH > 0 ? cardW / cardH : 1;
      if (cardRatio > 1.85) {
        cardW = Math.floor(cardH * 1.85);
      } else if (cardRatio < 0.45) {
        cardH = Math.floor(cardW / 0.45);
      }

      cardW = Math.max(16, cardW);
      cardH = Math.max(16, cardH);

      let aspectBonus = 1.0;
      if (isLandscapeOrientation) {
        if (cardRatio >= 0.55 && cardRatio <= 1.45) {
          aspectBonus = 1.35;
        } else if (cardRatio >= 0.45 && cardRatio <= 1.85) {
          aspectBonus = 1.0;
        } else {
          aspectBonus = 0.5;
        }
      } else {
        if (cardRatio >= 0.65 && cardRatio <= 1.3) {
          aspectBonus = 1.35;
        } else if (cardRatio >= 0.45 && cardRatio <= 1.6) {
          aspectBonus = 1.0;
        } else {
          aspectBonus = 0.5;
        }
      }

      const cardArea = cardW * cardH;
      const landscapeBonus = (isLandscapeOrientation && c >= r) ? 1.15 : 1.0;
      const portraitBonus = (!isLandscapeOrientation && !hideLockedCard && r >= c) ? 1.15 : 1.0;

      const candidateScore = cardArea * aspectBonus * landscapeBonus * portraitBonus;

      if (candidateScore > bestScore + 0.5) {
        bestScore = candidateScore;
        bestCardW = cardW;
        bestCardH = cardH;
        bestCols = c;
        bestRows = r;
        bestHideLockedCard = !!hideLockedCard;
      }
    }

    const cardW = Math.max(16, bestCardW);
    const cardH = Math.max(16, bestCardH);
    const cardMinDim = Math.min(cardW, cardH);
    const gridWidth = bestCols * cardW + (bestCols - 1) * gap;
    const gridHeight = bestRows * cardH + (bestRows - 1) * gap;

    setMemoryCardSizing(prev => {
      if (
        prev.cardSize === cardMinDim &&
        prev.cardWidth === cardW &&
        prev.cardHeight === cardH &&
        prev.gap === gap &&
        prev.cols === bestCols &&
        prev.rows === bestRows &&
        prev.gridWidth === gridWidth &&
        prev.gridHeight === gridHeight &&
        prev.hideLockedCard === bestHideLockedCard
      ) {
        return prev;
      }
      return {
        cardSize: cardMinDim,
        cardWidth: cardW,
        cardHeight: cardH,
        gap,
        cols: bestCols,
        rows: bestRows,
        gridWidth,
        gridHeight,
        hideLockedCard: bestHideLockedCard,
      };
    });
  }, [difficulty, isMobileLandscape, isPortrait, isMobileConfigOpen]);

  useEffect(() => {
    if (activeTab !== "memory" || isMobileConfigOpen) return;

    calculateSizing();
    const rafId = requestAnimationFrame(() => {
      calculateSizing();
    });

    let observerRafId: number | null = null;

    const observer = new ResizeObserver((entries) => {
      if (isMobileConfigOpen) return;
      if (observerRafId !== null) {
        cancelAnimationFrame(observerRafId);
      }
      observerRafId = requestAnimationFrame(() => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            calculateSizing(undefined, entry.contentRect.width, entry.contentRect.height);
          } else {
            calculateSizing();
          }
        }
      });
    });

    if (gridWrapperRef.current) {
      observer.observe(gridWrapperRef.current);
    } else if (memoryGridAreaRef.current) {
      observer.observe(memoryGridAreaRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (observerRafId !== null) {
        cancelAnimationFrame(observerRafId);
      }
      observer.disconnect();
    };
  }, [calculateSizing, activeTab, isMobileConfigOpen]);

  // --- PREMIUM VICTORY CELEBRATION STATE ---
  const [showVictoryCelebration, setShowVictoryCelebration] = useState<boolean>(false);
  const [fadeCelebrationOut, setFadeCelebrationOut] = useState<boolean>(false);
  const [showScoreSummary, setShowScoreSummary] = useState<boolean>(false);

  // --- 2 PLAYERS GAME STATE ---
  const [p1Score, setP1Score] = useState<number>(() => {
    return shouldRestoreVsBot && savedVsBotMatch ? savedVsBotMatch.p1Score : 0;
  });
  const [p2Score, setP2Score] = useState<number>(() => {
    return shouldRestoreVsBot && savedVsBotMatch ? savedVsBotMatch.p2Score : 0;
  });
  const [activePlayer, setActivePlayer] = useState<1 | 2>(() => {
    return shouldRestoreVsBot && savedVsBotMatch ? savedVsBotMatch.activePlayer : 1;
  });
  const [consecutiveMatches, setConsecutiveMatches] = useState<number>(() => {
    return shouldRestoreVsBot && savedVsBotMatch ? savedVsBotMatch.consecutiveMatches : 0;
  });

  // Reset landscape menu tab when mobile config menu is closed and sync pending config when opened
  useEffect(() => {
    if (!isMobileConfigOpen) {
      setLandscapeMenuTab("home");
    } else {
      setPendingDifficulty(difficulty);
      setPendingMemoryMode(memoryMode);
    }
  }, [isMobileConfigOpen, difficulty, memoryMode]);

  // --- VISUAL POLISH STATES (SHAKE, COMBO, PARTICLES) ---
  const COMBO_DISPLAY_DURATION = 1500;
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [comboCount, setComboCount] = useState<number>(0);
  const [activeCombos, setActiveCombos] = useState<Array<{
    id: number;
    count: number;
    glow: string;
    text: string;
    label: string;
    offsetX: number;
    offsetY: number;
  }>>([]);
  const [comboParticles, setComboParticles] = useState<Array<{ id: number; dx: number; dy: number; size: number; color: string; delay: number }>>([]);
  const comboTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      comboTimersRef.current.forEach(t => clearTimeout(t));
      comboTimersRef.current = [];
    };
  }, []);

  const triggerScreenShake = () => {
    // Disable heavy screen-shake visual effect on mobile/tablet touch devices to maintain a smooth 60 FPS profile
    const isTouch = typeof window !== "undefined" && (("ontouchstart" in window) || navigator.maxTouchPoints > 0);
    if (isTouch) return;

    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 80);
  };

  const triggerComboNotification = (count: number) => {
    if (count < 2) return;
    
    let label = "GOOD MATCH!";
    let glow = "shadow-yellow-500/50 border-yellow-400/50 bg-yellow-950/90 text-yellow-300";
    let text = "from-yellow-300 to-amber-400";
    
    if (count === 2) {
      label = "GOOD MATCH!";
      glow = "shadow-yellow-500/50 border-yellow-400/50 bg-yellow-950/95 text-yellow-300";
      text = "from-yellow-300 to-amber-400";
    } else if (count === 3) {
      label = "GREAT MATCH!";
      glow = "shadow-orange-500/60 border-orange-400/50 bg-orange-950/95 text-orange-300";
      text = "from-orange-400 to-amber-500";
    } else {
      label = count >= 5 ? "GODLIKE MATCH!" : "AWESOME MATCH!";
      glow = "shadow-red-500/70 border-red-500/60 bg-red-950/95 text-red-300";
      text = "from-red-500 to-amber-500";
    }

    const isTouch = typeof window !== "undefined" && (("ontouchstart" in window) || navigator.maxTouchPoints > 0);
    
    // Preset offsets for up to 3 simultaneous instances
    const offsets = [
      { x: 0, y: 0 },
      { x: 40, y: -20 },
      { x: -40, y: -40 }
    ];

    setActiveCombos(prev => {
      // Retain max 2 previous items + 1 new = max 3 simultaneous instances
      const capped = prev.slice(-2);
      const nextOffset = offsets[capped.length % offsets.length];
      
      const newItem = {
        id: Date.now() + Math.random(),
        count,
        glow,
        text,
        label,
        offsetX: nextOffset.x,
        offsetY: nextOffset.y,
      };

      const timerId = window.setTimeout(() => {
        setActiveCombos(curr => curr.filter(item => item.id !== newItem.id));
        comboTimersRef.current = comboTimersRef.current.filter(t => t !== timerId);
      }, COMBO_DISPLAY_DURATION);

      comboTimersRef.current.push(timerId);

      return [...capped, newItem];
    });

    if (count >= 5) {
      const particleCount = isTouch ? 8 : 12; // Mobile safety cap
      const newComboParticles = Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / particleCount + (Math.random() * 0.3 - 0.15);
        const speed = 35 + Math.random() * 45;
        return {
          id: Date.now() + i,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          size: 4 + Math.random() * 3,
          color: "#fbbf24", // Gold stars
          delay: Math.random() * 0.1,
        };
      });
      setComboParticles(newComboParticles);
      const particleTimerId = window.setTimeout(() => {
        setComboParticles([]);
        comboTimersRef.current = comboTimersRef.current.filter(t => t !== particleTimerId);
      }, COMBO_DISPLAY_DURATION);
      comboTimersRef.current.push(particleTimerId);
    }
  };

  // --- BOT STATE ---
  const [currentBotDifficulty, setCurrentBotDifficulty] = useState<number>(() => {
    return shouldRestoreVsBot && savedVsBotMatch ? savedVsBotMatch.currentBotDifficulty : 3;
  });
  const [botUsername, setBotUsername] = useState<string>(() => {
    if (shouldRestoreVsBot && savedVsBotMatch && savedVsBotMatch.botUsername) {
      return savedVsBotMatch.botUsername;
    }
    return getNextBotUsername();
  });
  const [aiThinkingProgress, setAiThinkingProgress] = useState<number>(0);
  const botMemoryRef = useRef<BotMemoryManager | null>(null);
  const lastHumanRevealedRef = useRef<number[]>([]);

  // --- HIGH SCORE POPUP CELEBRATION ---
  const [showHighScorePopup, setShowHighScorePopup] = useState<boolean>(false);
  const [newHighScoreValue, setNewHighScoreValue] = useState<number>(0);

  interface WatermarkEmoji {
    emoji: string;
    x: number;
    y: number;
    size: number;
    rotation: number;
  }
  const [memoryWatermarks, setMemoryWatermarks] = useState<WatermarkEmoji[]>([]);

  // Poki safeguard: Prevent page scrolling/jumping from Space and Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't block keys if focused inside an editable text input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          " ",
          "Spacebar",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Allow scrolling inside modal or scrollable content containers
      let target = e.target as HTMLElement | null;
      let isScrollable = false;
      while (target && target !== document.body && target !== document.documentElement) {
        const overflowY = window.getComputedStyle(target).overflowY;
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          target.scrollHeight > target.clientHeight
        ) {
          isScrollable = true;
          break;
        }
        target = target.parentElement;
      }
      if (!isScrollable) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Poki SDK: Sync gameplayStart / gameplayStop with active game lifecycle
  useEffect(() => {
    if (isLoading) return;

    // Active gameplay condition:
    // Game is underway (not finished), and no blocking modal/pause/menu is open
    const isGameplayActive =
      !memoryFinished &&
      !isPaused &&
      !isSettingsOpen &&
      !isShopOpen &&
      !isMobileConfigOpen &&
      !showResetConfirm &&
      !isHintModalOpen &&
      !showScoreSummary &&
      !showVictoryCelebration &&
      !showHighScorePopup &&
      !showRankUpPopup &&
      !showGentleSnowModal &&
      !isWatchingAd;

    if (isGameplayActive) {
      adManager.gameplayStart();
    } else {
      adManager.gameplayStop();
    }
  }, [
    isLoading,
    memoryFinished,
    isPaused,
    isSettingsOpen,
    isShopOpen,
    isMobileConfigOpen,
    showResetConfirm,
    isHintModalOpen,
    showScoreSummary,
    showVictoryCelebration,
    showHighScorePopup,
    showRankUpPopup,
    showGentleSnowModal,
    isWatchingAd,
  ]);

  // --- HELPERS ---
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = res[i];
      res[i] = res[j];
      res[j] = temp;
    }
    return res;
  };

  // --- CONNECTING CARDS LEVEL GENERATION ---
  const generateLevel = (levelIndex: number, historyOverride?: Record<number, { from: string; to: string }[]>) => {
    setSelectedCardIdx(null);
    setConnections([]);
    setChecked(false);
    setIsSuccess(false);
    setWrongFlatIndices([]);

    const activeHistory = historyOverride !== undefined ? historyOverride : levelHistory;

    let selectedPairs: { from: string; to: string }[] = [];
    let attempts = 0;
    const maxAttempts = 2000;

    while (attempts < maxAttempts) {
      attempts++;
      selectedPairs = [];
      const usedEmojis = new Set<string>();
      const shuffledPairs = shuffleArray(EMBEDDED_PAIRS);

      for (const pair of shuffledPairs) {
        if (!usedEmojis.has(pair.from) && !usedEmojis.has(pair.to)) {
          selectedPairs.push(pair);
          usedEmojis.add(pair.from);
          usedEmojis.add(pair.to);
        }
        if (selectedPairs.length === 3) break;
      }

      if (selectedPairs.length < 3) {
        selectedPairs = shuffledPairs.slice(0, 3);
      }

      // Check against level history rules (5-level strict 0 repeats, 10-level max 1 repeat)
      if (validateLevelPairs(selectedPairs, levelIndex, activeHistory)) {
        break; // Valid pool found!
      }
    }

    // Save this level's validated pairs to history
    const updatedHistory = {
      ...activeHistory,
      [levelIndex]: selectedPairs
    };
    setLevelHistory(updatedHistory);
    safeLocalStorage.setItem("novel_match_level_history", JSON.stringify(updatedHistory));

    // pool all 6 emojis of matching pairs and shuffle globally (allow A-to-A, matching random cards anywhere!)
    const allEmojis = selectedPairs.flatMap(p => [p.from, p.to]);
    const shuffledPool = shuffleArray(allEmojis);

    setLeftCards(shuffledPool.slice(0, 3));
    setRightCards(shuffledPool.slice(3, 6));
  };

  // --- MEMORY GAME INITS ---
  const generateMemoryGame = (
    diff: "3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | "7x8",
    targetMode?: string,
    forceNewGame: boolean = false
  ) => {
    setIsMenuDrawerOpen(false);
    if (!layoutConfig.showSidebar) {
      setIsSidebarCollapsed(true);
    }
    isRestoredRef.current = false;
    trophiesUpdatedRef.current = false;
    p2pWinsUpdatedRef.current = false;

    const effectiveMode = targetMode || memoryMode;

    if (effectiveMode === "vsBot") {
      if (!forceNewGame) {
        const saved = safeLocalStorage.getItem("emoji_brainpop_saved_vs_bot_match");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (
              parsed &&
              parsed.memoryCards &&
              parsed.memoryCards.length > 0 &&
              !parsed.memoryFinished
            ) {
              const totalPlayable = parsed.memoryCards.filter((c: string) => c !== "BLOCKED").length;
              const matchedCount = new Set((parsed.memoryMatched || []).filter((idx: number) => parsed.memoryCards[idx] !== "BLOCKED")).size;
              if (matchedCount < totalPlayable) {
                if (memoryMode !== "vsBot") {
                  setMemoryMode("vsBot");
                }
                restoreSavedVsBotMatch(parsed);
                return;
              }
            }
          } catch (e) {}
        }
      }
      safeLocalStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
    }

    setMatchSessionId(Date.now().toString());
    // Determine card dimensions
    let actualDiff = diff;
    if (effectiveMode === "twoPlayers") {
      if (diff === "5x5" || diff === "6x6" || diff === "6x8" || diff === "7x8") {
        actualDiff = diff;
      } else {
        actualDiff = "5x5";
      }
      if (!isBoardSizeUnlocked(actualDiff, "twoPlayers")) {
        actualDiff = "5x5";
      }
      if (difficulty !== actualDiff) {
        setDifficulty(actualDiff);
      }
    } else if (effectiveMode === "vsBot") {
      actualDiff = getBoardSizeForTrophies(vsBotTrophies);
      if (difficulty !== actualDiff) {
        setDifficulty(actualDiff);
      }
    } else {
      if (!isBoardSizeUnlocked(actualDiff, "solo")) {
        actualDiff = "3x4";
      }
      if (difficulty !== actualDiff) {
        setDifficulty(actualDiff);
      }
    }

    if (memoryMode !== effectiveMode) {
      setMemoryMode(effectiveMode as any);
    }

    setPendingDifficulty(actualDiff);
    setPendingMemoryMode(effectiveMode);

    const { randomizedBoard, selectedEmojis } = generateMemoryBoard(actualDiff, effectiveMode as any);

    lastGeneratedConfigRef.current = { diff: actualDiff, mode: effectiveMode };

    if (memoryFinished) {
      adManager.showCommercialAd().catch(() => {});
    }

    setMemoryCards(randomizedBoard);
    setMemoryMatched([]);
    setMatchedByP1([]);
    setMemoryFlipped([]);
    setMemoryMismatch([]);
    setMemoryMoves(0);
    setMemoryFinished(false);
    setMemoryBusy(false);
    isClickProcessingRef.current = false;
    pendingFlippedRef.current = [];
    if (botThinkingTimerRef.current) {
      clearTimeout(botThinkingTimerRef.current);
      botThinkingTimerRef.current = null;
    }
    setIsPaused(false);
    if (safeLocalStorage.getItem("emoji_brainpop_demo_played") !== "true") {
      demoHasStartedRef.current = false;
      setTutorialStep(0);
    }
    setShowVictoryCelebration(false);
    setFadeCelebrationOut(false);
    setShowScoreSummary(false);
    setComboCount(0);
    setActiveCombos([]);
    comboTimersRef.current.forEach(t => clearTimeout(t));
    comboTimersRef.current = [];
    setComboParticles([]);
    setClassicAdWatched(false);
    setChallengeAdWatched(false);
    setIsWatchingAd(false);

    adManager.gameplayStart();

    if (effectiveMode === "twoPlayers" || effectiveMode === "vsBot") {
      setP1Score(0);
      setP2Score(0);
      setActivePlayer(1);
      setConsecutiveMatches(0);
    }

    if (effectiveMode === "vsBot") {
      const bDiff = selectBotDifficultyForTrophies(vsBotTrophies);
      setCurrentBotDifficulty(bDiff);
      botMemoryRef.current = new BotMemoryManager(bDiff);
      lastHumanRevealedRef.current = [];
      
      setBotUsername(getNextBotUsername());
      setAiThinkingProgress(0);
    } else {
      botMemoryRef.current = null;
      lastHumanRevealedRef.current = [];
    }

    // Generate watermark emojis from current game's selectedEmojis list
    const watermarks: WatermarkEmoji[] = [];
    const numWatermarks = 6 + Math.floor(Math.random() * 4); // 6 to 9 watermarks
    for (let i = 0; i < numWatermarks; i++) {
      const emoji = selectedEmojis[i % selectedEmojis.length];
      const x = Math.floor(Math.random() * 120) - 10; // Allow partially extending off-screen (-10% to 110%)
      const y = Math.floor(Math.random() * 120) - 10;
      const size = Math.floor(Math.random() * 101) + 80; // 80px to 180px
      const sign = Math.random() < 0.5 ? -1 : 1;
      const rotation = sign * (Math.floor(Math.random() * 21) + 10); // Rotate slightly +/- 10 to +/- 30 degrees
      watermarks.push({ emoji, x, y, size, rotation });
    }
    setMemoryWatermarks(watermarks);

    // Reset memory game timer
    const getInitialTime = () => {
      switch (actualDiff) {
        case "3x4": return 60;
        case "4x4": return 90;
        case "4x5": return 120;
        case "5x5": return 150;
        case "5x6": return 180;
        case "6x6": return 240;
        case "6x8": return 300;
        case "7x8": return 360;
        default: return 120;
      }
    };
    setMemoryTimeLeft(getInitialTime());
    setMemoryTimerActive(true);

    calculateSizing(actualDiff);
  };

  // Tick memory timer (Non-blocking: continues ticking past zero into negative values)
  useEffect(() => {
    let intervalId: any = null;
    if (memoryTimerActive && !memoryFinished && activeTab === "memory" && !isPaused && !isMobileConfigOpen) {
      intervalId = setInterval(() => {
        setMemoryTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [memoryTimerActive, memoryFinished, activeTab, isPaused, isMobileConfigOpen]);

  // Sync generators with selections
  useEffect(() => {
    generateLevel(level);
  }, [level]);

  const restoreSavedVsBotMatch = (savedState: any) => {
    if (!savedState) return;
    setIsMenuDrawerOpen(false);
    isRestoredRef.current = true;

    let restoredDiff = "5x6";
    if (savedState.memoryCards) {
      if (savedState.memoryCards.length === 12) restoredDiff = "3x4";
      else if (savedState.memoryCards.length === 16) restoredDiff = "4x4";
      else if (savedState.memoryCards.length === 20) restoredDiff = "4x5";
      else if (savedState.memoryCards.length === 24 || savedState.memoryCards.length === 25) restoredDiff = "5x5";
      else if (savedState.memoryCards.length === 30) restoredDiff = "5x6";
      else if (savedState.memoryCards.length === 36) restoredDiff = "6x6";
      else if (savedState.memoryCards.length === 48) restoredDiff = "6x8";
      else if (savedState.memoryCards.length === 56) restoredDiff = "7x8";
    }
    setDifficulty(restoredDiff);
    if (savedState.matchSessionId) {
      setMatchSessionId(savedState.matchSessionId);
    }
    setMemoryCards(savedState.memoryCards);
    setMemoryMatched(savedState.memoryMatched);
    setMatchedByP1(savedState.matchedByP1 || []);
    // Safety: ensure saved matches resume with cards face down if restored mid-flip
    setMemoryFlipped(savedState.memoryFlipped && savedState.memoryFlipped.length < 2 ? savedState.memoryFlipped : []);
    setMemoryMoves(savedState.memoryMoves);
    setMemoryFinished(savedState.memoryFinished);
    setP1Score(savedState.p1Score);
    setP2Score(savedState.p2Score);
    setActivePlayer(savedState.activePlayer);
    setConsecutiveMatches(savedState.consecutiveMatches);
    setCurrentBotDifficulty(savedState.currentBotDifficulty);
    if (savedState.botUsername) {
      setBotUsername(savedState.botUsername);
    }

    const manager = new BotMemoryManager(savedState.currentBotDifficulty);
    manager.restoreMemory(savedState.botMemory || []);
    botMemoryRef.current = manager;
    lastHumanRevealedRef.current = savedState.lastHumanRevealed || [];

    setMemoryTimeLeft(savedState.memoryTimeLeft ?? 60);
    setMemoryWatermarks(savedState.memoryWatermarks || []);

    setMemoryBusy(false);
    setShowVictoryCelebration(false);
    setFadeCelebrationOut(false);
    setShowScoreSummary(false);
    trophiesUpdatedRef.current = false;
    p2pWinsUpdatedRef.current = false;

    calculateSizing(restoredDiff);
  };

  const applyPendingConfigurationAndStartOrResume = () => {
    let targetDiff = pendingDifficulty;
    if (pendingMemoryMode === "vsBot") {
      targetDiff = getBoardSizeForTrophies(vsBotTrophies);
    } else if (pendingMemoryMode === "twoPlayers") {
      if (targetDiff !== "5x5" && targetDiff !== "6x6" && targetDiff !== "6x8" && targetDiff !== "7x8") {
        targetDiff = "5x5";
      }
      if (!isBoardSizeUnlocked(targetDiff, "twoPlayers")) {
        targetDiff = "5x5";
      }
    } else {
      if (!isBoardSizeUnlocked(targetDiff, "solo")) {
        targetDiff = "3x4";
      }
    }

    const configChanged =
      difficulty !== targetDiff ||
      memoryMode !== pendingMemoryMode ||
      memoryCards.length === 0;

    setMemoryMode(pendingMemoryMode);
    setDifficulty(targetDiff);
    setPendingDifficulty(targetDiff);

    setIsMobileConfigOpen(false);
    setIsPaused(false);

    if (configChanged) {
      generateMemoryGame(targetDiff as any, pendingMemoryMode);
    } else {
      calculateSizing(targetDiff);
    }
  };

  const ensureGameGenerated = () => {
    applyPendingConfigurationAndStartOrResume();
  };

  useEffect(() => {
    if (isRestoredRef.current) {
      isRestoredRef.current = false;
      calculateSizing();
      return;
    }

    if (memoryMode === "vsBot") {
      const saved = safeLocalStorage.getItem("emoji_brainpop_saved_vs_bot_match");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.memoryCards && parsed.memoryCards.length > 0 && !parsed.memoryFinished) {
            calculateSizing();
            return;
          }
        } catch (e) {}
      }
    }

    if (memoryCards.length === 0) {
      generateMemoryGame(difficulty);
    } else {
      calculateSizing(difficulty);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "memory") {
      if (memoryCards.length === 0) {
        generateMemoryGame(difficulty);
      } else {
        calculateSizing(difficulty);
      }
    }
  }, [activeTab]);

  // One-time interactive guided tutorial sequence for first-time players
  useEffect(() => {
    const hasPlayedDemo = safeLocalStorage.getItem("emoji_brainpop_demo_played") === "true";
    if (
      !hasPlayedDemo &&
      !demoHasStartedRef.current &&
      activeTab === "memory" &&
      memoryMode === "solo" &&
      difficulty === "3x4" &&
      memoryCards.length === 12 &&
      !memoryFinished
    ) {
      const cardAIndex = 0;
      const cardAEmoji = memoryCards[cardAIndex];
      const cardBIndex = memoryCards.findIndex((e, idx) => idx !== cardAIndex && e === cardAEmoji && e !== "BLOCKED");

      if (cardBIndex !== -1) {
        demoHasStartedRef.current = true;
        setTutorialCardA(cardAIndex);
        setTutorialCardB(cardBIndex);
        setTutorialStep(1); // Step 1: Highlight Card A and show finger pointer
      } else {
        safeLocalStorage.setItem("emoji_brainpop_demo_played", "true");
      }
    }
  }, [memoryCards.length, memoryMode, activeTab, difficulty, memoryFinished]);

  // Advance guided tutorial from Step 1 -> Step 2 when Card A is flipped
  useEffect(() => {
    if (tutorialStep === 1 && tutorialCardA !== -1 && memoryFlipped.includes(tutorialCardA)) {
      setTutorialStep(2); // Step 2: Highlight Card B (matching pair) and show finger pointer
    }
  }, [memoryFlipped, tutorialStep, tutorialCardA]);

  // Watchdog Safety Net: Auto-reset memoryBusy and processing lock if left stuck by interrupted animations/timers
  useEffect(() => {
    if (!memoryBusy && !isClickProcessingRef.current) return;
    const timeout = setTimeout(() => {
      setMemoryBusy(false);
      isClickProcessingRef.current = false;
      if (memoryFlipped.length >= 2) {
        setMemoryFlipped([]);
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [memoryBusy, memoryFlipped.length]);
  useEffect(() => {
    if (tutorialStep === 2 && (memoryMatched.includes(tutorialCardA) || memoryMatched.includes(tutorialCardB))) {
      setTutorialStep(0);
      safeLocalStorage.setItem("emoji_brainpop_demo_played", "true");
    }
  }, [memoryMatched, tutorialStep, tutorialCardA, tutorialCardB]);

  // Reactive Safety Net: guarantees game completion whenever all playable cards on board are matched
  useEffect(() => {
    if (activeTab !== "memory" || memoryFinished || memoryCards.length === 0) return;

    const totalPlayableCards = memoryCards.filter(c => c !== "BLOCKED").length;
    if (totalPlayableCards === 0) return;

    const uniqueMatchedCount = new Set(memoryMatched.filter(idx => memoryCards[idx] !== "BLOCKED")).size;

    if (uniqueMatchedCount >= totalPlayableCards) {
      const timer = setTimeout(() => {
        if (!memoryFinished) {
          if (memoryMode === "solo") {
            const basePoints = Math.round((memoryCards.length * 1) / 2);
            const timeBonus = Math.round((memoryTimeLeft > 0 ? memoryTimeLeft * 2 : 0) / 5);
            const flipEfficiencyBonus = Math.round(Math.max(0, 1000 - memoryMoves * 10) / 100);
            const rawScore = basePoints + timeBonus + flipEfficiencyBonus;

            const prevGames = parseInt(safeLocalStorage.getItem("emoji_brainpop_classic_games_completed") || "0", 10);
            const newGamesCount = prevGames + 1;
            safeLocalStorage.setItem("emoji_brainpop_classic_games_completed", newGamesCount.toString());
            setClassicGamesCompleted(newGamesCount);

            setMemoryFlipState(prev => {
              const newScore = prev.score + rawScore;
              const updated = {
                ...prev,
                score: newScore,
                highScore: Math.max(prev.highScore, rawScore)
              };
              safeLocalStorage.setItem("novel_match_memory_flip_state", JSON.stringify(updated));
              return updated;
            });
            synth.playVictory();
          }
          setMemoryFinished(true);
          adManager.gameplayStop();
          setShowScoreSummary(true);
          setShowVictoryCelebration(false);
          setMemoryBusy(false);
          isClickProcessingRef.current = false;
          safeLocalStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeTab, memoryFinished, memoryCards, memoryMatched, memoryMode, memoryTimeLeft, memoryMoves]);

  useEffect(() => {
    if (shouldRestoreVsBot && savedVsBotMatch) {
      const manager = new BotMemoryManager(savedVsBotMatch.currentBotDifficulty);
      manager.restoreMemory(savedVsBotMatch.botMemory || []);
      botMemoryRef.current = manager;
      lastHumanRevealedRef.current = savedVsBotMatch.lastHumanRevealed || [];
    }
  }, [shouldRestoreVsBot]);

  // Automatically save VS BOT match state on any change
  useEffect(() => {
    const targetPairsToWin = getTargetPairsToWin(difficulty, memoryCards.length);
    const totalPlayableCards = memoryCards.filter(c => c !== "BLOCKED").length;
    const uniqueMatchedCount = new Set(memoryMatched.filter(idx => memoryCards[idx] !== "BLOCKED")).size;
    const isCompleted = memoryCards.length > 0 && (
      (totalPlayableCards > 0 && uniqueMatchedCount >= totalPlayableCards) ||
      (memoryMode === "twoPlayers" && (p1Score >= targetPairsToWin || p2Score >= targetPairsToWin))
    );

    if (memoryMode === "vsBot" && !memoryFinished && !isCompleted && memoryCards.length > 0) {
      const stateToSave = {
        memoryCards,
        memoryMatched,
        memoryFlipped: memoryFlipped.length < 2 ? memoryFlipped : [], // Always store clean flip state to prevent lock on reload
        memoryMoves,
        memoryFinished,
        p1Score,
        p2Score,
        activePlayer,
        consecutiveMatches,
        currentBotDifficulty,
        botMemory: botMemoryRef.current?.getMemory() || [],
        lastHumanRevealed: lastHumanRevealedRef.current,
        memoryTimeLeft,
        memoryWatermarks,
        matchedByP1,
        matchSessionId,
        botUsername,
      };
      safeLocalStorage.setItem("emoji_brainpop_saved_vs_bot_match", JSON.stringify(stateToSave));
    } else if (memoryFinished || isCompleted) {
      safeLocalStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
    }
  }, [
    memoryMode,
    memoryFinished,
    memoryCards,
    memoryMatched,
    memoryFlipped,
    memoryMoves,
    p1Score,
    p2Score,
    activePlayer,
    consecutiveMatches,
    currentBotDifficulty,
    memoryTimeLeft,
    memoryWatermarks,
    matchedByP1,
    matchSessionId,
    botUsername,
  ]);

  // Update VS BOT trophies when a match is completed
  useEffect(() => {
    if (memoryFinished && memoryMode === "vsBot" && !trophiesUpdatedRef.current) {
      trophiesUpdatedRef.current = true;
      const trophyChange = p1Score - p2Score;
      setVsBotTrophies(prev => {
        const nextTrophies = Math.max(0, prev + trophyChange);
        safeLocalStorage.setItem("emoji_brainpop_vs_bot_trophies", nextTrophies.toString());
        safeLocalStorage.setItem("emoji_brainpop_vs_bot_rating", nextTrophies.toString());
        return nextTrophies;
      });
      safeLocalStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
    }
  }, [memoryFinished, memoryMode, p1Score, p2Score]);

  // Update 2 Players Match record wins when a match is completed
  useEffect(() => {
    if (memoryFinished && memoryMode === "twoPlayers" && !p2pWinsUpdatedRef.current) {
      p2pWinsUpdatedRef.current = true;
      if (p1Score > p2Score) {
        setWinsP1(prev => {
          const nextVal = prev + 1;
          safeLocalStorage.setItem("emoji_brainpop_2p_wins_p1", nextVal.toString());
          return nextVal;
        });
      } else if (p2Score > p1Score) {
        setWinsP2(prev => {
          const nextVal = prev + 1;
          safeLocalStorage.setItem("emoji_brainpop_2p_wins_p2", nextVal.toString());
          return nextVal;
        });
      }
    }
  }, [memoryFinished, memoryMode, p1Score, p2Score]);

  // --- REWARDED ADS HANDLERS ---
  const handleRewardedAd = (onSuccess: () => void) => {
    setIsWatchingAd(true);
    synth.playSelect();

    adManager.showRewardedAd()
      .then((withReward: boolean) => {
        setIsWatchingAd(false);
        if (withReward) {
          onSuccess();
        }
      })
      .catch((err: any) => {
        setIsWatchingAd(false);
        console.warn("Rewarded ad error:", err);
      });
  };

  const handleWatchAdClassic = (levelScore: number) => {
    if (classicAdWatched || isWatchingAd) return;

    handleRewardedAd(() => {
      setClassicAdWatched(true);
      setMemoryFlipState(prev => {
        const newScore = prev.score + levelScore;
        const doubledLevelScore = levelScore * 2;
        const newHighScore = Math.max(prev.highScore, doubledLevelScore);
        const updated = {
          ...prev,
          score: newScore,
          highScore: newHighScore,
        };
        safeLocalStorage.setItem("novel_match_memory_flip_state", JSON.stringify(updated));
        return updated;
      });
      synth.playRankUp();
    });
  };

  const handleWatchAdChallenge = (diffValue: number) => {
    if (challengeAdWatched || isWatchingAd) return;

    handleRewardedAd(() => {
      setChallengeAdWatched(true);

      if (diffValue > 0) {
        // WIN: double trophies gained (x2)
        const bonusTrophies = diffValue;
        setVsBotTrophies(prev => {
          const next = prev + bonusTrophies;
          safeLocalStorage.setItem("emoji_brainpop_vs_bot_trophies", next.toString());
          safeLocalStorage.setItem("emoji_brainpop_vs_bot_rating", next.toString());
          return next;
        });
      } else if (diffValue < 0) {
        // LOSS: reduce trophy loss by 50%
        const lossAmount = Math.abs(diffValue);
        const recoveryAmount = Math.max(1, Math.floor(lossAmount / 2));
        setVsBotTrophies(prev => {
          const next = prev + recoveryAmount;
          safeLocalStorage.setItem("emoji_brainpop_vs_bot_trophies", next.toString());
          safeLocalStorage.setItem("emoji_brainpop_vs_bot_rating", next.toString());
          return next;
        });
      } else {
        // DRAW: +1 bonus trophy
        setVsBotTrophies(prev => {
          const next = prev + 1;
          safeLocalStorage.setItem("emoji_brainpop_vs_bot_trophies", next.toString());
          safeLocalStorage.setItem("emoji_brainpop_vs_bot_rating", next.toString());
          return next;
        });
      }
      synth.playRankUp();
    });
  };

  // Track AI thinking progress for visual bar in real-time
  useEffect(() => {
    if (memoryMode !== "vsBot" || activePlayer !== 2 || memoryFinished || memoryBusy || isPaused || isMobileConfigOpen) {
      setAiThinkingProgress(0);
      return;
    }

    const config = getBotConfig(currentBotDifficulty);
    const duration = config.thinkingTimeMs;
    const startTime = Date.now();
    let animId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setAiThinkingProgress(progress);

      if (elapsed < duration) {
        animId = requestAnimationFrame(updateProgress);
      }
    };

    animId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animId);
      setAiThinkingProgress(0);
    };
  }, [
    activePlayer,
    memoryMode,
    memoryFinished,
    memoryBusy,
    currentBotDifficulty,
    memoryFlipped
  ]);

  // Trigger BOT turn automatically in VS BOT mode
  useEffect(() => {
    if (memoryMode !== "vsBot" || activePlayer !== 2 || memoryFinished || memoryBusy || isPaused || isMobileConfigOpen) {
      if (botThinkingTimerRef.current) {
        clearTimeout(botThinkingTimerRef.current);
        botThinkingTimerRef.current = null;
      }
      return;
    }

    const config = getBotConfig(currentBotDifficulty);
    const thinkingTimeout = setTimeout(() => {
      botThinkingTimerRef.current = null;
      if (memoryFinished || activePlayer !== 2 || isPaused || isMobileConfigOpen) return;

      let decision = BotDecisionEngine.decideNextFlip({
        cards: memoryCards,
        matchedIndices: memoryMatched,
        flippedIndices: memoryFlipped,
        memory: botMemoryRef.current?.getMemory() || [],
        lastHumanRevealed: lastHumanRevealedRef.current,
      });

      if (decision === -1) {
        // Fallback: choose any valid unrevealed and unmatched card
        const available = memoryCards
          .map((c, i) => i)
          .filter(i => memoryCards[i] !== "BLOCKED" && !memoryMatched.includes(i) && !memoryFlipped.includes(i));
        if (available.length > 0) {
          decision = available[Math.floor(Math.random() * available.length)];
        }
      }

      if (decision !== -1) {
        handleMemoryCardClickRef.current(decision, true);
      }
    }, config.thinkingTimeMs);

    botThinkingTimerRef.current = thinkingTimeout;

    return () => {
      clearTimeout(thinkingTimeout);
      if (botThinkingTimerRef.current === thinkingTimeout) {
        botThinkingTimerRef.current = null;
      }
    };
  }, [
    memoryMode,
    activePlayer,
    memoryFinished,
    memoryBusy,
    isPaused,
    isMobileConfigOpen,
    memoryFlipped,
    memoryCards,
    memoryMatched,
    currentBotDifficulty
  ]);

  useEffect(() => {
    synth.enabled = soundOn;
    if (soundOn) {
      synth.playMusic(equippedMusicId);
    } else {
      synth.stopMusic();
    }
    return () => {
      synth.stopMusic();
    };
  }, [soundOn, equippedMusicId]);

  useEffect(() => {
    if (!isSettingsOpen) {
      setIsLangDropdownOpen(false);
    }
  }, [isSettingsOpen]);

  useEffect(() => {
    setIsBoardSizeDropdownOpen(false);
    setIsBoardSizeDropdownOpenMobile(false);
    setIsGameTypeDropdownOpen(false);
    setIsPlayModeDropdownOpen(false);
    setIsPlayModeDropdownOpenMobile(false);
  }, [difficulty, memoryMode, activeTab, showMemoryConfirm]);

  // --- CONNECTING CARDS AUTO-VERIFIER (TRUY CẬP ĐÚNG 3 CẶP) ---
  useEffect(() => {
    if (connections.length === 3 && !checked) {
      // Trigger automatic assessment inside timeout to let line animations update cleanly
      const timer = setTimeout(() => {
        evaluateMatchingGame();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [connections]);

  const getEmojiByFlatIndex = (flatIdx: number): string => {
    if (flatIdx < 3) return leftCards[flatIdx];
    return rightCards[flatIdx - 3];
  };

  const evaluateMatchingGame = () => {
    let allCorrect = true;
    const wrongList: number[] = [];

    connections.forEach(([idxA, idxB]) => {
      const emojiA = getEmojiByFlatIndex(idxA);
      const emojiB = getEmojiByFlatIndex(idxB);

      if (!areCompatible(emojiA, emojiB)) {
        allCorrect = false;
        wrongList.push(idxA, idxB);
      }
    });

    setWrongFlatIndices(wrongList);
    setChecked(true);
    setIsSuccess(allCorrect);

    if (allCorrect) {
      synth.playSuccess();
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 100 + newStreak * 25;
      
      setCardConnectionState(prev => {
        const newScore = prev.score + points;
        const updated = {
          ...prev,
          score: newScore,
          highScore: Math.max(prev.highScore, newScore)
        };
        safeLocalStorage.setItem("novel_match_card_connection_state", JSON.stringify(updated));
        return updated;
      });
    } else {
      synth.playFailure();
      setStreak(0);
    }
  };

  // Cable coordinates solver for any-to-any layout based on flat indices
  const updateLineCoordinates = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const newCoords: LineCoord[] = connections.map(([idxA, idxB]) => {
      const nodeA = document.getElementById(`peg-${idxA}`);
      const nodeB = document.getElementById(`peg-${idxB}`);

      if (nodeA && nodeB) {
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();

        const x1 = rectA.left + rectA.width / 2 - containerRect.left;
        const y1 = rectA.top + rectA.height / 2 - containerRect.top;
        const x2 = rectB.left + rectB.width / 2 - containerRect.left;
        const y2 = rectB.top + rectB.height / 2 - containerRect.top;

        let isWrong = false;
        if (checked) {
          const emojiA = getEmojiByFlatIndex(idxA);
          const emojiB = getEmojiByFlatIndex(idxB);
          isWrong = !areCompatible(emojiA, emojiB);
        }

        return {
          flatIndex1: idxA,
          flatIndex2: idxB,
          x1,
          y1,
          x2,
          y2,
          isWrong
        };
      }
      return null;
    }).filter(Boolean) as LineCoord[];

    setLineCoords(newCoords);
  };

  useLayoutEffect(() => {
    if (activeTab === "connect") {
      updateLineCoordinates();
      const timer = setTimeout(updateLineCoordinates, 120);
      return () => clearTimeout(timer);
    }
  }, [connections, leftCards, rightCards, checked, activeTab]);

  useEffect(() => {
    if (activeTab !== "connect") return;

    let resizeObserver: ResizeObserver | null = null;
    let connectRafId: number | null = null;

    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (connectRafId !== null) {
          cancelAnimationFrame(connectRafId);
        }
        connectRafId = requestAnimationFrame(() => {
          updateLineCoordinates();
        });
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (connectRafId !== null) {
        cancelAnimationFrame(connectRafId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [activeTab]);

  // Helper to find the card index under a client point
  const getCardIndexAtPoint = (clientX: number, clientY: number): number | null => {
    // Left cards
    for (let i = 0; i < 3; i++) {
      const leftCard = document.getElementById(`card-left-${i}`);
      if (leftCard) {
        const rect = leftCard.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          return i;
        }
      }
    }
    // Right cards
    for (let i = 0; i < 3; i++) {
      const rightCard = document.getElementById(`card-right-${i}`);
      if (rightCard) {
        const rect = rightCard.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          return i + 3; // flat index
        }
      }
    }
    return null;
  };

  const triggerMatchCardPress = (flatIdx: number) => {
    setPressedMatchCardIdx(flatIdx);
    setReturningMatchCardIdx(null);
    setTimeout(() => {
      setPressedMatchCardIdx((prev) => {
        if (prev === flatIdx) {
          setReturningMatchCardIdx(flatIdx);
          setTimeout(() => {
            setReturningMatchCardIdx((r) => r === flatIdx ? null : r);
          }, 75);
          return null;
        }
        return prev;
      });
    }, 75);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, index: number) => {
    if (checked) return;
    
    // We only care about primary click/touch (button 0 for mouse, or any touch)
    if (e.pointerType === "mouse" && e.button !== 0) return;

    // Trigger press animation
    triggerMatchCardPress(index);

    const node = document.getElementById(`peg-${index}`);
    if (node && containerRef.current) {
      const rect = node.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const startX = rect.left + rect.width / 2 - containerRect.left;
      const startY = rect.top + rect.height / 2 - containerRect.top;

      setDragStartInfo({
        index,
        startX,
        startY,
        clientX: e.clientX,
        clientY: e.clientY,
        isDragging: false
      });
      setDragCurrentPos({ x: startX, y: startY });
    }
  };

  useEffect(() => {
    if (!dragStartInfo) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      // Calculate distance moved from initial point to avoid tiny accidental drag jitters
      const dx = e.clientX - dragStartInfo.clientX;
      const dy = e.clientY - dragStartInfo.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (!dragStartInfo.isDragging && dist > 8) {
        setDragStartInfo(prev => prev ? { ...prev, isDragging: true } : null);
      }

      const relX = e.clientX - containerRect.left;
      const relY = e.clientY - containerRect.top;
      setDragCurrentPos({ x: relX, y: relY });
    };

    const handlePointerUp = (e: PointerEvent) => {
      const targetIdx = getCardIndexAtPoint(e.clientX, e.clientY);

      if (dragStartInfo.isDragging) {
        if (targetIdx !== null && targetIdx !== dragStartInfo.index && !checked) {
          // Establish connection
          synth.playConnect();
          const filtered = connections.filter(
            ([a, b]) => a !== dragStartInfo.index && b !== dragStartInfo.index && a !== targetIdx && b !== targetIdx
          );
          const u = Math.min(dragStartInfo.index, targetIdx);
          const v = Math.max(dragStartInfo.index, targetIdx);
          setConnections([...filtered, [u, v]]);
        }
      } else {
        // It was a simple short click/tap - fallback to standard select/click logic
        handleCardClick(dragStartInfo.index);
      }

      setDragStartInfo(null);
      setDragCurrentPos(null);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragStartInfo, connections, checked]);

  // Click any Card (uniform handler for 6 cards)
  const handleCardClick = (idx: number) => {
    if (checked) return;
    synth.playSelect();

    if (selectedCardIdx === idx) {
      setSelectedCardIdx(null);
      return;
    }

    if (selectedCardIdx !== null) {
      synth.playConnect();
      
      // Filter out any connection already containing selectedCardIdx or idx
      const filtered = connections.filter(
        ([a, b]) => a !== selectedCardIdx && b !== selectedCardIdx && a !== idx && b !== idx
      );
      
      const u = Math.min(selectedCardIdx, idx);
      const v = Math.max(selectedCardIdx, idx);

      setConnections([...filtered, [u, v]]);
      setSelectedCardIdx(null);
    } else {
      // If of connection, disconnect first and select it for quick rerouting
      const hasConnection = connections.some(([a, b]) => a === idx || b === idx);
      if (hasConnection) {
        setConnections(connections.filter(([a, b]) => a !== idx && b !== idx));
      }
      setSelectedCardIdx(idx);
    }
  };

  const removeConnection = (idx: number) => {
    if (checked) return;
    synth.playSelect();
    setConnections(connections.filter(([a, b]) => a !== idx && b !== idx));
  };

  const clearAllConnections = () => {
    if (checked) return;
    synth.playSelect();
    setConnections([]);
    setSelectedCardIdx(null);
  };

  const handleReplayOriginal = () => {
    synth.playSelect();
    setConnections([]);
    setSelectedCardIdx(null);
    setChecked(false);
    setIsSuccess(false);
    setWrongFlatIndices([]);
  };

  const handleNextLevel = () => {
    synth.playSelect();
    setLevel(prev => prev + 1);
  };

  const handleRestartFull = () => {
    synth.playSelect();
    setLevel(1);
    setStreak(0);
    setLevelHistory({});
    safeLocalStorage.removeItem("novel_match_level_history");

    // Reset both current scores
    setCardConnectionState(prev => {
      const updated = { ...prev, score: 0 };
      safeLocalStorage.setItem("novel_match_card_connection_state", JSON.stringify(updated));
      return updated;
    });
    setMemoryFlipState(prev => {
      const updated = { ...prev, score: 0 };
      safeLocalStorage.setItem("novel_match_memory_flip_state", JSON.stringify(updated));
      return updated;
    });

    generateLevel(1, {});
    generateMemoryGame(difficulty);
  };

  const handleBackToMenu = () => {
    try {
      synth?.playSelect?.();
    } catch (e) {
      console.warn("Audio error:", e);
    }
    setMemoryFinished(false);
    setShowScoreSummary(false);
    setShowVictoryCelebration(false);
    setFadeCelebrationOut(false);
    setMemoryBusy(false);
    isClickProcessingRef.current = false;
    pendingFlippedRef.current = [];
    if (botThinkingTimerRef.current) {
      clearTimeout(botThinkingTimerRef.current);
      botThinkingTimerRef.current = null;
    }
    setIsWatchingAd(false);
    safeLocalStorage.removeItem("emoji_brainpop_saved_vs_bot_match");

    // Reset game board state to prevent auto-completion re-triggering end-game panel
    setMemoryMatched([]);
    setMatchedByP1([]);
    setMemoryFlipped([]);
    setMemoryMismatch([]);
    setMemoryMoves(0);
    setP1Score(0);
    setP2Score(0);
    setComboCount(0);
    setActiveCombos([]);

    // Generate fresh memory game for current difficulty
    generateMemoryGame(difficulty);

    // Open mobile menu panel overlay if on mobile/portrait layout
    if (layoutConfig.allowMobileConfigMenu) {
      setIsMobileConfigOpen(true);
    }

    setActiveTab("memory");
  };

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    safeLocalStorage.setItem("emoji_brainpop_lang", newLang);
  };

  // --- TAB 2: MEMORY GAME CLICK LOGIC ---
  const handleMemoryMatchReward = (newMatchedIndices: number[], currentMoves: number, isCombo: boolean) => {
    const totalPlayableCards = memoryCards.filter(c => c !== "BLOCKED").length;
    const uniqueMatchedCount = new Set(newMatchedIndices.filter(idx => memoryCards[idx] !== "BLOCKED")).size;
    const isCompleted = totalPlayableCards > 0 && uniqueMatchedCount >= totalPlayableCards;

    const applyRewards = () => {
      const basePoints = Math.round((memoryCards.length * 1) / 2);
      const timeBonus = Math.round((memoryTimeLeft > 0 ? memoryTimeLeft * 2 : 0) / 5);
      const flipEfficiencyBonus = Math.round(Math.max(0, 1000 - currentMoves * 10) / 100);
      const rawScore = basePoints + timeBonus + flipEfficiencyBonus;
      const potentialScore = rawScore * 2;

      const isSolo = memoryMode === "solo";
      const currentHighScore = memoryFlipState.highScore;
      const isPotentialNewHigh = isSolo && potentialScore > currentHighScore;

      if (isCompleted) {
        let gentleSnowUnlockedThisGame = false;
        if (isSolo) {
          const prevGames = parseInt(safeLocalStorage.getItem("emoji_brainpop_classic_games_completed") || "0", 10);
          const newGamesCount = prevGames + 1;
          safeLocalStorage.setItem("emoji_brainpop_classic_games_completed", newGamesCount.toString());
          setClassicGamesCompleted(newGamesCount);

          const isSnowOwned = getInventoryState().ownedItemIds.includes("effect_snow");
          const alreadyNotified = safeLocalStorage.getItem("emoji_brainpop_gentle_snow_unlocked_notified") === "true";

          if (newGamesCount >= 3 && !isSnowOwned && !alreadyNotified) {
            unlockItem("effect_snow");
            safeLocalStorage.setItem("emoji_brainpop_gentle_snow_unlocked_notified", "true");
            gentleSnowUnlockedThisGame = true;
          }

          setMemoryFlipState(prev => {
            const newScore = prev.score + rawScore;
            const updated = {
              ...prev,
              score: newScore,
              highScore: Math.max(prev.highScore, rawScore)
            };
            safeLocalStorage.setItem("novel_match_memory_flip_state", JSON.stringify(updated));
            return updated;
          });
        }

        setMemoryFinished(true);
        adManager.gameplayStop();
        setShowScoreSummary(true);
        setShowVictoryCelebration(false);
        safeLocalStorage.removeItem("emoji_brainpop_saved_vs_bot_match");

        if (isPotentialNewHigh) {
          synth.playHighScore();
          setNewHighScoreValue(potentialScore);
          setShowHighScorePopup(true);
          triggerScreenShake();
          if (gentleSnowUnlockedThisGame) {
            setHasPendingGentleSnow(true);
          }
        } else if (gentleSnowUnlockedThisGame) {
          setShowGentleSnowModal(true);
        } else {
          synth.playVictory();
        }
      }
      setMemoryBusy(false);
      isClickProcessingRef.current = false;
    };

    if (isCombo) {
      setTimeout(() => {
        applyRewards();
      }, COMBO_DISPLAY_DURATION);
    } else {
      setTimeout(() => {
        applyRewards();
      }, 300);
    }
  };

  /*
    Memory Match flip rules:
    The user can flip 2 emojis and remember their positions.
    When flipping the 3rd one, the previous 2 cards will flip back down (unless they already matched).
    When flipping the 4th, the 3rd flips back down, and so on.
  */
  const handleMemoryCardClick = (clickedIdx: number, isBotAction: boolean = false, isDemoAction: boolean = false) => {
    if (isPaused || isMobileConfigOpen) return;
    if (memoryFinished) return;
    if (isClickProcessingRef.current && !isDemoAction) return; // Prevent double-click race conditions
    if (memoryCards[clickedIdx] === "BLOCKED") return; // Blocked card can't be clicked or flipped
    if (memoryBusy && !isDemoAction) return; // Block clicks during auto-flip delay
    if (memoryMatched.includes(clickedIdx)) return; // Already matched
    if (memoryFlipped.includes(clickedIdx) || pendingFlippedRef.current.includes(clickedIdx)) return; // Already flipped or pending
    if (pendingFlippedRef.current.length >= 2 && !isDemoAction) return; // Rapid multi-touch guard

    // Guided tutorial restrictions: only allow clicking the target card during tutorial steps
    if (tutorialStep === 1 && clickedIdx !== tutorialCardA) return;
    if (tutorialStep === 2 && clickedIdx !== tutorialCardB) return;

    if (memoryMode === "vsBot" && activePlayer === 2 && !isBotAction) return; // Block player clicks during BOT turn

    // Determine current active flipped list from pendingFlippedRef or memoryFlipped fallback
    const currentFlipped = pendingFlippedRef.current.length > 0 ? [...pendingFlippedRef.current] : [...memoryFlipped];

    if (currentFlipped.length >= 2 && !isDemoAction) return; // Safety guard: pair already active

    if (currentFlipped.length === 0) {
      // First card flipped
      pendingFlippedRef.current = [clickedIdx];
      setMemoryFlipped([clickedIdx]);

      if (memoryMode === "twoPlayers" || memoryMode === "vsBot") {
        synth.playSelect();
        setMemoryMoves(prev => prev + 1);
        if (memoryMode === "vsBot") {
          botMemoryRef.current?.recordReveal(memoryCards[clickedIdx], clickedIdx);
          if (activePlayer === 1) {
            lastHumanRevealedRef.current = [clickedIdx];
          }
        }
      } else {
        // Solo mode
        synth.playSelect();
        setMemoryMoves(prev => prev + 1);
      }
    } else if (currentFlipped.length === 1) {
      const firstIdx = currentFlipped[0];
      if (firstIdx === clickedIdx) return; // Strict guard: never allow card to match itself

      // Second card flipped
      pendingFlippedRef.current = [firstIdx, clickedIdx];
      setMemoryFlipped([firstIdx, clickedIdx]);
      setMemoryBusy(true);
      isClickProcessingRef.current = true;

      if (memoryMode === "twoPlayers" || memoryMode === "vsBot") {
        synth.playSelect();
        setMemoryMoves(prev => prev + 1);

        if (memoryMode === "vsBot") {
          botMemoryRef.current?.recordReveal(memoryCards[clickedIdx], clickedIdx);
          if (activePlayer === 1) {
            lastHumanRevealedRef.current = [firstIdx, clickedIdx];
          }
        }

        // Wait 500ms until both cards have fully completed their flip-open animation
        setTimeout(() => {
          const matchFound = (firstIdx !== clickedIdx) && (memoryCards[firstIdx] === memoryCards[clickedIdx]);

          if (matchFound) {
            const nextConsecutive = consecutiveMatches + 1;
            const isCombo = nextConsecutive >= 2;

            if (isCombo) {
              synth.playCombo(nextConsecutive);
            } else {
              synth.playSuccess();
            }
            const newMatched = Array.from(new Set([...memoryMatched, firstIdx, clickedIdx]));
            setMemoryMatched(newMatched);
            if (activePlayer === 1) {
              setMatchedByP1(prev => Array.from(new Set([...prev, firstIdx, clickedIdx])));
            }
            setMemoryFlipped([]);
            pendingFlippedRef.current = [];
            if (memoryMode === "vsBot") {
              botMemoryRef.current?.forgetPositions([firstIdx, clickedIdx]);
            }

            // Add score to active player
            if (isCombo) {
              triggerComboNotification(nextConsecutive);
            }

            let currentP1Score = p1Score;
            let currentP2Score = p2Score;
            if (activePlayer === 1) {
              currentP1Score = p1Score + 1;
              setP1Score(prev => prev + 1);
            } else {
              currentP2Score = p2Score + 1;
              setP2Score(prev => prev + 1);
            }

            const targetPairsToWin = getTargetPairsToWin(difficulty, memoryCards.length);
            const eitherReachedTarget = memoryMode === "twoPlayers" && (currentP1Score >= targetPairsToWin || currentP2Score >= targetPairsToWin);
            const totalPlayableCards = memoryCards.filter(c => c !== "BLOCKED").length;
            const uniqueMatchedCount = new Set(newMatched.filter(idx => memoryCards[idx] !== "BLOCKED")).size;
            const isCompleted = totalPlayableCards > 0 && uniqueMatchedCount >= totalPlayableCards;

            const shouldEnd = eitherReachedTarget || isCompleted;

            const resolveTurn = () => {
              if (shouldEnd) {
                setMemoryFinished(true);
                adManager.gameplayStop();
                setShowScoreSummary(true);
                setShowVictoryCelebration(false);
                safeLocalStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
              } else {
                // Consecutive successful turns limited to max 3
                if (nextConsecutive >= 3) {
                  setActivePlayer(activePlayer === 1 ? 2 : 1);
                  setConsecutiveMatches(0);
                  setMemoryFlipped([]);
                  pendingFlippedRef.current = [];
                } else {
                  setConsecutiveMatches(nextConsecutive);
                }
              }
              setMemoryBusy(false);
              isClickProcessingRef.current = false;
            };

            if (isCombo) {
              setTimeout(() => {
                resolveTurn();
              }, COMBO_DISPLAY_DURATION);
            } else {
              resolveTurn();
            }
          } else {
            // No match! Play light shake effect on the revealed cards, then flip back face-down
            setMemoryMismatch([firstIdx, clickedIdx]);
            setTimeout(() => {
              setMemoryMismatch([]);
              setMemoryFlipped([]);
              pendingFlippedRef.current = [];
              setActivePlayer(activePlayer === 1 ? 2 : 1);
              setConsecutiveMatches(0);
              setMemoryBusy(false);
              isClickProcessingRef.current = false;
            }, 400);
          }
        }, 500);
      } else {
        // Solo mode
        synth.playSelect();
        setMemoryMoves(prev => prev + 1);

        setTimeout(() => {
          const matchFound = (firstIdx !== clickedIdx) && (memoryCards[firstIdx] === memoryCards[clickedIdx]);

          if (matchFound) {
            // Correct pair! Keep them permanently face-up
            const nextCombo = comboCount + 1;
            setComboCount(nextCombo);
            const isCombo = nextCombo >= 2;
            if (isCombo) {
              synth.playCombo(nextCombo);
            } else {
              synth.playSuccess();
            }
            if (isCombo) {
              triggerComboNotification(nextCombo);
            }

            const newMatched = Array.from(new Set([...memoryMatched, firstIdx, clickedIdx]));
            setMemoryMatched(newMatched);
            setMatchedByP1(prev => Array.from(new Set([...prev, firstIdx, clickedIdx])));
            setMemoryFlipped([]); // Clear current unresolved active flip list
            pendingFlippedRef.current = [];

            handleMemoryMatchReward(newMatched, memoryMoves + 1, isCombo);
            setMemoryBusy(false);
            isClickProcessingRef.current = false;
          } else {
            // No match! Play a light shake effect on the fully revealed face-up cards, then flip face-down
            setComboCount(0);
            setMemoryMismatch([firstIdx, clickedIdx]);

            setTimeout(() => {
              setMemoryMismatch([]);
              setMemoryFlipped([]);
              pendingFlippedRef.current = [];
              setMemoryBusy(false);
              isClickProcessingRef.current = false;
            }, 400);
          }
        }, 500);
      }
    } else {
      // Fallback for unexpected state: reset flipped list to just the newly clicked card
      setMemoryFlipped([clickedIdx]);
      pendingFlippedRef.current = [clickedIdx];
      setMemoryBusy(false);
      isClickProcessingRef.current = false;
    }
  };

  const handleMemoryCardClickRef = useRef(handleMemoryCardClick);
  useEffect(() => {
    handleMemoryCardClickRef.current = handleMemoryCardClick;
  });

  // --- CLASSIC MODE HINT ACTION ---
  const handleOpenHintModal = () => {
    if (memoryMode !== "solo") return;
    if (memoryFinished || memoryCards.length === 0) return;
    synth.playSelect();
    setIsHintModalOpen(true);
  };

  const executeHint = () => {
    if (memoryMode !== "solo") return;
    if (memoryFinished || isPaused || isMobileConfigOpen || memoryCards.length === 0 || memoryBusy) return;
    if (hintsCount <= 0) return;

    // Find all unmatched indices
    const unmatchedIndices: number[] = [];
    for (let i = 0; i < memoryCards.length; i++) {
      if (!memoryMatched.includes(i) && memoryCards[i] !== "BLOCKED") {
        unmatchedIndices.push(i);
      }
    }

    if (unmatchedIndices.length < 2) return;

    // Find a matching pair
    let matchPair: [number, number] | null = null;
    for (let i = 0; i < unmatchedIndices.length; i++) {
      for (let j = i + 1; j < unmatchedIndices.length; j++) {
        const idx1 = unmatchedIndices[i];
        const idx2 = unmatchedIndices[j];
        if (memoryCards[idx1] === memoryCards[idx2]) {
          matchPair = [idx1, idx2];
          break;
        }
      }
      if (matchPair) break;
    }

    if (!matchPair) return;

    // Deduct hint
    updateHintsCount(prev => prev - 1);

    const [idx1, idx2] = matchPair;

    // Automatically reveal matching pair, then complete the match
    setMemoryFlipped([idx1, idx2]);
    setMemoryBusy(true);
    isClickProcessingRef.current = true;

    setTimeout(() => {
      const newMatched = Array.from(new Set([...memoryMatched, idx1, idx2]));
      setMemoryMatched(newMatched);
      setMatchedByP1(prev => Array.from(new Set([...prev, idx1, idx2])));
      setMemoryFlipped([]);
      setMemoryBusy(false);
      isClickProcessingRef.current = false;
      synth.playSuccess();
      handleMemoryMatchReward(newMatched, memoryMoves + 1, false);
    }, 600);
  };

  const shouldSidebarBeDrawer = false;

  const renderMobileLandscapeMenu = () => {
    return (
      <MobileLandscapeMenu
        memoryMode={pendingMemoryMode}
        vsBotTrophies={vsBotTrophies}
        currentScore={currentScore}
        currentHighScore={currentHighScore}
        difficulty={pendingDifficulty}
        t={t}
        synth={synth}
        setIsShopOpen={setIsShopOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        setIsMobileConfigOpen={setIsMobileConfigOpen}
        setIsPaused={setIsPaused}
        getBoardSizeForTrophies={getBoardSizeForTrophies}
        setDifficulty={setPendingDifficulty}
        setMemoryMode={setPendingMemoryMode}
        generateMemoryGame={generateMemoryGame}
        ensureGameGenerated={applyPendingConfigurationAndStartOrResume}
        currentRank={currentRank}
        rankProgressDisplay={rankProgressDisplay}
        rankProgressPercentage={rankProgressPercentage}
        isBoardSizeUnlocked={isBoardSizeUnlocked}
        getRemainingBoardSizeUnlockTimeText={getRemainingBoardSizeUnlockTimeText}
        handleUnlockBoardSize={handleUnlockBoardSize}
        winsP1={winsP1}
        winsP2={winsP2}
        setShowResetConfirm={setShowResetConfirm}
      />
    );
  };




  return (
    <div className={`game-viewport-container relative h-screen max-h-screen overflow-hidden ${currentTheme.viewportBg} text-slate-100 flex items-center justify-center font-sans selection:bg-cyan-900 selection:text-cyan-100 p-0 sm:p-2 md:p-4 z-10 transition-all duration-500 ease-in-out ${isMobilePortrait ? "is-mobile-portrait" : ""} ${isMobileLandscape ? "is-mobile-landscape" : ""} ${isTabletPortrait ? "is-tablet-portrait" : ""} ${isTabletLandscape ? "is-tablet-landscape" : ""}`}>
      
      {/* PROFESSIONAL POKI / CRAZYGAMES GAME LOADING SCREEN OVERLAY */}
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

      {/* BACKGROUND WATERMARK PATTERN - SIT ON THE LOWEST LAYER */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Interactive/Ambient decorative colorful glow blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/12 blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/12 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-[30%] right-[10%] w-[35%] h-[35%] rounded-full bg-pink-500/8 blur-[100px] pointer-events-none z-0" />
        
        <svg width="100%" height="100%" className="w-full h-full opacity-[0.05] grayscale">
          <defs>
            <pattern id="bg-emoji-watermark" width="160" height="160" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
              <text x="20" y="30" fontSize="16" fill="#ffffff">🧠</text>
              <text x="100" y="30" fontSize="16" fill="#ffffff">💡</text>
              <text x="60" y="110" fontSize="16" fill="#ffffff">🎯</text>
              <text x="140" y="110" fontSize="16" fill="#ffffff">⭐</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-emoji-watermark)" />
        </svg>
      </div>
 
       {/* POKI RESPONSIVE ASPECT-RATIO GAME FRAME */}
       <div id="poki-game-frame" key={`${layoutConfig.name}-${isPortrait ? "portrait" : "landscape"}`} className={`poki-game-frame ${layoutConfig.gameFrameClass} ${currentTheme.dialogBg} border-2 ${currentTheme.borderAccent || "border-[#5066c7]/45"} rounded-3xl shadow-[0_24px_60px_rgba(8,12,32,0.45),inset_0_2px_4px_rgba(255,255,255,0.12)] flex flex-col sm:flex-row justify-between overflow-hidden relative transition-all duration-300 ease-in-out ${isShaking ? "animate-screen-shake" : ""} ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>

        {/* TOPBAR / HEADER (Portrait Mode Only - Hidden in 2 Players Mobile Mode to maximize board space) */}
        <div className={`${layoutConfig.showTopBar ? "flex" : "hidden"} flex-shrink-0 ${currentTheme.sidebar} backdrop-blur-md border-b ${currentTheme.borderAccent || "border-[#4d5cb5]/40"} px-3.5 py-2 items-center justify-between landscape:hidden z-40 relative w-full shadow-[0_4px_16px_rgba(10,14,35,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 ${
          isSidebarCollapsed ? "h-0 py-0 border-b-0 overflow-hidden opacity-0 pointer-events-none" : ""
        }`}>
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-lg text-white">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Emoji BrainPop
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="p-1.5 rounded-xl bg-[#303c81]/80 border border-[#546bbf]/45 text-slate-200 hover:text-white transition-all focus:outline-none hover:scale-105 active:scale-95"
              title={soundOn ? t.audioOff : t.audioOn}
            >
              {soundOn ? <Volume2 className="w-3 h-3 text-cyan-400" /> : <VolumeX className="w-3 h-3 text-rose-400" />}
            </button>
            <button
              onClick={() => { synth.playSelect(); setIsShopOpen(true); }}
              className="p-1.5 rounded-xl bg-[#303c81]/80 border border-[#546bbf]/45 text-slate-200 hover:text-white transition-all focus:outline-none hover:scale-105 active:scale-95"
              title={t.shopTitle}
            >
              <Store className="w-3 h-3 text-amber-400 animate-pulse" />
            </button>
            <button
              onClick={() => { synth.playSelect(); setIsSettingsOpen(true); }}
              className="p-1.5 rounded-xl bg-[#303c81]/80 border border-[#546bbf]/45 text-slate-200 hover:text-white transition-all focus:outline-none hover:scale-105 active:scale-95"
              title={t.settingsTitle}
            >
              <Settings className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* SIDEBAR OR TOPBAR (DYNAMIC LAYOUT SWAPPING FOR PC/MOBILE) */}
        <div id="poki-sidebar" className={`${layoutConfig.showSidebar ? "flex" : "hidden"} ${currentTheme.sidebar} backdrop-blur-md flex-shrink-0 z-40 relative flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed
            ? "sm:w-0 sm:border-r-0 sm:overflow-visible"
            : `${layoutConfig.sidebarWidthClass || "sm:w-[190px] md:sm:w-[215px] lg:sm:w-[240px]"} sm:h-full sm:border-r ${currentTheme.borderAccent || "border-slate-700/40"} sm:shadow-[inset_-1px_0_0_rgba(255,255,255,0.08),4px_0_20px_rgba(0,0,0,0.12)]`
        }`}>
          <PanelBackground showTopBar={false} />
          <div className={`flex-col justify-between flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden flex relative z-10 ${
            isSidebarCollapsed 
              ? "w-0 h-0 opacity-0 p-0 pointer-events-none" 
              : "w-full h-full p-3 gap-3 opacity-100"
          }`}>
            
            {/* Logo / Title in Sidebar (Visible in Landscape) */}
            <div className="hidden landscape:flex items-center justify-between pb-2.5 border-b border-slate-800/80 w-full">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl text-white">
                  <Brain className="w-4 h-4" />
                </div>
                <h1 className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Emoji BrainPop
                </h1>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Scores panel (Adapts layout perfectly) */}
              <div className="flex landscape:flex-col portrait:flex-row items-stretch gap-2 bg-[#303c81]/50 backdrop-blur-sm border-2 border-[#546bbf]/40 p-3 rounded-2xl text-xs shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)] w-full">
                {memoryMode === "vsBot" ? (
                  <div className="flex-1 flex flex-col gap-3 w-full animate-fade-in" id="vs-bot-rank-panel">
                    {/* Highly prominent Rank Badge & Title block */}
                    <div id="rank-badge-card" className="flex flex-col items-center gap-2.5 p-3.5 bg-gradient-to-b from-[#1e2552]/80 to-[#121636]/95 border border-[#4d5cb5]/45 rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.12)] text-center relative overflow-hidden group">
                      {/* Decorative glow backgrounds */}
                      <div className="absolute -top-12 -left-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />

                      {/* Large Rank Badge icon */}
                      <div id="rank-badge-icon" className={`p-3.5 rounded-2xl border-2 ${currentRank.bg} ${currentRank.border} ${currentRank.shadow} shadow-lg flex items-center justify-center shrink-0`}>
                        {currentRank.badgeType === "shield" ? (
                          <Shield 
                            className={`w-9 h-9 ${currentRank.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]`} 
                            fill={currentRank.fill} 
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Crown 
                            className={`w-9 h-9 ${currentRank.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]`} 
                            fill={currentRank.fill} 
                            strokeWidth={2.5}
                          />
                        )}
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase mb-1 opacity-80">{t.currentRankLabel ? t.currentRankLabel.toUpperCase() : "CURRENT RANK"}</span>
                        <span className={`font-black text-sm tracking-wide uppercase ${currentRank.color} drop-shadow-sm`}>
                          {t[currentRank.nameKey]}
                        </span>
                      </div>
                    </div>

                    {/* Prominent Points / Trophies badge */}
                    <div id="rank-trophies-card" className="flex items-center justify-between w-full bg-[#1b2149]/90 border border-[#3a488e]/45 rounded-xl p-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
                        <span className="font-extrabold text-slate-200 uppercase tracking-wider text-[10px]">
                          {t.trophiesLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
                          vsBotTrophies > 0 ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" :
                          vsBotTrophies < 0 ? "text-rose-400 bg-rose-500/10 border border-rose-500/20" :
                          "text-slate-300 bg-slate-500/10 border border-slate-500/20"
                        }`}>
                          {vsBotTrophies}
                        </span>
                      </div>
                    </div>

                    {/* Larger Flat 2D Rank Progress Bar */}
                    <div id="rank-progress-card" className="flex flex-col gap-2 w-full bg-[#121636]/65 border border-[#2b356c]/35 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-300 px-0.5">
                        <span>
                          {t.progressLabel}
                        </span>
                        <span className="font-mono text-cyan-400 font-black text-xs sm:text-sm">{rankProgressDisplay}</span>
                      </div>
                      <div className="w-full h-7 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 p-0.5 relative">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${rankProgressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : memoryMode === "twoPlayers" ? (
                  <div className="flex-1 flex flex-col gap-2 w-full">
                    {/* Wins Header / Row */}
                    <div className="flex items-center justify-between w-full portrait:flex-row landscape:flex-col landscape:items-stretch gap-1.5">
                      {/* Player 1 Wins */}
                      <div className="flex-1 flex items-center justify-between gap-1 border-slate-700/20 portrait:pr-2.5 portrait:border-r landscape:border-r-0 landscape:border-b landscape:pb-1.5 landscape:pr-0">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse" />
                          <span className="font-extrabold text-slate-200 uppercase tracking-wider text-[9px] sm:text-[10px]">
                            {t.p1WinsLabel}
                          </span>
                        </div>
                        <span className="text-blue-300 font-black text-xs sm:text-sm font-mono bg-[#1e2552]/60 px-2 py-0.5 rounded-lg border border-[#3f509d]/40">{winsP1}</span>
                      </div>

                      {/* Player 2 Wins */}
                      <div className="flex-1 flex items-center justify-between gap-1 pl-1.5 portrait:pl-2.5 landscape:pl-0 landscape:pt-0.5">
                        <div className="flex items-center gap-1.5 text-slate-350">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)] animate-pulse" />
                          <span className="font-extrabold text-slate-200 uppercase tracking-wider text-[9px] sm:text-[10px]">
                            {t.p2WinsLabel}
                          </span>
                        </div>
                        <span className="text-rose-300 font-black text-xs sm:text-sm font-mono bg-[#1e2552]/60 px-2 py-0.5 rounded-lg border border-[#3f509d]/40">{winsP2}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-slate-800/30 w-full" />

                    {/* Reset Button */}
                    <button
                      id="btn-reset-match-record"
                      onClick={() => {
                        synth.playSelect();
                        setShowResetConfirm(true);
                      }}
                      className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#2c377a] to-[#394998] hover:from-[#34428f] hover:to-[#4357b1] border border-[#546bbf]/40 hover:border-rose-700/50 text-slate-200 hover:text-rose-300 text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      {t.resetWinsBtn}
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-2.5 w-full animate-fade-in">
                    {/* Prominent Current Score Badge */}
                    <div className="flex items-center justify-between w-full bg-gradient-to-r from-[#10b981]/15 to-emerald-500/5 border border-emerald-500/35 rounded-xl p-3 shadow-md">
                      <div className="flex items-center gap-2 text-slate-200">
                        <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30">
                          <Award className="w-4 h-4 animate-pulse" />
                        </div>
                        <span className="font-black text-xs uppercase tracking-wider">{t.totalScore}</span>
                      </div>
                      <span className="text-emerald-300 font-black text-xs sm:text-sm font-mono bg-[#1e2552]/80 px-2.5 py-0.5 rounded-lg border border-[#3f509d]/40 shadow-inner">
                        {currentScore}
                      </span>
                    </div>

                    {/* Prominent High Score Badge */}
                    <div className="flex items-center justify-between w-full bg-gradient-to-r from-[#f59e0b]/15 to-amber-500/5 border border-amber-500/35 rounded-xl p-3 shadow-md">
                      <div className="flex items-center gap-2 text-slate-200">
                        <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-400 border border-amber-500/30">
                          <Trophy className="w-4 h-4 animate-bounce" />
                        </div>
                        <span className="font-black text-xs uppercase tracking-wider">{t.highScore}</span>
                      </div>
                      <span className="text-amber-300 font-black text-xs sm:text-sm font-mono bg-[#1e2552]/80 px-2.5 py-0.5 rounded-lg border border-[#3f509d]/40 shadow-inner">
                        {currentHighScore}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Active Mode Stats for Memory Game in Landscape Sidebar */}
            {activeTab === "memory" && (
              <div className="hidden landscape:flex flex-col gap-3 bg-[#303c81]/50 backdrop-blur-sm border-2 border-[#546bbf]/40 p-3 rounded-2xl text-xs w-full shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)]">
                
                {/* PLAY MODE PANEL */}
                <div className="flex flex-col gap-1.5 relative w-full">
                  <span className="text-slate-350 font-bold tracking-wider uppercase text-[9px]">
                    {t.playModeLabel}
                  </span>
                  
                  <div className="relative w-full">
                    {/* Trigger Button */}
                    <button
                      id="btn-play-mode-trigger"
                      onClick={() => {
                        synth.playSelect();
                        setIsPlayModeDropdownOpen(!isPlayModeDropdownOpen);
                        setIsGameTypeDropdownOpen(false);
                        setIsBoardSizeDropdownOpen(false);
                      }}
                      className="w-full py-2 px-4 rounded-2xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/85 shadow-sm lg:shadow-[0_6px_16px_rgba(234,179,8,0.3),inset_0_1.5px_1px_rgba(255,255,255,0.4)] hover:from-[#ffe066] hover:to-[#fcae00] lg:hover:shadow-[0_10px_22px_rgba(234,179,8,0.4)] text-xs font-black flex items-center justify-between transition-colors duration-150 focus:outline-none cursor-pointer lg:-translate-y-[2px] lg:hover:-translate-y-1"
                    >
                      <span className="text-xs font-black tracking-wide">
                        {memoryMode === "solo" ? "Classic" : memoryMode === "twoPlayers" ? "2 Players" : "Challenge"}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-950 transition-transform duration-300 ${isPlayModeDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Options Dropdown Menu */}
                    <div
                      className={`absolute left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-1 bg-[#252f67]/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_32px_rgba(10,14,35,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] ${
                        isPlayModeDropdownOpen
                          ? "max-h-[220px] opacity-100 scale-100 pointer-events-auto border-2 border-[#4c5fbd]/60 p-1.5 mt-1.5"
                          : "max-h-0 opacity-0 scale-95 pointer-events-none border-0 p-0 mt-0"
                      }`}
                    >
                      {/* Option 1: Classic */}
                      <button
                        id="opt-play-mode-solo"
                        onClick={() => {
                          synth.playSelect();
                          setIsPlayModeDropdownOpen(false);
                          if (memoryMode !== "solo") {
                            setPendingMemoryMode("solo");
                            setPendingDifficulty("3x4");
                            setShowMemoryConfirm(true);
                          }
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          memoryMode === "solo"
                            ? "bg-gradient-to-r from-amber-500/25 to-amber-600/15 border-2 border-amber-400/50 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                            : "bg-transparent text-slate-350 hover:text-slate-100 hover:bg-[#34448e]/60 border border-transparent"
                        }`}
                      >
                        <span>{t.modeClassic}</span>
                        {memoryMode === "solo" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>

                      {/* Option 2: 2 Players */}
                      <button
                        id="opt-play-mode-2p"
                        onClick={() => {
                          synth.playSelect();
                          setIsPlayModeDropdownOpen(false);
                          if (memoryMode !== "twoPlayers") {
                            const valid2pDiff = (difficulty === "5x5" || difficulty === "6x6" || difficulty === "6x8" || difficulty === "7x8") ? difficulty : "5x5";
                            setPendingMemoryMode("twoPlayers");
                            setPendingDifficulty(valid2pDiff);
                            setShowMemoryConfirm(true);
                          }
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          memoryMode === "twoPlayers"
                            ? "bg-gradient-to-r from-amber-500/25 to-amber-600/15 border-2 border-amber-400/50 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                            : "bg-transparent text-slate-350 hover:text-slate-100 hover:bg-[#34448e]/60 border border-transparent"
                        }`}
                      >
                        <span>{t.modeTwoPlayers}</span>
                        {memoryMode === "twoPlayers" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>

                      {/* Option 3: Challenge Mode */}
                      <button
                        id="opt-play-mode-vs-bot"
                        onClick={() => {
                          synth.playSelect();
                          setIsPlayModeDropdownOpen(false);
                          if (memoryMode !== "vsBot") {
                            setPendingMemoryMode("vsBot");
                            setPendingDifficulty(getBoardSizeForTrophies(vsBotTrophies));
                            setShowMemoryConfirm(true);
                          }
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          memoryMode === "vsBot"
                            ? "bg-gradient-to-r from-amber-500/25 to-amber-600/15 border-2 border-amber-400/50 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                            : "bg-transparent text-slate-350 hover:text-slate-100 hover:bg-[#34448e]/60 border border-transparent"
                        }`}
                      >
                        <span>{t.modeBattle}</span>
                        {memoryMode === "vsBot" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* BOARD SIZE PANEL (Classic & 2 Players Modes) */}
                <div className={`transition-all duration-300 ease-in-out ${
                  memoryMode === "solo" || memoryMode === "twoPlayers" ? "opacity-100 overflow-visible" : "max-h-0 opacity-0 pointer-events-none h-0 overflow-hidden"
                }`}>
                  <div className="flex flex-col gap-1.5 relative w-full">
                    <span className="text-slate-355 font-bold tracking-wider uppercase text-[9px]">
                      {t.challengeLevel}
                    </span>
                    
                    {/* Compact Dropdown Selector */}
                    <div className="relative w-full">
                      {/* Trigger Button */}
                      <button
                        id="btn-board-size-trigger"
                        onClick={() => {
                          synth.playSelect();
                          setIsBoardSizeDropdownOpen(!isBoardSizeDropdownOpen);
                        }}
                        className="w-full py-2 px-4 rounded-2xl bg-gradient-to-b from-[#34448e] to-[#25326d] hover:from-[#3f52aa] hover:to-[#2e3e86] border-2 border-[#546bbf]/50 text-slate-100 text-xs font-black flex items-center justify-between transition-colors duration-150 focus:outline-none cursor-pointer lg:-translate-y-[2px] lg:hover:-translate-y-1 shadow-sm lg:shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
                      >
                        <span className="text-xs font-black tracking-wide">
                          {t.boardSizeLabels[difficulty as keyof typeof t.boardSizeLabels] || t.boardSizeLabels["3x4"]}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isBoardSizeDropdownOpen ? "rotate-180 text-cyan-400" : ""}`} />
                      </button>

                      {/* Options Dropdown Menu */}
                      <div
                        id="board-size-dropdown-menu"
                        className={`absolute left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-1 bg-[#252f67]/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_32px_rgba(10,14,35,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] ${
                          isBoardSizeDropdownOpen
                            ? "max-h-[250px] opacity-100 scale-100 pointer-events-auto border-2 border-[#4c5fbd]/60 p-1.5 mt-1.5"
                            : "max-h-0 opacity-0 scale-95 pointer-events-none border-0 p-0 mt-0"
                        }`}
                      >
                        {(memoryMode === "twoPlayers"
                          ? [
                              { key: "5x5", label: t.boardSizeLabels["5x5"] },
                              { key: "6x6", label: t.boardSizeLabels["6x6"] },
                              { key: "6x8", label: t.boardSizeLabels["6x8"] },
                              { key: "7x8", label: t.boardSizeLabels["7x8"] }
                            ]
                          : [
                              { key: "3x4", label: t.boardSizeLabels["3x4"] },
                              { key: "4x5", label: t.boardSizeLabels["4x5"] },
                              { key: "5x5", label: t.boardSizeLabels["5x5"] },
                              { key: "6x6", label: t.boardSizeLabels["6x6"] },
                              { key: "6x8", label: t.boardSizeLabels["6x8"] },
                              { key: "7x8", label: t.boardSizeLabels["7x8"] }
                            ]
                        ).map((opt) => {
                          const isSelected = difficulty === opt.key;
                          const isLocked = !isBoardSizeUnlocked(opt.key, memoryMode);
                          const remainingTime = getRemainingBoardSizeUnlockTimeText(opt.key);
                          return (
                            <button
                              key={opt.key}
                              id={`btn-board-size-opt-${opt.key}`}
                              onClick={() => {
                                setIsBoardSizeDropdownOpen(false);
                                if (isLocked) {
                                  handleUnlockBoardSize(opt.key, () => {
                                    setPendingMemoryMode(memoryMode);
                                    setPendingDifficulty(opt.key);
                                    setShowMemoryConfirm(true);
                                  });
                                } else {
                                  synth.playSelect();
                                  if (difficulty !== opt.key) {
                                    setPendingMemoryMode(memoryMode);
                                    setPendingDifficulty(opt.key);
                                    setShowMemoryConfirm(true);
                                  }
                                }
                              }}
                              className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-amber-400 text-slate-950 border-2 border-amber-300 font-black shadow-sm"
                                  : isLocked
                                  ? "bg-slate-950/80 text-amber-300 border border-amber-500/40 hover:bg-amber-950/50"
                                  : "bg-transparent text-slate-300 hover:text-slate-100 hover:bg-[#34448e]/60 border border-transparent font-bold"
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                {isLocked ? (
                                  <Video className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                                ) : isSelected ? (
                                  <div className="w-2 h-2 rounded-full bg-slate-950 shadow-sm shrink-0" />
                                ) : null}
                                <span>{opt.label}</span>
                              </div>
                              {isLocked ? (
                                <div className="flex items-center gap-1 bg-amber-400/15 px-2 py-0.5 rounded border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                                  <span>Watch Ad</span>
                                  <span className="text-[8px] opacity-75">(48h)</span>
                                </div>
                              ) : remainingTime ? (
                                <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                                  {remainingTime} left
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reshuffle button */}
                {memoryMode !== "vsBot" && (
                  <button
                    onClick={() => { synth.playSelect(); generateMemoryGame(difficulty); }}
                    className="w-full mt-1.5 py-2.5 rounded-2xl border-2 border-[#546bbf]/40 bg-gradient-to-r from-[#2c377a] to-[#394998] hover:from-[#34428f] hover:to-[#4357b1] text-slate-100 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer shadow-sm lg:shadow-[0_6px_16px_rgba(0,0,0,0.2)] lg:-translate-y-[2px] lg:hover:-translate-y-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t.reshuffle}
                  </button>
                )}
              </div>
            )}

            {/* Landscape Sidebar Footer (Shop & Settings triggers) */}
            {(isDesktop || isTabletLandscape) && (
              <div className="flex flex-col gap-2 w-full mt-auto">
                {/* ⭐ Shop trigger */}
                <button
                  id="btn-sidebar-shop"
                  onClick={() => { synth.playSelect(); setIsShopOpen(true); }}
                  className="flex px-4 py-2.5 rounded-2xl border-2 bg-gradient-to-b from-[#34448e]/60 to-[#25326d]/60 hover:from-[#3a4ba1]/70 hover:to-[#2b3a7a]/70 border-[#546bbf]/30 text-slate-100 text-xs font-black items-center gap-1.5 transition-colors duration-150 focus:outline-none cursor-pointer w-full lg:-translate-y-[2px] lg:hover:-translate-y-1 shadow-sm lg:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                >
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {t.shopTitle}
                  </span>
                </button>

                {/* Compact settings in Landscape footer */}
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <button
                    onClick={() => { synth.playSelect(); setIsSettingsOpen(true); }}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-b from-[#34448e] to-[#25326d] border border-[#546bbf]/40 hover:from-[#3e51aa] hover:to-[#2e3e86] text-slate-100 flex items-center justify-center gap-1.5 text-xs font-extrabold focus:outline-none cursor-pointer lg:-translate-y-[2px] lg:hover:-translate-y-1 transition-colors duration-150 shadow-sm lg:shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                  >
                    <Settings className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.settingsTitleShort}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* SIDEBAR TOGGLE BUTTON (Capsule Handle attached to the right edge of the sidebar) */}
          {layoutConfig.showSidebarToggle && (
            <button
              id="btn-sidebar-toggle"
              onClick={() => {
                synth.playSelect();
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }}
              className={`group hidden landscape:flex absolute top-1/2 -translate-y-1/2 z-50 items-center justify-center w-5.5 h-16 rounded-full bg-sky-500/90 border border-sky-600/40 hover:bg-sky-400 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer shadow-[2px_0_12px_rgba(14,165,233,0.35)] hover:shadow-[4px_0_18px_rgba(14,165,233,0.55)] ${
                isSidebarCollapsed ? "left-2" : "right-0 translate-x-1/2"
              }`}
              title={isSidebarCollapsed ? "Expand Menu" : "Collapse Menu"}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                {/* Expanded State (❮❮) */}
                <div className={`absolute flex -space-x-1 items-center justify-center transition-all duration-300 ease-in-out ${
                  isSidebarCollapsed ? "opacity-0 scale-50 rotate-90 pointer-events-none" : "opacity-100 scale-100 rotate-0"
                }`}>
                  <ChevronLeft className="w-3.5 h-3.5 text-white transition-colors duration-300" />
                  <ChevronLeft className="w-3.5 h-3.5 text-white transition-colors duration-300" />
                </div>

                {/* Collapsed State (❯❯) */}
                <div className={`absolute flex -space-x-1 items-center justify-center transition-all duration-300 ease-in-out ${
                  isSidebarCollapsed ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90 pointer-events-none"
                }`}>
                  <ChevronRight className="w-3.5 h-3.5 text-white transition-colors duration-300" />
                  <ChevronRight className="w-3.5 h-3.5 text-white transition-colors duration-300" />
                </div>
              </div>
            </button>
          )}
        </div>

        {/* GAME WORKSPACE INTERFACE */}
        <main className="flex-1 min-h-0 w-full p-0 sm:p-4 max-sm:p-0 max-sm:pt-0 flex flex-col justify-center relative bg-slate-950/15 overflow-hidden transition-all duration-300 ease-in-out">
          
          {/* Universal fixed Menu Button and Pause Button for Mobile & Tablet */}
          {layoutConfig.showTabletMenuToggle && (
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-50 flex flex-col gap-2 items-start pointer-events-auto">
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => {
                  synth.playSelect();
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 border border-amber-300 transition-colors flex items-center justify-center cursor-pointer"
                title={isSidebarCollapsed ? "Show Menu" : "Hide Menu"}
              >
                <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-950 stroke-[2.5]" />
              </button>

              {/* Compact Pause & Hint Buttons for Mobile Solo Mode */}
              {memoryMode === "solo" && !memoryFinished && memoryCards.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-memory-pause-toggle-mobile"
                    onClick={() => {
                      if (isPaused) {
                        synth.playResume();
                      } else {
                        synth.playPause();
                      }
                      setIsPaused(prev => !prev);
                    }}
                    className="p-2 rounded-xl bg-[#222a4f]/95 border border-slate-600/30 hover:bg-[#2c3664]/90 text-slate-200 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
                    title={isPaused ? t.resumeBtn : t.pauseBtn}
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4 fill-slate-200" />
                    ) : (
                      <Pause className="w-4 h-4 fill-slate-200" />
                    )}
                  </button>

                  <button
                    id="btn-memory-hint-mobile"
                    onClick={handleOpenHintModal}
                    disabled={memoryBusy}
                    className={`p-2 rounded-2xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] hover:from-[#ffe066] hover:to-[#fcae00] text-[#132257] border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.45)] hover:shadow-[0_8px_18px_rgba(234,179,8,0.45)] -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 relative ${
                      hintsCount > 0 ? "animate-pulse" : "opacity-90"
                    }`}
                    title={t.hintLabel}
                  >
                    <Lightbulb className="w-4 h-4 fill-[#132257] text-[#132257] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none bg-[#132257] text-amber-300 shadow-sm">
                      {hintsCount > 0 ? hintsCount : "+"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* --- MOBILE CONFIG MENU OVERLAY (FLOATING SCI-FI TECH PANEL LAYERED OVER GAME BOARD) --- */}
          {layoutConfig.allowMobileConfigMenu && (
            <div 
              id="mobile-menu-container" 
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  synth.playSelect();
                  applyPendingConfigurationAndStartOrResume();
                }
              }}
              className={`fixed inset-0 z-[100] flex items-center justify-center ${!isPortrait ? "p-1.5 sm:p-3 md:p-6" : "p-2.5 sm:p-4 md:p-6"} text-slate-100 transition-[opacity,visibility] duration-200 overflow-hidden select-none bg-slate-200/45 backdrop-blur-sm ${
                isMobileConfigOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
              }`}
              style={{
                willChange: 'opacity, visibility',
                paddingTop: `calc(env(safe-area-inset-top, 0px) + ${!isPortrait ? '4px' : '8px'})`,
                paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + ${!isPortrait ? '4px' : '8px'})`,
                paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 8px)',
                paddingRight: 'calc(env(safe-area-inset-right, 0px) + 8px)',
              }}
            >
              {/* Floating Menu Content Framed with Royal Panel Frame Style */}
              <div 
                id="mobile-menu-content"
                className={`relative z-10 w-full ${!isPortrait ? "max-w-4xl max-h-[min(97dvh,600px)]" : "max-w-lg max-h-[min(82dvh,620px)]"} h-full flex flex-col items-center justify-center animate-scale-up`}
                onClick={(e) => e.stopPropagation()}
              >
                <RoyalPanelFrame
                  title="MAIN MENU"
                  ribbonColor="gold"
                  showCrown={false}
                  className="w-full h-full max-h-full"
                >
                  <div className={`w-full h-full flex flex-col min-h-0 ${!isPortrait ? "overflow-hidden p-2 sm:p-3 pt-1 sm:pt-2" : "overflow-y-auto p-2 sm:p-3 custom-scrollbar"}`}>
                    {!isPortrait ? (
                      renderMobileLandscapeMenu()
                    ) : (
                      /* SINGLE UNIFIED RESPONSIVE COMPACT LAYOUT FOR PORTRAIT */
                      <div className="flex-1 flex flex-col gap-2 sm:gap-2.5 max-w-lg mx-auto w-full pt-1">
                        {/* 1. PLAY MODE SELECTOR */}
                        <div className="flex flex-col gap-1 shrink-0">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                            {t.playModeLabel}
                          </span>
                          <div className="bg-[#182352]/70 border border-[#485da6]/30 p-1.5 sm:p-2 rounded-2xl shadow-none grid grid-cols-3 gap-1.5 sm:gap-2">
                            {/* Classic */}
                            <button
                              onClick={() => {
                                synth.playSelect();
                                if (pendingMemoryMode !== "solo") {
                                  setPendingDifficulty("3x4");
                                  setPendingMemoryMode("solo");
                                }
                              }}
                              className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-colors duration-150 border flex flex-col items-center gap-0.5 cursor-pointer ${
                                pendingMemoryMode === "solo"
                                  ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                                  : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
                              }`}
                            >
                              <Zap className={`w-4 h-4 ${pendingMemoryMode === "solo" ? "text-slate-950" : "text-amber-400"}`} />
                              <span>Classic</span>
                            </button>

                            {/* 2 Players */}
                            <button
                              onClick={() => {
                                synth.playSelect();
                                if (pendingMemoryMode !== "twoPlayers") {
                                  const finalDiff = (pendingDifficulty === "5x5" || pendingDifficulty === "5x6" || pendingDifficulty === "6x6" || pendingDifficulty === "6x8") ? pendingDifficulty : "5x5";
                                  setPendingDifficulty(finalDiff);
                                  setPendingMemoryMode("twoPlayers");
                                }
                              }}
                              className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-colors duration-150 border flex flex-col items-center gap-0.5 cursor-pointer ${
                                pendingMemoryMode === "twoPlayers"
                                  ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                                  : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
                              }`}
                            >
                              <Users className={`w-4 h-4 ${pendingMemoryMode === "twoPlayers" ? "text-slate-950" : "text-rose-400"}`} />
                              <span>2 Players</span>
                            </button>

                            {/* Challenge Mode */}
                            <button
                              onClick={() => {
                                synth.playSelect();
                                if (pendingMemoryMode !== "vsBot") {
                                  const finalDiff = getBoardSizeForTrophies(vsBotTrophies);
                                  setPendingDifficulty(finalDiff);
                                  setPendingMemoryMode("vsBot");
                                }
                              }}
                              className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-colors duration-150 border flex flex-col items-center gap-0.5 cursor-pointer ${
                                pendingMemoryMode === "vsBot"
                                  ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                                  : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
                              }`}
                            >
                              <Bot className={`w-4 h-4 ${pendingMemoryMode === "vsBot" ? "text-slate-950" : "text-cyan-400"}`} />
                              <span>{t.modeBattle}</span>
                            </button>
                          </div>
                        </div>

                        {/* 2. DYNAMIC INFORMATION SECTION */}
                        <div className="shrink-0 flex flex-col gap-1.5">
                          {pendingMemoryMode === "solo" && (
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                                {t.modeClassic}
                              </span>
                              <div className="bg-[#1f2856] md:bg-[#303c81]/30 backdrop-blur-none border border-[#546bbf]/20 p-2.5 sm:p-3 rounded-2xl flex flex-col gap-2 shadow-inner">
                                {/* Score & High Score Row */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex items-center justify-between p-1.5 sm:p-2 rounded-xl bg-slate-950/40 border border-white/5">
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                      <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                                      <span className="font-extrabold text-[10px] uppercase tracking-wider">{t.totalScore.replace(":", "")}</span>
                                    </div>
                                    <span className="text-emerald-300 font-black text-xs font-mono bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                                      {currentScore}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between p-1.5 sm:p-2 rounded-xl bg-slate-950/40 border border-white/5">
                                    <div className="flex items-center gap-1.5 text-slate-300">
                                      <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                      <span className="font-extrabold text-[10px] uppercase tracking-wider">{t.highScore.replace(":", "")}</span>
                                    </div>
                                    <span className="text-amber-300 font-black text-xs font-mono bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-500/30">
                                      {currentHighScore}
                                    </span>
                                  </div>
                                </div>

                                {/* Board Size Selection for Classic */}
                                <div className="flex flex-col gap-1 border-t border-white/5 pt-1.5">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {t.challengeLevel}
                                  </span>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {([
                                      { key: "3x4", label: t.boardSizeLabels["3x4"] },
                                      { key: "4x5", label: t.boardSizeLabels["4x5"] },
                                      { key: "5x5", label: t.boardSizeLabels["5x5"] },
                                      { key: "6x6", label: t.boardSizeLabels["6x6"] },
                                      { key: "6x8", label: t.boardSizeLabels["6x8"] },
                                      { key: "7x8", label: t.boardSizeLabels["7x8"] }
                                    ] as const).map((opt) => {
                                      const isSelected = pendingDifficulty === opt.key;
                                      const isLocked = !isBoardSizeUnlocked(opt.key, "solo");
                                      const remainingTime = getRemainingBoardSizeUnlockTimeText(opt.key);
                                      return (
                                        <button
                                          key={opt.key}
                                          onClick={() => {
                                            if (isLocked) {
                                              handleUnlockBoardSize(opt.key, () => {
                                                setPendingDifficulty(opt.key);
                                                setPendingMemoryMode("solo");
                                              });
                                            } else {
                                              synth.playSelect();
                                              if (pendingDifficulty !== opt.key) {
                                                setPendingDifficulty(opt.key);
                                                setPendingMemoryMode("solo");
                                              }
                                            }
                                          }}
                                          className={`py-1.5 px-1 rounded-xl text-[10.5px] font-extrabold transition-colors duration-150 border flex items-center justify-center gap-1 cursor-pointer ${
                                            isSelected
                                              ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                                              : isLocked
                                              ? "bg-slate-900 text-amber-300 border border-amber-500/40 shadow-none"
                                              : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
                                          }`}
                                        >
                                          {isLocked ? (
                                            <div className="flex items-center gap-1">
                                              <Video className="w-3 h-3 text-amber-400 fill-amber-400/20 shrink-0" />
                                              <span>{opt.label}</span>
                                              <span className="text-[7.5px] font-black uppercase text-amber-300 bg-amber-400/20 px-0.5 rounded border border-amber-400/40">AD</span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-1">
                                              <span>{opt.label}</span>
                                              {remainingTime && (
                                                <span className="text-[7.5px] font-black text-amber-400 bg-amber-400/10 px-0.5 rounded">{remainingTime}</span>
                                              )}
                                            </div>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {pendingMemoryMode === "vsBot" && (
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                                {t.battleInfoTitle}
                              </span>
                              <div className="bg-[#1f2856] md:bg-[#303c81]/30 md:backdrop-blur-sm backdrop-blur-none border border-[#546bbf]/20 p-2.5 sm:p-3 rounded-2xl flex flex-col gap-2.5 shadow-inner">
                                {/* Rank & Rating Row */}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-xl border ${currentRank.bg} ${currentRank.border} ${currentRank.shadow} shadow-md shrink-0`}>
                                      {currentRank.badgeType === "shield" ? (
                                        <Shield className={`w-4.5 h-4.5 ${currentRank.color}`} fill={currentRank.fill} />
                                      ) : (
                                        <Crown className={`w-4.5 h-4.5 ${currentRank.color}`} fill={currentRank.fill} />
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">Rank</span>
                                      <span className={`font-black text-xs sm:text-sm uppercase ${currentRank.color}`}>
                                        {t[currentRank.nameKey]}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col items-end shrink-0">
                                    <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">
                                      {t.ratingLabel}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                      <span className="text-amber-300 font-mono font-black text-xs sm:text-sm">
                                        {vsBotTrophies}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Progress bar */}
                                <div className="flex flex-col gap-1.5 w-full border-t border-slate-800/40 pt-2">
                                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-300">
                                    <span>
                                      {t.progressLabel}
                                    </span>
                                    <span className="font-mono text-cyan-400 font-black text-xs">
                                      {rankProgressDisplay}
                                    </span>
                                  </div>
                                  <div className="w-full h-5 sm:h-6 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 p-0.5 relative">
                                    <div 
                                      className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
                                      style={{ width: `${rankProgressPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {pendingMemoryMode === "twoPlayers" && (
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                                {t.twoPlayersMatch}
                              </span>
                              <div className="bg-[#1f2856] md:bg-[#303c81]/30 md:backdrop-blur-sm backdrop-blur-none border border-[#546bbf]/20 p-2.5 sm:p-3 rounded-2xl flex flex-col gap-2 shadow-inner">
                                <div className="grid grid-cols-2 gap-2">
                                  {/* Player 1 */}
                                  <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-950/40 border border-white/5">
                                    <div className="flex items-center gap-1.5 text-slate-350">
                                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)] animate-pulse" />
                                      <span className="font-extrabold text-[10px] uppercase tracking-wider">P1</span>
                                    </div>
                                    <span className="text-blue-300 font-black text-xs font-mono bg-blue-950/40 px-2 py-0.5 rounded-lg border border-blue-900/30">
                                      {winsP1}
                                    </span>
                                  </div>

                                  {/* Player 2 */}
                                  <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-950/40 border border-white/5">
                                    <div className="flex items-center gap-1.5 text-slate-350">
                                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)] animate-pulse" />
                                      <span className="font-extrabold text-[10px] uppercase tracking-wider">P2</span>
                                    </div>
                                    <span className="text-rose-300 font-black text-xs font-mono bg-rose-950/40 px-2 py-0.5 rounded-lg border border-rose-900/30">
                                      {winsP2}
                                    </span>
                                  </div>
                                </div>

                                {/* Board Size Selection for 2 Players */}
                                <div className="flex flex-col gap-1 mt-0.5 border-t border-white/5 pt-1.5">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {t.challengeLevel}
                                  </span>
                                  <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-1.5">
                                    {([
                                      { key: "5x5", label: t.boardSizeLabels["5x5"] },
                                      { key: "6x6", label: t.boardSizeLabels["6x6"] },
                                      { key: "6x8", label: t.boardSizeLabels["6x8"] },
                                      { key: "7x8", label: t.boardSizeLabels["7x8"] }
                                    ] as const).map((opt) => {
                                      const isSelected = pendingDifficulty === opt.key;
                                      const isLocked = !isBoardSizeUnlocked(opt.key, "twoPlayers");
                                      const remainingTime = getRemainingBoardSizeUnlockTimeText(opt.key);
                                      return (
                                        <button
                                          key={opt.key}
                                          onClick={() => {
                                            if (isLocked) {
                                              handleUnlockBoardSize(opt.key, () => {
                                                setPendingDifficulty(opt.key);
                                                setPendingMemoryMode("twoPlayers");
                                              });
                                            } else {
                                              synth.playSelect();
                                              if (pendingDifficulty !== opt.key) {
                                                setPendingDifficulty(opt.key);
                                                setPendingMemoryMode("twoPlayers");
                                              }
                                            }
                                          }}
                                          className={`py-1 rounded-lg text-[10px] font-black transition-colors duration-150 border flex items-center justify-center gap-1 cursor-pointer ${
                                            isSelected
                                              ? "bg-amber-400 text-slate-950 border-transparent font-black shadow-none"
                                              : isLocked
                                              ? "bg-slate-900 text-amber-300 border border-amber-500/40 shadow-none"
                                              : "bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white font-bold"
                                          }`}
                                        >
                                          {isLocked ? (
                                            <div className="flex items-center gap-1">
                                              <Video className="w-2.5 h-2.5 text-amber-400 fill-amber-400/20 shrink-0" />
                                              <span>{opt.label}</span>
                                              <span className="text-[7.5px] font-black uppercase text-amber-300 bg-amber-400/20 px-0.5 rounded border border-amber-400/40">AD</span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-1">
                                              <span>{opt.label}</span>
                                              {remainingTime && (
                                                <span className="text-[7.5px] font-black text-amber-400 bg-amber-400/10 px-0.5 rounded">{remainingTime}</span>
                                              )}
                                            </div>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* Reset Wins & Info */}
                              <div className="flex items-center justify-between px-1 mt-0.5">
                                <span className="text-[9.5px] font-semibold text-slate-400">
                                  {t.localPassAndPlay}
                                </span>
                                <button
                                  onClick={() => {
                                    synth.playSelect();
                                    setShowResetConfirm(true);
                                  }}
                                  className="py-0.5 px-2.5 rounded bg-rose-950/60 border border-rose-900/30 text-rose-300 text-[8.5px] font-black uppercase tracking-wider cursor-pointer hover:bg-rose-900/60 active:scale-95 transition-all"
                                >
                                  {t.resetWinsText}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* System quick settings inside clean frame */}
                        <div className="bg-[#182352]/70 border border-[#485da6]/30 p-1.5 rounded-2xl shadow-none grid grid-cols-3 gap-1.5 sm:gap-2 shrink-0">
                          {/* Sound Toggle */}
                          <button
                            onClick={() => { synth.playSelect(); setSoundOn(!soundOn); }}
                            className="py-1.5 px-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 text-slate-200 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors duration-150"
                            title="Toggle Sound"
                          >
                            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
                            <span>{soundOn ? "Mute" : "Unmute"}</span>
                          </button>

                          {/* Shop Button */}
                          <button
                            onClick={() => { synth.playSelect(); setIsShopOpen(true); }}
                            className="py-1.5 px-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 text-slate-200 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors duration-150"
                          >
                            <Store className="w-3.5 h-3.5 text-amber-400" />
                            <span>Shop</span>
                          </button>

                          {/* Settings Button */}
                          <button
                            onClick={() => { synth.playSelect(); setIsSettingsOpen(true); }}
                            className="py-1.5 px-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 text-slate-200 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-colors duration-150"
                          >
                            <Settings className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{t.settingsTitleShort}</span>
                          </button>
                        </div>

                        {/* 4. RESUME / START PLAYING BUTTON */}
                        <button
                          onClick={() => {
                            synth.playSelect();
                            applyPendingConfigurationAndStartOrResume();
                          }}
                          className="w-full py-2 rounded-2xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white border-transparent shadow-none cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 mt-auto shrink-0 transition-colors duration-150"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{t.startOrResume}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </RoyalPanelFrame>
              </div>
            </div>
          )}

          {activeTab === "match" ? (
              
              // ==============================
              // CONNECTING MATCH CARDS COMPONENT
              // ==============================
              <div id="match-container-wrapper" className="flex-1 min-h-0 flex flex-col justify-between text-slate-100 gap-2">
                {/* WORKSPACE BOARD CARD */}
                <div 
                  id="match-board-card"
                  className={`${layoutConfig.matchBoardCardClass} ${currentTheme.boardBorder || ''} transition-all duration-500 ease-in-out`}
                  style={{
                    background: currentTheme.boardBg || getBoardBackgroundStyle(equippedThemeId),
                  }}
                >
                  <EnvironmentalEffects effectType={equippedEffect} />

                  {/* Soft Grid Texture (Notebook style) */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.08] z-0 transition-all duration-500"
                    style={{
                      backgroundImage: `linear-gradient(${currentTheme.boardGridColor || '#0ea5e9'} 1px, transparent 1px), linear-gradient(90deg, ${currentTheme.boardGridColor || '#0ea5e9'} 1px, transparent 1px)`,
                      backgroundSize: "24px 24px"
                    }}
                  />

                  {/* Decorative radial premium background overlay */}
                  <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${currentTheme.boardRadialOverlay || 'from-sky-400/20 to-transparent'} pointer-events-none z-0 transition-all duration-500`}></div>

                  {/* Emoji Watermark Background Layer */}
                  {watermarkBg && (
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0"
                      style={{
                        backgroundImage: `url(${watermarkBg})`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "240px 240px"
                      }}
                    />
                  )}

                  {/* Header info */}
                  {layoutConfig.showHUD ? (
                    <GameHUD
                      layoutConfig={layoutConfig}
                      synth={synth}
                      setIsMobileConfigOpen={setIsMobileConfigOpen}
                      setIsPaused={setIsPaused}
                      isPaused={isPaused}
                      activeTab={activeTab}
                      memoryMode={memoryMode}
                      vsBotTrophies={vsBotTrophies}
                      winsP1={winsP1}
                      winsP2={winsP2}
                      currentScore={currentScore}
                      level={level}
                      t={t}
                      connectionsCount={connections.length}
                      soundOn={soundOn}
                      setSoundOn={setSoundOn}
                      botUsername={botUsername}
                      currentBotDifficulty={currentBotDifficulty}
                    />
                  ) : (
                    <div className="relative z-20 flex justify-between items-center mb-6 border-b border-teal-200/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-cyan-600/15 border border-cyan-400/50 text-cyan-700 px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold">{t.stage} {level}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {t.cables} <span className="font-mono text-sky-600 font-extrabold text-sm">{connections.length}/3</span>
                      </div>
                    </div>
                  )}

              {/* DRAW CABLES GRID CONTAINER */}
              <div 
                id="match-container"
                ref={containerRef}
                className={`relative flex-1 min-h-0 grid grid-cols-2 ${layoutConfig.matchGridGapXClass} ${layoutConfig.maxBoardWidthClass} mx-auto w-full h-full`}
              >
                {/* SVG CANVAS LAYER FOR CONNECTOR DRAWINGS */}
                <svg id="svg-paths-overlay" className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                  <defs>
                    <linearGradient id="light-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="light-red" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {lineCoords.map((line, idx) => {
                    const isLineWrong = line.isWrong;
                    const pathColor = isLineWrong ? "url(#light-red)" : "url(#light-cyan)";
                    const strokeColor = isLineWrong ? "#f43f5e" : "#06b6d4";
                    const strokeWidth = isLineWrong ? "4.5" : "4";

                    // Smooth modern cubic bezier curves for fluid wiring aesthetic
                    let ctrlX1 = line.x1;
                    let ctrlY1 = line.y1;
                    let ctrlX2 = line.x2;
                    let ctrlY2 = line.y2;

                    const isLeft1 = line.flatIndex1 < 3;
                    const isLeft2 = line.flatIndex2 < 3;

                    if (isLeft1 && isLeft2) {
                      // Left column in-between connection: bend slightly into the center gap
                      const bendWidth = Math.min(32, Math.abs(line.y2 - line.y1) * 0.15 + 10);
                      ctrlX1 = line.x1 + bendWidth;
                      ctrlX2 = line.x2 + bendWidth;
                    } else if (!isLeft1 && !isLeft2) {
                      // Right column in-between connection: bend slightly into the center gap
                      const bendWidth = Math.min(32, Math.abs(line.y2 - line.y1) * 0.15 + 10);
                      ctrlX1 = line.x1 - bendWidth;
                      ctrlX2 = line.x2 - bendWidth;
                    } else {
                      // Column-to-column connection: standard horizontal S-curve
                      const midX = (line.x1 + line.x2) / 2;
                      ctrlX1 = midX;
                      ctrlX2 = midX;
                    }

                    const bezierPath = `M ${line.x1} ${line.y1} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${line.x2} ${line.y2}`;

                    return (
                      <g key={`cable-${line.flatIndex1}-${line.flatIndex2}-${idx}`} className="transition-all duration-300">
                        {/* Solid blackish backdrop outline for supreme razor sharpness */}
                        <path
                          d={bezierPath}
                          fill="none"
                          stroke="#0b0f19"
                          strokeWidth={parseFloat(strokeWidth) + 3}
                          strokeLinecap="round"
                        />
                        {/* Soft ambient light glow backing */}
                        <path
                          d={bezierPath}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={parseFloat(strokeWidth) + 4}
                          strokeOpacity="0.45"
                          strokeLinecap="round"
                          className="blur-[1px]"
                        />
                        {/* Core neon wiring stream */}
                        <path
                          d={bezierPath}
                          fill="none"
                          stroke={pathColor}
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                          className={`transition-all duration-300 ${!checked ? "stroke-dasharray-anim" : ""}`}
                        />
                        {/* Core tiny socket nodes */}
                        <circle cx={line.x1} cy={line.y1} r="5.5" fill="#0b0f19" />
                        <circle cx={line.x1} cy={line.y1} r="3" fill={strokeColor} />
                        <circle cx={line.x2} cy={line.y2} r="5.5" fill="#0b0f19" />
                        <circle cx={line.x2} cy={line.y2} r="3" fill={strokeColor} />
                      </g>
                    );
                  })}

                  {/* Temporary dragging cable */}
                  {dragStartInfo && dragStartInfo.isDragging && dragCurrentPos && (() => {
                    const x1 = dragStartInfo.startX;
                    const y1 = dragStartInfo.startY;
                    const x2 = dragCurrentPos.x;
                    const y2 = dragCurrentPos.y;

                    let ctrlX1 = x1;
                    let ctrlY1 = y1;
                    let ctrlX2 = x2;
                    let ctrlY2 = y2;

                    const isLeft = dragStartInfo.index < 3;
                    if (isLeft) {
                      const midX = (x1 + x2) / 2;
                      ctrlX1 = Math.max(x1 + 30, midX);
                      ctrlX2 = Math.min(x2 - 30, midX);
                    } else {
                      const midX = (x1 + x2) / 2;
                      ctrlX1 = Math.min(x1 - 30, midX);
                      ctrlX2 = Math.max(x2 + 30, midX);
                    }

                    const bezierPath = `M ${x1} ${y1} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${x2} ${y2}`;

                    return (
                      <g>
                        {/* Shadow Backing */}
                        <path
                          d={bezierPath}
                          fill="none"
                          stroke="#0b0f19"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        {/* Glow Layer */}
                        <path
                          d={bezierPath}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="9"
                          strokeOpacity="0.4"
                          strokeLinecap="round"
                          className="blur-[2px]"
                        />
                        {/* Core Glowing Stream */}
                        <path
                          d={bezierPath}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          className="stroke-dasharray-anim"
                        />
                        {/* Tiny start/end socket nodes */}
                        <circle cx={x1} cy={y1} r="5.5" fill="#0b0f19" />
                        <circle cx={x1} cy={y1} r="3" fill="#f59e0b" />
                        <circle cx={x2} cy={y2} r="4" fill="#fbbf24" />
                      </g>
                    );
                  })()}
                </svg>

                {/* LEFT COLUMN: SOURCE PLAY CARDS */}
                <div id="col-left" className="poki-match-col">
                  {leftCards.map((emoji, index) => {
                    const isSelected = selectedCardIdx === index;
                    const isConnected = connections.some(([a, b]) => a === index || b === index);
                    const isWrongCard = wrongFlatIndices.includes(index);
                    const isPressed = pressedMatchCardIdx === index;
                    const isReturning = returningMatchCardIdx === index;
                    
                    return (
                      <div
                        key={`left-match-${index}`}
                        id={`card-left-${index}`}
                        onPointerDown={(e) => handlePointerDown(e, index)}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        style={{ touchAction: "none" }}
                        className={`relative rounded-2xl flex justify-center items-center select-none group poki-match-card mx-auto transition-all ease-out pointer-events-auto cursor-pointer touch-none shadow-[0_8px_20px_-3px_rgba(0,0,0,0.18),0_3px_8px_-1px_rgba(0,0,0,0.12)] ${
                          isPressed
                            ? "duration-75 scale-[0.98]"
                            : isReturning
                              ? "duration-75 scale-100"
                              : isSelected
                                ? "duration-150 scale-105 shadow-[0_14px_28px_-4px_rgba(6,182,212,0.3),0_6px_12px_-2px_rgba(0,0,0,0.18)]"
                                : "duration-150 lg:hover:scale-[1.015] lg:hover:shadow-[0_14px_28px_-4px_rgba(0,0,0,0.24),0_6px_12px_-2px_rgba(0,0,0,0.14)]"
                        }`}
                        title="Click to select"
                      >
                        <CanvasCard
                          emoji={emoji}
                          type="left"
                          index={index}
                          isSelected={isSelected}
                          isConnected={isConnected}
                          isChecked={checked}
                          isWrong={isWrongCard}
                          className="rounded-2xl shadow-none transition-all"
                        />

                        {/* Interactive peg for drawing lines */}
                        <div 
                          id={`peg-${index}`} 
                          className={`w-3.5 h-3.5 rounded-full absolute -right-[7px] top-1/2 -translate-y-1/2 border-2 z-30 transition-all duration-300 cursor-pointer ${
                            checked 
                            ? (isWrongCard ? 'bg-rose-500 border-rose-200 scale-125 shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-bounce' : 'bg-emerald-500 border-emerald-200 scale-125 shadow-[0_0_10px_rgba(16,185,129,0.6)]')
                            : (isSelected ? 'bg-amber-400 border-white scale-125 animate-pulse shadow-[0_0_12px_#fbbf24]' : isConnected ? 'bg-cyan-500 border-cyan-100 scale-110 shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'bg-white border-sky-400 group-hover:bg-cyan-500 group-hover:border-white shadow-[0_0_10px_rgba(14,165,233,0.5)] group-hover:scale-125 animate-pulse')
                          }`}
                        >
                          {/* Cancel overlay handle */}
                          {isConnected && !checked && (
                            <button
                              id={`btn-sever-l-${index}`}
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  removeConnection(index);
                              }}
                              className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 border border-slate-700 text-white font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                              title={t.cancelText}
                            >
                              {t.cancelText}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* RIGHT COLUMN: TARGET PLAY CARDS */}
                <div id="col-right" className="poki-match-col">
                  {rightCards.map((emoji, index) => {
                    const flatIdx = index + 3;
                    const isSelected = selectedCardIdx === flatIdx;
                    const isConnected = connections.some(([a, b]) => a === flatIdx || b === flatIdx);
                    const isWrongCard = wrongFlatIndices.includes(flatIdx);
                    const isPressed = pressedMatchCardIdx === flatIdx;
                    const isReturning = returningMatchCardIdx === flatIdx;
                    
                    return (
                      <div
                        key={`right-match-${index}`}
                        id={`card-right-${index}`}
                        onPointerDown={(e) => handlePointerDown(e, flatIdx)}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        style={{ touchAction: "none" }}
                        className={`relative rounded-2xl flex justify-center items-center select-none group poki-match-card mx-auto transition-all ease-out pointer-events-auto cursor-pointer touch-none shadow-[0_8px_20px_-3px_rgba(0,0,0,0.18),0_3px_8px_-1px_rgba(0,0,0,0.12)] ${
                          isPressed
                            ? "duration-75 scale-[0.98]"
                            : isReturning
                              ? "duration-75 scale-100"
                              : isSelected
                                ? "duration-150 scale-105 shadow-[0_14px_28px_-4px_rgba(16,185,129,0.3),0_6px_12px_-2px_rgba(0,0,0,0.18)]"
                                : "duration-150 lg:hover:scale-[1.015] lg:hover:shadow-[0_14px_28px_-4px_rgba(0,0,0,0.24),0_6px_12px_-2px_rgba(0,0,0,0.14)]"
                        }`}
                        title="Click to connect"
                      >
                        <CanvasCard
                          emoji={emoji}
                          type="right"
                          index={index}
                          isSelected={isSelected}
                          isConnected={isConnected}
                          isChecked={checked}
                          isWrong={isWrongCard}
                          className="rounded-2xl shadow-none transition-all"
                        />

                        {/* Interactive right connection peg socket */}
                        <div 
                          id={`peg-${flatIdx}`} 
                          className={`w-3.5 h-3.5 rounded-full absolute -left-[7px] top-1/2 -translate-y-1/2 border-2 z-30 transition-all duration-300 cursor-pointer ${
                            checked 
                            ? (isWrongCard ? 'bg-rose-500 border-rose-200 scale-125 shadow-[0_0_10px_rgba(244,63,94,0.6)] animate-bounce' : 'bg-emerald-500 border-emerald-200 scale-125 shadow-[0_0_10px_rgba(16,185,129,0.6)]')
                            : (isSelected ? 'bg-amber-400 border-white scale-125 animate-pulse shadow-[0_0_12px_#fbbf24]' : isConnected ? 'bg-emerald-500 border-emerald-100 scale-110 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-white border-sky-400 group-hover:bg-emerald-500 group-hover:border-white shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:scale-125 animate-pulse')
                          }`}
                        >
                          {/* Cancel overlay handle */}
                          {isConnected && !checked && (
                            <button
                              id={`btn-sever-r-${index}`}
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  removeConnection(flatIdx);
                              }}
                              className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] bg-slate-900 border border-slate-700 text-white font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                              title={t.cancelText}
                            >
                              {t.cancelText}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* THE PORTAL/OVERLAY FOR THE GAME RESULT - CENTERED IN THE PLAY AREA */}
                {checked && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1f284e]/98 via-[#151a34]/98 to-[#0e1124]/98 backdrop-blur-xl z-40 rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-fade-in border border-slate-600/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-y-auto">
                    <div className="flex flex-col items-center gap-4 max-w-sm">
                      <div className={`p-4 rounded-full shadow-lg ${
                        isSuccess 
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                      }`}>
                        {isSuccess ? <CheckCircle2 className="w-10 h-10 animate-bounce" /> : <XCircle className="w-10 h-10 animate-pulse" />}
                      </div>

                      <div>
                        <h3 className={`font-black text-lg sm:text-xl tracking-tight leading-tight ${
                          isSuccess ? "text-emerald-400" : "text-rose-400"
                        }`}>
                          {isSuccess ? t.matchWinTitle : t.matchLoseTitle}
                        </h3>
                        <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed">
                          {isSuccess ? t.matchWinDesc(streak) : t.matchLoseDesc}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-[#12162b]/60 border border-slate-700/30 text-slate-300 px-3 py-1 rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
                          {isSuccess ? t.streakCount + streak : t.streakBroken}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 w-full justify-center mt-3">
                        {isSuccess ? (
                          <button
                            id="btn-next-stage"
                            onClick={handleNextLevel}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-950/40 active:scale-95 transition-all flex items-center gap-2"
                          >
                            {t.nextStageBtn}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            id="btn-retry-stage"
                            onClick={handleReplayOriginal}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-rose-950/40 active:scale-95 transition-all flex items-center gap-2 animate-bounce"
                          >
                            <RotateCcw className="w-4 h-4" />
                            {t.retryStageBtn}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pause Overlay for Match Mode */}
                {isPaused && !checked && (
                  <div 
                    id="match-paused-overlay" 
                    className="absolute inset-0 bg-[#0a0d18]/85 backdrop-blur-md z-[100] rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-2.5 sm:p-6 text-center select-none animate-fade-in pointer-events-auto overflow-y-auto"
                  >
                    <div className="bg-gradient-to-br from-[#1d2547]/95 via-[#151a36]/95 to-[#0e1226]/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-3.5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_20px_rgba(245,158,11,0.15)] flex flex-col items-center gap-2 sm:gap-4 max-w-xs sm:max-w-sm w-full relative overflow-y-auto max-h-full my-auto pointer-events-auto">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse shrink-0">
                        <Pause className="w-5 h-5 sm:w-7 sm:h-7 fill-amber-400/80" />
                      </div>
                      
                      <div className="shrink-0">
                        <h3 className="font-black text-amber-100 text-sm sm:text-xl tracking-wide uppercase">
                          {t.gamePaused}
                        </h3>
                        <p className="text-slate-300/90 text-[11px] sm:text-sm mt-0.5 sm:mt-1 max-w-[260px] mx-auto leading-tight sm:leading-relaxed">
                          {t.gamePausedDesc}
                        </p>
                      </div>

                      <div className="w-full flex flex-col gap-2 pt-1 shrink-0">
                        <button
                          id="btn-paused-resume-match"
                          type="button"
                          onClick={() => {
                            synth.playResume();
                            setIsPaused(false);
                          }}
                          className="w-full py-2 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 touch-manipulation pointer-events-auto"
                        >
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
                          <span>{t.resumeBtn}</span>
                        </button>

                        <button
                          id="btn-paused-restart-match"
                          type="button"
                          onClick={() => {
                            synth.playSelect();
                            handleReplayOriginal();
                            setIsPaused(false);
                          }}
                          className="w-full py-1.5 sm:py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 active:scale-95 text-[11px] sm:text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 touch-manipulation pointer-events-auto"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{t.newGameText}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* LOWER CONTROLLER ACTIONS */}
              <div className="mt-2.5 sm:mt-4 border-t border-teal-200/40 pt-2 sm:pt-3 flex flex-row justify-between items-center gap-2 relative z-20">
                <div className="text-[10px] sm:text-xs">
                  {!checked ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-amber-300 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-850 shadow-md">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
                      {t.connectingStatus}
                    </span>
                  ) : isSuccess ? (
                    <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-300 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-850 shadow-md animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      {t.successStatus}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-extrabold text-rose-300 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-850 shadow-md">
                      <XCircle className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                      {t.failStatus}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 justify-end">
                  {/* Cancel connections handle on matching layout */}
                  {connections.length > 0 && !checked && (
                    <button
                      id="btn-clear-connections"
                      onClick={clearAllConnections}
                      className="px-4 py-2 text-xs font-bold text-slate-100 hover:text-white bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all shadow-md"
                    >
                      {t.clearAll}
                    </button>
                  )}
                </div>
              </div>

              {/* PORTRAIT MOBILE BRANDING FOOTER */}
              {layoutConfig.showBrandingFooter && (
                <div className="poki-branding-footer">
                  <div className="p-1 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-lg text-white">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[11px] font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                      Emoji BrainPop
                    </span>
                    <span className="text-[8px] text-slate-600 font-medium tracking-wide mt-0.5">
                      by Hung Cuong
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          
          // ==============================
          // TAB 2: MEMORY GAME COMPONENT
          // ==============================
          <div id="memory-container-wrapper" className="flex-1 min-h-0 flex flex-col gap-2.5 text-slate-100 h-full w-full">
            {/* STATS CONTROLLER PANEL (PORTRAIT ONLY - HIDDEN IN LANDSCAPE SIDEBAR) */}
            <div className="hidden bg-slate-900 border border-slate-800 rounded-xl shadow-md flex flex-col relative z-20 flex-shrink-0 p-2 gap-2">
              
              {/* FIRST ROW: MODE SELECTORS AND SETTINGS */}
              <div className="flex flex-col sm:flex-row gap-2 items-stretch justify-between">
                
                {/* PLAY MODE PANEL */}
                <div className="flex-1 flex flex-col gap-1 relative">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.playModeLabel}
                  </span>
                  
                  <div className="relative w-full">
                    {/* Trigger Button */}
                    <button
                      id="btn-play-mode-mobile-trigger"
                      onClick={() => {
                        synth.playSelect();
                        setIsPlayModeDropdownOpenMobile(!isPlayModeDropdownOpenMobile);
                        setIsBoardSizeDropdownOpenMobile(false);
                      }}
                      className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/85 shadow-sm hover:from-[#ffe066] hover:to-[#fcae00] text-xs font-black flex items-center justify-between transition-colors duration-150 focus:outline-none cursor-pointer"
                    >
                      <span className="text-xs font-black tracking-wide">
                        {memoryMode === "solo" ? "Classic" : memoryMode === "twoPlayers" ? "2 Players" : "Challenge"}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-950 transition-transform duration-300 ${isPlayModeDropdownOpenMobile ? "rotate-180" : ""}`} />
                    </button>

                    {/* Options Dropdown Menu */}
                    <div
                      className={`absolute left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-1 bg-slate-950 rounded-xl shadow-2xl ${
                        isPlayModeDropdownOpenMobile
                          ? "max-h-[220px] opacity-100 scale-100 pointer-events-auto border border-slate-800 p-1.5 mt-1"
                          : "max-h-0 opacity-0 scale-95 pointer-events-none border-0 p-0 mt-0"
                      }`}
                    >
                      {/* Option 1: Classic */}
                      <button
                        id="opt-play-mode-mobile-solo"
                        onClick={() => {
                          synth.playSelect();
                          setIsPlayModeDropdownOpenMobile(false);
                          if (memoryMode !== "solo") {
                            setPendingMemoryMode("solo");
                            setPendingDifficulty("3x4");
                            setShowMemoryConfirm(true);
                          }
                        }}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                          memoryMode === "solo"
                            ? "bg-amber-400 text-slate-950 border-2 border-amber-300 font-black shadow-sm"
                            : "bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent font-bold"
                        }`}
                      >
                        <span>Classic</span>
                        {memoryMode === "solo" && (
                          <div className="w-2 h-2 rounded-full bg-slate-950 shadow-sm" />
                        )}
                      </button>

                      {/* Option 2: 2 Players */}
                      <button
                        id="opt-play-mode-mobile-2p"
                        onClick={() => {
                          synth.playSelect();
                          setIsPlayModeDropdownOpenMobile(false);
                          if (memoryMode !== "twoPlayers") {
                            const valid2pDiff = (difficulty === "5x5" || difficulty === "6x6" || difficulty === "6x8" || difficulty === "7x8") ? difficulty : "5x5";
                            setPendingMemoryMode("twoPlayers");
                            setPendingDifficulty(valid2pDiff);
                            setShowMemoryConfirm(true);
                          }
                        }}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                          memoryMode === "twoPlayers"
                            ? "bg-amber-400 text-slate-950 border-2 border-amber-300 font-black shadow-sm"
                            : "bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent font-bold"
                        }`}
                      >
                        <span>2 Players</span>
                        {memoryMode === "twoPlayers" && (
                          <div className="w-2 h-2 rounded-full bg-slate-950 shadow-sm" />
                        )}
                      </button>

                      {/* Option 3: Challenge */}
                      <button
                        id="opt-play-mode-mobile-vs-bot"
                        onClick={() => {
                          synth.playSelect();
                          setIsPlayModeDropdownOpenMobile(false);
                          if (memoryMode !== "vsBot") {
                            setPendingMemoryMode("vsBot");
                            setPendingDifficulty(getBoardSizeForTrophies(vsBotTrophies));
                            setShowMemoryConfirm(true);
                          }
                        }}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                          memoryMode === "vsBot"
                            ? "bg-amber-400 text-slate-950 border-2 border-amber-300 font-black shadow-sm"
                            : "bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent font-bold"
                        }`}
                      >
                        <span>Challenge</span>
                        {memoryMode === "vsBot" && (
                          <div className="w-2 h-2 rounded-full bg-slate-950 shadow-sm" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* BOARD SIZE PANEL (Classic & 2 Players Modes) */}
                <div className={`flex-1 transition-all duration-300 ease-in-out ${
                  memoryMode === "solo" || memoryMode === "twoPlayers" ? "opacity-100 overflow-visible" : "max-h-0 opacity-0 pointer-events-none h-0 overflow-hidden"
                }`}>
                  <div className="flex flex-col gap-1 relative w-full">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      {t.challengeLevel}
                    </span>
                    
                    {/* Compact Dropdown Selector (Mobile/Portrait) */}
                    <div className="relative w-full">
                      {/* Trigger Button */}
                      <button
                        id="btn-board-size-mobile-trigger"
                        onClick={() => {
                          synth.playSelect();
                          setIsBoardSizeDropdownOpenMobile(!isBoardSizeDropdownOpenMobile);
                          setIsPlayModeDropdownOpenMobile(false);
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-between transition-colors duration-150 focus:outline-none cursor-pointer shadow-sm"
                      >
                        <span className="text-xs font-black tracking-wide">
                          {t.boardSizeLabels[difficulty as keyof typeof t.boardSizeLabels] || t.boardSizeLabels["3x4"]}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isBoardSizeDropdownOpenMobile ? "rotate-180 text-cyan-400" : ""}`} />
                      </button>

                      {/* Options Dropdown Menu */}
                      <div
                        className={`absolute left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-1 bg-slate-950 rounded-xl shadow-2xl ${
                          isBoardSizeDropdownOpenMobile
                            ? "max-h-[250px] opacity-100 scale-100 pointer-events-auto border border-slate-800 p-1.5 mt-1"
                            : "max-h-0 opacity-0 scale-95 pointer-events-none border-0 p-0 mt-0"
                        }`}
                      >
                        {(memoryMode === "twoPlayers"
                          ? [
                              { key: "5x5", label: t.boardSizeLabels["5x5"] },
                              { key: "6x6", label: t.boardSizeLabels["6x6"] },
                              { key: "6x8", label: t.boardSizeLabels["6x8"] },
                              { key: "7x8", label: t.boardSizeLabels["7x8"] }
                            ]
                          : [
                              { key: "3x4", label: t.boardSizeLabels["3x4"] },
                              { key: "4x5", label: t.boardSizeLabels["4x5"] },
                              { key: "5x5", label: t.boardSizeLabels["5x5"] },
                              { key: "6x6", label: t.boardSizeLabels["6x6"] },
                              { key: "6x8", label: t.boardSizeLabels["6x8"] },
                              { key: "7x8", label: t.boardSizeLabels["7x8"] }
                            ]
                        ).map((opt) => {
                          const isSelected = difficulty === opt.key;
                          const isLocked = !isBoardSizeUnlocked(opt.key, memoryMode);
                          const remainingTime = getRemainingBoardSizeUnlockTimeText(opt.key);
                          return (
                            <button
                              key={opt.key}
                              id={`btn-board-size-mobile-opt-${opt.key}`}
                              onClick={() => {
                                setIsBoardSizeDropdownOpenMobile(false);
                                if (isLocked) {
                                  handleUnlockBoardSize(opt.key, () => {
                                    setPendingMemoryMode(memoryMode);
                                    setPendingDifficulty(opt.key);
                                    setShowMemoryConfirm(true);
                                  });
                                } else {
                                  synth.playSelect();
                                  if (difficulty !== opt.key) {
                                    setPendingMemoryMode(memoryMode);
                                    setPendingDifficulty(opt.key);
                                    setShowMemoryConfirm(true);
                                  }
                                }
                              }}
                              className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-amber-400 text-slate-950 border-2 border-amber-300 font-black shadow-sm"
                                  : isLocked
                                  ? "bg-slate-900 text-amber-300 border border-amber-500/40 hover:bg-amber-950/50"
                                  : "bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent font-bold"
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                {isLocked ? (
                                  <Video className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                                ) : isSelected ? (
                                  <div className="w-2 h-2 rounded-full bg-slate-950 shrink-0" />
                                ) : null}
                                <span>{opt.label}</span>
                              </div>
                              {isLocked ? (
                                <div className="flex items-center gap-1 bg-amber-400/15 px-2 py-0.5 rounded border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase tracking-wider">
                                  <span>Watch Ad</span>
                                  <span className="text-[8px] opacity-75">(48h)</span>
                                </div>
                              ) : remainingTime ? (
                                <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                                  {remainingTime} left
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECOND ROW: STATS AND CONTROLS */}
              <div className="flex items-center justify-between border-t border-slate-800/60 pt-1.5 text-[10px] font-semibold text-slate-400">
                <div className="flex items-center gap-3">
                  {memoryMode !== "twoPlayers" && memoryMode !== "vsBot" && memoryMode !== "solo" && (
                    <div className={`flex items-center gap-1 bg-slate-950 border px-2 py-0.5 rounded-md ${memoryTimeLeft < 0 ? "border-rose-900/50" : "border-slate-800"}`}>
                      <Clock className={`w-3 h-3 ${memoryTimeLeft <= 10 ? "text-rose-400 animate-pulse" : "text-indigo-400"}`} />
                      <span className={`font-mono font-black text-[10px] ${memoryTimeLeft <= 10 ? "text-rose-400 animate-pulse" : "text-slate-200"}`}>
                        {memoryTimeLeft < 0 ? `-${Math.abs(memoryTimeLeft)}s` : `${memoryTimeLeft}s`}
                      </span>
                    </div>
                  )}

                </div>

                {memoryMode !== "vsBot" && (
                  <button
                    id="btn-re-shuffle-memory-portrait"
                    onClick={() => { synth.playSelect(); generateMemoryGame(difficulty); }}
                    className="px-2.5 py-1 rounded-md border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:text-white text-slate-300 text-[9px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t.reshuffle}</span>
                  </button>
                )}
              </div>

            </div>

            {/* MEMORY CARDS BOARD GRID SYSTEM */}
            <GameViewportFrame title="EMOJI BRAINPOP" equippedThemeId={equippedThemeId}>
              <div 
                id="memory-board-card"
                className={`${layoutConfig.memoryBoardCardClass} ${currentTheme.boardBorder || ''} transition-all duration-500 ease-in-out relative overflow-hidden h-full rounded-lg`}
                style={{
                  background: currentTheme.boardBg || getBoardBackgroundStyle(equippedThemeId),
                }}
              >
              <EnvironmentalEffects effectType={equippedEffect} />

              {/* Soft Grid Texture */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.08] z-0 transition-all duration-500"
                style={{
                  backgroundImage: `linear-gradient(${currentTheme.boardGridColor || '#0ea5e9'} 1px, transparent 1px), linear-gradient(90deg, ${currentTheme.boardGridColor || '#0ea5e9'} 1px, transparent 1px)`,
                  backgroundSize: "24px 24px"
                }}
              />

              {/* Decorative radial premium background overlay */}
              <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${currentTheme.boardRadialOverlay || 'from-sky-400/20 to-transparent'} pointer-events-none z-0 transition-all duration-500`}></div>

              {/* UNIFIED HUD */}
              <GameHUD
                layoutConfig={layoutConfig}
                synth={synth}
                setIsMobileConfigOpen={setIsMobileConfigOpen}
                setIsPaused={setIsPaused}
                isPaused={isPaused}
                activeTab={activeTab}
                memoryMode={memoryMode}
                vsBotTrophies={vsBotTrophies}
                winsP1={winsP1}
                winsP2={winsP2}
                currentScore={currentScore}
                level={level}
                t={t}
                memoryFinished={memoryFinished}
                handleOpenHintModal={handleOpenHintModal}
                hintsCount={hintsCount}
                memoryBusy={memoryBusy}
                soundOn={soundOn}
                setSoundOn={setSoundOn}
                isPortrait={isPortrait}
                isMobileLandscape={isMobileLandscape}
                isTabletLandscape={isTabletLandscape}
                p1Score={p1Score}
                p2Score={p2Score}
                activePlayer={activePlayer}
                botUsername={botUsername}
                currentBotDifficulty={currentBotDifficulty}
                consecutiveMatches={consecutiveMatches}
                difficulty={difficulty}
                memoryCards={memoryCards}
              />



              {/* Soft radial light centered behind the play area */}
              <div 
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  background: "radial-gradient(circle at center, rgba(14, 165, 233, 0.16) 0%, rgba(255, 255, 255, 0) 70%)"
                }}
              />

              {/* Pause/Resume and Hint Container for Classic Mode */}
              {memoryMode === "solo" && !memoryFinished && layoutConfig.showSoloControls && (
                <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-40 flex flex-row gap-2 items-center">
                  {/* Pause/Resume Button */}
                  <button
                    id="btn-memory-pause-toggle"
                    onClick={() => {
                      if (isPaused) {
                        synth.playResume();
                      } else {
                        synth.playPause();
                      }
                      setIsPaused(prev => !prev);
                    }}
                    className="p-1.5 sm:p-2 rounded-xl bg-[#222a4f]/90 border border-slate-600/30 hover:bg-[#2c3664]/90 text-slate-200 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5"
                    title={isPaused ? t.resumeBtn : t.pauseBtn}
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-200" />
                        <span className="text-[9px] sm:text-[10px] font-bold pr-0.5 hidden sm:inline uppercase">{t.resumeBtn}</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-200" />
                        <span className="text-[9px] sm:text-[10px] font-bold pr-0.5 hidden sm:inline uppercase">{t.pauseBtn}</span>
                      </>
                    )}
                  </button>

                  {/* Hint Button */}
                  <button
                    id="btn-memory-hint"
                    onClick={handleOpenHintModal}
                    disabled={memoryBusy}
                    className={`p-1.5 sm:p-2 rounded-2xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] hover:from-[#ffe066] hover:to-[#fcae00] text-[#132257] border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.45)] hover:shadow-[0_8px_18px_rgba(234,179,8,0.45)] -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 ${
                      hintsCount > 0 ? "animate-pulse" : "opacity-90"
                    }`}
                    title={t.hintLabel}
                  >
                    <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#132257] text-[#132257] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#132257]">
                      {t.hintLabel}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] text-center bg-[#132257] text-amber-300 shadow-sm">
                      {hintsCount > 0 ? hintsCount : "+"}
                    </span>
                  </button>
                </div>
              )}

              {/* Hint Modal Popup for Classic Mode */}
              <HintModal
                isHintModalOpen={isHintModalOpen}
                setIsHintModalOpen={setIsHintModalOpen}
                memoryMode={memoryMode}
                memoryFinished={memoryFinished}
                synth={synth}
                t={t}
                hintsCount={hintsCount}
                memoryBusy={memoryBusy}
                executeHint={executeHint}
                handleRewardedAd={handleRewardedAd}
                updateHintsCount={updateHintsCount}
              />

              {/* Pause Overlay for Memory Mode */}
              <PauseOverlay
                isPaused={isPaused}
                isMobileConfigOpen={isMobileConfigOpen}
                setIsPaused={setIsPaused}
                synth={synth}
                t={t}
                generateMemoryGame={generateMemoryGame}
                difficulty={difficulty}
              />

              {/* Abstract large rounded shapes with very low opacity (3-6%) */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Shape 1: Top-Left Circle */}
                <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blue-300 opacity-[0.05]" />
                
                {/* Shape 2: Bottom-Right Blob/Rounded Square */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-3xl bg-indigo-200 opacity-[0.04] rotate-45" />
                
                {/* Shape 3: Left-Middle Rounded Square */}
                <div className="absolute top-1/3 -left-12 w-40 h-40 rounded-2xl bg-sky-200 opacity-[0.04] -rotate-12" />

                {/* Shape 4: Top-Right Circle */}
                <div className="absolute top-10 right-1/4 w-36 h-36 rounded-full bg-blue-100 opacity-[0.06]" />
              </div>

              {/* Watermark emojis silhouettes (2-5% opacity, slightly blurred, randomly rotated & distributed) */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {memoryWatermarks.map((wm, i) => (
                  <div
                    key={`memory-wm-${i}`}
                    className="absolute select-none pointer-events-none font-sans text-center flex items-center justify-center transition-all duration-700"
                    style={{
                      left: `${wm.x}%`,
                      top: `${wm.y}%`,
                      fontSize: `${wm.size}px`,
                      transform: `rotate(${wm.rotation}deg)`,
                      opacity: 0.035, // Low opacity (3.5% falls right in the 2-5% range)
                      filter: "blur(0.5px)",
                      lineHeight: 1,
                    }}
                  >
                    {wm.emoji}
                  </div>
                ))}
              </div>

              {/* Combo notification overlay */}
              {activeCombos.length > 0 && (
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
                  {activeCombos.map((combo) => (
                    <div
                      key={combo.id}
                      className="absolute flex items-center justify-center transition-all duration-300 pointer-events-none"
                      style={{
                        transform: `translate3d(${combo.offsetX}px, ${combo.offsetY}px, 0px)`,
                      }}
                    >
                      <div 
                        className={`animate-combo flex flex-col items-center justify-center px-6 py-3.5 rounded-2xl border-2 shadow-[0_12px_36px_rgba(0,0,0,0.5)] whitespace-nowrap select-none ${combo.glow}`}
                      >
                        <span className="text-[10px] font-black tracking-widest uppercase opacity-85">{combo.label}</span>
                        <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r ${combo.text} bg-clip-text text-transparent font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}>
                          Combo x{combo.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Combo high particles (x5+) */}
              {comboParticles.map((p) => (
                <div
                  key={p.id}
                  className="absolute left-1/2 top-1/2 rounded-full pointer-events-none z-50 animate-sparkle"
                  style={{
                    "--tx": `${p.dx}px`,
                    "--ty": `${p.dy}px`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.color}`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${p.delay}s`,
                  } as React.CSSProperties}
                />
              ))}
              
              {/* DYNAMIC RESPONSIVE MEMORY BOARD AREA */}
              <div ref={memoryGridAreaRef} className="relative z-10 flex-1 min-h-0 w-full h-full flex flex-col items-center justify-center overflow-hidden py-1">
                <PlayerScoreHUD
                  memoryMode={memoryMode}
                  difficulty={difficulty}
                  p1Score={p1Score}
                  p2Score={p2Score}
                  activePlayer={activePlayer}
                  consecutiveMatches={consecutiveMatches}
                  botUsername={botUsername}
                  currentBotDifficulty={currentBotDifficulty}
                  vsBotTrophies={vsBotTrophies}
                  t={t}
                  isPortrait={isPortrait}
                  isMobileLandscape={isMobileLandscape}
                  isTabletLandscape={isTabletLandscape}
                />
                
                {/* Dynamically Centered Grid with Responsive Card Dimensions */}
                <div ref={gridWrapperRef} className="flex-1 min-h-0 w-full h-full flex items-center justify-center overflow-visible p-1">
                  <MemoryBoardGrid
                    memoryCards={memoryCards}
                    memoryCardSizing={memoryCardSizing}
                    memoryMatched={memoryMatched}
                    memoryFlipped={memoryFlipped}
                    memoryMismatch={memoryMismatch}
                    memoryBusy={memoryBusy}
                    matchedByP1={matchedByP1}
                    memoryMode={memoryMode}
                    handleMemoryCardClick={handleMemoryCardClick}
                    equippedCardBackId={equippedCardBackId}
                    equippedThemeId={equippedThemeId}
                    matchSessionId={matchSessionId}
                    tutorialStep={tutorialStep}
                    tutorialCardA={tutorialCardA}
                    tutorialCardB={tutorialCardB}
                  />
                </div>
              </div>

              {/* THE PORTAL/OVERLAY FOR THE MEMORY GAME RESULT - CENTERED IN THE PLAY AREA */}
              <MemoryFinishedModal
                memoryFinished={memoryFinished}
                p1Score={p1Score}
                p2Score={p2Score}
                showVictoryCelebration={showVictoryCelebration}
                fadeCelebrationOut={fadeCelebrationOut}
                showScoreSummary={showScoreSummary}
                memoryMode={memoryMode}
                botUsername={botUsername}
                language={language}
                currentTheme={currentTheme}
                t={t}
                challengeAdWatched={challengeAdWatched}
                classicAdWatched={classicAdWatched}
                isWatchingAd={isWatchingAd}
                memoryCards={memoryCards}
                memoryMoves={memoryMoves}
                memoryTimeLeft={memoryTimeLeft}
                difficulty={difficulty}
                isThemeDark={isThemeDark}
                synth={synth}
                handleWatchAdChallenge={handleWatchAdChallenge}
                handleWatchAdClassic={handleWatchAdClassic}
                generateMemoryGame={generateMemoryGame}
                handleBackToMenu={handleBackToMenu}
              />

              {/* PORTRAIT MOBILE BRANDING FOOTER */}
              {layoutConfig.showBrandingFooter && (
                <div className="poki-branding-footer">
                  <div className="p-1 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-lg text-white">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[11px] font-extrabold tracking-tight bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                      Emoji BrainPop
                    </span>
                    <span className="text-[8px] text-slate-600 font-medium tracking-wide mt-0.5">
                      by Hung Cuong
                    </span>
                  </div>
                </div>
              )}
            </div>
          </GameViewportFrame>
          </div>
        )}
      </main>

      {/* SETTINGS MODAL / PANEL */}
      {isSettingsOpen && (
        <SettingsModal
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          currentTheme={currentTheme}
          t={t}
          synth={synth}
          language={language}
          changeLanguage={changeLanguage}
          isLangDropdownOpen={isLangDropdownOpen}
          setIsLangDropdownOpen={setIsLangDropdownOpen}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
        />
      )}

      {/* SHOP MODAL / PANEL */}
      {isShopOpen && (
        <ShopModal
          isOpen={isShopOpen}
          onClose={() => setIsShopOpen(false)}
          language={language}
          equippedEffect={equippedEffect}
          onEquipEffect={handleSetEquippedEffect}
          equippedCardBackId={equippedCardBackId}
          onEquipCardBack={handleSetEquippedCardBack}
          equippedThemeId={equippedThemeId}
          onEquipTheme={handleSetEquippedTheme}
          equippedMusicId={equippedMusicId}
          onEquipMusic={handleSetEquippedMusic}
          isMobileLandscape={isMobileLandscape}
          highlightItemId={shopHighlightItemId}
          onClearHighlight={() => setShopHighlightItemId(null)}
        />
      )}

      {/* GENTLE SNOW UNLOCK CONGRATULATION DIALOG */}
      <GentleSnowUnlockModal
        showGentleSnowModal={showGentleSnowModal}
        setShowGentleSnowModal={setShowGentleSnowModal}
        t={t}
        synth={synth}
        setShopHighlightItemId={setShopHighlightItemId}
        setIsShopOpen={setIsShopOpen}
      />

      {/* READY TO START? GAME START CONFIRMATION MODAL */}
      <GameStartConfirmModal
        showMemoryConfirm={showMemoryConfirm}
        setShowMemoryConfirm={setShowMemoryConfirm}
        language={language}
        pendingMemoryMode={pendingMemoryMode}
        pendingDifficulty={pendingDifficulty}
        vsBotTrophies={vsBotTrophies}
        t={t}
        synth={synth}
        restoreSavedVsBotMatch={restoreSavedVsBotMatch}
        setMemoryMode={setMemoryMode}
        setDifficulty={setDifficulty}
        generateMemoryGame={generateMemoryGame}
        getBoardSizeForTrophies={getBoardSizeForTrophies}
        isBoardSizeUnlocked={isBoardSizeUnlocked}
        handleUnlockBoardSize={handleUnlockBoardSize}
      />

      {/* RANK UP POPUP CELEBRATION */}
      <RankUpModal
        showRankUpPopup={showRankUpPopup}
        setShowRankUpPopup={setShowRankUpPopup}
        rankUpBadge={rankUpBadge}
        isRankPromotion={isRankPromotion}
        vsBotTrophies={vsBotTrophies}
        t={t}
        currentTheme={currentTheme}
        synth={synth}
      />

      {/* HIGH SCORE POPUP CELEBRATION */}
      <HighScoreModal
        showHighScorePopup={showHighScorePopup}
        setShowHighScorePopup={setShowHighScorePopup}
        newHighScoreValue={newHighScoreValue}
        t={t}
        synth={synth}
        onClose={() => {
          setShowHighScorePopup(false);
          if (hasPendingGentleSnow) {
            setHasPendingGentleSnow(false);
            setShowGentleSnowModal(true);
          }
        }}
      />

      {/* 2 PLAYERS MATCH RECORD RESET CONFIRMATION */}
      <ResetConfirmModal
        showResetConfirm={showResetConfirm}
        setShowResetConfirm={setShowResetConfirm}
        synth={synth}
        t={t}
        setWinsP1={setWinsP1}
        setWinsP2={setWinsP2}
      />

      {/* LOADING REWARDED AD DIALOG OVERLAY */}
      <LoadingAdOverlay
        isWatchingAd={isWatchingAd}
        t={t}
      />
    </div>
    </div>
  );
}
