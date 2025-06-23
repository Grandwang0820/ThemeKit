import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import ThemedButton from '../shared/ThemedButton'; // Assuming ThemedButton is suitable
import { Sun, Moon, Globe } from 'lucide-react'; // Example icons

const TopBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className={`p-2 shadow-md flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-xl font-semibold">{t('themeKitTitle')}</h1>
      <div className="flex items-center space-x-2">
        <ThemedButton onClick={toggleTheme} aria-label={t('toggleTheme')}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </ThemedButton>
        <ThemedButton onClick={toggleLanguage} aria-label={t('language')}>
          <Globe size={20} />
          <span className="ml-1">{language === 'en' ? 'EN' : '中文'}</span>
        </ThemedButton>
      </div>
    </div>
  );
};

export default TopBar;
