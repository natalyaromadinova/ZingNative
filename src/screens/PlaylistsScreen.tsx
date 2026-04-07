// === Zing 🍊 — Экран плейлистов ===

import React, { useState } from 'react';
import { Plus, Trash2, Edit3, ChevronLeft, Play, Music2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { TrackCover } from '../components/TrackCover';
import { formatTime } from '../utils/audioHelpers';
import { Playlist } from '../types';

/** Экран плейлистов — создание, редактирование, удаление */
export const PlaylistsScreen: React.FC = () => {
  const {
    playlists, tracks, createPlaylist, renamePlaylist,
    deletePlaylist, removeFromPlaylist, playTrack
  } = usePlayer();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Создание плейлиста
  const handleCreate = () => {
    if (newName.trim()) {
      createPlaylist(newName.trim());
      setNewName('');
      setShowCreate(false);
    }
  };

  // Переименование
  const handleRename = (id: string) => {
    if (editName.trim()) {
      renamePlaylist(id, editName.trim());
      setEditingId(null);
      setEditName('');
      // Обновим выбранный плейлист
      if (selectedPlaylist?.id === id) {
        setSelectedPlaylist(prev => prev ? { ...prev, name: editName.trim() } : null);
      }
    }
  };

  // Получить треки плейлиста
  const getPlaylistTracks = (pl: Playlist) => {
    return pl.trackIds.map(id => tracks.find(t => t.id === id)).filter(Boolean) as typeof tracks;
  };

  // === Детальный вид плейлиста ===
  if (selectedPlaylist) {
    const playlistTracks = getPlaylistTracks(selectedPlaylist);
    const totalDuration = playlistTracks.reduce((acc, t) => acc + t.duration, 0);

    return (
      <div className="flex flex-col h-full">
        {/* Заголовок */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="p-2 text-white/70 hover:text-white active:scale-90 transition-all -ml-2"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{selectedPlaylist.name}</h1>
            <p className="text-xs text-text-secondary">
              {playlistTracks.length} треков • {formatTime(totalDuration)}
            </p>
          </div>
          {playlistTracks.length > 0 && (
            <button
              onClick={() => playTrack(playlistTracks[0], playlistTracks)}
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center active:scale-90 transition-all"
            >
              <Play size={18} fill="#000" className="text-black ml-0.5" />
            </button>
          )}
        </div>

        {/* Треки */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {playlistTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
              <Music2 size={32} className="mb-2 opacity-50" />
              <p className="text-sm">Плейлист пуст</p>
              <p className="text-xs text-text-muted mt-1">Добавьте треки из библиотеки</p>
            </div>
          ) : (
            playlistTracks.map((track, idx) => (
              <div
                key={track.id}
                onClick={() => playTrack(track, playlistTracks)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
                           hover:bg-white/5 active:scale-[0.98] transition-all mb-0.5"
              >
                <span className="text-xs text-text-muted w-6 text-center">{idx + 1}</span>
                <TrackCover coverUrl={track.coverUrl} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-white">{track.title}</div>
                  <div className="text-xs text-text-secondary truncate">{track.artist}</div>
                </div>
                <span className="text-xs text-text-muted">{formatTime(track.duration)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromPlaylist(selectedPlaylist.id, track.id);
                    setSelectedPlaylist(prev => prev ? {
                      ...prev,
                      trackIds: prev.trackIds.filter(id => id !== track.id)
                    } : null);
                  }}
                  className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // === Список плейлистов ===
  return (
    <div className="flex flex-col h-full">
      {/* Заголовок */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Плейлисты</h1>
          <p className="text-xs text-text-secondary mt-0.5">{playlists.length} плейлистов</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light
                     text-black font-semibold rounded-full transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className="text-sm">Создать</span>
        </button>
      </div>

      {/* Диалог создания */}
      {showCreate && (
        <div className="px-4 pb-3 fade-in">
          <div className="flex items-center gap-2 p-3 bg-bg-card rounded-xl">
            <input
              type="text"
              placeholder="Название плейлиста..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
              className="flex-1 bg-transparent text-sm text-white placeholder-text-muted outline-none"
            />
            <button
              onClick={handleCreate}
              className="px-3 py-1.5 bg-accent text-black text-sm font-semibold rounded-lg active:scale-95"
            >
              ОК
            </button>
            <button
              onClick={() => { setShowCreate(false); setNewName(''); }}
              className="px-3 py-1.5 text-text-secondary text-sm hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Список */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-text-secondary">
            <ListPlaylistIcon />
            <p className="text-sm mt-3">Нет плейлистов</p>
            <p className="text-xs text-text-muted mt-1">Создайте свой первый плейлист</p>
          </div>
        ) : (
          playlists.map(pl => {
            const plTracks = getPlaylistTracks(pl);
            const isEditing = editingId === pl.id;

            return (
              <div
                key={pl.id}
                onClick={() => !isEditing && setSelectedPlaylist(pl)}
                className="flex items-center gap-3 p-3 bg-bg-card rounded-xl mb-2
                           cursor-pointer hover:bg-bg-elevated transition-all active:scale-[0.98]"
              >
                {/* Обложка (первый трек или placeholder) */}
                <div className="w-14 h-14 rounded-lg bg-bg-elevated flex items-center justify-center overflow-hidden flex-shrink-0">
                  {plTracks.length > 0 && plTracks[0].coverUrl ? (
                    <img src={plTracks[0].coverUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="text-2xl">🎵</span>
                  )}
                </div>

                {/* Информация */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleRename(pl.id)}
                      onBlur={() => handleRename(pl.id)}
                      autoFocus
                      className="w-full bg-transparent text-sm text-white outline-none border-b border-accent pb-1"
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <div className="text-sm font-semibold text-white truncate">{pl.name}</div>
                  )}
                  <div className="text-xs text-text-secondary mt-0.5">
                    {plTracks.length} треков
                  </div>
                </div>

                {/* Действия */}
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setEditingId(pl.id);
                      setEditName(pl.name);
                    }}
                    className="p-2 text-text-muted hover:text-accent transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deletePlaylist(pl.id)}
                    className="p-2 text-text-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/** Иконка-заглушка для пустого списка */
const ListPlaylistIcon = () => (
  <div className="w-16 h-16 rounded-full bg-bg-card flex items-center justify-center">
    <span className="text-3xl">📋</span>
  </div>
);
