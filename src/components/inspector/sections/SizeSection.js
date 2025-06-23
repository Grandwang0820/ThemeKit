import React from 'react';
import { useCanvas } from '../../../hooks/useCanvas';
import { useLanguage } from '../../../hooks/useLanguage';
import { useTheme } from '../../../hooks/useTheme';

const SizeSection = ({ selectedNode }) => {
  const { dispatch } = useCanvas();
  const { t } = useLanguage();
  const { theme } = useTheme();

  if (!selectedNode || !selectedNode.styles) {
    return null; // Or some placeholder
  }

  const currentStyles = selectedNode.styles;

  const handleStyleChange = (property, value) => {
    // Add 'px' if value is a number and property is width/height, unless it's 'auto' or includes '%'
    let finalValue = value;
    if (['width', 'height'].includes(property) && /^\d+$/.test(value) && value !== '') {
      finalValue = `${value}px`;
    } else if (value === '' && ['width', 'height'].includes(property)) {
        // Allow clearing the value to reset to default/auto behavior from CSS
        finalValue = ''; // Or you might prefer 'auto'
    }


    dispatch({
      type: 'UPDATE_STYLE',
      payload: { nodeId: selectedNode.id, styleChanges: { [property]: finalValue } },
    });
  };

  const inputClass = `w-full p-1 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className="space-y-3 p-2">
      <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('size')}</h3>
      <div>
        <label htmlFor={`width-${selectedNode.id}`} className={labelClass}>{t('width')}:</label>
        <input
          type="text"
          id={`width-${selectedNode.id}`}
          value={(currentStyles.width || '').replace('px', '')} // Show number for easier editing
          onChange={(e) => handleStyleChange('width', e.target.value)}
          className={inputClass}
          placeholder="e.g., 100 or 100% or auto"
        />
      </div>
      <div>
        <label htmlFor={`height-${selectedNode.id}`} className={labelClass}>{t('height')}:</label>
        <input
          type="text"
          id={`height-${selectedNode.id}`}
          value={(currentStyles.height || '').replace('px', '')} // Show number for easier editing
          onChange={(e) => handleStyleChange('height', e.target.value)}
          className={inputClass}
          placeholder="e.g., 100 or 100% or auto"
        />
      </div>
      {/* Add min/max width/height, aspect-ratio etc. if needed */}
    </div>
  );
};

export default SizeSection;
