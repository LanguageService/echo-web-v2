"use client";

import { useEffect, useRef } from "react";

interface LiveWaveformProps {
  /** Pass the live AnalyserNode when recording, null when stopped */
  analyser: AnalyserNode | null;
  /** Number of bars to draw (default 40) */
  bars?: number;
  /** Canvas height in px (default 72) */
  height?: number;
  className?: string;
}

export default function LiveWaveform({
  analyser,
  bars = 40,
  height = 72,
  className = "",
}: LiveWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  // Per-bar smoothed amplitudes (exponential moving average)
  const smoothedRef = useRef<Float32Array>(new Float32Array(bars));
  // Phase offset for idle sine-wave animation
  const idlePhaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset smoothing state whenever the analyser node changes
    smoothedRef.current = new Float32Array(bars);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const barW = Math.max(2, Math.floor((W - (bars - 1) * 2) / bars));
      const gap = 2;
      const smoothed = smoothedRef.current;
      // Alpha: how fast bars respond (0 = frozen, 1 = instant). 0.25 = smooth.
      const ALPHA = 0.25;

      if (!analyser) {
        // ── Idle state: animated sine-wave ripple ──
        idlePhaseRef.current += 0.04;
        const phase = idlePhaseRef.current;
        for (let i = 0; i < bars; i++) {
          const wave = Math.sin(phase + (i / bars) * Math.PI * 2);
          const barH = 4 + (wave + 1) * 3; // oscillates between 4 and 10 px
          const x = i * (barW + gap);
          const r = Math.min(barW / 2, barH / 2, 4);
          ctx.fillStyle = "rgba(156,163,175,0.35)";
          ctx.beginPath();
          ctx.roundRect(x, H / 2 - barH / 2, barW, barH, r);
          ctx.fill();
        }
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // ── Recording state: time-domain RMS per bar ──
      // getByteTimeDomainData gives real waveform amplitude — always alive, even at low volume
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      const step = Math.max(1, Math.floor(bufferLength / bars));

      for (let i = 0; i < bars; i++) {
        // RMS amplitude of this bar's time-domain chunk (samples centered around 0)
        let sumSq = 0;
        for (let j = 0; j < step; j++) {
          const sample = (dataArray[i * step + j] ?? 128) - 128;
          sumSq += sample * sample;
        }
        const rms = Math.sqrt(sumSq / step); // 0–128

        // Normalize to 0–1 then apply exponential smoothing
        const normalized = rms / 128;
        smoothed[i] = smoothed[i] + ALPHA * (normalized - smoothed[i]);

        // Enforce a minimum fraction so bars are always visibly moving when recording
        const MIN_FRACTION = 0.09;
        const fraction = Math.max(smoothed[i], MIN_FRACTION);
        const barH = Math.max(6, fraction * H * 0.92);

        const x = i * (barW + gap);
        const y = (H - barH) / 2;

        // Color intensity scales with amplitude
        const intensity = Math.min(1, fraction * 2.2);
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0,   `rgba(239,68,68,${0.55 + intensity * 0.45})`);
        grad.addColorStop(0.5, `rgba(249,115,22,${0.45 + intensity * 0.55})`);
        grad.addColorStop(1,   `rgba(239,68,68,${0.55 + intensity * 0.45})`);

        ctx.fillStyle = grad;
        const radius = Math.min(barW / 2, barH / 2, 6);
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, radius);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [analyser, bars, height]);

  const WIDTH = bars * 10 + (bars - 1) * 2;

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={height}
      className={className}
      style={{ width: `${WIDTH}px`, height: `${height}px` }}
    />
  );
}
