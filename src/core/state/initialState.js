// As per README example:
const initialState = {
  id: 'root-container',
  component: 'Container', // This should match a key in componentLibrary.js
  props: {}, // Props specific to the component type, e.g., src for Image
  styles: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%', // Default to full width for the root
    height: '100%', // Default to full height for the root
    padding: '20px',
    backgroundColor: '#ffffff', // Default background
  },
  children: [
    {
      id: 'image-placeholder-123',
      component: 'Image',
      props: { src: 'https://via.placeholder.com/150' }, // Placeholder image
      styles: { width: '150px', height: '150px', marginBottom: '20px' }
    },
    {
      id: 'text-placeholder-456',
      component: 'Text', // This should match a key in componentLibrary.js
      props: { content: 'Welcome to ThemeKit!' },
      styles: { fontSize: '24px', color: '#333333' }
    }
  ]
};

export default initialState;
