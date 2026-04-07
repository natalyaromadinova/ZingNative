// === Zing 🍊 — Нижняя навигация ===

import React from 'react';
import { Music, ListMusic, Radio, Info } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { Screen } from '../types';

interface NavItem {
  screen: Screen;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { screen: 'library', icon: <Music size={22} />, label: 'Библиотека' },
  { screen: 'playlists', icon: <ListMusic size={22} />, label: 'Плейлисты' },
  { screen: 'radio', icon: <Radio size={22} />, label: 'Радио' },
  { screen: 'info', icon: <Info size={22} />, label: 'О Zing' },
];

/** Нижняя навигация — 4 вкладки */
export const BottomNav: React.FC = () => {
  const { screen, setScreen } = usePlayer();

  return (
    <nav className="flex items-center justify-around bg-[#1A1A1A] border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      {navItems.map(item => {
        const active = screen === item.screen;
        return (
          <button
            key={item.screen}
            onClick={() => setScreen(item.screen)}
            className={`flex flex-col items-center gap-0.5 py-2 px-4 transition-colors ${
              active ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
