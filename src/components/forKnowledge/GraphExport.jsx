"use client";

import React from "react";
import { X } from "lucide-react";

const GraphLegend = ({ categories, nodeColors }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) return null;

  return (
    <div className="graph-legend">
      <div className="legend-header">
        <h3>Graph Legend</h3>
        <button onClick={() => setIsOpen(false)} className="close-button">
          <X size={16} />
        </button>
      </div>

      <div className="legend-content">
        <div className="legend-section">
          <h4>Node Types</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div
                className="legend-node"
                style={{
                  backgroundColor: nodeColors.term.default,
                  border: "3px solid #FFFFFF",
                }}
              />
              <span>Terms</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-node"
                style={{
                  backgroundColor: nodeColors.definition.primary,
                  border: "2px solid #FFFFFF",
                }}
              />
              <span>Definitions</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-node large"
                style={{
                  backgroundColor:
                    nodeColors.category["Computer Crime"] || "#6366F1",
                  border: "4px solid #FFFFFF",
                }}
              />
              <span>Categories</span>
            </div>
          </div>
        </div>

        <div className="legend-section">
          <h4>Categories</h4>
          <div className="legend-items">
            {categories.map((category) => (
              <div key={category} className="legend-item">
                <div
                  className="legend-node large"
                  style={{
                    backgroundColor: nodeColors.category[category] || "#6366F1",
                    border: "4px solid #FFFFFF",
                  }}
                />
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="legend-section">
          <h4>Relationships</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div
                className="legend-edge"
                style={{ backgroundColor: "#4F46E5" }}
              />
              <span>Has Definition</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-edge"
                style={{ backgroundColor: "#10B981" }}
              />
              <span>Belongs To</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-edge"
                style={{ backgroundColor: "#F59E0B" }}
              />
              <span>Related To</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphLegend;
