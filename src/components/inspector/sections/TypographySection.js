import React from 'react';
import { useCanvas } from '../../../hooks/useCanvas';
import { useLanguage } from '../../../hooks/useLanguage';
import { useTheme } from '../../../hooks/useTheme';

const TypographySection = ({ selectedNode }) => {
  const { dispatch } = useCanvas();
  const { t } = useLanguage();
  const { theme } = useTheme();

  if (!selectedNode || !selectedNode.styles) {
    return null;
  }

  // Show this section only if the component is text-like or a container that might have text styling
  // This logic can be refined based on componentLibrary definitions
  const isTextComponent = ['Text', 'Heading', 'Button'].includes(selectedNode.component);
  // const isContainer = selectedNode.component === 'Container';

  // If not a text component and not a container, maybe don't show this section or show limited options.
  // For now, we'll show it if styles object exists.

  const currentStyles = selectedNode.styles;
  const currentProps = selectedNode.props || {};

  const handleStyleChange = (property, value) => {
    let finalValue = value;
    if (property === 'fontSize' && /^\d+$/.test(value) && value !== '') {
        finalValue = `${value}px`;
    } else if (value === '' && property === 'fontSize') {
        finalValue = '';
    }
    dispatch({
      type: 'UPDATE_STYLE',
      payload: { nodeId: selectedNode.id, styleChanges: { [property]: finalValue } },
    });
  };

  const handlePropChange = (property, value) => {
    dispatch({
      type: 'UPDATE_PROPS',
      payload: { nodeId: selectedNode.id, propChanges: { [property]: value } },
    });
  };

  const inputClass = `w-full p-1 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className="space-y-3 p-2">
      <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('typography')}</h3>

      {isTextComponent && currentProps.hasOwnProperty('content') && (
        <div>
          <label htmlFor={`content-${selectedNode.id}`} className={labelClass}>{t('content')}:</label>
          <textarea
            id={`content-${selectedNode.id}`}
            value={currentProps.content || ''}
            onChange={(e) => handlePropChange('content', e.target.value)}
            className={`${inputClass} h-20`}
            placeholder="Enter text content"
          />
        </div>
      )}

      <div>
        <label htmlFor={`fontSize-${selectedNode.id}`} className={labelClass}>{t('fontSize')}:</label>
        <input
          type="text"
          id={`fontSize-${selectedNode.id}`}
          value={(currentStyles.fontSize || '').replace('px', '')}
          onChange={(e) => handleStyleChange('fontSize', e.target.value)}
          className={inputClass}
          placeholder="e.g., 16 or 1rem"
        />
      </div>
      <div>
        <label htmlFor={`color-${selectedNode.id}`} className={labelClass}>{t('color')}:</label>
        <input
          type="color" // Using HTML5 color picker
          id={`color-${selectedNode.id}`}
          value={currentStyles.color || '#000000'}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          className={`${inputClass} h-10`} // Color pickers might need specific height
        />
      </div>
      {/* Add more typography properties: fontWeight, textAlign, fontFamily, etc. */}
      {/* Example:
      <div>
        <label htmlFor={`fontWeight-${selectedNode.id}`} className={labelClass}>{t('fontWeight')}:</label>
        <select
          id={`fontWeight-${selectedNode.id}`}
          value={currentStyles.fontWeight || 'normal'}
          onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
          className={inputClass}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Lighter</option>
          <option value="100">100</option>
          <option value="200">200</option>
          ...
          <option value="900">900</option>
        </select>
      </div>
      */}
    </div>
  );
};

export default TypographySection;
