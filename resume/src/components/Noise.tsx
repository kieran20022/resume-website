"use client";

import React, { useEffect, useRef } from "react";

/**
 * React Bits "Noise" animated film grain (reactbits.dev), adapted for this
 * site: fills its positioned parent instead of the viewport, uses inline
 * styles, only animates while on screen, and stays a static frame when the
 * visitor prefers reduced motion.
 */

export interface NoiseProps {
  /** Redraw the grain every N animation frames. */
  patternRefreshInterval?: number;
  /** 0-255 alpha of each grain pixel; lower is subtler. */
  patternAlpha?: number;
  style?: React.CSSProperties;
}

const Noise: React.FC<NoiseProps> = ({
  patternRefreshInterval = 2,
  patternAlpha = 15,
  style,
}) => {
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const canvasSize = 1024;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    let frame = 0;
    let rafId = 0;
    let visible = false;

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    drawGrain();

    // Reduced-motion visitors keep the texture but not the flicker.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const loop = () => {
      if (!visible) return;
      if (frame % patternRefreshInterval === 0) drawGrain();
      frame++;
      rafId = window.requestAnimationFrame(loop);
    };

    // Run the rAF loop only while the grain is actually on screen.
    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) rafId = window.requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      io.disconnect();
      window.cancelAnimationFrame(rafId);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={grainRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        imageRendering: "pixelated",
        ...style,
      }}
    />
  );
};

export default Noise;
