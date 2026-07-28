import React, { useRef, useEffect, memo } from "react";

interface CanvasCardProps {
  emoji: string;
  type: "left" | "right" | "memory";
  index: number;
  isFacedown?: boolean;
  isSelected?: boolean;
  isConnected?: boolean;
  isChecked?: boolean;
  isWrong?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CanvasCard: React.FC<CanvasCardProps> = ({
  emoji,
  type,
  index,
  isFacedown = false,
  isSelected = false,
  isConnected = false,
  isChecked = false,
  isWrong = false,
  onClick,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set logical display dimensions
    const width = type === "memory" ? 110 : 130;
    const height = type === "memory" ? 110 : 150;

    // Device Pixel Ratio scaling for outstanding high-res sharp graphics
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.scale(dpr, dpr);

    // Helper to draw clean rounded rectangles
    const drawRoundedRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // Card dimensions inner bounds
    const padding = 1.5;
    const cw = width - padding * 2;
    const ch = height - padding * 2;

    // --- RENDER PATTERN 1: CARD FACEDOWN (MEMORY GAME) ---
    if (isFacedown) {
      // Background gradient: Elegant midnight obsidian & sapphire aura
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        height * 0.7
      );
      grad.addColorStop(0, "#4f46e5"); // Indigo-600
      grad.addColorStop(0.5, "#312e81"); // Indigo-900
      grad.addColorStop(1, "#1e1b4b"); // Midnight slate

      // Draw outer card base
      drawRoundedRect(padding, padding, cw, ch, 14);
      ctx.fillStyle = grad;
      ctx.fill();

      // Shadow overlay
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;

      // Draw clean thin gold-colored border
      drawRoundedRect(padding + 3, padding + 3, cw - 6, ch - 6, 12);
      ctx.shadowColor = "transparent"; // Reset shadow
      ctx.strokeStyle = "#eab308"; // Gold border
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw another subtle inner line
      drawRoundedRect(padding + 6, padding + 6, cw - 12, ch - 12, 10);
      ctx.strokeStyle = "rgba(234, 179, 8, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw geometric central mandala pattern (procedural playing card back texture)
      const cx = width / 2;
      const cy = height / 2;

      // Draw diagonal cross lattice
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let offset = -40; offset <= 40; offset += 10) {
        ctx.moveTo(cx + offset - 30, cy - 30);
        ctx.lineTo(cx + offset + 30, cy + 30);
        ctx.moveTo(cx - offset - 30, cy + 30);
        ctx.lineTo(cx - offset + 30, cy - 30);
      }
      ctx.stroke();

      // Draw central ornate sacred geometry circles
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(234, 179, 8, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(234, 179, 8, 0.1)";
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Center decorative question / star mark
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", cx, cy - 0.5);

      // Mini corner back details
      const cSize = 10;
      ctx.strokeStyle = "rgba(234, 179, 8, 0.25)";
      ctx.lineWidth = 1;
      // Top-Left corner accent
      ctx.beginPath();
      ctx.moveTo(padding + 8, padding + 8 + cSize);
      ctx.lineTo(padding + 8, padding + 8);
      ctx.lineTo(padding + 8 + cSize, padding + 8);
      ctx.stroke();
      // Bottom-Right corner accent
      ctx.beginPath();
      ctx.moveTo(width - padding - 8, height - padding - 8 - cSize);
      ctx.lineTo(width - padding - 8, height - padding - 8);
      ctx.lineTo(width - padding - 8 - cSize, height - padding - 8);
      ctx.stroke();
    }
    // --- RENDER PATTERN 2: CARD FACEUP (GAME SYMBOLS ON PARCHMENT) ---
    else {
      // Elegant soft ivory/cream gradient to model real card depth
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isSelected) {
        bgGrad.addColorStop(0, "#f0fdfa"); // Teals
        bgGrad.addColorStop(1, "#ccfbf1");
      } else if (isChecked) {
        if (isWrong) {
          bgGrad.addColorStop(0, "#fff1f2"); // Gentle red
          bgGrad.addColorStop(1, "#ffe4e6");
        } else {
          bgGrad.addColorStop(0, "#f0fdf4"); // Beautiful emerald green
          bgGrad.addColorStop(1, "#dcfce7");
        }
      } else {
        bgGrad.addColorStop(0, "#ffffff");
        bgGrad.addColorStop(1, "#f8fafc"); // Slate soft-white
      }

      // Draw card backdrop
      drawRoundedRect(padding, padding, cw, ch, 14);
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Card shadow
      ctx.shadowColor = "rgba(15, 23, 42, 0.08)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // Draw border according to game state
      let borderStroke = "#e2e8f0"; // slate-200 default
      let borderWidth = 1.5;

      if (isSelected) {
        borderStroke = type === "left" ? "#06b6d4" : "#10b981"; // Cyan vs Emerald solid focus
        borderWidth = 3.5;
        // Draw elegant focus pulse ring
        ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
        drawRoundedRect(padding - 1, padding - 1, cw + 2, ch + 2, 15);
        ctx.lineWidth = 5;
        ctx.stroke();
      } else if (isChecked) {
        if (isWrong) {
          borderStroke = "#f43f5e"; // Rose error
          borderWidth = 3;
        } else {
          borderStroke = "#10b981"; // Emerald success
          borderWidth = 3;
        }
      } else if (isConnected) {
        borderStroke = "#cbd5e1"; // Connected slate indicator
        borderWidth = 1.5;
      }

      ctx.shadowColor = "transparent"; // reset shadow
      drawRoundedRect(padding, padding, cw, ch, 14);
      ctx.strokeStyle = borderStroke;
      ctx.lineWidth = borderWidth;
      ctx.stroke();

      // Draw beautiful central circular watermark coin texture
      const cx = width / 2;
      const cy = height / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, type === "memory" ? 30 : 36, 0, Math.PI * 2);
      ctx.fillStyle = isSelected 
        ? "rgba(6, 182, 212, 0.05)" 
        : isChecked 
          ? (isWrong ? "rgba(244, 63, 94, 0.04)" : "rgba(16, 185, 129, 0.05)")
          : "rgba(15, 23, 42, 0.02)";
      ctx.fill();

