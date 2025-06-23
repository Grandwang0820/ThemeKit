import { findNodeById, updateNode, deleteNode, addChildNode } from './nodeFinders';

describe('nodeFinders', () => {
  const mockState = {
    id: 'root',
    component: 'Container',
    children: [
      { id: 'child1', component: 'Text', props: { content: 'Hello' }, styles: { color: 'red'} },
      {
        id: 'child2',
        component: 'Container',
        children: [
          { id: 'grandchild1', component: 'Image', props: { src: 'test.jpg' }, styles: { width: '100px'} }
        ]
      },
    ],
  };

  describe('findNodeById', () => {
    it('should find a top-level child', () => {
      expect(findNodeById(mockState, 'child1')?.props.content).toBe('Hello');
    });

    it('should find a nested grandchild', () => {
      expect(findNodeById(mockState, 'grandchild1')?.props.src).toBe('test.jpg');
    });

    it('should return null if node not found', () => {
      expect(findNodeById(mockState, 'nonexistent')).toBeNull();
    });

    it('should find the root node itself', () => {
      expect(findNodeById(mockState, 'root')?.component).toBe('Container');
    });
  });

  describe('updateNode', () => {
    it('should update styles of a node', () => {
      const updates = { styles: { color: 'blue', fontSize: '12px' } };
      const updatedState = updateNode(mockState, 'child1', updates);
      const updatedNode = findNodeById(updatedState, 'child1');
      expect(updatedNode?.styles.color).toBe('blue');
      expect(updatedNode?.styles.fontSize).toBe('12px');
      // Ensure original style is not lost if not overwritten
      expect(findNodeById(mockState, 'child1')?.styles.color).toBe('red'); // Original state unchanged
    });

    it('should update props of a node', () => {
        const updates = { props: { content: 'World' } };
        const updatedState = updateNode(mockState, 'child1', updates);
        const updatedNode = findNodeById(updatedState, 'child1');
        expect(updatedNode?.props.content).toBe('World');
    });

    it('should not modify other nodes', () => {
        const updates = { styles: { color: 'blue' } };
        const updatedState = updateNode(mockState, 'child1', updates);
        expect(findNodeById(updatedState, 'grandchild1')?.props.src).toBe('test.jpg');
    });
  });

  describe('deleteNode', () => {
    it('should delete a top-level child', () => {
      const updatedState = deleteNode(mockState, 'child1');
      expect(findNodeById(updatedState, 'child1')).toBeNull();
      expect(updatedState.children.length).toBe(1);
      expect(updatedState.children[0].id).toBe('child2');
    });

    it('should delete a nested grandchild', () => {
      const updatedState = deleteNode(mockState, 'grandchild1');
      const child2 = findNodeById(updatedState, 'child2');
      expect(findNodeById(updatedState, 'grandchild1')).toBeNull();
      expect(child2?.children.length).toBe(0);
    });
  });

  describe('addChildNode', () => {
    const newNode = { id: 'child3', component: 'Button', props: {}, styles: {} };
    it('should add a child to the root node', () => {
      const updatedState = addChildNode(mockState, 'root', newNode);
      expect(updatedState.children.length).toBe(3);
      expect(findNodeById(updatedState, 'child3')?.component).toBe('Button');
    });

    it('should add a child to a nested container', () => {
      const updatedState = addChildNode(mockState, 'child2', newNode);
      const child2 = findNodeById(updatedState, 'child2');
      expect(child2?.children.length).toBe(2);
      expect(findNodeById(child2, 'child3')?.component).toBe('Button');
    });
  });
});
