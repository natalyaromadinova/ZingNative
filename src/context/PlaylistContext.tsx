// ========================================
// Zing 🍊 — Контекст плейлистов
// Хранение и управление плейлистами
// Адаптировано для React Native (AsyncStorage)
// ========================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track, Playlist } from '../types';

interface PlaylistContextType {
  playlists: Playlist[];
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, newName: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  getPlaylistTracks: (playlistId: string) => Track[];
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

const STORAGE_KEY = 'zing_playlists';

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // Загрузка плейлистов из AsyncStorage
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setPlaylists(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Ошибка загрузки плейлистов:', error);
      }
    };
    loadPlaylists();
  }, []);

  // Сохранение плейлистов в AsyncStorage
  useEffect(() => {
    const savePlaylists = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
      } catch (error) {
        console.error('Ошибка сохранения плейлистов:', error);
      }
    };
    savePlaylists();
  }, [playlists]);

  const createPlaylist = useCallback((name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: name.trim(),
      trackIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  }, []);

  const renamePlaylist = useCallback((id: string, newName: string) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === id ? { ...p, name: newName.trim(), updatedAt: Date.now() } : p
      )
    );
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId && !p.trackIds.includes(trackId)
          ? { ...p, trackIds: [...p.trackIds, trackId], updatedAt: Date.now() }
          : p
      )
    );
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? { ...p, trackIds: p.trackIds.filter(id => id !== trackId), updatedAt: Date.now() }
          : p
      )
    );
  }, []);

  const getPlaylistTracks = useCallback((playlistId: string): Track[] => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return [];
    // TODO: получить треки из глобального хранилища треков
    return [];
  }, [playlists]);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        getPlaylistTracks,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error('usePlaylist must be used within PlaylistProvider');
  return context;
};