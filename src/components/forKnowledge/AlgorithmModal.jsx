"use client";
import "./AlgorithmModal.css";
import { useState } from "react";
import gdsApi from "../../services/neo4jAPI";

const AlgorithmModal = ({ isOpen, onClose, algorithm }) => {
  const [selectedScope, setSelectedScope] = useState("");
  const [selectedClusterType, setSelectedClusterType] = useState("");
  const [selectedDefinitionLevel, setSelectedDefinitionLevel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [appliedAlgorithmResult, setAppliedAlgorithmResult] = useState(null);

  const handleScopeChange = (scope) => {
    setSelectedScope(scope);
    setSelectedClusterType("");
    setSelectedDefinitionLevel("");
    setSelectedCategory("");
  };

  const handleClusterTypeChange = (type) => {
    setSelectedClusterType(type);
    setSelectedDefinitionLevel("");
    setSelectedCategory("");
  };

  const handleDefinitionLevelChange = (level) => {
    setSelectedDefinitionLevel(level);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleApplyAlgorithm = async () => {
    if (!selectedScope) {
      console.error("No scope selected");
      return;
    }

    setShowResults(false);
    setAppliedAlgorithmResult(null);

    try {
      // Show loading state
      setAppliedAlgorithmResult({
        loading: true,
        algorithm: algorithm.name.english,
        scope: selectedScope,
      });
      setShowResults(true);

      let projectionName = null;
      const algorithmParams = {};

      // Create or get appropriate projection based on scope
      if (selectedScope === "allGraph") {
        const projection = await gdsApi.createProjection("complete", {
          language: "english",
        });
        projectionName = projection.projectionName;
      } else if (selectedScope === "clustering") {
        if (selectedClusterType === "categories" && selectedCategory) {
          const projection = await gdsApi.createProjection("category", {
            category: selectedCategory,
            language: "english",
          });
          projectionName = projection.projectionName;
          algorithmParams.category = selectedCategory;
        } else if (
          selectedClusterType === "definitions" &&
          selectedDefinitionLevel
        ) {
          // For definitions, we'll use complete projection but filter by definition level
          const projection = await gdsApi.createProjection("complete", {
            language: "english",
          });
          projectionName = projection.projectionName;
          algorithmParams.definitionLevel = selectedDefinitionLevel;
        } else if (selectedClusterType === "terms") {
          const projection = await gdsApi.createProjection("terms", {
            language: "english",
          });
          projectionName = projection.projectionName;
          algorithmParams.nodeType = "terms";
        }
      } else if (selectedScope === "recentResearch") {
        // For recent research, use complete projection
        const projection = await gdsApi.createProjection("recent", {
          language: "english",
        });
        projectionName = projection.projectionName;
        algorithmParams.recent = true;
      }

      if (!projectionName) {
        throw new Error("Failed to create or get graph projection");
      }

      // Run the appropriate algorithm using gdsApi methods
      let results;
      switch (algorithm.id) {
        case "pagerank":
          results = await gdsApi.runPageRank(projectionName, {
            maxIterations: 20,
            dampingFactor: 0.85,
            tolerance: 1.0,
            ...algorithmParams,
          });
          break;
        case "louvain":
          results = await gdsApi.runLouvain(projectionName, {
            maxIterations: 10,
            tolerance: 0.01,
            ...algorithmParams,
          });
          break;
        case "betweenness":
          results = await gdsApi.runBetweenness(projectionName, {
            samplingSize: 100,
            ...algorithmParams,
          });
          break;
        case "labelpropagation":
          results = await gdsApi.runLabelPropagation(projectionName, {
            maxIterations: 10,
            ...algorithmParams,
          });
          break;
        case "closeness":
          results = await gdsApi.runClosenessCentrality(
            projectionName,
            algorithmParams
          );
          break;
        case "degree":
          results = await gdsApi.runDegreeCentrality(
            projectionName,
            algorithmParams
          );
          break;
        case "wcc":
          results = await gdsApi.runWeaklyConnectedComponents(
            projectionName,
            algorithmParams
          );
          break;
        case "trianglecount":
          results = await gdsApi.runTriangleCount(
            projectionName,
            algorithmParams
          );
          break;
        case "clusteringcoefficient":
          results = await gdsApi.runLocalClusteringCoefficient(
            projectionName,
            algorithmParams
          );
          break;
        default:
          throw new Error(`Algorithm ${algorithm.id} not implemented`);
      }

      // Format results for display
      const formattedResults = {
        algorithm: algorithm.name.english,
        scope: selectedScope,
        projectionName: projectionName,
        nodesProcessed: results.resultCount || results.results?.length || 0,
        edgesProcessed: results.relationshipCount || 0,
        executionTime: results.computeMillis
          ? `${(results.computeMillis / 1000).toFixed(2)}s`
          : "N/A",
        results: results.results || [],
        algorithmSpecific: results.algorithmSpecific || {},
        loading: false,
      };

      setAppliedAlgorithmResult(formattedResults);

      // Clean up projection
      try {
        await gdsApi.dropProjection(projectionName);
      } catch (cleanupError) {
        console.warn("Failed to cleanup projection:", cleanupError);
      }

      // Add to search history
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData?.id || userData?._id;

        if (userId) {
          // You can add search history functionality here if needed
          console.log("Search history would be added here for user:", userId);
        }
      } catch (historyError) {
        console.warn("Failed to add to search history:", historyError);
      }
    } catch (error) {
      console.error("Error applying algorithm:", error);

      // Show error state
      setAppliedAlgorithmResult({
        algorithm: algorithm.name.english,
        scope: selectedScope,
        error: error.message || "Failed to apply algorithm",
        loading: false,
      });
    }
  };

  if (!isOpen || !algorithm) {
    return null;
  }

  const renderGraph = (graphData) => {
    if (!graphData || !graphData.nodes || !graphData.edges) {
      return <p>No graph data available.</p>;
    }

    const { nodes, edges } = graphData;

    const maxX = Math.max(...nodes.map((node) => node.x));
    const maxY = Math.max(...nodes.map((node) => node.y));

    const viewBoxWidth = maxX + 20; // Add some padding
    const viewBoxHeight = maxY + 20; // Add some padding

    return (
      <svg
        width="100%"
        height="200"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      >
        {edges.map((edge, index) => (
          <line
            key={`edge-${index}`}
            x1={nodes.find((node) => node.id === edge.source)?.x}
            y1={nodes.find((node) => node.id === edge.source)?.y}
            x2={nodes.find((node) => node.id === edge.target)?.x}
            y2={nodes.find((node) => node.id === edge.target)?.y}
            stroke={edge.color || "#ccc"}
            strokeWidth={edge.width || 2}
          />
        ))}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.size || 8}
            fill={node.color || "#8B5CF6"}
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="algorithm-modal-overlay">
      <div className="algorithm-modal">
        <div className="algorithm-modal-header">
          <h2>{algorithm.name.english}</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="algorithm-modal-content">
          <div className="algorithm-modal-section">
            <h4>Overview</h4>
            <p>{algorithm.overview}</p>
          </div>
          <div className="algorithm-modal-section">
            <h4>How It Works</h4>
            <p>{algorithm.howItWorks.english}</p>
          </div>
          <div className="algorithm-modal-section">
            <h4>Examples</h4>
            <div className="algorithm-examples">
              <div className="example-container">
                <div className="example-item">
                  <h5>Before Algorithm</h5>
                  <div className="example-graph before">
                    {algorithm.before && renderGraph(algorithm.before)}
                  </div>
                </div>
                <div className="example-item">
                  <h5>After Algorithm</h5>
                  <div className="example-graph after">
                    {algorithm.after && renderGraph(algorithm.after)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="algorithm-modal-section">
            <h4>Applications</h4>
            <ul className="applications-list">
              {algorithm.applications.english.map((app, index) => (
                <li key={index}>{app}</li>
              ))}
            </ul>
          </div>
          <div className="algorithm-modal-section">
            <h4>Complexity</h4>
            <div className="complexity-details">
              <div className="complexity-item">
                <span className="complexity-label">Time:</span>
                <span className="complexity-value">
                  {algorithm.timeComplexity}
                </span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">Space:</span>
                <span className="complexity-value">
                  {algorithm.spaceComplexity}
                </span>
              </div>
            </div>
          </div>
          <div className="algorithm-modal-section apply-algorithm-section">
            <h4>Apply Algorithm</h4>
            <div className="apply-controls">
              <div className="scope-selection">
                <label htmlFor="scope-select">Apply to:</label>
                <select
                  id="scope-select"
                  value={selectedScope}
                  onChange={(e) => handleScopeChange(e.target.value)}
                  className="scope-select"
                >
                  <option value="">Select scope...</option>
                  <option value="allGraph">All Graph</option>
                  <option value="clustering">Clustering</option>
                  <option value="recentResearch">Recent Research</option>
                </select>
              </div>

              {selectedScope === "clustering" && (
                <div className="cluster-options">
                  <select
                    value={selectedClusterType || ""}
                    onChange={(e) => handleClusterTypeChange(e.target.value)}
                    className="cluster-type-select"
                  >
                    <option value="">Select cluster type...</option>
                    <option value="terms">Terms</option>
                    <option value="definitions">Definitions</option>
                    <option value="categories">Categories</option>
                  </select>

                  {selectedClusterType === "definitions" && (
                    <select
                      value={selectedDefinitionLevel || ""}
                      onChange={(e) =>
                        handleDefinitionLevelChange(e.target.value)
                      }
                      className="definition-level-select"
                    >
                      <option value="">Select definition level...</option>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  )}

                  {selectedClusterType === "categories" && (
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="category-select"
                    >
                      <option value="">Select category...</option>
                      <option value="Computer Crime">Computer Crime</option>
                      <option value="Personal Data">Personal Data</option>
                      <option value="Electronic Commerce">
                        Electronic Commerce
                      </option>
                      <option value="Organization">Organization</option>
                      <option value="Networks">Networks</option>
                      <option value="Intellectual Property">
                        Intellectual Property
                      </option>
                      <option value="Miscellaneous">Miscellaneous</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  )}
                </div>
              )}

              <button
                className="apply-algorithm-btn"
                onClick={handleApplyAlgorithm}
                disabled={
                  !selectedScope ||
                  (selectedScope === "clustering" && !selectedClusterType) ||
                  (selectedClusterType === "definitions" &&
                    !selectedDefinitionLevel) ||
                  (selectedClusterType === "categories" && !selectedCategory)
                }
              >
                Apply Algorithm
              </button>
            </div>
          </div>
          {showResults && appliedAlgorithmResult && (
            <div className="algorithm-modal-section results-section">
              <div className="results-header">
                <h4>Algorithm Results: {appliedAlgorithmResult.algorithm}</h4>
                <button
                  className="close-results-btn"
                  onClick={() => setShowResults(false)}
                >
                  ×
                </button>
              </div>
              <div className="results-content">
                {appliedAlgorithmResult.loading ? (
                  <div className="results-loading">
                    <div className="loading-spinner"></div>
                    <p>Running algorithm...</p>
                  </div>
                ) : appliedAlgorithmResult.error ? (
                  <div className="results-error">
                    <p className="error-message">
                      Error: {appliedAlgorithmResult.error}
                    </p>
                    <button
                      className="retry-btn"
                      onClick={handleApplyAlgorithm}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="results-stats">
                      <div className="stat-item">
                        <span className="stat-label">Projection:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.projectionName}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Nodes Processed:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.nodesProcessed}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Edges Processed:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.edgesProcessed}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Execution Time:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.executionTime}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Scope:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.scope}
                        </span>
                      </div>
                    </div>
                    {appliedAlgorithmResult.results &&
                      appliedAlgorithmResult.results.length > 0 && (
                        <div className="results-table">
                          <h5>Top Results</h5>
                          <table>
                            <thead>
                              <tr>
                                <th>Rank</th>
                                <th>Node</th>
                                <th>Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {appliedAlgorithmResult.results
                                .slice(0, 10)
                                .map((result, index) => (
                                  <tr key={result.nodeId || index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {result.nodeName ||
                                        result.name ||
                                        result.label ||
                                        `Node ${result.nodeId}`}
                                    </td>
                                    <td>
                                      {typeof result.score === "number"
                                        ? result.score.toFixed(4)
                                        : result.score}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    {appliedAlgorithmResult.algorithmSpecific &&
                      Object.keys(appliedAlgorithmResult.algorithmSpecific)
                        .length > 0 && (
                        <div className="algorithm-specific-results">
                          <h5>Algorithm-Specific Results</h5>
                          <div className="specific-stats">
                            {Object.entries(
                              appliedAlgorithmResult.algorithmSpecific
                            ).map(([key, value]) => (
                              <div key={key} className="stat-item">
                                <span className="stat-label">{key}:</span>
                                <span className="stat-value">
                                  {typeof value === "number"
                                    ? value.toFixed(4)
                                    : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmModal;
