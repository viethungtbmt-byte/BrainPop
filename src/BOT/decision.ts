import { CardMemoryItem } from "./types";

export interface BotDecisionInput {
  cards: string[];               // All card values (e.g. emojis) on the board
  matchedIndices: number[];      // Indices of cards already matched
  flippedIndices: number[];      // Indices of cards currently flipped in the active turn
  memory: CardMemoryItem[];      // Current memory of the bot
  lastHumanRevealed?: number[];  // Indices of the cards just revealed by the human player
}

export class BotDecisionEngine {
  /**
   * Determine the next card index to flip.
   * Returns -1 if no valid cards are available to flip.
   */
  public static decideNextFlip(input: BotDecisionInput): number {
    const { cards, matchedIndices, flippedIndices, memory, lastHumanRevealed } = input;

    // Get all indices that can be flipped (neither matched nor already flipped nor blocked)
    const availableIndices = cards
      .map((_, idx) => idx)
      .filter((idx) => cards[idx] !== "BLOCKED" && !matchedIndices.includes(idx) && !flippedIndices.includes(idx));

    if (availableIndices.length === 0) {
      return -1;
    }

    // Filter memory to only include cards that are still available (not matched or already flipped)
    const activeMemory = memory.filter(
      (item) => !matchedIndices.includes(item.position) && !flippedIndices.includes(item.position)
    );

    const avoidIndices = lastHumanRevealed || [];

    // Scenario A: First flip of the turn
    if (flippedIndices.length === 0) {
      // Step 1 — Check for a Known Pair
      // If the BOT already knows the positions of both cards in a matching pair, always flip that pair first.
      const knownPair = this.findPairInMemory(activeMemory);
      if (knownPair) {
        return knownPair[0];
      }

      // Step 2 — Explore First
      // If no complete pair is known, the BOT should choose its FIRST card randomly from the hidden cards.
      // Avoid selecting either of the two cards that were just revealed by the human player.
      const preferredIndices = availableIndices.filter((idx) => !avoidIndices.includes(idx));
      const firstCardPool = preferredIndices.length > 0 ? preferredIndices : availableIndices;
      return this.getRandomElement(firstCardPool);
    }

    // Scenario B: Second (or subsequent) flip of the turn
    if (flippedIndices.length >= 1) {
      // Get the value of the already flipped card(s)
      const firstFlippedIdx = flippedIndices[0];
      const firstFlippedValue = cards[firstFlippedIdx];

      // Step 3 — Use Memory
      // Check whether this card matches any card currently stored in the BOT's memory.
      // If a matching remembered card exists, flip that remembered card as the second card.
      const partnerMemoryItem = activeMemory.find(
        (item) => item.id === firstFlippedValue && item.position !== firstFlippedIdx
      );

      if (partnerMemoryItem) {
        return partnerMemoryItem.position;
      }

      // Step 4 — Continue Exploring
      // Choose the second card randomly from the remaining hidden cards.
      // Do not intentionally choose one of the two cards just revealed by the human player unless it is the correct remembered match.
      const preferredIndices = availableIndices.filter((idx) => !avoidIndices.includes(idx));
      const secondCardPool = preferredIndices.length > 0 ? preferredIndices : availableIndices;
      return this.getRandomElement(secondCardPool);
    }

    return -1;
  }

  /**
   * Helper to find a matching pair within active memory.
   * Returns a tuple of two indices if found, or null otherwise.
   */
  private static findPairInMemory(activeMemory: CardMemoryItem[]): [number, number] | null {
    // Group memory items by card value (id)
    const grouped = new Map<string, number[]>();
    for (const item of activeMemory) {
      const positions = grouped.get(item.id) || [];
      positions.push(item.position);
      grouped.set(item.id, positions);
    }

    // Look for any group with at least 2 distinct positions
    for (const [, positions] of grouped.entries()) {
      if (positions.length >= 2) {
        return [positions[0], positions[1]];
      }
    }

    return null;
  }

  /**
   * Helper to pick a random element from an array
   */
  private static getRandomElement<T>(arr: T[]): T {
    const randIdx = Math.floor(Math.random() * arr.length);
    return arr[randIdx];
  }
}
