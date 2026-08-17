import { BotDifficulty, BotDifficultyConfig } from "./types";

export interface RankConfig {
  id: number;
  nameKey: "rankBeginner" | "rankRookie" | "rankApprentice" | "rankSkilled" | "rankExpert" | "rankMaster" | "rankElite" | "rankChampion" | "rankLegend";
  prevMaxTrophies: number;
  maxTrophies: number;
  boardSize: "3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | "7x8";
  badgeType: "shield" | "crown";
  color: string;
  fill: string;
  border: string;
  bg: string;
  shadow: string;
  botProbabilities: { level: BotDifficulty; prob: number }[];
}

export const BOT_DIFFICULTY_CONFIGS: Record<BotDifficulty, BotDifficultyConfig> = {
  0: {
    difficulty: 0,
    memoryCapacity: 2,
    thinkingTimeMs: 1600,
    description: "Trainee - Remembers up to 2 cards. Very forgetful.",
  },
  1: {
    difficulty: 1,
    memoryCapacity: 3,
    thinkingTimeMs: 1400,
    description: "Novice - Remembers up to 3 cards. Prone to forgetting.",
  },
  2: {
    difficulty: 2,
    memoryCapacity: 4,
    thinkingTimeMs: 1200,
    description: "Easy - Remembers up to 4 cards. Takes their time.",
  },
  3: {
    difficulty: 3,
    memoryCapacity: 5,
    thinkingTimeMs: 1000,
    description: "Medium - Remembers up to 5 cards. Balanced challenge.",
  },
  4: {
    difficulty: 4,
    memoryCapacity: 8,
    thinkingTimeMs: 800,
    description: "Hard - Remembers up to 8 cards. Very observant.",
  },
  5: {
    difficulty: 5,
    memoryCapacity: 10,
    thinkingTimeMs: 600,
    description: "Expert - Remembers up to 10 cards. Exceptional recall.",
  },
  6: {
    difficulty: 6,
    memoryCapacity: 12,
    thinkingTimeMs: 600,
    description: "Master - Remembers up to 12 cards. Near-perfect memory.",
  },
};

/**
 * Single source of truth for Ranks, Trophy Thresholds, Board Sizes, and Bot Difficulty Probabilities.
 */
