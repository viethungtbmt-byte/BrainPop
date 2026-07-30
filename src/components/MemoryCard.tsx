import React, { useState, useEffect, memo } from "react";
import { Check } from "lucide-react";
import { TRANSLATIONS } from "../locales";

interface MemoryCardProps {
  emoji: string;
  index: number;
  isRevealed: boolean;
  isMatched: boolean;
  isMismatch: boolean;
  isMatchedByP1?: boolean;
  onClick: () => void;
  equippedCardBackId?: string;
  language?: string;
  isTutorialTarget?: boolean;
}

// Deterministically map each unique emoji to a standard suit (Hearts ♥, Diamonds ♦, Spades ♠, Clubs ♣)
const getSuitInfo = (emoji: string) => {
  let hash = 0;
  for (let i = 0; i < emoji.length; i++) {
    hash = emoji.charCodeAt(i) + ((hash << 5) - hash);
  }
  const suits = [
    { symbol: "♥", colorClass: "text-red-600", name: "Hearts" },
    { symbol: "♦", colorClass: "text-rose-600", name: "Diamonds" },
    { symbol: "♠", colorClass: "text-slate-900", name: "Spades" },
    { symbol: "♣", colorClass: "text-zinc-900", name: "Clubs" },
  ];
  return suits[Math.abs(hash) % suits.length];
};

// Deterministically map each unique emoji to a standard card rank (A, 2, ..., K)
const getCardRank = (emoji: string) => {
  let hash = 0;
  for (let i = 0; i < emoji.length; i++) {
    hash = emoji.charCodeAt(i) + ((hash << 5) - hash);
  }
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return ranks[Math.abs(hash) % ranks.length];
};

const getCardBackStyles = (id: string = "cardback_circle") => {
  return {
    bg: "bg-[#f1f5f9]",
    border: "border-indigo-500 hover:border-indigo-600",
    shadow: "rgba(79, 70, 229, 0.12)",
    stroke: "#4f46e5",
    patternColor: "rgba(79, 70, 229, 0.08)",
    patternColor2: "rgba(79, 70, 229, 0.05)",
    emblemColor: "#4f46e5",
  };
};

