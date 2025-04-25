import React, { useState } from "react";
import "./GraphExport.css";

const GraphExport = ({ canvasRef }) => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExport = (format) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    let dataUrl;
    
    if (format === 'png') {
      dataUrl = canvas.toDataURL('image/png');
    } else if (format === 'jpeg') {
      dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    }
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `graph-visualization.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExportOpen(false);
  };

  return (
    <div className="graph-export">
      <button 
        className="export-button"
        onClick={() => setIsExportOpen(!isExportOpen)}
      >
        Export Graph
      </button>
      
      {isExportOpen && (
        <div className="export-dropdown">
          <button onClick={() => handleExport('png')}>
            Export as PNG
          </button>
          <button onClick={() => handleExport('jpeg')}>
            Export as JPEG
          </button>
        </div>
      )}
    </div>
  );
};

export default GraphExport;
