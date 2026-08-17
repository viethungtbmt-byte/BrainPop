import React from "react";
import { GameHUD } from "../engine/GameHUD";
import { GameViewportFrame } from "../engine/GameViewportFrame";
import { CanvasCard } from "../CanvasCard";
import { EnvironmentalEffects } from "../../itemShop/effects";
import { getBoardBackgroundStyle } from "../../utils/themeStyles";

export interface MatchConnectionBoardProps {
  layoutConfig: any;
  currentTheme: any;
  equippedThemeId: string;
  equippedEffect: string;
  watermarkBg: string | null;
  synth: any;
  setIsMobileConfigOpen: (open: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  isPaused: boolean;
  activeTab: "memory" | "match";
  memoryMode: "vsBot" | "solo" | "twoPlayers";
  vsBotTrophies: number;
  winsP1: number;
  winsP2: number;
  currentScore: number;
  level: number;
  t: Record<string, any>;
  connections: any[];
  soundOn: boolean;
  setSoundOn: (sound: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  leftColumn: any[];
  rightColumn: any[];
  draggingIndex: number | null;
  draggingSide: "left" | "right" | null;
  activeLeftIndex: number | null;
  activeRightIndex: number | null;
  matchedPairs: number[];
  errorFlashPairs: number[];
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  handleStartDrag: (side: "left" | "right", index: number, event: React.MouseEvent | React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  svgConnections: any[];
  dragLinePos: any;
}

export const MatchConnectionBoard: React.FC<MatchConnectionBoardProps> = ({
  layoutConfig,
  currentTheme,
  equippedThemeId,
  equippedEffect,
  watermarkBg,
  synth,
  setIsMobileConfigOpen,
  setIsPaused,
  isPaused,
  activeTab,
  memoryMode,
  vsBotTrophies,
  winsP1,
  winsP2,
  currentScore,
  level,
  t,
  connections,
  soundOn,
  setSoundOn,
  containerRef,
  leftColumn,
  rightColumn,
  draggingIndex,
  draggingSide,
  activeLeftIndex,
  activeRightIndex,
  matchedPairs,
  errorFlashPairs,
  cardRefs,
  handleStartDrag,
  handleTouchMove,
  handleTouchEnd,
  svgConnections,
  dragLinePos,
}) => {
  return (
    <div id="match-container-wrapper" className="flex-1 min-h-0 flex flex-col justify-between text-slate-100 gap-2">
      {/* WORKSPACE BOARD CARD */}
      <GameViewportFrame title="MATCH CONNECTION" equippedThemeId={equippedThemeId}>
        <div 
          id="match-board-card"
          className={`${layoutConfig.matchBoardCardClass} ${currentTheme.boardBorder || ''} transition-all duration-500 ease-in-out h-full rounded-lg`}
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
          <GameHUD
            layoutConfig={layoutConfig}
            synth={synth}
            setIsMobileConfigOpen={setIsMobileConfigOpen}
            setIsPaused={setIsPaused}
            isPaused={isPaused}
            activeTab={activeTab}
            memoryMode={memoryMode}
            vsBotTrophies={vsBotTrophies}
            winsP1={winsP1}
            winsP2={winsP2}
            currentScore={currentScore}
            level={level}
            t={t}
            connectionsCount={connections.length}
            soundOn={soundOn}
            setSoundOn={setSoundOn}
          />
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
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* SVG Overlay for Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
            {svgConnections.map((conn, i) => (
              <line
                key={`conn-${i}`}
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x2}
                y2={conn.y2}
                stroke={conn.color || "#38bdf8"}
                strokeWidth={conn.isMatched ? "4" : "3"}
                strokeDasharray={conn.isMatched ? "none" : "6 4"}
                className="transition-all duration-200"
              />
            ))}
            {dragLinePos && (
              <line
                x1={dragLinePos.x1}
                y1={dragLinePos.y1}
                x2={dragLinePos.x2}
                y2={dragLinePos.y2}
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="4 4"
              />
            )}
          </svg>

          {/* Left Column */}
          <div className="flex flex-col justify-around gap-2 z-10">
            {leftColumn.map((item, index) => {
              const isDragging = draggingSide === "left" && draggingIndex === index;
              const isSelected = activeLeftIndex === index;
              const isMatched = matchedPairs.includes(index);
              const isError = errorFlashPairs.includes(index);

              return (
                <div
                  key={`left-${index}`}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  onMouseDown={(e) => handleStartDrag("left", index, e)}
                  onTouchStart={(e) => handleStartDrag("left", index, e)}
                >
                  <CanvasCard
                    item={item}
                    side="left"
                    isDragging={isDragging}
                    isSelected={isSelected}
                    isMatched={isMatched}
                    isError={isError}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-around gap-2 z-10">
            {rightColumn.map((item, index) => {
              const rightCardIndex = leftColumn.length + index;
              const isDragging = draggingSide === "right" && draggingIndex === index;
              const isSelected = activeRightIndex === index;
              const isMatched = matchedPairs.includes(index);
              const isError = errorFlashPairs.includes(index);

              return (
                <div
                  key={`right-${index}`}
                  ref={(el) => { cardRefs.current[rightCardIndex] = el; }}
                  onMouseDown={(e) => handleStartDrag("right", index, e)}
                  onTouchStart={(e) => handleStartDrag("right", index, e)}
                >
                  <CanvasCard
                    item={item}
                    side="right"
                    isDragging={isDragging}
                    isSelected={isSelected}
                    isMatched={isMatched}
                    isError={isError}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </GameViewportFrame>
    </div>
  );
};
