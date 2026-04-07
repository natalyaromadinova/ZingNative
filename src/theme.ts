// ========================================
// Zing 🍊 — Тема (цвета, размеры, стили)
// Адаптировано для React Native
// ========================================

import { StyleSheet } from 'react-native';

export const colors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceLight: '#2A2A2A',
  accent: '#FF8C42',
  accentLight: 'rgba(255, 140, 66, 0.15)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',
  border: '#333333',
  error: '#FF4444',
  success: '#4CAF50',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 4,
  md: 6,
  base: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const sizes = {
  miniPlayerHeight: 70,
  coverSmall: 48,
  coverMedium: 64,
  coverLarge: 280,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});