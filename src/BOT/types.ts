export type BotDifficulty = 0 | 1 | 2 | 3 | 4 | 5;

export interface CardMemoryItem {
  id: string; // The emoji/card value or unique identifier
  position: number; // The index on the board (e.g., 0 to N-1)
  timestamp: number; // Date.now() when revealed
}

export interface BotDifficultyConfig {
  difficulty: BotDifficulty;
  memoryCapacity: number;
  thinkingTimeMs: number; // Time the bot "thinks" before acting
  description: string;
}

export interface BotState {
  memory: CardMemoryItem[];
  difficulty: BotDifficulty;
}
