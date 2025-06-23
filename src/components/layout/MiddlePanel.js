import React, { useState, useCallback } from 'react';
import Canvas from '../canvas/Canvas';
import CodePanel from '../code/CodePanel';
import InspectorPanel from '../inspector/InspectorPanel';
import { useTheme } from '../../hooks/useTheme';
import LeftPanel from './LeftPanel';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useCanvas } from '../../hooks/useCanvas'; // To dispatch ADD_ELEMENT

const MiddlePanel = () => {
  const { theme } = useTheme();
  const { dispatch } = useCanvas(); // Get dispatch from useCanvas
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [canvasFrame, setCanvasFrame] = useState('desktop');

  const handleSelectNode = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleCanvasFrameChange = useCallback((frame) => {
    setCanvasFrame(frame);
  }, []);

  const frameWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  // Sensors for dnd-kit (using PointerSensor for good default behavior)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag initiates drag
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      return; // Dropped outside a valid target
    }

    const activeId = active.id; // This will be `draggable-${componentType}` for library items, or `canvas-el-${nodeId}` for canvas items
    const overId = over.id;   // This will be the ID of the droppable area (`canvas-root-drop-area` or a component's ID)

    const activeIsFromLibrary = active.data.current?.from === 'componentLibrary';
    const activeIsFromCanvas = active.data.current?.from === 'canvasElement';

    if (activeIsFromLibrary) {
      const newComponentBlueprint = active.data.current?.component;
      if (newComponentBlueprint) {
        // Determine actual parentId from overId (which is the ID of the droppable CanvasComponent or the root canvas area)
        const targetParentId = (overId === 'canvas-root-drop-area') ? 'root-container' : overId;

        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            parentId: targetParentId,
            component: { ...newComponentBlueprint },
          },
        });
      }
    } else if (activeIsFromCanvas) {
      // Reordering existing elements
      const draggedNodeId = active.data.current?.nodeId;
      const targetParentId = (overId === 'canvas-root-drop-area') ? 'root-container' : overId;

      if (draggedNodeId && targetParentId && draggedNodeId !== targetParentId) {
        // For now, just move to the new parent. Index-based reordering within the same parent needs more complex logic.
        // This will be a simple reparenting. True reordering (with specific index) is more involved.
        dispatch({
          type: 'MOVE_ELEMENT',
          payload: {
            nodeId: draggedNodeId,
            newParentId: targetParentId,
            newIndex: -1, // Add to the end of the new parent for now
          },
        });
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-1">
        <LeftPanel selectedCanvasFrame={canvasFrame} onCanvasFrameChange={handleCanvasFrameChange} />
        <div className={`flex-1 flex flex-col overflow-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'}`}>
          <div
            className="mx-auto my-4 overflow-auto p-2"
            style={{ width: frameWidths[canvasFrame], transition: 'width 0.3s ease-in-out' }}
          >
            <Canvas
              onSelectNode={handleSelectNode}
              selectedNodeId={selectedNodeId}
              canvasWidth={frameWidths[canvasFrame]}
            />
          </div>
          <CodePanel />
        </div>
        <InspectorPanel selectedNodeId={selectedNodeId} onDeselect={() => setSelectedNodeId(null)} />
      </div>
    </DndContext>
  );
};

export default MiddlePanel;
