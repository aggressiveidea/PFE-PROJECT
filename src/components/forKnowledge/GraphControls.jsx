import React from "react";
import "./GraphControls.css";

const GraphControls = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleFullScreen,
  onToggleInfoPanel,
  isFullScreen,
  isPanelOpen
}) => {
  return (
    <div className="graph-controls">
      <div className="zoom-controls">
        <button onClick={onZoomIn} className="control-button" title="Zoom In">
          <span className="control-icon zoom-in-icon"></span>
        </button>
        <button onClick={onZoomReset} className="control-button" title="Reset Zoom">
          <span className="control-icon zoom-reset-icon"></span>
        </button>
        <button onClick={onZoomOut} className="control-button" title="Zoom Out">
          <span className="control-icon zoom-out-icon"></span>
        </button>
      </div>
      
      <div className="view-controls">
        <button 
          onClick={onToggleInfoPanel} 
          className={`control-button ${isPanelOpen ? 'active' : ''}`}
          title="Toggle Info Panel"
        >
          <span className="control-icon info-icon"></span>
        </button>
        <button 
          onClick={onToggleFullScreen} 
          className={`control-button ${isFullScreen ? 'active' : ''}`}
          title="Toggle Full Screen"
        >
          <span className="control-icon fullscreen-icon"></span>
        </button>
      </div>
    </div>
  );
};

export default GraphControls;
