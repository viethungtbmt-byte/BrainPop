import React from "react";
import { MemoryCard } from "../MemoryCard";

export interface MemoryBoardGridProps {
  memoryCards: string[];
  memoryCardSizing: {
    cols: number;
    rows: number;
    cardSize: number;
    gap: number;
    gridWidth: number;
    gridHeight: number;
    hideLockedCard: boolean;
  };
  memoryMatched: number[];
  memoryFlipped: number[];
  memoryBusy: boolean;
  matchedByP1: number[];
  memoryMode: "vsBot" | "solo" | "twoPlayers";
  handleMemoryCardClick: (index: number) => void;
  equippedCardBackId: string;
  matchSessionId: number;
  tutorialStep: number;
  tutorialCardA: number | null;
  tutorialCardB: number | null;
}

export const MemoryBoardGrid: React.FC<MemoryBoardGridProps> = ({
  memoryCards,
  memoryCardSizing,
  memoryMatched,
  memoryFlipped,
  memoryBusy,
  matchedByP1,
  memoryMode,
  handleMemoryCardClick,
  equippedCardBackId,
  matchSessionId,
  tutorialStep,
  tutorialCardA,
  tutorialCardB,
}) => {
  if (memoryCards.length === 0) return null;

  return (
    <div 
      className="poki-memory-grid relative z-10 transition-all duration-300 ease-out"
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
        const isMismatch = memoryFlipped.length === 2 && memoryBusy && !isMatched && memoryFlipped.includes(index);
        const isMatchedByP1 = memoryMode === "solo" ? isMatched : matchedByP1.includes(index);
        const isTutorialTarget = (tutorialStep === 1 && index === tutorialCardA) || (tutorialStep === 2 && index === tutorialCardB);

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
            isTutorialTarget={isTutorialTarget}
          />
        );
      })}
    </div>
  );
};
