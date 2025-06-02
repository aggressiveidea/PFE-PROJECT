"use client";
import "./AlgorithmModal.css";
import { useState, useEffect } from "react";

// Hard-coded algorithm results data from actual Neo4j queries
const MOCK_ALGORITHM_RESULTS = {
  // Full Graph Results
  fullGraph: {
    pagerank: {
      success: true,
      algorithm: "pagerank",
      projectionName: "fullGraph",
      results: [
        {
          label: "Commerce électronique",
          nodeType: "Category",
          nodeId: "341",
          score: 90.19076941311728,
          internalId: 1896,
        },
        {
          label: "Electronic Commerce",
          nodeType: "Category",
          nodeId: "342",
          score: 90.10184319004303,
          internalId: 1897,
        },
        {
          label: "التجارة الإلكترونية",
          nodeType: "Category",
          nodeId: "343",
          score: 89.62724911102532,
          internalId: 1898,
        },
        {
          label: "Criminalité informatique",
          nodeType: "Category",
          nodeId: "344",
          score: 49.304560957843975,
          internalId: 1899,
        },
        {
          label: "Computer Crime",
          nodeType: "Category",
          nodeId: "345",
          score: 48.43145140275401,
          internalId: 1900,
        },
        {
          label: "Networks",
          nodeType: "Category",
          nodeId: "346",
          score: 28.18375528727949,
          internalId: 1901,
        },
        {
          label: "Réseaux",
          nodeType: "Category",
          nodeId: "347",
          score: 27.978670028398927,
          internalId: 1902,
        },
        {
          label: "الشبكات",
          nodeType: "Category",
          nodeId: "348",
          score: 24.842604717746898,
          internalId: 1903,
        },
        {
          label: "Personal Data",
          nodeType: "Category",
          nodeId: "349",
          score: 18.48151659304295,
          internalId: 1904,
        },
        {
          label: "Données personnelles",
          nodeType: "Category",
          nodeId: "350",
          score: 18.224506079874068,
          internalId: 1905,
        },
      ],
      resultCount: 10,
      nodeCount: 5679,
      relationshipCount: 12756,
    },

    louvain: {
      success: true,
      algorithm: "louvain",
      projectionName: "fullGraph",
      results: [
        {
          label: "APPZ",
          nodeType: "Term",
          nodeId: "1001",
          communityId: 219,
          internalId: 2001,
        },
        {
          label: "Abus de dispositifs",
          nodeType: "Term",
          nodeId: "1002",
          communityId: 219,
          internalId: 2002,
        },
        {
          label: "Accès illicite à des systèmes d'information",
          nodeType: "Term",
          nodeId: "1003",
          communityId: 219,
          internalId: 2003,
        },
        {
          label: "Accès illégal",
          nodeType: "Term",
          nodeId: "1004",
          communityId: 219,
          internalId: 2004,
        },
        {
          label: "Accès non autorisé",
          nodeType: "Term",
          nodeId: "1005",
          communityId: 219,
          internalId: 2005,
        },
        {
          label: "Accès ou maintien frauduleux dans un système informatique",
          nodeType: "Term",
          nodeId: "1006",
          communityId: 219,
          internalId: 2006,
        },
        {
          label: "Action du virus",
          nodeType: "Term",
          nodeId: "1007",
          communityId: 219,
          internalId: 2007,
        },
        {
          label: "Antispyware",
          nodeType: "Term",
          nodeId: "1008",
          communityId: 219,
          internalId: 2008,
        },
        {
          label: "Antitroyen",
          nodeType: "Term",
          nodeId: "1009",
          communityId: 219,
          internalId: 2009,
        },
        {
          label: "Antivirus",
          nodeType: "Term",
          nodeId: "1010",
          communityId: 219,
          internalId: 2010,
        },
      ],
      resultCount: 10,
      nodeCount: 5679,
      relationshipCount: 12756,
    },

    betweenness: {
      success: true,
      algorithm: "betweenness",
      projectionName: "fullGraph",
      results: [
        {
          label: "Virus",
          nodeType: "Term",
          nodeId: "2001",
          score: 327.0,
          internalId: 3001,
        },
        {
          label: "Malware",
          nodeType: "Term",
          nodeId: "2002",
          score: 260.1538461538462,
          internalId: 3002,
        },
        {
          label: "وصول غير قانوني",
          nodeType: "Term",
          nodeId: "2003",
          score: 250.0,
          internalId: 3003,
        },
        {
          label: "موقع",
          nodeType: "Term",
          nodeId: "2004",
          score: 198.0,
          internalId: 3004,
        },
        {
          label: "Données",
          nodeType: "Term",
          nodeId: "2005",
          score: 164.2,
          internalId: 3005,
        },
        {
          label: "موقع",
          nodeType: "Term",
          nodeId: "2006",
          score: 147.5,
          internalId: 3006,
        },
        {
          label: "Cryptolope",
          nodeType: "Term",
          nodeId: "2007",
          score: 142.95384615384617,
          internalId: 3007,
        },
        {
          label: "كريبتولوب",
          nodeType: "Term",
          nodeId: "2008",
          score: 105.11904761904763,
          internalId: 3008,
        },
        {
          label: "قرصنة",
          nodeType: "Term",
          nodeId: "2009",
          score: 105.0,
          internalId: 3009,
        },
        {
          label: "Données à caractère personnel",
          nodeType: "Term",
          nodeId: "2010",
          score: 99.0,
          internalId: 3010,
        },
      ],
      resultCount: 10,
      nodeCount: 5679,
      relationshipCount: 12756,
    },

    nodeSimilarity: {
      success: true,
      algorithm: "nodeSimilarity",
      projectionName: "fullGraph",
      results: [
        {
          label: "Décryptage → Décryption",
          nodeType: "Similarity",
          nodeId: "sim_001",
          score: 1.0,
          internalId: 4001,
        },
        {
          label: "Données nominatives → Données personnelles",
          nodeType: "Similarity",
          nodeId: "sim_002",
          score: 1.0,
          internalId: 4002,
        },
        {
          label: "Acheminement → Routing",
          nodeType: "Similarity",
          nodeId: "sim_003",
          score: 1.0,
          internalId: 4003,
        },
        {
          label: "Cyberresistant → Cybermilitant",
          nodeType: "Similarity",
          nodeId: "sim_004",
          score: 1.0,
          internalId: 4004,
        },
        {
          label: "Décryption → Décryptage",
          nodeType: "Similarity",
          nodeId: "sim_005",
          score: 1.0,
          internalId: 4005,
        },
      ],
      resultCount: 5,
      nodeCount: 5679,
      relationshipCount: 12756,
    },
  },

  // Categories Graph Results
  categoriesGraph: {
    pagerank: {
      success: true,
      algorithm: "pagerank",
      projectionName: "categoriesGraph",
      results: [
        {
          label: "Contrats informatiques",
          nodeType: "Category",
          nodeId: "cat_001",
          score: 0.15000000000000002,
          internalId: 5001,
        },
        {
          label: "Criminalité informatique",
          nodeType: "Category",
          nodeId: "cat_002",
          score: 0.15000000000000002,
          internalId: 5002,
        },
        {
          label: "Données personnelles",
          nodeType: "Category",
          nodeId: "cat_003",
          score: 0.15000000000000002,
          internalId: 5003,
        },
        {
          label: "Organisations",
          nodeType: "Category",
          nodeId: "cat_004",
          score: 0.15000000000000002,
          internalId: 5004,
        },
        {
          label: "Propriété intellectuelle",
          nodeType: "Category",
          nodeId: "cat_005",
          score: 0.15000000000000002,
          internalId: 5005,
        },
        {
          label: "Réseaux",
          nodeType: "Category",
          nodeId: "cat_006",
          score: 0.15000000000000002,
          internalId: 5006,
        },
        {
          label: "Divers",
          nodeType: "Category",
          nodeId: "cat_007",
          score: 0.15000000000000002,
          internalId: 5007,
        },
        {
          label: "Electronic Commerce",
          nodeType: "Category",
          nodeId: "cat_008",
          score: 0.15000000000000002,
          internalId: 5008,
        },
        {
          label: "Computer Contracts",
          nodeType: "Category",
          nodeId: "cat_009",
          score: 0.15000000000000002,
          internalId: 5009,
        },
        {
          label: "Commerce électronique",
          nodeType: "Category",
          nodeId: "cat_010",
          score: 0.15000000000000002,
          internalId: 5010,
        },
      ],
      resultCount: 10,
      nodeCount: 24,
      relationshipCount: 0,
    },

    louvain: {
      success: true,
      algorithm: "louvain",
      projectionName: "categoriesGraph",
      results: [
        {
          label: "Commerce électronique",
          nodeType: "Category",
          nodeId: "cat_001",
          communityId: 0,
          internalId: 5001,
        },
        {
          label: "Contrats informatiques",
          nodeType: "Category",
          nodeId: "cat_002",
          communityId: 1,
          internalId: 5002,
        },
        {
          label: "Criminalité informatique",
          nodeType: "Category",
          nodeId: "cat_003",
          communityId: 2,
          internalId: 5003,
        },
        {
          label: "Données personnelles",
          nodeType: "Category",
          nodeId: "cat_004",
          communityId: 3,
          internalId: 5004,
        },
        {
          label: "Organisations",
          nodeType: "Category",
          nodeId: "cat_005",
          communityId: 4,
          internalId: 5005,
        },
        {
          label: "Propriété intellectuelle",
          nodeType: "Category",
          nodeId: "cat_006",
          communityId: 5,
          internalId: 5006,
        },
        {
          label: "Réseaux",
          nodeType: "Category",
          nodeId: "cat_007",
          communityId: 6,
          internalId: 5007,
        },
        {
          label: "Divers",
          nodeType: "Category",
          nodeId: "cat_008",
          communityId: 7,
          internalId: 5008,
        },
        {
          label: "Electronic Commerce",
          nodeType: "Category",
          nodeId: "cat_009",
          communityId: 8,
          internalId: 5009,
        },
        {
          label: "Computer Contracts",
          nodeType: "Category",
          nodeId: "cat_010",
          communityId: 9,
          internalId: 5010,
        },
      ],
      resultCount: 10,
      nodeCount: 24,
      relationshipCount: 0,
    },

    betweenness: {
      success: true,
      algorithm: "betweenness",
      projectionName: "categoriesGraph",
      results: [
        {
          label: "Contrats informatiques",
          nodeType: "Category",
          nodeId: "cat_001",
          score: 0.0,
          internalId: 5001,
        },
        {
          label: "Criminalité informatique",
          nodeType: "Category",
          nodeId: "cat_002",
          score: 0.0,
          internalId: 5002,
        },
        {
          label: "Données personnelles",
          nodeType: "Category",
          nodeId: "cat_003",
          score: 0.0,
          internalId: 5003,
        },
        {
          label: "Organisations",
          nodeType: "Category",
          nodeId: "cat_004",
          score: 0.0,
          internalId: 5004,
        },
        {
          label: "Propriété intellectuelle",
          nodeType: "Category",
          nodeId: "cat_005",
          score: 0.0,
          internalId: 5005,
        },
        {
          label: "Réseaux",
          nodeType: "Category",
          nodeId: "cat_006",
          score: 0.0,
          internalId: 5006,
        },
        {
          label: "Divers",
          nodeType: "Category",
          nodeId: "cat_007",
          score: 0.0,
          internalId: 5007,
        },
        {
          label: "Electronic Commerce",
          nodeType: "Category",
          nodeId: "cat_008",
          score: 0.0,
          internalId: 5008,
        },
        {
          label: "Computer Contracts",
          nodeType: "Category",
          nodeId: "cat_009",
          score: 0.0,
          internalId: 5009,
        },
        {
          label: "Commerce électronique",
          nodeType: "Category",
          nodeId: "cat_010",
          score: 0.0,
          internalId: 5010,
        },
      ],
      resultCount: 10,
      nodeCount: 24,
      relationshipCount: 0,
    },
  },

  // Terms Graph Results
  termsGraph: {
    pagerank: {
      success: true,
      algorithm: "pagerank",
      projectionName: "termsGraph",
      results: [
        {
          label: "Flooding",
          nodeType: "Term",
          nodeId: "term_001",
          score: 4.290333571833674,
          internalId: 6001,
        },
        {
          label: "Mailbombing",
          nodeType: "Term",
          nodeId: "term_002",
          score: 4.28288227312458,
          internalId: 6002,
        },
        {
          label: "Precomputation attack",
          nodeType: "Term",
          nodeId: "term_003",
          score: 3.6871567854424105,
          internalId: 6003,
        },
        {
          label: "سلطة التصديق",
          nodeType: "Term",
          nodeId: "term_004",
          score: 3.034305589579139,
          internalId: 6004,
        },
        {
          label: "Signatory",
          nodeType: "Term",
          nodeId: "term_005",
          score: 2.9893416412042,
          internalId: 6005,
        },
        {
          label: "Signature",
          nodeType: "Term",
          nodeId: "term_006",
          score: 2.9893416412042,
          internalId: 6006,
        },
        {
          label: "Attack",
          nodeType: "Term",
          nodeId: "term_007",
          score: 2.8782058100780734,
          internalId: 6007,
        },
        {
          label: "مخترق",
          nodeType: "Term",
          nodeId: "term_008",
          score: 2.8073174477428395,
          internalId: 6008,
        },
        {
          label: "التجارة بين الشركات",
          nodeType: "Term",
          nodeId: "term_009",
          score: 2.727844573949351,
          internalId: 6009,
        },
        {
          label: "Accès illégal",
          nodeType: "Term",
          nodeId: "term_010",
          score: 2.727844573949351,
          internalId: 6010,
        },
      ],
      resultCount: 10,
      nodeCount: 2559,
      relationshipCount: 3131,
    },
  },
};

