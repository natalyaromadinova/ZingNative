// === Zing 🍊 — Экран библиотеки ===

import React, { useRef, useState } from 'react';
import { Plus, Search, Trash2, MoreVertical, Music2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackCover } from '../components/TrackCover';
import { WaveAnimation } from '../components/WaveAnimation';
import { createTrackFromFile, isAudioFile, formatTime, AUDIO_ACCEPT } from '../utils/audioHelpers';

/** Экран библиотеки — список всех треков */
export const LibraryScreen: React.FC = () => {
  const { tracks, addTracks, removeTrack, playTrack, currentTrack, isPlaying, playlists, addToPlaylist } = usePlayer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{ trackId: string; x: number; y: number } | null>(null);

  // Фильтрация по поиску
  const filtered = tracks.filter(t => {
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q);
  });

  // Обработка выбора файлов
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const audioFiles = Array.from(files).filter(isAudioFile);
    if (audioFiles.length === 0) return;

    const newTracks = await Promise.all(audioFiles.map(createTrackFromFile));
    addTracks(newTracks);

    // Сброс input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Контекстное меню трека
  const handleContextMenu = (trackId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setContextMenu({ trackId, x: rect.right - 160, y: rect.bottom });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🍊</span> Zing
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {tracks.length > 0 ? `${tracks.length} треков` : 'Добавьте музыку'}
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light
                     text-black font-semibold rounded-full transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className="text-sm">Добавить</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={AUDIO_ACCEPT}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Поиск */}
      {tracks.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-card rounded-xl">
            <Search size={16} className="text-text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Поиск треков..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-text-muted outline-none"
            />
          </div>
        </div>
      )}

      {/* Список треков */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-24 h-24 rounded-full bg-bg-card flex items-center justify-center mb-4">
              <Music2 size={40} className="text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Библиотека пуста</h2>
            <p className="text-sm text-text-secondary mb-6">
              Нажмите «Добавить», чтобы выбрать аудиофайлы
              <br />с вашего устройства
            </p>
            <p className="text-xs text-text-muted">
              Поддерживаемые форматы: MP3, M4A, AAC, WAV, OGG, FLAC
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
            <Search size={32} className="mb-2 opacity-50" />
            <p className="text-sm">Ничего не найдено</p>
          </div>
        ) : (
          filtered.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track, filtered)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
                  transition-all active:scale-[0.98] mb-0.5
                  ${isCurrent ? 'bg-accent/10' : 'hover:bg-white/5'}`}
              >
                {/* Номер или волны */}
                <div className="w-7 flex items-center justify-center flex-shrink-0">
                  {isCurrent && isPlaying ? (
                    <WaveAnimation isPlaying={true} barCount={3} height={14} />
                  ) : (
                    <span className={`text-xs font-medium ${isCurrent ? 'text-accent' : 'text-text-muted'}`}>
                      {idx + 1}
                    </span>
                  )}
                </div>

                {/* Обложка */}
                <TrackCover coverUrl={track.coverUrl} size={44} />

                {/* Информация */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${isCurrent ? 'text-accent' : 'text-white'}`}>
                    {track.title}
                  </div>
                  <div className="text-xs text-text-secondary truncate">
                    {track.artist}
                  </div>
                </div>

                {/* Длительность */}
                <span className="text-xs text-text-muted flex-shrink-0">
                  {formatTime(track.duration)}
                </span>

                {/* Кнопка меню */}
                <button
                  onClick={(e) => handleContextMenu(track.id, e)}
                  className="p-1 text-text-muted hover:text-white transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Контекстное меню */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-bg-elevated rounded-xl shadow-2xl border border-white/10 py-1 min-w-[180px] fade-in"
            style={{ top: contextMenu.y, left: Math.min(contextMenu.x, window.innerWidth - 200) }}
          >
            {playlists.map(pl => (
              <button
                key={pl.id}
                onClick={() => {
                  addToPlaylist(pl.id, [contextMenu.trackId]);
                  setContextMenu(null);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <span className="text-accent">+</span> В «{pl.name}»
              </button>
            ))}
            <div className="border-t border-white/10 my-1" />
            <button
              onClick={() => {
                removeTrack(contextMenu.trackId);
                setContextMenu(null);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Trash2 size={14} /> Удалить из библиотеки
            </button>
          </div>
        </>
      )}
    </div>
  );
};