      // Double nested golden ring circles
      ctx.beginPath();
      ctx.arc(cx, cy, type === "memory" ? 28 : 34, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected 
        ? "rgba(6, 182, 212, 0.15)" 
        : isChecked 
          ? (isWrong ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.2)")
          : "rgba(148, 163, 184, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- TRADITIONAL CORNER ORNAMENTS (E.G. SUITS & VALUES) ---
      // Let's decide a suit emblem and values dynamically
      const cardNum = index + 1;
      let suit = "♦";
      let suitColor = "#ef4444"; // default red diamonds/hearts

      if (type === "left") {
        suit = "♦";
        suitColor = "#0891b2"; // cyan diamonds for left
      } else if (type === "right") {
        suit = "♠";
        suitColor = "#0f172a"; // dark slate spades for right
      } else {
        // memory cards alternates clubs♣ and hearts♥
        suit = cardNum % 2 === 0 ? "♥" : "♣";
        suitColor = cardNum % 2 === 0 ? "#ec4899" : "#1e1b4b";
      }

      const letterLabel = type === "left" ? "L" : type === "right" ? "R" : "M";

      // Top-Left corner: Key identifier (e.g. L-1 or M-4)
      ctx.font = "bold 10px monospace, system-ui";
      ctx.fillStyle = isChecked ? (isWrong ? "#be123c" : "#047857") : "#64748b";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`${letterLabel}${cardNum}`, padding + 8, padding + 7);

      // Suit badge right below the corner text
      ctx.font = "11px system-ui";
      ctx.fillStyle = suitColor;
      ctx.fillText(suit, padding + 8, padding + 18);

      // Bottom-Right corner: Mirror values reversed
      ctx.save();
      ctx.translate(width - padding - 8, height - padding - 7);
      ctx.rotate(Math.PI);
      
      ctx.font = "bold 10px monospace, system-ui";
      ctx.fillStyle = isChecked ? (isWrong ? "#be123c" : "#047857") : "#64748b";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(`${letterLabel}${cardNum}`, 0, 0);

      ctx.font = "11px system-ui";
      ctx.fillStyle = suitColor;
      ctx.fillText(suit, 0, 11);
      ctx.restore();

      // --- RENDER MAIN CENTER EMOJI ---
      ctx.font = type === "memory" ? "36px system-ui, sans-serif" : "44px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw subtle drop shadow for emoji to make it look physical
      ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2.5;

      ctx.fillText(emoji, cx, cy);
      ctx.shadowColor = "transparent"; // Reset shadow

      // Draw a subtle checked verification icon in card corners
      if (isChecked) {
        ctx.beginPath();
        ctx.arc(width - padding - 15, padding + 15, 6, 0, Math.PI * 2);
        ctx.fillStyle = isWrong ? "#ef4444" : "#10b981";
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        if (isWrong) {
          // Draw mini 'X'
          const rx = width - padding - 15;
          const ry = padding + 15;
          ctx.moveTo(rx - 2.5, ry - 2.5);
          ctx.lineTo(rx + 2.5, ry + 2.5);
          ctx.moveTo(rx + 2.5, ry - 2.5);
          ctx.lineTo(rx - 2.5, ry + 2.5);
        } else {
          // Draw mini Tick
          const rx = width - padding - 15;
          const ry = padding + 15;
          ctx.moveTo(rx - 3, ry);
          ctx.lineTo(rx - 1, ry + 2.1);
          ctx.lineTo(rx + 3, ry - 2);
        }
        ctx.stroke();
      }
    }
  }, [
    emoji,
    type,
    index,
    isFacedown,
    isSelected,
    isConnected,
    isChecked,
    isWrong,
  ]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onClick}
      className={`block select-none transition-all duration-300 ${className}`}
      style={{ cursor: "pointer" }}
    />
  );
};
