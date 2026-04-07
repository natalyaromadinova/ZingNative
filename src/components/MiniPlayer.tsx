// === Zing 🍊 — Мини-плеер (панель внизу экрана) ===

import React from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackCover } from './TrackCover';
import { WaveAnimation } from './WaveAnimation';

/** Мини-плеер — показывается когда трек загружен */
export const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, setShowPlayer, currentTime, duration } = usePlayer();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative">
      {/* Полоска прогресса сверху */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#333]">
        <div
          className="h-full bg-accent transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] cursor-pointer"
        onClick={() => setShowPlayer(true)}
      >
        {/* Обложка */}
        <TrackCover
          coverUrl={currentTrack.coverUrl}
          size={44}
          isPlaying={isPlaying}
        />

        {/* Информация о треке */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate text-white">
            {currentTrack.title}
          </div>
          <div className="text-xs truncate text-text-secondary">
            {currentTrack.artist}
          </div>
        </div>

        {/* Волны (если играет) */}
        {isPlaying && (
          <WaveAnimation isPlaying={isPlaying} barCount={3} height={14} />
        )}

        {/* Кнопки управления */}
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={prevTrack}
            className="p-2 text-white/70 hover:text-white active:scale-90 transition-all"
          >
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 text-accent hover:text-accent-light active:scale-90 transition-all"
          >
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
          </button>
          <button
            onClick={nextTrack}
            className="p-2 text-white/70 hover:text-white active:scale-90 transition-all"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};
