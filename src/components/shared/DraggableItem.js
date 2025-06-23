import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// This component is for items in the component library that can be dragged onto the canvas.
// It uses dnd-kit's useDraggable hook.

const DraggableItem = ({ componentType, name, componentData }) => {
  const { t } = useLanguage();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `draggable-${componentType}`, // Unique ID for dnd-kit
    data: {
      component: componentData, // The actual component data to be added
      from: 'componentLibrary', // Identifier to know its origin
      type: componentType, // The type of component (e.g., 'Container', 'Text')
    },
  });

  const displayName = t(name) || name;

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    // Add zIndex if needed while dragging, though DndContext's DragOverlay is better for this
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-2 m-1 border rounded cursor-grab bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white touch-none" // touch-none is often helpful for dnd-kit
      title={`Drag to add ${displayName}`}
    >
      {displayName}
    </div>
  );
};

export default DraggableItem;
