import { CardMemoryItem, BotDifficulty, BotState } from "./types";
import { getBotConfig } from "./config";

export class BotMemoryManager {
  private memory: CardMemoryItem[] = [];
  private difficulty: BotDifficulty;

  constructor(difficulty: BotDifficulty = 3) {
    this.difficulty = difficulty;
  }

  /**
   * Set a new difficulty level, resetting or truncating memory if necessary
   */
  public setDifficulty(difficulty: BotDifficulty): void {
    this.difficulty = difficulty;
    this.pruneMemory();
  }

  public getDifficulty(): BotDifficulty {
    return this.difficulty;
  }

  /**
   * Returns a copy of the current memory
   */
  public getMemory(): CardMemoryItem[] {
    return [...this.memory];
  }

  /**
   * Restore memory from saved state
   */
  public restoreMemory(savedMemory: CardMemoryItem[]): void {
    this.memory = [...savedMemory];
  }

  /**
   * Clears the entire memory
   */
  public clear(): void {
    this.memory = [];
  }

  /**
   * Record a card reveal event.
   * If the card at the position is already in memory, update its details and refresh its place in the FIFO queue.
   * Otherwise, push it to the queue. Automatically handles capacity overflow.
   */
  public recordReveal(cardId: string, position: number): void {
    // 1. Remove if already exists at this position to avoid duplicates
    this.memory = this.memory.filter((item) => item.position !== position);

    // 2. Add the new reveal item
    const newItem: CardMemoryItem = {
      id: cardId,
      position,
      timestamp: Date.now(),
    };
    this.memory.push(newItem);

    // 3. Keep within the difficulty capacity bounds
    this.pruneMemory();
  }

  /**
   * Clean up memory to remove matched cards from the bot's knowledge base.
   * If a pair is matched on the board, the bot shouldn't waste memory slots remembering them.
   */
  public forgetPositions(positions: number[]): void {
    this.memory = this.memory.filter((item) => !positions.includes(item.position));
  }

  /**
   * Internal helper to prune memory according to difficulty capacity limits (FIFO)
   */
  private pruneMemory(): void {
    const config = getBotConfig(this.difficulty);
    if (this.memory.length > config.memoryCapacity) {
      // Keep only the most recent items up to memoryCapacity
      this.memory = this.memory.slice(this.memory.length - config.memoryCapacity);
    }
  }
}
