import React from 'react';
import DraggableItem from '../shared/DraggableItem';
import { componentLibrary, getNewComponent } from '../../config/componentLibrary';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import ThemedButton from '../shared/ThemedButton';
import { generateUniqueId } from '../../core/utils/uniqueId';

const LeftPanel = ({ onCanvasFrameChange, selectedCanvasFrame }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // No specific handleDragStart needed here anymore with dnd-kit,
  // as useDraggable in DraggableItem handles it.
  // The data for dnd-kit is set directly in DraggableItem.

  const frameSizes = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };


  return (
    <div className={`w-64 p-2 flex flex-col space-y-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <div>
        <h2 className="text-lg font-semibold mb-2">{t('Canvas Frames')}</h2>
        <div className="space-y-1">
          {Object.keys(frameSizes).map((frame) => (
            <ThemedButton
              key={frame}
              onClick={() => onCanvasFrameChange(frame)}
              className={`w-full ${selectedCanvasFrame === frame ? (theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500 text-white') : (theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400')}`}
            >
              {t(frame)} ({frameSizes[frame]})
            </ThemedButton>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">{t('componentLibrary')}</h2>
        <div className="space-y-1">
          {Object.entries(componentLibrary).map(([componentType, config]) => {
            // Prepare the initial component data that will be transferred on drag
            const newComponent = getNewComponent(componentType);
            newComponent.id = generateUniqueId(componentType.toLowerCase()); // Pre-generate ID

            return (
              <DraggableItem
                key={componentType}
                componentType={componentType}
                name={config.name}
                componentData={newComponent} // Pass the full component data for dnd-kit
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
