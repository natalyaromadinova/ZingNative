// === Zing 🍊 — Контекст плеера (глобальное состояние) ===

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { Track, Playlist, RepeatMode, Screen } from '../types';
import { getPlaylists, savePlaylists, getVolume, saveVolume, generateId } from '../utils/storage';
import { shuffleArray } from '../utils/audioHelpers';

interface PlayerContextType {
  // Состояние плеера
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;

  // Библиотека и очередь
  tracks: Track[];
  queue: Track[];
  currentIndex: number;

  // Плейлисты
  playlists: Playlist[];

  // Экран
  screen: Screen;
  showPlayer: boolean;

  // Действия
  addTracks: (newTracks: Track[]) => void;
  removeTrack: (id: string) => void;
  playTrack: (track: Track, trackList?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;

  // Плейлисты
  createPlaylist: (name: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, trackIds: string[]) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;

  // Навигация
  setScreen: (s: Screen) => void;
  setShowPlayer: (v: boolean) => void;

  // Тост-уведомления
  toast: string;
  showToast: (msg: string) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  // Аудио элемент (один на всё приложение)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Состояние
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(getVolume);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playlists, setPlaylists] = useState<Playlist[]>(getPlaylists);
  const [screen, setScreen] = useState<Screen>('library');
  const [showPlayer, setShowPlayer] = useState(false);
  const [toast, setToast] = useState('');

