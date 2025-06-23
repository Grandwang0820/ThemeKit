// Simple unique ID generator
let lastId = 0;
export const generateUniqueId = (prefix = 'el') => {
  lastId++;
  return `${prefix}-${lastId.toString(36)}`;
};
