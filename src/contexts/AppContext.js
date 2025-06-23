import React from 'react';
import { LanguageProvider } from './LanguageContext';
import { ThemeProvider } from './ThemeContext';
import { CanvasProvider } from './CanvasContext';

export const AppProvider = ({ children }) => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <CanvasProvider>{children}</CanvasProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};