export const RANKS_CONFIG: RankConfig[] = [
  {
    id: 0,
    nameKey: "rankBeginner",
    prevMaxTrophies: 0,
    maxTrophies: 20,
    boardSize: "3x4",
    badgeType: "shield",
    color: "text-amber-700",
    fill: "#b45309",
    border: "border-amber-700/30",
    bg: "bg-amber-500/10",
    shadow: "shadow-amber-500/10",
    botProbabilities: [
      { level: 0, prob: 0.8 },
      { level: 1, prob: 0.2 },
    ],
  },
  {
    id: 1,
    nameKey: "rankRookie",
    prevMaxTrophies: 20,
    maxTrophies: 50,
    boardSize: "4x4",
    badgeType: "shield",
    color: "text-slate-400",
    fill: "#94a3b8",
    border: "border-slate-400/30",
    bg: "bg-slate-400/10",
    shadow: "shadow-slate-400/10",
    botProbabilities: [
      { level: 0, prob: 0.4 },
      { level: 1, prob: 0.5 },
      { level: 2, prob: 0.1 },
    ],
  },
  {
    id: 2,
    nameKey: "rankApprentice",
    prevMaxTrophies: 50,
    maxTrophies: 120,
    boardSize: "4x5",
    badgeType: "shield",
    color: "text-emerald-500",
    fill: "#10b981",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    shadow: "shadow-emerald-500/10",
    botProbabilities: [
      { level: 1, prob: 0.2 },
      { level: 2, prob: 0.5 },
      { level: 3, prob: 0.3 },
    ],
  },
  {
    id: 3,
    nameKey: "rankSkilled",
    prevMaxTrophies: 120,
    maxTrophies: 220,
    boardSize: "5x5",
    badgeType: "shield",
    color: "text-blue-500",
    fill: "#3b82f6",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    shadow: "shadow-blue-500/10",
    botProbabilities: [
      { level: 2, prob: 0.2 },
      { level: 3, prob: 0.5 },
      { level: 4, prob: 0.3 },
    ],
  },
  {
    id: 4,
    nameKey: "rankExpert",
    prevMaxTrophies: 220,
    maxTrophies: 350,
    boardSize: "5x6",
    badgeType: "shield",
    color: "text-fuchsia-500",
    fill: "#d946ef",
    border: "border-fuchsia-500/30",
    bg: "bg-fuchsia-500/10",
    shadow: "shadow-fuchsia-500/10",
    botProbabilities: [
      { level: 3, prob: 0.2 },
      { level: 4, prob: 0.5 },
      { level: 5, prob: 0.3 },
    ],
  },
  {
    id: 5,
    nameKey: "rankMaster",
    prevMaxTrophies: 350,
    maxTrophies: 450,
    boardSize: "6x6",
    badgeType: "shield",
    color: "text-yellow-500",
    fill: "#eab308",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    shadow: "shadow-yellow-500/10",
    botProbabilities: [
      { level: 4, prob: 0.2 },
      { level: 5, prob: 0.5 },
      { level: 6, prob: 0.3 },
    ],
  },
  {
    id: 6,
    nameKey: "rankElite",
    prevMaxTrophies: 450,
    maxTrophies: 600,
    boardSize: "6x6",
    badgeType: "shield",
    color: "text-rose-600",
    fill: "#e11d48",
    border: "border-rose-600/30",
    bg: "bg-rose-500/10",
    shadow: "shadow-rose-500/10",
    botProbabilities: [
      { level: 4, prob: 0.3 },
      { level: 5, prob: 0.4 },
      { level: 6, prob: 0.3 },
    ],
  },
  {
    id: 7,
    nameKey: "rankChampion",
    prevMaxTrophies: 600,
    maxTrophies: 800,
    boardSize: "6x8",
    badgeType: "shield",
    color: "text-purple-500",
    fill: "#a855f7",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    shadow: "shadow-purple-500/10",
    botProbabilities: [
      { level: 5, prob: 0.2 },
      { level: 6, prob: 0.8 },
    ],
  },
  {
    id: 8,
    nameKey: "rankLegend",
    prevMaxTrophies: 800,
    maxTrophies: Infinity,
    boardSize: "7x8",
    badgeType: "crown",
    color: "text-amber-400 font-extrabold animate-pulse",
    fill: "#fbbf24",
    border: "border-amber-400/40",
    bg: "bg-amber-500/15",
    shadow: "shadow-amber-400/20",
    botProbabilities: [
      { level: 5, prob: 0.3 },
      { level: 6, prob: 0.7 },
    ],
  },
];

/**
 * Probability distribution for selecting Bot difficulty when not using trophy rank.
 */
export const BOT_SELECTION_PROBABILITIES: Record<BotDifficulty, number> = {
  0: 0.10, // 10%
  1: 0.20, // 20%
  2: 0.20, // 20%
  3: 0.20, // 20%
  4: 0.15, // 15%
  5: 0.10, // 10%
  6: 0.05, // 5%
};

/**
 * Select a random bot difficulty based on the selection probabilities.
 */
export function selectRandomBotDifficulty(): BotDifficulty {
  const rand = Math.random();
  let cumulative = 0;
  
  const entries = Object.entries(BOT_SELECTION_PROBABILITIES) as [string, number][];
  for (const [diffStr, prob] of entries) {
    cumulative += prob;
    if (rand < cumulative) {
      return parseInt(diffStr, 10) as BotDifficulty;
    }
  }
  
  return 3;
}

/**
 * Get rank configuration based on user trophies.
 */
export function getRankForTrophies(trophies: number): RankConfig {
  const safeTrophies = Math.max(0, trophies);
  const found = RANKS_CONFIG.find((rank) => safeTrophies <= rank.maxTrophies);
  return found || RANKS_CONFIG[RANKS_CONFIG.length - 1];
}

/**
 * Get rank configuration for bot difficulty level.
 */