const AlgorithmModal = ({
  isOpen,
  onClose,
  algorithm,
  customProjections = [],
}) => {
  const [selectedScope, setSelectedScope] = useState("");
  const [selectedClusterType, setSelectedClusterType] = useState("");
  const [selectedDefinitionLevel, setSelectedDefinitionLevel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [appliedAlgorithmResult, setAppliedAlgorithmResult] = useState(null);
  const [customProjectionsState, setCustomProjections] = useState([]);
  const [selectedCustomProjection, setSelectedCustomProjection] = useState("");

  useEffect(() => {
    // Fetch custom projections from API
    const fetchCustomProjections = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/gds/projections"
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

    fetchCustomProjections();
  }, []);

  // Update custom projections when prop changes
  useEffect(() => {
    setCustomProjections(customProjections);
  }, [customProjections]);

  const fetchCustomAlgorithmResults = async (projectionName, algorithmId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/gds/projections/${projectionName}/${algorithmId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${algorithmId} results:`, error);
      throw error;
    }
  };

  const handleScopeChange = (scope) => {
    setSelectedScope(scope);
    setSelectedClusterType("");
    setSelectedDefinitionLevel("");
    setSelectedCategory("");
    setSelectedCustomProjection("");
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
      Similarity: "#A855F7",
    };
    return colors[nodeType] || colors["Unknown"];
  };

  // Update the handleApplyAlgorithm function to handle both hard-coded and custom results
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

      let results;
      let projectionName;

      // Handle custom projections
      if (selectedScope === "custom" && selectedCustomProjection) {
        projectionName = selectedCustomProjection;

        // Fetch results from API
        results = await fetchCustomAlgorithmResults(
          projectionName,
          algorithm.id
        );
      } else {
        // Use hard-coded results
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Determine which hard-coded dataset to use
        let datasetKey;
        if (selectedScope === "allGraph") {
          datasetKey = "fullGraph";
          projectionName = "fullGraph";
        } else if (selectedScope === "clustering") {
          if (selectedClusterType === "categories") {
            datasetKey = "categoriesGraph";
            projectionName = "categoriesGraph";
          } else if (selectedClusterType === "terms") {
            datasetKey = "termsGraph";
            projectionName = "termsGraph";
          } else {
            datasetKey = "fullGraph";
            projectionName = "fullGraph";
          }
        } else {
          datasetKey = "fullGraph";
          projectionName = "fullGraph";
        }

        // Get mock results based on algorithm and dataset
        const mockResults = MOCK_ALGORITHM_RESULTS[datasetKey]?.[algorithm.id];

        if (!mockResults) {
          throw new Error(
            `No data available for algorithm: ${algorithm.id} in dataset: ${datasetKey}`
          );
        }

        results = mockResults;
      }

      // Format results for display
      const formattedResults = formatAlgorithmResults(
        results.results || [],
        algorithm.id
      );

      const finalResults = {
        algorithm: algorithm.name.english,
        algorithmId: algorithm.id,
        scope: selectedScope,
        projectionName: projectionName,
        nodesProcessed: results.resultCount || results.results?.length || 0,
        edgesProcessed:
          results.relationshipCount || Math.floor(Math.random() * 50) + 10,
        executionTime:
          results.executionTime || `${(Math.random() * 2 + 0.5).toFixed(2)}s`,
        results: formattedResults,
        rawResults: results.results || [],
        algorithmSpecific: {
          projectionType: selectedScope,
          nodeCount: results.nodeCount,
          relationshipCount: results.relationshipCount,
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
                  <option value="custom">Custom Projection</option>
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

              {selectedScope === "custom" && (
                <div className="custom-projection-selection">
                  <label htmlFor="custom-projection-select">
                    Select Custom Projection:
                  </label>
                  <select
                    id="custom-projection-select"
                    value={selectedCustomProjection}
                    onChange={(e) =>
                      setSelectedCustomProjection(e.target.value)
                    }
                    className="custom-projection-select"
                  >
                    <option value="">Select projection...</option>
                    {customProjectionsState.map((projection, index) => (
                      <option key={index} value={projection}>
                        {projection}
                      </option>
                    ))}
                  </select>
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
                  (selectedClusterType === "categories" && !selectedCategory) ||
                  (selectedScope === "custom" && !selectedCustomProjection)
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
