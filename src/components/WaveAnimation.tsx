// === Zing 🍊 — Анимированные волны (индикатор воспроизведения) ===

import React from 'react';

interface WaveAnimationProps {
  isPlaying: boolean;
  barCount?: number;
  color?: string;
  height?: number;
}

/** Анимированные волны рядом с играющим треком */
export const WaveAnimation: React.FC<WaveAnimationProps> = ({
  isPlaying,
  barCount = 4,
  color = '#FF8C42',
  height = 16
}) => {
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="rounded-full wave-bar"
          style={{
            width: 3,
            minHeight: 3,
            backgroundColor: color,
            animationDelay: `${i * 0.15}s`,
            animationPlayState: isPlaying ? 'running' : 'paused',
            height: isPlaying ? undefined : 4
          }}
        />
      ))}
    </div>
  );
};
