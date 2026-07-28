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

/**
 * Prepares the board according to the selected Board Size.
 * Handles selecting emojis and generating card pairs.
 */
export function generateMemoryBoard(
  diff: "3x4" | "4x4" | "4x5" | "5x5" | "5x6" | "6x6" | "6x8",
  memoryMode: string
): MemoryBoardSetup {
  let totalCards = 20;
  let actualDiff = diff;
  if (actualDiff === "3x4") totalCards = 12;
  else if (actualDiff === "4x4") totalCards = 16;
  else if (actualDiff === "4x5") totalCards = 20;
  else if (actualDiff === "5x5") totalCards = 25;
  else if (actualDiff === "5x6") totalCards = 30;
  else if (actualDiff === "6x6") totalCards = 36;
  else if (actualDiff === "6x8") totalCards = 48;

  let selectedEmojis: string[] = [];

  if (actualDiff === "5x5") {
    // For 5x5, we select 12 pairs of matching cards (24 cards) and add one blocked card (total 25)
    const emojisShuffled = shuffleArray(UNIQUE_EMOJIS);
    selectedEmojis = emojisShuffled.slice(0, 12);
  } else {
    const numPairs = totalCards / 2;
    const emojisShuffled = shuffleArray(UNIQUE_EMOJIS);
    selectedEmojis = emojisShuffled.slice(0, numPairs);
  }

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
