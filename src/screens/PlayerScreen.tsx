// === Zing 🍊 — Полноэкранный плеер ===

import React, { useState } from 'react';
import {
  ChevronDown, Play, Pause, SkipForward, SkipBack,
  Shuffle, Repeat, Repeat1, Volume2, VolumeX, Heart, ListMusic
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackCover } from '../components/TrackCover';
import { formatTime } from '../utils/audioHelpers';

/** Полноэкранный плеер */
export const PlayerScreen: React.FC = () => {
  const {
    currentTrack, isPlaying, currentTime, duration,
    volume, shuffle, repeat,
    togglePlay, nextTrack, prevTrack, seekTo,
    setVolume, toggleShuffle, toggleRepeat,
    setShowPlayer, queue, currentIndex
  } = usePlayer();

  const [liked, setLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary flex flex-col slide-up">
      {/* Фоновый градиент */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #FF8C42 0%, transparent 70%)',
        }}
      />

      {/* Верхняя панель */}
      <div className="relative flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setShowPlayer(false)}
          className="p-2 text-white/70 hover:text-white active:scale-90 transition-all"
        >
          <ChevronDown size={28} />
        </button>
        <div className="text-center">
          <div className="text-xs text-text-secondary uppercase tracking-wider">Сейчас играет</div>
          <div className="text-xs text-accent font-medium mt-0.5">
            {currentIndex + 1} / {queue.length}
          </div>
        </div>
        <button
          onClick={() => setShowQueue(prev => !prev)}
          className={`p-2 transition-all active:scale-90 ${showQueue ? 'text-accent' : 'text-white/70 hover:text-white'}`}
        >
          <ListMusic size={24} />
        </button>
      </div>

      {showQueue ? (
        /* === Очередь воспроизведения === */
        <div className="relative flex-1 overflow-y-auto px-4 pb-4">
          <h3 className="text-lg font-bold text-white mb-3">Очередь</h3>
          {queue.map((track, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={`${track.id}-${idx}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all
                  ${isCurrent ? 'bg-accent/15' : 'hover:bg-white/5'}`}
              >
                <span className={`text-xs w-6 text-center ${isCurrent ? 'text-accent font-bold' : 'text-text-muted'}`}>
                  {idx + 1}
                </span>
                <TrackCover coverUrl={track.coverUrl} size={36} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm truncate ${isCurrent ? 'text-accent' : 'text-white'}`}>{track.title}</div>
                  <div className="text-xs text-text-secondary truncate">{track.artist}</div>
                </div>
                <span className="text-xs text-text-muted">{formatTime(track.duration)}</span>
              </div>
            );
          })}
        </div>
      ) : (
        /* === Основной вид === */
        <div className="relative flex-1 flex flex-col items-center justify-center px-8 gap-6">
          {/* Обложка */}
          <div className="w-full max-w-[280px] aspect-square">
            <TrackCover
              coverUrl={currentTrack.coverUrl}
              size={280}
              isPlaying={isPlaying}
              rounded
              className="w-full h-full shadow-2xl"
            />
          </div>

          {/* Информация о треке */}
          <div className="w-full text-center max-w-[320px]">
            <h2 className="text-xl font-bold text-white truncate">{currentTrack.title}</h2>
            <p className="text-sm text-text-secondary truncate mt-1">{currentTrack.artist}</p>
          </div>

          {/* Прогресс-бар */}
          <div className="w-full max-w-[320px]">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={e => seekTo(parseFloat(e.target.value))}
              className="w-full h-6 progress-track"
              style={{ '--progress': `${progress}%` } as React.CSSProperties}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-text-muted">{formatTime(currentTime)}</span>
              <span className="text-xs text-text-muted">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Основные кнопки управления */}
          <div className="flex items-center justify-center gap-6 w-full max-w-[320px]">
            <button
              onClick={toggleShuffle}
              className={`p-2 transition-all active:scale-90 ${shuffle ? 'text-accent' : 'text-white/50 hover:text-white'}`}
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={prevTrack}
              className="p-3 text-white hover:text-accent active:scale-90 transition-all"
            >
              <SkipBack size={28} fill="currentColor" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-accent hover:bg-accent-light flex items-center justify-center
                         active:scale-90 transition-all shadow-lg shadow-accent/30"
            >
              {isPlaying
                ? <Pause size={30} fill="#000" className="text-black" />
                : <Play size={30} fill="#000" className="text-black ml-1" />
              }
            </button>

            <button
              onClick={nextTrack}
              className="p-3 text-white hover:text-accent active:scale-90 transition-all"
            >
              <SkipForward size={28} fill="currentColor" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 transition-all active:scale-90 ${repeat !== 'off' ? 'text-accent' : 'text-white/50 hover:text-white'}`}
            >
              {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
          </div>

          {/* Дополнительные кнопки */}
          <div className="flex items-center justify-between w-full max-w-[320px] px-2">
            <button
              onClick={() => setLiked(prev => !prev)}
              className={`p-2 transition-all active:scale-90 ${liked ? 'text-red-500' : 'text-white/50 hover:text-white'}`}
            >
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
            </button>

            {/* Громкость */}
            <div className="flex items-center gap-2 flex-1 max-w-[200px] mx-4">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 1)}
                className="text-white/50 hover:text-white transition-colors"
              >
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-6 volume-track"
                style={{ '--volume': `${volume * 100}%` } as React.CSSProperties}
              />
            </div>

            <div className="w-8" />
          </div>
        </div>
      )}
    </div>
  );
};
