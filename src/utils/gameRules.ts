import { EMBEDDED_PAIRS } from "../emoji/related";

export interface CardConnectionState {
  score: number;
  highScore: number;
}

export interface MemoryFlipState {
  score: number;
  highScore: number;
}

export interface Connection {
  idx1: number;
  idx2: number;
}

// Match validator
export const areCompatible = (emojiA: string, emojiB: string): boolean => {
  return EMBEDDED_PAIRS.some(p => 
    (p.from === emojiA && p.to === emojiB) || 
    (p.from === emojiB && p.to === emojiA)
  );
};

export const isIdenticalPair = (
  p1: { from: string; to: string },
  p2: { from: string; to: string }
): boolean => {
  return (
    (p1.from === p2.from && p1.to === p2.to) ||
    (p1.from === p2.to && p1.to === p2.from)
  );
};

export const validateLevelPairs = (
  candidate: { from: string; to: string }[],
  levelIndex: number,
  history: Record<number, { from: string; to: string }[]>
): boolean => {
  // --- RULE 1: Strict Individual Emoji Isolation (3-Level Window) ---
  const prev2LevelsEmojis = new Set<string>();
  for (let l = levelIndex - 2; l <= levelIndex - 1; l++) {
    if (l > 0 && history[l]) {
      for (const p of history[l]) {
        prev2LevelsEmojis.add(p.from);
        prev2LevelsEmojis.add(p.to);
      }
    }
  }

  // Get all emojis in the candidate pairs
  const candidateEmojis = candidate.flatMap(p => [p.from, p.to]);

  // Check if there is any overlap
  for (const emoji of candidateEmojis) {
    if (prev2LevelsEmojis.has(emoji)) {
      return false; // Violates Rule 1 (Strict Individual Emoji Isolation)!
    }
  }

  // --- RULE 2: Strict Pair Connection History (5-Level Window) ---
  const prev4LevelsPairs: { from: string; to: string }[] = [];
  for (let l = levelIndex - 4; l <= levelIndex - 1; l++) {
    if (l > 0 && history[l]) {
      prev4LevelsPairs.push(...history[l]);
    }
  }

  for (const p of candidate) {
    if (prev4LevelsPairs.some(prevP => isIdenticalPair(p, prevP))) {
      return false; // Violates Rule 2 (Strict Pair Connection History)!
    }
  }

  // --- RULE 3: Limited Pair Connection Duplication (10-Level Window) ---
  const prev9LevelsPairs: { from: string; to: string }[] = [];
  for (let l = levelIndex - 9; l <= levelIndex - 1; l++) {
    if (l > 0 && history[l]) {
      prev9LevelsPairs.push(...history[l]);
    }
  }

  const combined = [...prev9LevelsPairs, ...candidate];
  
  // Count frequencies of unique pairs in the combined window
  const uniqueGroups: { pair: { from: string; to: string }; count: number }[] = [];
  for (const p of combined) {
    const existing = uniqueGroups.find(g => isIdenticalPair(g.pair, p));
    if (existing) {
      existing.count++;
    } else {
      uniqueGroups.push({ pair: p, count: 1 });
    }
  }

  // A pair appearing 3 or more times is a violation
  if (uniqueGroups.some(g => g.count > 2)) {
    return false;
  }

  // Count how many unique pairs have count > 1
  const duplicatePairsCount = uniqueGroups.filter(g => g.count > 1).length;

  if (duplicatePairsCount > 1) {
    return false;
  }

  return true;
};
