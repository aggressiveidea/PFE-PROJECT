"use client";
import "./AlgorithmModal.css";
import { useState } from "react";

// Hard-coded algorithm results data
const MOCK_ALGORITHM_RESULTS = {
  pagerank: {
    success: true,
    algorithm: "pagerank",
    projectionName: "gds_subgraph_Encryption_1748875707441",
    results: [
      {
        label: "Encryption",
        nodeType: "Term",
        nodeId: "222",
        score: 0.18946428571428575,
        internalId: 2262,
      },
      {
        label: "Electronic Commerce",
        nodeType: "Category",
        nodeId: { low: 341, high: 0 },
        score: 0.18946428571428575,
        internalId: 1896,
      },
      {
        label: "Encoding",
        nodeType: "Term",
        nodeId: "352",
        score: 0.18946428571428575,
        internalId: 2392,
      },
      {
        label: "Encryption",
        nodeType: "Term",
        nodeId: "123",
        score: 0.17125,
        internalId: 2163,
      },
      {
        label: "Operation by which a clear message is transformed ...",
        nodeType: "Definition",
        nodeId: "222_0_p_0",
        score: 0.17125,
        internalId: 3039,
      },
      {
        label: "The use of unusual codes or signals allowing the c...",
        nodeType: "Definition",
        nodeId: "222_0_s_0",
        score: 0.17125,
        internalId: 3040,
      },
      {
        label: "Is a cryptographic transformation of data producin...",
        nodeType: "Definition",
        nodeId: "123_0_p_0",
        score: 0.16821428571428573,
        internalId: 2914,
      },
      {
        label: "Process by which a document can be made incomprehe...",
        nodeType: "Definition",
        nodeId: "123_0_s_0",
        score: 0.16821428571428573,
        internalId: 2915,
      },
      {
        label: "Cryptography",
        nodeType: "Term",
        nodeId: "230",
        score: 0.16821428571428573,
        internalId: 2270,
      },
      {
        label: "Cryptography",
        nodeType: "Term",
        nodeId: "232",
        score: 0.16821428571428573,
        internalId: 2272,
      },
    ],
    resultCount: 10,
  },

  betweenness: {
    success: true,
    algorithm: "betweenness",
    projectionName: "gds_subgraph_Encryption_1748875707441",
    results: [
      {
        label: "Encryption",
        nodeType: "Term",
        nodeId: "123",
        score: 4,
        internalId: 2163,
      },
      {
        label: "Encryption",
        nodeType: "Term",
        nodeId: "222",
        score: 2,
        internalId: 2262,
      },
      {
        label: "Is a cryptographic transformation of data producin...",
        nodeType: "Definition",
        nodeId: "123_0_p_0",
        score: 0,
        internalId: 2914,
      },
      {
        label: "Process by which a document can be made incomprehe...",
        nodeType: "Definition",
        nodeId: "123_0_s_0",
        score: 0,
        internalId: 2915,
      },
      {
        label: "Electronic Commerce",
        nodeType: "Category",
        nodeId: { low: 341, high: 0 },
        score: 0,
        internalId: 1896,
      },
      {
        label: "Cryptography",
        nodeType: "Term",
        nodeId: "230",
        score: 0,
        internalId: 2270,
      },
      {
        label: "Cryptography",
        nodeType: "Term",
        nodeId: "232",
        score: 0,
        internalId: 2272,
      },
      {
        label: "Encoding",
        nodeType: "Term",
        nodeId: "352",
        score: 0,
        internalId: 2392,
      },
      {
        label: "Operation by which a clear message is transformed ...",
        nodeType: "Definition",
        nodeId: "222_0_p_0",
        score: 0,
        internalId: 3039,
      },
      {
        label: "The use of unusual codes or signals allowing the c...",
        nodeType: "Definition",
        nodeId: "222_0_s_0",
        score: 0,
        internalId: 3040,
      },
    ],
    resultCount: 10,
  },

  louvain: {
    success: true,
    algorithm: "louvain",
    projectionName: "gds_subgraph_Encryption_1748875707441",
    results: [
      {
        label: "Cryptography",
        nodeType: "Term",
        nodeId: "230",
        communityId: 6,
        internalId: 2270,
      },
      {
        label: "Cryptography",
        nodeType: "Term",
        nodeId: "232",
        communityId: 6,
        internalId: 2272,
      },
      {
        label: "Encryption",
        nodeType: "Term",
        nodeId: "123",
        communityId: 6,
        internalId: 2163,
      },
      {
        label: "Is a cryptographic transformation of data producin...",
        nodeType: "Definition",
        nodeId: "123_0_p_0",
        communityId: 6,
        internalId: 2914,
      },
      {
        label: "Process by which a document can be made incomprehe...",
        nodeType: "Definition",
        nodeId: "123_0_s_0",
        communityId: 6,
        internalId: 2915,
      },
      {
        label: "Electronic Commerce",
        nodeType: "Category",
        nodeId: { low: 341, high: 0 },
        communityId: 9,
        internalId: 1896,
      },
      {
        label: "Encoding",
        nodeType: "Term",
        nodeId: "352",
        communityId: 9,
        internalId: 2392,
      },
      {
        label: "Encryption",
        nodeType: "Term",
        nodeId: "222",
        communityId: 9,
        internalId: 2262,
      },
      {
        label: "Operation by which a clear message is transformed ...",
        nodeType: "Definition",
        nodeId: "222_0_p_0",
        communityId: 9,
        internalId: 3039,
      },
      {
        label: "The use of unusual codes or signals allowing the c...",
        nodeType: "Definition",
        nodeId: "222_0_s_0",
        communityId: 9,
        internalId: 3040,
      },
    ],
  },

  // Additional mock data for other algorithms
  labelpropagation: {
    success: true,
    algorithm: "labelpropagation",
    projectionName: "gds_subgraph_sample_123456789",
    results: [
      {
        label: "Data Protection",
        nodeType: "Term",
        nodeId: "101",
        communityId: 1,
        internalId: 2001,
      },
      {
        label: "GDPR",
        nodeType: "Term",
        nodeId: "102",
        communityId: 1,
        internalId: 2002,
      },
      {
        label: "Privacy Policy",
        nodeType: "Definition",
        nodeId: "101_0_p_0",
        communityId: 1,
        internalId: 3001,
      },
      {
        label: "Cybersecurity",
        nodeType: "Term",
        nodeId: "201",
        communityId: 2,
        internalId: 2101,
      },
      {
        label: "Firewall",
        nodeType: "Term",
        nodeId: "202",
        communityId: 2,
        internalId: 2102,
      },
    ],
    resultCount: 5,
  },

  closeness: {
    success: true,
    algorithm: "closeness",
    projectionName: "gds_subgraph_sample_987654321",
    results: [
      {
        label: "Digital Rights",
        nodeType: "Term",
        nodeId: "301",
        score: 0.8542,
        internalId: 2301,
      },
      {
        label: "E-commerce Law",
        nodeType: "Category",
        nodeId: "302",
        score: 0.7891,
        internalId: 2302,
      },
      {
        label: "Online Contract",
        nodeType: "Term",
        nodeId: "303",
        score: 0.7234,
        internalId: 2303,
      },
      {
        label: "Digital Signature",
        nodeType: "Term",
        nodeId: "304",
        score: 0.6987,
        internalId: 2304,
      },
    ],
    resultCount: 4,
  },

  degree: {
    success: true,
    algorithm: "degree",
    projectionName: "gds_subgraph_sample_456789123",
    results: [
      {
        label: "Internet Law",
        nodeType: "Category",
        nodeId: "401",
        score: 15,
        internalId: 2401,
      },
      {
        label: "Intellectual Property",
        nodeType: "Category",
        nodeId: "402",
        score: 12,
        internalId: 2402,
      },
      {
        label: "Copyright",
        nodeType: "Term",
        nodeId: "403",
        score: 8,
        internalId: 2403,
      },
      {
        label: "Patent",
        nodeType: "Term",
        nodeId: "404",
        score: 6,
        internalId: 2404,
      },
    ],
    resultCount: 4,
  },

  wcc: {
    success: true,
    algorithm: "wcc",
    projectionName: "gds_subgraph_sample_789123456",
    results: [
      {
        label: "Computer Crime",
        nodeType: "Category",
        nodeId: "501",
        componentId: 1,
        internalId: 2501,
      },
      {
        label: "Hacking",
        nodeType: "Term",
        nodeId: "502",
        componentId: 1,
        internalId: 2502,
      },
      {
        label: "Malware",
        nodeType: "Term",
        nodeId: "503",
        componentId: 1,
        internalId: 2503,
      },
      {
        label: "Data Breach",
        nodeType: "Term",
        nodeId: "504",
        componentId: 2,
        internalId: 2504,
      },
    ],
    resultCount: 4,
  },

  trianglecount: {
    success: true,
    algorithm: "trianglecount",
    projectionName: "gds_subgraph_sample_321654987",
    results: [
      {
        label: "Network Security",
        nodeType: "Term",
        nodeId: "601",
        triangleCount: 5,
        internalId: 2601,
      },
      {
        label: "VPN",
        nodeType: "Term",
        nodeId: "602",
        triangleCount: 3,
        internalId: 2602,
      },
      {
        label: "SSL Certificate",
        nodeType: "Term",
        nodeId: "603",
        triangleCount: 2,
        internalId: 2603,
      },
      {
        label: "Authentication",
        nodeType: "Term",
        nodeId: "604",
        triangleCount: 1,
        internalId: 2604,
      },
    ],
    resultCount: 4,
  },

  clusteringcoefficient: {
    success: true,
    algorithm: "clusteringcoefficient",
    projectionName: "gds_subgraph_sample_654321987",
    results: [
      {
        label: "Software License",
        nodeType: "Term",
        nodeId: "701",
        coefficient: 0.9876,
        internalId: 2701,
      },
      {
        label: "Open Source",
        nodeType: "Term",
        nodeId: "702",
        coefficient: 0.8543,
        internalId: 2702,
      },
      {
        label: "Proprietary Software",
        nodeType: "Term",
        nodeId: "703",
        coefficient: 0.7321,
        internalId: 2703,
      },
      {
        label: "GPL License",
        nodeType: "Definition",
        nodeId: "701_0_p_0",
        coefficient: 0.6789,
        internalId: 3701,
      },
    ],
    resultCount: 4,
  },
};

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

  // Helper function to get node ID as string
  const getNodeId = (nodeId) => {
    if (typeof nodeId === "object" && nodeId.low !== undefined) {
      return nodeId.low.toString();
    }
    return nodeId?.toString() || "N/A";
  };

  // Helper function to format algorithm-specific results
  const formatAlgorithmResults = (results, algorithmId) => {
    if (!results || !Array.isArray(results)) return [];

    return results.map((result, index) => {
      const baseResult = {
        rank: index + 1,
        nodeId: getNodeId(result.nodeId),
        label: result.label || `Node ${getNodeId(result.nodeId)}`,
        nodeType: result.nodeType || "Unknown",
        internalId: result.internalId,
      };

      // Add algorithm-specific fields
      switch (algorithmId) {
        case "pagerank":
        case "betweenness":
        case "closeness":
        case "degree":
          return {
            ...baseResult,
            score:
              typeof result.score === "number"
                ? result.score.toFixed(6)
                : result.score || "N/A",
          };

        case "louvain":
        case "labelpropagation":
          return {
            ...baseResult,
            communityId: result.communityId || result.community || "N/A",
          };

        case "wcc":
          return {
            ...baseResult,
            componentId: result.componentId || result.component || "N/A",
          };

        case "trianglecount":
          return {
            ...baseResult,
            triangleCount: result.triangleCount || result.count || "N/A",
          };

        case "clusteringcoefficient":
          return {
            ...baseResult,
            coefficient:
              typeof result.coefficient === "number"
                ? result.coefficient.toFixed(6)
                : result.coefficient || "N/A",
          };

        default:
          return {
            ...baseResult,
            value: result.value || result.score || "N/A",
          };
      }
    });
  };

  // Helper function to get table headers based on algorithm
  const getTableHeaders = (algorithmId) => {
    const baseHeaders = ["Rank", "Node", "Type"];

    switch (algorithmId) {
      case "pagerank":
        return [...baseHeaders, "PageRank Score"];
      case "betweenness":
        return [...baseHeaders, "Betweenness Score"];
      case "closeness":
        return [...baseHeaders, "Closeness Score"];
      case "degree":
        return [...baseHeaders, "Degree Score"];
      case "louvain":
        return [...baseHeaders, "Community ID"];
      case "labelpropagation":
        return [...baseHeaders, "Label"];
      case "wcc":
        return [...baseHeaders, "Component ID"];
      case "trianglecount":
        return [...baseHeaders, "Triangle Count"];
      case "clusteringcoefficient":
        return [...baseHeaders, "Clustering Coefficient"];
      default:
        return [...baseHeaders, "Value"];
    }
  };

  // Helper function to render table cells based on algorithm
  const renderTableCell = (result, algorithmId) => {
    switch (algorithmId) {
      case "pagerank":
      case "betweenness":
      case "closeness":
      case "degree":
        return <td className="score-cell">{result.score}</td>;
      case "louvain":
      case "labelpropagation":
        return (
          <td className="community-cell">Community {result.communityId}</td>
        );
      case "wcc":
        return (
          <td className="component-cell">Component {result.componentId}</td>
        );
      case "trianglecount":
        return <td className="count-cell">{result.triangleCount}</td>;
      case "clusteringcoefficient":
        return <td className="coefficient-cell">{result.coefficient}</td>;
      default:
        return <td className="value-cell">{result.value}</td>;
    }
  };

  // Helper function to get node type color
  const getNodeTypeColor = (nodeType) => {
    const colors = {
      Term: "#8B5CF6",
      Definition: "#06B6D4",
      Category: "#10B981",
      Unknown: "#6B7280",
    };
    return colors[nodeType] || colors["Unknown"];
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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get mock results based on algorithm
      const mockResults = MOCK_ALGORITHM_RESULTS[algorithm.id];

      if (!mockResults) {
        throw new Error(
          `No mock data available for algorithm: ${algorithm.id}`
        );
      }

      // Format results for display
      const formattedResults = formatAlgorithmResults(
        mockResults.results || [],
        algorithm.id
      );

      const finalResults = {
        algorithm: algorithm.name.english,
        algorithmId: algorithm.id,
        scope: selectedScope,
        projectionName: mockResults.projectionName,
        nodesProcessed:
          mockResults.resultCount || mockResults.results?.length || 0,
        edgesProcessed: Math.floor(Math.random() * 50) + 10, // Random edge count for demo
        executionTime: `${(Math.random() * 2 + 0.5).toFixed(2)}s`, // Random execution time
        results: formattedResults,
        rawResults: mockResults.results || [],
        algorithmSpecific: {
          projectionType: selectedScope,
          ...(selectedCategory && { category: selectedCategory }),
          ...(selectedDefinitionLevel && {
            definitionLevel: selectedDefinitionLevel,
          }),
          ...(selectedClusterType && { clusterType: selectedClusterType }),
        },
        loading: false,
      };

      setAppliedAlgorithmResult(finalResults);

      // Add to search history (mock)
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
        algorithm: algorithm.name.english,
        algorithmId: algorithm.id,
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

  return (
    <div className="algorithm-modal-overlay">
      <div className="algorithm-modal">
        <div className="algorithm-modal-header">
          <h2>{algorithm.name.english}</h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
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
