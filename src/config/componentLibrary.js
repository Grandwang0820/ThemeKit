// Defines the components available in the LeftPanel component library.
// This structure will be used to generate draggable items and
// to inform the canvasReducer and rendering logic about component properties.

export const componentLibrary = {
  Container: {
    name: 'Container', // Display name in the library
    htmlTag: 'div',   // Corresponding HTML tag
    defaultStyles: {
      display: 'flex',
      flexDirection: 'column', // Default to column for new containers
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '10px',
      minHeight: '50px', // Minimum height to make it visible when empty
      border: '1px dashed #ccc', // Visual aid for empty containers
      backgroundColor: 'rgba(240, 240, 240, 0.5)',
    },
    defaultProps: {},
    children: [], // Can accept children
  },
  Text: {
    name: 'Text',
    htmlTag: 'p', // Can be p, h1, h2, etc. Inspector could allow changing tag.
    defaultStyles: {
      padding: '5px',
      fontSize: '16px',
      color: '#333333',
    },
    defaultProps: {
      content: 'Some Text', // Default text content
    },
    children: null, // Cannot accept children directly (text is content)
  },
  Heading: { // Example of a more specific text component
    name: 'Heading',
    htmlTag: 'h1',
    defaultStyles: {
      padding: '5px',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#000000',
      margin: '0 0 10px 0',
    },
    defaultProps: {
      content: 'Heading Text',
    },
    children: null,
  },
  Image: {
    name: 'Image',
    htmlTag: 'img',
    selfClosing: true, // Indicates it's a self-closing tag like <img> or <input>
    defaultStyles: {
      width: '100px',
      height: '100px',
      objectFit: 'cover', // How the image should be resized
    },
    defaultProps: {
      src: 'https://via.placeholder.com/100', // Default placeholder image
      alt: 'Placeholder Image',
    },
    children: null, // Cannot accept children
  },
  Button: {
    name: 'Button',
    htmlTag: 'button',
    defaultStyles: {
      padding: '10px 15px',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    defaultProps: {
      content: 'Click Me', // Default button text
    },
    children: null, // Text content is via props.content
  },
  // Add more components here as needed, e.g., Input, Link, Icon etc.
  // For example, an Input component:
  // Input: {
  //   name: 'Input',
  //   htmlTag: 'input',
  //   selfClosing: true,
  //   defaultStyles: {
  //     padding: '8px',
  //     margin: '5px',
  //     border: '1px solid #ccc',
  //     borderRadius: '4px',
  //   },
  //   defaultProps: {
  //     type: 'text', // Default input type
  //     placeholder: 'Enter text...',
  //   },
  //   children: null,
  // },
};

// Function to get a new component instance with default values
export const getNewComponent = (componentType) => {
  const componentConfig = componentLibrary[componentType];
  if (!componentConfig) {
    throw new Error(`Component type "${componentType}" not found in library.`);
  }

  // Deep copy default styles and props to avoid shared references
  return {
    component: componentType,
    styles: JSON.parse(JSON.stringify(componentConfig.defaultStyles || {})),
    props: JSON.parse(JSON.stringify(componentConfig.defaultProps || {})),
    // children should be an empty array if the component can have children, otherwise undefined/null
    children: componentConfig.children === null ? null : [],
  };
};
