// === Zing 🍊 — Экран информации ===

import React from 'react';
import { Heart, Coffee, Code, Headphones, Smartphone, Terminal } from 'lucide-react';

/** Экран информации — о приложении, разработчик, поддержка */
export const InfoScreen: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex-1 px-6 py-8 flex flex-col items-center">

        {/* Логотип */}
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#FF8C42] to-[#E55A00]
                        flex items-center justify-center shadow-lg shadow-accent/30 mb-4 overflow-hidden">
          <img src="/images/zing-cover.png" alt="Zing" className="w-full h-full object-cover"
               onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style=\"font-size:3.5rem\">🍊</span>'; }} />
        </div>

        <h1 className="text-3xl font-bold text-white">Zing</h1>
        <p className="text-sm text-accent font-medium mt-1">Музыкальный плеер</p>
        <p className="text-xs text-text-muted mt-1">Версия 1.0.0</p>

        {/* Разделитель */}
        <div className="w-12 h-0.5 bg-accent/30 rounded-full my-6" />

        {/* О приложении */}
        <div className="w-full max-w-sm space-y-3">
          <InfoCard
            icon={<Code size={20} className="text-accent" />}
            title="Разработчик"
            subtitle="@AsterBackinBlack"
          />
          <InfoCard
            icon={<Headphones size={20} className="text-accent" />}
            title="Форматы"
            subtitle="MP3, M4A, AAC, WAV, OGG, FLAC"
          />
          <InfoCard
            icon={<Smartphone size={20} className="text-accent" />}
            title="Платформа"
            subtitle="Web PWA / React"
          />
        </div>

        {/* Возможности */}
        <div className="w-full max-w-sm mt-6">
          <h3 className="text-sm font-semibold text-white mb-3 px-1">Возможности</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              '🎵 Воспроизведение',
              '📋 Плейлисты',
              '🔀 Случайный порядок',
              '🔁 Повтор трека',
              '📻 Радио (beta)',
              '🎨 Тёмная тема',
              '🔊 Регулировка громкости',
              '📱 Мобильный дизайн',
            ].map((feature, i) => (
              <div
                key={i}
                className="px-3 py-2 bg-bg-card rounded-lg text-xs text-text-secondary"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка поддержки */}
        <button
          onClick={() => alert('Спасибо за желание поддержать проект! 🍊\nФункция в разработке.')}
          className="flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF6B1A]
                     text-black font-semibold rounded-full transition-all active:scale-95
                     shadow-lg shadow-accent/30 hover:shadow-accent/50"
        >
          <Coffee size={18} />
          <span>Поддержать проект</span>
        </button>

        {/* Подвал */}
        <div className="mt-8 text-center">
          <p className="text-xs text-text-muted flex items-center justify-center gap-1">
            Сделано с <Heart size={12} className="text-red-500" fill="currentColor" /> в 2025
          </p>
          <p className="text-xs text-text-muted mt-1">
            @AsterBackinBlack
          </p>
        </div>

        {/* Инструкция по сборке */}
        <div className="w-full max-w-sm mt-8 p-4 bg-bg-card rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Terminal size={16} className="text-accent" /> Сборка APK
          </h3>
          <div className="text-xs text-text-secondary space-y-1 font-mono leading-relaxed">
            <p className="text-text-muted"># Установка зависимостей</p>
            <p>npm install</p>
            <p className="text-text-muted mt-2"># Запуск dev-сервера</p>
            <p>npm run dev</p>
            <p className="text-text-muted mt-2"># Сборка для продакшена</p>
            <p>npm run build</p>
          </div>
        </div>

      </div>
    </div>
  );
};

/** Карточка информации */
const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 p-3 bg-bg-card rounded-xl">
    <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="text-xs text-text-secondary">{subtitle}</div>
    </div>
  </div>
);
