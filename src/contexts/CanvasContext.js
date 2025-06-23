import React, { createContext, useReducer, useMemo } from 'react';
import canvasReducer from '../core/state/canvasReducer'; // Will be created later
import initialState from '../core/state/initialState'; // Will be created later

export const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  const [canvasState, dispatch] = useReducer(canvasReducer, initialState);

  const contextValue = useMemo(() => {
    return { canvasState, dispatch };
  }, [canvasState, dispatch]);

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};
