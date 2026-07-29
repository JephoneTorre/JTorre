"use client";

import React, { useRef, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

// Target position and radius for a particle in a specific image pose
interface ParticleTarget {
  x: number;
  y: number;
  r: number;
}

// Master particle — exists continuously throughout the component lifecycle
interface MasterParticle {
  id: number;
  targets: ParticleTarget[]; // targets[imgIndex] = { x, y, r } for each image
  noiseOffsetX: number;
  noiseOffsetY: number;
  phaseRadius: number;
  driftSpeed: number;
  pulseSpeed: number;
  isEdge: boolean;
  currPushX: number;
  currPushY: number;
  currGrow: number;
}

// Sequence state machine
interface SeqState {
  currentIndex: number;
  nextIndex: number;
  phase: "displaying" | "transitioning";
  phaseStart: number; // rAF timestamp of last phase change (-1 = uninitialised)
  transitionT: number; // 0 → 1 during transition
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface HalftonePortraitProps {
  /** Image sources in playback order (e.g. portrait, portrait_right, portrait, portrait_left, portrait). */
  srcs: string[];
  /** Milliseconds to display each image pose. Default 3000. */
  displayDuration?: number;
  /** Milliseconds for the continuous dot morphing transition between poses. Default 900. */
  transitionDuration?: number;
  /** Hexagonal grid cell spacing in CSS px. Default 6. */
  cellSize?: number;
  /** Dot fill colour. Default "#ffffff". */
  dotColor?: string;
  /** Canvas background colour. Default "#000000". */
  backgroundColor?: string;
  /** Base dot radius in CSS px. Default 2.8. */
  dotRadius?: number;
  /** Luminance threshold below which pixels are treated as shadow. Default 0.12. */
  shadowThreshold?: number;
  /** Structural grid jitter fraction (0–1). Default 0.15. */
  jitterAmount?: number;
  /** Optional fixed target index for controlled playback (e.g. scroll-triggered morphing). */
  targetIndex?: number;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HalftonePortrait({
  srcs,
  displayDuration = 3000,
  transitionDuration = 900,
  cellSize = 6,
  dotColor = "#ffffff",
  backgroundColor = "#000000",
  dotRadius = 2.8,
  shadowThreshold = 0.12,
  jitterAmount = 0.15,
  targetIndex,
  className = "",
}: HalftonePortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Persistent Master Particle Swarm ref
  const imgElementsRef = useRef<HTMLImageElement[]>([]);
  const masterParticlesRef = useRef<MasterParticle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const seqRef = useRef<SeqState>({
    currentIndex: 0,
    nextIndex: 0,
    phase: "displaying",
    phaseStart: -1,
    transitionT: 0,
  });

  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const srcsKey = srcs.join("|");

  // ── 1. prefers-reduced-motion ─────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // ── 2. Debounced ResizeObserver ───────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let tid: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width, height } = entries[0].contentRect;
      if (tid) clearTimeout(tid);
      tid = setTimeout(() => setDimensions({ width, height }), 100);
    });
    ro.observe(el);
    return () => {
      if (tid) clearTimeout(tid);
      ro.disconnect();
    };
  }, []);

  // ── 3. Load all sequence images upfront ───────────────────────────────────
  useEffect(() => {
    setAllImagesLoaded(false);

    const imgs = srcs.map((src) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      return img;
    });
    imgElementsRef.current = imgs;

    let loaded = 0;
    const total = imgs.length;
    const markDone = () => {
      loaded++;
      if (loaded >= total) setAllImagesLoaded(true);
    };

    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) markDone();
      else img.addEventListener("load", markDone, { once: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcsKey]);

  // ── 4. Generate Master Particle Swarm with 1-to-1 Image Targets ───────────
  const generateMasterParticles = () => {
    const imgs = imgElementsRef.current;
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0 || !imgs.length)
      return;

    const { width: cW, height: cH } = dimensions;
    const numImages = imgs.length;

    // Build offscreen canvas sampling contexts for all images
    const imgDataList: ImageData[] = [];
    const scaleInfoList: Array<{ scale: number; offX: number; offY: number }> = [];

    for (let k = 0; k < numImages; k++) {
      const img = imgs[k];
      const imgW = img.naturalWidth || 1;
      const imgH = img.naturalHeight || 1;

      const off = document.createElement("canvas");
      off.width = imgW;
      off.height = imgH;
      const offCtx = off.getContext("2d");
      if (offCtx) {
        offCtx.drawImage(img, 0, 0);
        try {
          imgDataList.push(offCtx.getImageData(0, 0, imgW, imgH));
        } catch {
          return;
        }
      }

      // Cover-fit mapping
      const rC = cW / cH;
      const rI = imgW / imgH;
      let scale: number, offX: number, offY: number;
      if (rC > rI) {
        scale = cW / imgW;
        offX = 0;
        offY = (cH - imgH * scale) / 2;
      } else {
        scale = cH / imgH;
        offX = (cW - imgW * scale) / 2;
        offY = 0;
      }
      scaleInfoList.push({ scale, offX, offY });
    }

    // Helper functions for pixel reading
    const getAlphaAt = (k: number, ix: number, iy: number) => {
      const data = imgDataList[k].data;
      const w = imgElementsRef.current[k].naturalWidth;
      const h = imgElementsRef.current[k].naturalHeight;
      const px = Math.max(0, Math.min(w - 1, Math.round(ix)));
      const py = Math.max(0, Math.min(h - 1, Math.round(iy)));
      return data[(py * w + px) * 4 + 3];
    };

    const getLumAt = (k: number, ix: number, iy: number) => {
      const data = imgDataList[k].data;
      const w = imgElementsRef.current[k].naturalWidth;
      const h = imgElementsRef.current[k].naturalHeight;
      const px = Math.max(0, Math.min(w - 1, Math.round(ix)));
      const py = Math.max(0, Math.min(h - 1, Math.round(iy)));
      const i = (py * w + px) * 4;
      return (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
    };

    const edgeFalloff = (a: number) => (a < 10 ? 0 : a >= 80 ? 1 : (a - 10) / 70);

    // Find nearest valid subject point in image k when grid position is outside silhouette
    const findNearestSubjectPoint = (k: number, cx: number, cy: number) => {
      const { scale, offX, offY } = scaleInfoList[k];
      const imgW = imgElementsRef.current[k].naturalWidth;
      const imgH = imgElementsRef.current[k].naturalHeight;

      let bestX = cx;
      let bestY = cy;
      let minSq = Infinity;
      const searchR = 50;

      for (let dy = -searchR; dy <= searchR; dy += cellSize) {
        for (let dx = -searchR; dx <= searchR; dx += cellSize) {
          const testX = cx + dx;
          const testY = cy + dy;
          const tIx = (testX - offX) / scale;
          const tIy = (testY - offY) / scale;
          if (tIx >= 0 && tIx < imgW && tIy >= 0 && tIy < imgH) {
            if (getAlphaAt(k, tIx, tIy) >= 10) {
              const sq = dx * dx + dy * dy;
              if (sq < minSq) {
                minSq = sq;
                bestX = testX;
                bestY = testY;
              }
            }
          }
        }
      }
      return { x: bestX, y: bestY };
    };

    // Check if we are in Light Mode (black/dark dots on light background)
    const bgHex = backgroundColor.replace("#", "");
    const isLightMode =
      backgroundColor === "#ffffff" ||
      backgroundColor.toLowerCase() === "white" ||
      (bgHex.length === 6 && parseInt(bgHex, 16) > 0x888888);

    // Hex grid iteration
    const rowH = cellSize * (Math.sqrt(3) / 2);
    const jitter = cellSize * jitterAmount;
    const particles: MasterParticle[] = [];

    for (let row = 0; row * rowH < cH + rowH * 2; row++) {
      const cy = row * rowH;
      const xOff = row % 2 === 1 ? cellSize / 2 : 0;

      for (let col = -1; col * cellSize + xOff < cW + cellSize; col++) {
        const cx = col * cellSize + xOff;
        const jx = cx + (Math.random() - 0.5) * jitter * 2;
        const jy = cy + (Math.random() - 0.5) * jitter * 2;

        // Check if this grid point touches the subject silhouette in AT LEAST ONE image
        let isSubjectInAnyImage = false;
        for (let k = 0; k < numImages; k++) {
          const { scale, offX, offY } = scaleInfoList[k];
          const imgW = imgElementsRef.current[k].naturalWidth;
          const imgH = imgElementsRef.current[k].naturalHeight;
          const ix = (jx - offX) / scale;
          const iy = (jy - offY) / scale;
          if (ix >= 0 && ix < imgW && iy >= 0 && iy < imgH) {
            if (getAlphaAt(k, ix, iy) >= 10) {
              isSubjectInAnyImage = true;
              break;
            }
          }
        }

        if (!isSubjectInAnyImage) continue; // Skip grid points completely outside the face bounds

        // Create target list for each image pose
        const targets: ParticleTarget[] = [];
        let isEdgeParticle = false;

        for (let k = 0; k < numImages; k++) {
          const { scale, offX, offY } = scaleInfoList[k];
          const imgW = imgElementsRef.current[k].naturalWidth;
          const imgH = imgElementsRef.current[k].naturalHeight;
          const ix = (jx - offX) / scale;
          const iy = (jy - offY) / scale;

          if (ix >= 0 && ix < imgW && iy >= 0 && iy < imgH) {
            const alpha = getAlphaAt(k, ix, iy);
            const lum = getLumAt(k, ix, iy);
            const falloff = edgeFalloff(alpha);

            if (falloff < 1.0) isEdgeParticle = true;

            if (alpha >= 10) {
              let r: number;
              if (isLightMode) {
                // In Light Mode (black ink on white paper):
                // Darker areas (hair, eyes, shadows) = larger black dots
                // Brighter areas (skin, highlights) = fine, subtle stipple dots
                const darkness = 1.0 - lum;
                if (darkness >= 0.25) {
                  // Hair, eyes, jawline, dark shadows -> strong bold dots
                  r = dotRadius * (0.65 + 0.75 * darkness) * falloff;
                } else {
                  // Skin highlights -> fine, crisp, elegant stipple dots
                  r = dotRadius * 0.35 * falloff;
                }
              } else {
                // In Dark Mode (white dots on black background):
                // Bright areas = larger white dots
                // Dark areas = small/subtle dots
                if (lum >= shadowThreshold) {
                  r = dotRadius * (0.6 + 0.6 * lum) * falloff;
                } else {
                  r = 0.5 * falloff;
                }
              }
              targets.push({ x: jx, y: jy, r: Math.max(0.5, r) });
            } else {
              // Outside3 silhouette in this image → glide to nearest subject contour point
              const nearPt = findNearestSubjectPoint(k, jx, jy);
              targets.push({ x: nearPt.x, y: nearPt.y, r: 0.5 });
            }
          } else {
            const nearPt = findNearestSubjectPoint(k, jx, jy);
            targets.push({ x: nearPt.x, y: nearPt.y, r: 0.5 });
          }
        }

        particles.push({
          id: particles.length,
          targets,
          noiseOffsetX: Math.random() * 200,
          noiseOffsetY: Math.random() * 200,
          phaseRadius: Math.random() * 200,
          driftSpeed: 0.2 + Math.random() * 0.45,
          pulseSpeed: 0.6 + Math.random() * 0.8,
          isEdge: isEdgeParticle,
          currPushX: 0,
          currPushY: 0,
          currGrow: 0,
        });
      }
    }

    masterParticlesRef.current = particles;

    // Reset sequence state
    seqRef.current = {
      currentIndex: 0,
      nextIndex: srcs.length > 1 ? 1 : 0,
      phase: "displaying",
      phaseStart: -1,
      transitionT: 0,
    };

    if (prefersReduced) renderStaticFrame();
  };

  // Trigger particle generation when images load, size changes, or theme colors change
  useEffect(() => {
    if (!allImagesLoaded || dimensions.width === 0 || dimensions.height === 0)
      return;

    generateMasterParticles();
    if (prefersReduced) renderStaticFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allImagesLoaded,
    dimensions,
    cellSize,
    dotRadius,
    shadowThreshold,
    jitterAmount,
    backgroundColor,
    dotColor,
    prefersReduced,
    srcsKey,
  ]);

  // Controlled targetIndex change handler
  useEffect(() => {
    if (targetIndex !== undefined && allImagesLoaded && srcs.length > 0) {
      const validTarget = Math.max(0, Math.min(srcs.length - 1, targetIndex));
      const seq = seqRef.current;
      if (seq.currentIndex !== validTarget || seq.nextIndex !== validTarget) {
        seq.nextIndex = validTarget;
        seq.phase = "transitioning";
        seq.phaseStart = performance.now();
        seq.transitionT = 0;
      }
    }
  }, [targetIndex, allImagesLoaded, srcs.length]);

  // ── 5. Static render (prefers-reduced-motion) ────────────────────────────
  const renderStaticFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = dotColor;

    for (const p of masterParticlesRef.current) {
      const target = p.targets[0] || { x: 0, y: 0, r: dotRadius };
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  // ── 6. Continuous Morphing Animation Loop ──────────────────────────────────
  useEffect(() => {
    if (prefersReduced) return;
    if (!allImagesLoaded || dimensions.width === 0 || dimensions.height === 0)
      return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;

    // Cubic ease-in-out curve for natural head turning motion
    const eio = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now: number) => {
      const seq = seqRef.current;
      const particles = masterParticlesRef.current;
      const N = srcs.length;

      if (seq.phaseStart < 0) seq.phaseStart = now;

      timeRef.current += 0.015;
      const t = timeRef.current;
      const mouse = mouseRef.current;
      const mRange = 75;

      const elapsed = now - seq.phaseStart;

      // Advance Sequence State Machine
      if (seq.phase === "displaying") {
        if (targetIndex === undefined && elapsed >= displayDuration) {
          seq.nextIndex = (seq.currentIndex + 1) % N;
          seq.phase = "transitioning";
          seq.phaseStart = now;
          seq.transitionT = 0;
        }
      } else {
        seq.transitionT = Math.min(1, elapsed / transitionDuration);
        if (seq.transitionT >= 1) {
          seq.currentIndex = seq.nextIndex;
          seq.phase = "displaying";
          seq.phaseStart = now;
          seq.transitionT = 0;
        }
      }

      // Compute interpolation factor (0 in displaying, cubic ease in transitioning)
      const ease =
        seq.phase === "transitioning" ? eio(seq.transitionT) : 0;
      const curIdx = seq.currentIndex;
      const nxtIdx = seq.nextIndex;

      // Render solid background color — no negative space flickers
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.fillStyle = dotColor;

      // Draw EVERY master particle continuously — ZERO dots pop, fade, or blink!
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const tCur = p.targets[curIdx] || { x: 0, y: 0, r: dotRadius };
        const tNxt = p.targets[nxtIdx] || { x: 0, y: 0, r: dotRadius };

        // Continuous spatial position and radius lerp
        const baseX = tCur.x + (tNxt.x - tCur.x) * ease;
        const baseY = tCur.y + (tNxt.y - tCur.y) * ease;
        const baseR = Math.max(0.5, tCur.r + (tNxt.r - tCur.r) * ease);

        // Organic idle drift
        const amp = p.isEdge ? 2.2 : 1.2;
        const driftX =
          Math.sin(t * p.driftSpeed + p.noiseOffsetX) * amp +
          Math.sin(t * p.driftSpeed * 0.51 + p.noiseOffsetX * 1.83) *
            (amp * 0.33);
        const driftY =
          Math.cos(t * p.driftSpeed * 0.78 + p.noiseOffsetY) * amp +
          Math.sin(t * p.driftSpeed * 0.37 + p.noiseOffsetY * 2.09) *
            (amp * 0.33);

        // Gentle radius pulse
        const pulse = Math.sin(t * p.pulseSpeed + p.phaseRadius) * 0.08;

        // Smooth interactive mouse push & grow
        let tPX = 0,
          tPY = 0,
          tGrow = 0;
        if (mouse.active) {
          const dx = baseX - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mRange) {
            const ef = Math.pow((mRange - dist) / mRange, 2);
            const angle =
              dist > 0 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2;
            tPX = Math.cos(angle) * ef * 14;
            tPY = Math.sin(angle) * ef * 14;
            tGrow = ef * 0.45;
          }
        }
        p.currPushX += (tPX - p.currPushX) * 0.12;
        p.currPushY += (tPY - p.currPushY) * 0.12;
        p.currGrow += (tGrow - p.currGrow) * 0.12;

        const drawR = Math.max(0.5, baseR * (1 + pulse + p.currGrow));

        ctx.beginPath();
        ctx.arc(
          baseX + driftX + p.currPushX,
          baseY + driftY + p.currPushY,
          drawR,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.restore();

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allImagesLoaded,
    dimensions,
    dotColor,
    displayDuration,
    transitionDuration,
    prefersReduced,
  ]);

  // ── 7. Mouse handlers ─────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseRef.current = {
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      active: true,
    };
  };
  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[300px] overflow-hidden select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}
