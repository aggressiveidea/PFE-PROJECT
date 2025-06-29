"use client";

import "./AlgorithmModal.css";
import { useState, useEffect } from "react";
import { analyzeGraph } from "../../services/Api";

const AlgorithmModal = ({
  isOpen,
  onClose,
  algorithm,
  customProjections = [],
  language = "english",
  translations = {},
}) => {
  const [selectedScope, setSelectedScope] = useState("");
  const [selectedClusterType, setSelectedClusterType] = useState("");
  const [selectedDefinitionLevel, setSelectedDefinitionLevel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [appliedAlgorithmResult, setAppliedAlgorithmResult] = useState(null);
  const [customProjectionsState, setCustomProjections] = useState([]);
  const [selectedCustomProjection, setSelectedCustomProjection] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch custom projections from API
  useEffect(() => {
    const fetchCustomProjections = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3001/api/gds/projections",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomProjections(data);
      } catch (error) {
        console.error("Error fetching custom projections:", error);
      }
    };

    if (isOpen) {
      fetchCustomProjections();
    }
  }, [isOpen]);

  useEffect(() => {
    setCustomProjections(customProjections);
  }, [customProjections]);

  const handleScopeChange = (scope) => {
    setSelectedScope(scope);
    setSelectedClusterType("");
    setSelectedDefinitionLevel("");
    setSelectedCategory("");
    setSelectedCustomProjection("");
    setError(null);
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

  // Get node ID helper function
  const getNodeId = (nodeId) => {
    if (typeof nodeId === "object" && nodeId.low !== undefined) {
      return nodeId.low.toString();
    }
    return nodeId?.toString() || "N/A";
  };

  // Format algorithm results for display
  const formatAlgorithmResults = (results, algorithmId) => {
    if (!results || !Array.isArray(results)) return [];

    return results.map((result, index) => {
      const baseResult = {
        rank: index + 1,
        nodeId:
          result.nodeId?.toString() || result.id?.toString() || `node_${index}`,
        label: result.name || result.label || `Node ${index + 1}`,
        nodeType: "Node", // Your backend doesn't specify node types
        internalId: result.nodeId || result.id || index,
      };

      switch (algorithmId) {
        case "PageRank":
          return {
            ...baseResult,
            score:
              typeof result.score === "number"
                ? result.score.toFixed(6)
                : result.score || "N/A",
          };

        case "Betweenness":
        case "Closeness":
        case "Degree":
          return {
            ...baseResult,
            score:
              typeof result.score === "number"
                ? result.score.toFixed(6)
                : result.score || "N/A",
          };

        case "Louvain":
        case "LabelPropagation":
          return {
            ...baseResult,
            communityId: result.communityId || "N/A",
          };

        case "Jaccard":
          return {
            ...baseResult,
            sourceId: result.sourceId || "N/A",
            targetId: result.targetId || "N/A",
            similarity:
              typeof result.similarity === "number"
                ? result.similarity.toFixed(6)
                : result.similarity || "N/A",
          };

        default:
          return {
            ...baseResult,
            value: result.score || result.value || "N/A",
          };
      }
    });
  };

  // Get table headers based on algorithm type
  const getTableHeaders = (algorithmId) => {
    const baseHeaders = ["Rank", "Node", "Type"];

    switch (algorithmId) {
      case "PageRank":
        return [...baseHeaders, "PageRank Score"];
      case "Betweenness":
        return [...baseHeaders, "Betweenness Score"];
      case "Closeness":
        return [...baseHeaders, "Closeness Score"];
      case "Degree":
        return [...baseHeaders, "Degree Score"];
      case "Louvain":
        return [...baseHeaders, "Community ID"];
      case "LabelPropagation":
        return [...baseHeaders, "Label"];
      case "Jaccard":
        return ["Rank", "Source Node", "Target Node", "Similarity Score"];
      default:
        return [...baseHeaders, "Value"];
    }
  };

  // Render table cell based on algorithm type
  const renderTableCell = (result, algorithmId) => {
    switch (algorithmId) {
      case "PageRank":
      case "Betweenness":
      case "Closeness":
      case "Degree":
        return <td className="score-cell">{result.score}</td>;
      case "Louvain":
      case "LabelPropagation":
        return (
          <td className="community-cell">Community {result.communityId}</td>
        );
      case "Jaccard":
        return (
          <>
            <td className="node-cell">{result.sourceId}</td>
            <td className="node-cell">{result.targetId}</td>
            <td className="similarity-cell">{result.similarity}</td>
          </>
        );
      default:
        return <td className="value-cell">{result.value}</td>;
    }
  };

  // Get node type color
  const getNodeTypeColor = (nodeType) => {
    const colors = {
      Term: "#8B5CF6",
      Definition: "#06B6D4",
      Category: "#10B981",
      Unknown: "#6B7280",
      Similarity: "#A855F7",
    };
    return colors[nodeType] || colors["Unknown"];
  };

  // Main function to apply algorithm using the API
  const handleApplyAlgorithm = async () => {
    if (!selectedScope) {
      setError("Please select a scope to apply the algorithm");
      return;
    }

    setLoading(true);
    setShowResults(false);
    setAppliedAlgorithmResult(null);
    setError(null);

    try {
      // Show loading state
      setAppliedAlgorithmResult({
        loading: true,
        algorithm: algorithm.name?.english || algorithm.name,
        scope: selectedScope,
      });
      setShowResults(true);

      // Map frontend scope to backend type
      let backendType = "all"; // default
      let backendName = null;

      if (selectedScope === "allGraph" || selectedScope === "complete") {
        backendType = "all";
      } else if (selectedScope === "clustering") {
        if (selectedClusterType === "categories") {
          backendType = "Category";
          backendName = selectedCategory || null;
        } else if (selectedClusterType === "terms") {
          backendType = "Term";
          backendName = null;
        } else if (selectedClusterType === "definitions") {
          backendType = "Definition";
          backendName = selectedDefinitionLevel; // "primary" or "secondary" goes in name parameter
        }
      } else if (selectedScope === "recentResearch") {
        backendType = "custom";
        backendName = null;
      } else if (selectedScope === "custom" && selectedCustomProjection) {
        backendType = "custom";
        backendName = selectedCustomProjection;
      }

      const apiLanguage =
        language === "english"
          ? "en"
          : language === "french"
          ? "fr"
          : language === "arabic"
          ? "ar"
          : "en";

      // Prepare config for specific algorithms
      const apiConfig = {};
      if (algorithm.id === "PageRank") {
        apiConfig.maxIterations = 20;
        apiConfig.dampingFactor = 0.85;
        apiConfig.tolerance = 0.0001;
      } else if (algorithm.id === "Jaccard") {
        apiConfig.similarityCutoff = 0.1;
      }

      // Make API call using your backend structure
      const results = await analyzeGraph(
        backendType, // type parameter
        algorithm.id, // algorithmName parameter (this is always English)
        backendName, // name parameter
        apiLanguage, // language parameter
        apiConfig // config parameter
      );

      if (!results || !results.success) {
        throw new Error(results?.error || "Algorithm execution failed");
      }

      // Format the results based on your backend response structure
      const formattedResults = formatAlgorithmResults(
        results.results || [],
        algorithm.id
      );

      const finalResults = {
        algorithm: algorithm.name?.english || algorithm.name,
        algorithmId: algorithm.id,
        scope: selectedScope,
        projectionName: `${backendType}_projection`,
        nodesProcessed: results.results?.length || 0,
        edgesProcessed: 0, // Your backend doesn't return this
        executionTime: "N/A", // Your backend doesn't return this
        results: formattedResults,
        rawResults: results.results || [],
        algorithmSpecific: {
          projectionType: selectedScope,
          backendType: backendType,
          ...(selectedCategory && { category: selectedCategory }),
          ...(selectedDefinitionLevel && {
            definitionLevel: selectedDefinitionLevel,
          }),
          ...(selectedClusterType && { clusterType: selectedClusterType }),
          ...(selectedCustomProjection && {
            customProjection: selectedCustomProjection,
          }),
        },
        loading: false,
        success: true,
      };

      setAppliedAlgorithmResult(finalResults);

      // Add to search history if user is logged in
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData?.id || userData?._id;

        if (userId) {
          console.log("Search history would be added here for user:", userId);
        }
      } catch (historyError) {
        console.warn("Failed to add to search history:", historyError);
      }
    } catch (error) {
      console.error("Error applying algorithm:", error);

      setAppliedAlgorithmResult({
        algorithm: algorithm.name?.english || algorithm.name,
        algorithmId: algorithm.id,
        scope: selectedScope,
        error: error.message || "Failed to apply algorithm",
        loading: false,
        success: false,
      });

      setError(error.message || "Failed to apply algorithm");
    } finally {
      setLoading(false);
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

    const viewBoxWidth = maxX + 20;
    const viewBoxHeight = maxY + 20;

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

  const t = translations || {};

  return (
    <div className="algorithm-modal-overlay">
      <div className="algorithm-modal">
        <div className="algorithm-modal-header">
          <h2>
            {algorithm.name?.[language] ||
              algorithm.name?.english ||
              algorithm.name}
          </h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>
        <div className="algorithm-modal-content">
          <div className="algorithm-modal-section">
            <h4>Overview</h4>
            <p>
              {algorithm.overview?.[language] ||
                algorithm.overview?.english ||
                algorithm.overview}
            </p>
          </div>

          {algorithm.howItWorks && (
            <div className="algorithm-modal-section">
              <h4>How It Works</h4>
              <p>
                {algorithm.howItWorks?.[language] ||
                  algorithm.howItWorks?.english ||
                  algorithm.howItWorks}
              </p>
            </div>
          )}

          {algorithm.before && algorithm.after && (
            <div className="algorithm-modal-section">
              <h4>Examples</h4>
              <div className="algorithm-examples">
                <div className="example-container">
                  <div className="example-item">
                    <h5>Before Algorithm</h5>
                    <div className="example-graph before">
                      {renderGraph(algorithm.before)}
                    </div>
                  </div>
                  <div className="example-item">
                    <h5>After Algorithm</h5>
                    <div className="example-graph after">
                      {renderGraph(algorithm.after)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {algorithm.applications && (
            <div className="algorithm-modal-section">
              <h4>Applications</h4>
              <ul className="applications-list">
                {(
                  algorithm.applications?.[language] ||
                  algorithm.applications?.english ||
                  algorithm.applications ||
                  []
                ).map((app, index) => (
                  <li key={index}>{app}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="algorithm-modal-section">
            <h4>Complexity</h4>
            <div className="complexity-details">
              <div className="complexity-item">
                <span className="complexity-label">Time:</span>
                <span className="complexity-value">
                  {algorithm.timeComplexity || "N/A"}
                </span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">Space:</span>
                <span className="complexity-value">
                  {algorithm.spaceComplexity || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="algorithm-modal-section apply-algorithm-section">
            <h4>Apply Algorithm</h4>
            {error && <div className="error-message">{error}</div>}
            <div className="apply-controls">
              <div className="scope-selection">
                <label htmlFor="scope-select">Apply to:</label>
                <select
                  id="scope-select"
                  value={selectedScope}
                  onChange={(e) => handleScopeChange(e.target.value)}
                  className="scope-select"
                  disabled={loading}
                >
                  <option value="">Select scope...</option>
                  <option value="allGraph">All Graph</option>
                  <option value="clustering">Clustering</option>
                  <option value="recentResearch">Recent Research</option>
                  {customProjectionsState.length > 0 && (
                    <option value="custom">Custom Projection</option>
                  )}
                </select>
              </div>

              {selectedScope === "clustering" && (
                <div className="cluster-options">
                  <select
                    value={selectedClusterType || ""}
                    onChange={(e) => handleClusterTypeChange(e.target.value)}
                    className="cluster-type-select"
                    disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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

              {selectedScope === "custom" &&
                customProjectionsState.length > 0 && (
                  <div className="custom-projection-selection">
                    <select
                      value={selectedCustomProjection || ""}
                      onChange={(e) =>
                        setSelectedCustomProjection(e.target.value)
                      }
                      className="custom-projection-select"
                      disabled={loading}
                    >
                      <option value="">Select custom projection...</option>
                      {customProjectionsState.map((projection, index) => (
                        <option
                          key={index}
                          value={projection.name || projection}
                        >
                          {projection.name || projection}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              <button
                className="apply-algorithm-btn"
                onClick={handleApplyAlgorithm}
                disabled={
                  loading ||
                  !selectedScope ||
                  (selectedScope === "clustering" && !selectedClusterType) ||
                  (selectedClusterType === "definitions" &&
                    !selectedDefinitionLevel) ||
                  (selectedClusterType === "categories" && !selectedCategory) ||
                  (selectedScope === "custom" && !selectedCustomProjection)
                }
              >
                {loading ? "Applying..." : "Apply Algorithm"}
              </button>
            </div>
          </div>

          {showResults && appliedAlgorithmResult && (
            <div className="algorithm-modal-section results-section">
              <div className="results-header">
                <h4>
                  Algorithm Results:{" "}
                  {algorithm.name?.[language] ||
                    algorithm.name?.english ||
                    algorithm.name}
                </h4>
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
                          <div className="table-container">
                            <table>
                              <thead>
                                <tr>
                                  {getTableHeaders(
                                    appliedAlgorithmResult.algorithmId
                                  ).map((header, index) => (
                                    <th key={index}>{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {appliedAlgorithmResult.results
                                  .slice(0, 10)
                                  .map((result, index) => (
                                    <tr key={result.nodeId || index}>
                                      <td className="rank-cell">
                                        {result.rank}
                                      </td>
                                      <td className="node-cell">
                                        <div className="node-info">
                                          <span
                                            className="node-label"
                                            title={result.label}
                                          >
                                            {result.label.length > 50
                                              ? `${result.label.substring(
                                                  0,
                                                  50
                                                )}...`
                                              : result.label}
                                          </span>
                                          <span className="node-id">
                                            ID: {result.nodeId}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="type-cell">
                                        <span
                                          className="node-type-badge"
                                          style={{
                                            backgroundColor: getNodeTypeColor(
                                              result.nodeType
                                            ),
                                          }}
                                        >
                                          {result.nodeType}
                                        </span>
                                      </td>
                                      {renderTableCell(
                                        result,
                                        appliedAlgorithmResult.algorithmId
                                      )}
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
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
