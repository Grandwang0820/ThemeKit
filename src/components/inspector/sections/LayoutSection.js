import React from 'react';
import { useCanvas } from '../../../hooks/useCanvas';
import { useLanguage } from '../../../hooks/useLanguage';
import { useTheme } from '../../../hooks/useTheme';

const LayoutSection = ({ selectedNode }) => {
  const { dispatch } = useCanvas();
  const { t } = useLanguage();
  const { theme } = useTheme();

  if (!selectedNode || !selectedNode.styles) {
    return <p>{t('Select an element to see layout options.')}</p>;
  }

  const currentStyles = selectedNode.styles;

  const handleStyleChange = (property, value) => {
    dispatch({
      type: 'UPDATE_STYLE',
      payload: { nodeId: selectedNode.id, styleChanges: { [property]: value } },
    });
  };

  const inputClass = `w-full p-1 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`;
  const labelClass = `block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;
  const selectClass = `${inputClass} appearance-none`; // appearance-none for custom arrow styling if needed

  // Only show Flexbox controls if display is 'flex'
  const isFlexContainer = currentStyles.display === 'flex';

  return (
    <div className="space-y-3 p-2">
      <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('layout')}</h3>
      <div>
        <label htmlFor={`display-${selectedNode.id}`} className={labelClass}>{t('display')}:</label>
        <select
          id={`display-${selectedNode.id}`}
          value={currentStyles.display || 'block'}
          onChange={(e) => handleStyleChange('display', e.target.value)}
          className={selectClass}
        >
          <option value="block">Block</option>
          <option value="inline-block">Inline-Block</option>
          <option value="flex">Flex</option>
          <option value="grid">Grid (basic support)</option>
          <option value="none">None</option>
        </select>
      </div>

      {isFlexContainer && (
        <>
          <div>
            <label htmlFor={`flexDirection-${selectedNode.id}`} className={labelClass}>{t('flexDirection')}:</label>
            <select
              id={`flexDirection-${selectedNode.id}`}
              value={currentStyles.flexDirection || 'row'}
              onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
              className={selectClass}
            >
              <option value="row">Row</option>
              <option value="row-reverse">Row Reverse</option>
              <option value="column">Column</option>
              <option value="column-reverse">Column Reverse</option>
            </select>
          </div>
          <div>
            <label htmlFor={`justifyContent-${selectedNode.id}`} className={labelClass}>{t('justifyContent')}:</label>
            <select
              id={`justifyContent-${selectedNode.id}`}
              value={currentStyles.justifyContent || 'flex-start'}
              onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
              className={selectClass}
            >
              <option value="flex-start">Flex Start</option>
              <option value="flex-end">Flex End</option>
              <option value="center">Center</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
              <option value="space-evenly">Space Evenly</option>
            </select>
          </div>
          <div>
            <label htmlFor={`alignItems-${selectedNode.id}`} className={labelClass}>{t('alignItems')}:</label>
            <select
              id={`alignItems-${selectedNode.id}`}
              value={currentStyles.alignItems || 'stretch'}
              onChange={(e) => handleStyleChange('alignItems', e.target.value)}
              className={selectClass}
            >
              <option value="stretch">Stretch</option>
              <option value="flex-start">Flex Start</option>
              <option value="flex-end">Flex End</option>
              <option value="center">Center</option>
              <option value="baseline">Baseline</option>
            </select>
          </div>
          <div>
            <label htmlFor={`gap-${selectedNode.id}`} className={labelClass}>{t('gap')} (e.g., 10px):</label>
            <input
              type="text"
              id={`gap-${selectedNode.id}`}
              value={currentStyles.gap || ''}
              onChange={(e) => handleStyleChange('gap', e.target.value)}
              className={inputClass}
              placeholder="e.g., 10px or 1rem"
            />
          </div>
        </>
      )}
      {/* Add more layout properties as needed, e.g., position, float, clear, etc. */}
    </div>
  );
};

export default LayoutSection;
