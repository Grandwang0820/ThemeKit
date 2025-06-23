import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

const ThemedButton = ({ onClick, children, className = '', ...props }) => {
  const { theme } = useTheme();
  const { t } = useLanguage(); // If you need to translate button text passed as key

  // Example of theme-specific styling (can be expanded with Tailwind)
  const baseStyle = "px-4 py-2 rounded focus:outline-none focus:ring-2";
  const themeStyle = theme === 'dark'
    ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
    : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300";

  // If children is a string key for translation, translate it
  const buttonText = typeof children === 'string' ? t(children) : children;

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${themeStyle} ${className}`}
      {...props}
    >
      {buttonText}
    </button>
  );
};

export default ThemedButton;
