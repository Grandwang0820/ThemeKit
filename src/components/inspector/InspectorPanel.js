import React from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { findNodeById } from '../../core/utils/nodeFinders';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';

import LayoutSection from './sections/LayoutSection';
import SizeSection from './sections/SizeSection';
import TypographySection from './sections/TypographySection';
// import SpacingSection from './sections/SpacingSection'; // Future: Padding/Margin
import ActionsSection from './sections/ActionsSection';
import { componentLibrary } from '../../config/componentLibrary';


const InspectorPanel = ({ selectedNodeId, onDeselect }) => {
  const { canvasState, dispatch: canvasStateDispatch } = useCanvas(); // Get dispatch here
  const { t } = useLanguage();
  const { theme } = useTheme();

  const selectedNode = selectedNodeId ? findNodeById(canvasState, selectedNodeId) : null;

  if (!selectedNode) {
    return (
      <div className={`w-72 p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} h-full overflow-y-auto`}>
        <h2 className="text-lg font-semibold mb-3 border-b pb-2">{t('inspector')}</h2>
        <p>{t('noElementSelected')}</p>
      </div>
    );
  }

  const componentConfig = componentLibrary[selectedNode.component];


  return (
    <div className={`w-72 p-1 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} h-full overflow-y-auto flex flex-col`}>
      <div className="p-3 border-b">
        <h2 className="text-lg font-semibold">{t('inspector')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('Element')}: <span className="font-medium">{selectedNode.component}</span> ({selectedNode.id})
        </p>
      </div>

      <div className="flex-grow overflow-y-auto space-y-2">
        {/* Common sections */}
        <LayoutSection selectedNode={selectedNode} />
        <SizeSection selectedNode={selectedNode} />
        {/* <SpacingSection selectedNode={selectedNode} /> */}

        {/* Component-specific sections */}
        { (componentConfig?.htmlTag !== 'img') && // Images typically don't have text styling in this context
            <TypographySection selectedNode={selectedNode} />
        }

        {/* Other specific sections based on component type can be added here */}
        {/* e.g., ImageSourceSection for selectedNode.component === 'Image' */}
        {selectedNode.component === 'Image' && componentConfig?.defaultProps?.hasOwnProperty('src') && (
            <div className="p-2 space-y-2">
                 <h3 className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('Image Properties')}</h3>
                <div>
                    <label htmlFor={`src-${selectedNode.id}`} className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('src')}:</label>
                    <input
                        type="text"
                        id={`src-${selectedNode.id}`}
                        value={selectedNode.props?.src || ''}
                        onChange={(e) => {
                            // This direct update is for demonstration.
                            // Ideally, debounce or use onBlur for text inputs updating state frequently.
                            // For now, this will trigger re-renders on each keystroke.
                            // To use dispatch here, InspectorPanel itself would need to call useCanvas()
                            // and pass dispatch down, or pass a handler function.
                            // Let's modify to get dispatch directly in InspectorPanel.
                            // This was a flaw in the previous structure.
                            // For now, we'll assume dispatch is available via a prop or a direct hook call if InspectorPanel is refactored.
                            // This will be addressed by calling useCanvas() at the top of InspectorPanel.
                             canvasStateDispatch({ type: 'UPDATE_PROPS', payload: { nodeId: selectedNode.id, propChanges: { src: e.target.value } } });
                        }}
                        className={`w-full p-1 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                        placeholder="Image URL"
                    />
                </div>
            </div>
        )}


        <ActionsSection selectedNode={selectedNode} onDeselect={onDeselect} />
      </div>
    </div>
  );
};

export default InspectorPanel;