const renderCenterEmblem = (id: string, styles: any) => {
  switch (id) {
    case "cardback_triangle":
      return (
        <g>
          {/* Delicate outer guide circle */}
          <circle cx="50" cy="50" r="18" stroke={styles.stroke} strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="2 3" />
          {/* Outer Triangle */}
          <path d="M 50 29 L 68.18 60.5 L 31.82 60.5 Z" stroke={styles.stroke} strokeWidth="1" strokeOpacity="0.7" strokeLinejoin="round" />
          {/* Inner Triangle */}
          <path d="M 50 36 L 62.12 57 L 37.88 57 Z" fill={styles.emblemColor} fillOpacity="0.85" stroke={styles.stroke} strokeWidth="0.5" strokeLinejoin="round" />
          {/* Central Core */}
          <circle cx="50" cy="50" r="3" fill="#f1f5f9" />
          {/* Technical rays from vertices towards center */}
          <line x1="50" y1="29" x2="50" y2="40" stroke={styles.stroke} strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="68.18" y1="60.5" x2="59" y2="55" stroke={styles.stroke} strokeWidth="0.8" strokeOpacity="0.6" />
          <line x1="31.82" y1="60.5" x2="41" y2="55" stroke={styles.stroke} strokeWidth="0.8" strokeOpacity="0.6" />
        </g>
      );
    case "cardback_star":
      return (
        <g>
          {/* Outer concentric magical circles */}
          <circle cx="50" cy="50" r="20" stroke={styles.stroke} strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="16" stroke={styles.stroke} strokeWidth="0.8" strokeOpacity="0.5" />
          {/* Rotated star background */}
          <path d="M 50 32 L 62.73 50 L 50 67.27 L 37.27 50 Z" stroke={styles.stroke} strokeWidth="0.6" strokeOpacity="0.4" transform="rotate(45 50 50)" />
          {/* Major sharp 4-pointed star */}
          <path d="M 50 24 L 54 44 L 76 50 L 54 56 L 50 76 L 46 56 L 24 50 L 46 44 Z" fill={styles.emblemColor} fillOpacity="0.85" />
          {/* Inner core glow */}
          <circle cx="50" cy="50" r="2.5" fill="#f1f5f9" />
          {/* Sparkle dots around */}
          <circle cx="36" cy="36" r="1" fill={styles.emblemColor} fillOpacity="0.7" />
          <circle cx="64" cy="36" r="1" fill={styles.emblemColor} fillOpacity="0.7" />
          <circle cx="36" cy="64" r="1" fill={styles.emblemColor} fillOpacity="0.7" />
          <circle cx="64" cy="64" r="1" fill={styles.emblemColor} fillOpacity="0.7" />
        </g>
      );
    case "cardback_question_mark":
      return (
        <g>
          {/* Outer hexagonal tech border */}
          <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" stroke={styles.stroke} strokeWidth="0.8" strokeOpacity="0.5" />
          <polygon points="50,26 70,38 70,62 50,74 30,62 30,38" stroke={styles.stroke} strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="2 2" />
          
          {/* The stylized Question Mark */}
          <path d="M 42 41 C 42 33, 58 33, 58 41 C 58 46, 50 49, 50 54" stroke={styles.emblemColor} strokeWidth="2.8" strokeLinecap="round" fill="none" strokeOpacity="0.9" />
          {/* Stylish dot */}
          <circle cx="50" cy="62" r="2.2" fill={styles.emblemColor} />
          
          {/* Decorative crosshairs / cyber lines */}
          <line x1="50" y1="18" x2="50" y2="21" stroke={styles.stroke} strokeWidth="1" strokeOpacity="0.7" />
          <line x1="50" y1="79" x2="50" y2="82" stroke={styles.stroke} strokeWidth="1" strokeOpacity="0.7" />
        </g>
      );
    case "cardback_cross":
      return (
        <g>
          {/* Delicate outer circle */}
          <circle cx="50" cy="50" r="18" stroke={styles.stroke} strokeWidth="0.8" strokeOpacity="0.4" />
          <circle cx="50" cy="50" r="12" stroke={styles.stroke} strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="1 2" />
          
          {/* Faceted Crystal Cross */}
          {/* Top spike */}
          <path d="M 50 50 L 46 47 L 50 24 Z" fill={styles.emblemColor} fillOpacity="0.65" />
          <path d="M 50 50 L 50 24 L 54 47 Z" fill={styles.emblemColor} fillOpacity="0.9" />
          
          {/* Bottom spike */}
          <path d="M 50 50 L 46 53 L 50 76 Z" fill={styles.emblemColor} fillOpacity="0.65" />
          <path d="M 50 50 L 50 76 L 54 53 Z" fill={styles.emblemColor} fillOpacity="0.9" />
          
          {/* Left spike */}
          <path d="M 50 50 L 24 50 L 47 46 Z" fill={styles.emblemColor} fillOpacity="0.65" />
          <path d="M 50 50 L 47 54 L 24 50 Z" fill={styles.emblemColor} fillOpacity="0.9" />
          
          {/* Right spike */}
          <path d="M 50 50 L 53 46 L 76 50 Z" fill={styles.emblemColor} fillOpacity="0.65" />
          <path d="M 50 50 L 76 50 L 53 54 Z" fill={styles.emblemColor} fillOpacity="0.9" />

          {/* Center diamond cap */}
          <path d="M 50 46 L 54 50 L 50 54 L 46 50 Z" fill="#f1f5f9" fillOpacity="0.95" stroke={styles.stroke} strokeWidth="0.5" />
        </g>
      );
    case "cardback_diamond":
      return (
        <g>
          {/* Outer orbit circle */}
          <circle cx="50" cy="50" r="19" stroke={styles.stroke} strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="4 2" />
          
          {/* Outer Rhombus facets */}
          {/* Top-Left facet */}
          <path d="M 50 50 L 26 50 L 50 22 Z" fill={styles.emblemColor} fillOpacity="0.5" />
          {/* Top-Right facet */}
          <path d="M 50 50 L 50 22 L 74 50 Z" fill={styles.emblemColor} fillOpacity="0.7" />
          {/* Bottom-Left facet */}
          <path d="M 50 50 L 26 50 L 50 78 Z" fill={styles.emblemColor} fillOpacity="0.6" />
          {/* Bottom-Right facet */}
          <path d="M 50 50 L 50 78 L 74 50 Z" fill={styles.emblemColor} fillOpacity="0.85" />
          
          {/* Inner nested rhombus creating reflection */}
          <path d="M 50 35 L 61 50 L 50 65 L 39 50 Z" fill="#f1f5f9" fillOpacity="0.3" stroke="#f1f5f9" strokeWidth="0.5" />
          
          {/* Center glowing core */}
          <circle cx="50" cy="50" r="2.5" fill="#f1f5f9" />
        </g>
      );
    case "cardback_circle":
    default:
      return (
        <g>
          <circle cx="50" cy="50" r="18" stroke={styles.stroke} strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="3 2" />
          <circle cx="50" cy="50" r="14" stroke={styles.stroke} strokeWidth="0.6" strokeOpacity="0.3" />
          <circle cx="50" cy="50" r="10" stroke={styles.stroke} strokeWidth="1" strokeOpacity="0.7" strokeDasharray="1 3" />
          <circle cx="50" cy="50" r="7" stroke={styles.stroke} strokeWidth="1.5" strokeOpacity="0.9" fill={styles.emblemColor} fillOpacity="0.15" />
          <circle cx="50" cy="50" r="3" fill={styles.emblemColor} fillOpacity="0.9" />
          <circle cx="50" cy="50" r="1" fill="#f1f5f9" />
          {/* Symmetrical Orbiting Dots */}
          <circle cx="50" cy="30" r="1.5" fill={styles.emblemColor} fillOpacity="0.8" />
          <circle cx="50" cy="70" r="1.5" fill={styles.emblemColor} fillOpacity="0.8" />
          <circle cx="30" cy="50" r="1.5" fill={styles.emblemColor} fillOpacity="0.8" />
          <circle cx="70" cy="50" r="1.5" fill={styles.emblemColor} fillOpacity="0.8" />
        </g>
      );
  }
};

