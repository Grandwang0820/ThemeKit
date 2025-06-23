import React from 'react';
import { useCanvas } from '../../../hooks/useCanvas';
import { useLanguage } from '../../../hooks/useLanguage';
import ThemedButton from '../../shared/ThemedButton';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

const ActionsSection = ({ selectedNode, onDeselect }) => {
  const { dispatch } = useCanvas();
  const { t } = useLanguage();

  if (!selectedNode) {
    return null;
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_ELEMENT', payload: { nodeId: selectedNode.id } });
    if (onDeselect) {
        onDeselect(); // Clear selection in parent after delete
    }
  };

  const handleMoveUp = () => {
    dispatch({ type: 'MOVE_ELEMENT_UP', payload: { nodeId: selectedNode.id } });
  };

  const handleMoveDown = () => {
    dispatch({ type: 'MOVE_ELEMENT_DOWN', payload: { nodeId: selectedNode.id } });
  };

  // Disable move/delete for root container?
  const isRoot = selectedNode.id === 'root-container';


  return (
    <div className="space-y-2 p-2">
      <h3 className="text-md font-semibold">{t('actions')}</h3>
      {!isRoot && (
        <>
          <ThemedButton onClick={handleMoveUp} className="w-full flex items-center justify-center">
            <ArrowUp size={18} className="mr-1" /> {t('moveUp')}
          </ThemedButton>
          <ThemedButton onClick={handleMoveDown} className="w-full flex items-center justify-center">
            <ArrowDown size={18} className="mr-1" /> {t('moveDown')}
          </ThemedButton>
          <ThemedButton
            onClick={handleDelete}
            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
          >
            <Trash2 size={18} className="mr-1" /> {t('delete')}
          </ThemedButton>
        </>
      )}
      {isRoot && <p className="text-xs text-gray-500">{t("Root element cannot be moved or deleted.")}</p>}
    </div>
  );
};

export default ActionsSection;
