import "./GraphExport.css";

const GraphLegend = ({ categories, nodeColors, categoryEmojis }) => {
  return (
    <div className="graph-legend">
      <div className="legend-header">
        <h3>Graph Legend</h3>
      </div>

      <div className="legend-section">
        <h4>Node Types</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div
              className="legend-node"
              style={{
                backgroundColor: nodeColors.term.default,
                border: "2px solid #666666",
              }}
            ></div>
            <span>Terms</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-node"
              style={{
                backgroundColor: nodeColors.definition.primary,
                border: "2px solid #888888",
              }}
            ></div>
            <span>Definitions</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-node category-node"
              style={{
                backgroundColor:
                  nodeColors.category["Computer Crime"] || "#6366F1",
                border: "3px solid #333333",
              }}
            >
              🔒
            </div>
            <span>Categories</span>
          </div>
        </div>
      </div>

      <div className="legend-section">
        <h4>Relationships</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div
              className="legend-edge"
              style={{ backgroundColor: "#4C8EDA" }}
            ></div>
            <span>Has Definition</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-edge"
              style={{ backgroundColor: "#8DCC93" }}
            ></div>
            <span>Belongs To</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-edge"
              style={{ backgroundColor: "#FFC454" }}
            ></div>
            <span>Related To</span>
          </div>
        </div>
      </div>

      <div className="legend-section">
        <h4>Categories</h4>
        <div className="legend-items">
          {categories.map((category) => (
            <div key={category} className="legend-item">
              <div
                className="legend-node category-node"
                style={{
                  backgroundColor: nodeColors.category[category] || "#6366F1",
                  border: "2px solid #333333",
                }}
              >
                {categoryEmojis[category]}
              </div>
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphLegend;
