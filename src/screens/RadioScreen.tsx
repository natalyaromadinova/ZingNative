// === Zing 🍊 — Экран Радио (v1.0 — заглушка) ===

import React, { useState } from 'react';
import { Radio, Plus, Play, Trash2, Globe } from 'lucide-react';
import { RadioStation } from '../types';
import { getRadioStations, saveRadioStations, generateId } from '../utils/storage';

/** Экран радио — базовая поддержка (заглушка с возможностью добавить URL) */
export const RadioScreen: React.FC = () => {
  const [stations, setStations] = useState<RadioStation[]>(getRadioStations);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [playing, setPlaying] = useState<string | null>(null);
  const [audioEl] = useState(() => new Audio());

  // Добавить станцию
  const handleAdd = () => {
    if (newName.trim() && newUrl.trim()) {
      const station: RadioStation = {
        id: generateId(),
        name: newName.trim(),
        url: newUrl.trim(),
        genre: 'Пользовательское'
      };
      const updated = [...stations, station];
      setStations(updated);
      saveRadioStations(updated);
      setNewName('');
      setNewUrl('');
      setShowAdd(false);
    }
  };

  // Удалить станцию
  const handleDelete = (id: string) => {
    if (playing === id) {
      audioEl.pause();
      audioEl.src = '';
      setPlaying(null);
    }
    const updated = stations.filter(s => s.id !== id);
    setStations(updated);
    saveRadioStations(updated);
  };

  // Воспроизвести/остановить
  const toggleStation = (station: RadioStation) => {
    if (playing === station.id) {
      audioEl.pause();
      audioEl.src = '';
      setPlaying(null);
    } else {
      audioEl.src = station.url;
      audioEl.play().catch(() => {});
      setPlaying(station.id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Radio size={24} className="text-accent" /> Радио
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">Потоковое вещание</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light
                     text-black font-semibold rounded-full transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className="text-sm">Добавить</span>
        </button>
      </div>

      {/* Форма добавления */}
      {showAdd && (
        <div className="px-4 pb-3 fade-in">
          <div className="p-3 bg-bg-card rounded-xl space-y-2">
            <input
              type="text"
              placeholder="Название станции..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full bg-bg-elevated text-sm text-white placeholder-text-muted
                         outline-none px-3 py-2 rounded-lg"
            />
            <input
              type="url"
              placeholder="URL потока (http://...)..."
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              className="w-full bg-bg-elevated text-sm text-white placeholder-text-muted
                         outline-none px-3 py-2 rounded-lg"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 px-3 py-2 bg-accent text-black text-sm font-semibold rounded-lg active:scale-95"
              >
                Добавить
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewName(''); setNewUrl(''); }}
                className="px-4 py-2 text-text-secondary text-sm hover:text-white"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Список станций */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {stations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-20 h-20 rounded-full bg-bg-card flex items-center justify-center mb-4">
              <Globe size={36} className="text-accent" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Нет станций</h2>
            <p className="text-sm text-text-secondary mb-4">
              Добавьте URL потока для прослушивания
              <br />интернет-радио
            </p>
            <p className="text-xs text-text-muted">
              Функция в разработке — v1.0
            </p>
          </div>
        ) : (
          stations.map(station => {
            const isActive = playing === station.id;
            return (
              <div
                key={station.id}
                className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-all
                  ${isActive ? 'bg-accent/15 border border-accent/30' : 'bg-bg-card hover:bg-bg-elevated'}`}
              >
                <button
                  onClick={() => toggleStation(station)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    transition-all active:scale-90
                    ${isActive ? 'bg-accent' : 'bg-bg-elevated'}`}
                >
                  {isActive ? (
                    <div className="flex items-center gap-0.5">
                      <div className="w-1 h-3 bg-black rounded-full animate-pulse" />
                      <div className="w-1 h-4 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  ) : (
                    <Play size={18} fill="currentColor" className="text-accent ml-0.5" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${isActive ? 'text-accent' : 'text-white'}`}>
                    {station.name}
                  </div>
                  <div className="text-xs text-text-muted truncate">{station.url}</div>
                </div>

                <button
                  onClick={() => handleDelete(station.id)}
                  className="p-2 text-text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
