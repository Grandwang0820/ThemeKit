import React from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useTheme } from '../../hooks/useTheme';
import CanvasComponent from './CanvasComponent';
// getNewComponent and generateUniqueId are no longer directly needed here for D&D
// as the component data is passed via dnd-kit's event.active.data.current.component
import { useDroppable } from '@dnd-kit/core';

const Canvas = ({ onSelectNode, selectedNodeId, canvasWidth }) => {
  const { canvasState } = useCanvas(); // dispatch is now handled by MiddlePanel's onDragEnd
  const { theme } = useTheme();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root-drop-area', // This ID is used in MiddlePanel's handleDragEnd
    // data: {
    //   targetId: canvasState.id, // Let handleDragEnd in MiddlePanel determine this
    //   isCanvasRoot: true
    // }
  });

  // Visual feedback for when dragging over the main canvas area
  const droppableStyle = {
    border: isOver ? '2px dashed green' : '2px dashed transparent',
    transition: 'border-color 0.2s ease-in-out',
  };

  const canvasStyle = {
    width: canvasWidth,
    minHeight: 'calc(100vh - 160px)', // Adjust based on TopBar and CodePanel height
    margin: '0 auto', // Center the canvas if canvasWidth is less than 100%
    transition: 'width 0.3s ease-in-out', // Smooth transition for frame changes
    // The root canvasState styles (e.g. background) will be applied by CanvasComponent itself
  };

  return (
    <div
      ref={setNodeRef} // Set this div as a droppable area for dnd-kit
      id="canvas-root-drop-area" // Keep this ID for reference if needed elsewhere, though dnd-kit uses its own internal IDs
      className={`canvas-area relative ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}
      style={{ ...canvasStyle, ...droppableStyle }} // Combine styles
      // onClick={() => onSelectNode(null)} // Click on canvas background deselects
    >
      {/* Render the root component of the canvasState. It will also become droppable. */}
      <CanvasComponent
        data={canvasState}
        onSelectNode={onSelectNode}
        selectedNodeId={selectedNodeId}
        parentId={null} // Root has no parent
      />
    </div>
  );
};

export default Canvas;
