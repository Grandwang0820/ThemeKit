import React, { memo } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useLanguage } from '../../hooks/useLanguage';
import { componentLibrary } from '../../config/componentLibrary';
// findParentNode might not be needed here if selection logic is simplified or handled by context
import { useDroppable, useDraggable } from '@dnd-kit/core'; // Import useDraggable as well for reordering later
import { CSS } from '@dnd-kit/utilities';


const CanvasComponent = ({ data, onSelectNode, selectedNodeId, parentId }) => {
  // canvasState was unused here. If needed for specific logic, it can be re-added.
  // const { canvasState } = useCanvas();
  const { t } = useLanguage();

  if (!data) {
    console.warn("CanvasComponent received null data. This shouldn't happen.");
    return null;
  }

  const componentConfig = componentLibrary[data.component];

  if (!componentConfig) {
    console.warn(`Component type "${data.component}" not found in library. Rendering placeholder.`);
    return (
      <div style={{ border: '1px dashed red', padding: '10px', margin: '5px' }}>
        {t('Unknown Component')}: {data.component} (ID: {data.id})
      </div>
    );
  }

  const Tag = componentConfig.htmlTag || 'div';
  const isSelected = data.id === selectedNodeId;

  // Call hooks unconditionally at the top level
  const { setNodeRef: setDroppableNodeRef, isOver: isOverDroppable } = useDroppable({
    id: data.id,
    disabled: componentConfig.children === null || data.id === `canvas-el-${data.id}`, // Disable for non-containers or if it's a draggable version of itself
    data: {
      targetId: data.id,
      isCanvasComponent: true,
    },
  });

  const { attributes, listeners, setNodeRef: setDraggableNodeRef, transform, isDragging } = useDraggable({
    id: `canvas-el-${data.id}`, // Keep a distinct ID for the draggable aspect if necessary
    data: {
      nodeId: data.id,
      from: 'canvasElement',
      isCanvasComponent: true,
      componentType: data.component,
    },
    disabled: data.id === 'root-container',
  });

  // Conditional logic for refs based on whether the component is the root or not
  const setNodeRef = data.id === 'root-container' ? setDroppableNodeRef : (node) => {
    setDraggableNodeRef(node);
    setDroppableNodeRef(node);
  };

  const currentListeners = data.id === 'root-container' ? {} : listeners;
  const currentAttributes = data.id === 'root-container' ? {} : attributes;


  const draggableStyle = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 1000 : 'auto', // Ensure dragged item is on top
    boxShadow: isDragging ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
  };


  const handleSelect = (e) => {
    e.stopPropagation();
    if (onSelectNode) {
      onSelectNode(data.id);
    }
  };

  const combinedStyles = {
    ...data.styles,
    ...(isSelected && { outline: '2px solid purple', outlineOffset: '2px' }),
    cursor: data.id === 'root-container' ? 'default' : (isDragging ? 'grabbing' : 'grab'), // Change cursor based on drag state
    border: isOverDroppable && componentConfig.children !== null && !isDragging ? '2px dashed green' : data.styles?.border || 'none',
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    ...draggableStyle, // Spread draggable styles here
  };

  // Convert props from canvasState to valid HTML attributes
  const htmlProps = { ...data.props };
  if (htmlProps.content && (Tag === 'p' || Tag === 'h1' || Tag === 'h2' || Tag === 'h3' || Tag === 'h4' || Tag === 'h5' || Tag === 'h6' || Tag === 'span' || Tag === 'button')) {
    // Content for text-like elements goes inside the tag, not as an attribute
  } else if (htmlProps.content) {
      delete htmlProps.content; // Avoid rendering 'content' attribute if not applicable
  }

  return (
    <Tag
      ref={setNodeRef} // Use the combined or conditional ref
      id={data.id}
      style={combinedStyles}
      onClick={handleSelect}
      {...currentListeners} // Use conditional listeners
      {...currentAttributes} // Use conditional attributes
      {...htmlProps}
    >
      {componentConfig.defaultProps?.hasOwnProperty('content') && data.props?.content ? data.props.content : null}

      {!componentConfig.selfClosing && data.children && data.children.length > 0 &&
        data.children.map(child => (
          <CanvasComponent
            key={child.id}
            data={child}
            onSelectNode={onSelectNode}
            selectedNodeId={selectedNodeId}
            parentId={data.id}
          />
        ))}

      {!componentConfig.selfClosing && (!data.children || data.children.length === 0) && componentConfig.children !== null && (
        <div style={{ minHeight: '30px', width: '100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'12px', pointerEvents: 'none' }}>
          {t(componentConfig.name === "Container" ? 'Empty Container - Drop here' : 'Empty Area - Drop here')}
        </div>
      )}
    </Tag>
  );
};

// Wrap with React.memo for performance optimization
export default memo(CanvasComponent);