  // Инициализация аудио элемента
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    // Обновление текущего времени
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => handleTrackEnd();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line
  }, []);

  // Тост
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

  // Обработка окончания трека
  const handleTrackEnd = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setRepeat(prev => {
      if (prev === 'one') {
        audio.currentTime = 0;
        audio.play();
        return prev;
      }

      setQueue(q => {
        setCurrentIndex(idx => {
          const nextIdx = idx + 1;
          if (nextIdx < q.length) {
            const next = q[nextIdx];
            setCurrentTrack(next);
            audio.src = next.url;
            audio.play();
            updateMediaSession(next);
            return nextIdx;
          } else if (prev === 'all' && q.length > 0) {
            const next = q[0];
            setCurrentTrack(next);
            audio.src = next.url;
            audio.play();
            updateMediaSession(next);
            return 0;
          } else {
            setIsPlaying(false);
            return idx;
          }
        });
        return q;
      });

      return prev;
    });
  }, []);

  // MediaSession API (управление с экрана блокировки)
  const updateMediaSession = useCallback((track: Track) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: 'Zing 🍊',
        artwork: track.coverUrl
          ? [{ src: track.coverUrl, sizes: '512x512', type: 'image/png' }]
          : []
      });
    }
  }, []);

  // Настройка MediaSession кнопок
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', () => togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => togglePlay());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) seekTo(details.seekTime);
    });
    // eslint-disable-next-line
  }, [queue, currentIndex]);

  // === Действия ===

  /** Добавить треки в библиотеку */
  const addTracks = useCallback((newTracks: Track[]) => {
    setTracks(prev => [...prev, ...newTracks]);
    showToast(`Добавлено треков: ${newTracks.length}`);
  }, [showToast]);

  /** Удалить трек из библиотеки */
  const removeTrack = useCallback((id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id));
    setPlaylists(prev => {
      const updated = prev.map(p => ({
        ...p,
        trackIds: p.trackIds.filter(tid => tid !== id)
      }));
      savePlaylists(updated);
      return updated;
    });
  }, []);

  /** Воспроизвести трек */
  const playTrack = useCallback((track: Track, trackList?: Track[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const list = trackList || tracks;
    let newQueue = shuffle ? shuffleArray(list) : [...list];

    // Ставим выбранный трек первым, если shuffle
    if (shuffle) {
      const idx = newQueue.findIndex(t => t.id === track.id);
      if (idx > 0) {
        [newQueue[0], newQueue[idx]] = [newQueue[idx], newQueue[0]];
      }
    }

    const playIdx = newQueue.findIndex(t => t.id === track.id);

    setQueue(newQueue);
    setCurrentIndex(playIdx >= 0 ? playIdx : 0);
    setCurrentTrack(track);

    audio.src = track.url;
    audio.play().catch(() => {});
    updateMediaSession(track);
  }, [tracks, shuffle, updateMediaSession]);

  /** Пауза/воспроизведение */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [currentTrack]);

  /** Следующий трек */
  const nextTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || queue.length === 0) return;

    let nextIdx = currentIndex + 1;
    if (nextIdx >= queue.length) {
      if (repeat === 'all') nextIdx = 0;
      else return;
    }

    const next = queue[nextIdx];
    setCurrentIndex(nextIdx);
    setCurrentTrack(next);
    audio.src = next.url;
    audio.play().catch(() => {});
    updateMediaSession(next);
  }, [queue, currentIndex, repeat, updateMediaSession]);

  /** Предыдущий трек */
  const prevTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || queue.length === 0) return;

    // Если прошло больше 3 секунд — перемотка в начало
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      if (repeat === 'all') prevIdx = queue.length - 1;
      else { audio.currentTime = 0; return; }
    }

    const prev = queue[prevIdx];
    setCurrentIndex(prevIdx);
    setCurrentTrack(prev);
    audio.src = prev.url;
    audio.play().catch(() => {});
    updateMediaSession(prev);
  }, [queue, currentIndex, repeat, updateMediaSession]);

  /** Перемотка */
  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  /** Установка громкости */
  const setVolumeFn = useCallback((v: number) => {
    const audio = audioRef.current;
    if (audio) audio.volume = v;
    setVolumeState(v);
    saveVolume(v);
  }, []);

  /** Переключить случайный порядок */
  const toggleShuffle = useCallback(() => {
    setShuffle(prev => {
      const next = !prev;
      showToast(next ? 'Случайный порядок: ВКЛ' : 'Случайный порядок: ВЫКЛ');
      if (next && queue.length > 0) {
        setQueue(q => {
          const current = q[currentIndex];
          const rest = q.filter((_, i) => i !== currentIndex);
          const shuffled = shuffleArray(rest);
          const newQueue = current ? [current, ...shuffled] : shuffled;
          setCurrentIndex(0);
          return newQueue;
        });
      }
      return next;
    });
  }, [queue, currentIndex, showToast]);

  /** Переключить режим повтора */
  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const next = modes[(modes.indexOf(prev) + 1) % modes.length];
      const labels = { off: 'Повтор: ВЫКЛ', all: 'Повтор: ВСЕ', one: 'Повтор: ОДИН' };
      showToast(labels[next]);
      return next;
    });
  }, [showToast]);

  // === Плейлисты ===

  const createPlaylist = useCallback((name: string) => {
    const pl: Playlist = { id: generateId(), name, trackIds: [], createdAt: Date.now() };
    setPlaylists(prev => {
      const updated = [...prev, pl];
      savePlaylists(updated);
      return updated;
    });
    showToast(`Плейлист "${name}" создан`);
  }, [showToast]);

  const renamePlaylist = useCallback((id: string, name: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, name } : p);
      savePlaylists(updated);
      return updated;
    });
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => {
      const updated = prev.filter(p => p.id !== id);
      savePlaylists(updated);
      return updated;
    });
    showToast('Плейлист удалён');
  }, [showToast]);

  const addToPlaylist = useCallback((playlistId: string, trackIds: string[]) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id !== playlistId) return p;
        const existing = new Set(p.trackIds);
        const newIds = trackIds.filter(id => !existing.has(id));
        return { ...p, trackIds: [...p.trackIds, ...newIds] };
      });
      savePlaylists(updated);
      return updated;
    });
    showToast('Треки добавлены в плейлист');
  }, [showToast]);

  const removeFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id !== playlistId) return p;
        return { ...p, trackIds: p.trackIds.filter(id => id !== trackId) };
      });
      savePlaylists(updated);
      return updated;
    });
  }, []);

  return (
    <PlayerContext.Provider value={{
      isPlaying, currentTrack, currentTime, duration, volume,
      shuffle, repeat, tracks, queue, currentIndex,
      playlists, screen, showPlayer, toast,
      addTracks, removeTrack, playTrack, togglePlay,
      nextTrack, prevTrack, seekTo,
      setVolume: setVolumeFn, toggleShuffle, toggleRepeat,
      createPlaylist, renamePlaylist, deletePlaylist,
      addToPlaylist, removeFromPlaylist,
      setScreen, setShowPlayer, showToast
    }}>
      {children}
    </PlayerContext.Provider>
  );
}
