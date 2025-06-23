import canvasReducer from './canvasReducer';
import initialState from './initialState'; // Assuming initialState is the default
import { generateUniqueId } from '../utils/uniqueId';

// Mock uniqueId to make tests deterministic
jest.mock('../utils/uniqueId', () => ({
  generateUniqueId: jest.fn(),
}));

describe('canvasReducer', () => {
  let testInitialState;

  beforeEach(() => {
    // Deep copy initialState for each test to avoid side effects
    testInitialState = JSON.parse(JSON.stringify(initialState));
    // Reset mock for each test
    generateUniqueId.mockClear();
  });

  it('should return the initial state if no action type matches', () => {
    expect(canvasReducer(testInitialState, { type: 'UNKNOWN_ACTION' })).toEqual(testInitialState);
  });

  describe('ADD_ELEMENT', () => {
    it('should add an element to the specified parent (root)', () => {
      generateUniqueId.mockReturnValue('new-el-1');
      const newComponent = { component: 'Text', props: { content: 'New Text' }, styles: {} };
      const action = {
        type: 'ADD_ELEMENT',
        payload: { parentId: 'root-container', component: newComponent },
      };
      const updatedState = canvasReducer(testInitialState, action);
      const rootNode = updatedState; // In this case, state is the root node

      expect(rootNode.children.length).toBe(initialState.children.length + 1);
      const addedElement = rootNode.children.find(child => child.id === 'new-el-1');
      expect(addedElement).toBeDefined();
      expect(addedElement.props.content).toBe('New Text');
      expect(addedElement.component).toBe('Text');
      expect(generateUniqueId).toHaveBeenCalledWith('text'); // Assuming component name toLowerCase for prefix
    });

    it('should add an element to a nested parent', () => {
        generateUniqueId.mockReturnValue('nested-el-1');
        // Find a container in the initial state to add to, e.g., the root itself if it can have children
        // Or add one first for testing if initialState is flat.
        // For this example, assume 'root-container' is the target.
        const parentId = 'root-container';
        const newComponent = { component: 'Image', props: { src: 'new.png' }, styles: {} };
        const action = {
          type: 'ADD_ELEMENT',
          payload: { parentId: parentId, component: newComponent },
        };
        const updatedState = canvasReducer(testInitialState, action);
        const parentNode = updatedState; // If parentId is root

        expect(parentNode.children.length).toBe(initialState.children.length + 1);
        const addedElement = parentNode.children.find(child => child.id === 'nested-el-1');
        expect(addedElement).toBeDefined();
        expect(addedElement.props.src).toBe('new.png');
        expect(addedElement.component).toBe('Image');
        expect(generateUniqueId).toHaveBeenCalledWith('image');
      });
  });

  describe('DELETE_ELEMENT', () => {
    it('should delete an element by its ID', () => {
      const nodeIdToDelete = testInitialState.children[0].id; // Delete the first child
      const action = { type: 'DELETE_ELEMENT', payload: { nodeId: nodeIdToDelete } };
      const updatedState = canvasReducer(testInitialState, action);

      expect(updatedState.children.find(child => child.id === nodeIdToDelete)).toBeUndefined();
      expect(updatedState.children.length).toBe(initialState.children.length - 1);
    });

    it('should not delete the root container', () => {
        const action = { type: 'DELETE_ELEMENT', payload: { nodeId: 'root-container' } };
        const updatedState = canvasReducer(testInitialState, action);
        expect(updatedState.id).toBe('root-container');
        expect(updatedState.children.length).toBe(initialState.children.length);
    });
  });

  describe('UPDATE_STYLE', () => {
    it('should update the style of the specified node', () => {
        const nodeIdToUpdate = testInitialState.children[0].id;
        const styleChanges = { color: 'blue', fontSize: '20px' };
        const action = { type: 'UPDATE_STYLE', payload: { nodeId: nodeIdToUpdate, styleChanges } };
        const originalStyle = testInitialState.children.find(c => c.id === nodeIdToUpdate).styles;

        const updatedState = canvasReducer(testInitialState, action);
        const updatedNode = updatedState.children.find(c => c.id === nodeIdToUpdate);

        expect(updatedNode.styles.color).toBe('blue');
        expect(updatedNode.styles.fontSize).toBe('20px');
        // Check if other styles are preserved if not overwritten
        Object.keys(originalStyle).forEach(key => {
            if (!styleChanges.hasOwnProperty(key)) {
                expect(updatedNode.styles[key]).toEqual(originalStyle[key]);
            }
        });
    });
  });

  describe('UPDATE_PROPS', () => {
    it('should update the props of the specified node', () => {
        const nodeIdToUpdate = testInitialState.children[0].id; // Assuming first child is updatable
        const propChanges = { content: 'Updated Text' }; // Example for a Text component
        const action = { type: 'UPDATE_PROPS', payload: { nodeId: nodeIdToUpdate, propChanges } };

        const originalProps = testInitialState.children.find(c => c.id === nodeIdToUpdate).props;

        const updatedState = canvasReducer(testInitialState, action);
        const updatedNode = updatedState.children.find(c => c.id === nodeIdToUpdate);

        expect(updatedNode.props.content).toBe('Updated Text');
        Object.keys(originalProps).forEach(key => {
            if (!propChanges.hasOwnProperty(key)) {
                expect(updatedNode.props[key]).toEqual(originalProps[key]);
            }
        });
    });
  });

  // Add more tests for MOVE_ELEMENT, MOVE_ELEMENT_UP, MOVE_ELEMENT_DOWN etc.
});
