import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
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
  Lightbulb
} from "lucide-react";
import { CanvasCard } from "./components/CanvasCard";
import { MemoryCard } from "./components/MemoryCard";
import { TRANSLATIONS, Language } from "./locales";
import { adManager } from "./ads/AdManager";
import { 
  BotMemoryManager, 
  BotDecisionEngine, 
  selectRandomBotDifficulty, 
  getBotConfig,
  selectBotDifficultyForTrophies,
  getBoardSizeForTrophies
} from "./BOT";
import { UNIQUE_EMOJIS } from "./emoji/emojis";
import { generateMemoryBoard } from "./emoji/memory";
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
    const saved = localStorage.getItem("emoji_brainpop_lang");
    if (saved === "vi" || saved === "en" || saved === "es" || saved === "pt" || saved === "tr" || saved === "de" || saved === "fr" || saved === "it" || saved === "ru" || saved === "id" || saved === "zh-TW" || saved === "ja" || saved === "ko" || saved === "pl" || saved === "nl" || saved === "th") return saved;
    return "en";
  });

  // Settings Modal open state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Shop Modal open state
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);

  // Gentle Snow 3-Game Unlock & Shop Progression state
  const [classicGamesCompleted, setClassicGamesCompleted] = useState<number>(() => {
    const saved = localStorage.getItem("emoji_brainpop_classic_games_completed");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showGentleSnowModal, setShowGentleSnowModal] = useState<boolean>(false);
  const [shopHighlightItemId, setShopHighlightItemId] = useState<string | null>(null);

  // One-time interactive gameplay demonstration state for first-time players
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const demoHasStartedRef = useRef<boolean>(false);

  // Poki Rewarded Ads state
  const [classicAdWatched, setClassicAdWatched] = useState<boolean>(false);
  const [challengeAdWatched, setChallengeAdWatched] = useState<boolean>(false);
  const [isWatchingAd, setIsWatchingAd] = useState<boolean>(false);

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

  // How to play guide state
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);

  const {
    config: layoutConfig,
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

  // Reset or reapply UI visibility states on every orientation / layout configuration change
  useEffect(() => {
    setIsBoardSizeDropdownOpen(false);
    setIsBoardSizeDropdownOpenMobile(false);
    setIsGameTypeDropdownOpen(false);
    setIsPlayModeDropdownOpen(false);
    setIsPlayModeDropdownOpenMobile(false);
    setIsDiffDropdownOpen(false);
    setIsHowToPlayOpen(false);
    setIsMobileConfigOpen(false);
    setIsMenuDrawerOpen(false);
    setIsSidebarCollapsed(false);
  }, [layoutConfig.name]);

  // Track orientation changes for viewport layout fitting without interfering with game pause state
  const wasLandscapeRef = useRef<boolean>(window.innerWidth > window.innerHeight);
  useEffect(() => {
    const handleOrientationTransition = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      wasLandscapeRef.current = currentWidth > currentHeight;
    };

    window.addEventListener("resize", handleOrientationTransition);
    window.addEventListener("orientationchange", handleOrientationTransition);

    return () => {
      window.removeEventListener("resize", handleOrientationTransition);
      window.removeEventListener("orientationchange", handleOrientationTransition);
    };
  }, []);

  // Localization helper
  const t = TRANSLATIONS[language];

  
  // Game Audio config
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Score states
  const [cardConnectionState, setCardConnectionState] = useState<CardConnectionState>(() => {
    const saved = localStorage.getItem("novel_match_card_connection_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Backward compatibility check for old highscore
    const oldHigh = localStorage.getItem("novel_match_highscore");
    const initialHigh = oldHigh ? parseInt(oldHigh) : 0;
    return { score: 0, highScore: initialHigh };
  });

  const [memoryFlipState, setMemoryFlipState] = useState<MemoryFlipState>(() => {
    const saved = localStorage.getItem("novel_match_memory_flip_state");
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
    const saved = localStorage.getItem("emoji_brainpop_saved_vs_bot_match");
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
    const saved = localStorage.getItem("emoji_brainpop_hints_count");
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
        localStorage.setItem("emoji_brainpop_hints_count", bounded.toString());
      } catch (e) {}
      return bounded;
    });
  };

  // --- TAB 1: CONNECTING CARDS STATE & SYSTEM ---
  const [level, setLevel] = useState<number>(1);
  const [levelHistory, setLevelHistory] = useState<Record<number, { from: string; to: string }[]>>(() => {
    const saved = localStorage.getItem("novel_match_level_history");
    return saved ? JSON.parse(saved) : {};
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
    const saved = localStorage.getItem("emoji_brainpop_saved_vs_bot_match");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.memoryCards && parsed.memoryCards.length > 0 && !parsed.memoryFinished) {
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  }, []);

  const isRestoredRef = useRef(!!savedVsBotMatch);
  const trophiesUpdatedRef = useRef<boolean>(false);
  const p2pWinsUpdatedRef = useRef<boolean>(false);

  const getRankForTrophies = (trophies: number) => {
    if (trophies <= 20) return { id: 0, nameKey: "rankBeginner" as const, badgeType: "shield" as const, color: "text-amber-700", fill: "#b45309", border: "border-amber-700/30", bg: "bg-amber-500/10", shadow: "shadow-amber-500/10" };
    if (trophies <= 50) return { id: 1, nameKey: "rankRookie" as const, badgeType: "shield" as const, color: "text-slate-400", fill: "#94a3b8", border: "border-slate-400/30", bg: "bg-slate-400/10", shadow: "shadow-slate-400/10" };
    if (trophies <= 120) return { id: 2, nameKey: "rankApprentice" as const, badgeType: "shield" as const, color: "text-emerald-500", fill: "#10b981", border: "border-emerald-500/30", bg: "bg-emerald-500/10", shadow: "shadow-emerald-500/10" };
    if (trophies <= 220) return { id: 3, nameKey: "rankSkilled" as const, badgeType: "shield" as const, color: "text-blue-500", fill: "#3b82f6", border: "border-blue-500/30", bg: "bg-blue-500/10", shadow: "shadow-blue-500/10" };
    if (trophies <= 350) return { id: 4, nameKey: "rankExpert" as const, badgeType: "shield" as const, color: "text-fuchsia-500", fill: "#d946ef", border: "border-fuchsia-500/30", bg: "bg-fuchsia-500/10", shadow: "shadow-fuchsia-500/10" };
    if (trophies <= 550) return { id: 5, nameKey: "rankMaster" as const, badgeType: "shield" as const, color: "text-yellow-500", fill: "#eab308", border: "border-yellow-500/30", bg: "bg-yellow-500/10", shadow: "shadow-yellow-500/10" };
    if (trophies <= 800) return { id: 6, nameKey: "rankElite" as const, badgeType: "shield" as const, color: "text-rose-600", fill: "#e11d48", border: "border-rose-600/30", bg: "bg-rose-500/10", shadow: "shadow-rose-500/10" };
    return { id: 7, nameKey: "rankLegend" as const, badgeType: "crown" as const, color: "text-amber-400 font-extrabold animate-pulse", fill: "#fbbf24", border: "border-amber-400/40", bg: "bg-amber-500/15", shadow: "shadow-amber-400/20" };
  };



  const [vsBotTrophies, setVsBotTrophies] = useState<number>(() => {
    const savedNew = localStorage.getItem("emoji_brainpop_vs_bot_trophies");
    if (savedNew !== null) return parseInt(savedNew);
    const savedOld = localStorage.getItem("emoji_brainpop_vs_bot_rating");
    if (savedOld !== null) return parseInt(savedOld);
    return 0;
  });

  const [memoryMode, setMemoryMode] = useState<"solo" | "twoPlayers" | "vsBot">(() => {
    return savedVsBotMatch ? "vsBot" : "solo";
  });

  const [winsP1, setWinsP1] = useState<number>(() => {
    const saved = localStorage.getItem("emoji_brainpop_2p_wins_p1");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [winsP2, setWinsP2] = useState<number>(() => {
    const saved = localStorage.getItem("emoji_brainpop_2p_wins_p2");
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const currentRank = useMemo(() => getRankForTrophies(vsBotTrophies), [vsBotTrophies]);

  const rankProgressPercentage = useMemo(() => {
    const trophies = vsBotTrophies;
    if (trophies <= 0) return 0;
    if (trophies <= 20) {
      return Math.round((trophies / 20) * 100);
    }
    if (trophies <= 50) {
      return Math.round(((trophies - 20) / (50 - 20)) * 100);
    }
    if (trophies <= 120) {
      return Math.round(((trophies - 50) / (120 - 50)) * 100);
    }
    if (trophies <= 220) {
      return Math.round(((trophies - 120) / (220 - 120)) * 100);
    }
    if (trophies <= 350) {
      return Math.round(((trophies - 220) / (350 - 220)) * 100);
    }
    if (trophies <= 550) {
      return Math.round(((trophies - 350) / (550 - 350)) * 100);
    }
    if (trophies <= 800) {
      return Math.round(((trophies - 550) / (800 - 550)) * 100);
    }
    return 100; // Legend is maximum rank
  }, [vsBotTrophies]);

  const rankProgressDisplay = useMemo(() => {
    return rankProgressPercentage >= 99 ? "99%+" : `${rankProgressPercentage}%`;
  }, [rankProgressPercentage]);

  const [showRankUpPopup, setShowRankUpPopup] = useState<boolean>(false);
  const [rankUpBadge, setRankUpBadge] = useState<any>(null);
  const [isRankPromotion, setIsRankPromotion] = useState<boolean>(true);
  const lastRankIdRef = useRef<number | null>(null);

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
    return savedVsBotMatch ? (savedVsBotMatch.matchSessionId || Date.now().toString()) : Date.now().toString();
  });
  const [difficulty, setDifficulty] = useState<"3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | any>(() => {
    if (memoryMode === "vsBot") {
      return getBoardSizeForTrophies(vsBotTrophies);
    }
    if (savedVsBotMatch && savedVsBotMatch.memoryCards) {
      if (savedVsBotMatch.memoryCards.length === 12) return "3x4";
      if (savedVsBotMatch.memoryCards.length === 16) return "4x4";
      if (savedVsBotMatch.memoryCards.length === 20) return "4x5";
      if (savedVsBotMatch.memoryCards.length === 24 || savedVsBotMatch.memoryCards.length === 25) return "5x5";
      if (savedVsBotMatch.memoryCards.length === 30) return "5x6";
      if (savedVsBotMatch.memoryCards.length === 36) return "6x6";
      if (savedVsBotMatch.memoryCards.length === 48) return "6x8";
    }
    return "3x4";
  });
  const [memoryCards, setMemoryCards] = useState<string[]>(() => {
    return savedVsBotMatch ? savedVsBotMatch.memoryCards : [];
  });
  const [memoryMatched, setMemoryMatched] = useState<number[]>(() => {
    return savedVsBotMatch ? savedVsBotMatch.memoryMatched : [];
  });
  const [matchedByP1, setMatchedByP1] = useState<number[]>(() => {
    return savedVsBotMatch ? (savedVsBotMatch.matchedByP1 || []) : [];
  });
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>(() => {
    return savedVsBotMatch ? savedVsBotMatch.memoryFlipped : [];
  });
  const [memoryMoves, setMemoryMoves] = useState<number>(() => {
    return savedVsBotMatch ? savedVsBotMatch.memoryMoves : 0;
  });
  const [memoryFinished, setMemoryFinished] = useState<boolean>(() => {
    return savedVsBotMatch ? savedVsBotMatch.memoryFinished : false;
  });
  const [memoryBusy, setMemoryBusy] = useState<boolean>(false);

  // --- MEMORY GAME START CONFIRMATION STATE ---
  const [pendingDifficulty, setPendingDifficulty] = useState<"3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | any>(() => {
    return savedVsBotMatch ? "5x6" : "3x4";
  });
  const [pendingMemoryMode, setPendingMemoryMode] = useState<"solo" | "twoPlayers" | "vsBot" | any>(() => {
    return savedVsBotMatch ? "vsBot" : "solo";
  });
  const [showMemoryConfirm, setShowMemoryConfirm] = useState(false);

  // --- RESPONSIVE DYNAMIC MEMORY CARD GRID SIZING ---
  const memoryGridAreaRef = useRef<HTMLDivElement>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [memoryCardSizing, setMemoryCardSizing] = useState<{
    cardSize: number;
    gap: number;
    cols: number;
    rows: number;
    gridWidth: number;
    gridHeight: number;
    hideLockedCard?: boolean;
  }>({
    cardSize: 80,
    gap: 8,
    cols: 4,
    rows: 4,
    gridWidth: 344,
    gridHeight: 344,
    hideLockedCard: false,
  });

  useEffect(() => {
    const calculateSizing = () => {
      const container = gridWrapperRef.current || memoryGridAreaRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const availW = Math.max(0, rect.width - 8);
      const availH = Math.max(0, rect.height - 8);

      if (availW <= 0 || availH <= 0) return;

      // Dynamic presets tailored for landscape vs standard layout
      type LayoutCandidate = { cols: number; rows: number; hideLockedCard?: boolean };

      const isLandscapeOrientation = isMobileLandscape || (!isPortrait && availW > availH * 1.15);

      let candidates: LayoutCandidate[] = [];

      if (difficulty === "5x5") {
        // 25 Cards mode:
        // When landscape orientation, evaluate candidates with or without locked card.
        // Option 1: Keep locked card (25 cards) -> [5, 5] (100% full 5x5 grid)
        // Option 2: Remove (hide) locked card (24 cards) -> [8, 3], [6, 4] in landscape; [4, 6] in portrait
        if (isLandscapeOrientation) {
          candidates = [
            { cols: 8, rows: 3, hideLockedCard: true },  // 24 cards = 3 full rows of 8 (100% full, wide)
            { cols: 6, rows: 4, hideLockedCard: true },  // 24 cards = 4 full rows of 6 (100% full, balanced)
            { cols: 5, rows: 5, hideLockedCard: false }, // 25 cards = 5x5 square
          ];
        } else {
          candidates = [
            { cols: 5, rows: 5, hideLockedCard: false }, // 25 cards = 5x5 square (preferred in portrait)
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
        };

        const BOARD_LAYOUT_PRESETS: Record<string, [number, number][]> = {
          "3x4": [[4, 3], [3, 4]],
          "4x4": [[4, 4]],
          "4x5": [[5, 4], [4, 5]],
          "5x6": [[6, 5], [5, 6]],
          "6x6": [[6, 6]],
          "6x8": [[8, 6], [6, 8]],
        };

        const presetList = (isLandscapeOrientation ? MOBILE_LANDSCAPE_PRESETS[difficulty] : BOARD_LAYOUT_PRESETS[difficulty]) || [[4, 4]];
        candidates = presetList.map(([c, r]) => ({ cols: c, rows: r, hideLockedCard: false }));
      }

      const minDim = Math.min(availW, availH);
      const gap = Math.max(3, Math.min(12, Math.floor(minDim / 80)));

      let bestCols = candidates[0].cols;
      let bestRows = candidates[0].rows;
      let bestHideLockedCard = candidates[0].hideLockedCard || false;
      let bestScore = -1;
      let bestCardSize = -1;

      for (const cand of candidates) {
        const { cols: c, rows: r, hideLockedCard } = cand;
        const maxCardW = (availW - (c - 1) * gap) / c;
        const maxCardH = (availH - (r - 1) * gap) / r;
        const possibleCardSize = Math.floor(Math.min(maxCardW, maxCardH));

        // For landscape orientation, give a slight score multiplier to wider grids (c > r)
        const landscapeBonus = (isLandscapeOrientation && c > r) ? 1.12 : 1.0;
        // In portrait mode, prefer standard square 5x5 with locked card if available
        const portraitBonus = (!isLandscapeOrientation && !hideLockedCard && c === r) ? 1.35 : 1.0;
        const candidateScore = possibleCardSize * landscapeBonus * portraitBonus;

        if (candidateScore > bestScore + 0.5) {
          bestScore = candidateScore;
          bestCardSize = possibleCardSize;
          bestCols = c;
          bestRows = r;
          bestHideLockedCard = !!hideLockedCard;
        } else if (Math.abs(candidateScore - bestScore) <= 0.5) {
          const candidateIsLandscape = c >= r;
          const containerIsLandscape = availW >= availH;
          if (candidateIsLandscape === containerIsLandscape) {
            bestScore = candidateScore;
            bestCardSize = possibleCardSize;
            bestCols = c;
            bestRows = r;
            bestHideLockedCard = !!hideLockedCard;
          }
        }
      }

      const cardSize = Math.max(20, bestCardSize);
      const gridWidth = bestCols * cardSize + (bestCols - 1) * gap;
      const gridHeight = bestRows * cardSize + (bestRows - 1) * gap;

      setMemoryCardSizing({
        cardSize,
        gap,
        cols: bestCols,
        rows: bestRows,
        gridWidth,
        gridHeight,
        hideLockedCard: bestHideLockedCard,
      });
    };

    calculateSizing();

    const t1 = setTimeout(calculateSizing, 20);
    const t2 = setTimeout(calculateSizing, 80);
    const t3 = setTimeout(calculateSizing, 200);
    const t4 = setTimeout(calculateSizing, 400);
    const raf = requestAnimationFrame(calculateSizing);

    const observer = new ResizeObserver(() => {
      calculateSizing();
    });

    if (gridWrapperRef.current) {
      observer.observe(gridWrapperRef.current);
    }
    if (memoryGridAreaRef.current) {
      observer.observe(memoryGridAreaRef.current);
    }
    window.addEventListener("resize", calculateSizing);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", calculateSizing);
    };
  }, [
    difficulty,
    memoryMode,
    activeTab,
    isSidebarCollapsed,
    layoutConfig.name,
    matchSessionId,
    memoryCards.length,
    showMemoryConfirm,
    isMobileConfigOpen,
    isMenuDrawerOpen,
    isBoardSizeDropdownOpen,
    isBoardSizeDropdownOpenMobile,
    isPaused,
    isMobileLandscape,
    isPortrait
  ]);

  // --- PREMIUM VICTORY CELEBRATION STATE ---
  const [showVictoryCelebration, setShowVictoryCelebration] = useState<boolean>(false);
  const [fadeCelebrationOut, setFadeCelebrationOut] = useState<boolean>(false);
  const [showScoreSummary, setShowScoreSummary] = useState<boolean>(false);

  // --- 2 PLAYERS GAME STATE ---
  const [p1Score, setP1Score] = useState<number>(() => {
    return savedVsBotMatch ? savedVsBotMatch.p1Score : 0;
  });
  const [p2Score, setP2Score] = useState<number>(() => {
    return savedVsBotMatch ? savedVsBotMatch.p2Score : 0;
  });
  const [activePlayer, setActivePlayer] = useState<1 | 2>(() => {
    return savedVsBotMatch ? savedVsBotMatch.activePlayer : 1;
  });
  const [consecutiveMatches, setConsecutiveMatches] = useState<number>(() => {
    return savedVsBotMatch ? savedVsBotMatch.consecutiveMatches : 0;
  });

  // Reset landscape menu tab when mobile config menu is closed
  useEffect(() => {
    if (!isMobileConfigOpen) {
      setLandscapeMenuTab("home");
    }
  }, [isMobileConfigOpen]);

  // --- VISUAL POLISH STATES (SHAKE, COMBO, PARTICLES) ---
  const COMBO_DISPLAY_DURATION = 1000;
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [comboCount, setComboCount] = useState<number>(0);
  const [activeCombo, setActiveCombo] = useState<{
    id: number;
    count: number;
    glow: string;
    text: string;
    label: string;
  } | null>(null);
  const [comboParticles, setComboParticles] = useState<Array<{ id: number; dx: number; dy: number; size: number; color: string; delay: number }>>([]);

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
    
    setActiveCombo({
      id: Date.now(),
      count,
      glow,
      text,
      label
    });

    if (count >= 5) {
      const newComboParticles = Array.from({ length: 15 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 15 + (Math.random() * 0.3 - 0.15);
        const speed = 40 + Math.random() * 60;
        return {
          id: i,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          size: 4 + Math.random() * 4,
          color: "#fbbf24", // Gold stars
          delay: Math.random() * 0.1,
        };
      });
      setComboParticles(newComboParticles);
      setTimeout(() => {
        setComboParticles([]);
      }, COMBO_DISPLAY_DURATION);
    }

    setTimeout(() => {
      setActiveCombo(prev => prev && prev.count === count ? null : prev);
    }, COMBO_DISPLAY_DURATION);
  };

  // --- BOT STATE ---
  const [currentBotDifficulty, setCurrentBotDifficulty] = useState<number>(() => {
    return savedVsBotMatch ? savedVsBotMatch.currentBotDifficulty : 3;
  });
  const [botUsername, setBotUsername] = useState<string>(() => {
    if (savedVsBotMatch && savedVsBotMatch.botUsername) {
      return savedVsBotMatch.botUsername;
    }
    const names = [
      "RoboMatch", "PixelMind", "CyberBrain", "SpeedyAI", 
      "SynapseX", "BinaryBrain", "AlphaMemory", "Algorhythm",
      "NeuralLink", "SiliconSage", "DeepThink", "CortexBot"
    ];
    return names[Math.floor(Math.random() * names.length)];
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

  // Dynamic Help Config based on active Play Mode or Match Tab
  const helpConfig = useMemo(() => {
    if (activeTab === "match") {
      return {
        title: t.matchTitle,
        iconName: "Info",
        rules: t.matchInstructions,
      };
    }

    // Otherwise, we are in "memory" tab, so check memoryMode
    if (memoryMode === "solo") {
      return {
        title: t.soloTitle,
        iconName: "SquareStack",
        rules: t.soloRules,
      };
    } else if (memoryMode === "twoPlayers") {
      return {
        title: t.twoPlayersTitle,
        iconName: "Users",
        rules: t.twoPlayersRules,
      };
    } else {
      // vsBot
      return {
        title: t.vsBotTitle,
        iconName: "Bot",
        rules: t.vsBotRules,
      };
    }
  }, [activeTab, memoryMode, t]);

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
    localStorage.setItem("novel_match_level_history", JSON.stringify(updatedHistory));

    // pool all 6 emojis of matching pairs and shuffle globally (allow A-to-A, matching random cards anywhere!)
    const allEmojis = selectedPairs.flatMap(p => [p.from, p.to]);
    const shuffledPool = shuffleArray(allEmojis);

    setLeftCards(shuffledPool.slice(0, 3));
    setRightCards(shuffledPool.slice(3, 6));
  };

  // --- MEMORY GAME INITS ---
  const generateMemoryGame = (diff: "3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8") => {
    setIsMenuDrawerOpen(false);
    if (!layoutConfig.showSidebar) {
      setIsSidebarCollapsed(true);
    }
    isRestoredRef.current = false;
    trophiesUpdatedRef.current = false;
    p2pWinsUpdatedRef.current = false;
    setMatchSessionId(Date.now().toString());
    if (memoryMode === "vsBot") {
      localStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
    }
    // Determine card dimensions
    let actualDiff = diff;
    if (memoryMode === "twoPlayers") {
      if (diff === "5x5" || diff === "5x6" || diff === "6x6" || diff === "6x8") {
        actualDiff = diff;
      } else {
        actualDiff = "5x5";
      }
      if (difficulty !== actualDiff) {
        setDifficulty(actualDiff);
      }
    } else if (memoryMode === "vsBot") {
      actualDiff = getBoardSizeForTrophies(vsBotTrophies);
      if (difficulty !== actualDiff) {
        setDifficulty(actualDiff);
      }
    }

    const { randomizedBoard, selectedEmojis } = generateMemoryBoard(actualDiff, memoryMode);

    setMemoryCards(randomizedBoard);
    setMemoryMatched([]);
    setMatchedByP1([]);
    setMemoryFlipped([]);
    setMemoryMoves(0);
    setMemoryFinished(false);
    setMemoryBusy(false);
    setIsPaused(false);
    setShowVictoryCelebration(false);
    setFadeCelebrationOut(false);
    setShowScoreSummary(false);
    setComboCount(0);
    setActiveCombo(null);
    setComboParticles([]);
    setClassicAdWatched(false);
    setChallengeAdWatched(false);
    setIsWatchingAd(false);

    adManager.gameplayStart();

    if (memoryMode === "twoPlayers" || memoryMode === "vsBot") {
      setP1Score(0);
      setP2Score(0);
      setActivePlayer(1);
      setConsecutiveMatches(0);
    }

    if (memoryMode === "vsBot") {
      const bDiff = selectBotDifficultyForTrophies(vsBotTrophies);
      setCurrentBotDifficulty(bDiff);
      botMemoryRef.current = new BotMemoryManager(bDiff);
      lastHumanRevealedRef.current = [];
      
      const names = [
        "RoboMatch", "PixelMind", "CyberBrain", "SpeedyAI", 
        "SynapseX", "BinaryBrain", "AlphaMemory", "Algorhythm",
        "NeuralLink", "SiliconSage", "DeepThink", "CortexBot"
      ];
      const randomName = names[Math.floor(Math.random() * names.length)];
      setBotUsername(randomName);
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
        default: return 120;
      }
    };
    setMemoryTimeLeft(getInitialTime());
    setMemoryTimerActive(true);

    if (typeof window !== "undefined") {
      setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
      setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
      setTimeout(() => window.dispatchEvent(new Event("resize")), 150);
      setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
    }
  };

  // Tick memory timer (Non-blocking: continues ticking past zero into negative values)
  useEffect(() => {
    let intervalId: any = null;
    if (memoryTimerActive && !memoryFinished && activeTab === "memory" && !isPaused) {
      intervalId = setInterval(() => {
        setMemoryTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [memoryTimerActive, memoryFinished, activeTab, isPaused]);

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
    }
    setDifficulty(restoredDiff);
    if (savedState.matchSessionId) {
      setMatchSessionId(savedState.matchSessionId);
    }
    setMemoryCards(savedState.memoryCards);
    setMemoryMatched(savedState.memoryMatched);
    setMatchedByP1(savedState.matchedByP1 || []);
    setMemoryFlipped(savedState.memoryFlipped);
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
  };

  useEffect(() => {
    if (isRestoredRef.current) {
      isRestoredRef.current = false;
      return;
    }

    if (memoryMode === "vsBot") {
      const saved = localStorage.getItem("emoji_brainpop_saved_vs_bot_match");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.memoryCards && parsed.memoryCards.length > 0 && !parsed.memoryFinished) {
            // Already restored by useState initializer or explicit action, don't auto-regenerate.
            return;
          }
        } catch (e) {}
      }
    }

    generateMemoryGame(difficulty);
  }, [difficulty, memoryMode]);

  useEffect(() => {
    if (activeTab === "memory") {
      if (memoryCards.length === 0) {
        generateMemoryGame(difficulty);
      }
    }
  }, [activeTab]);

  // One-time interactive gameplay demonstration sequence for first-time players
  useEffect(() => {
    const hasPlayedDemo = localStorage.getItem("emoji_brainpop_demo_played") === "true";
    if (
      !hasPlayedDemo &&
      !demoHasStartedRef.current &&
      activeTab === "memory" &&
      memoryMode === "solo" &&
      difficulty === "3x4" &&
      memoryCards.length === 12 &&
      !memoryFinished
    ) {
      demoHasStartedRef.current = true;
      setIsDemoRunning(true);

      const c1 = 0;
      const emoji1 = memoryCards[c1];

      let c2 = -1;
      for (let i = 0; i < memoryCards.length; i++) {
        if (memoryCards[i] !== emoji1 && memoryCards[i] !== "BLOCKED") {
          c2 = i;
          break;
        }
      }

      let c3 = -1;
      for (let i = 0; i < memoryCards.length; i++) {
        if (i !== c1 && memoryCards[i] === emoji1) {
          c3 = i;
          break;
        }
      }

      if (c2 !== -1 && c3 !== -1) {
        let timer2: NodeJS.Timeout;
        let timer3: NodeJS.Timeout;
        let timer4: NodeJS.Timeout;

        // 1. Reveal 1st card after brief initial delay
        const timer1 = setTimeout(() => {
          handleMemoryCardClick(c1, false, true);

          // 2. Reveal 2nd card (non-matching)
          timer2 = setTimeout(() => {
            handleMemoryCardClick(c2, false, true);

            // 3. Reveal 3rd card (matching 1st card)
            timer3 = setTimeout(() => {
              handleMemoryCardClick(c3, false, true);

              // 4 & 5. Pair resolved, remaining unmatched card returns to normal state, restore control
              timer4 = setTimeout(() => {
                setIsDemoRunning(false);
                localStorage.setItem("emoji_brainpop_demo_played", "true");
              }, 800);
            }, 1100);
          }, 900);
        }, 600);

        return () => {
          clearTimeout(timer1);
          if (timer2) clearTimeout(timer2);
          if (timer3) clearTimeout(timer3);
          if (timer4) clearTimeout(timer4);
        };
      } else {
        setIsDemoRunning(false);
        localStorage.setItem("emoji_brainpop_demo_played", "true");
      }
    }
  }, [memoryCards, memoryMode, activeTab, difficulty, memoryFinished]);

  useEffect(() => {
    if (savedVsBotMatch) {
      const manager = new BotMemoryManager(savedVsBotMatch.currentBotDifficulty);
      manager.restoreMemory(savedVsBotMatch.botMemory || []);
      botMemoryRef.current = manager;
      lastHumanRevealedRef.current = savedVsBotMatch.lastHumanRevealed || [];
    }
  }, []);

  // Automatically save VS BOT match state on any change
  useEffect(() => {
    const targetPairsToWin = difficulty === "5x5" ? 7 : difficulty === "6x6" ? 10 : 8;
    const isCompleted = memoryCards.length > 0 && (
      memoryMatched.length === (memoryCards.includes("BLOCKED") ? memoryCards.length - 1 : memoryCards.length) ||
      (memoryMode !== "vsBot" && (p1Score >= targetPairsToWin || p2Score >= targetPairsToWin))
    );

    if (memoryMode === "vsBot" && !memoryFinished && !isCompleted && memoryCards.length > 0) {
      const stateToSave = {
        memoryCards,
        memoryMatched,
        memoryFlipped,
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
      localStorage.setItem("emoji_brainpop_saved_vs_bot_match", JSON.stringify(stateToSave));
    } else if (memoryFinished || isCompleted) {
      localStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
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
        localStorage.setItem("emoji_brainpop_vs_bot_trophies", nextTrophies.toString());
        localStorage.setItem("emoji_brainpop_vs_bot_rating", nextTrophies.toString());
        return nextTrophies;
      });
      localStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
    }
  }, [memoryFinished, memoryMode, p1Score, p2Score]);

  // Update 2 Players Match record wins when a match is completed
  useEffect(() => {
    if (memoryFinished && memoryMode === "twoPlayers" && !p2pWinsUpdatedRef.current) {
      p2pWinsUpdatedRef.current = true;
      if (p1Score > p2Score) {
        setWinsP1(prev => {
          const nextVal = prev + 1;
          localStorage.setItem("emoji_brainpop_2p_wins_p1", nextVal.toString());
          return nextVal;
        });
      } else if (p2Score > p1Score) {
        setWinsP2(prev => {
          const nextVal = prev + 1;
          localStorage.setItem("emoji_brainpop_2p_wins_p2", nextVal.toString());
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
        // Fallback to grant reward in dev / unblocked testing environments
        onSuccess();
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
        localStorage.setItem("novel_match_memory_flip_state", JSON.stringify(updated));
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
          localStorage.setItem("emoji_brainpop_vs_bot_trophies", next.toString());
          localStorage.setItem("emoji_brainpop_vs_bot_rating", next.toString());
          return next;
        });
      } else if (diffValue < 0) {
        // LOSS: reduce trophy loss by 50%
        const lossAmount = Math.abs(diffValue);
        const recoveryAmount = Math.max(1, Math.floor(lossAmount / 2));
        setVsBotTrophies(prev => {
          const next = prev + recoveryAmount;
          localStorage.setItem("emoji_brainpop_vs_bot_trophies", next.toString());
          localStorage.setItem("emoji_brainpop_vs_bot_rating", next.toString());
          return next;
        });
      } else {
        // DRAW: +1 bonus trophy
        setVsBotTrophies(prev => {
          const next = prev + 1;
          localStorage.setItem("emoji_brainpop_vs_bot_trophies", next.toString());
          localStorage.setItem("emoji_brainpop_vs_bot_rating", next.toString());
          return next;
        });
      }
      synth.playRankUp();
    });
  };

  // Track AI thinking progress for visual bar in real-time
  useEffect(() => {
    if (memoryMode !== "vsBot" || activePlayer !== 2 || memoryFinished || memoryBusy) {
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
    if (memoryMode !== "vsBot" || activePlayer !== 2 || memoryFinished || memoryBusy) {
      return;
    }

    const config = getBotConfig(currentBotDifficulty);
    const thinkingTimeout = setTimeout(() => {
      if (memoryFinished || activePlayer !== 2) return;

      const decision = BotDecisionEngine.decideNextFlip({
        cards: memoryCards,
        matchedIndices: memoryMatched,
        flippedIndices: memoryFlipped,
        memory: botMemoryRef.current?.getMemory() || [],
        lastHumanRevealed: lastHumanRevealedRef.current,
      });

      if (decision !== -1) {
        handleMemoryCardClick(decision, true);
      }
    }, config.thinkingTimeMs);

    return () => clearTimeout(thinkingTimeout);
  }, [
    memoryMode,
    activePlayer,
    memoryFinished,
    memoryBusy,
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
        localStorage.setItem("novel_match_card_connection_state", JSON.stringify(updated));
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
    updateLineCoordinates();
    const timer = setTimeout(updateLineCoordinates, 120);
    return () => clearTimeout(timer);
  }, [connections, leftCards, rightCards, checked, activeTab]);

  useEffect(() => {
    // Create ResizeObserver to monitor container element sizing
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateLineCoordinates();
      });
      resizeObserver.observe(containerRef.current);
    }

    const handleResize = () => {
      updateLineCoordinates();
      // Extra safety redraw after layout stabilizes
      setTimeout(updateLineCoordinates, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [connections, leftCards, rightCards, checked, activeTab]);

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
    localStorage.removeItem("novel_match_level_history");

    // Reset both current scores
    setCardConnectionState(prev => {
      const updated = { ...prev, score: 0 };
      localStorage.setItem("novel_match_card_connection_state", JSON.stringify(updated));
      return updated;
    });
    setMemoryFlipState(prev => {
      const updated = { ...prev, score: 0 };
      localStorage.setItem("novel_match_memory_flip_state", JSON.stringify(updated));
      return updated;
    });

    generateLevel(1, {});
    generateMemoryGame(difficulty);
  };

  const handleBackToMenu = () => {
    synth.playSelect();
    setMemoryFinished(false);
    if (memoryMode === "vsBot") {
      localStorage.removeItem("emoji_brainpop_saved_vs_bot_match");
    }
    setActiveTab("memory");
  };

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem("emoji_brainpop_lang", newLang);
  };

  // --- TAB 2: MEMORY GAME CLICK LOGIC ---
  const handleMemoryMatchReward = (newMatchedLength: number, currentMoves: number, isCombo: boolean) => {
    const isCompleted = newMatchedLength === (memoryCards.includes("BLOCKED") ? memoryCards.length - 1 : memoryCards.length);

    const applyRewards = () => {
      const basePoints = (memoryCards.length * 10) / 2;
      const timeBonus = (memoryTimeLeft > 0 ? memoryTimeLeft * 20 : 0) / 5;
      const flipEfficiencyBonus = Math.max(0, 1000 - currentMoves * 10) / 10;
      const finalLevelScore = Math.round(basePoints + timeBonus + flipEfficiencyBonus);

      const isSolo = memoryMode === "solo";
      const isNewHigh = isSolo && finalLevelScore > memoryFlipState.highScore;

      if (isCompleted) {
        if (isSolo) {
          const prevGames = parseInt(localStorage.getItem("emoji_brainpop_classic_games_completed") || "0", 10);
          const newGamesCount = prevGames + 1;
          localStorage.setItem("emoji_brainpop_classic_games_completed", newGamesCount.toString());
          setClassicGamesCompleted(newGamesCount);

          const isSnowOwned = getInventoryState().ownedItemIds.includes("effect_snow");
          const alreadyNotified = localStorage.getItem("emoji_brainpop_gentle_snow_unlocked_notified") === "true";

          if (newGamesCount >= 3 && !isSnowOwned && !alreadyNotified) {
            unlockItem("effect_snow");
            localStorage.setItem("emoji_brainpop_gentle_snow_unlocked_notified", "true");
            setShowGentleSnowModal(true);
          }

          setMemoryFlipState(prev => {
            const newScore = prev.score + finalLevelScore;
            const updated = {
              ...prev,
              score: newScore,
              highScore: Math.max(prev.highScore, finalLevelScore)
            };
            localStorage.setItem("novel_match_memory_flip_state", JSON.stringify(updated));
            return updated;
          });
        }

        setMemoryFinished(true);
        adManager.gameplayStop();
        setShowScoreSummary(true);
        setShowVictoryCelebration(false);

        if (isNewHigh) {
          synth.playHighScore();
          setNewHighScoreValue(finalLevelScore);
          setShowHighScorePopup(true);
          triggerScreenShake();
        } else {
          synth.playVictory();
        }
      }
      setMemoryBusy(false);
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
    if (isPaused) return;
    if (memoryFinished) return;
    if (memoryCards[clickedIdx] === "BLOCKED") return; // Blocked card can't be clicked or flipped
    if (memoryBusy && !isDemoAction) return; // Block clicks during auto-flip delay
    if (memoryMatched.includes(clickedIdx)) return; // Already matched
    if (memoryFlipped.includes(clickedIdx)) return; // Already flipped state
    if (isDemoRunning && !isDemoAction) return; // Block player input during interactive demonstration

    if (memoryMode === "vsBot" && activePlayer === 2 && !isBotAction) return; // Block player clicks during BOT turn

    if (memoryMode === "twoPlayers" || memoryMode === "vsBot") {
      synth.playSelect();
      setMemoryMoves(prev => prev + 1);

      const currentFlipped = [...memoryFlipped];

      if (currentFlipped.length === 0) {
        // First card flipped
        setMemoryFlipped([clickedIdx]);
        if (memoryMode === "vsBot") {
          botMemoryRef.current?.recordReveal(memoryCards[clickedIdx], clickedIdx);
          if (activePlayer === 1) {
            lastHumanRevealedRef.current = [clickedIdx];
          }
        }
      } else if (currentFlipped.length === 1) {
        // Second card flipped
        const firstIdx = currentFlipped[0];
        setMemoryFlipped([firstIdx, clickedIdx]);
        setMemoryBusy(true);
        if (memoryMode === "vsBot") {
          botMemoryRef.current?.recordReveal(memoryCards[clickedIdx], clickedIdx);
          if (activePlayer === 1) {
            lastHumanRevealedRef.current = [firstIdx, clickedIdx];
          }
        }

        const matchFound = memoryCards[firstIdx] === memoryCards[clickedIdx];

        if (matchFound) {
          setTimeout(() => {
            const nextConsecutive = consecutiveMatches + 1;
            const isCombo = nextConsecutive >= 2;

            if (isCombo) {
              synth.playCombo(nextConsecutive);
            } else {
              synth.playSuccess();
            }
            triggerScreenShake();
            const newMatched = [...memoryMatched, firstIdx, clickedIdx];
            setMemoryMatched(newMatched);
            if (activePlayer === 1) {
              setMatchedByP1(prev => [...prev, firstIdx, clickedIdx]);
            }
            setMemoryFlipped([]);
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
              setP1Score(currentP1Score);
            } else {
              currentP2Score = p2Score + 1;
              setP2Score(currentP2Score);
            }

            const targetPairsToWin = difficulty === "5x5" ? 7 : difficulty === "6x6" ? 10 : 8;
            const eitherReachedTarget = currentP1Score >= targetPairsToWin || currentP2Score >= targetPairsToWin;
            const isCompleted = newMatched.length === (memoryCards.includes("BLOCKED") ? memoryCards.length - 1 : memoryCards.length);

            const shouldEnd = memoryMode === "vsBot"
              ? isCompleted
              : (eitherReachedTarget || isCompleted);

            const resolveTurn = () => {
              if (shouldEnd) {
                setMemoryFinished(true);
                adManager.gameplayStop();
                setShowScoreSummary(true);
                setShowVictoryCelebration(false);
              } else {
                // Consecutive successful turns limited to max 3
                if (nextConsecutive >= 3) {
                  setActivePlayer(activePlayer === 1 ? 2 : 1);
                  setConsecutiveMatches(0);
                } else {
                  setConsecutiveMatches(nextConsecutive);
                }
              }
              setMemoryBusy(false);
            };

            if (isCombo) {
              setTimeout(() => {
                resolveTurn();
              }, COMBO_DISPLAY_DURATION);
            } else {
              resolveTurn();
            }
          }, 600); // Small feedback delay
        } else {
          // No match! Keep face-up for 1 second as required
          setTimeout(() => {
            setMemoryFlipped([]);
            setActivePlayer(activePlayer === 1 ? 2 : 1);
            setConsecutiveMatches(0);
            setMemoryBusy(false);
          }, 1000);
        }
      }
      return;
    }

    synth.playSelect();
    setMemoryMoves(prev => prev + 1);

    const currentFlipped = [...memoryFlipped];

    if (currentFlipped.length === 0) {
      // First card flipped in the current sequence
      setMemoryFlipped([clickedIdx]);
    } 
    else if (currentFlipped.length === 1) {
      // Second card flipped, let's verify if they match!
      const firstIdx = currentFlipped[0];
      const matchFound = memoryCards[firstIdx] === memoryCards[clickedIdx];

      if (matchFound) {
        setMemoryBusy(true);
        // Correct pair! Keep them permanently face-up
        const nextCombo = comboCount + 1;
        setComboCount(nextCombo);
        const isCombo = nextCombo >= 2;
        if (isCombo) {
          synth.playCombo(nextCombo);
        } else {
          synth.playSuccess();
        }
        triggerScreenShake();
        if (isCombo) {
          triggerComboNotification(nextCombo);
        }

        const newMatched = [...memoryMatched, firstIdx, clickedIdx];
        setMemoryMatched(newMatched);
        setMatchedByP1(prev => [...prev, firstIdx, clickedIdx]);
        setMemoryFlipped([]); // Clear current unresolved active flip list

        handleMemoryMatchReward(newMatched.length, memoryMoves + 1, isCombo);
      } else {
        // Keep both face-up so user sees them, waiting for the 3rd flip
        setMemoryFlipped([firstIdx, clickedIdx]);
      }
    } 
    else if (currentFlipped.length === 2) {
      // New Rule: Player can flip a 3rd card if the first 2 did not match.
      // Check if the 3rd card matches either the 1st OR the 2nd card
      const firstIdx = currentFlipped[0];
      const secondIdx = currentFlipped[1];

      if (memoryCards[clickedIdx] === memoryCards[firstIdx]) {
        // Match found with 1st card!
        setMemoryBusy(true);
        const nextCombo = comboCount + 1;
        setComboCount(nextCombo);
        const isCombo = nextCombo >= 2;
        if (isCombo) {
          synth.playCombo(nextCombo);
        } else {
          synth.playSuccess();
        }
        triggerScreenShake();
        if (isCombo) {
          triggerComboNotification(nextCombo);
        }

        const newMatched = [...memoryMatched, firstIdx, clickedIdx];
        setMemoryMatched(newMatched);
        setMatchedByP1(prev => [...prev, firstIdx, clickedIdx]);
        setMemoryFlipped([]); // Clear flipped list. Non-matching 2nd card is turned back face down.

        handleMemoryMatchReward(newMatched.length, memoryMoves + 1, isCombo);
      } 
      else if (memoryCards[clickedIdx] === memoryCards[secondIdx]) {
        // Match found with 2nd card!
        setMemoryBusy(true);
        const nextCombo = comboCount + 1;
        setComboCount(nextCombo);
        const isCombo = nextCombo >= 2;
        if (isCombo) {
          synth.playCombo(nextCombo);
        } else {
          synth.playSuccess();
        }
        triggerScreenShake();
        if (isCombo) {
          triggerComboNotification(nextCombo);
        }

        const newMatched = [...memoryMatched, secondIdx, clickedIdx];
        setMemoryMatched(newMatched);
        setMatchedByP1(prev => [...prev, secondIdx, clickedIdx]);
        setMemoryFlipped([]); // Clear flipped list. Non-matching 1st card is turned back face down.

        handleMemoryMatchReward(newMatched.length, memoryMoves + 1, isCombo);
      } 
      else {
        // No match! Show the 3rd card briefly, then immediately flip all 3 back down after a delay.
        setComboCount(0);
        setMemoryFlipped([firstIdx, secondIdx, clickedIdx]);
        setMemoryBusy(true);

        setTimeout(() => {
          setMemoryFlipped([]);
          setMemoryBusy(false);
        }, 750); // 750ms delay lets the user see the 3rd mismatch before automatic flip-back
      }
    }
  };

  // --- CLASSIC MODE HINT ACTION ---
  const handleOpenHintModal = () => {
    if (memoryMode !== "solo") return;
    if (memoryFinished || memoryCards.length === 0) return;
    synth.playSelect();
    setIsHintModalOpen(true);
  };

  const executeHint = () => {
    if (memoryMode !== "solo") return;
    if (memoryFinished || isPaused || memoryCards.length === 0 || memoryBusy) return;
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

    setTimeout(() => {
      const newMatched = [...memoryMatched, idx1, idx2];
      setMemoryMatched(newMatched);
      setMatchedByP1(prev => [...prev, idx1, idx2]);
      setMemoryFlipped([]);
      setMemoryBusy(false);
      synth.playSuccess();
      triggerScreenShake();
      handleMemoryMatchReward(newMatched.length, memoryMoves + 1, false);
    }, 600);
  };

  const shouldSidebarBeDrawer = false;

  const renderMobileLandscapeMenu = () => {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-0 h-full overflow-hidden gap-2 w-full max-w-4xl mx-auto text-slate-100 selection:bg-cyan-900 select-none">
        {/* A. NESTED HEADER */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 shrink-0 h-8">
          {/* Logo and Name */}
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-lg text-white">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10.5px] font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Emoji BrainPop
            </span>
          </div>

          {/* Trophies, Score, Shop, Settings, and Resume */}
          <div className="flex items-center gap-1.5">
            {/* Trophies badge - Battle Mode only */}
            {memoryMode === "vsBot" && (
              <div className="flex items-center gap-1 bg-[#1e2552]/60 border border-[#3f509d]/40 rounded-full px-2 py-0.5 text-[9px] font-black uppercase text-slate-300 shadow-inner">
                <Trophy className="w-3 h-3 text-amber-500 animate-pulse" />
                <span>TROPHIES</span>
                <span className="text-amber-300 ml-0.5 font-mono">{vsBotTrophies}</span>
              </div>
            )}

            {/* Classic score badge - Classic Mode only */}
            {memoryMode === "solo" && (
              <div className="flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 rounded-full px-2 py-0.5 text-[9px] font-black uppercase text-emerald-300 shadow-inner">
                <Award className="w-3 h-3 text-emerald-400 animate-pulse" />
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
              className="py-1 px-2.5 rounded-lg bg-gradient-to-b from-[#34448e]/80 to-[#25326d]/80 border border-[#546bbf]/40 hover:from-[#3a4ba1] hover:to-[#2b3a7a] text-slate-100 text-[9.5px] font-extrabold flex items-center gap-1 transition-all duration-200 focus:outline-none cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
              title={t.shopTitle}
            >
              <Store className="w-3 h-3 text-amber-400" />
              <span>{t.shopTitle}</span>
            </button>

            {/* Settings Button */}
            <button
              id="btn-mobile-landscape-settings"
              onClick={() => {
                synth.playSelect();
                setIsSettingsOpen(true);
              }}
              className="py-1 px-2.5 rounded-lg bg-gradient-to-b from-[#34448e]/80 to-[#25326d]/80 border border-[#546bbf]/40 hover:from-[#3a4ba1] hover:to-[#2b3a7a] text-slate-100 text-[9.5px] font-extrabold flex items-center gap-1 transition-all duration-200 focus:outline-none cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
              title={t.settingsTitleShort}
            >
              <Settings className="w-3 h-3 text-cyan-400" />
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
              className="py-1 px-3 rounded-lg bg-blue-600 border border-blue-500 hover:bg-blue-500 text-white text-[9.5px] font-extrabold uppercase tracking-wider cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center gap-1 shadow-[0_4px_12px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_18px_rgba(37,99,235,0.5)]"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>{t.resumeLabel}</span>
            </button>
          </div>
        </div>

        {/* B. MAIN CONTENT: 2-COLUMN BENTO-STYLE GRID */}
        <div className="flex-1 min-h-0 grid grid-cols-2 gap-3 pb-0.5">
          {/* LEFT COLUMN: GAME MODE SELECTOR & OPTIONS */}
          <div className="bg-[#303c81]/15 backdrop-blur-sm border border-slate-800/60 rounded-xl p-2.5 flex flex-col justify-between min-h-0 h-full gap-2 shadow-md">
            <div className="flex items-center justify-between shrink-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {t.playModeTitle}
              </span>
            </div>

            {/* Play Mode Buttons */}
            <div className="grid grid-cols-3 gap-1.5 shrink-0 h-7.5">
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
                className={`h-full rounded-lg text-[9.5px] font-black tracking-wide transition-all duration-200 border flex items-center justify-center gap-1.5 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                  memoryMode === "vsBot"
                    ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                    : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850/80 shadow-[0_4px_12px_rgba(0,0,0,0.2)] font-bold"
                }`}
              >
                <Bot className={`w-3.5 h-3.5 ${memoryMode === "vsBot" ? "text-slate-950" : "text-cyan-400"}`} />
                <span>{t.modeBattle}</span>
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
                className={`h-full rounded-lg text-[9.5px] font-black tracking-wide transition-all duration-200 border flex items-center justify-center gap-1.5 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                  memoryMode === "solo"
                    ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                    : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850/80 shadow-[0_4px_12px_rgba(0,0,0,0.2)] font-bold"
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${memoryMode === "solo" ? "text-slate-950" : "text-amber-400"}`} />
                <span>{t.modeClassic}</span>
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
                className={`h-full rounded-lg text-[9.5px] font-black tracking-wide transition-all duration-200 border flex items-center justify-center gap-1.5 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                  memoryMode === "twoPlayers"
                    ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                    : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850/80 shadow-[0_4px_12px_rgba(0,0,0,0.2)] font-bold"
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${memoryMode === "twoPlayers" ? "text-slate-950" : "text-rose-400"}`} />
                <span>{t.modeTwoPlayers}</span>
              </button>
            </div>

            {/* Selected Mode Detail Container */}
            <div className="flex-1 min-h-0 bg-slate-950/40 border border-slate-850 rounded-xl px-2.5 py-2 flex flex-col justify-center gap-1.5">
              {memoryMode === "vsBot" && (
                <div className="flex items-center justify-between w-full h-full gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${currentRank.bg} ${currentRank.border} ${currentRank.shadow} shadow-md shrink-0 flex items-center justify-center`}>
                      {currentRank.badgeType === "shield" ? (
                        <Shield className={`w-4 h-4 ${currentRank.color}`} fill={currentRank.fill} />
                      ) : (
                        <Crown className={`w-4 h-4 ${currentRank.color}`} fill={currentRank.fill} />
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">CURRENT RANK</span>
                      <span className={`font-black text-[10px] uppercase ${currentRank.color} leading-none`}>
                        {t[currentRank.nameKey]}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-wider text-slate-300 px-0.5 leading-none">
                      <span>RANK PROGRESS</span>
                      <span className="font-sans text-cyan-400 font-black text-[8px] leading-none">
                        {rankProgressDisplay}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800/60 relative shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${rankProgressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {memoryMode === "solo" && (
                <div className="flex flex-col gap-1.5 w-full justify-center">
                  {/* Prominent Score Indicators for Landscape Mobile Menu */}
                  <div className="grid grid-cols-2 gap-2 mb-1.5 shrink-0">
                    <div className="flex items-center justify-between p-1 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
                      <span className="font-extrabold text-[8px] uppercase tracking-wider leading-none">{t.totalScore.replace(":", "")}</span>
                      <span className="font-mono font-black text-[9.5px] bg-[#1e2552]/80 px-1.5 py-0.5 rounded border border-[#3f509d]/40 shadow-inner">{currentScore}</span>
                    </div>
                    <div className="flex items-center justify-between p-1 px-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300">
                      <span className="font-extrabold text-[8px] uppercase tracking-wider leading-none">{t.highScore.replace(":", "")}</span>
                      <span className="font-mono font-black text-[9.5px] bg-[#1e2552]/80 px-1.5 py-0.5 rounded border border-[#3f509d]/40 shadow-inner">{currentHighScore}</span>
                    </div>
                  </div>

                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-left leading-none">
                    {t.challengeLevel}
                  </span>
                  <div className="grid grid-cols-6 gap-1 mt-0.5">
                    {([
                      { key: "3x4", label: t.boardSizeLabels["3x4"] },
                      { key: "4x5", label: t.boardSizeLabels["4x5"] },
                      { key: "5x5", label: t.boardSizeLabels["5x5"] },
                      { key: "5x6", label: t.boardSizeLabels["5x6"] },
                      { key: "6x6", label: t.boardSizeLabels["6x6"] },
                      { key: "6x8", label: t.boardSizeLabels["6x8"] }
                    ] as const).map((opt) => {
                      const isSelected = difficulty === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => {
                            synth.playSelect();
                            if (difficulty !== opt.key) {
                              setDifficulty(opt.key);
                              setMemoryMode("solo");
                              generateMemoryGame(opt.key);
                            }
                          }}
                          className={`py-1 rounded-md text-[9px] font-black transition-all duration-200 border flex items-center justify-center cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                            isSelected
                              ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                              : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850 hover:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.18)] font-bold"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {memoryMode === "twoPlayers" && (
                <div className="flex flex-col justify-center w-full h-full gap-1">
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      {/* Player 1 */}
                      <div className="flex items-center justify-between p-1 px-2 rounded-lg bg-slate-950/40 border border-white/5">
                        <div className="flex items-center gap-1.5 text-slate-350">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)] animate-pulse" />
                          <span className="font-extrabold text-[8.5px] uppercase tracking-wider">P1</span>
                        </div>
                        <span className="text-blue-300 font-black text-[10px] font-mono bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-900/30">
                          {winsP1}
                        </span>
                      </div>

                      {/* Player 2 */}
                      <div className="flex items-center justify-between p-1 px-2 rounded-lg bg-slate-950/40 border border-white/5">
                        <div className="flex items-center gap-1.5 text-slate-350">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_rgba(251,113,133,0.8)] animate-pulse" />
                          <span className="font-extrabold text-[8.5px] uppercase tracking-wider">P2</span>
                        </div>
                        <span className="text-rose-300 font-black text-[10px] font-mono bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-900/30">
                          {winsP2}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        synth.playSelect();
                        setShowResetConfirm(true);
                      }}
                      className="py-1 px-2 rounded-lg bg-rose-950/60 border border-rose-900/30 text-rose-300 text-[8.5px] font-black uppercase tracking-wider cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="flex items-center justify-between w-full gap-1">
                    <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest leading-none shrink-0">
                      {t.challengeLevel}
                    </span>
                    <div className="grid grid-cols-4 gap-1 flex-1 max-w-[200px]">
                      {([
                        { key: "5x5", label: t.boardSizeLabels["5x5"] },
                        { key: "5x6", label: t.boardSizeLabels["5x6"] },
                        { key: "6x6", label: t.boardSizeLabels["6x6"] },
                        { key: "6x8", label: t.boardSizeLabels["6x8"] }
                      ] as const).map((opt) => {
                        const isSelected = difficulty === opt.key;
                        return (
                          <button
                            key={opt.key}
                            onClick={() => {
                              synth.playSelect();
                              if (difficulty !== opt.key) {
                                setDifficulty(opt.key);
                                setMemoryMode("twoPlayers");
                                generateMemoryGame(opt.key);
                              }
                            }}
                            className={`py-0.5 rounded text-[8px] font-black transition-all duration-200 border flex items-center justify-center cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                              isSelected
                                ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                                : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850 hover:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.18)] font-bold"
                            }`}
                          >
                            {opt.label}
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
          <div className="bg-[#303c81]/15 backdrop-blur-sm border border-slate-800/60 rounded-xl p-3 flex flex-col gap-1.5 shadow-md h-full min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 font-black text-[10px] text-amber-400 shrink-0 uppercase tracking-widest pb-1 border-b border-slate-800/60">
              {helpConfig.iconName === "SquareStack" ? (
                <SquareStack className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              ) : helpConfig.iconName === "Users" ? (
                <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              ) : helpConfig.iconName === "Bot" ? (
                <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              ) : (
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              )}
              <span className="truncate">{helpConfig.title}</span>
            </div>
            
            <p className="text-[8px] sm:text-[9.5px] leading-snug text-slate-350 whitespace-pre-line overflow-y-auto flex-1 pr-1 scrollbar-thin">
              {helpConfig.rules}
            </p>
          </div>
        </div>
      </div>
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
       <div id="poki-game-frame" key={layoutConfig.name} className={`poki-game-frame ${layoutConfig.gameFrameClass} ${currentTheme.dialogBg} border-2 ${currentTheme.borderAccent || "border-[#5066c7]/45"} rounded-3xl shadow-[0_24px_60px_rgba(8,12,32,0.45),inset_0_2px_4px_rgba(255,255,255,0.12)] flex flex-col sm:flex-row justify-between overflow-hidden relative transition-all duration-300 ease-in-out ${isShaking ? "animate-screen-shake" : ""} ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>

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
          <div className={`flex-col justify-between flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden flex ${
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
                        <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase mb-1 opacity-80">CURRENT RANK</span>
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

                    {/* Larger Rank Progress Bar */}
                    <div id="rank-progress-card" className="flex flex-col gap-2 w-full bg-[#121636]/65 border border-[#2b356c]/35 rounded-xl p-3 shadow-md">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-300 px-0.5">
                        <span>
                          {t.progressLabel}
                        </span>
                        <span className="font-sans text-cyan-400 font-black text-xs sm:text-sm drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]">{rankProgressDisplay}</span>
                      </div>
                      <div className="w-full h-3.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800 relative shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(6,182,212,0.7)]"
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
                      <div className="flex-1 flex items-center justify-between gap-1 border-slate-700/20 portrait:pr-2.5 portrait:border-r landscape:border-b landscape:pb-1.5">
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
                      className="w-full py-2 px-4 rounded-2xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/85 shadow-[0_6px_16px_rgba(234,179,8,0.3),inset_0_1.5px_1px_rgba(255,255,255,0.4)] hover:from-[#ffe066] hover:to-[#fcae00] hover:shadow-[0_10px_22px_rgba(234,179,8,0.4)] active:scale-98 text-xs font-black flex items-center justify-between transition-all duration-200 focus:outline-none cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0"
                    >
                      <span className="text-xs font-black tracking-wide">
                        {memoryMode === "solo" ? "Classic" : memoryMode === "vsBot" ? "Challenge" : "2 Players"}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-950 transition-transform duration-300 ${isPlayModeDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Options Dropdown Menu */}
                    <div
                      className={`absolute left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-1 bg-[#252f67]/95 backdrop-blur-xl border-2 border-[#4c5fbd]/60 rounded-2xl p-1.5 mt-1.5 shadow-[0_12px_32px_rgba(10,14,35,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] ${
                        isPlayModeDropdownOpen
                          ? "max-h-[220px] opacity-100 scale-100 pointer-events-auto"
                          : "max-h-0 opacity-0 scale-95 pointer-events-none"
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
                        <span>Classic</span>
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
                            const valid2pDiff = (difficulty === "5x5" || difficulty === "5x6" || difficulty === "6x6") ? difficulty : "5x5";
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
                        <span>2 Players</span>
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
                        <span>Challenge</span>
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
                        className="w-full py-2 px-4 rounded-2xl bg-gradient-to-b from-[#34448e] to-[#25326d] hover:from-[#3f52aa] hover:to-[#2e3e86] border-2 border-[#546bbf]/50 text-slate-100 text-xs font-black flex items-center justify-between transition-all duration-200 focus:outline-none cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-98 shadow-[0_6px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:shadow-[0_10px_22px_rgba(0,0,0,0.3)]"
                      >
                        <span className="text-xs font-black tracking-wide">
                          {t.boardSizeLabels[difficulty as keyof typeof t.boardSizeLabels] || t.boardSizeLabels["3x4"]}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isBoardSizeDropdownOpen ? "rotate-180 text-cyan-400" : ""}`} />
                      </button>

                      {/* Options Dropdown Menu */}
                      <div
                        id="board-size-dropdown-menu"
                        className={`absolute left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-1 bg-[#252f67]/95 backdrop-blur-xl border-2 border-[#4c5fbd]/60 rounded-2xl p-1.5 mt-1.5 shadow-[0_12px_32px_rgba(10,14,35,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] ${
                          isBoardSizeDropdownOpen
                            ? "max-h-[250px] opacity-100 scale-100 pointer-events-auto"
                            : "max-h-0 opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        {(memoryMode === "twoPlayers"
                          ? [
                              { key: "5x5", label: t.boardSizeLabels["5x5"] },
                              { key: "5x6", label: t.boardSizeLabels["5x6"] },
                              { key: "6x6", label: t.boardSizeLabels["6x6"] },
                              { key: "6x8", label: t.boardSizeLabels["6x8"] }
                            ]
                          : [
                              { key: "3x4", label: t.boardSizeLabels["3x4"] },
                              { key: "4x5", label: t.boardSizeLabels["4x5"] },
                              { key: "5x5", label: t.boardSizeLabels["5x5"] },
                              { key: "5x6", label: t.boardSizeLabels["5x6"] },
                              { key: "6x6", label: t.boardSizeLabels["6x6"] },
                              { key: "6x8", label: t.boardSizeLabels["6x8"] }
                            ]
                        ).map((opt) => {
                          const isSelected = difficulty === opt.key;
                          return (
                            <button
                              key={opt.key}
                              id={`btn-board-size-opt-${opt.key}`}
                              onClick={() => {
                                synth.playSelect();
                                setIsBoardSizeDropdownOpen(false);
                                if (difficulty !== opt.key) {
                                  setPendingMemoryMode(memoryMode);
                                  setPendingDifficulty(opt.key);
                                  setShowMemoryConfirm(true);
                                }
                              }}
                              className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                                  : "bg-transparent text-slate-300 hover:text-slate-100 hover:bg-[#34448e]/60 border border-transparent font-bold"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-slate-950 shadow-sm" />
                              )}
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
                    className="w-full mt-1.5 py-2.5 rounded-2xl border-2 border-[#546bbf]/40 bg-gradient-to-r from-[#2c377a] to-[#394998] hover:from-[#34428f] hover:to-[#4357b1] text-slate-100 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-[0_6px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_22px_rgba(0,0,0,0.3)]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t.reshuffle}
                  </button>
                )}
              </div>
            )}

            {/* How to Play trigger in Landscape Sidebar Footer */}
            <div className="flex flex-col gap-2 w-full mt-auto">
              {/* How to Play trigger */}
              <button
                id="btn-sidebar-how-to-play"
                onClick={() => { synth.playSelect(); setIsHowToPlayOpen(!isHowToPlayOpen); }}
                className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black flex items-center justify-between gap-1 transition-all duration-200 focus:outline-none cursor-pointer w-full -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                  isHowToPlayOpen
                    ? "bg-gradient-to-r from-cyan-500/25 to-cyan-600/15 text-cyan-300 border-cyan-400/50 shadow-[0_6px_16px_rgba(34,211,238,0.25),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    : "bg-gradient-to-b from-[#34448e]/60 to-[#25326d]/60 hover:from-[#3a4ba1]/70 hover:to-[#2b3a7a]/70 border-[#546bbf]/30 text-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.08)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {t.howToPlayTitle}
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isHowToPlayOpen ? "rotate-180 text-cyan-400" : ""}`} />
              </button>

              {/* ⭐ Shop & Settings triggers (Visible only on Desktop and Tablet Landscape) */}
              {(isDesktop || isTabletLandscape) && (
                <>
                  {/* ⭐ Shop trigger */}
                  <button
                    id="btn-sidebar-shop"
                    onClick={() => { synth.playSelect(); setIsShopOpen(true); }}
                    className="flex px-4 py-2.5 rounded-2xl border-2 bg-gradient-to-b from-[#34448e]/60 to-[#25326d]/60 hover:from-[#3a4ba1]/70 hover:to-[#2b3a7a]/70 border-[#546bbf]/30 text-slate-100 text-xs font-black items-center gap-1.5 transition-all duration-200 focus:outline-none cursor-pointer w-full -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.08)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
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
                      className="w-full py-2.5 rounded-2xl bg-gradient-to-b from-[#34448e] to-[#25326d] border border-[#546bbf]/40 hover:from-[#3e51aa] hover:to-[#2e3e86] text-slate-100 flex items-center justify-center gap-1.5 text-xs font-extrabold focus:outline-none cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
                    >
                      <Settings className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t.settingsTitleShort}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Collapsible Instructions Drawer Panel (Only for Portrait Mode) */}
          {isHowToPlayOpen && (
            <div className={`absolute top-full left-0 right-0 z-50 border-b backdrop-blur-md py-2 px-3 animate-fade-in shadow-2xl landscape:hidden ${currentTheme.dialogBg} ${currentTheme.borderAccent}`}>
              <div className={`p-2 rounded-xl flex items-start gap-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] ${currentTheme.cardBg} ${currentTheme.cardBorder} border`}>
                {helpConfig.iconName === "SquareStack" ? (
                  <SquareStack className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${currentTheme.accentText}`} />
                ) : helpConfig.iconName === "Users" ? (
                  <Users className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${currentTheme.accentText}`} />
                ) : helpConfig.iconName === "Bot" ? (
                  <Bot className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${currentTheme.accentText}`} />
                ) : (
                  <Info className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${currentTheme.accentText}`} />
                )}
                <div className={`text-[9px] sm:text-[10px] leading-snug whitespace-pre-line font-medium ${currentTheme.textSecondary}`}>
                  <div className={`font-extrabold mb-0.5 text-[11px] flex items-center gap-1.5 ${currentTheme.textPrimary}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-ping ${currentTheme.accentBg}`}></span>
                    {helpConfig.title}:
                  </div>
                  {helpConfig.rules}
                </div>
              </div>
            </div>
          )}

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
        <main className="flex-1 min-h-0 w-full p-0.5 sm:p-4 flex flex-col justify-center relative bg-slate-950/15 overflow-hidden transition-all duration-300 ease-in-out">
          
          {/* Universal fixed Menu Button and Pause Button for Mobile & Tablet */}
          {layoutConfig.showTabletMenuToggle && (
            <div className="absolute top-3 left-3 z-50 flex flex-col gap-2 items-start pointer-events-auto">
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => {
                  synth.playSelect();
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }}
                className="p-2 rounded-2xl bg-gradient-to-b from-[#34448e] via-[#2a3877] to-[#212b5e] hover:from-[#3f52a8] hover:to-[#283573] border-2 border-[#546bbf]/60 text-slate-100 shadow-[0_6px_16px_rgba(0,0,0,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_22px_rgba(0,0,0,0.45)] -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
                title={isSidebarCollapsed ? "Show Menu" : "Hide Menu"}
              >
                <Menu className="w-4 h-4 text-cyan-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
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
          {isHowToPlayOpen && (
            <div 
              id="how-to-play-backdrop"
              className="hidden landscape:flex absolute inset-0 bg-[#0d101b]/70 backdrop-blur-md z-45 flex-col items-center justify-center p-6 text-center animate-fade-in border border-transparent shadow-2xl"
            >
              <div 
                id="how-to-play-content"
                className={`max-w-md w-full backdrop-blur-xl border-2 rounded-3xl p-6 shadow-[0_20px_50px_rgba(10,15,35,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)] relative ${currentTheme.dialogBg} ${currentTheme.borderAccent}`}
              >
                <button 
                  onClick={() => setIsHowToPlayOpen(false)}
                  className={`absolute top-4 right-4 p-1 rounded-lg transition-colors hover:bg-slate-500/10 ${currentTheme.textSecondary}`}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-full border bg-opacity-10 ${currentTheme.accentText} ${currentTheme.borderAccent}`}>
                    {helpConfig.iconName === "SquareStack" ? (
                      <SquareStack className="w-6 h-6" />
                    ) : helpConfig.iconName === "Users" ? (
                      <Users className="w-6 h-6" />
                    ) : helpConfig.iconName === "Bot" ? (
                      <Bot className="w-6 h-6" />
                    ) : (
                      <Info className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className={`font-black text-sm tracking-tight ${currentTheme.textPrimary}`}>
                    {helpConfig.title}
                  </h3>
                  <p className={`text-[10px] sm:text-xs leading-snug text-left whitespace-pre-line p-3 sm:p-4 rounded-xl sm:rounded-2xl border max-h-[160px] overflow-y-auto w-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] ${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.textSecondary}`}>
                    {helpConfig.rules}
                  </p>
                  <button
                    onClick={() => setIsHowToPlayOpen(false)}
                    className={`mt-2 w-full py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${currentTheme.buttonPrimary}`}
                  >
                    {t.gotItBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- DYNAMIC RENDER OF SELECTED GAME MODE --- */}
          {layoutConfig.allowMobileConfigMenu && isMobileConfigOpen ? (
            /* MOBILE CONFIG MENU SCREEN (FULL SCREEN) */
            <div 
              id="mobile-menu-container" 
              className={`w-full h-full flex flex-col relative z-50 ${currentTheme.dialogBg} text-slate-100 animate-fade-in ${isMobileLandscape ? 'overflow-hidden justify-between p-2' : 'overflow-y-auto p-4'}`}
              style={{
                paddingTop: isMobileLandscape ? '2px' : 'calc(env(safe-area-inset-top, 16px) + 8px)',
                paddingBottom: isMobileLandscape ? 'calc(env(safe-area-inset-bottom, 8px) + 2px)' : 'calc(env(safe-area-inset-bottom, 16px) + 8px)',
                paddingLeft: isMobileLandscape ? 'calc(env(safe-area-inset-left, 12px) + 4px)' : 'calc(env(safe-area-inset-left, 16px) + 8px)',
                paddingRight: isMobileLandscape ? 'calc(env(safe-area-inset-right, 12px) + 4px)' : 'calc(env(safe-area-inset-right, 16px) + 8px)',
              }}
            >
              {/* Header with Title and Close button (Portrait Only) */}
              {!isMobileLandscape && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl text-white">
                      <Brain className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                      Emoji BrainPop Menu
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        synth.playSelect();
                        setIsMobileConfigOpen(false);
                      }}
                      className="p-1.5 rounded-xl bg-slate-850 border border-slate-800 text-slate-400 hover:text-white cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {isMobileLandscape ? (
                renderMobileLandscapeMenu()
              ) : (
                /* SINGLE UNIFIED RESPONSIVE LAYOUT FOR PORTRAIT */
                <div className="flex-1 flex flex-col gap-4 max-w-xl mx-auto w-full">
                  {/* 1. PLAY MODE SELECTOR */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                      {t.playModeLabel}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Classic */}
                      <button
                        onClick={() => {
                          synth.playSelect();
                          if (memoryMode !== "solo") {
                            setDifficulty("3x4");
                            setMemoryMode("solo");
                            generateMemoryGame("3x4");
                          }
                        }}
                        className={`py-3 px-1 rounded-xl text-xs font-extrabold transition-all duration-200 border flex flex-col items-center gap-1 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                          memoryMode === "solo"
                            ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black animate-scale-up"
                            : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850 hover:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.18)] font-bold"
                        }`}
                      >
                        <Zap className={`w-5 h-5 ${memoryMode === "solo" ? "text-slate-950" : "text-amber-400"}`} />
                        <span>Classic</span>
                      </button>

                      {/* Challenge Mode */}
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
                        className={`py-3 px-1 rounded-xl text-xs font-extrabold transition-all duration-200 border flex flex-col items-center gap-1 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                          memoryMode === "vsBot"
                            ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black animate-scale-up"
                            : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850 hover:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.18)] font-bold"
                        }`}
                      >
                        <Bot className={`w-5 h-5 ${memoryMode === "vsBot" ? "text-slate-950" : "text-cyan-400"}`} />
                        <span>{t.modeBattle}</span>
                      </button>

                      {/* 2 Players */}
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
                        className={`py-3 px-1 rounded-xl text-xs font-extrabold transition-all duration-200 border flex flex-col items-center gap-1 cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                          memoryMode === "twoPlayers"
                            ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black animate-scale-up"
                            : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850 hover:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.18)] font-bold"
                        }`}
                      >
                        <Users className={`w-5 h-5 ${memoryMode === "twoPlayers" ? "text-slate-950" : "text-rose-400"}`} />
                        <span>2 Players</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. DYNAMIC INFORMATION SECTION */}
                  <div className="shrink-0 flex flex-col gap-2">
                    {memoryMode === "solo" && (
                      <div className="flex flex-col gap-2.5">
                        {/* Prominent Current Score Badges for Portrait Mobile Menu */}
                        <div className="grid grid-cols-2 gap-3 mb-1">
                          <div className="flex items-center justify-between w-full bg-gradient-to-r from-[#10b981]/15 to-emerald-500/5 border border-emerald-500/35 rounded-xl p-3 shadow-md">
                            <div className="flex items-center gap-2 text-slate-200">
                              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <Award className="w-3.5 h-3.5 animate-pulse" />
                              </div>
                              <span className="font-black text-[10px] uppercase tracking-wider">{t.totalScore.replace(":", "")}</span>
                            </div>
                            <span className="text-emerald-300 font-black text-xs font-mono bg-[#1e2552]/80 px-2.5 py-0.5 rounded-lg border border-[#3f509d]/40 shadow-inner">
                              {currentScore}
                            </span>
                          </div>

                          <div className="flex items-center justify-between w-full bg-gradient-to-r from-[#f59e0b]/15 to-amber-500/5 border border-amber-500/35 rounded-xl p-3 shadow-md">
                            <div className="flex items-center gap-2 text-slate-200">
                              <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                <Trophy className="w-3.5 h-3.5 animate-bounce" />
                              </div>
                              <span className="font-black text-[10px] uppercase tracking-wider">{t.highScore.replace(":", "")}</span>
                            </div>
                            <span className="text-amber-300 font-black text-xs font-mono bg-[#1e2552]/80 px-2.5 py-0.5 rounded-lg border border-[#3f509d]/40 shadow-inner">
                              {currentHighScore}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          {t.challengeLevel}
                        </span>
                        {/* Consistent 3-column layout as requested by user */}
                        <div className="grid grid-cols-3 gap-2">
                          {([
                            { key: "3x4", label: t.boardSizeLabels["3x4"] },
                            { key: "4x5", label: t.boardSizeLabels["4x5"] },
                            { key: "5x5", label: t.boardSizeLabels["5x5"] },
                            { key: "5x6", label: t.boardSizeLabels["5x6"] },
                            { key: "6x6", label: t.boardSizeLabels["6x6"] },
                            { key: "6x8", label: t.boardSizeLabels["6x8"] }
                          ] as const).map((opt) => {
                            const isSelected = difficulty === opt.key;
                            return (
                              <button
                                key={opt.key}
                                onClick={() => {
                                  synth.playSelect();
                                  if (difficulty !== opt.key) {
                                    setDifficulty(opt.key);
                                    setMemoryMode("solo");
                                    generateMemoryGame(opt.key);
                                  }
                                }}
                                className={`py-2 px-1 rounded-xl text-[11px] font-extrabold transition-all duration-200 border flex items-center justify-center cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                                  isSelected
                                    ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black scale-102"
                                    : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850 hover:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.18)] font-bold"
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {memoryMode === "vsBot" && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          {t.battleInfoTitle}
                        </span>
                        <div className="bg-[#303c81]/30 backdrop-blur-sm border border-[#546bbf]/20 p-3 rounded-2xl flex flex-col gap-3 shadow-inner">
                          {/* Rank & Rating Row */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-xl border ${currentRank.bg} ${currentRank.border} ${currentRank.shadow} shadow-md shrink-0`}>
                                {currentRank.badgeType === "shield" ? (
                                  <Shield className={`w-5 h-5 ${currentRank.color}`} fill={currentRank.fill} />
                                ) : (
                                  <Crown className={`w-5 h-5 ${currentRank.color}`} fill={currentRank.fill} />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Rank</span>
                                <span className={`font-black text-sm uppercase ${currentRank.color}`}>
                                  {t[currentRank.nameKey]}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end shrink-0">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
                                {t.ratingLabel}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-300 font-mono font-black text-sm">
                                  {vsBotTrophies}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="flex flex-col gap-1.5 w-full border-t border-slate-800/40 pt-2">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-300">
                              <span>
                                {t.progressLabel}
                              </span>
                              <span className="font-sans text-cyan-400 font-black text-[11px] drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]">
                                {rankProgressDisplay}
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800/60 relative shadow-inner">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(6,182,212,0.7)]"
                                style={{ width: `${rankProgressPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {memoryMode === "twoPlayers" && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                          {t.twoPlayersMatch}
                        </span>
                        <div className="bg-[#303c81]/30 backdrop-blur-sm border border-[#546bbf]/20 p-3 rounded-2xl flex flex-col gap-2 shadow-inner">
                          <div className="grid grid-cols-2 gap-3">
                            {/* Player 1 */}
                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-white/5">
                              <div className="flex items-center gap-1.5 text-slate-350">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)] animate-pulse" />
                                <span className="font-extrabold text-[10px] uppercase tracking-wider">P1</span>
                              </div>
                              <span className="text-blue-300 font-black text-xs font-mono bg-blue-950/40 px-2 py-1 rounded-lg border border-blue-900/30">
                                {winsP1}
                              </span>
                            </div>

                            {/* Player 2 */}
                            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-white/5">
                              <div className="flex items-center gap-1.5 text-slate-350">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)] animate-pulse" />
                                <span className="font-extrabold text-[10px] uppercase tracking-wider">P2</span>
                              </div>
                              <span className="text-rose-300 font-black text-xs font-mono bg-rose-950/40 px-2 py-1 rounded-lg border border-rose-900/30">
                                {winsP2}
                              </span>
                            </div>
                          </div>

                          {/* Board Size Selection for 2 Players */}
                          <div className="flex flex-col gap-1 mt-1 border-t border-white/5 pt-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              {t.challengeLevel}
                            </span>
                            <div className="grid grid-cols-4 gap-1.5">
                              {([
                                { key: "5x5", label: t.boardSizeLabels["5x5"] },
                                { key: "5x6", label: t.boardSizeLabels["5x6"] },
                                { key: "6x6", label: t.boardSizeLabels["6x6"] },
                                { key: "6x8", label: t.boardSizeLabels["6x8"] }
                              ] as const).map((opt) => {
                                const isSelected = difficulty === opt.key;
                                return (
                                  <button
                                    key={opt.key}
                                    onClick={() => {
                                      synth.playSelect();
                                      if (difficulty !== opt.key) {
                                        setDifficulty(opt.key);
                                        setMemoryMode("twoPlayers");
                                        generateMemoryGame(opt.key);
                                      }
                                    }}
                                    className={`py-1 rounded-lg text-[10px] font-black transition-all duration-200 border flex items-center justify-center cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 ${
                                      isSelected
                                        ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                                        : "bg-slate-900/60 text-slate-300 border-slate-850 hover:bg-slate-850 hover:text-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.18)] font-bold"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Reset Wins & Info */}
                        <div className="flex items-center justify-between px-1 mt-1">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {t.localPassAndPlay}
                          </span>
                          <button
                            onClick={() => {
                              synth.playSelect();
                              setShowResetConfirm(true);
                            }}
                            className="py-1 px-3 rounded bg-rose-950/60 border border-rose-900/30 text-rose-300 text-[9px] font-black uppercase tracking-wider cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
                          >
                            {t.resetWinsText}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. HOW TO PLAY COLLAPSIBLE */}
                  <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-3 flex flex-col gap-1.5 shrink-0">
                    <div className="flex items-center gap-2 font-black text-xs text-slate-200">
                      {helpConfig.iconName === "SquareStack" ? (
                        <SquareStack className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : helpConfig.iconName === "Users" ? (
                        <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : helpConfig.iconName === "Bot" ? (
                        <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                      <span>{helpConfig.title}</span>
                    </div>
                    <p className="text-[9px] sm:text-[10.5px] leading-snug text-slate-400 whitespace-pre-line overflow-y-auto max-h-[120px] border-t border-slate-850/60 pt-2">
                      {helpConfig.rules}
                    </p>
                  </div>

                  {/* System quick settings for consistency */}
                  <div className="grid grid-cols-3 gap-2 shrink-0">
                    {/* Sound Toggle */}
                    <button
                      onClick={() => { synth.playSelect(); setSoundOn(!soundOn); }}
                      className="py-2.5 px-2 rounded-xl bg-slate-900/60 border border-slate-850 text-slate-200 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
                      title="Toggle Sound"
                    >
                      {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                      <span>{soundOn ? "Mute" : "Unmute"}</span>
                    </button>

                    {/* Shop Button */}
                    <button
                      onClick={() => { synth.playSelect(); setIsShopOpen(true); }}
                      className="py-2.5 px-2 rounded-xl bg-slate-900/60 border border-slate-850 text-slate-200 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
                    >
                      <Store className="w-4 h-4 text-amber-400" />
                      <span>Shop</span>
                    </button>

                    {/* Settings Button */}
                    <button
                      onClick={() => { synth.playSelect(); setIsSettingsOpen(true); }}
                      className="py-2.5 px-2 rounded-xl bg-slate-900/60 border border-slate-850 text-slate-200 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
                    >
                      <Settings className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                      <span>{t.settingsTitleShort}</span>
                    </button>
                  </div>

                  {/* 4. RESUME / START PLAYING BUTTON */}
                  <button
                    onClick={() => {
                      synth.playSelect();
                      setIsMobileConfigOpen(false);
                      setIsPaused(false); // Resume game when clicked
                    }}
                    className={`w-full py-3 rounded-2xl text-xs font-black shadow-[0_6px_18px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_24px_rgba(37,99,235,0.5)] cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 mt-auto shrink-0 -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 ${currentTheme.buttonPrimary}`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{t.startOrResume}</span>
                  </button>
                </div>
              )}
            </div>
          ) : activeTab === "match" ? (
              
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
                    <div className="relative z-30 flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2 w-full">
                      {/* Left: Setup Menu Button */}
                      <button
                        id="btn-hud-menu-match"
                        onClick={() => {
                          synth.playSelect();
                          setIsMobileConfigOpen(true);
                          setIsPaused(true);
                        }}
                        className="py-1 px-2.5 rounded-2xl bg-gradient-to-b from-[#34448e] via-[#2a3877] to-[#212b5e] hover:from-[#3f52a8] hover:to-[#283573] border-2 border-[#546bbf]/60 text-slate-100 flex items-center gap-1.5 text-[10px] font-black tracking-wide cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_5px_14px_rgba(0,0,0,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                      >
                        <Menu className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                        <span>Menu</span>
                      </button>

                      {/* Center: Live Stats Info (Compact) */}
                      <div className="flex items-center gap-2 text-[10px] font-extrabold font-mono bg-slate-950/40 px-2.5 py-1 rounded-xl border border-white/5 text-cyan-300">
                        <span>{t.stage} {level}</span>
                      </div>

                      {/* Right: Cables Connection, Pause and sound toggle */}
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] font-extrabold font-mono bg-slate-950/40 px-2.5 py-1 rounded-xl border border-white/5 text-slate-200">
                          {t.cables} <span className="text-cyan-400">{connections.length}/3</span>
                        </div>

                        {/* Pause Toggle */}
                        <button
                          id="btn-hud-pause-match"
                          onClick={() => {
                            if (isPaused) {
                              synth.playResume();
                            } else {
                              synth.playPause();
                            }
                            setIsPaused(prev => !prev);
                          }}
                          className="p-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-slate-200 cursor-pointer active:scale-95 transition-all"
                          title={isPaused ? t.resumeBtn : t.pauseBtn}
                        >
                          {isPaused ? <Play className="w-3 h-3 fill-current text-emerald-400" /> : <Pause className="w-3 h-3 fill-current text-amber-400" />}
                        </button>

                        {/* Sound Toggle */}
                        <button
                          onClick={() => { synth.playSelect(); setSoundOn(!soundOn); }}
                          className="p-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-slate-200 cursor-pointer active:scale-95 transition-all"
                        >
                          {soundOn ? <Volume2 className="w-3 h-3 text-cyan-400" /> : <VolumeX className="w-3 h-3 text-rose-400" />}
                        </button>
                      </div>
                    </div>
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
                    className="absolute inset-0 bg-[#0a0d18]/85 backdrop-blur-md z-50 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none animate-fade-in"
                  >
                    <div className="bg-gradient-to-br from-[#1d2547]/95 via-[#151a36]/95 to-[#0e1226]/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_20px_rgba(245,158,11,0.15)] flex flex-col items-center gap-4 max-w-xs sm:max-w-sm w-full">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
                        <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400/80" />
                      </div>
                      
                      <div>
                        <h3 className="font-black text-amber-100 text-base sm:text-xl tracking-wide uppercase">
                          {t.gamePaused}
                        </h3>
                        <p className="text-slate-300/90 text-xs sm:text-sm mt-1 max-w-[260px] mx-auto leading-relaxed">
                          {t.gamePausedDesc}
                        </p>
                      </div>

                      <div className="w-full flex flex-col gap-2 pt-1">
                        <button
                          id="btn-paused-resume-match"
                          onClick={() => {
                            synth.playResume();
                            setIsPaused(false);
                          }}
                          className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
                        >
                          <Play className="w-4 h-4 fill-slate-950" />
                          <span>{t.resumeBtn}</span>
                        </button>

                        <button
                          id="btn-paused-restart-match"
                          onClick={() => {
                            synth.playSelect();
                            handleReplayOriginal();
                            setIsPaused(false);
                          }}
                          className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 active:scale-95 text-[11px] sm:text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
                      by hungcuong
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
                      className="w-full py-2 px-3.5 rounded-xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] hover:from-[#ffe066] hover:to-[#fcae00] hover:shadow-[0_8px_18px_rgba(234,179,8,0.4)] text-xs font-black flex items-center justify-between transition-all duration-200 focus:outline-none cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0"
                    >
                      <span className="text-xs font-black tracking-wide">
                        {memoryMode === "solo" ? "Classic" : memoryMode === "vsBot" ? "Challenge" : "2 Players"}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-950 transition-transform duration-300 ${isPlayModeDropdownOpenMobile ? "rotate-180" : ""}`} />
                    </button>

                    {/* Options Dropdown Menu */}
                    <div
                      className={`absolute left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-1 bg-slate-950 border border-slate-850 rounded-xl p-1.5 mt-1 shadow-2xl ${
                        isPlayModeDropdownOpenMobile
                          ? "max-h-[220px] opacity-100 scale-100 pointer-events-auto"
                          : "max-h-0 opacity-0 scale-95 pointer-events-none"
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
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          memoryMode === "solo"
                            ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
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
                            const valid2pDiff = (difficulty === "5x5" || difficulty === "5x6" || difficulty === "6x6") ? difficulty : "5x5";
                            setPendingMemoryMode("twoPlayers");
                            setPendingDifficulty(valid2pDiff);
                            setShowMemoryConfirm(true);
                          }
                        }}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          memoryMode === "twoPlayers"
                            ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
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
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          memoryMode === "vsBot"
                            ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
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
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-750 text-slate-200 text-xs font-bold flex items-center justify-between transition-all duration-200 focus:outline-none cursor-pointer shadow-md"
                      >
                        <span className="text-xs font-black tracking-wide">
                          {t.boardSizeLabels[difficulty as keyof typeof t.boardSizeLabels] || t.boardSizeLabels["3x4"]}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isBoardSizeDropdownOpenMobile ? "rotate-180 text-cyan-400" : ""}`} />
                      </button>

                      {/* Options Dropdown Menu */}
                      <div
                        className={`absolute left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-1 bg-slate-950 border border-slate-850 rounded-xl p-1.5 mt-1 shadow-2xl ${
                          isBoardSizeDropdownOpenMobile
                            ? "max-h-[250px] opacity-100 scale-100 pointer-events-auto"
                            : "max-h-0 opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        {(memoryMode === "twoPlayers"
                          ? [
                              { key: "5x5", label: t.boardSizeLabels["5x5"] },
                              { key: "5x6", label: t.boardSizeLabels["5x6"] },
                              { key: "6x6", label: t.boardSizeLabels["6x6"] },
                              { key: "6x8", label: t.boardSizeLabels["6x8"] }
                            ]
                          : [
                              { key: "3x4", label: t.boardSizeLabels["3x4"] },
                              { key: "4x5", label: t.boardSizeLabels["4x5"] },
                              { key: "5x5", label: t.boardSizeLabels["5x5"] },
                              { key: "5x6", label: t.boardSizeLabels["5x6"] },
                              { key: "6x6", label: t.boardSizeLabels["6x6"] },
                              { key: "6x8", label: t.boardSizeLabels["6x8"] }
                            ]
                        ).map((opt) => {
                          const isSelected = difficulty === opt.key;
                          return (
                            <button
                              key={opt.key}
                              id={`btn-board-size-mobile-opt-${opt.key}`}
                              onClick={() => {
                                synth.playSelect();
                                setIsBoardSizeDropdownOpenMobile(false);
                                if (difficulty !== opt.key) {
                                  setPendingMemoryMode(memoryMode);
                                  setPendingDifficulty(opt.key);
                                  setShowMemoryConfirm(true);
                                }
                              }}
                              className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] font-black"
                                  : "bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-900/40 border border-transparent font-bold"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-slate-950 shadow-sm" />
                              )}
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
                    <div className={`flex items-center gap-1 bg-slate-950 border px-2 py-0.5 rounded-md ${memoryTimeLeft < 0 ? "border-rose-900/50" : "border-slate-850"}`}>
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
            <div 
              id="memory-board-card"
              className={`${layoutConfig.memoryBoardCardClass} ${currentTheme.boardBorder || ''} transition-all duration-500 ease-in-out relative overflow-hidden`}
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

              {/* UNIFIED HUD (MOBILE ONLY) */}
              {layoutConfig.showHUD && (
                <div className="relative z-30 flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2 landscape:pb-1 landscape:mb-1.5 w-full shrink-0">
                  {/* Left: Setup Menu Button */}
                  <button
                    id="btn-hud-menu"
                    onClick={() => {
                      synth.playSelect();
                      setIsMobileConfigOpen(true);
                      setIsPaused(true);
                    }}
                    className="py-1 px-2.5 rounded-2xl bg-gradient-to-b from-[#34448e] via-[#2a3877] to-[#212b5e] hover:from-[#3f52a8] hover:to-[#283573] border-2 border-[#546bbf]/60 text-slate-100 flex items-center gap-1.5 text-[10px] font-black tracking-wide cursor-pointer -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_5px_14px_rgba(0,0,0,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                  >
                    <Menu className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                    <span>Menu</span>
                  </button>

                  {/* Center: Live Stats Info (Compact) */}
                  <div className="flex items-center gap-2 text-[10px] font-extrabold font-mono bg-slate-950/40 px-2.5 py-1 rounded-xl border border-white/5">
                    {activeTab === "memory" ? (
                      memoryMode === "vsBot" ? (
                        <div className="flex items-center gap-1 text-amber-300">
                          <Trophy className="w-3 h-3 text-amber-400" />
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
                  <div className="flex items-center gap-1">
                    {/* Pause & Hint Buttons for Solo mode */}
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
                            setIsPaused(prev => !prev);
                          }}
                          className="p-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-slate-200 cursor-pointer active:scale-95 transition-all"
                          title={isPaused ? t.resumeBtn : t.pauseBtn}
                        >
                          {isPaused ? <Play className="w-3 h-3 fill-current text-emerald-400" /> : <Pause className="w-3 h-3 fill-current text-amber-400" />}
                        </button>

                        <button
                          id="btn-hud-hint"
                          onClick={handleOpenHintModal}
                          disabled={memoryBusy}
                          className={`py-1 px-2.5 rounded-2xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] hover:from-[#ffe066] hover:to-[#fcae00] text-[#132257] border-2 border-amber-300/85 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.45)] hover:shadow-[0_8px_18px_rgba(234,179,8,0.45)] -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            hintsCount > 0 ? "animate-pulse" : "opacity-90"
                          }`}
                          title={t.hintLabel}
                        >
                          <Lightbulb className="w-3.5 h-3.5 fill-[#132257] text-[#132257] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded text-center leading-none bg-[#132257] text-amber-300 shadow-sm">
                            {hintsCount > 0 ? hintsCount : "+"}
                          </span>
                        </button>
                      </>
                    )}

                    {/* Sound Toggle */}
                    <button
                      onClick={() => { synth.playSelect(); setSoundOn(!soundOn); }}
                      className="p-1.5 rounded-lg bg-slate-950/80 border border-white/10 text-slate-200 cursor-pointer active:scale-95 transition-all"
                    >
                      {soundOn ? <Volume2 className="w-3 h-3 text-cyan-400" /> : <VolumeX className="w-3 h-3 text-rose-400" />}
                    </button>
                  </div>
                </div>
              )}



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
              {isHintModalOpen && memoryMode === "solo" && !memoryFinished && (
                <div 
                  id="memory-hint-modal-overlay" 
                  className="absolute inset-0 bg-[#0a0d18]/85 backdrop-blur-md z-50 rounded-2xl sm:rounded-3xl flex items-center justify-center p-4 select-none animate-fade-in"
                >
                  <div className="bg-gradient-to-br from-[#1d2547]/95 via-[#151a36]/95 to-[#0e1226]/95 backdrop-blur-xl border-2 border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_25px_rgba(245,158,11,0.2)] flex flex-col items-center gap-4 max-w-xs w-full relative animate-scale-up">
                    {/* Close button */}
                    <button
                      id="btn-close-hint-modal"
                      onClick={() => {
                        synth.playSelect();
                        setIsHintModalOpen(false);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
                      title={t.settingsClose}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Header / Emblem */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
                        <Lightbulb className="w-6 h-6 fill-slate-950 text-slate-950" />
                      </div>
                      <h3 className="font-black text-slate-100 text-lg tracking-wide">
                        {t.hintLabel}
                      </h3>
                      <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-inner">
                        <span className="text-slate-300">{t.availableText}</span>
                        <span className="font-black text-amber-400 text-sm">{hintsCount}</span>
                      </div>
                    </div>

                    {/* Options Buttons */}
                    <div className="w-full flex flex-col gap-2.5 mt-1">
                      {/* 1. Use Hint */}
                      <button
                        id="btn-modal-use-hint"
                        onClick={() => {
                          if (hintsCount > 0 && !memoryBusy) {
                            setIsHintModalOpen(false);
                            executeHint();
                          }
                        }}
                        disabled={hintsCount <= 0 || memoryBusy}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                          hintsCount > 0 && !memoryBusy
                            ? "bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-[#132257] border-2 border-amber-300/90 shadow-[0_4px_12px_rgba(234,179,8,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.4)] hover:from-[#ffe066] hover:to-[#fcae00] -translate-y-[1px] active:translate-y-0"
                            : "bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <Zap className={`w-4 h-4 ${hintsCount > 0 ? "fill-[#132257] text-[#132257]" : "text-slate-500"}`} />
                        <span>{t.useHintText(hintsCount)}</span>
                      </button>

                      {/* 2. Watch Ad to get +1 Hint */}
                      <button
                        id="btn-modal-watch-ad-hint"
                        onClick={() => {
                          synth.playSelect();
                          handleRewardedAd(() => {
                            updateHintsCount(prev => prev + 1);
                          });
                        }}
                        className="w-full py-3 px-4 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 border-2 border-emerald-300/80 shadow-[0_4px_12px_rgba(16,185,129,0.3),inset_0_1.5px_1px_rgba(255,255,255,0.4)] -translate-y-[1px] active:translate-y-0"
                      >
                        <Video className="w-4 h-4 fill-slate-950 text-slate-950" />
                        <span>{t.watchAdGetHint}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pause Overlay for Memory Mode */}
              {isPaused && (
                <div 
                  id="memory-paused-overlay" 
                  className="absolute inset-0 bg-[#0a0d18]/85 backdrop-blur-md z-50 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none animate-fade-in"
                >
                  <div className="bg-gradient-to-br from-[#1d2547]/95 via-[#151a36]/95 to-[#0e1226]/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_20px_rgba(245,158,11,0.15)] flex flex-col items-center gap-4 max-w-xs sm:max-w-sm w-full">
                    {/* Glowing Pause Emblem */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
                      <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400/80" />
                    </div>
                    
                    <div>
                      <h3 className="font-black text-amber-100 text-base sm:text-xl tracking-wide uppercase">
                        {t.gamePaused}
                      </h3>
                      <p className="text-slate-300/90 text-xs sm:text-sm mt-1 max-w-[260px] mx-auto leading-relaxed">
                        {t.gamePausedDesc}
                      </p>
                    </div>

                    <div className="w-full flex flex-col gap-2 pt-1">
                      {/* Manual Resume Button */}
                      <button
                        id="btn-paused-resume"
                        onClick={() => {
                          synth.playResume();
                          setIsPaused(false);
                        }}
                        className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 shadow-[0_6px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_10px_25px_rgba(245,158,11,0.4)]"
                      >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>{t.resumeBtn}</span>
                      </button>

                      {/* Restart Game Option */}
                      <button
                        id="btn-paused-restart"
                        onClick={() => {
                          synth.playSelect();
                          generateMemoryGame(difficulty);
                          setIsPaused(false);
                        }}
                        className="w-full py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 active:scale-95 text-[11px] sm:text-xs font-extrabold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 -translate-y-[2px] hover:-translate-y-1 active:translate-y-0 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)]"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t.newGameText}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
              {activeCombo && (
                <div 
                  key={activeCombo.id}
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-combo flex flex-col items-center justify-center px-6 py-3.5 rounded-2xl border-2 shadow-[0_12px_36px_rgba(0,0,0,0.5)] ${activeCombo.glow}`}
                >
                  <span className="text-[10px] font-black tracking-widest uppercase opacity-85">{activeCombo.label}</span>
                  <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r ${activeCombo.text} bg-clip-text text-transparent font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}>
                    Combo x{activeCombo.count}
                  </span>
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
                {(memoryMode === "twoPlayers" || memoryMode === "vsBot") && (
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
                    {(() => {
                      const targetPairsToWin = difficulty === "5x5" ? 7 : difficulty === "6x6" ? 10 : 8;
                      return (
                        <div className="flex items-center justify-between gap-1 sm:gap-3 md:gap-4 py-0.5 sm:py-1.5 md:py-2 landscape:py-0.5 landscape:gap-1.5 w-full min-w-0">
                          {/* Player 1 Box (Blue Theme) */}
                          <div className={`flex-1 min-w-0 p-1 sm:p-2 md:p-2.5 landscape:p-1 landscape:px-2 rounded-lg sm:rounded-xl border transition-all duration-300 flex flex-col gap-0.5 sm:gap-1 landscape:gap-0.5 shadow-md ${
                            (memoryMode !== "vsBot" && p1Score >= targetPairsToWin)
                              ? "bg-gradient-to-br from-blue-600 to-indigo-800 text-white border-blue-200 scale-[1.03] animate-winning-blue z-10 border-2 ring-2 ring-blue-500/30"
                              : (memoryMode !== "vsBot" && p2Score >= targetPairsToWin)
                                ? "bg-blue-950/90 text-blue-200/50 border-blue-900/20 scale-95 opacity-30 border z-0 filter grayscale-[40%]"
                                : activePlayer === 1
                                  ? "bg-gradient-to-br from-blue-600 to-indigo-800 text-white border-blue-300 scale-[1.02] shadow-[0_0_12px_rgba(59,130,246,0.6)] brightness-110 border-2 z-10"
                                  : "bg-blue-950/90 text-blue-200/80 border-blue-900/40 scale-100 opacity-60 border z-0"
                          }`}>
                            <div className="flex flex-col landscape:flex-row items-center justify-center landscape:justify-between min-w-0 w-full landscape:gap-1">
                              <div className="flex items-center gap-0.5 sm:gap-1.5 justify-center landscape:justify-start min-w-0">
                                <div className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 landscape:w-3 landscape:h-3 rounded-full flex items-center justify-center shrink-0 ${
                                  activePlayer === 1 
                                    ? "bg-white text-blue-600 animate-pulse" 
                                    : "bg-blue-900 text-blue-200"
                                }`}>
                                  <span className="text-[6px] sm:text-[9px] landscape:text-[7px] font-black">1</span>
                                </div>
                                <span className="text-[8px] sm:text-[10px] md:text-[11px] landscape:text-[9px] font-black uppercase tracking-wider truncate">
                                  {memoryMode === "vsBot" ? t.labelYou : t.labelP1}
                                </span>
                              </div>
                              <div className="mt-0.5 sm:mt-0.5 landscape:mt-0 flex items-baseline gap-0.5 sm:gap-1 justify-center landscape:justify-end shrink-0">
                                <span className="text-[7px] sm:text-[8px] uppercase font-black tracking-wider opacity-70 truncate hidden landscape:inline sm:inline">Score:</span>
                                <span className="text-xs sm:text-lg md:text-2xl landscape:text-xs landscape:sm:text-sm font-black font-mono leading-none">{p1Score}</span>
                              </div>
                            </div>

                            {/* Score Progress Bar */}
                            <div className="flex gap-0.5 sm:gap-1 w-full transition-all duration-300 mt-0.5">
                              {[...Array(targetPairsToWin)].map((_, i) => {
                                const isFilled = p1Score > i;
                                return (
                                  <div key={i} className="flex-1 h-0.5 sm:h-1 landscape:h-0.5 rounded-full overflow-hidden bg-white/20 border border-white/5 relative">
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
                            <div className={`px-1 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[6px] sm:text-[8px] md:text-[9px] landscape:text-[7px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5 sm:gap-1 transition-colors ${
                              activePlayer === 1 
                                ? "bg-blue-100 text-blue-600 border border-blue-200" 
                                : "bg-rose-100 text-rose-600 border border-rose-200"
                            }`}>
                              <span className={`w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full ${activePlayer === 1 ? "bg-blue-600" : "bg-rose-600"} animate-ping`}></span>
                              <span className="truncate max-w-[38px] sm:max-w-none">
                                {memoryMode === "vsBot" 
                                  ? (activePlayer === 1 ? t.yourTurn : t.botTurnText(botUsername)) 
                                  : (activePlayer === 1 ? t.p1Turn : t.p2Turn)}
                              </span>
                            </div>
                            {consecutiveMatches > 0 && (
                              <span className="text-[6px] sm:text-[7px] font-extrabold text-amber-600 mt-0.5 uppercase animate-pulse">
                                Streak: {consecutiveMatches}/3
                              </span>
                            )}
                          </div>

                          {/* Player 2 Box (Red Theme) */}
                          <div className={`flex-1 min-w-0 p-1 sm:p-2 md:p-2.5 landscape:p-1 landscape:px-2 rounded-lg sm:rounded-xl border transition-all duration-300 flex flex-col gap-0.5 sm:gap-1 landscape:gap-0.5 shadow-md ${
                            (memoryMode !== "vsBot" && p2Score >= targetPairsToWin)
                              ? "bg-gradient-to-br from-rose-600 to-red-800 text-white border-rose-200 scale-[1.03] animate-winning-red z-10 border-2 ring-2 ring-rose-500/30"
                              : (memoryMode !== "vsBot" && p1Score >= targetPairsToWin)
                                ? "bg-rose-950/90 text-rose-200/50 border-rose-900/20 scale-95 opacity-30 border z-0 filter grayscale-[40%]"
                                : activePlayer === 2
                                  ? "bg-gradient-to-br from-rose-600 to-red-800 text-white border-rose-300 scale-[1.02] shadow-[0_0_12px_rgba(244,63,94,0.6)] brightness-110 border-2 z-10"
                                  : "bg-rose-950/90 text-rose-200/80 border-rose-900/40 scale-100 opacity-60 border z-0"
                          }`}>
                            <div className="flex flex-col landscape:flex-row items-center justify-center landscape:justify-between min-w-0 w-full landscape:gap-1">
                              <div className="flex items-center gap-0.5 sm:gap-1.5 justify-center landscape:justify-start min-w-0">
                                <div className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 landscape:w-3 landscape:h-3 rounded-full flex items-center justify-center shrink-0 ${
                                  activePlayer === 2 
                                    ? "bg-white text-rose-600 animate-pulse" 
                                    : "bg-rose-900 text-rose-200"
                                }`}>
                                  <span className="text-[6px] sm:text-[9px] landscape:text-[7px] font-black">
                                    {memoryMode === "vsBot" ? "🤖" : "2"}
                                  </span>
                                </div>
                                <span className="text-[8px] sm:text-[10px] md:text-[11px] landscape:text-[9px] font-black uppercase tracking-wider truncate">
                                  {memoryMode === "vsBot" ? `${botUsername} (Lv. ${currentBotDifficulty})` : "Player 2"}
                                </span>
                              </div>
                              <div className="mt-0.5 sm:mt-0.5 landscape:mt-0 flex items-baseline gap-0.5 sm:gap-1 justify-center landscape:justify-end shrink-0">
                                <span className="text-[7px] sm:text-[8px] uppercase font-black tracking-wider opacity-70 truncate hidden landscape:inline sm:inline">Score:</span>
                                <span className="text-xs sm:text-lg md:text-2xl landscape:text-xs landscape:sm:text-sm font-black font-mono leading-none">{p2Score}</span>
                              </div>
                            </div>

                            {/* Score Progress Bar */}
                            <div className="flex gap-0.5 sm:gap-1 w-full transition-all duration-300 mt-0.5">
                              {[...Array(targetPairsToWin)].map((_, i) => {
                                const isFilled = p2Score > i;
                                return (
                                  <div key={i} className="flex-1 h-0.5 sm:h-1 landscape:h-0.5 rounded-full overflow-hidden bg-white/20 border border-white/5 relative">
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
                      );
                    })()}
                  </div>
                )}
                
                {/* Dynamically Centered Grid with Responsive Card Dimensions */}
                <div ref={gridWrapperRef} className="flex-1 min-h-0 w-full h-full flex items-center justify-center overflow-hidden">
                  <div 
                    className={`poki-memory-grid relative z-10 transition-all duration-300 ease-out ${isDemoRunning ? "pointer-events-none select-none" : ""}`}
                    style={{
                      width: `${memoryCardSizing.gridWidth}px`,
                      height: `${memoryCardSizing.gridHeight}px`,
                      gap: `${memoryCardSizing.gap}px`,
                      gridTemplateColumns: `repeat(${memoryCardSizing.cols}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${memoryCardSizing.rows}, minmax(0, 1fr))`,
                      '--card-size': `${memoryCardSizing.cardSize}px`,
                    } as React.CSSProperties}
                  >
                    {memoryCards.map((emoji, index) => {
                      if (memoryCardSizing.hideLockedCard && emoji === "BLOCKED") {
                        return null;
                      }

                      const isMatched = memoryMatched.includes(index);
                      const isFlipped = memoryFlipped.includes(index);
                      const isMismatch = memoryFlipped.length === 3 && memoryFlipped.includes(index);
                      const isMatchedByP1 = memoryMode === "solo" ? isMatched : matchedByP1.includes(index);

                      return (
                        <MemoryCard
                          key={`mem-card-${matchSessionId}-${index}`}
                          emoji={emoji}
                          index={index}
                          isRevealed={isFlipped}
                          isMatched={isMatched}
                          isMismatch={isMismatch}
                          isMatchedByP1={isMatchedByP1}
                          onClick={() => handleMemoryCardClick(index)}
                          equippedCardBackId={equippedCardBackId}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* THE PORTAL/OVERLAY FOR THE MEMORY GAME RESULT - CENTERED IN THE PLAY AREA */}
              {memoryFinished && (() => {
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
                    <div 
                      id="victory-celebration-panel" 
                      className={`absolute inset-0 ${currentTheme.dialogBg} border-2 backdrop-blur-xl z-[100] rounded-3xl flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden shadow-[0_16px_40px_rgba(10,14,35,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] transition-all duration-300 ${
                        fadeCelebrationOut ? "animate-fade-out-celebration" : "animate-fade-in-backdrop"
                      }`}
                    >
                      {/* Radial soft screen glow */}
                      <div className="absolute inset-0 victory-screen-glow animate-pulse-glow pointer-events-none z-0" />

                      {/* Colorful Emitter Fireworks around edges of the screen */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                        {[...Array(8)].map((_, i) => {
                          const left = [10, 85, 15, 80, 20, 75, 45, 55][i];
                          const top = [15, 20, 75, 80, 45, 50, 10, 85][i];
                          const delay = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4][i] % 1.5;
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
                      <div className="relative z-20 flex flex-col items-center justify-center animate-pop-bounce-float">
                        <div className="text-6xl sm:text-8xl mb-4 animate-bounce filter drop-shadow-[0_4px_15px_rgba(234,179,8,0.6)]">
                          🏆
                        </div>
                        
                        {memoryMode === "twoPlayers" || memoryMode === "vsBot" ? (
                          <>
                            <h1 className="font-sans font-black text-4xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-[#fff2a3] via-[#ffcf40] to-[#e69d00] drop-shadow-[0_0_25px_rgba(245,158,11,0.7)] tracking-wider">
                              {isDraw 
                                ? t.drawText
                                : memoryMode === "vsBot"
                                  ? (p1Winner ? t.youWinText : t.botWinsText)
                                  : (p1Winner ? t.p1WinsText : t.p2WinsText)}
                            </h1>
                            
                            <p className={`text-[11px] sm:text-xs font-black tracking-widest uppercase mt-4 animate-pulse transition-colors duration-300 ${currentTheme.accentText}`}>
                              {isDraw ? t.closeMatchText : t.fantasticVictory}
                            </p>
                          </>
                        ) : (
                          <>
                            <h1 className="font-sans font-black text-4xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-[#fff2a3] via-[#ffcf40] to-[#e69d00] drop-shadow-[0_0_25px_rgba(245,158,11,0.7)] tracking-wider">
                              {celebrationText}
                            </h1>
                            
                            <p className={`text-[11px] sm:text-xs font-black tracking-widest uppercase mt-4 animate-pulse transition-colors duration-300 ${currentTheme.accentText}`}>
                              {t.levelCompleted}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }

                if (!showScoreSummary) {
                  // Fallback during animation transitions to prevent flash
                  return null;
                }

                if (memoryMode === "twoPlayers" || memoryMode === "vsBot") {
                  const p1Winner = p1Score > p2Score;
                  const p2Winner = p2Score > p1Score;
                  const isDraw = p1Score === p2Score;

                  return (
                    <div id="memory-finished-panel-2p" className={`absolute inset-0 ${currentTheme.dialogBg} border-2 backdrop-blur-xl z-40 rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-score-summary-fade-in shadow-[0_16px_40px_rgba(10,14,35,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] overflow-y-auto transition-all duration-300`}>
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

                      <div className="flex flex-col items-center gap-4 max-w-sm w-full relative z-10">
                        {/* Trophy or Draw Icon */}
                        <div className={`p-4 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] ${
                          isDraw
                            ? "bg-amber-500/20 border-2 border-amber-400/50 text-amber-300"
                            : p1Winner
                              ? "bg-blue-500/20 border-2 border-blue-400/50 text-blue-300"
                              : "bg-rose-500/20 border-2 border-rose-400/50 text-rose-300"
                        }`}>
                          <Trophy className="w-10 h-10 animate-bounce" />
                        </div>

                        {/* Winner Announcement */}
                        <div>
                          {isDraw ? (
                            <h3 className="font-extrabold text-amber-300 text-xl sm:text-2xl tracking-tight leading-tight uppercase animate-pulse">
                              {t.drawTitleShort}
                            </h3>
                          ) : p1Winner ? (
                            <h3 className="font-black text-transparent bg-clip-text bg-gradient-to-b from-[#bfe2ff] to-[#3b82f6] text-xl sm:text-2xl tracking-tight leading-tight uppercase drop-shadow-[0_2px_10px_rgba(59,130,246,0.5)]">
                              {memoryMode === "vsBot" ? t.youWinShort : t.p1WinsShort}
                            </h3>
                          ) : (
                            <h3 className="font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ffccd3] to-[#f43f5e] text-xl sm:text-2xl tracking-tight leading-tight uppercase drop-shadow-[0_2px_10px_rgba(244,63,94,0.5)]">
                              {memoryMode === "vsBot" ? t.botWinsShort : t.p2WinsShort}
                            </h3>
                          )}
                          <p className={`text-xs ${currentTheme.textSecondary} mt-1 font-bold tracking-wider uppercase transition-colors duration-300`}>
                            {isDraw ? t.bothPlayedBrilliantly : t.fantasticVictoryShort}
                          </p>
                        </div>

                        {/* FINAL SCOREBOARD BREAKDOWN */}
                        <div className={`w-full ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-2xl p-4 flex flex-col gap-3 shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all duration-300`}>
                          <div className={`text-[10px] ${currentTheme.textSecondary} font-extrabold tracking-wider uppercase border-b ${currentTheme.cardBorder} pb-2 transition-colors duration-300`}>
                            {t.finalScoresTitle}
                          </div>
                          <div className="flex items-center justify-around gap-4">
                            {/* Player 1 final box */}
                            <div className={`flex-1 p-2.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                              p1Winner 
                                ? "bg-blue-500/25 border-blue-400/50 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.3)]" 
                                : isDraw 
                                  ? "bg-amber-500/10 border-amber-400/30 text-amber-200"
                                  : `opacity-60 ${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.textMuted}`
                            }`}>
                              <span className="text-[10px] font-black uppercase tracking-wide">
                                {memoryMode === "vsBot" ? t.labelYou : t.labelP1}
                              </span>
                              <span className={`font-mono font-black text-xl mt-1 ${p1Winner ? "text-blue-200" : isDraw ? "text-amber-200" : currentTheme.textPrimary}`}>{p1Score}</span>
                              {p1Winner && (
                                <span className="text-[8px] font-black uppercase text-blue-400 mt-0.5 tracking-wider">
                                  {t.labelWinner}
                                </span>
                              )}
                              {isDraw && (
                                <span className="text-[8px] font-black uppercase text-amber-400 mt-0.5 tracking-wider">
                                  {t.labelDraw}
                                </span>
                              )}
                            </div>

                            {/* Player 2 final box */}
                            <div className={`flex-1 p-2.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                              p2Winner 
                                ? "bg-rose-500/25 border-rose-400/50 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]" 
                                : isDraw 
                                  ? "bg-amber-500/10 border-amber-400/30 text-amber-200"
                                  : `opacity-60 ${currentTheme.cardBg} ${currentTheme.cardBorder} ${currentTheme.textMuted}`
                            }`}>
                              <span className="text-[10px] font-black uppercase tracking-wide">
                                {memoryMode === "vsBot" ? "BOT" : t.labelP2}
                              </span>
                              <span className={`font-mono font-black text-xl mt-1 ${p2Winner ? "text-rose-200" : isDraw ? "text-amber-200" : currentTheme.textPrimary}`}>{p2Score}</span>
                              {p2Winner && (
                                <span className="text-[8px] font-black uppercase text-rose-400 mt-0.5 tracking-wider">
                                  {t.labelWinner}
                                </span>
                              )}
                              {isDraw && (
                                <span className="text-[8px] font-black uppercase text-amber-400 mt-0.5 tracking-wider">
                                  {t.labelDraw}
                                </span>
                              )}
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
                              <div className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.2)] mt-1 transition-all duration-300 ${currentTheme.cardBg} border ${currentTheme.cardBorder}`}>
                                <div className="flex items-center gap-2">
                                  <Trophy className={`w-5 h-5 ${isWin ? "text-amber-400 animate-pulse" : isLoss ? "text-rose-400" : "text-slate-500"}`} />
                                  <span className={`font-mono font-black text-lg transition-colors duration-300 ${
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
                                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                    <Sparkles className="w-3 h-3 text-amber-300" />
                                    {isWin ? (t.trophyRewardApplied2x || "×2 Trophy Reward Applied!") : isLoss ? (t.lossProtectionApplied50 || "50% Loss Protection Applied!") : (t.bonusTrophyGranted || "Bonus Trophy Granted!")}
                                  </span>
                                )}
                              </div>
                            );
                          })()}

                          <div className={`flex justify-between items-center text-xs ${currentTheme.textSecondary} font-bold px-1 pt-1.5 border-t ${currentTheme.cardBorder} transition-colors duration-300`}>
                            <span>{t.totalMovesText}</span>
                            <span className={`font-mono font-black text-sm transition-colors duration-300 ${currentTheme.accentText}`}>{memoryMoves}</span>
                          </div>
                        </div>

                        {/* Play Again and Back to Menu Buttons */}
                        {memoryMode === "vsBot" ? (
                          <div className="flex flex-col items-center gap-2 w-full max-w-[280px]">
                            {/* WATCH AD BUTTON FOR CHALLENGE MODE */}
                            {!challengeAdWatched ? (
                              <button
                                id="btn-watch-ad-challenge"
                                disabled={isWatchingAd}
                                onClick={() => handleWatchAdChallenge(p1Score - p2Score)}
                                className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs tracking-wide shadow-[0_4px_16px_rgba(245,158,11,0.45)] active:scale-95 transition-all flex items-center justify-between cursor-pointer border border-amber-200/60 relative overflow-hidden group"
                              >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                {isWatchingAd ? (
                                  <div className="flex items-center justify-center gap-2 w-full py-0.5">
                                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                                    <span className="font-extrabold text-xs text-slate-950">{t.loadingAdText || "Loading Ad..."}</span>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <div className="p-1.5 rounded-xl bg-slate-950/20 text-slate-950">
                                        <Video className="w-4 h-4" />
                                      </div>
                                      <div className="flex flex-col items-start leading-tight text-left">
                                        <span className="font-black text-xs text-slate-950">
                                          {p1Score > p2Score
                                            ? (t.watchAdDoubleTrophies ? t.watchAdDoubleTrophies(p1Score - p2Score) : `×2 Trophies (+${p1Score - p2Score})`)
                                            : p1Score < p2Score
                                              ? (t.watchAdSaveTrophies ? t.watchAdSaveTrophies(Math.max(1, Math.floor(Math.abs(p1Score - p2Score) / 2))) : `Save 50% Trophies (+${Math.max(1, Math.floor(Math.abs(p1Score - p2Score) / 2))})`)
                                              : (t.watchAdBonusTrophy || "+1 Bonus Trophy")}
                                        </span>
                                        <span className="text-[9px] font-extrabold text-slate-900/80 uppercase tracking-wider">
                                          {t.watchAdText || "Watch Ad"} • {t.adRewardBadge2x || "×2 Reward"}
                                        </span>
                                      </div>
                                    </div>
                                    <Sparkles className="w-4 h-4 text-slate-950 animate-pulse shrink-0" />
                                  </>
                                )}
                              </button>
                            ) : (
                              <div className="w-full px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2 shadow-inner">
                                <Sparkles className="w-4 h-4 text-amber-300" />
                                <span>{t.adRewardApplied || "Ad Reward Applied! 🎉"}</span>
                              </div>
                            )}

                            <button
                              id="btn-play-again-vsbot"
                              onClick={() => { synth.playSelect(); generateMemoryGame(difficulty); }}
                              className={`w-full px-6 py-3 rounded-2xl ${currentTheme.buttonPrimary} font-black text-xs tracking-wide active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                            >
                              <span>{t.playAgainText}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <button
                              id="btn-play-again-2p"
                              onClick={() => { synth.playSelect(); generateMemoryGame(difficulty); }}
                              className={`flex-1 px-4 py-3 rounded-2xl ${currentTheme.buttonPrimary} font-black text-xs tracking-wide active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                            >
                              <span>{t.playAgainText}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                              id="btn-back-menu-2p"
                              onClick={handleBackToMenu}
                              className={`flex-1 px-4 py-3 rounded-2xl ${currentTheme.buttonSecondary} font-black text-xs tracking-wide active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                            >
                              <Home className="w-4 h-4" />
                              <span>{t.backToMenuText}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Solo mode Victory Screen
                const baseScore = (memoryCards.length * 10) / 2;
                const efficiencyScore = Math.max(0, 1000 - memoryMoves * 10) / 10;
                const timeBonus = (memoryTimeLeft > 0 ? memoryTimeLeft * 20 : 0) / 5;
                const totalLevelScore = Math.round(baseScore + efficiencyScore + timeBonus);

                return (
                  <div id="memory-finished-panel" className={`absolute inset-0 ${currentTheme.dialogBg} border-2 backdrop-blur-xl z-40 rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-score-summary-fade-in shadow-[0_16px_40px_rgba(10,14,35,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] overflow-y-auto transition-all duration-300`}>
                    <div className="flex flex-col items-center gap-4 max-w-sm w-full">
                      <div className="p-4 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] bg-amber-500/20 border-2 border-amber-400/50 text-amber-300">
                        <Trophy className="w-10 h-10 animate-bounce" />
                      </div>

                      <div>
                        <h3 className="font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff2a3] via-[#ffcf40] to-[#e69d00] text-xl sm:text-2xl tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(230,157,0,0.4)]">
                          {t.rewardDialogTitle || t.memoryWinTitle}
                        </h3>
                        <p className={`text-xs ${currentTheme.textSecondary} mt-1 font-bold leading-relaxed transition-colors duration-300`}>
                          {t.memoryWinDesc(memoryMoves)}
                        </p>
                      </div>

                      {/* SCOREBOARD BREAKDOWN */}
                      <div className={`w-full ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-2xl p-4 text-left text-xs space-y-2.5 font-sans mt-1 shadow-[0_8px_20px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all duration-300`}>
                        <div className={`flex justify-between items-center ${currentTheme.textSecondary} pb-2 border-b ${currentTheme.cardBorder} transition-colors duration-300`}>
                          <span className="font-black uppercase tracking-wider text-[10px]">{t.scoringBreakdown}</span>
                          <span className="text-amber-400 font-extrabold text-[11px] font-mono tracking-wider">{t.boardSizeLabels[difficulty as keyof typeof t.boardSizeLabels] || difficulty}</span>
                        </div>

                        <div className="flex justify-between items-center font-bold">
                          <span className={`transition-colors duration-300 ${currentTheme.textSecondary}`}>{t.baseMatchPoints}:</span>
                          <span className={`font-mono ${currentTheme.textPrimary} font-black transition-colors duration-300`}>+{baseScore}</span>
                        </div>

                        <div className="flex justify-between items-center font-bold">
                          <span className={`transition-colors duration-300 ${currentTheme.textSecondary}`}>
                            {t.efficiencyBonus}:
                          </span>
                          <span className={`font-mono ${currentTheme.textPrimary} font-black transition-colors duration-300`}>+{efficiencyScore}</span>
                        </div>

                        <div className="flex justify-between items-center font-bold">
                          <span className={`transition-colors duration-300 ${currentTheme.textSecondary}`}>
                            {t.timeBonusText}:
                          </span>
                          <span className={`font-mono ${currentTheme.textPrimary} font-black transition-colors duration-300`}>+{timeBonus}</span>
                        </div>

                        <div className={`flex justify-between items-center pt-2.5 border-t ${currentTheme.cardBorder} font-black text-sm transition-colors duration-300 ${isThemeDark ? "text-emerald-300" : "text-emerald-700"}`}>
                          <span>{t.levelScoreTotal}:</span>
                          <div className="flex items-center gap-2">
                            {classicAdWatched && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] uppercase font-black tracking-wider animate-bounce border border-amber-400/40">
                                {t.x2DoubledTag || "×2 Score! 🎉"}
                              </span>
                            )}
                            <span className="font-mono text-lg">
                              +{classicAdWatched ? totalLevelScore * 2 : totalLevelScore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 w-full max-w-[280px] mt-1">
                        {/* WATCH AD BUTTON FOR CLASSIC MODE */}
                        {!classicAdWatched ? (
                          <button
                            id="btn-watch-ad-classic"
                            disabled={isWatchingAd}
                            onClick={() => handleWatchAdClassic(totalLevelScore)}
                            className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs tracking-wide shadow-[0_4px_16px_rgba(245,158,11,0.45)] active:scale-95 transition-all flex items-center justify-between cursor-pointer border border-amber-200/60 relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                            {isWatchingAd ? (
                              <div className="flex items-center justify-center gap-2 w-full py-0.5">
                                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                                <span className="font-extrabold text-xs text-slate-950">{t.loadingAdText || "Loading Ad..."}</span>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-xl bg-slate-950/20 text-slate-950">
                                    <Video className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col items-start leading-tight text-left">
                                    <span className="font-black text-xs text-slate-950">
                                      {t.watchAdDoubleScore || "×2 Final Score"}
                                    </span>
                                    <span className="text-[9px] font-extrabold text-slate-900/80 uppercase tracking-wider">
                                      {t.watchAdText || "Watch Ad"} • {t.watchAdSubtextBonus ? t.watchAdSubtextBonus(totalLevelScore) : `+${totalLevelScore} Bonus`}
                                    </span>
                                  </div>
                                </div>
                                <Sparkles className="w-4 h-4 text-slate-950 animate-pulse shrink-0" />
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="w-full px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2 shadow-inner">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>{t.adScoreRewardApplied || t.adRewardApplied || "×2 Score Reward Applied! 🎉"}</span>
                          </div>
                        )}

                        <button
                          id="btn-play-again-memory"
                          onClick={() => { synth.playSelect(); generateMemoryGame(difficulty); }}
                          className={`px-6 py-3 w-full rounded-2xl ${currentTheme.buttonPrimary} font-black text-xs tracking-wide active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
                        >
                          {t.newGame}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

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
                      by hungcuong
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* SETTINGS MODAL / PANEL */}
      <div 
        id="settings-modal-backdrop"
        className={`absolute inset-0 bg-[#0d101b]/70 md:backdrop-blur-md backdrop-blur-none z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
          isSettingsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSettingsOpen(false)}
      >
        <div 
          id="settings-modal-content"
          className={`${currentTheme.dialogBg} md:backdrop-blur-xl backdrop-blur-none border-2 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-[0_16px_40px_rgba(10,14,35,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] relative overflow-hidden text-slate-100 transition-all duration-300 transform max-h-[90vh] overflow-y-auto ${
            isSettingsOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
            {/* Header glow */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400"></div>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                <h2 className="text-lg font-black tracking-tight">{t.settingsTitle}</h2>
              </div>
              <button
                id="btn-close-settings-x"
                onClick={() => { synth.playClose(); setIsSettingsOpen(false); }}
                className="p-1.5 rounded-xl bg-[#34448e] hover:bg-[#3e51aa] text-slate-300 hover:text-white transition-all border border-[#546bbf]/40 shadow-sm cursor-pointer"
                title={t.settingsClose}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              
              {/* Row 1: Language Settings */}
              <div id="setting-row-language" className="p-4 rounded-2xl bg-[#1e2552]/70 border-2 border-[#3f509d]/40 flex flex-col gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🌐</span>
                    <div>
                      <h3 className="text-sm font-black text-slate-100">{t.settingsLanguage}</h3>
                      <p className="text-[10px] text-slate-300 font-bold">Select your language</p>
                    </div>
                  </div>
                </div>

                {/* Stylized Dropdown/Toggle Menu */}
                <div className="relative w-full mt-1">
                  {/* Dropdown Trigger */}
                  <button
                    id="btn-lang-dropdown-trigger"
                    onClick={() => { synth.playSelect(); setIsLangDropdownOpen(!isLangDropdownOpen); }}
                    className="w-full py-2 px-3.5 rounded-xl bg-[#2d3875] border-2 border-[#546bbf]/40 hover:border-[#546bbf]/60 text-slate-100 text-xs font-black flex items-center justify-between transition-all focus:outline-none cursor-pointer shadow-sm"
                  >
                    <span>
                      {language === "en" ? "English" : language === "vi" ? "Tiếng Việt" : language === "es" ? "Español" : language === "pt" ? "Português" : language === "tr" ? "Türkçe" : language === "de" ? "Deutsch" : language === "fr" ? "Français" : language === "it" ? "Italiano" : language === "ru" ? "Русский" : language === "id" ? "Bahasa Indonesia" : language === "zh-TW" ? "繁體中文" : language === "ja" ? "日本語" : language === "ko" ? "한국어" : language === "pl" ? "Polski" : language === "nl" ? "Nederlands" : language === "th" ? "ไทย" : "English"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${isLangDropdownOpen ? "rotate-180 text-cyan-300" : ""}`} />
                  </button>

                  {/* Dropdown Content with smooth height & opacity transition */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${
                       isLangDropdownOpen 
                        ? "max-h-[320px] opacity-100 mt-1.5 pointer-events-auto" 
                        : "max-h-0 opacity-0 pointer-events-none mt-0"
                      }`}
                  >
                    <div className="bg-[#1e2552] border-2 border-[#3f509d]/60 rounded-xl p-1.5 grid grid-cols-2 gap-1 shadow-xl">
                       {([
                        { code: "de", label: "Deutsch" },
                        { code: "en", label: "English" },
                        { code: "es", label: "Español" },
                        { code: "fr", label: "Français" },
                        { code: "id", label: "Bahasa Indonesia" },
                        { code: "it", label: "Italiano" },
                        { code: "ja", label: "日本語" },
                        { code: "ko", label: "한국어" },
                        { code: "nl", label: "Nederlands" },
                        { code: "pl", label: "Polski" },
                        { code: "pt", label: "Português" },
                        { code: "ru", label: "Русский" },
                        { code: "th", label: "ไทย" },
                        { code: "tr", label: "Türkçe" },
                        { code: "vi", label: "Tiếng Việt" },
                        { code: "zh-TW", label: "繁體中文" }
                      ] as const).map((lang) => {
                        const isSelected = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            id={`btn-lang-${lang.code}`}
                            onClick={() => {
                              synth.playSelect();
                              changeLanguage(lang.code);
                              setIsLangDropdownOpen(false);
                            }}
                            className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-1 cursor-pointer ${
                              isSelected
                                ? "bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 text-cyan-300 border border-cyan-500/30 shadow-inner"
                                : "bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent"
                            }`}
                          >
                            <span className="truncate">{lang.label}</span>
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Audio Config */}
              <div id="setting-row-audio" className="p-4 rounded-2xl bg-[#1e2552]/70 border-2 border-[#3f509d]/40 flex items-center justify-between gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)]">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${soundOn ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/20" : "bg-rose-500/20 text-rose-300 border border-rose-500/20"}`}>
                    {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-100">{t.settingsAudio}</h3>
                    <p className="text-[10px] text-slate-300 font-bold">{t.settingsAudioDesc}</p>
                  </div>
                </div>

                {/* Stylized switch toggle */}
                <button
                  id="btn-settings-audio-toggle"
                  onClick={() => { synth.playSelect(); setSoundOn(!soundOn); }}
                  className={`w-12 h-6 rounded-full p-0.5 transition-all duration-200 focus:outline-none relative border border-slate-900/10 ${
                    soundOn ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-[#2d3875]"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    soundOn ? "translate-x-6" : "translate-x-0"
                  }`} />
                </button>
              </div>

            </div>
          </div>
        </div>

      {/* SHOP MODAL / PANEL */}
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

      {/* GENTLE SNOW UNLOCK CONGRATULATION DIALOG */}
      {showGentleSnowModal && (
        <div 
          id="gentle-snow-unlock-dialog"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            id="gentle-snow-unlock-card"
            className="bg-gradient-to-b from-[#1b224c] to-[#121633] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.35)] text-center relative overflow-hidden flex flex-col items-center animate-scale-up"
          >
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
      )}

      {/* READY TO START? GAME START CONFIRMATION MODAL */}
      {showMemoryConfirm && (() => {
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
        return (
          <div
            id="memory-confirm-backdrop"
            className="absolute inset-0 bg-[#0d101b]/70 md:backdrop-blur-md backdrop-blur-none z-[110] flex items-center justify-center p-4 animate-fade-in-backdrop"
            onClick={() => setShowMemoryConfirm(false)}
          >
            <div
              id="memory-confirm-content"
              className="bg-[#252f67]/95 md:backdrop-blur-xl backdrop-blur-none border-2 border-[#546bbf]/60 rounded-3xl w-full max-w-sm p-6 shadow-[0_16px_40px_rgba(10,14,35,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] relative overflow-hidden text-slate-100 animate-scale-up-fade"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <span className="text-slate-300 font-black uppercase text-[9px] mb-0.5 tracking-wider">Mode</span>
                  <span className="text-cyan-300 font-black uppercase text-[10px] tracking-wide">
                    {pendingMemoryMode === "solo" ? "Classic" : pendingMemoryMode === "vsBot" ? "Challenge" : "2 Players"}
                  </span>
                </div>
                <div className="h-6 w-[2px] bg-[#3f509d]/40"></div>
                <div className="flex flex-col items-center">
                  <span className="text-slate-300 font-black uppercase text-[9px] mb-0.5 tracking-wider">Grid</span>
                  <span className="text-amber-300 font-black uppercase text-[10px] tracking-wide">
                    {pendingMemoryMode === "vsBot"
                      ? t.boardSizeLabels[getBoardSizeForTrophies(vsBotTrophies)]
                      : t.boardSizeLabels[pendingDifficulty as keyof typeof t.boardSizeLabels] || pendingDifficulty}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              {(() => {
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

                if (pendingMemoryMode === "vsBot" && parsedSaved) {
                  return (
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
                          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-b from-cyan-400 to-indigo-500 text-white font-black text-xs tracking-wider transition-all duration-200 shadow-md border-2 border-cyan-300/50 active:scale-95 cursor-pointer text-center hover:brightness-105"
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
                            generateMemoryGame(finalDiff);
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
                  );
                }

                return (
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
                        synth.playSelect();
                        const finalDiff = pendingMemoryMode === "vsBot" 
                          ? getBoardSizeForTrophies(vsBotTrophies) 
                          : pendingDifficulty;
                        setDifficulty(finalDiff);
                        setMemoryMode(pendingMemoryMode);
                        generateMemoryGame(finalDiff);
                        setShowMemoryConfirm(false);
                      }}
                      className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-b from-[#ffcf40] to-[#e69d00] text-slate-950 font-black text-xs tracking-wider transition-all duration-200 shadow-md border-2 border-amber-300/80 active:scale-95 cursor-pointer hover:brightness-105"
                    >
                      {confirmText.start}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })()}

      {/* RANK UP POPUP CELEBRATION */}
      {showRankUpPopup && rankUpBadge && (
        <div 
          id="rank-up-backdrop"
          className="absolute inset-0 bg-[#0d101b]/70 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-fade-in-backdrop"
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
            className={`${currentTheme.dialogBg} backdrop-blur-xl border-2 border-amber-400/80 rounded-3xl p-6 max-w-xs w-full shadow-[0_16px_40px_rgba(245,158,11,0.25),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] relative z-10 flex flex-col items-center gap-4 animate-scale-up text-center animate-fade-in-backdrop transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
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
              onClick={() => {
                synth.playSelect();
                setShowRankUpPopup(false);
              }}
              className={`w-full py-3 px-4 rounded-2xl ${currentTheme.buttonPrimary} font-black text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer`}
            >
              {isRankPromotion ? t.awesomeText : t.okText}
            </button>
          </div>
        </div>
      )}

      {/* HIGH SCORE POPUP CELEBRATION */}
      {showHighScorePopup && (
        <div 
          id="highscore-popup-backdrop"
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-fade-in-backdrop animate-duration-200"
          onClick={() => setShowHighScorePopup(false)}
        >
          {/* Subtle sparkles/particles background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {[...Array(8)].map((_, i) => {
              const left = Math.random() * 80 + 10;
              const top = Math.random() * 80 + 10;
              const size = Math.random() * 10 + 6;
              const delay = Math.random() * 0.5;
              return (
                <Sparkles
                  key={`hs-sparkle-${i}`}
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
            id="highscore-popup-content"
            className="bg-[#252f67]/95 backdrop-blur-xl border-2 border-emerald-400/80 rounded-3xl p-6 max-w-xs w-full shadow-[0_16px_40px_rgba(16,185,129,0.25),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)] relative z-10 flex flex-col items-center gap-4 text-center animate-scale-up animate-duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-emerald-500/20 border-2 border-emerald-400/40 rounded-full text-emerald-300 animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="font-black text-xl sm:text-2xl text-emerald-300 tracking-wider uppercase leading-none mt-2">
                {t.newHighScoreTitle}
              </h3>
            </div>

            <div className="bg-[#1e2552]/70 border-2 border-emerald-500/40 rounded-2xl py-3.5 px-6 w-full shadow-[0_4px_10px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col items-center">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mb-1">
                {t.recordScoreLabel}
              </span>
              <span className="font-mono text-3xl font-black text-emerald-300 drop-shadow-[0_2px_8px_rgba(52,211,153,0.3)]">
                {newHighScoreValue}
              </span>
            </div>

            <p className="text-xs text-slate-200 font-bold px-2 leading-relaxed">
              {t.congratsHighScore}
            </p>

            <button
              id="btn-highscore-ok"
              onClick={() => {
                synth.playConfirm();
                setShowHighScorePopup(false);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-b from-emerald-400 to-[#10b981] text-slate-950 text-xs font-black uppercase tracking-wider shadow-md border-2 border-emerald-300/80 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              {t.okText}
            </button>
          </div>
        </div>
      )}

      {/* 2 PLAYERS MATCH RECORD RESET CONFIRMATION */}
      {showResetConfirm && (
        <div 
          id="reset-confirm-backdrop"
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-fade-in-backdrop animate-duration-200"
          onClick={() => setShowResetConfirm(false)}
        >
          <div 
            id="reset-confirm-content"
            className="bg-slate-900/95 border-2 border-rose-500/30 rounded-3xl p-6 max-w-xs w-full shadow-2xl relative z-10 flex flex-col items-center gap-4 text-center animate-scale-up animate-duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning indicator */}
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center border border-rose-500/20">
              <RotateCcw className="w-6 h-6 animate-spin-reverse" />
            </div>

            {/* Title */}
            <h3 className="font-black text-lg text-white uppercase tracking-wider leading-tight">
              {t.resetMatchRecordTitle}
            </h3>

            {/* Message */}
            <p className="text-xs text-slate-350 leading-relaxed px-1">
              {t.resetMatchRecordConfirm}
            </p>

            {/* Buttons */}
            <div className="flex gap-2.5 w-full mt-2">
              <button
                id="btn-reset-cancel"
                onClick={() => {
                  synth.playSelect();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                {t.cancelText}
              </button>
              <button
                id="btn-reset-confirm"
                onClick={() => {
                  synth.playSelect();
                  setWinsP1(0);
                  setWinsP2(0);
                  localStorage.removeItem("emoji_brainpop_2p_wins_p1");
                  localStorage.removeItem("emoji_brainpop_2p_wins_p2");
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md"
              >
                {t.resetButtonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
