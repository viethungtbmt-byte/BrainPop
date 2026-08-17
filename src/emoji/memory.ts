import { UNIQUE_EMOJIS } from "./emojis";

// Helper shuffle function (must match original shuffleArray)
function shuffleArray<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = res[i];
    res[i] = res[j];
    res[j] = temp;
  }
  return res;
}

export interface MemoryBoardSetup {
  randomizedBoard: string[];
  selectedEmojis: string[];
}

// In-memory cache for recent emoji history per game mode (keeps up to 2 previous games)
// Game N, N+1, N+2 will be pairwise completely disjoint (no emoji reused across any 3 consecutive games)
const recentModeEmojisCache = new Map<string, string[][]>();

const STORAGE_KEY_PREFIX = "emoji_brainpop_recent_emojis_";

function getModeHistory(modeKey: string): string[][] {
  if (recentModeEmojisCache.has(modeKey)) {
    return recentModeEmojisCache.get(modeKey) || [];
  }
  try {
    if (typeof sessionStorage !== "undefined") {
      const stored = sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${modeKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          recentModeEmojisCache.set(modeKey, parsed);
          return parsed;
        }
      }
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
  return [];
}

function saveModeHistory(modeKey: string, history: string[][]): void {
  recentModeEmojisCache.set(modeKey, history);
  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${modeKey}`, JSON.stringify(history));
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

/**
 * Prepares the board according to the selected Board Size.
 * Handles selecting emojis and generating card pairs with strict anti-repeat across any 3 consecutive games.
 */
export function generateMemoryBoard(
  diff: "3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | "7x8",
  memoryMode: string
): MemoryBoardSetup {
  let totalCards = 20;
  const actualDiff = diff;
  if (actualDiff === "3x4") totalCards = 12;
  else if (actualDiff === "4x4") totalCards = 16;
  else if (actualDiff === "4x5") totalCards = 20;
  else if (actualDiff === "5x5") totalCards = 25;
  else if (actualDiff === "5x6") totalCards = 30;
  else if (actualDiff === "6x6") totalCards = 36;
  else if (actualDiff === "6x8") totalCards = 48;
  else if (actualDiff === "7x8") totalCards = 56;

  const numPairs = actualDiff === "5x5" ? 12 : totalCards / 2;

  // Normalize mode key so history is kept independently for each game mode (Classic, 2 Players, Challenge)
  const modeKey = memoryMode || "solo";
  const history = getModeHistory(modeKey);

  // Exclude emojis from up to the last 2 games in this mode to ensure no repeats across any 3 consecutive games
  const excluded = new Set<string>();
  for (const gameSet of history) {
    if (Array.isArray(gameSet)) {
      for (const emoji of gameSet) {
        excluded.add(emoji);
      }
    }
  }

  // Filter available emojis
  let availablePool = UNIQUE_EMOJIS.filter((emoji) => !excluded.has(emoji));

  // Graceful fallback: If pool is ever insufficient, relax exclusion to just the single most recent game
  if (availablePool.length < numPairs && history.length > 0) {
    const mostRecentGame = history[history.length - 1] || [];
    const relaxedExcluded = new Set<string>(mostRecentGame);
    availablePool = UNIQUE_EMOJIS.filter((emoji) => !relaxedExcluded.has(emoji));
  }

  // Second fallback: If still insufficient (defensive safety), use the entire emoji pool
  if (availablePool.length < numPairs) {
    availablePool = [...UNIQUE_EMOJIS];
  }

  // Randomly select emojis from the eligible pool
  const emojisShuffled = shuffleArray(availablePool);
  const selectedEmojis = emojisShuffled.slice(0, numPairs);

  // Update history for this mode (maintain at most the 2 most recent games: previous game + current game)
  const updatedHistory = [...history.slice(-1), selectedEmojis];
  saveModeHistory(modeKey, updatedHistory);

  // Double lists to make complete pairs
  const pool = [...selectedEmojis, ...selectedEmojis];
  
  if (actualDiff === "5x5") {
    pool.push("BLOCKED");
  }

  const randomizedBoard = shuffleArray(pool);

  return {
    randomizedBoard,
    selectedEmojis,
  };
}

/**
 * Calculates the minimum number of matching pairs required for an early win.
 * An early win occurs when a player reaches a score higher than the maximum possible
 * score the opponent could achieve even if the opponent matched all remaining cards.
 */
export function getTargetPairsToWin(
  diff: "3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8" | "7x8" | string,
  cardCount?: number
): number {
  let totalCards = 0;
  if (cardCount && cardCount > 0) {
    totalCards = cardCount;
  } else if (diff === "3x4") totalCards = 12;
  else if (diff === "4x4") totalCards = 16;
  else if (diff === "4x5") totalCards = 20;
  else if (diff === "5x5") totalCards = 25;
  else if (diff === "5x6") totalCards = 30;
  else if (diff === "6x6") totalCards = 36;
  else if (diff === "6x8") totalCards = 48;
  else if (diff === "7x8") totalCards = 56;
  else totalCards = 20;

  const playableCards = (diff === "5x5" || totalCards === 25) ? totalCards - 1 : totalCards;
  const totalPairs = Math.floor(playableCards / 2);
  return Math.floor(totalPairs / 2) + 1;
}