export function getBotRankInfo(difficulty: number): {
  badgeType: "shield" | "crown";
  color: string;
  fill: string;
  bg: string;
  border: string;
} {
  const safeDiff = Math.max(0, Math.min(6, Math.floor(difficulty)));
  const botRanks: Record<number, { badgeType: "shield" | "crown"; color: string; fill: string; bg: string; border: string }> = {
    0: { badgeType: "shield", color: "text-cyan-400", fill: "#22d3ee", bg: "bg-cyan-500/20", border: "border-cyan-400/60" },
    1: { badgeType: "shield", color: "text-emerald-400", fill: "#34d399", bg: "bg-emerald-500/20", border: "border-emerald-400/60" },
    2: { badgeType: "shield", color: "text-blue-400", fill: "#60a5fa", bg: "bg-blue-500/20", border: "border-blue-400/60" },
    3: { badgeType: "shield", color: "text-purple-400", fill: "#c084fc", bg: "bg-purple-500/20", border: "border-purple-400/60" },
    4: { badgeType: "shield", color: "text-fuchsia-400", fill: "#f0abfc", bg: "bg-fuchsia-500/20", border: "border-fuchsia-400/60" },
    5: { badgeType: "shield", color: "text-orange-400", fill: "#fb923c", bg: "bg-orange-500/20", border: "border-orange-400/60" },
    6: { badgeType: "crown", color: "text-amber-300 font-extrabold", fill: "#fcd34d", bg: "bg-amber-500/25", border: "border-amber-400/80" },
  };
  return botRanks[safeDiff] || botRanks[3];
}

export interface BotRankDetails {
  rankConfig: RankConfig;
  badgeType: "shield" | "crown";
  color: string;
  fill: string;
  bg: string;
  border: string;
  simulatedTrophies: number;
}

/**
 * Get full rank details and a consistent simulated trophy count for a bot.
 */
export function getBotRankDetails(difficulty: number, botUsername?: string): BotRankDetails {
  const safeDiff = Math.max(0, Math.min(6, Math.floor(difficulty)));

  // Mapping difficulty 0..6 to corresponding RANKS_CONFIG
  const rankIndexMap: Record<number, number> = {
    0: 0, // rankBeginner
    1: 1, // rankRookie
    2: 2, // rankApprentice
    3: 3, // rankSkilled
    4: 4, // rankExpert
    5: 5, // rankMaster
    6: 8, // rankLegend
  };

  const rankIdx = rankIndexMap[safeDiff] ?? 3;
  const rankConfig = RANKS_CONFIG[rankIdx] || RANKS_CONFIG[3];
  const badgeInfo = getBotRankInfo(safeDiff);

  // Generate deterministic simulated trophy count for this bot + difficulty
  const seedStr = `${botUsername || "BOT"}_level_${safeDiff}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const minTrophies = rankConfig.id === 0 ? 5 : rankConfig.prevMaxTrophies + 1;
  const maxTrophies = rankConfig.maxTrophies === Infinity ? 1200 : rankConfig.maxTrophies;
  const range = Math.max(1, maxTrophies - minTrophies + 1);
  const simulatedTrophies = minTrophies + (positiveHash % range);

  return {
    rankConfig,
    ...badgeInfo,
    simulatedTrophies,
  };
}

/**
 * Calculate progress percentage towards completing the current rank.
 */
export function getRankProgressPercentage(trophies: number): number {
  if (trophies <= 0) return 0;
  const rank = getRankForTrophies(trophies);
  if (rank.maxTrophies === Infinity) return 100;
  const range = rank.maxTrophies - rank.prevMaxTrophies;
  if (range <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round(((trophies - rank.prevMaxTrophies) / range) * 100)));
}

/**
 * Get board size difficulty based on user trophies.
 */
export function getBoardSizeForTrophies(trophies: number): "3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | "7x8" {
  return getRankForTrophies(trophies).boardSize;
}

/**
 * Select bot difficulty based on user trophies using the rank's probability distribution.
 */
export function selectBotDifficultyForTrophies(trophies: number): BotDifficulty {
  const rank = getRankForTrophies(trophies);
  const rand = Math.random();
  let cumulative = 0;
  for (const item of rank.botProbabilities) {
    cumulative += item.prob;
    if (rand < cumulative) {
      return item.level;
    }
  }
  return rank.botProbabilities[rank.botProbabilities.length - 1].level;
}

/**
 * Helper to retrieve the configuration for a given bot difficulty level.
 */
export function getBotConfig(difficulty: BotDifficulty): BotDifficultyConfig {
  return BOT_DIFFICULTY_CONFIGS[difficulty];
}
