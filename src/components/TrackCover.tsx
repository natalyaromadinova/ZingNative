// === Zing 🍊 — Обложка трека ===

import React from 'react';

interface TrackCoverProps {
  coverUrl?: string;
  size?: number;
  isPlaying?: boolean;
  rounded?: boolean;
  className?: string;
}

/** Компонент обложки трека — показывает обложку или плейсхолдер 🍊 */
export const TrackCover: React.FC<TrackCoverProps> = ({
  coverUrl,
  size = 48,
  isPlaying = false,
  rounded = false,
  className = ''
}) => {
  const baseClasses = `flex items-center justify-center overflow-hidden flex-shrink-0 ${
    rounded ? 'rounded-full' : 'rounded-xl'
  } ${isPlaying ? 'cover-playing' : ''} ${className}`;

  if (coverUrl) {
    return (
      <div className={baseClasses} style={{ width: size, height: size }}>
        <img
          src={coverUrl}
          alt="Cover"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  // Плейсхолдер — мандаринка в наушниках
  return (
    <div
      className={baseClasses}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B1A 50%, #E55A00 100%)',
      }}
    >
      <img
        src="/images/zing-cover.png"
        alt="Zing"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Фоллбэк на эмодзи если картинка не загрузилась
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).parentElement!.innerHTML = `<span style="font-size:${size * 0.45}px">🍊</span>`;
        }}
      />
    </div>
  );
};
