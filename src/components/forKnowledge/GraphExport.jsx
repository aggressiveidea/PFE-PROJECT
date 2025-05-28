const GraphLegend = ({ categories = [], nodeColors = {} }) => {
  return (
    <div className="graph-legend">
      <div className="legend-title">Node Types</div>
      <div className="legend-items">
        <div className="legend-item">
          <div
            className="legend-node"
            style={{ backgroundColor: nodeColors.term.default }}
          ></div>
          <div className="legend-label">Term</div>
        </div>
        <div className="legend-item">
          <div
            className="legend-node"
            style={{ backgroundColor: nodeColors.definition.primary }}
          ></div>
          <div className="legend-label">Primary Definition</div>
        </div>
        <div className="legend-item">
          <div
            className="legend-node"
            style={{ backgroundColor: nodeColors.definition.secondary }}
          ></div>
          <div className="legend-label">Secondary Definition</div>
        </div>
        <div className="legend-item">
          <div
            className="legend-node"
            style={{
              backgroundColor:
                nodeColors.category["Computer Science"] || "#06B6D4",
              border: "2px solid #333",
            }}
          ></div>
          <div className="legend-label">Category</div>
        </div>
      </div>

      <div className="legend-title" style={{ marginTop: "15px" }}>
        Relationship Types
      </div>
      <div className="legend-items">
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#4C8EDA" }}
          ></div>
          <div className="legend-label">Has Definition</div>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#8DCC93" }}
          ></div>
          <div className="legend-label">Belongs To</div>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#FFC454" }}
          ></div>
          <div className="legend-label">Related To</div>
        </div>
      </div>
    </div>
  );
};

export default GraphLegend;
