// Functions to generate HTML and CSS from canvasState

/**
 * Converts a style object into a CSS string.
 * Example: { color: 'red', fontSize: '16px' } -> "color: red; font-size: 16px;"
 * @param {object} styles The style object.
 * @returns {string} The CSS string.
 */
const generateStylesString = (styles) => {
  if (!styles) return '';
  return Object.entries(styles)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabKey}: ${value};`;
    })
    .join(' ');
};

/**
 * Recursively generates HTML for a given node and its children.
 * @param {object} node The current node from canvasState.
 * @param {object} componentLibrary The component library definition.
 * @returns {string} The HTML string for the node.
 */
export const generateHTML = (node, componentLibrary) => {
  if (!node) return '';

  const componentInfo = componentLibrary[node.component];
  if (!componentInfo) {
    console.warn(`Component type "${node.component}" not found in library.`);
    return `<!-- Unknown component: ${node.component} -->`;
  }

  const Tag = componentInfo.htmlTag || 'div'; // Default to div if no htmlTag specified
  const props = node.props || {};
  const attributes = Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  // Generate a unique class name for styling, e.g., el-image-123
  const className = `el-${node.component.toLowerCase()}-${node.id}`;

  let childrenHTML = '';
  if (node.children && node.children.length > 0) {
    childrenHTML = node.children.map(child => generateHTML(child, componentLibrary)).join('\n');
  } else if (Tag === 'img' && props.src) {
    // Img tags are self-closing and don't have children in the same way
    // Text content for components like Text or Heading comes from props.content
  } else if (props.content) {
    childrenHTML = props.content; // For text-based components
  }


  if (Tag === 'img' || componentInfo.selfClosing) { // For self-closing tags like img, input
    return `<${Tag} id="${node.id}" class="${className}" ${attributes} />`;
  }

  return `<${Tag} id="${node.id}" class="${className}" ${attributes}>
  ${childrenHTML}
</${Tag}>`;
};

/**
 * Recursively generates CSS rules for a given node and its children.
 * @param {object} node The current node from canvasState.
 * @param {object} componentLibrary The component library definition.
 * @returns {string} The CSS rules string.
 */
export const generateCSS = (node, componentLibrary) => {
  if (!node) return '';

  let cssString = '';
  const className = `el-${node.component.toLowerCase()}-${node.id}`;
  const styles = generateStylesString(node.styles);

  if (styles) {
    cssString += `.${className} {\n  ${styles}\n}\n\n`;
  }

  if (node.children && node.children.length > 0) {
    cssString += node.children.map(child => generateCSS(child, componentLibrary)).join('');
  }

  return cssString;
};