export const MemoryCard: React.FC<MemoryCardProps> = ({
  emoji,
  index,
  isRevealed,
  isMatched,
  isMismatch,
  isMatchedByP1 = true,
  onClick,
  equippedCardBackId = "cardback_circle",
  language = "en",
  isTutorialTarget = false,
}) => {
  const displayEmoji = emoji === "BLOCKED" ? "🗝️" : emoji;
  const suitInfo = getSuitInfo(displayEmoji);
  const rank = getCardRank(displayEmoji);
  const [isPressing, setIsPressing] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);
  const [recentlyMatched, setRecentlyMatched] = useState(false);
  const [burstParticles, setBurstParticles] = useState<Array<{ id: number; dx: number; dy: number; size: number; color: string; delay: number }>>([]);
  const styles = getCardBackStyles(equippedCardBackId);

  useEffect(() => {
    if (isMatched) {
      setRecentlyMatched(true);
      // Spawn 8 sparkle particles
      const pColor = isMatchedByP1 ? "#22c55e" : "#ef4444";
      const newParticles = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 8 + (Math.random() * 0.4 - 0.2);
        const speed = 25 + Math.random() * 25; // travel distance in px
        return {
          id: i,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          size: 3.5 + Math.random() * 4,
          color: Math.random() > 0.5 ? pColor : "#fbbf24", // mix target color & gold
          delay: Math.random() * 0.05,
        };
      });
      setBurstParticles(newParticles);

      // Glow is active for 220ms
      const glowTimer = setTimeout(() => {
        setRecentlyMatched(false);
      }, 220);

      // Particles disappear after 450ms
      const particlesTimer = setTimeout(() => {
        setBurstParticles([]);
      }, 450);

      return () => {
        clearTimeout(glowTimer);
        clearTimeout(particlesTimer);
      };
    } else {
      setRecentlyMatched(false);
      setBurstParticles([]);
    }
  }, [isMatched, isMatchedByP1]);

  const isTouch = typeof window !== "undefined" && (("ontouchstart" in window) || navigator.maxTouchPoints > 0);

  const handlePress = () => {
    if (isTouch) return; // Skip pressing scale animation on touch devices for smoother performance
    setIsPressing(true);
    setIsReturning(false);
    setTimeout(() => {
      setIsPressing(false);
      setIsReturning(true);
      setTimeout(() => {
        setIsReturning(false);
      }, 75);
    }, 75);
  };

  const handleCardClick = () => {
    if (emoji === "BLOCKED" || isRevealed || isMatched) return;

    if (isTouch) {
      // Snappy and direct click on touch devices to avoid lagging timeouts and jiggle effects
      onClick();
    } else {
      if (isJiggling) return;
      setIsJiggling(true);
      handlePress();

      setTimeout(() => {
        setIsJiggling(false);
        onClick();
      }, 65);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative w-full aspect-square cursor-pointer select-none group [perspective:1000px] poki-memory-card transition-all ease-out ${
        emoji === "BLOCKED"
          ? "cursor-not-allowed pointer-events-none"
          : isTouch
            ? "" // Disable hover/scale animations on touch devices during tap to save GPU painting layers
            : isPressing
              ? "duration-75 scale-[0.98]"
              : isReturning
                ? "duration-75 scale-100"
                : "duration-150 lg:hover:scale-[1.015] lg:hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.22),0_4px_10px_-2px_rgba(0,0,0,0.14)]"
      }`}
      id={`memory-card-container-${index}`}
    >
      {/* Tutorial Highlight Ring & Floating Pointer */}
      {isTutorialTarget && !isMatched && (
        <div className="absolute -inset-1 rounded-2xl ring-4 ring-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.9)] z-30 pointer-events-none animate-pulse scale-[1.02]" />
      )}

      {isTutorialTarget && !isMatched && (
        <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center animate-bounce">
          <div className="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full shadow-[0_4px_12px_rgba(245,158,11,0.5)] border border-amber-200 mb-0.5 tracking-wider animate-pulse">
            TAP!
          </div>
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
            👆
          </span>
        </div>
      )}

      {/* 3D Inner Card Wrapper */}
      <div
        className={`relative w-full h-full duration-500 transition-transform [transform-style:preserve-3d] ${
          isRevealed || isMatched || emoji === "BLOCKED" ? "[transform:rotateY(180deg)]" : ""
        } ${isMismatch && !isTouch ? "animate-shake" : ""} ${isJiggling && !isTouch ? "animate-card-jiggle" : ""}`}
      >
        
        {/* CARD FRONT (Face-Down State - Dual Layouts) */}
        {/* MOBILE/TABLET CARD BACK SIDE (Now matches Desktop Premium Design) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl ${styles.bg} border-2 ${styles.border} shadow-[0_6px_18px_-3px_rgba(0,0,0,0.16),0_2px_6px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.22),0_4px_10px_-2px_rgba(0,0,0,0.14)] transition-all duration-300 flex lg:hidden flex-col items-center justify-center [backface-visibility:hidden] overflow-hidden`}
        >
          {/* High-quality vector symmetrical pattern */}
          <svg
            className="absolute inset-0 w-full h-full p-1.5 pointer-events-none select-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Symmetrical grid pattern for premium texture */}
            <defs>
              <pattern id={`card-back-grid-mobile-${index}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke={styles.patternColor} strokeWidth="0.5" />
                <path d="M 0 10 L 10 0" fill="none" stroke={styles.patternColor2} strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#card-back-grid-mobile-${index})`} />

            {/* Symmetrical border frames */}
            <rect x="3" y="3" width="94" height="94" rx="8" stroke={styles.stroke} strokeWidth="1.2" strokeOpacity="0.8" />
            <rect x="6" y="6" width="88" height="88" rx="6" stroke={styles.stroke} strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="3 2" />

            {/* Symmetrical corner flourishes */}
            {/* Top-Left */}
            <path d="M 10 16 L 10 10 L 16 10" stroke={styles.stroke} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="13" cy="13" r="1" fill={styles.stroke} fillOpacity="0.8" />
            
            {/* Top-Right */}
            <path d="M 90 16 L 90 10 L 84 10" stroke={styles.stroke} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="87" cy="13" r="1" fill={styles.stroke} fillOpacity="0.8" />
            
            {/* Bottom-Left */}
            <path d="M 10 84 L 10 90 L 16 90" stroke={styles.stroke} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="13" cy="87" r="1" fill={styles.stroke} fillOpacity="0.8" />
            
            {/* Bottom-Right */}
            <path d="M 90 84 L 90 90 L 84 90" stroke={styles.stroke} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="87" cy="87" r="1" fill={styles.stroke} fillOpacity="0.8" />

            {/* Dynamic Center Symmetrical Emblem */}
            {renderCenterEmblem(equippedCardBackId, styles)}
          </svg>
        </div>

        {/* DESKTOP PREMIUM CARD BACK SIDE (Redesigned) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl ${styles.bg} border-2 ${styles.border} shadow-[0_6px_18px_-3px_rgba(0,0,0,0.16),0_2px_6px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.22),0_4px_10px_-2px_rgba(0,0,0,0.14)] transition-all duration-300 hidden lg:flex flex-col items-center justify-center [backface-visibility:hidden] overflow-hidden`}
        >
          {/* High-quality vector symmetrical pattern */}
          <svg
            className="absolute inset-0 w-full h-full p-1.5 pointer-events-none select-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Symmetrical grid pattern for premium texture */}
            <defs>
              <pattern id={`card-back-grid-${index}`} width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke={styles.patternColor} strokeWidth="0.5" />
                <path d="M 0 10 L 10 0" fill="none" stroke={styles.patternColor2} strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#card-back-grid-${index})`} />

            {/* Symmetrical border frames */}
            <rect x="3" y="3" width="94" height="94" rx="8" stroke={styles.stroke} strokeWidth="1.2" strokeOpacity="0.8" />
            <rect x="6" y="6" width="88" height="88" rx="6" stroke={styles.stroke} strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="3 2" />

            {/* Symmetrical corner flourishes */}
            {/* Top-Left */}
            <path d="M 10 16 L 10 10 L 16 10" stroke={styles.stroke} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="13" cy="13" r="1" fill={styles.stroke} fillOpacity="0.8" />
            
            {/* Top-Right */}
            <path d="M 90 16 L 90 10 L 84 10" stroke={styles.stroke} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="87" cy="13" r="1" fill={styles.stroke} fillOpacity="0.8" />
            
            {/* Bottom-Left */}
            <path d="M 10 84 L 10 90 L 16 90" stroke={styles.stroke} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="13" cy="87" r="1" fill={styles.stroke} fillOpacity="0.8" />
            
            {/* Bottom-Right */}
            <path d="M 90 84 L 90 90 L 84 90" stroke={styles.stroke} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.7" />
            <circle cx="87" cy="87" r="1" fill={styles.stroke} fillOpacity="0.8" />

            {/* Dynamic Center Symmetrical Emblem */}
            {renderCenterEmblem(equippedCardBackId, styles)}
          </svg>
        </div>

        {/* CARD BACK (Face-Up Revealed State - Traditional Playing Card Look & Feel) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-2 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] border transition-all duration-300 ${
            emoji === "BLOCKED"
              ? "bg-slate-50 border-slate-300 shadow-[0_6px_18px_-3px_rgba(0,0,0,0.14),0_2px_6px_-1px_rgba(0,0,0,0.08)]"
              : isMatched
                ? isMatchedByP1
                  ? `bg-[#f0fdf4] border-[#22c55e] ring-2 ring-[#22c55e]/25 shadow-[0_6px_18px_-3px_rgba(34,197,94,0.25),0_2px_6px_-1px_rgba(0,0,0,0.1)] ${
                      recentlyMatched 
                        ? "shadow-[0_0_20px_rgba(34,197,94,0.85)] border-[#4ade80] scale-[1.03]" 
                        : ""
                    }`
                  : `bg-[#fff5f5] border-[#ef4444] ring-2 ring-red-500/25 shadow-[0_6px_18px_-3px_rgba(239,68,68,0.25),0_2px_6px_-1px_rgba(0,0,0,0.1)] ${
                      recentlyMatched 
                        ? "shadow-[0_0_20px_rgba(239,68,68,0.85)] border-[#f87171] scale-[1.03]" 
                        : ""
                    }`
                : isMismatch
                  ? "bg-[#fef2f2] border-[#ef4444] ring-4 ring-red-500/30 shadow-[0_6px_18px_-3px_rgba(239,68,68,0.3)]"
                  : "bg-white border-slate-300 shadow-[0_6px_18px_-3px_rgba(0,0,0,0.16),0_2px_6px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.22),0_4px_10px_-2px_rgba(0,0,0,0.14)]"
          }`}
        >
          {/* Sparkle particles overlay */}
          {burstParticles.map((p) => (
            <div
              key={p.id}
              className="absolute left-1/2 top-1/2 rounded-full pointer-events-none z-50 animate-sparkle"
              style={{
                "--tx": `${p.dx}px`,
                "--ty": `${p.dy}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}`,
                transform: "translate(-50%, -50%)",
                animationDelay: `${p.delay}s`,
              } as React.CSSProperties}
            />
          ))}

          {/* Top-Left Corner: Rank and Suit */}
          <div className={`absolute top-[6%] left-[6%] flex flex-col items-start leading-none select-none ${emoji === "BLOCKED" ? "text-slate-400 saturate-50 opacity-60" : suitInfo.colorClass}`}>
            <span className="font-black font-mono" style={{ fontSize: "clamp(0.6rem, calc(var(--card-size, 60px) * 0.15), 1.35rem)" }}>{rank}</span>
            <span className="font-bold" style={{ fontSize: "clamp(0.6rem, calc(var(--card-size, 60px) * 0.15), 1.35rem)" }}>{suitInfo.symbol}</span>
          </div>

          {/* Checkmark indicator for matched pairs */}
          {isMatched && (
            <div className={`absolute top-[6%] right-[6%] rounded-full p-0.5 shadow-sm animate-bounce z-10 ${
              isMatchedByP1 ? "bg-[#22c55e] text-white" : "bg-[#ef4444] text-white"
            }`}>
              <Check className="w-3 h-3 stroke-[3.5]" />
            </div>
          )}

          {/* Centered Emoji Illustration */}
          <div className="flex-1 flex items-center justify-center relative">
            <span 
              className={`select-none transform transition-transform duration-300 ${
                emoji === "BLOCKED" 
                  ? "filter grayscale opacity-30 saturate-[0.3]" 
                  : isTouch ? "" : "group-hover:scale-110"
              }`}
              style={{ fontSize: "clamp(1.25rem, calc(var(--card-size, 60px) * 0.44), 6.5rem)" }}
            >
              {displayEmoji}
            </span>
          </div>

          {/* Subtle Dark Overlay (30-40% opacity) for locked/sealed card */}
          {emoji === "BLOCKED" && (
            <div className="absolute inset-0 rounded-2xl bg-slate-950/30 z-10 pointer-events-none" />
          )}

          {/* Large 🔒 lock icon in the center of the card on top of artwork */}
          {emoji === "BLOCKED" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
              <span className="filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] animate-pulse select-none" style={{ fontSize: "clamp(1.25rem, calc(var(--card-size, 60px) * 0.38), 4.5rem)" }}>🔒</span>
              <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-widest text-slate-200 bg-slate-950/70 px-1.5 py-0.5 rounded-md mt-1 border border-slate-700/50 shadow-md">
                {(TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en)?.lockedText?.toUpperCase() || "LOCKED"}
              </span>
            </div>
          )}

          {/* Bottom-Right Corner: Suit on top, Rank on bottom (No rotation, upright) */}
          <div className={`absolute bottom-[6%] right-[6%] flex flex-col items-end leading-none select-none ${emoji === "BLOCKED" ? "text-slate-400 saturate-50 opacity-60" : suitInfo.colorClass}`}>
            <span className="font-bold" style={{ fontSize: "clamp(0.6rem, calc(var(--card-size, 60px) * 0.15), 1.35rem)" }}>{suitInfo.symbol}</span>
            <span className="font-black font-mono" style={{ fontSize: "clamp(0.6rem, calc(var(--card-size, 60px) * 0.15), 1.35rem)" }}>{rank}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
