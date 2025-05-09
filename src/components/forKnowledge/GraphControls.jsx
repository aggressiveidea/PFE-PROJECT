import React from 'react';
import './GraphControls.css';

const GraphControls = ({ 
  onZoomIn, 
  onZoomOut, 
  onZoomReset, 
  onToggleInfoPanel, 
  isPanelOpen,
  language 
}) => {
  const translations = {
    english: {
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      reset: "Reset View",
      panel: isPanelOpen ? "Hide Panel" : "Show Panel"
    },
    french: {
      zoomIn: "Zoom Avant",
      zoomOut: "Zoom Arrière",
      reset: "Réinitialiser",
      panel: isPanelOpen ? "Masquer le Panneau" : "Afficher le Panneau"
    },
    arabic: {
      zoomIn: "تكبير",
      zoomOut: "تصغير",
      reset: "إعادة ضبط",
      panel: isPanelOpen ? "إخفاء اللوحة" : "إظهار اللوحة"
    }
  };

  const t = translations[language] || translations.english;

  return (
    <div className="graph-controls">
      <button className="control-button" onClick={onZoomIn} title={t.zoomIn}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
      <button className="control-button" onClick={onZoomOut} title={t.zoomOut}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
      <button className="control-button" onClick={onZoomReset} title={t.reset}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
      </button>
      <button className="control-button" onClick={onToggleInfoPanel} title={t.panel}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isPanelOpen ? (
            <path d="M19 12H5M12 19V5"></path>
          ) : (
            <path d="M12 5v14M5 12h14"></path>
          )}
        </svg>
      </button>
    </div>
  );
};

export default GraphControls;