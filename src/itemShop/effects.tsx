import React, { useEffect, useRef } from 'react';
import { CosmeticEffectType } from './itemTypes';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  angle: number;
  spin: number;
  color: string;
  driftFrequency: number;
  driftAmplitude: number;
  phase: number;
}

interface EnvironmentalEffectsProps {
  effectType: CosmeticEffectType | null;
}

export const EnvironmentalEffects: React.FC<EnvironmentalEffectsProps> = ({ effectType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const currentEffectRef = useRef<CosmeticEffectType | null>(effectType);

  // Keep effect type ref updated for animation loop
  useEffect(() => {
    currentEffectRef.current = effectType;
    // Re-initialize particles when effect changes
    if (canvasRef.current) {
      initParticles(canvasRef.current.width, canvasRef.current.height);
    }
  }, [effectType]);

  // Color lists for future effects
  const autumnColors = ['#f59e0b', '#d97706', '#b45309', '#ea580c', '#c2410c', '#dc2626'];
  const confettiColors = ['#f43f5e', '#3b82f6', '#10b981', '#eab308', '#a855f7', '#06b6d4', '#ff7849'];

  const createParticle = (width: number, height: number, initAtTop = false): Particle => {
    const type = currentEffectRef.current;
    const x = Math.random() * width;
    // If initAtTop, start above screen, else distribute vertically
    const y = initAtTop ? -15 : Math.random() * (height + 20) - 10;
    
    let size = 2;
    let speedY = 1;
    let speedX = 0;
    let opacity = 0.8;
    let angle = Math.random() * Math.PI * 2;
    let spin = 0;
    let color = '#ffffff';
    let driftFrequency = 0.01;
    let driftAmplitude = 1;
    const phase = Math.random() * Math.PI * 2;

    switch (type) {
      case 'snow':
        // Size: 1.5px to 4px
        size = Math.random() * 2.5 + 1.5;
        // Speed: 0.5 to 1.5
        speedY = Math.random() * 1.0 + 0.5;
        // Pure white/soft blue snowflake with variance in opacity
        color = Math.random() > 0.8 ? 'rgba(224, 242, 254, 0.9)' : 'rgba(255, 255, 255, 0.85)';
        driftFrequency = Math.random() * 0.01 + 0.005;
        driftAmplitude = Math.random() * 1.2 + 0.3;
        opacity = Math.random() * 0.5 + 0.4;
        break;

      case 'autumn':
        size = Math.random() * 10 + 8;
        speedY = Math.random() * 1.4 + 0.9;
        spin = (Math.random() - 0.5) * 0.025;
        color = autumnColors[Math.floor(Math.random() * autumnColors.length)];
        driftFrequency = Math.random() * 0.006 + 0.002;
        driftAmplitude = Math.random() * 1.8 + 0.6;
        opacity = Math.random() * 0.3 + 0.7;
        break;

      case 'fireflies':
        size = Math.random() * 3 + 2.5;
        speedY = -(Math.random() * 0.4 + 0.1); // Rise slowly upwards
        color = 'rgba(234, 224, 114, 0.85)'; // Glow gold/greenish yellow
        driftFrequency = Math.random() * 0.015 + 0.005;
        driftAmplitude = Math.random() * 2 + 1;
        opacity = Math.random() * 0.5 + 0.2;
        break;

      case 'hearts':
        size = Math.random() * 6 + 7;
        speedY = -(Math.random() * 0.6 + 0.3); // Floats upward
        spin = (Math.random() - 0.5) * 0.01;
        color = Math.random() > 0.4 ? 'rgba(244, 63, 94, 0.7)' : 'rgba(251, 113, 133, 0.65)';
        driftFrequency = Math.random() * 0.01 + 0.004;
        driftAmplitude = Math.random() * 1.5 + 0.5;
        opacity = Math.random() * 0.3 + 0.6;
        break;

      case 'bubbles':
        size = Math.random() * 8 + 6;
        speedY = -(Math.random() * 0.7 + 0.4); // Floats upward
        color = 'rgba(147, 197, 253, 0.4)'; // Iridescent bubble color
        driftFrequency = Math.random() * 0.012 + 0.006;
        driftAmplitude = Math.random() * 2.2 + 0.8;
        opacity = Math.random() * 0.25 + 0.35;
        break;

      case 'stars':
        size = Math.random() * 2 + 1.5;
        speedY = Math.random() * 0.3 + 0.2; // Slow vertical drift
        color = 'rgba(253, 224, 71, 0.9)'; // Twinkling bright yellow
        opacity = Math.random();
        break;

      case 'confetti':
        size = Math.random() * 6 + 5;
        speedY = Math.random() * 2.5 + 1.5;
        spin = (Math.random() - 0.5) * 0.08; // Faster spin
        color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        driftFrequency = Math.random() * 0.015 + 0.005;
        driftAmplitude = Math.random() * 2.5 + 0.5;
        opacity = Math.random() * 0.2 + 0.8;
        break;
    }

    return {
      x,
      y,
      size,
      speedY,
      speedX,
      opacity,
      angle,
      spin,
      color,
      driftFrequency,
      driftAmplitude,
      phase,
    };
  };

  const initParticles = (width: number, height: number) => {
    const type = currentEffectRef.current;
    if (!type) {
      particlesRef.current = [];
      return;
    }

    const isTouch = typeof window !== 'undefined' && (('ontouchstart' in window) || navigator.maxTouchPoints > 0);

    // Determine counts based on effect to keep it lightweight but visually pleasing
    let count = 25;
    if (type === 'snow') count = 55;
    if (type === 'stars') count = 35;

    // Halve the particle counts on touch devices to ensure high performance (60 FPS) on mobile/tablet screens
    if (isTouch) {
      count = Math.max(8, Math.floor(count / 2.5));
    }

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push(createParticle(width, height, false));
    }
    particlesRef.current = newParticles;
  };

  const drawSakuraPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.beginPath();
    
    // Realistic cherry blossom petal path with cleft/notch at the outer tip
    ctx.moveTo(0, 0);
    // Left edge curves out to left tip lobe
    ctx.bezierCurveTo(-p.size * 0.4, -p.size * 0.2, -p.size * 0.6, -p.size * 0.7, -p.size * 0.45, -p.size * 0.95);
    // Left lobe peak to the central tip notch cleft
    ctx.bezierCurveTo(-p.size * 0.35, -p.size * 1.05, -p.size * 0.15, -p.size * 0.88, 0, -p.size * 0.8);
    // Notch cleft to the right lobe peak
    ctx.bezierCurveTo(p.size * 0.15, -p.size * 0.88, p.size * 0.35, -p.size * 1.05, p.size * 0.45, -p.size * 0.95);
    // Right lobe peak down to narrow base
    ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.7, p.size * 0.4, -p.size * 0.2, 0, 0);
    
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    
    // Realistic central petal vein for depth
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -p.size * 0.65);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    
    ctx.restore();
  };

  const drawSnowflake = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.beginPath();
    const s = p.size;
    ctx.moveTo(0, s / 4);
    ctx.quadraticCurveTo(-s / 2, -s / 2, -s, s / 4);
    ctx.quadraticCurveTo(-s, s, 0, s * 1.4);
    ctx.quadraticCurveTo(s, s, s, s / 4);
    ctx.quadraticCurveTo(s / 2, -s / 2, 0, s / 4);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    ctx.restore();
  };

  const drawBubble = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    
    // Inner bubble gradient reflection
    const grad = ctx.createRadialGradient(
      p.x - p.size / 3, p.y - p.size / 3, p.size * 0.1,
      p.x, p.y, p.size
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.2, 'rgba(244, 63, 94, 0.25)'); // Pink sheen
    grad.addColorStop(0.5, 'rgba(147, 197, 253, 0.15)'); // Blue sheen
    grad.addColorStop(0.9, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 0.75;
    ctx.stroke();

    ctx.fillStyle = grad;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
  };

  const drawRaindrop = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.size);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = p.opacity;
    ctx.stroke();
  };

  const drawLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.beginPath();
    // Beautiful leaf shape
    ctx.moveTo(0, -p.size / 2);
    ctx.quadraticCurveTo(-p.size / 2, 0, 0, p.size / 2);
    ctx.quadraticCurveTo(p.size / 2, 0, 0, -p.size / 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    ctx.restore();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, p: Particle, time: number) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    // Twinkling effect based on sine wave
    const pulse = Math.abs(Math.sin(time * 0.003 + p.phase));
    const size = p.size * (1 + pulse * 0.4);
    
    ctx.beginPath();
    // Simple 4-point star spike path
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.fillStyle = p.color;
    // Twinkling opacity fluctuation
    ctx.globalAlpha = p.opacity * (0.3 + pulse * 0.7);
    ctx.fill();
    ctx.restore();
  };

  const drawConfettiItem = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.beginPath();
    
    // Either a rectangle or triangle confetti
    if (p.phase > Math.PI) {
      ctx.rect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      ctx.moveTo(-p.size / 2, -p.size / 2);
      ctx.lineTo(p.size / 2, -p.size / 2);
      ctx.lineTo(0, p.size / 2);
      ctx.closePath();
    }
    
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    ctx.restore();
  };

  // Main high performance tick loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;

    const tick = (timestamp: number) => {
      const type = currentEffectRef.current;
      if (!type) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Update physics
        p.y += p.speedY;
        
        // Horizontal drift calculation using sine wave to simulate gentle swaying wind
        const drift = Math.sin(p.y * p.driftFrequency + p.phase) * p.driftAmplitude;
        p.x += p.speedX + drift;
        
        // Rotate
        p.angle += p.spin;

        // Render each effect
        if (type === 'snow') {
          drawSnowflake(ctx, p);
        } else if (type === 'autumn') {
          drawLeaf(ctx, p);
        } else if (type === 'fireflies') {
          drawSnowflake(ctx, p); // Circular glow
        } else if (type === 'hearts') {
          drawHeart(ctx, p);
        } else if (type === 'bubbles') {
          drawBubble(ctx, p);
        } else if (type === 'stars') {
          drawStar(ctx, p, timestamp);
        } else if (type === 'confetti') {
          drawConfettiItem(ctx, p);
        }

        // Boundary recycling: if exit screen left, right, bottom, or top (for fireflies rising)
        const isPastBottom = p.y > canvas.height + 15;
        const isPastTop = p.y < -15;
        const isPastRight = p.x > canvas.width + 15;
        const isPastLeft = p.x < -15;

        const isRising = p.speedY < 0;

        if (
          (!isRising && isPastBottom) ||
          (isRising && isPastTop) ||
          isPastRight ||
          isPastLeft
        ) {
          // Recycle/respawn particle at the opposite side cleanly
          const recycled = createParticle(canvas.width, canvas.height, true);
          p.x = recycled.x;
          p.y = isRising ? canvas.height + 10 : -10;
          p.size = recycled.size;
          p.speedY = recycled.speedY;
          p.speedX = recycled.speedX;
          p.opacity = recycled.opacity;
          p.color = recycled.color;
          p.angle = recycled.angle;
        }
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Use ResizeObserver for responsive fluid resizing without canvas stretching
  useEffect(() => {
    const parent = containerRef.current;
    const canvas = canvasRef.current;
    if (!parent || !canvas) return;

    let resizeRafId: number | null = null;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (width <= 0 || height <= 0) return;
      
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }

      resizeRafId = requestAnimationFrame(() => {
        if (!canvas) return;
        if (canvas.width !== Math.floor(width) || canvas.height !== Math.floor(height)) {
          canvas.width = Math.floor(width);
          canvas.height = Math.floor(height);
          // Re-initialize particles to fill the new dimension bounds
          initParticles(canvas.width, canvas.height);
        }
      });
    });

    resizeObserver.observe(parent);

    return () => {
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-[1] select-none overflow-hidden rounded-2xl sm:rounded-3xl"
      style={{ pointerEvents: 'none' }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block pointer-events-none"
        style={{ mixBlendMode: 'normal', pointerEvents: 'none' }}
      />
    </div>
  );
};
