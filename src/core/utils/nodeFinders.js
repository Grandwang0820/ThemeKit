// Helper functions for traversing and manipulating the canvasState tree

/**
 * Finds a node by its ID in the state tree.
 * @param {object} node The current node to search within.
 * @param {string} nodeId The ID of the node to find.
 * @returns {object|null} The found node or null.
 */
export const findNodeById = (node, nodeId) => {
  if (node.id === nodeId) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/**
 * Updates a node in the state tree.
 * Returns a new tree with the updated node.
 * @param {object} currentNode The current node to process.
 * @param {string} nodeId The ID of the node to update.
 * @param {object} updates The properties to update.
 * @returns {object} A new node object with the update.
 */
export const updateNode = (currentNode, nodeId, updates) => {
  if (currentNode.id === nodeId) {
    return { ...currentNode, ...updates, styles: { ...currentNode.styles, ...updates.styles }, props: { ...currentNode.props, ...updates.props} };
  }
  if (currentNode.children) {
    return {
      ...currentNode,
      children: currentNode.children.map(child => updateNode(child, nodeId, updates)),
    };
  }
  return currentNode;
};


/**
 * Deletes a node from the state tree.
 * Returns a new tree without the deleted node.
 * @param {object} currentNode The current node to process.
 * @param {string} nodeId The ID of the node to delete.
 * @returns {object|null} A new node object or null if the node itself is deleted.
 */
export const deleteNode = (currentNode, nodeId) => {
  if (currentNode.id === nodeId) {
    // This case should ideally be handled by the parent wanting to remove a child
    // For now, returning null signifies it should be removed from its parent's children array
    return null;
  }
  if (currentNode.children) {
    const newChildren = currentNode.children
      .map(child => deleteNode(child, nodeId))
      .filter(child => child !== null); // Filter out the deleted node

    return {
      ...currentNode,
      children: newChildren,
    };
  }
  return currentNode;
};

/**
 * Adds a child node to a parent node in the state tree.
 * Returns a new tree with the added child.
 * @param {object} currentNode The current node to process.
 * @param {string} parentId The ID of the parent node.
 * @param {object} childNode The child node to add.
 * @returns {object} A new node object with the added child.
 */
export const addChildNode = (currentNode, parentId, childNode) => {
  if (currentNode.id === parentId) {
    return {
      ...currentNode,
      children: [...(currentNode.children || []), childNode],
    };
  }
  if (currentNode.children) {
    return {
      ...currentNode,
      children: currentNode.children.map(child => addChildNode(child, parentId, childNode)),
    };
  }
  return currentNode;
};

/**
 * Moves a child node within its parent or to a different parent.
 * This is a simplified version. A more robust solution would handle
 * index-based positioning for move up/down.
 * @param {object} state The entire canvas state.
 * @param {string} nodeId The ID of the node to move.
 * @param {string} newParentId The ID of the new parent node.
 * @param {number} [newIndex=-1] The new index in the children array. -1 for end.
 * @returns {object} New canvas state.
 */
export const moveNode = (state, nodeId, newParentId, newIndex = -1) => {
  let nodeToMove = null;

  // First, find and remove the node from its current position
  const findAndRemove = (currentNode, targetId) => {
    if (currentNode.children) {
      const childIndex = currentNode.children.findIndex(c => c.id === targetId);
      if (childIndex > -1) {
        nodeToMove = currentNode.children[childIndex];
        return {
          ...currentNode,
          children: currentNode.children.filter(c => c.id !== targetId),
        };
      }
      return {
        ...currentNode,
        children: currentNode.children.map(child => findAndRemove(child, targetId)),
      };
    }
    return currentNode;
  };

  let tempState = findAndRemove(state, nodeId);

  if (!nodeToMove) return state; // Node to move not found

  // Then, add the node to the new parent
  const add = (currentNode, parentId, nodeToAdd, index) => {
    if (currentNode.id === parentId) {
      const newChildren = [...(currentNode.children || [])];
      if (index === -1 || index >= newChildren.length) {
        newChildren.push(nodeToAdd);
      } else {
        newChildren.splice(index, 0, nodeToAdd);
      }
      return {
        ...currentNode,
        children: newChildren,
      };
    }
    if (currentNode.children) {
      return {
        ...currentNode,
        children: currentNode.children.map(child => add(child, parentId, nodeToAdd, index)),
      };
    }
    return currentNode;
  };

  return add(tempState, newParentId, nodeToMove, newIndex);
};


/**
 * Finds the parent of a given node.
 * @param {object} currentNode The node to start searching from (usually the root).
 * @param {string} nodeId The ID of the child node whose parent is to be found.
 * @returns {object|null} The parent node or null if not found or if it's the root.
 */
export const findParentNode = (currentNode, nodeId) => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.id === nodeId) {
        return currentNode; // Current node is the parent
      }
      const parent = findParentNode(child, nodeId);
      if (parent) {
        return parent;
      }
    }
  }
  return null;
};
