import {
  // findNodeById, // This was unused
  updateNode,
  deleteNode,
  addChildNode,
  moveNode,
  findParentNode,
} from '../utils/nodeFinders';
import { generateUniqueId } from '../utils/uniqueId';
import initialState from './initialState'; // Make sure this is correctly imported

const canvasReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CANVAS_STATE':
      return action.payload;

    case 'ADD_ELEMENT': {
      // payload: { parentId, componentType, props, styles }
      // componentType needs to map to an entry in componentLibrary
      const { parentId, component } = action.payload; // component is the full new element object
      if (!component.id) {
        component.id = generateUniqueId(component.component.toLowerCase());
      }
      return addChildNode(state, parentId, component);
    }

    case 'DELETE_ELEMENT': {
      // payload: { nodeId }
      const { nodeId } = action.payload;
      if (nodeId === state.id) { // Cannot delete the root node
        return state;
      }
      return deleteNode(state, nodeId);
    }

    case 'UPDATE_STYLE': {
      // payload: { nodeId, styleChanges }
      const { nodeId, styleChanges } = action.payload;
      return updateNode(state, nodeId, { styles: styleChanges });
    }

    case 'UPDATE_PROPS': {
      // payload: { nodeId, propChanges }
      const { nodeId, propChanges } = action.payload;
      return updateNode(state, nodeId, { props: propChanges });
    }

    case 'UPDATE_CONTENT': { // Specific for text-like components
        const { nodeId, content } = action.payload;
        return updateNode(state, nodeId, { props: { content } });
    }

    case 'MOVE_ELEMENT': {
      // payload: { nodeId, newParentId, newIndex }
      const { nodeId, newParentId, newIndex } = action.payload;
      return moveNode(state, nodeId, newParentId, newIndex);
    }

    case 'MOVE_ELEMENT_UP': {
        const { nodeId } = action.payload;
        const parent = findParentNode(state, nodeId);
        if (parent && parent.children) {
            const currentIndex = parent.children.findIndex(child => child.id === nodeId);
            if (currentIndex > 0) {
                return moveNode(state, nodeId, parent.id, currentIndex - 1);
            }
        }
        return state;
    }

    case 'MOVE_ELEMENT_DOWN': {
        const { nodeId } = action.payload;
        const parent = findParentNode(state, nodeId);
        if (parent && parent.children) {
            const currentIndex = parent.children.findIndex(child => child.id === nodeId);
            if (currentIndex < parent.children.length - 1 && currentIndex !== -1) {
                return moveNode(state, nodeId, parent.id, currentIndex + 1);
            }
        }
        return state;
    }

    case 'SELECT_ELEMENT': {
        // This action might not change the canvasState itself,
        // but rather a separate part of the app state (e.g., in a UI context)
        // Or, you could add a 'selected' property to nodes if desired.
        // For now, let's assume it's handled outside or by adding a property.
        // Example: return updateNode(state, action.payload.nodeId, {isSelected: true});
        // And ensure other nodes are deselected. This can get complex.
        // A simpler approach is to manage selectedNodeId in a separate state slice or context.
        // For this reducer, we'll assume 'selectedNodeId' is managed elsewhere or not directly in canvasState elements.
        console.log("Element selected (action handled, no state change in canvasReducer):", action.payload.nodeId);
        return state;
    }

    default:
      return state;
  }
};

export default canvasReducer;
