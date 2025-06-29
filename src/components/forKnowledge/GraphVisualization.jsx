import { useState, useRef, useEffect, useCallback } from "react";
import { getAllterms, searchNodeByName } from "../../services/Api";
import "./GraphVisualization.css";
import Graph from "graphology";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { circular } from "graphology-layout";
import noverlap from "graphology-layout-noverlap";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Maximize,
  Minimize,
  Info,
  Download,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import GraphLegend from "./GraphExport";
import html2canvas from "html2canvas";

const GraphVisualization = ({ language = "english" }) => {
  const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [highlightedRelationships, setHighlightedRelationships] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectionName, setProjectionName] = useState(null);
  const [filteredGraphData, setFilteredGraphData] = useState({
    nodes: [],
    relationships: [],
  });
  const [isLayoutRunning, setIsLayoutRunning] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [connectedNodes, setConnectedNodes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [nodeTypeFilters, setNodeTypeFilters] = useState({
    term: true,
    definition: true,
    category: true,
  });
  const [categoryFilters, setCategoryFilters] = useState({});
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [showNodeTypeFilters, setShowNodeTypeFilters] = useState(false);
  const [clusterByCategory, setClusterByCategory] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [originalGraphData, setOriginalGraphData] = useState({
    nodes: [],
    relationships: [],
  });

  const containerRef = useRef(null);
  const sigmaRef = useRef(null);
  const graphRef = useRef(null);
  const lastClickedNodeRef = useRef(null);
  const lastClickTimeRef = useRef(0);

  const categories = {
    english: [
      "Computer Crime",
      "Personal Data",
      "Electronic Commerce",
      "Organization",
      "Networks",
      "Intellectual Property",
      "Miscellaneous",
      "Computer Contracts",
    ],
    french: [
      "Criminalité informatique",
      "Données personnelles",
      "Commerce électronique",
      "Organisation",
      "Réseaux",
      "Propriété intellectuelle",
      "Divers",
      "Contrats informatique",
    ],
    arabic: [
      "جرائم الكمبيوتر",
      "البيانات الشخصية",
      "التجارة الإلكترونية",
      "التنظيم",
      "الشبكات",
      "الملكية الفكرية",
      "متنوع",
      "عقود معلوماتية",
    ],
  };

  const nodeColors = {
    term: {
      default: "#8B5CF6",
      selected: "#FF5722",
      grayed: "#D1C4E9",
    },
    definition: {
      primary: "#3B82F6",
      secondary: "#EC4899",
      selected: "#FF5722",
      grayed: "#BBDEFB",
    },
    category: {
      "Computer Crime": "#EF4444",
      "Personal Data": "#EC4899",
      "Electronic Commerce": "#10B981",
      Organization: "#F59E0B",
      Networks: "#3B82F6",
      "Intellectual Property": "#8B5CF6",
      Miscellaneous: "#6366F1",
      "Computer Science": "#06B6D4",
      "Criminalité informatique": "#EF4444",
      "Données personnelles": "#EC4899",
      "Commerce électronique": "#10B981",
      Organisation: "#F59E0B",
      Réseaux: "#3B82F6",
      "Propriété intellectuelle": "#8B5CF6",
      Divers: "#6366F1",
      Informatique: "#06B6D4",
      "جرائم الكمبيوتر": "#EF4444",
      "البيانات الشخصية": "#EC4899",
      "التجارة الإلكترونية": "#10B981",
      التنظيم: "#F59E0B",
      الشبكات: "#3B82F6",
      "الملكية الفكرية": "#8B5CF6",
      متنوع: "#6366F1",
      "علوم الكمبيوتر": "#06B6D4",
      grayed: "#E5E5E5",
    },
  };

  const categoryEmojis = {
    "Computer Crime": "🔒",
    "Personal Data": "👤",
    "Electronic Commerce": "🛒",
    Organization: "🏢",
    Networks: "🌐",
    "Intellectual Property": "©️",
    Miscellaneous: "📦",
    "Computer Science": "💻",
    "Criminalité informatique": "🔒",
    "Données personnelles": "👤",
    "Commerce électronique": "🛒",
    Organisation: "🏢",
    Réseaux: "🌐",
    "Propriété intellectuelle": "©️",
    Divers: "📦",
    Informatique: "💻",
    "جرائم الكمبيوتر": "🔒",
    "البيانات الشخصية": "👤",
    "التجارة الإلكترونية": "🛒",
    التنظيم: "🏢",
    الشبكات: "🌐",
    "الملكية الفكرية": "©️",
    متنوع: "📦",
    "علوم الكمبيوتر": "💻",
  };

  const getLanguageCode = useCallback(() => {
    switch (language) {
      case "english":
        return "en";
      case "french":
        return "fr";
      case "arabic":
        return "ar";
      default:
        return "en";
    }
  }, [language]);

  const toggleLegend = useCallback(() => {
    setShowLegend((prev) => !prev);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

   
  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode || !graphRef.current || !sigmaRef.current) return;

    try {
      const nodeId = selectedNode.id;

       
      if (graphRef.current.hasNode(nodeId)) {
        graphRef.current.dropNode(nodeId);
      }

       
      const updatedNodes = filteredGraphData.nodes.filter(
        (node) => node.id !== nodeId
      );
      const updatedRelationships = filteredGraphData.relationships.filter(
        (rel) => rel.source !== nodeId && rel.target !== nodeId
      );

      setFilteredGraphData({
        nodes: updatedNodes,
        relationships: updatedRelationships,
      });

       
      const updatedOriginalNodes = originalGraphData.nodes.filter(
        (node) => node.id !== nodeId
      );
      const updatedOriginalRelationships =
        originalGraphData.relationships.filter(
          (rel) => rel.source !== nodeId && rel.target !== nodeId
        );

      setOriginalGraphData({
        nodes: updatedOriginalNodes,
        relationships: updatedOriginalRelationships,
      });

       
      setSelectedNode(null);
      setConnectedNodes([]);
      setHighlightedRelationships([]);
      lastClickedNodeRef.current = null;

       
      sigmaRef.current.refresh();

      console.log(`Node ${nodeId} deleted successfully`);
    } catch (err) {
      console.error("Error deleting node:", err);
      alert("Failed to delete node. Please try again.");
    }
  }, [selectedNode, filteredGraphData, originalGraphData]);

  useEffect(() => {
    const currentCategories = categories[language] || categories.english;
    const initialCategoryFilters = {};
    currentCategories.forEach((category) => {
      initialCategoryFilters[category] = true;
    });
    setCategoryFilters(initialCategoryFilters);
  }, [language]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setSelectedNode(null);
        setHoveredNode(null);
        setHighlightedRelationships([]);
        lastClickedNodeRef.current = null;

        const languageCode = getLanguageCode();
        const termsData = await getAllterms(languageCode);

        if (!termsData || termsData.length === 0) {
          throw new Error("No data received from API");
        }

        const graphStructure = transformDataToGraph(termsData, languageCode);
        setGraphData(graphStructure);
        setOriginalGraphData(graphStructure);
        setFilteredGraphData(graphStructure);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching graph data:", err);
        setError(
          "Failed to load knowledge graph data. Please try again later."
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, [language, getLanguageCode]);

  const transformDataToGraph = (termsData, languageCode) => {
    const nodes = [];
    const relationships = [];
    const categoryNodes = new Map();
    const nodeIds = new Set();
    const categoryList = categories[language] || categories.english;

    categoryList.forEach((category, index) => {
      const categoryId = `cat-${index}`;
      if (nodeIds.has(categoryId)) return;

      const emoji = categoryEmojis[category] || "";
       
      const categoryNode = {
        id: categoryId,
        label: category,
        originalLabel: category,
        nodeType: "category",
        language: languageCode,
        size: 25,
        color: nodeColors.category[category] || "#6366F1",
        category: category,
        emoji: emoji,
      };

      nodes.push(categoryNode);
      categoryNodes.set(category, categoryNode.id);
      nodeIds.add(categoryId);
    });

    termsData.forEach((term) => {
      if (!term || !term.id) return;

      const termId = `term-${term.id}`;
      if (nodeIds.has(termId)) return;

      const termNode = {
        id: termId,
        label: term.name || "Unnamed Term",
        nodeType: "term",
        language: languageCode,
        size: 15,
        color: nodeColors.term.default,
        categories: [],
      };

      nodes.push(termNode);
      nodeIds.add(termId);

      if (term.definitions && term.definitions.length > 0) {
        term.definitions.forEach((def, defIndex) => {
          if (!def || def.language !== languageCode) return;

          const defId = `def-${term.id}-${defIndex}`;
          if (nodeIds.has(defId)) return;

          const defNode = {
            id: defId,
            label:
              def.text && def.text.length > 40
                ? def.text.substring(0, 40) + "..."
                : def.text || "No definition",
            fullText: def.text || "",
            nodeType: "definition",
            defType: def.type || "unknown",
            references: def.references || "",
            language: def.language,
            size: 10,
            color:
              def.type === "primary"
                ? nodeColors.definition.primary
                : nodeColors.definition.secondary,
            categories: [],
          };

          nodes.push(defNode);
          nodeIds.add(defId);

          relationships.push({
            id: `rel-term-def-${term.id}-${defIndex}`,
            source: termNode.id,
            target: defNode.id,
            relType: "HAS_DEFINITION",
            label: "HAS_DEFINITION",
            color: "#4C8EDA",
            size: 1.5,
            weight: 0.2,
          });

          if (def.categories && def.categories.length > 0) {
            def.categories.forEach((category) => {
              if (!category) return;

              const matchedCategory = findClosestCategory(
                category,
                categoryList
              );

              if (matchedCategory && categoryNodes.has(matchedCategory)) {
                defNode.categories.push(matchedCategory);
                if (!termNode.categories.includes(matchedCategory)) {
                  termNode.categories.push(matchedCategory);
                }

                relationships.push({
                  id: `rel-def-cat-${term.id}-${defIndex}-${categoryNodes.get(
                    matchedCategory
                  )}`,
                  source: defNode.id,
                  target: categoryNodes.get(matchedCategory),
                  relType: "BELONGS_TO",
                  label: "BELONGS_TO",
                  color: "#8DCC93",
                  size: 1,
                });

                relationships.push({
                  id: `rel-term-cat-${term.id}-${categoryNodes.get(
                    matchedCategory
                  )}`,
                  source: termNode.id,
                  target: categoryNodes.get(matchedCategory),
                  relType: "BELONGS_TO",
                  label: "BELONGS_TO",
                  color: "#8DCC93",
                  size: 0.8,
                });
              }
            });
          }

          if (def.relatedTerms && def.relatedTerms.length > 0) {
            def.relatedTerms.forEach((relatedTerm, rtIndex) => {
              if (
                !relatedTerm ||
                !relatedTerm.name ||
                !relatedTerm.id ||
                relatedTerm.id === "null"
              )
                return;

              const relatedTermId = `term-${relatedTerm.id}`;
              if (
                nodeIds.has(relatedTermId) ||
                termsData.some((t) => t.id === relatedTerm.id)
              ) {
                relationships.push({
                  id: `rel-term-term-${term.id}-${relatedTerm.id}-${rtIndex}`,
                  source: termNode.id,
                  target: relatedTermId,
                  relType: "RELATED_TO",
                  label: "RELATED_TO",
                  color: "#FFC454",
                  size: 1.2,
                });
              }
            });
          }
        });
      }
    });

    return { nodes, relationships };
  };

  const findClosestCategory = (category, categoryList) => {
    if (!category) return categoryList[0];

    if (categoryList.includes(category)) {
      return category;
    }

    const lowerCategory = category.toLowerCase();
    for (const cat of categoryList) {
      if (cat.toLowerCase() === lowerCategory) {
        return cat;
      }
    }

    for (const cat of categoryList) {
      if (
        cat.toLowerCase().includes(lowerCategory) ||
        lowerCategory.includes(cat.toLowerCase())
      ) {
        return cat;
      }
    }

    return categoryList[0];
  };

  const applyFilters = useCallback(() => {
    if (!graphRef.current) return;

    try {
      graphRef.current.forEachNode((nodeId) => {
        const nodeType = graphRef.current.getNodeAttribute(nodeId, "nodeType");
        const nodeCategories =
          graphRef.current.getNodeAttribute(nodeId, "categories") || [];
        const nodeCategory = graphRef.current.getNodeAttribute(
          nodeId,
          "category"
        );

        const isNodeTypeVisible = nodeTypeFilters[nodeType] || false;

        let isCategoryVisible = true;
        if (nodeType === "term" || nodeType === "definition") {
          if (nodeCategories.length > 0) {
            isCategoryVisible = nodeCategories.some(
              (cat) => categoryFilters[cat]
            );
          }
        } else if (nodeType === "category") {
          isCategoryVisible = categoryFilters[nodeCategory] || false;
        }

        const isVisible = isNodeTypeVisible && isCategoryVisible;
        graphRef.current.setNodeAttribute(nodeId, "hidden", !isVisible);
      });

      graphRef.current.forEachEdge((edgeId, attributes, source, target) => {
        const isSourceVisible = !graphRef.current.getNodeAttribute(
          source,
          "hidden"
        );
        const isTargetVisible = !graphRef.current.getNodeAttribute(
          target,
          "hidden"
        );
        graphRef.current.setEdgeAttribute(
          edgeId,
          "hidden",
          !(isSourceVisible && isTargetVisible)
        );
      });

      if (clusterByCategory) {
        applyClustering();
      }

      if (sigmaRef.current) {
        sigmaRef.current.refresh();
      }
    } catch (err) {
      console.error("Error applying filters:", err);
    }
  }, [nodeTypeFilters, categoryFilters, clusterByCategory]);

  const cleanupTooltips = useCallback(() => {
    try {
      if (containerRef.current) {
        const tooltips =
          containerRef.current.querySelectorAll(".sigma-tooltip");
        tooltips.forEach((tooltip) => {
          try {
            if (tooltip && tooltip.parentNode) {
              tooltip.parentNode.removeChild(tooltip);
            }
          } catch (err) {
            console.error("Error removing individual tooltip:", err);
          }
        });

        if (graphRef.current) {
          graphRef.current.forEachNode((nodeId) => {
            try {
              const tooltip = graphRef.current.getNodeAttribute(
                nodeId,
                "tooltip"
              );
              if (tooltip) {
                if (tooltip.parentNode) {
                  tooltip.parentNode.removeChild(tooltip);
                }
                graphRef.current.removeNodeAttribute(nodeId, "tooltip");
              }
            } catch (err) {
              console.error(
                `Error cleaning up tooltip for node ${nodeId}:`,
                err
              );
            }
          });
        }
      }
    } catch (err) {
      console.error("Error in cleanupTooltips:", err);
    }
  }, []);

  const applyClustering = useCallback(() => {
    if (!graphRef.current || !sigmaRef.current) return;

    try {
      circular.assign(graphRef.current);

      const visibleCategories = [];
      graphRef.current.forEachNode((nodeId) => {
        const nodeType = graphRef.current.getNodeAttribute(nodeId, "nodeType");
        const isHidden = graphRef.current.getNodeAttribute(nodeId, "hidden");

        if (nodeType === "category" && !isHidden) {
          const category =
            graphRef.current.getNodeAttribute(nodeId, "originalLabel") ||
            graphRef.current.getNodeAttribute(nodeId, "category");
          visibleCategories.push({
            id: nodeId,
            category: category,
          });
        }
      });

      const radius = 30;
      const angleStep = (2 * Math.PI) / visibleCategories.length;

      visibleCategories.forEach((catNode, index) => {
        const angle = index * angleStep;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        graphRef.current.setNodeAttribute(catNode.id, "x", x);
        graphRef.current.setNodeAttribute(catNode.id, "y", y);

        graphRef.current.forEachNode((nodeId) => {
          if (nodeId === catNode.id) return;

          const nodeType = graphRef.current.getNodeAttribute(
            nodeId,
            "nodeType"
          );
          const isHidden = graphRef.current.getNodeAttribute(nodeId, "hidden");

          if (isHidden) return;

          if (nodeType === "term" || nodeType === "definition") {
            const nodeCategories =
              graphRef.current.getNodeAttribute(nodeId, "categories") || [];

            if (nodeCategories.includes(catNode.category)) {
              const nodeRadius = radius * 0.6;
              const nodeAngle = angle + (Math.random() * 0.6 - 0.3) * angleStep;
              const nodeX = x + nodeRadius * Math.cos(nodeAngle);
              const nodeY = y + nodeRadius * Math.sin(nodeAngle);

              graphRef.current.setNodeAttribute(nodeId, "x", nodeX);
              graphRef.current.setNodeAttribute(nodeId, "y", nodeY);
            }
          }
        });
      });

      noverlap.assign(graphRef.current, { maxIterations: 150, margin: 5 });
      sigmaRef.current.refresh();
      sigmaRef.current.getCamera().animatedReset();

      setTimeout(() => {
        const camera = sigmaRef.current.getCamera();
        const state = camera.getState();
        camera.animate(
          { ...state, ratio: state.ratio * 1.2 },
          { duration: 300 }
        );
      }, 300);
    } catch (err) {
      console.error("Error applying clustering:", err);
    }
  }, []);

  const toggleClustering = useCallback(() => {
    setClusterByCategory((prev) => {
      const newValue = !prev;
      if (newValue && graphRef.current && sigmaRef.current) {
        applyClustering();
      } else if (!newValue && graphRef.current && sigmaRef.current) {
        circular.assign(graphRef.current);
        sigmaRef.current.getCamera().animatedReset();
        sigmaRef.current.refresh();
      }
      return newValue;
    });
  }, [applyClustering]);

  useEffect(() => {
    applyFilters();
  }, [nodeTypeFilters, categoryFilters, clusterByCategory, applyFilters]);

  const performSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setIsSearching(false);
      setSearchResults(null);
      setFilteredGraphData(originalGraphData);
      return;
    }

    try {
      setIsSearching(true);
      const languageCode = getLanguageCode();

      try {
        const searchResponse = await searchNodeByName(query, languageCode, 10);

        const hasExactMatches =
          searchResponse.exactMatches && searchResponse.exactMatches.length > 0;
        const hasSuggestions =
          searchResponse.suggestions && searchResponse.suggestions.length > 0;
        const hasRelatedNodes =
          searchResponse.relatedNodes && searchResponse.relatedNodes.length > 0;

        if (!hasExactMatches && !hasSuggestions && !hasRelatedNodes) {
          setSearchResults({
            notFound: true,
            query: query,
            exactMatches: [],
            suggestions: [],
            relatedNodes: [],
          });
          setFilteredGraphData({ nodes: [], relationships: [] });
        } else {
          setSearchResults(searchResponse);
          const searchGraphData = createSearchResultGraph(
            searchResponse,
            query,
            languageCode
          );
          setFilteredGraphData(searchGraphData);
        }
      } catch (apiError) {
        console.error("Error searching nodes:", apiError);
        performLocalSearch(query);
      }

      setIsSearching(false);
    } catch (err) {
      console.error("Error during search:", err);
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setFilteredGraphData(originalGraphData);
  };

  const createSearchResultGraph = (searchResponse, query, languageCode) => {
    const searchNodes = [];
    const searchRelationships = [];
    const nodeIds = new Set();

    let mainSearchNodeId = null;
    if (searchResponse.exactMatches && searchResponse.exactMatches.length > 0) {
      const exactMatch = searchResponse.exactMatches[0];
      mainSearchNodeId = `search-term-${exactMatch.properties.id}`;

      if (!nodeIds.has(mainSearchNodeId)) {
        searchNodes.push({
          id: mainSearchNodeId,
          label: exactMatch.name,
          nodeType: "term",
          language: languageCode,
          size: 18,
          color: nodeColors.term.selected,
          categories: [],
          isSearchResult: true,
          searchType: "exact_match",
        });
        nodeIds.add(mainSearchNodeId);
      }
    }

    if (searchResponse.suggestions && searchResponse.suggestions.length > 0) {
      searchResponse.suggestions.forEach((suggestion, index) => {
        const suggestionId = `suggestion-${index}`;
        if (!nodeIds.has(suggestionId)) {
          const displayLabel =
            suggestion.suggestion.length > 50
              ? suggestion.suggestion.substring(0, 50) + "..."
              : suggestion.suggestion;

          searchNodes.push({
            id: suggestionId,
            label: displayLabel,
            fullText: suggestion.suggestion,
            nodeType: suggestion.type.toLowerCase(),
            language: languageCode,
            size: 12,
            color:
              suggestion.type === "Definition"
                ? nodeColors.definition.secondary
                : nodeColors.term.default,
            categories: [],
            isSearchResult: true,
            searchType: "suggestion",
          });
          nodeIds.add(suggestionId);

          if (mainSearchNodeId) {
            searchRelationships.push({
              id: `rel-search-suggestion-${index}`,
              source: mainSearchNodeId,
              target: suggestionId,
              relType: "RELATED_TO",
              label: "RELATED_TO",
              color: "#FF9500",
              size: 1.5,
              isSearchResult: true,
            });
          }
        }
      });
    }

    if (searchResponse.relatedNodes && searchResponse.relatedNodes.length > 0) {
      searchResponse.relatedNodes.forEach((relatedNode, index) => {
        const relatedNodeId = `related-${relatedNode.id || index}`;
        if (!nodeIds.has(relatedNodeId)) {
          let nodeColor = nodeColors.term.default;
          let nodeSize = 12;

          if (relatedNode.type === "Category") {
            nodeColor = nodeColors.category[relatedNode.name] || "#6366F1";
            nodeSize = 20;
          } else if (relatedNode.type === "Definition") {
            nodeColor =
              relatedNode.definitionType === "primary"
                ? nodeColors.definition.primary
                : nodeColors.definition.secondary;
            nodeSize = 10;
          }

          const displayLabel =
            relatedNode.name.length > 50
              ? relatedNode.name.substring(0, 50) + "..."
              : relatedNode.name;

          searchNodes.push({
            id: relatedNodeId,
            label: displayLabel,
            fullText: relatedNode.fullText || relatedNode.name,
            nodeType: relatedNode.type.toLowerCase(),
            language: languageCode,
            size: nodeSize,
            color: nodeColor,
            categories:
              relatedNode.type === "Category" ? [relatedNode.name] : [],
            isSearchResult: true,
            searchType: "related",
            defType: relatedNode.definitionType || "secondary",
          });
          nodeIds.add(relatedNodeId);

          if (mainSearchNodeId) {
            let relationshipColor = "#8DCC93";
            const relationshipType =
              relatedNode.relationshipType || "RELATED_TO";

            if (relationshipType === "HAS_DEFINITION") {
              relationshipColor = "#4C8EDA";
            } else if (relationshipType === "RELATED_TO") {
              relationshipColor = "#FFC454";
            }

            searchRelationships.push({
              id: `rel-search-related-${index}`,
              source: mainSearchNodeId,
              target: relatedNodeId,
              relType: relationshipType,
              label: relationshipType,
              color: relationshipColor,
              size: 1.2,
              isSearchResult: true,
            });
          }
        }
      });
    }

    if (!mainSearchNodeId && searchNodes.length > 0) {
      mainSearchNodeId = `search-query-${Date.now()}`;
      searchNodes.unshift({
        id: mainSearchNodeId,
        label: query,
        nodeType: "term",
        language: languageCode,
        size: 18,
        color: nodeColors.term.selected,
        categories: [],
        isSearchResult: true,
        searchType: "query",
      });

      searchNodes.slice(1).forEach((node, index) => {
        searchRelationships.push({
          id: `rel-query-${index}`,
          source: mainSearchNodeId,
          target: node.id,
          relType: "SEARCH_RESULT",
          label: "SEARCH_RESULT",
          color: "#FF9500",
          size: 1.2,
          isSearchResult: true,
        });
      });
    }

    return {
      nodes: searchNodes,
      relationships: searchRelationships,
    };
  };

  const performLocalSearch = (query) => {
    const matchingNodes = new Set();
    const directlyConnectedNodes = new Set();
    const relevantEdges = new Set();

    graphRef.current.forEachNode((node) => {
      try {
        const label = (
          graphRef.current.getNodeAttribute(node, "label") || ""
        ).toLowerCase();
        const originalLabel = (
          graphRef.current.getNodeAttribute(node, "originalLabel") || ""
        ).toLowerCase();

        if (
          label.includes(query.toLowerCase()) ||
          originalLabel.includes(query.toLowerCase())
        ) {
          matchingNodes.add(node);
          graphRef.current.setNodeAttribute(node, "hidden", false);
        } else {
          graphRef.current.setNodeAttribute(node, "hidden", true);
        }
      } catch (err) {
        console.error("Error processing node during local search:", err);
      }
    });

    matchingNodes.forEach((nodeId) => {
      try {
        graphRef.current.forEachEdge(
          nodeId,
          (edge, attributes, source, target) => {
            const connectedNodeId = source === nodeId ? target : source;
            directlyConnectedNodes.add(connectedNodeId);
            relevantEdges.add(edge);
            graphRef.current.setNodeAttribute(connectedNodeId, "hidden", false);
            graphRef.current.setEdgeAttribute(edge, "hidden", false);
          }
        );
      } catch (err) {
        console.error("Error processing connections during local search:", err);
      }
    });

    graphRef.current.forEachEdge((edge) => {
      graphRef.current.setEdgeAttribute(edge, "hidden", true);
    });

    relevantEdges.forEach((edge) => {
      graphRef.current.setEdgeAttribute(edge, "hidden", false);
    });

    matchingNodes.forEach((nodeId) => {
      graphRef.current.setNodeAttribute(
        nodeId,
        "color",
        nodeColors.term.selected
      );
    });
  };

  const handleNodeDrag = (nodeId, event) => {
    if (!graphRef.current || !sigmaRef.current) return;

    try {
      const pos = sigmaRef.current.viewportToGraph({
        x: event.clientX,
        y: event.clientY,
      });

      graphRef.current.setNodeAttribute(nodeId, "x", pos.x);
      graphRef.current.setNodeAttribute(nodeId, "y", pos.y);
      sigmaRef.current.refresh();
    } catch (err) {
      console.error("Error during node drag:", err);
    }
  };

  const findConnectedNodes = (nodeId) => {
    if (!graphRef.current || !nodeId) return [];

    const connected = [];
    try {
      graphRef.current.forEachEdge(
        nodeId,
        (edge, attributes, source, target) => {
          const connectedNodeId = source === nodeId ? target : source;
          if (graphRef.current.hasNode(connectedNodeId)) {
            const nodeAttrs =
              graphRef.current.getNodeAttributes(connectedNodeId);
            connected.push({
              id: connectedNodeId,
              label: nodeAttrs.label || "",
              nodeType: nodeAttrs.nodeType || "",
              relType: attributes.relType || "unknown",
              color: nodeAttrs.color || "#cccccc",
              defType: nodeAttrs.defType || "",
              fullText: nodeAttrs.fullText || "",
              originalLabel: nodeAttrs.originalLabel || "",
            });
          }
        }
      );
    } catch (err) {
      console.error("Error finding connected nodes:", err);
    }

    return connected.sort((a, b) => {
      const relOrder = { HAS_DEFINITION: 1, BELONGS_TO: 2, RELATED_TO: 3 };
      if (a.relType !== b.relType) {
        return relOrder[a.relType] - relOrder[b.relType];
      }
      const typeOrder = { term: 1, definition: 2, category: 3 };
      return typeOrder[a.nodeType] - typeOrder[b.nodeType];
    });
  };

  const navigateToNode = (nodeId) => {
    if (!graphRef.current || !sigmaRef.current) return;

    handleNodeClick(nodeId);
    const nodePosition = sigmaRef.current.getNodeDisplayData(nodeId);
    if (nodePosition) {
      sigmaRef.current
        .getCamera()
        .animate(
          { x: nodePosition.x, y: nodePosition.y, ratio: 0.3 },
          { duration: 500 }
        );
    }
  };

   
  const handleNodeClick = async (nodeId) => {
    try {
      if (!graphRef.current) return;

      if (!graphRef.current.hasNode(nodeId)) {
        console.warn(`Node ${nodeId} not found in graph`);
        return;
      }

      if (lastClickedNodeRef.current === nodeId) {
         
        setSelectedNode(null);
        setHoveredNode(null);
        setHighlightedRelationships([]);
        setConnectedNodes([]);
        lastClickedNodeRef.current = null;

        graphRef.current.forEachNode((node) => {
          graphRef.current.setNodeAttribute(node, "hidden", false);
          const nodeType = graphRef.current.getNodeAttribute(node, "nodeType");
          if (nodeType === "term") {
            graphRef.current.setNodeAttribute(
              node,
              "color",
              nodeColors.term.default
            );
          } else if (nodeType === "definition") {
            const defType = graphRef.current.getNodeAttribute(node, "defType");
            graphRef.current.setNodeAttribute(
              node,
              "color",
              defType === "primary"
                ? nodeColors.definition.primary
                : nodeColors.definition.secondary
            );
          } else if (nodeType === "category") {
            const label =
              graphRef.current.getNodeAttribute(node, "originalLabel") ||
              graphRef.current.getNodeAttribute(node, "label");
            graphRef.current.setNodeAttribute(
              node,
              "color",
              nodeColors.category[label] || "#6366F1"
            );
          }
        });

        graphRef.current.forEachEdge((edge) => {
          graphRef.current.setEdgeAttribute(edge, "hidden", false);
          const relType = graphRef.current.getEdgeAttribute(edge, "relType");
          if (relType === "HAS_DEFINITION") {
            graphRef.current.setEdgeAttribute(edge, "color", "#4C8EDA");
          } else if (relType === "BELONGS_TO") {
            graphRef.current.setEdgeAttribute(edge, "color", "#8DCC93");
          } else if (relType === "RELATED_TO") {
            graphRef.current.setEdgeAttribute(edge, "color", "#FFC454");
          }
        });

        applyFilters();
        setProjectionName(null);
      } else {
         
        const nodeAttributes = graphRef.current.getNodeAttributes(nodeId);

        const node = {
          id: nodeId,
          label: nodeAttributes.label || "",
          nodeType: nodeAttributes.nodeType || "",
          color: nodeAttributes.color || "",
          size: nodeAttributes.size || 0,
          language: nodeAttributes.language || "en",
          defType: nodeAttributes.defType || "",
          references: nodeAttributes.references || "",
          fullText: nodeAttributes.fullText || "",
          originalLabel: nodeAttributes.originalLabel || "",
          categories: nodeAttributes.categories || [],
          category: nodeAttributes.category || "",
          isSearchResult: nodeAttributes.isSearchResult || false,
          searchType: nodeAttributes.searchType || "",
          emoji: nodeAttributes.emoji || "",
        };

        setSelectedNode(node);
        setHoveredNode(null);
        lastClickedNodeRef.current = nodeId;

         
        const directlyConnectedNodes = new Set([nodeId]);
        const directlyConnectedEdges = [];

        graphRef.current.forEachEdge(
          nodeId,
          (edge, attributes, source, target) => {
            if (graphRef.current.hasEdge(edge)) {
              directlyConnectedEdges.push(edge);
              const connectedNodeId = source === nodeId ? target : source;
              directlyConnectedNodes.add(connectedNodeId);
            }
          }
        );

        setHighlightedRelationships(directlyConnectedEdges);
        setConnectedNodes(findConnectedNodes(nodeId));

         
        graphRef.current.forEachNode((node) => {
          const isDirectlyConnected = directlyConnectedNodes.has(node);
          graphRef.current.setNodeAttribute(
            node,
            "hidden",
            !isDirectlyConnected
          );

          if (isDirectlyConnected) {
            const nodeType = graphRef.current.getNodeAttribute(
              node,
              "nodeType"
            );
            if (node === nodeId) {
               
              graphRef.current.setNodeAttribute(
                node,
                "color",
                nodeColors.term.selected
              );
            } else if (nodeType === "term") {
              graphRef.current.setNodeAttribute(
                node,
                "color",
                nodeColors.term.default
              );
            } else if (nodeType === "definition") {
              const defType = graphRef.current.getNodeAttribute(
                node,
                "defType"
              );
              graphRef.current.setNodeAttribute(
                node,
                "color",
                defType === "primary"
                  ? nodeColors.definition.primary
                  : nodeColors.definition.secondary
              );
            } else if (nodeType === "category") {
              const label =
                graphRef.current.getNodeAttribute(node, "originalLabel") ||
                graphRef.current.getNodeAttribute(node, "label");
              graphRef.current.setNodeAttribute(
                node,
                "color",
                nodeColors.category[label] || "#6366F1"
              );
            }
          }
        });

         
        graphRef.current.forEachEdge((edge) => {
          const isDirectlyConnected = directlyConnectedEdges.includes(edge);
          graphRef.current.setEdgeAttribute(
            edge,
            "hidden",
            !isDirectlyConnected
          );

          if (isDirectlyConnected) {
            graphRef.current.setEdgeAttribute(edge, "color", "#FF5722");
            graphRef.current.setEdgeAttribute(
              edge,
              "size",
              graphRef.current.getEdgeAttribute(edge, "size") * 1.5
            );
          }
        });

         
        try {
          const response1 = await fetch(
            `http://localhost:3001/api/search/node?nodeName=${encodeURIComponent(
              node.label
            )}&language=${node.language}`,
            { headers: { "Content-Type": "application/json" } }
          );

          if (!response1.ok) throw new Error("Failed to fetch node details");

          const data1 = await response1.json();
          console.log("Search Node API Response:", data1);

          const response2 = await fetch(
            `http://localhost:3001/api/gds/subgraph-projections`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                termName: node.label,
                depth: 2,
                language: node.language,
              }),
            }
          );

          if (!response2.ok)
            throw new Error("Failed to create subgraph projection");

          const data2 = await response2.json();
          console.log("Projection API Response:", data2);

          if (data2.success && data2.projectionName) {
            setProjectionName(data2.projectionName);
            localStorage.setItem("projectionName", data2.projectionName);
          }
        } catch (apiErr) {
          console.error("Error in API calls after node click:", apiErr);
        }
      }

      if (sigmaRef.current) {
        try {
          sigmaRef.current.refresh();
        } catch (err) {
          console.error("Error refreshing sigma after node click:", err);
        }
      }
    } catch (err) {
      console.error("Error handling node click:", err);
    }
  };

  const handleNodeHover = (nodeId) => {
    if (!graphRef.current || !nodeId) return;

    try {
      const nodeAttributes = graphRef.current.getNodeAttributes(nodeId);

      const node = {
        id: nodeId,
        label: nodeAttributes.label || "",
        nodeType: nodeAttributes.nodeType || "",
        color: nodeAttributes.color || "",
        size: nodeAttributes.size || 0,
        language: nodeAttributes.language || "en",
        defType: nodeAttributes.defType || "",
        references: nodeAttributes.references || "",
        fullText: nodeAttributes.fullText || "",
        originalLabel: nodeAttributes.originalLabel || "",
        categories: nodeAttributes.categories || [],
        category: nodeAttributes.category || "",
        isSearchResult: nodeAttributes.isSearchResult || false,
        searchType: nodeAttributes.searchType || "",
        emoji: nodeAttributes.emoji || "",
      };

      setHoveredNode(node);
    } catch (err) {
      console.error("Error handling node hover:", err);
    }
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

   
  const exportGraph = () => {
    if (!containerRef.current || !sigmaRef.current) return;

    try {
       
      const renderer = sigmaRef.current;
      const canvas = renderer.getCanvases().nodes;

      if (!canvas) {
        console.error("Could not find sigma canvas element");
        return;
      }

       
      const exportCanvas = document.createElement("canvas");
      const ctx = exportCanvas.getContext("2d");

       
      const containerRect = containerRef.current.getBoundingClientRect();
      exportCanvas.width = containerRect.width;
      exportCanvas.height = containerRect.height;

       
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

       
      try {
        ctx.drawImage(canvas, 0, 0);
      } catch (drawError) {
        console.error("Error drawing canvas:", drawError);
         
        html2canvas(containerRef.current, {
          backgroundColor: "#ffffff",
          scale: 1,
          logging: false,
        })
          .then((canvas) => {
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = `knowledge-graph-${language}-${new Date()
                  .toISOString()
                  .slice(0, 10)}.png`;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            }, "image/png");
          })
          .catch((err) => {
            console.error("Fallback export failed:", err);
            alert("Export failed. Please try again.");
          });
        return;
      }

       
      exportCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `knowledge-graph-${language}-${new Date()
            .toISOString()
            .slice(0, 10)}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (err) {
      console.error("Error exporting graph:", err);
      alert("Export failed. Please try again.");
    }
  };

  useEffect(() => {
    if (
      isLoading ||
      error ||
      !filteredGraphData.nodes.length ||
      !containerRef.current
    )
      return;

    if (sigmaRef.current) {
      try {
        sigmaRef.current.kill();
      } catch (err) {
        console.error("Error killing previous Sigma instance:", err);
      }
      sigmaRef.current = null;
    }

    cleanupTooltips();

    try {
      const graph = new Graph();
      graphRef.current = graph;

      const addedNodes = new Set();

      filteredGraphData.nodes.forEach((node) => {
        try {
          if (!node.id || addedNodes.has(node.id)) {
            console.warn(`Skipping duplicate or invalid node: ${node.id}`);
            return;
          }

          graph.addNode(node.id, {
            label: node.label || "",
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            size: node.size || 5,
            color: node.color || "#cccccc",
            nodeType: node.nodeType || "unknown",
            language: node.language || "",
            defType: node.defType || "",
            references: node.references || "",
            fullText: node.fullText || "",
            grayed: false,
            hidden: false,
            categories: node.categories || [],
            category: node.category || "",
            originalLabel: node.originalLabel || "",
            isSearchResult: node.isSearchResult || false,
            searchType: node.searchType || "",
            emoji: node.emoji || "",
          });

          addedNodes.add(node.id);
        } catch (err) {
          console.error(`Error adding node ${node.id}:`, err);
        }
      });

      filteredGraphData.relationships.forEach((rel) => {
        try {
          if (
            !rel.source ||
            !rel.target ||
            !graph.hasNode(rel.source) ||
            !graph.hasNode(rel.target)
          ) {
            return;
          }

          if (!graph.hasEdge(rel.source, rel.target)) {
            graph.addEdge(rel.source, rel.target, {
              id: rel.id || `edge-${rel.source}-${rel.target}`,
              label: rel.label || "",
              relType: rel.relType || "unknown",
              color: rel.color || "#aaaaaa",
              size: rel.size || 1,
              hidden: false,
            });
          }
        } catch (err) {
          console.error(
            `Error adding edge from ${rel.source} to ${rel.target}:`,
            err
          );
        }
      });

      try {
        circular.assign(graph);
      } catch (err) {
        console.error("Error applying circular layout:", err);
      }

      try {
        const settings = forceAtlas2.inferSettings(graph);
        forceAtlas2.assign(graph, {
          settings: {
            ...settings,
            gravity: 0.3,
            strongGravityMode: false,
            scalingRatio: 150,
            slowDown: 2,
            linLogMode: true,
            outboundAttractionDistribution: true,
            edgeWeightInfluence: 3,
            barnesHutOptimize: true,
            barnesHutTheta: 0.5,
          },
          iterations: 800,
        });

         
        noverlap.assign(graph, {
          maxIterations: 200,
          margin: 8,
          speed: 3,
        });

         
        graph.forEachNode((nodeId) => {
          const nodeType = graph.getNodeAttribute(nodeId, "nodeType");
          if (nodeType === "category") {
            const x = graph.getNodeAttribute(nodeId, "x");
            const y = graph.getNodeAttribute(nodeId, "y");
            graph.setNodeAttribute(nodeId, "x", x * 2.5);
            graph.setNodeAttribute(nodeId, "y", y * 2.5);
          }
        });

         
        graph.forEachNode((nodeId) => {
          const nodeType = graph.getNodeAttribute(nodeId, "nodeType");
          if (nodeType === "definition") {
            const x = graph.getNodeAttribute(nodeId, "x");
            const y = graph.getNodeAttribute(nodeId, "y");
            graph.setNodeAttribute(nodeId, "x", x * 1.5);
            graph.setNodeAttribute(nodeId, "y", y * 1.5);
          }
        });
      } catch (err) {
        console.error("Error applying force layout:", err);
      }

      const renderer = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: false,
        allowInvalidContainer: true,
        labelRenderedSizeThreshold: 8,
        labelFont: "Arial, sans-serif",
        minCameraRatio: 0.05,
        maxCameraRatio: 10,
        labelColor: {
          color: "#333333",
        },
        defaultEdgeColor: "#e0e0e0",
        defaultEdgeType: "arrow",  
        labelSize: 11,
        labelWeight: "bold",
        defaultNodeBorderWidth: 2,
        edgeLabelSize: 8,
        stagePadding: 100,
        nodeReducer: (node, data) => {
          try {
            const res = { ...data };
            if (data.hidden) {
              return { ...data, hidden: true };
            }

            if (data.grayed) {
              res.color = "#cccccc";
              res.borderColor = "#dddddd";
            }

             
            res.borderWidth = 2;
            res.borderColor = "#ffffff";

            if (data.nodeType === "category") {
              res.size = data.size * 1.2;
              res.borderColor = "#333333";
              res.borderWidth = 3;
               
              if (data.emoji) {
                res.label = `${data.emoji}\n${data.label}`;
              }
            } else if (data.nodeType === "term") {
              res.size = data.size * 1.0;
              res.borderColor = "#666666";
              res.borderWidth = 2;
            } else if (data.nodeType === "definition") {
              res.size = data.size * 0.8;
              res.borderColor = "#888888";
              res.borderWidth = 2;
            }

            if (selectedNode && node === selectedNode.id) {
              res.highlighted = true;
              res.color = nodeColors.term.selected;
              res.borderColor = "#000000";
              res.borderWidth = 4;
            }

            return res;
          } catch (err) {
            console.error("Error in nodeReducer:", err);
            return data;
          }
        },
        edgeReducer: (edge, data) => {
          try {
            const res = { ...data };
            if (data.hidden) {
              return { ...data, hidden: true };
            }

             
            res.size = data.size * 0.8;

            if (data.relType === "HAS_DEFINITION") {
              res.color = "#4C8EDA";
            } else if (data.relType === "BELONGS_TO") {
              res.color = "#8DCC93";
            } else if (data.relType === "RELATED_TO") {
              res.color = "#FFC454";
            }

            if (
              selectedNode &&
              (graph.source(edge) === selectedNode.id ||
                graph.target(edge) === selectedNode.id)
            ) {
              res.color = "#ff5722";
              res.size = data.size * 2;
            }

            return res;
          } catch (err) {
            console.error("Error in edgeReducer:", err);
            return data;
          }
        },
      });

      setTimeout(() => {
        if (sigmaRef.current) {
          try {
            sigmaRef.current.getCamera().animatedReset();
            const camera = sigmaRef.current.getCamera();
            const state = camera.getState();
            camera.animate(
              { ...state, ratio: state.ratio / 3 },
              { duration: 300 }
            );
          } catch (err) {
            console.error("Error fitting graph to view:", err);
          }
        }
      }, 500);

      sigmaRef.current = renderer;

      renderer
        .on("downNode", (e) => {
          setIsDragging(true);
          setDraggedNode(e.node);
          graph.setNodeAttribute(e.node, "highlighted", true);
          if (!renderer.getCustomBBox())
            renderer.setCustomBBox(renderer.getBBox());
        })
        .on("mousemove", (e) => {
          if (isDragging && draggedNode) {
            const pos = renderer.viewportToGraph(e);
            graph.setNodeAttribute(draggedNode, "x", pos.x);
            graph.setNodeAttribute(draggedNode, "y", pos.y);
            e.preventSigmaDefault();
          }
        })
        .on("mouseup", () => {
          if (draggedNode) {
            graph.removeNodeAttribute(draggedNode, "highlighted");
          }
          setIsDragging(false);
          setDraggedNode(null);
        })
        .on("clickNode", ({ node }) => {
          handleNodeClick(node);
        })
        .on("enterNode", ({ node }) => {
          handleNodeHover(node);
        })
        .on("leaveNode", () => {
          handleNodeLeave();
        });

      applyFilters();

      return () => {
        if (sigmaRef.current) {
          try {
            sigmaRef.current.kill();
          } catch (err) {
            console.error("Error killing Sigma instance on unmount:", err);
          }
        }
        cleanupTooltips();
      };
    } catch (err) {
      console.error("Error initializing Sigma:", err);
      setError(
        "Failed to initialize the knowledge graph. Please try again later."
      );
      setIsLoading(false);
    }
  }, [filteredGraphData, containerRef, selectedNode, applyFilters]);

  useEffect(() => {
    return () => {
      cleanupTooltips();
      if (sigmaRef.current) {
        try {
          sigmaRef.current.kill();
          sigmaRef.current = null;
        } catch (err) {
          console.error(
            "Error killing Sigma instance on language change:",
            err
          );
        }
      }
    };
  }, [language, cleanupTooltips]);

  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const groupedConnectedNodes = () => {
    if (!connectedNodes.length) return {};

    const grouped = {
      RELATED_TO: [],
      HAS_DEFINITION: [],
      BELONGS_TO: [],
    };

    connectedNodes.forEach((node) => {
      if (grouped[node.relType]) {
        grouped[node.relType].push(node);
      } else {
        grouped[node.relType] = [node];
      }
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        const typeOrder = { term: 1, definition: 2, category: 3 };
        if (a.nodeType !== b.nodeType) {
          return typeOrder[a.nodeType] - typeOrder[b.nodeType];
        }
        return a.label.localeCompare(b.label);
      });
    });

    return grouped;
  };

  const getRelationshipLabel = (relType) => {
    switch (relType) {
      case "HAS_DEFINITION":
        return "Has Definition";
      case "BELONGS_TO":
        return "Belongs To";
      case "RELATED_TO":
        return "Related To";
      default:
        return relType;
    }
  };

  const getRelationshipColor = (relType) => {
    switch (relType) {
      case "HAS_DEFINITION":
        return "#4C8EDA";
      case "BELONGS_TO":
        return "#8DCC93";
      case "RELATED_TO":
        return "#FFC454";
      default:
        return "#aaaaaa";
    }
  };

  const getNodeTypeLabel = (nodeType) => {
    switch (nodeType) {
      case "term":
        return "Terms";
      case "definition":
        return "Definitions";
      case "category":
        return "Categories";
      default:
        return nodeType;
    }
  };

  const toggleAllNodeTypes = (value) => {
    setNodeTypeFilters({
      term: value,
      definition: value,
      category: value,
    });
  };

  const toggleAllCategories = (value) => {
    const newCategoryFilters = {};
    Object.keys(categoryFilters).forEach((category) => {
      newCategoryFilters[category] = value;
    });
    setCategoryFilters(newCategoryFilters);
  };

  return (
    <div className="graph-visualization">
      <div className="controls">
        <div className="search-bar">
          <Search className="icon" />
          <input
            type="search"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && performSearch()}
            disabled={isSearching}
          />
          <button
            className="search-button"
            onClick={performSearch}
            disabled={isSearching}
          >
            {isSearching ? "..." : "Search"}
          </button>
          {searchQuery && (
            <button className="clear-search-button" onClick={clearSearch}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="buttons">
          <button onClick={() => sigmaRef.current?.getCamera().animatedReset()}>
            <RefreshCw className="icon" />
          </button>
          <button
            onClick={() => {
              if (sigmaRef.current) {
                const camera = sigmaRef.current.getCamera();
                const state = camera.getState();
                camera.animate(
                  { ...state, ratio: state.ratio / 2 },
                  { duration: 300 }
                );
              }
            }}
          >
            <ZoomIn className="icon" />
          </button>
          <button
            onClick={() => {
              if (sigmaRef.current) {
                const camera = sigmaRef.current.getCamera();
                const state = camera.getState();
                camera.animate(
                  { ...state, ratio: state.ratio * 2 },
                  { duration: 300 }
                );
              }
            }}
          >
            <ZoomOut className="icon" />
          </button>
          <button onClick={toggleFullScreen}>
            {isFullScreen ? (
              <Minimize className="icon" />
            ) : (
              <Maximize className="icon" />
            )}
          </button>
          <button onClick={exportGraph}>
            <Download className="icon" />
          </button>
          <button onClick={toggleLegend}>
            <Info className="icon" />
          </button>
          <button
            onClick={toggleFilters}
            className={showFilters ? "active" : ""}
          >
            <Filter className="icon" />
          </button>
          {selectedNode && (
            <button
              onClick={deleteSelectedNode}
              className="delete-button"
              title="Delete selected node"
            >
              <Trash2 className="icon" />
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={toggleFilters} className="close-button">
              <X className="icon" size={16} />
            </button>
          </div>

          <div className="filter-section">
            <div
              className="filter-section-header"
              onClick={() => setShowNodeTypeFilters(!showNodeTypeFilters)}
            >
              <h4>Node Types</h4>
              {showNodeTypeFilters ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            {showNodeTypeFilters && (
              <div className="filter-options">
                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={Object.values(nodeTypeFilters).every((v) => v)}
                      onChange={(e) => toggleAllNodeTypes(e.target.checked)}
                    />
                    <span>All Node Types</span>
                  </label>
                </div>
                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={nodeTypeFilters.term}
                      onChange={(e) =>
                        setNodeTypeFilters({
                          ...nodeTypeFilters,
                          term: e.target.checked,
                        })
                      }
                    />
                    <span>Terms</span>
                  </label>
                </div>
                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={nodeTypeFilters.definition}
                      onChange={(e) =>
                        setNodeTypeFilters({
                          ...nodeTypeFilters,
                          definition: e.target.checked,
                        })
                      }
                    />
                    <span>Definitions</span>
                  </label>
                </div>
                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={nodeTypeFilters.category}
                      onChange={(e) =>
                        setNodeTypeFilters({
                          ...nodeTypeFilters,
                          category: e.target.checked,
                        })
                      }
                    />
                    <span>Categories</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="filter-section">
            <div
              className="filter-section-header"
              onClick={() => setShowCategoryFilters(!showCategoryFilters)}
            >
              <h4>Categories</h4>
              {showCategoryFilters ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            {showCategoryFilters && (
              <div className="filter-options">
                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={Object.values(categoryFilters).every((v) => v)}
                      onChange={(e) => toggleAllCategories(e.target.checked)}
                    />
                    <span>All Categories</span>
                  </label>
                </div>
                {Object.keys(categoryFilters).map((category) => (
                  <div className="filter-option" key={category}>
                    <label>
                      <input
                        type="checkbox"
                        checked={categoryFilters[category]}
                        onChange={(e) =>
                          setCategoryFilters({
                            ...categoryFilters,
                            [category]: e.target.checked,
                          })
                        }
                      />
                      <span style={{ color: nodeColors.category[category] }}>
                        {categoryEmojis[category]} {category}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-option clustering-option">
              <label>
                <input
                  type="checkbox"
                  checked={clusterByCategory}
                  onChange={toggleClustering}
                />
                <span>Cluster by Category</span>
              </label>
            </div>
          </div>

          <div className="filter-actions">
            <button
              onClick={() => {
                toggleAllNodeTypes(true);
                toggleAllCategories(true);
                setClusterByCategory(false);
              }}
              className="reset-button"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <div className="graph-container" ref={containerRef}>
        {isLoading && (
          <div className="loading-message">Loading knowledge graph...</div>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>

      {selectedNode && (
        <div className={`node-panel ${isPanelOpen ? "open" : ""}`}>
          <button
            className="panel-toggle"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
          >
            {isPanelOpen ? "«" : "»"}
          </button>

          <div className="panel-header">
            <h2>{selectedNode.label}</h2>
            <button
              onClick={deleteSelectedNode}
              className="delete-node-button"
              title="Delete this node"
            >
              <X size={16} />
            </button>
          </div>

          <p>
            <b>Type:</b> {selectedNode.nodeType}
            {selectedNode.isSearchResult && (
              <span className="search-badge">Search Result</span>
            )}
          </p>

          {selectedNode.searchType && (
            <p>
              <b>Search Type:</b>
              <span className={`search-type-badge ${selectedNode.searchType}`}>
                {selectedNode.searchType.replace("_", " ").toUpperCase()}
              </span>
            </p>
          )}

          {selectedNode.nodeType === "definition" && (
            <>
              <p>
                <b>Definition Type:</b> {selectedNode.defType}
              </p>
              <p>
                <b>Full Text:</b> {selectedNode.fullText}
              </p>
              {selectedNode.references && (
                <p>
                  <b>References:</b> {selectedNode.references}
                </p>
              )}
            </>
          )}

          {selectedNode.fullText && selectedNode.nodeType !== "definition" && (
            <div className="full-text-section">
              <h4>Full Text</h4>
              <p className="full-text">{selectedNode.fullText}</p>
            </div>
          )}

          {selectedNode.categories && selectedNode.categories.length > 0 && (
            <div className="node-categories">
              <h4>Categories</h4>
              <div className="category-tags">
                {selectedNode.categories.map((category) => (
                  <span
                    key={category}
                    className="category-tag"
                    style={{ backgroundColor: nodeColors.category[category] }}
                  >
                    {categoryEmojis[category]} {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedNode.category && (
            <div className="node-categories">
              <h4>Category</h4>
              <div className="category-tags">
                <span
                  className="category-tag"
                  style={{
                    backgroundColor: nodeColors.category[selectedNode.category],
                  }}
                >
                  {categoryEmojis[selectedNode.category]}{" "}
                  {selectedNode.category}
                </span>
              </div>
            </div>
          )}

          {connectedNodes.length > 0 && (
            <div className="connected-nodes">
              <h3>Connected Nodes</h3>
              {Object.entries(groupedConnectedNodes()).map(
                ([relType, nodes]) => {
                  if (nodes.length === 0) return null;

                  return (
                    <div key={relType} className="connected-node-group">
                      <h4>{getRelationshipLabel(relType)}</h4>
                      <ul>
                        {nodes.map((node) => (
                          <li
                            key={node.id}
                            onClick={() => navigateToNode(node.id)}
                            className="connected-node-item"
                          >
                            <span
                              className="relationship-badge"
                              style={{
                                backgroundColor: getRelationshipColor(
                                  node.relType
                                ),
                              }}
                            ></span>
                            <div className="connected-node-content">
                              <span className="connected-node-label">
                                {node.label}
                              </span>
                              <span className="connected-node-type">
                                ({node.nodeType})
                              </span>
                              {node.isSearchResult && (
                                <span className="search-result-indicator">
                                  🔍
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {searchResults && searchQuery.trim() !== "" && (
            <div className="search-results">
              <h3>Search Results</h3>
              {searchResults.notFound ? (
                <div className="no-results">
                  <p>
                    <b>Query:</b> "{searchQuery}"
                  </p>
                  <p className="not-found-message">❌ No results found</p>
                  <p className="search-suggestion">
                    Try searching with different keywords or check your
                    spelling.
                  </p>
                </div>
              ) : (
                <div className="search-stats">
                  <p>
                    <b>Query:</b> "{searchQuery}"
                  </p>
                  {searchResults.exactMatches && (
                    <p>
                      <b>Exact Matches:</b> {searchResults.exactMatches.length}
                    </p>
                  )}
                  {searchResults.suggestions && (
                    <p>
                      <b>Suggestions:</b> {searchResults.suggestions.length}
                    </p>
                  )}
                  {searchResults.relatedNodes && (
                    <p>
                      <b>Related Nodes:</b> {searchResults.relatedNodes.length}
                    </p>
                  )}
                </div>
              )}
              <div className="search-instructions">
                <p>
                  <i>
                    💡 Click on any node in the graph to explore its connections
                    and details.
                  </i>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {showLegend && (
        <GraphLegend
          categories={categories[language] || categories.english}
          nodeColors={nodeColors}
          categoryEmojis={categoryEmojis}
        />
      )}
    </div>
  );
};

export default GraphVisualization;
