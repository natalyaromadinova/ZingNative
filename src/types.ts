// === Zing 🍊 — Типы данных ===

/** Трек */
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string; // blob URL для воспроизведения
  fileName: string;
  coverUrl?: string; // base64 или blob URL обложки
}

/** Плейлист */
export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
}

/** Режим повтора */
export type RepeatMode = 'off' | 'all' | 'one';

/** Экраны приложения */
export type Screen = 'library' | 'player' | 'playlists' | 'radio' | 'info';

/** Радио-станция (заглушка) */
export interface RadioStation {
  id: string;
  name: string;
  url: string;
  genre?: string;
}

/** Состояние плеера */
export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentIndex: number;
  queue: Track[];
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number;
  currentTime: number;
  duration: number;
}
