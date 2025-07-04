import React, { memo } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useLanguage } from '../../hooks/useLanguage';
import { componentLibrary } from '../../config/componentLibrary';
// findParentNode might not be needed here if selection logic is simplified or handled by context
import { useDroppable, useDraggable } from '@dnd-kit/core'; // Import useDraggable as well for reordering later
import { CSS } from '@dnd-kit/utilities';


const CanvasComponent = ({ data, onSelectNode, selectedNodeId, parentId }) => {
  // Define all potentially conditional values for hooks first.
  const componentConfigForHook = data ? componentLibrary[data.component] : null;

  const droppableId = data ? data.id : `droppable-placeholder-${parentId || 'root'}`;
  const droppableDisabled = !data || !componentConfigForHook || componentConfigForHook.children === null;
  const droppableHookData = { targetId: data ? data.id : null, isCanvasComponent: true };

  const draggableId = data ? `canvas-el-${data.id}` : `draggable-placeholder-${parentId || 'root'}`;
  const draggableDisabled = !data || !componentConfigForHook || data.id === 'root-container';
  const draggableHookData = {
    nodeId: data ? data.id : null,
    from: 'canvasElement',
    isCanvasComponent: true,
    componentType: data ? data.component : null,
  };

  // Call hooks unconditionally with pre-defined options.
  const { setNodeRef: setDroppableNodeRef, isOver: isOverDroppable } = useDroppable({
    id: droppableId,
    disabled: droppableDisabled,
    data: droppableHookData,
  });

  const { attributes, listeners, setNodeRef: setDraggableNodeRef, transform, isDragging } = useDraggable({
    id: draggableId,
    disabled: draggableDisabled,
    data: draggableHookData,
  });

  const { t } = useLanguage();

  if (!data) {
    console.warn("CanvasComponent received null data. This shouldn't happen.");
    // If we return here, hooks above are fine. The placeholder won't use them.
    return null;
  }

  const componentConfig = componentLibrary[data.component];

  if (!componentConfig) {
    console.warn(`Component type "${data.component}" not found in library. Rendering placeholder.`);
    // If we return here, hooks above are fine. The placeholder won't use them.
    return (
      <div style={{ border: '1px dashed red', padding: '10px', margin: '5px' }}>
        {t('Unknown Component')}: {data.component} (ID: {data.id})
      </div>
    );
  }

  const Tag = componentConfig.htmlTag || 'div';
  const isSelected = data.id === selectedNodeId;

  // Conditional logic for refs based on whether the component is the root or not
  // This logic is now safe as hooks are called before any early returns.
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

  // List of HTML void elements
  const voidElements = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
    'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
  ];
  const isVoidElement = voidElements.includes(Tag);

  // Content for text-like elements should only be rendered if not a void element
  // and if the component is designed to have such content.
  const renderableContent = !isVoidElement && componentConfig.defaultProps?.hasOwnProperty('content') && data.props?.content
    ? data.props.content
    : null;

  // Remove 'content' from htmlProps if it's meant to be innerHTML or for void elements
  if (renderableContent || isVoidElement || (htmlProps.content && (Tag === 'p' || Tag.startsWith('h') || Tag === 'span' || Tag === 'button'))) {
    delete htmlProps.content;
  }


  return (
    <Tag
      ref={setNodeRef}
      id={data.id}
      style={combinedStyles}
      onClick={handleSelect}
      {...currentListeners}
      {...currentAttributes}
      {...htmlProps} // Spread sanitized htmlProps
    >
      {renderableContent /* Render content if it's valid to do so */}

      {/* Children and empty placeholders only if not a void element and component can have children */}
      {!isVoidElement && !componentConfig.selfClosing && componentConfig.children !== null && (
        <>
          {data.children && data.children.length > 0 &&
            data.children.map(child => (
              <CanvasComponent
                key={child.id}
                data={child}
                onSelectNode={onSelectNode}
                selectedNodeId={selectedNodeId}
                parentId={data.id}
              />
            ))}

          {(!data.children || data.children.length === 0) && (
            <div style={{ minHeight: '30px', width: '100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'12px', pointerEvents: 'none' }}>
              {t(componentConfig.name === "Container" ? 'Empty Container - Drop here' : 'Empty Area - Drop here')}
            </div>
          )}
        </>
      )}
    </Tag>
  );
};

// Wrap with React.memo for performance optimization
export default memo(CanvasComponent);
