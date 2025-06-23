import React from 'react';
import './styles/index.css'; // Ensure Tailwind is imported
import TopBar from './components/layout/TopBar';
// LeftPanel is now part of MiddlePanel's composition to manage canvasFrame state
import MiddlePanel from './components/layout/MiddlePanel';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          {/* MiddlePanel now includes LeftPanel and InspectorPanel */}
          <MiddlePanel />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
