import { useState, useRef, useEffect, useCallback } from "react";
import { getAllterms } from "../../services/Api";
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
  Sun,
  Moon,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

 
import GraphLegend from "./GraphExport";

const GraphVisualization = ({ language = "english" }) => {
  const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedRelationships, setHighlightedRelationships] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectionName, setProjectionName] = useState(null);
  const [filteredGraphData, setFilteredGraphData] = useState({
    nodes: [],
    relationships: [],
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
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
      "Computer Contracts	",
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

   
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

   
  const toggleLegend = useCallback(() => {
    setShowLegend((prev) => !prev);
  }, []);

   
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

   
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
        setHighlightedRelationships([]);
        lastClickedNodeRef.current = null;

        const languageCode = getLanguageCode();
        const termsData = await getAllterms(languageCode);

        if (!termsData || termsData.length === 0) {
          throw new Error("No data received from API");
        }

         
        const graphStructure = transformDataToGraph(termsData, languageCode);
        setGraphData(graphStructure);
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
      const labelWithEmoji = `${emoji} ${category}`;

      const categoryNode = {
        id: categoryId,
        label: labelWithEmoji,
        originalLabel: category,
        nodeType: "category",
        language: languageCode,
        size: 15,
        color: nodeColors.category[category] || "#6366F1",  
        category: category,  
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
        size: 8,
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

           
          const defCategories = [];

           
          const defNode = {
            id: defId,
            label:
              def.text && def.text.length > 50
                ? def.text.substring(0, 50) + "..."
                : def.text || "No definition",
            fullText: def.text || "",
            nodeType: "definition",
            defType: def.type || "unknown",
            references: def.references || "",
            language: def.language,
            size: 5,
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
            size: 2,
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
                  size: 0.5,  
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
                  size: 1.5,
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

       
      const radius = 20;  
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
               
              const nodeRadius = radius * 0.7;  
              const nodeAngle = angle + (Math.random() * 0.8 - 0.4) * angleStep;  
              const nodeX = x + nodeRadius * Math.cos(nodeAngle);
              const nodeY = y + nodeRadius * Math.sin(nodeAngle);

              graphRef.current.setNodeAttribute(nodeId, "x", nodeX);
              graphRef.current.setNodeAttribute(nodeId, "y", nodeY);
            }
          }
        });
      });

       
      noverlap.assign(graphRef.current, { maxIterations: 100 });  

       
      sigmaRef.current.refresh();

       
      sigmaRef.current.getCamera().animatedReset();

       
      setTimeout(() => {
        const camera = sigmaRef.current.getCamera();
        const state = camera.getState();
        camera.animate(
          { ...state, ratio: state.ratio * 1.5 },
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

   
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!graphRef.current) return;

    try {
      if (query.trim() === "") {
         
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
      } else {
         
        graphRef.current.forEachNode((node) => {
          graphRef.current.setNodeAttribute(node, "hidden", true);
        });
        graphRef.current.forEachEdge((edge) => {
          graphRef.current.setEdgeAttribute(edge, "hidden", true);
        });

         
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

            if (label.includes(query) || originalLabel.includes(query)) {
              matchingNodes.add(node);
              graphRef.current.setNodeAttribute(node, "hidden", false);
            }
          } catch (err) {
            console.error("Error processing node during search:", err);
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

                 
                graphRef.current.setNodeAttribute(
                  connectedNodeId,
                  "hidden",
                  false
                );
                graphRef.current.setEdgeAttribute(edge, "hidden", false);
              }
            );
          } catch (err) {
            console.error("Error processing connections during search:", err);
          }
        });

         
        matchingNodes.forEach((nodeId) => {
          graphRef.current.setNodeAttribute(
            nodeId,
            "color",
            nodeColors.term.selected
          );
        });
      }

       
      if (sigmaRef.current) {
        sigmaRef.current.refresh();
      }
    } catch (err) {
      console.error("Error during search:", err);
    }
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
          { x: nodePosition.x, y: nodePosition.y, ratio: 0.5 },
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
        };

        setSelectedNode(node);
        lastClickedNodeRef.current = nodeId;

        const connectedEdges = [];
        const connectedNodes = new Set([nodeId]);

        graphRef.current.forEachEdge(
          nodeId,
          (edge, attributes, source, target) => {
            if (graphRef.current.hasEdge(edge)) {
              connectedEdges.push(edge);
              const connectedNodeId = source === nodeId ? target : source;
              connectedNodes.add(connectedNodeId);
            }
          }
        );

        setHighlightedRelationships(connectedEdges);
        setConnectedNodes(findConnectedNodes(nodeId));

        graphRef.current.forEachNode((node) => {
          const hidden = !connectedNodes.has(node);
          graphRef.current.setNodeAttribute(node, "hidden", hidden);
          if (!hidden) {
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
          const isConnected = connectedEdges.includes(edge);
          graphRef.current.setEdgeAttribute(edge, "hidden", !isConnected);
          if (isConnected) {
            graphRef.current.setEdgeAttribute(edge, "color", "#FF5722");
            graphRef.current.setEdgeAttribute(
              edge,
              "size",
              graphRef.current.getEdgeAttribute(edge, "size") * 2
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
            setProjectionName( data2.projectionName ); 
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

   
  const exportGraph = () => {
    if (!containerRef.current || !sigmaRef.current) return;

    try {
       
      if (graphRef.current) {
         
        const visibilityState = {};
        graphRef.current.forEachNode((node) => {
          visibilityState[node] =
            graphRef.current.getNodeAttribute(node, "hidden") || false;
          graphRef.current.setNodeAttribute(node, "hidden", false);
        });

        graphRef.current.forEachEdge((edge) => {
          visibilityState[edge] =
            graphRef.current.getEdgeAttribute(edge, "hidden") || false;
          graphRef.current.setEdgeAttribute(edge, "hidden", false);
        });

         
        sigmaRef.current.refresh();

         
        const canvas = containerRef.current.querySelector(".sigma-scene");

        if (canvas) {
           
          const exportCanvas = document.createElement("canvas");
          exportCanvas.width = canvas.width;
          exportCanvas.height = canvas.height;

           
          const ctx = exportCanvas.getContext("2d");
          ctx.fillStyle = isDarkMode ? "#1a1a1a" : "#f5f5f7";
          ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          ctx.drawImage(canvas, 0, 0);

           
          exportCanvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `knowledge-graph-${language}.png`;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);

               
              Object.keys(visibilityState).forEach((key) => {
                if (graphRef.current.hasNode(key)) {
                  graphRef.current.setNodeAttribute(
                    key,
                    "hidden",
                    visibilityState[key]
                  );
                } else if (graphRef.current.hasEdge(key)) {
                  graphRef.current.setEdgeAttribute(
                    key,
                    "hidden",
                    visibilityState[key]
                  );
                }
              });

               
              sigmaRef.current.refresh();
            }
          }, "image/png");
        } else {
          console.error("Could not find sigma canvas element");
        }
      }
    } catch (err) {
      console.error("Error exporting graph:", err);
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
            x: Math.random(),
            y: Math.random(),
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
            gravity: 0.5,  
            strongGravityMode: false,
            scalingRatio: 120,  
            slowDown: 3,  
            linLogMode: true,
            outboundAttractionDistribution: true,
            edgeWeightInfluence: 5,  
            barnesHutOptimize: true,
            barnesHutTheta: 0.8,
          },
          iterations: 600,  
        });

         
        graph.forEachNode((nodeId) => {
          const nodeType = graph.getNodeAttribute(nodeId, "nodeType");
          if (nodeType === "category") {
             
            const x = graph.getNodeAttribute(nodeId, "x");
            const y = graph.getNodeAttribute(nodeId, "y");
            graph.setNodeAttribute(nodeId, "x", x * 3.0);  
            graph.setNodeAttribute(nodeId, "y", y * 3.0);  

             
            graph.setNodeAttribute(nodeId, "size", 30);  
          }
        });

         
        graph.forEachNode((nodeId) => {
          const nodeType = graph.getNodeAttribute(nodeId, "nodeType");
          if (nodeType === "definition") {
             
            const x = graph.getNodeAttribute(nodeId, "x");
            const y = graph.getNodeAttribute(nodeId, "y");

             
            graph.setNodeAttribute(nodeId, "x", x * 1.8);
            graph.setNodeAttribute(nodeId, "y", y * 1.8);
          }
        });
      } catch (err) {
        console.error("Error applying force layout:", err);
      }

       
      const renderer = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: false,
        allowInvalidContainer: true,
        labelRenderedSizeThreshold: 1,
        labelFont: "Roboto, sans-serif",
        minCameraRatio: 0.1,  
        maxCameraRatio: 20,  
        labelColor: {
          color: isDarkMode ? "#ffffff" : "#333333",
        },
        defaultEdgeColor: "#e0e0e0",
        defaultEdgeType: "arrow",
        labelSize: 14,
        labelWeight: "normal",
        defaultNodeBorderWidth: 1,
        edgeLabelSize: 12,
        stagePadding: 50,  
        nodeReducer: (node, data) => {
          try {
            const res = { ...data };

             
            if (data.hidden) {
              return { ...data, hidden: true };
            }

             
            if (data.grayed) {
              res.color = isDarkMode ? "#555555" : "#cccccc";
              res.borderColor = isDarkMode ? "#444444" : "#dddddd";
            }

             
            if (data.nodeType === "category") {
              res.size = data.size * 1.5;  
               
              res.borderColor = isDarkMode ? "#ffffff" : "#333333";
              res.borderWidth = 2;
            } else if (data.nodeType === "term") {
              res.size = data.size * 1.2;  
              res.borderColor = isDarkMode ? "#555555" : "#dddddd";
              res.borderWidth = 1;
            } else if (data.nodeType === "definition") {
              res.size = data.size * 0.8;  
            }

             
            if (selectedNode && node === selectedNode.id) {
              res.highlighted = true;
              res.color = nodeColors.term.selected;
              res.borderColor = isDarkMode ? "#ffffff" : "#333333";
              res.borderWidth = 2;
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
              { ...state, ratio: state.ratio / 5 },
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
           
          const nodeAttributes = graphRef.current.getNodeAttributes(node);

           
          const tooltip = document.createElement("div");
          tooltip.className = "sigma-tooltip";
          tooltip.innerHTML = `<b>${nodeAttributes.label}</b><br/>Type: ${nodeAttributes.nodeType}`;

           
          const x = renderer.getNodeDisplayData(node).x;
          const y = renderer.getNodeDisplayData(node).y;
          tooltip.style.left = `${x + 15}px`;
          tooltip.style.top = `${y + 15}px`;

           
          containerRef.current.appendChild(tooltip);

           
          graphRef.current.setNodeAttribute(node, "tooltip", tooltip);

           
          const connectedNodes = new Set([node]);
          const connectedEdges = new Set();

           
          graphRef.current.forEachEdge(
            node,
            (edge, attributes, source, target) => {
              const connectedNode = source === node ? target : source;
              connectedNodes.add(connectedNode);
              connectedEdges.add(edge);
            }
          );

           
          graphRef.current.forEachNode((n) => {
            if (!connectedNodes.has(n)) {
               
              graphRef.current.setNodeAttribute(
                n,
                "originalHidden",
                graphRef.current.getNodeAttribute(n, "hidden") || false
              );
              graphRef.current.setNodeAttribute(n, "hidden", true);
            } else if (n !== node) {
               
              graphRef.current.setNodeAttribute(
                n,
                "originalColor",
                graphRef.current.getNodeAttribute(n, "color")
              );
            }
          });

          graphRef.current.forEachEdge((edge) => {
            if (!connectedEdges.has(edge)) {
               
              graphRef.current.setEdgeAttribute(
                edge,
                "originalHidden",
                graphRef.current.getEdgeAttribute(edge, "hidden") || false
              );
              graphRef.current.setEdgeAttribute(edge, "hidden", true);
            } else {
               
              graphRef.current.setEdgeAttribute(
                edge,
                "originalColor",
                graphRef.current.getEdgeAttribute(edge, "color")
              );
              graphRef.current.setEdgeAttribute(edge, "color", "#FF5722");
              graphRef.current.setEdgeAttribute(
                edge,
                "originalSize",
                graphRef.current.getEdgeAttribute(edge, "size")
              );
              graphRef.current.setEdgeAttribute(
                edge,
                "size",
                graphRef.current.getEdgeAttribute(edge, "size") * 1.5
              );
            }
          });

           
          renderer.refresh();
        })
         
        .on("leaveNode", ({ node }) => {
          try {
             
            const tooltip = graphRef.current.getNodeAttribute(node, "tooltip");
            if (tooltip) {
              try {
                if (tooltip.parentNode) {
                  tooltip.parentNode.removeChild(tooltip);
                }
              } catch (tooltipErr) {
                console.error("Error removing tooltip:", tooltipErr);
              }
              graphRef.current.setNodeAttribute(node, "tooltip", null);
            }

             
            graphRef.current.forEachNode((n) => {
              try {
                const originalHidden = graphRef.current.getNodeAttribute(
                  n,
                  "originalHidden"
                );
                if (originalHidden !== undefined) {
                  graphRef.current.setNodeAttribute(
                    n,
                    "hidden",
                    originalHidden
                  );
                  graphRef.current.removeNodeAttribute(n, "originalHidden");
                }

                const originalColor = graphRef.current.getNodeAttribute(
                  n,
                  "originalColor"
                );
                if (originalColor) {
                  graphRef.current.setNodeAttribute(n, "color", originalColor);
                  graphRef.current.removeNodeAttribute(n, "originalColor");
                }
              } catch (nodeErr) {
                console.error(`Error restoring node ${n} attributes:`, nodeErr);
              }
            });

            graphRef.current.forEachEdge((edge) => {
              try {
                const originalHidden = graphRef.current.getEdgeAttribute(
                  edge,
                  "originalHidden"
                );
                if (originalHidden !== undefined) {
                  graphRef.current.setEdgeAttribute(
                    edge,
                    "hidden",
                    originalHidden
                  );
                  graphRef.current.removeEdgeAttribute(edge, "originalHidden");
                }

                const originalColor = graphRef.current.getEdgeAttribute(
                  edge,
                  "originalColor"
                );
                if (originalColor) {
                  graphRef.current.setEdgeAttribute(
                    edge,
                    "color",
                    originalColor
                  );
                  graphRef.current.removeEdgeAttribute(edge, "originalColor");
                }

                const originalSize = graphRef.current.getEdgeAttribute(
                  edge,
                  "originalSize"
                );
                if (originalSize) {
                  graphRef.current.setEdgeAttribute(edge, "size", originalSize);
                  graphRef.current.removeEdgeAttribute(edge, "originalSize");
                }
              } catch (edgeErr) {
                console.error(
                  `Error restoring edge ${edge} attributes:`,
                  edgeErr
                );
              }
            });

             
            renderer.refresh();
          } catch (err) {
            console.error("Error in leaveNode handler:", err);
          }
        });

       
      if (isDarkMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }

       
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
  }, [filteredGraphData, containerRef, isDarkMode, selectedNode, applyFilters]);

   
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

   
  useEffect(() => {
    if (!graphData.nodes.length) return;

    if (searchQuery.trim() === "") {
      setFilteredGraphData(graphData);
    } else {
      const filteredNodes = graphData.nodes.filter((node) =>
        node.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));
      const filteredRelationships = graphData.relationships.filter(
        (rel) =>
          filteredNodeIds.has(rel.source) && filteredNodeIds.has(rel.target)
      );
      setFilteredGraphData({
        nodes: filteredNodes,
        relationships: filteredRelationships,
      });
    }
  }, [searchQuery, graphData]);

   
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
    <div className={`graph-visualization ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="controls">
        <div className="search-bar">
          <Search className="icon" />
          <input
            type="search"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={handleSearch}
          />
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
          <button onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="icon" /> : <Moon className="icon" />}
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
          <h2>{selectedNode.label}</h2>
          <p>
            <b>Type:</b> {selectedNode.nodeType}
          </p>
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
        </div>
      )}

      {showLegend && (
        <GraphLegend
          categories={categories[language] || categories.english}
          nodeColors={nodeColors}
        />
      )}
    </div>
  );
};

export default GraphVisualization;
