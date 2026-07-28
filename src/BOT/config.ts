import { BotDifficulty, BotDifficultyConfig } from "./types";

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
    memoryCapacity: 6,
    thinkingTimeMs: 800,
    description: "Hard - Remembers up to 6 cards. Very observant.",
  },
  5: {
    difficulty: 5,
    memoryCapacity: 7,
    thinkingTimeMs: 600,
    description: "Expert - Remembers up to 7 cards. Near-perfect recall.",
  },
};

/**
 * Probability distribution for selecting Bot difficulty at the start of a VS BOT match.
 * Sum of values should ideally be 1.0 (or 100).
 */
export const BOT_SELECTION_PROBABILITIES: Record<BotDifficulty, number> = {
  0: 0.10, // 10%
  1: 0.25, // 25%
  2: 0.25, // 25%
  3: 0.20, // 20%
  4: 0.15, // 15%
  5: 0.05, // 5%
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
  
  // Fallback to level 3 if something went wrong
  return 3;
}

/**
 * Get board size difficulty based on user trophies.
 */
export function getBoardSizeForTrophies(trophies: number): "3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" {
  if (trophies <= 20) return "3x4";  // Rank 0: Beginner (0-20 trophies)
  if (trophies <= 50) return "4x4";  // Rank 1: Rookie (21-50 trophies)
  if (trophies <= 120) return "4x5"; // Rank 2: Apprentice (51-120 trophies)
  if (trophies <= 220) return "5x5"; // Rank 3: Skilled (121-220 trophies)
  if (trophies <= 350) return "5x6"; // Rank 4: Expert (221-350 trophies)
  if (trophies <= 550) return "6x6"; // Rank 5: Master (351-550 trophies)
  if (trophies <= 800) return "6x6"; // Rank 6: Elite (551-800 trophies)
  return "6x8";                      // Rank 7: Legend (>800 trophies)
}

/**
 * Select bot difficulty based on user trophies.
 */
export function selectBotDifficultyForTrophies(trophies: number): BotDifficulty {
  const rand = Math.random();
  if (trophies <= 20) {
    // Level 0: 100%
    return 0;
  } else if (trophies <= 50) {
    // Level 0: 100%
    return 0;
  } else if (trophies <= 120) {
    // Level 0: 60%, Level 1: 40%
    if (rand < 0.6) return 0;
    return 1;
  } else if (trophies <= 220) {
    // Level 0: 40%, Level 1: 40%, Level 2: 20%
    if (rand < 0.4) return 0;
    if (rand < 0.8) return 1;
    return 2;
  } else if (trophies <= 350) {
    // Level 1: 40%, Level 2: 40%, Level 3: 20%
    if (rand < 0.4) return 1;
    if (rand < 0.8) return 2;
    return 3;
  } else if (trophies <= 550) {
    // Level 2: 40%, Level 3: 40%, Level 4: 20%
    if (rand < 0.4) return 2;
    if (rand < 0.8) return 3;
    return 4;
  } else {
    // Level 3: 40%, Level 4: 40%, Level 5: 20%
    if (rand < 0.4) return 3;
    if (rand < 0.8) return 4;
    return 5;
  }
}

/**
 * Helper to retrieve the configuration for a given bot difficulty level.
 */
export function getBotConfig(difficulty: BotDifficulty): BotDifficultyConfig {
  return BOT_DIFFICULTY_CONFIGS[difficulty];
}

