<<<<<<< Updated upstream
// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import { getAllterms } from "../../services/Api";
// import "./GraphVisualization.css";

// // Import graph libraries
// import Graph from "graphology";
// import Sigma from "sigma";
// import forceAtlas2 from "graphology-layout-forceatlas2";
// import { circular } from "graphology-layout";
// import noverlap from "graphology-layout-noverlap";

// import {
//   Search,
//   ZoomIn,
//   ZoomOut,
//   RefreshCw,
//   Maximize,
//   Minimize,
//   Info,
//   Download,
//   Sun,
//   Moon,
//   Filter,
//   X,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";

// // Import the GraphLegend component
// import GraphLegend from "./GraphExport";

// const GraphVisualization = ({ language = "english" }) => {
//   const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [highlightedRelationships, setHighlightedRelationships] = useState([]);
//   const [isPanelOpen, setIsPanelOpen] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filteredGraphData, setFilteredGraphData] = useState({
//     nodes: [],
//     relationships: [],
//   });
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isLayoutRunning, setIsLayoutRunning] = useState(false);
//   const [showLegend, setShowLegend] = useState(false);

//   // Add state for drag-and-drop functionality
//   const [draggedNode, setDraggedNode] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [connectedNodes, setConnectedNodes] = useState([]);

//   // Add state for filters
//   const [showFilters, setShowFilters] = useState(false);
//   const [nodeTypeFilters, setNodeTypeFilters] = useState({
//     term: true,
//     definition: true,
//     category: true,
//   });
//   const [categoryFilters, setCategoryFilters] = useState({});
//   const [showCategoryFilters, setShowCategoryFilters] = useState(false);
//   const [showNodeTypeFilters, setShowNodeTypeFilters] = useState(false);
//   const [clusterByCategory, setClusterByCategory] = useState(false);

//   // Refs for Sigma.js
//   const containerRef = useRef(null);
//   const sigmaRef = useRef(null);
//   const graphRef = useRef(null);
//   const lastClickedNodeRef = useRef(null);
//   const lastClickTimeRef = useRef(0);

//   // Define categories with proper capitalization
//   const categories = {
//     english: [
//       "Computer Crime",
//       "Personal Data",
//       "Electronic Commerce",
//       "Organization",
//       "Networks",
//       "Intellectual Property",
//       "Miscellaneous",
//       "Computer Science",
//     ],
//     french: [
//       "Criminalité informatique",
//       "Données personnelles",
//       "Commerce électronique",
//       "Organisation",
//       "Réseaux",
//       "Propriété intellectuelle",
//       "Divers",
//       "Informatique",
//     ],
//     arabic: [
//       "جرائم الكمبيوتر",
//       "البيانات الشخصية",
//       "التجارة الإلكترونية",
//       "التنظيم",
//       "الشبكات",
//       "الملكية الفكرية",
//       "متنوع",
//       "علوم الكمبيوتر",
//     ],
//   };

//   // Update the node colors to be more vibrant and distinct
//   const nodeColors = {
//     term: {
//       default: "#8B5CF6", // Purple for terms
//       selected: "#FF5722", // Orange for selected
//       grayed: "#D1C4E9", // Light purple for grayed out terms
//     },
//     definition: {
//       primary: "#3B82F6", // Blue for primary definitions
//       secondary: "#EC4899", // Pink for secondary definitions
//       selected: "#FF5722", // Orange for selected
//       grayed: "#BBDEFB", // Light blue for grayed out definitions
//     },
//     category: {
//       "Computer Crime": "#EF4444", // Red
//       "Personal Data": "#EC4899", // Pink
//       "Electronic Commerce": "#10B981", // Green
//       Organization: "#F59E0B", // Yellow
//       Networks: "#3B82F6", // Blue
//       "Intellectual Property": "#8B5CF6", // Purple
//       Miscellaneous: "#6366F1", // Indigo
//       "Computer Science": "#06B6D4", // Cyan
//       // French translations
//       "Criminalité informatique": "#EF4444",
//       "Données personnelles": "#EC4899",
//       "Commerce électronique": "#10B981",
//       Organisation: "#F59E0B",
//       Réseaux: "#3B82F6",
//       "Propriété intellectuelle": "#8B5CF6",
//       Divers: "#6366F1",
//       Informatique: "#06B6D4",
//       // Arabic translations
//       "جرائم الكمبيوتر": "#EF4444",
//       "البيانات الشخصية": "#EC4899",
//       "التجارة الإلكترونية": "#10B981",
//       التنظيم: "#F59E0B",
//       الشبكات: "#3B82F6",
//       "الملكية الفكرية": "#8B5CF6",
//       متنوع: "#6366F1",
//       "علوم الكمبيوتر": "#06B6D4",
//       grayed: "#E5E5E5", // Light gray for grayed out categories
//     },
//   };

//   // Add category emojis
//   const categoryEmojis = {
//     "Computer Crime": "🔒",
//     "Personal Data": "👤",
//     "Electronic Commerce": "🛒",
//     Organization: "🏢",
//     Networks: "🌐",
//     "Intellectual Property": "©️",
//     Miscellaneous: "📦",
//     "Computer Science": "💻",
//     // French translations
//     "Criminalité informatique": "🔒",
//     "Données personnelles": "👤",
//     "Commerce électronique": "🛒",
//     Organisation: "🏢",
//     Réseaux: "🌐",
//     "Propriété intellectuelle": "©️",
//     Divers: "📦",
//     Informatique: "💻",
//     // Arabic translations
//     "جرائم الكمبيوتر": "🔒",
//     "البيانات الشخصية": "👤",
//     "التجارة الإلكترونية": "🛒",
//     التنظيم: "🏢",
//     الشبكات: "🌐",
//     "الملكية الفكرية": "©️",
//     متنوع: "📦",
//     "علوم الكمبيوتر": "💻",
//   };

//   // Map language prop to API language code
//   const getLanguageCode = useCallback(() => {
//     switch (language) {
//       case "english":
//         return "en";
//       case "french":
//         return "fr";
//       case "arabic":
//         return "ar";
//       default:
//         return "en";
//     }
//   }, [language]);

//   // Toggle dark/light mode
//   const toggleDarkMode = useCallback(() => {
//     setIsDarkMode((prev) => !prev);
//   }, []);

//   // Toggle legend visibility
//   const toggleLegend = useCallback(() => {
//     setShowLegend((prev) => !prev);
//   }, []);

//   // Toggle filters panel
//   const toggleFilters = useCallback(() => {
//     setShowFilters((prev) => !prev);
//   }, []);

//   // Initialize category filters when categories are available
//   useEffect(() => {
//     const currentCategories = categories[language] || categories.english;
//     const initialCategoryFilters = {};

//     currentCategories.forEach((category) => {
//       initialCategoryFilters[category] = true;
//     });

//     setCategoryFilters(initialCategoryFilters);
//   }, [language]);

//   // Fetch data and transform it into graph structure
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         setSelectedNode(null);
//         setHighlightedRelationships([]);
//         lastClickedNodeRef.current = null;

//         const languageCode = getLanguageCode();
//         const termsData = await getAllterms(languageCode);

//         if (!termsData || termsData.length === 0) {
//           throw new Error("No data received from API");
//         }

//         // Transform API data into graph structure
//         const graphStructure = transformDataToGraph(termsData, languageCode);
//         setGraphData(graphStructure);
//         setFilteredGraphData(graphStructure);
//         setIsLoading(false);
//       } catch (err) {
//         console.error("Error fetching graph data:", err);
//         setError(
//           "Failed to load knowledge graph data. Please try again later."
//         );
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [language, getLanguageCode]);

//   // Transform API data to focus on terms, definitions, and categories
//   const transformDataToGraph = (termsData, languageCode) => {
//     const nodes = [];
//     const relationships = [];
//     const categoryNodes = new Map();
//     const nodeIds = new Set();

//     // Get the appropriate category list for the current language
//     const categoryList = categories[language] || categories.english;

//     // Create category nodes first
//     categoryList.forEach((category, index) => {
//       const categoryId = `cat-${index}`;

//       // Skip if this category ID already exists
//       if (nodeIds.has(categoryId)) return;

//       // Add emoji to category label
//       const emoji = categoryEmojis[category] || "";
//       const labelWithEmoji = `${emoji} ${category}`;

//       const categoryNode = {
//         id: categoryId,
//         label: labelWithEmoji,
//         originalLabel: category,
//         nodeType: "category",
//         language: languageCode,
//         size: 15,
//         color: nodeColors.category[category] || "#6366F1", // Use vibrant colors
//         category: category, // Store the category for filtering
//       };
//       nodes.push(categoryNode);
//       categoryNodes.set(category, categoryNode.id);
//       nodeIds.add(categoryId);
//     });

//     // Process terms and ensure unique IDs
//     termsData.forEach((term) => {
//       if (!term || !term.id) return; // Skip invalid terms

//       const termId = `term-${term.id}`;

//       // Skip if this term ID already exists
//       if (nodeIds.has(termId)) return;

//       // Add term node
//       const termNode = {
//         id: termId,
//         label: term.name || "Unnamed Term",
//         nodeType: "term",
//         language: languageCode,
//         size: 8,
//         color: nodeColors.term.default, // Purple for terms
//         categories: [], // Will store categories for filtering
//       };
//       nodes.push(termNode);
//       nodeIds.add(termId);

//       // Process definitions
//       if (term.definitions && term.definitions.length > 0) {
//         term.definitions.forEach((def, defIndex) => {
//           if (!def || def.language !== languageCode) return; // Skip invalid or wrong language definitions

//           const defId = `def-${term.id}-${defIndex}`;

//           // Skip if this definition ID already exists
//           if (nodeIds.has(defId)) return;

//           // Track categories for this definition
//           const defCategories = [];

//           // Add definition node
//           const defNode = {
//             id: defId,
//             label:
//               def.text && def.text.length > 50
//                 ? def.text.substring(0, 50) + "..."
//                 : def.text || "No definition",
//             fullText: def.text || "",
//             nodeType: "definition",
//             defType: def.type || "unknown",
//             references: def.references || "",
//             language: def.language,
//             size: 5,
//             color:
//               def.type === "primary"
//                 ? nodeColors.definition.primary
//                 : nodeColors.definition.secondary, // Blue for primary, Pink for secondary
//             categories: [], // Will store categories for filtering
//           };
//           nodes.push(defNode);
//           nodeIds.add(defId);

//           // Add relationship between term and definition
//           relationships.push({
//             id: `rel-term-def-${term.id}-${defIndex}`,
//             source: termNode.id,
//             target: defNode.id,
//             relType: "HAS_DEFINITION",
//             label: "HAS_DEFINITION",
//             color: "#4C8EDA", // Blue
//             size: 2,
//             weight: 0.2, // Add a low weight to increase distance
//           });

//           // Process categories
//           if (def.categories && def.categories.length > 0) {
//             def.categories.forEach((category) => {
//               if (!category) return; // Skip invalid categories

//               // Find the closest matching category from our predefined list
//               const matchedCategory = findClosestCategory(
//                 category,
//                 categoryList
//               );

//               if (matchedCategory && categoryNodes.has(matchedCategory)) {
//                 // Add category to definition's categories
//                 defNode.categories.push(matchedCategory);

//                 // Add category to term's categories if not already there
//                 if (!termNode.categories.includes(matchedCategory)) {
//                   termNode.categories.push(matchedCategory);
//                 }

//                 // Add relationship between definition and category
//                 relationships.push({
//                   id: `rel-def-cat-${term.id}-${defIndex}-${categoryNodes.get(
//                     matchedCategory
//                   )}`,
//                   source: defNode.id,
//                   target: categoryNodes.get(matchedCategory),
//                   relType: "BELONGS_TO",
//                   label: "BELONGS_TO",
//                   color: "#8DCC93", // Green
//                   size: 1,
//                 });

//                 // Add direct relationship between term and category for better visualization
//                 relationships.push({
//                   id: `rel-term-cat-${term.id}-${categoryNodes.get(
//                     matchedCategory
//                   )}`,
//                   source: termNode.id,
//                   target: categoryNodes.get(matchedCategory),
//                   relType: "BELONGS_TO",
//                   label: "BELONGS_TO",
//                   color: "#8DCC93", // Green
//                   size: 0.5, // Thinner line
//                 });
//               }
//             });
//           }

//           // Process related terms
//           if (def.relatedTerms && def.relatedTerms.length > 0) {
//             def.relatedTerms.forEach((relatedTerm, rtIndex) => {
//               if (
//                 !relatedTerm ||
//                 !relatedTerm.name ||
//                 !relatedTerm.id ||
//                 relatedTerm.id === "null"
//               )
//                 return;

//               const relatedTermId = `term-${relatedTerm.id}`;

//               // Only create relationship if the target term exists or will exist
//               if (
//                 nodeIds.has(relatedTermId) ||
//                 termsData.some((t) => t.id === relatedTerm.id)
//               ) {
//                 // Add relationship between terms
//                 relationships.push({
//                   id: `rel-term-term-${term.id}-${relatedTerm.id}-${rtIndex}`,
//                   source: termNode.id,
//                   target: relatedTermId,
//                   relType: "RELATED_TO",
//                   label: "RELATED_TO",
//                   color: "#FFC454", // Yellow
//                   size: 1.5,
//                 });
//               }
//             });
//           }
//         });
//       }
//     });

//     return { nodes, relationships };
//   };

//   // Find the closest matching category from our predefined list
//   const findClosestCategory = (category, categoryList) => {
//     if (!category) return categoryList[0];

//     // Direct match
//     if (categoryList.includes(category)) {
//       return category;
//     }

//     // Case insensitive match
//     const lowerCategory = category.toLowerCase();
//     for (const cat of categoryList) {
//       if (cat.toLowerCase() === lowerCategory) {
//         return cat;
//       }
//     }

//     // Partial match
//     for (const cat of categoryList) {
//       if (
//         cat.toLowerCase().includes(lowerCategory) ||
//         lowerCategory.includes(cat.toLowerCase())
//       ) {
//         return cat;
//       }
//     }

//     // Default to first category if no match found
//     return categoryList[0];
//   };

//   // Apply filters to the graph
//   const applyFilters = useCallback(() => {
//     if (!graphRef.current) return;

//     try {
//       // Apply node type filters
//       graphRef.current.forEachNode((nodeId) => {
//         const nodeType = graphRef.current.getNodeAttribute(nodeId, "nodeType");
//         const nodeCategories =
//           graphRef.current.getNodeAttribute(nodeId, "categories") || [];
//         const nodeCategory = graphRef.current.getNodeAttribute(
//           nodeId,
//           "category"
//         ); // For category nodes

//         // Check if node type is filtered
//         const isNodeTypeVisible = nodeTypeFilters[nodeType] || false;

//         // Check if node's categories are filtered (for terms and definitions)
//         let isCategoryVisible = true;
//         if (nodeType === "term" || nodeType === "definition") {
//           // If node has categories, check if any of them are visible
//           if (nodeCategories.length > 0) {
//             isCategoryVisible = nodeCategories.some(
//               (cat) => categoryFilters[cat]
//             );
//           }
//         } else if (nodeType === "category") {
//           // For category nodes, check if this specific category is visible
//           isCategoryVisible = categoryFilters[nodeCategory] || false;
//         }

//         // Node is visible only if both node type and category are visible
//         const isVisible = isNodeTypeVisible && isCategoryVisible;
//         graphRef.current.setNodeAttribute(nodeId, "hidden", !isVisible);
//       });

//       // Apply edge filters - only show edges between visible nodes
//       graphRef.current.forEachEdge((edgeId, attributes, source, target) => {
//         const isSourceVisible = !graphRef.current.getNodeAttribute(
//           source,
//           "hidden"
//         );
//         const isTargetVisible = !graphRef.current.getNodeAttribute(
//           target,
//           "hidden"
//         );
//         graphRef.current.setEdgeAttribute(
//           edgeId,
//           "hidden",
//           !(isSourceVisible && isTargetVisible)
//         );
//       });

//       // Apply clustering if enabled
//       if (clusterByCategory) {
//         applyClustering();
//       }

//       // Refresh the renderer
//       if (sigmaRef.current) {
//         sigmaRef.current.refresh();
//       }
//     } catch (err) {
//       console.error("Error applying filters:", err);
//     }
//   }, [nodeTypeFilters, categoryFilters, clusterByCategory]);

//   // Replace the cleanupTooltips function with this improved version
//   const cleanupTooltips = useCallback(() => {
//     try {
//       if (containerRef.current) {
//         // Find all tooltips
//         const tooltips =
//           containerRef.current.querySelectorAll(".sigma-tooltip");

//         // Safely remove each tooltip
//         tooltips.forEach((tooltip) => {
//           try {
//             if (tooltip && tooltip.parentNode) {
//               tooltip.parentNode.removeChild(tooltip);
//             }
//           } catch (err) {
//             console.error("Error removing individual tooltip:", err);
//           }
//         });

//         // Also check for tooltips stored in graph nodes
//         if (graphRef.current) {
//           graphRef.current.forEachNode((nodeId) => {
//             try {
//               const tooltip = graphRef.current.getNodeAttribute(
//                 nodeId,
//                 "tooltip"
//               );
//               if (tooltip) {
//                 if (tooltip.parentNode) {
//                   tooltip.parentNode.removeChild(tooltip);
//                 }
//                 graphRef.current.removeNodeAttribute(nodeId, "tooltip");
//               }
//             } catch (err) {
//               console.error(
//                 `Error cleaning up tooltip for node ${nodeId}:`,
//                 err
//               );
//             }
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Error in cleanupTooltips:", err);
//     }
//   }, []);

//   // Apply clustering by category
//   const applyClustering = useCallback(() => {
//     if (!graphRef.current || !sigmaRef.current) return;

//     try {
//       // Reset positions first
//       circular.assign(graphRef.current);

//       // Get visible category nodes
//       const visibleCategories = [];
//       graphRef.current.forEachNode((nodeId) => {
//         const nodeType = graphRef.current.getNodeAttribute(nodeId, "nodeType");
//         const isHidden = graphRef.current.getNodeAttribute(nodeId, "hidden");

//         if (nodeType === "category" && !isHidden) {
//           const category =
//             graphRef.current.getNodeAttribute(nodeId, "originalLabel") ||
//             graphRef.current.getNodeAttribute(nodeId, "category");
//           visibleCategories.push({
//             id: nodeId,
//             category: category,
//           });
//         }
//       });

//       // Position categories in a circle with a larger radius
//       const radius = 20; // Increased from 10 for more spacing
//       const angleStep = (2 * Math.PI) / visibleCategories.length;

//       visibleCategories.forEach((catNode, index) => {
//         const angle = index * angleStep;
//         const x = radius * Math.cos(angle);
//         const y = radius * Math.sin(angle);

//         graphRef.current.setNodeAttribute(catNode.id, "x", x);
//         graphRef.current.setNodeAttribute(catNode.id, "y", y);

//         // Position related nodes around their category with more spacing
//         graphRef.current.forEachNode((nodeId) => {
//           if (nodeId === catNode.id) return;

//           const nodeType = graphRef.current.getNodeAttribute(
//             nodeId,
//             "nodeType"
//           );
//           const isHidden = graphRef.current.getNodeAttribute(nodeId, "hidden");

//           if (isHidden) return;

//           if (nodeType === "term" || nodeType === "definition") {
//             const nodeCategories =
//               graphRef.current.getNodeAttribute(nodeId, "categories") || [];

//             // If this node belongs to this category
//             if (nodeCategories.includes(catNode.category)) {
//               // Position it near the category with some randomness and more distance
//               const nodeRadius = radius * 0.7; // Increased from 0.5 for more spacing
//               const nodeAngle = angle + (Math.random() * 0.8 - 0.4) * angleStep; // Wider angle spread
//               const nodeX = x + nodeRadius * Math.cos(nodeAngle);
//               const nodeY = y + nodeRadius * Math.sin(nodeAngle);

//               graphRef.current.setNodeAttribute(nodeId, "x", nodeX);
//               graphRef.current.setNodeAttribute(nodeId, "y", nodeY);
//             }
//           }
//         });
//       });

//       // Apply noverlap with more iterations to prevent node overlap
//       noverlap.assign(graphRef.current, { maxIterations: 100 }); // Increased from 50

//       // Refresh the renderer
//       sigmaRef.current.refresh();

//       // Center the camera with a wider view
//       sigmaRef.current.getCamera().animatedReset();

//       // Zoom out to see the whole graph
//       setTimeout(() => {
//         const camera = sigmaRef.current.getCamera();
//         const state = camera.getState();
//         camera.animate(
//           { ...state, ratio: state.ratio * 1.5 },
//           { duration: 300 }
//         );
//       }, 300);
//     } catch (err) {
//       console.error("Error applying clustering:", err);
//     }
//   }, []);

//   // Toggle clustering
//   const toggleClustering = useCallback(() => {
//     setClusterByCategory((prev) => {
//       const newValue = !prev;

//       // If enabling clustering, apply it immediately
//       if (newValue && graphRef.current && sigmaRef.current) {
//         applyClustering();
//       } else if (!newValue && graphRef.current && sigmaRef.current) {
//         // If disabling, reset to circular layout
//         circular.assign(graphRef.current);
//         sigmaRef.current.getCamera().animatedReset();
//         sigmaRef.current.refresh();
//       }

//       return newValue;
//     });
//   }, [applyClustering]);

//   // Apply filters when they change
//   useEffect(() => {
//     applyFilters();
//   }, [nodeTypeFilters, categoryFilters, clusterByCategory, applyFilters]);

//   // Handle search
//   const handleSearch = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);

//     if (!graphRef.current) return;

//     try {
//       if (query.trim() === "") {
//         // Reset all nodes and edges visibility
//         graphRef.current.forEachNode((node) => {
//           graphRef.current.setNodeAttribute(node, "hidden", false);

//           // Reset original colors
//           const nodeType = graphRef.current.getNodeAttribute(node, "nodeType");
//           if (nodeType === "term") {
//             graphRef.current.setNodeAttribute(
//               node,
//               "color",
//               nodeColors.term.default
//             );
//           } else if (nodeType === "definition") {
//             const defType = graphRef.current.getNodeAttribute(node, "defType");
//             graphRef.current.setNodeAttribute(
//               node,
//               "color",
//               defType === "primary"
//                 ? nodeColors.definition.primary
//                 : nodeColors.definition.secondary
//             );
//           } else if (nodeType === "category") {
//             const label =
//               graphRef.current.getNodeAttribute(node, "originalLabel") ||
//               graphRef.current.getNodeAttribute(node, "label");
//             graphRef.current.setNodeAttribute(
//               node,
//               "color",
//               nodeColors.category[label] || "#6366F1"
//             );
//           }
//         });

//         graphRef.current.forEachEdge((edge) => {
//           graphRef.current.setEdgeAttribute(edge, "hidden", false);
//           // Reset edge colors
//           const relType = graphRef.current.getEdgeAttribute(edge, "relType");
//           if (relType === "HAS_DEFINITION") {
//             graphRef.current.setEdgeAttribute(edge, "color", "#4C8EDA");
//           } else if (relType === "BELONGS_TO") {
//             graphRef.current.setEdgeAttribute(edge, "color", "#8DCC93");
//           } else if (relType === "RELATED_TO") {
//             graphRef.current.setEdgeAttribute(edge, "color", "#FFC454");
//           }
//         });

//         // Re-apply filters
//         applyFilters();
//       } else {
//         // First, hide all nodes and edges
//         graphRef.current.forEachNode((node) => {
//           graphRef.current.setNodeAttribute(node, "hidden", true);
//         });
//         graphRef.current.forEachEdge((edge) => {
//           graphRef.current.setEdgeAttribute(edge, "hidden", true);
//         });

//         // Find matching nodes
//         const matchingNodes = new Set();
//         const directlyConnectedNodes = new Set();
//         const relevantEdges = new Set();

//         // First pass: find matching nodes
//         graphRef.current.forEachNode((node) => {
//           try {
//             const label = (
//               graphRef.current.getNodeAttribute(node, "label") || ""
//             ).toLowerCase();
//             const originalLabel = (
//               graphRef.current.getNodeAttribute(node, "originalLabel") || ""
//             ).toLowerCase();

//             if (label.includes(query) || originalLabel.includes(query)) {
//               matchingNodes.add(node);
//               graphRef.current.setNodeAttribute(node, "hidden", false);
//             }
//           } catch (err) {
//             console.error("Error processing node during search:", err);
//           }
//         });

//         // Second pass: find all directly connected nodes and edges
//         matchingNodes.forEach((nodeId) => {
//           try {
//             graphRef.current.forEachEdge(
//               nodeId,
//               (edge, attributes, source, target) => {
//                 const connectedNodeId = source === nodeId ? target : source;

//                 // Add connected node and edge to our sets
//                 directlyConnectedNodes.add(connectedNodeId);
//                 relevantEdges.add(edge);

//                 // Make them visible
//                 graphRef.current.setNodeAttribute(
//                   connectedNodeId,
//                   "hidden",
//                   false
//                 );
//                 graphRef.current.setEdgeAttribute(edge, "hidden", false);
//               }
//             );
//           } catch (err) {
//             console.error("Error processing connections during search:", err);
//           }
//         });

//         // Highlight matching nodes
//         matchingNodes.forEach((nodeId) => {
//           graphRef.current.setNodeAttribute(
//             nodeId,
//             "color",
//             nodeColors.term.selected
//           );
//         });
//       }

//       // Refresh the renderer
//       if (sigmaRef.current) {
//         sigmaRef.current.refresh();
//       }
//     } catch (err) {
//       console.error("Error during search:", err);
//     }
//   };

//   // Add this function after handleNodeClick to implement node dragging
//   const handleNodeDrag = (nodeId, event) => {
//     if (!graphRef.current || !sigmaRef.current) return;

//     try {
//       // Get new position of node in graph coordinates
//       const pos = sigmaRef.current.viewportToGraph({
//         x: event.clientX,
//         y: event.clientY,
//       });

//       // Update node position
//       graphRef.current.setNodeAttribute(nodeId, "x", pos.x);
//       graphRef.current.setNodeAttribute(nodeId, "y", pos.y);

//       // Refresh the renderer
//       sigmaRef.current.refresh();
//     } catch (err) {
//       console.error("Error during node drag:", err);
//     }
//   };

//   // Add this function to find and set connected nodes for the info panel
//   const findConnectedNodes = (nodeId) => {
//     if (!graphRef.current || !nodeId) return [];

//     const connected = [];

//     try {
//       // First collect all directly connected nodes
//       graphRef.current.forEachEdge(
//         nodeId,
//         (edge, attributes, source, target) => {
//           const connectedNodeId = source === nodeId ? target : source;
//           if (graphRef.current.hasNode(connectedNodeId)) {
//             const nodeAttrs =
//               graphRef.current.getNodeAttributes(connectedNodeId);
//             connected.push({
//               id: connectedNodeId,
//               label: nodeAttrs.label || "",
//               nodeType: nodeAttrs.nodeType || "",
//               relType: attributes.relType || "unknown",
//               color: nodeAttrs.color || "#cccccc",
//               // Add additional information for better organization
//               defType: nodeAttrs.defType || "",
//               fullText: nodeAttrs.fullText || "",
//               originalLabel: nodeAttrs.originalLabel || "",
//             });
//           }
//         }
//       );
//     } catch (err) {
//       console.error("Error finding connected nodes:", err);
//     }

//     // Sort connected nodes by relationship type first, then by node type
//     return connected.sort((a, b) => {
//       // First sort by relationship type
//       const relOrder = { HAS_DEFINITION: 1, BELONGS_TO: 2, RELATED_TO: 3 };
//       if (a.relType !== b.relType) {
//         return relOrder[a.relType] - relOrder[b.relType];
//       }

//       // Then sort by node type
//       const typeOrder = { term: 1, definition: 2, category: 3 };
//       return typeOrder[a.nodeType] - typeOrder[b.nodeType];
//     });
//   };

//   // Function to navigate to a connected node
//   const navigateToNode = (nodeId) => {
//     if (!graphRef.current || !sigmaRef.current) return;

//     // Handle node click to select the node
//     handleNodeClick(nodeId);

//     // Center the camera on the node
//     const nodePosition = sigmaRef.current.getNodeDisplayData(nodeId);
//     if (nodePosition) {
//       sigmaRef.current
//         .getCamera()
//         .animate(
//           { x: nodePosition.x, y: nodePosition.y, ratio: 0.5 },
//           { duration: 500 }
//         );
//     }
//   };

//   // Modify handleNodeClick to also set connected nodes
//   const handleNodeClick = (nodeId) => {
//     try {
//       if (!graphRef.current) return;

//       // Check if the node exists in the graph
//       if (!graphRef.current.hasNode(nodeId)) {
//         console.warn(`Node ${nodeId} not found in graph`);
//         return;
//       }

//       // Toggle behavior - if clicking the same node, deselect it
//       if (lastClickedNodeRef.current === nodeId) {
//         // Deselect the node
//         setSelectedNode(null);
//         setHighlightedRelationships([]);
//         setConnectedNodes([]);
//         lastClickedNodeRef.current = null;

//         // Reset all nodes and edges to their original appearance
//         graphRef.current.forEachNode((node) => {
//           graphRef.current.setNodeAttribute(node, "hidden", false);
//           const nodeType = graphRef.current.getNodeAttribute(node, "nodeType");
//           if (nodeType === "term") {
//             graphRef.current.setNodeAttribute(
//               node,
//               "color",
//               nodeColors.term.default
//             );
//           } else if (nodeType === "definition") {
//             const defType = graphRef.current.getNodeAttribute(node, "defType");
//             graphRef.current.setNodeAttribute(
//               node,
//               "color",
//               defType === "primary"
//                 ? nodeColors.definition.primary
//                 : nodeColors.definition.secondary
//             );
//           } else if (nodeType === "category") {
//             const label =
//               graphRef.current.getNodeAttribute(node, "originalLabel") ||
//               graphRef.current.getNodeAttribute(node, "label");
//             graphRef.current.setNodeAttribute(
//               node,
//               "color",
//               nodeColors.category[label] || "#6366F1"
//             );
//           }
//         });

//         graphRef.current.forEachEdge((edge) => {
//           graphRef.current.setEdgeAttribute(edge, "hidden", false);
//           // Reset edge colors
//           const relType = graphRef.current.getEdgeAttribute(edge, "relType");
//           if (relType === "HAS_DEFINITION") {
//             graphRef.current.setEdgeAttribute(edge, "color", "#4C8EDA");
//           } else if (relType === "BELONGS_TO") {
//             graphRef.current.setEdgeAttribute(edge, "color", "#8DCC93");
//           } else if (relType === "RELATED_TO") {
//             graphRef.current.setEdgeAttribute(edge, "color", "#FFC454");
//           }
//         });

//         // Re-apply filters
//         applyFilters();
//       } else {
//         // Select the new node
//         const nodeAttributes = graphRef.current.getNodeAttributes(nodeId);

//         // Create a new object instead of spreading to avoid reference issues
//         const node = {
//           id: nodeId,
//           label: nodeAttributes.label || "",
//           nodeType: nodeAttributes.nodeType || "",
//           color: nodeAttributes.color || "",
//           size: nodeAttributes.size || 0,
//           language: nodeAttributes.language || "",
//           defType: nodeAttributes.defType || "",
//           references: nodeAttributes.references || "",
//           fullText: nodeAttributes.fullText || "",
//           originalLabel: nodeAttributes.originalLabel || "",
//           categories: nodeAttributes.categories || [],
//           category: nodeAttributes.category || "",
//         };

//         setSelectedNode(node);
//         lastClickedNodeRef.current = nodeId;

//         // Find connected relationships safely
//         const connectedEdges = [];
//         const connectedNodes = new Set([nodeId]);

//         try {
//           graphRef.current.forEachEdge(
//             nodeId,
//             (edge, attributes, source, target) => {
//               if (graphRef.current.hasEdge(edge)) {
//                 connectedEdges.push(edge);

//                 // Add the connected node to our set
//                 const connectedNodeId = source === nodeId ? target : source;
//                 connectedNodes.add(connectedNodeId);
//               }
//             }
//           );
//         } catch (err) {
//           console.error("Error finding connected edges:", err);
//         }

//         setHighlightedRelationships(connectedEdges);

//         // Set connected nodes for the info panel
//         setConnectedNodes(findConnectedNodes(nodeId));

//         // Hide all nodes and edges except the selected node and its connections
//         graphRef.current.forEachNode((node) => {
//           if (!connectedNodes.has(node)) {
//             graphRef.current.setNodeAttribute(node, "hidden", true);
//           } else {
//             graphRef.current.setNodeAttribute(node, "hidden", false);

//             if (node === nodeId) {
//               // Highlight the selected node
//               graphRef.current.setNodeAttribute(
//                 node,
//                 "color",
//                 nodeColors.term.selected
//               );
//             } else {
//               // Keep original colors for connected nodes
//               const nodeType = graphRef.current.getNodeAttribute(
//                 node,
//                 "nodeType"
//               );
//               if (nodeType === "term") {
//                 graphRef.current.setNodeAttribute(
//                   node,
//                   "color",
//                   nodeColors.term.default
//                 );
//               } else if (nodeType === "definition") {
//                 const defType = graphRef.current.getNodeAttribute(
//                   node,
//                   "defType"
//                 );
//                 graphRef.current.setNodeAttribute(
//                   node,
//                   "color",
//                   defType === "primary"
//                     ? nodeColors.definition.primary
//                     : nodeColors.definition.secondary
//                 );
//               } else if (nodeType === "category") {
//                 const label =
//                   graphRef.current.getNodeAttribute(node, "originalLabel") ||
//                   graphRef.current.getNodeAttribute(node, "label");
//                 graphRef.current.setNodeAttribute(
//                   node,
//                   "color",
//                   nodeColors.category[label] || "#6366F1"
//                 );
//               }
//             }
//           }
//         });

//         graphRef.current.forEachEdge((edge) => {
//           if (connectedEdges.includes(edge)) {
//             // Show and highlight connected edges
//             graphRef.current.setEdgeAttribute(edge, "hidden", false);
//             graphRef.current.setEdgeAttribute(edge, "color", "#FF5722");
//             graphRef.current.setEdgeAttribute(
//               edge,
//               "size",
//               graphRef.current.getEdgeAttribute(edge, "size") * 2
//             );
//           } else {
//             // Hide all other edges
//             graphRef.current.setEdgeAttribute(edge, "hidden", true);
//           }
//         });
//       }

//       // Refresh the renderer safely
//       if (sigmaRef.current) {
//         try {
//           sigmaRef.current.refresh();
//         } catch (err) {
//           console.error("Error refreshing sigma after node click:", err);
//         }
//       }
//     } catch (err) {
//       console.error("Error handling node click:", err);
//     }
//   };

//   // Enhance the exportGraph function to fix download issues
//   const exportGraph = () => {
//     if (!containerRef.current || !sigmaRef.current) return;

//     try {
//       // First, make all nodes and edges visible for the screenshot
//       if (graphRef.current) {
//         // Store current visibility state
//         const visibilityState = {};
//         graphRef.current.forEachNode((node) => {
//           visibilityState[node] =
//             graphRef.current.getNodeAttribute(node, "hidden") || false;
//           graphRef.current.setNodeAttribute(node, "hidden", false);
//         });

//         graphRef.current.forEachEdge((edge) => {
//           visibilityState[edge] =
//             graphRef.current.getEdgeAttribute(edge, "hidden") || false;
//           graphRef.current.setEdgeAttribute(edge, "hidden", false);
//         });

//         // Refresh to show all nodes
//         sigmaRef.current.refresh();

//         // Get the sigma canvas element
//         const canvas = containerRef.current.querySelector(".sigma-scene");

//         if (canvas) {
//           // Create a new canvas with the same dimensions
//           const exportCanvas = document.createElement("canvas");
//           exportCanvas.width = canvas.width;
//           exportCanvas.height = canvas.height;

//           // Draw the sigma canvas onto our export canvas
//           const ctx = exportCanvas.getContext("2d");
//           ctx.fillStyle = isDarkMode ? "#1a1a1a" : "#f5f5f7";
//           ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
//           ctx.drawImage(canvas, 0, 0);

//           // Convert to image and download
//           exportCanvas.toBlob((blob) => {
//             if (blob) {
//               const url = URL.createObjectURL(blob);
//               const link = document.createElement("a");
//               link.download = `knowledge-graph-${language}.png`;
//               link.href = url;
//               link.click();
//               URL.revokeObjectURL(url);

//               // Restore visibility state
//               Object.keys(visibilityState).forEach((key) => {
//                 if (graphRef.current.hasNode(key)) {
//                   graphRef.current.setNodeAttribute(
//                     key,
//                     "hidden",
//                     visibilityState[key]
//                   );
//                 } else if (graphRef.current.hasEdge(key)) {
//                   graphRef.current.setEdgeAttribute(
//                     key,
//                     "hidden",
//                     visibilityState[key]
//                   );
//                 }
//               });

//               // Refresh to restore original view
//               sigmaRef.current.refresh();
//             }
//           }, "image/png");
//         } else {
//           console.error("Could not find sigma canvas element");
//         }
//       }
//     } catch (err) {
//       console.error("Error exporting graph:", err);
//     }
//   };

//   // Initialize Sigma.js
//   useEffect(() => {
//     if (
//       isLoading ||
//       error ||
//       !filteredGraphData.nodes.length ||
//       !containerRef.current
//     )
//       return;

//     // Clean up previous instance
//     if (sigmaRef.current) {
//       try {
//         sigmaRef.current.kill();
//       } catch (err) {
//         console.error("Error killing previous Sigma instance:", err);
//       }
//       sigmaRef.current = null;
//     }

//     // Clean up any lingering tooltips
//     cleanupTooltips();

//     try {
//       // Create a new graph
//       const graph = new Graph();
//       graphRef.current = graph;

//       // Track added nodes to prevent duplicates
//       const addedNodes = new Set();

//       // Add nodes
//       filteredGraphData.nodes.forEach((node) => {
//         try {
//           // Skip if node already exists or has no ID
//           if (!node.id || addedNodes.has(node.id)) {
//             console.warn(`Skipping duplicate or invalid node: ${node.id}`);
//             return;
//           }

//           graph.addNode(node.id, {
//             label: node.label || "",
//             x: Math.random(),
//             y: Math.random(),
//             size: node.size || 5,
//             color: node.color || "#cccccc",
//             nodeType: node.nodeType || "unknown",
//             language: node.language || "",
//             defType: node.defType || "",
//             references: node.references || "",
//             fullText: node.fullText || "",
//             grayed: false, // Add grayed state for highlighting
//             hidden: false, // Add hidden state for filtering
//             categories: node.categories || [], // For filtering
//             category: node.category || "", // For category nodes
//             originalLabel: node.originalLabel || "",
//           });

//           // Track added node
//           addedNodes.add(node.id);
//         } catch (err) {
//           console.error(`Error adding node ${node.id}:`, err);
//         }
//       });

//       // Add edges
//       filteredGraphData.relationships.forEach((rel) => {
//         try {
//           // Check if both source and target nodes exist
//           if (
//             !rel.source ||
//             !rel.target ||
//             !graph.hasNode(rel.source) ||
//             !graph.hasNode(rel.target)
//           ) {
//             return;
//           }

//           // Avoid duplicate edges
//           if (!graph.hasEdge(rel.source, rel.target)) {
//             graph.addEdge(rel.source, rel.target, {
//               id: rel.id || `edge-${rel.source}-${rel.target}`,
//               label: rel.label || "",
//               relType: rel.relType || "unknown",
//               color: rel.color || "#aaaaaa",
//               size: rel.size || 1,
//               hidden: false, // Add hidden state for filtering
//             });
//           }
//         } catch (err) {
//           console.error(
//             `Error adding edge from ${rel.source} to ${rel.target}:`,
//             err
//           );
//         }
//       });

//       // Apply initial layout - first circular to position nodes
//       try {
//         circular.assign(graph);
//       } catch (err) {
//         console.error("Error applying circular layout:", err);
//       }

//       // Then apply force atlas to create a star-like pattern with longer edges
//       try {
//         // Configure force atlas for a star-like layout with MUCH longer edges
//         const settings = forceAtlas2.inferSettings(graph);
//         forceAtlas2.assign(graph, {
//           settings: {
//             ...settings,
//             gravity: 0.5, // Even lower gravity (was 1)
//             strongGravityMode: false,
//             scalingRatio: 120, // Significantly increased for much longer edges (was 80)
//             slowDown: 3, // Reduced for more spread (was 5)
//             linLogMode: true,
//             outboundAttractionDistribution: true,
//             edgeWeightInfluence: 5, // Increased influence of edge weights (was 3)
//             barnesHutOptimize: true,
//             barnesHutTheta: 0.8,
//           },
//           iterations: 600, // More iterations for better layout (was 500)
//         });

//         // Adjust category nodes to be more prominent and further away
//         graph.forEachNode((nodeId) => {
//           const nodeType = graph.getNodeAttribute(nodeId, "nodeType");
//           if (nodeType === "category") {
//             // Scale up category node positions to push them outward much further
//             const x = graph.getNodeAttribute(nodeId, "x");
//             const y = graph.getNodeAttribute(nodeId, "y");
//             graph.setNodeAttribute(nodeId, "x", x * 3.0); // Increased scaling (was 2.0)
//             graph.setNodeAttribute(nodeId, "y", y * 3.0); // Increased scaling (was 2.0)

//             // Make category nodes larger
//             graph.setNodeAttribute(nodeId, "size", 30); // Larger size (was 25)
//           }
//         });

//         // Push definition nodes further away from their connected terms
//         graph.forEachNode((nodeId) => {
//           const nodeType = graph.getNodeAttribute(nodeId, "nodeType");
//           if (nodeType === "definition") {
//             // Get current position
//             const x = graph.getNodeAttribute(nodeId, "x");
//             const y = graph.getNodeAttribute(nodeId, "y");

//             // Push definitions outward by scaling their position
//             graph.setNodeAttribute(nodeId, "x", x * 1.8);
//             graph.setNodeAttribute(nodeId, "y", y * 1.8);
//           }
//         });
//       } catch (err) {
//         console.error("Error applying force layout:", err);
//       }

//       // Create Sigma instance with improved settings
//       const renderer = new Sigma(graph, containerRef.current, {
//         renderEdgeLabels: false,
//         allowInvalidContainer: true,
//         labelRenderedSizeThreshold: 1,
//         labelFont: "Roboto, sans-serif",
//         minCameraRatio: 0.1, // Allow zooming out more
//         maxCameraRatio: 20, // Allow zooming in more
//         labelColor: {
//           color: isDarkMode ? "#ffffff" : "#333333",
//         },
//         defaultEdgeColor: "#e0e0e0",
//         defaultEdgeType: "arrow",
//         labelSize: 14,
//         labelWeight: "normal",
//         defaultNodeBorderWidth: 1,
//         edgeLabelSize: 12,
//         stagePadding: 50, // Add padding to ensure nodes aren't cut off
//         nodeReducer: (node, data) => {
//           try {
//             const res = { ...data };

//             // If node is hidden, don't render it
//             if (data.hidden) {
//               return { ...data, hidden: true };
//             }

//             // If node is grayed out, reduce its opacity
//             if (data.grayed) {
//               res.color = isDarkMode ? "#555555" : "#cccccc";
//               res.borderColor = isDarkMode ? "#444444" : "#dddddd";
//             }

//             // Adjust size based on node type
//             if (data.nodeType === "category") {
//               res.size = data.size * 1.5; // Make categories larger
//               // Add a border to distinguish categories
//               res.borderColor = isDarkMode ? "#ffffff" : "#333333";
//               res.borderWidth = 2;
//             } else if (data.nodeType === "term") {
//               res.size = data.size * 1.2; // Make terms slightly larger
//               res.borderColor = isDarkMode ? "#555555" : "#dddddd";
//               res.borderWidth = 1;
//             } else if (data.nodeType === "definition") {
//               res.size = data.size * 0.8; // Make definitions smaller
//             }

//             // Highlight selected node
//             if (selectedNode && node === selectedNode.id) {
//               res.highlighted = true;
//               res.color = nodeColors.term.selected;
//               res.borderColor = isDarkMode ? "#ffffff" : "#333333";
//               res.borderWidth = 2;
//             }

//             return res;
//           } catch (err) {
//             console.error("Error in nodeReducer:", err);
//             return data;
//           }
//         },
//         edgeReducer: (edge, data) => {
//           try {
//             const res = { ...data };

//             // If edge is hidden, don't render it
//             if (data.hidden) {
//               return { ...data, hidden: true };
//             }

//             // Color edges based on relationship type
//             if (data.relType === "HAS_DEFINITION") {
//               res.color = "#4C8EDA"; // Blue
//             } else if (data.relType === "BELONGS_TO") {
//               res.color = "#8DCC93"; // Green
//             } else if (data.relType === "RELATED_TO") {
//               res.color = "#FFC454"; // Yellow
//             }

//             // Highlight edges connected to selected node
//             if (
//               selectedNode &&
//               (graph.source(edge) === selectedNode.id ||
//                 graph.target(edge) === selectedNode.id)
//             ) {
//               res.color = "#ff5722";
//               res.size = data.size * 2;
//             }

//             return res;
//           } catch (err) {
//             console.error("Error in edgeReducer:", err);
//             return data;
//           }
//         },
//       });

//       // Add this code after creating the Sigma instance to fit the graph to the view
//       setTimeout(() => {
//         if (sigmaRef.current) {
//           try {
//             // Fit graph to view with padding
//             sigmaRef.current.getCamera().animatedReset();

//             // Apply a specific zoom level (5x)
//             const camera = sigmaRef.current.getCamera();
//             const state = camera.getState();
//             camera.animate(
//               { ...state, ratio: state.ratio / 5 },
//               { duration: 300 }
//             );
//           } catch (err) {
//             console.error("Error fitting graph to view:", err);
//           }
//         }
//       }, 500);

//       // Store the renderer
//       sigmaRef.current = renderer;

//       // Add drag-and-drop functionality
//       renderer
//         .on("downNode", (e) => {
//           setIsDragging(true);
//           setDraggedNode(e.node);
//           // Highlight the node being dragged
//           graph.setNodeAttribute(e.node, "highlighted", true);
//           // Prevent camera movement during drag
//           if (!renderer.getCustomBBox())
//             renderer.setCustomBBox(renderer.getBBox());
//         })
//         .on("mousemove", (e) => {
//           if (isDragging && draggedNode) {
//             // Get mouse position in graph coordinates
//             const pos = renderer.viewportToGraph(e);

//             // Update node position
//             graph.setNodeAttribute(draggedNode, "x", pos.x);
//             graph.setNodeAttribute(draggedNode, "y", pos.y);

//             // Prevent default to avoid camera movement
//             e.preventSigmaDefault();
//           }
//         })
//         .on("mouseup", () => {
//           if (draggedNode) {
//             graph.removeNodeAttribute(draggedNode, "highlighted");
//           }
//           setIsDragging(false);
//           setDraggedNode(null);
//         })
//         .on("clickNode", ({ node }) => {
//           handleNodeClick(node);
//         })
//         // Update the enterNode event handler to properly show all relationship types when hovering
//         .on("enterNode", ({ node }) => {
//           // Get node attributes
//           const nodeAttributes = graphRef.current.getNodeAttributes(node);

//           // Create a tooltip
//           const tooltip = document.createElement("div");
//           tooltip.className = "sigma-tooltip";
//           tooltip.innerHTML = `<b>${nodeAttributes.label}</b><br/>Type: ${nodeAttributes.nodeType}`;

//           // Position the tooltip
//           const x = renderer.getNodeDisplayData(node).x;
//           const y = renderer.getNodeDisplayData(node).y;
//           tooltip.style.left = `${x + 15}px`;
//           tooltip.style.top = `${y + 15}px`;

//           // Add the tooltip to the container
//           containerRef.current.appendChild(tooltip);

//           // Store the tooltip for later removal
//           graphRef.current.setNodeAttribute(node, "tooltip", tooltip);

//           // Find connected nodes and edges
//           const connectedNodes = new Set([node]);
//           const connectedEdges = new Set();

//           // Find all directly connected nodes and edges
//           graphRef.current.forEachEdge(
//             node,
//             (edge, attributes, source, target) => {
//               const connectedNode = source === node ? target : source;
//               connectedNodes.add(connectedNode);
//               connectedEdges.add(edge);
//             }
//           );

//           // Hide all nodes and edges except the hovered node and its connections
//           graphRef.current.forEachNode((n) => {
//             if (!connectedNodes.has(n)) {
//               // Store original visibility
//               graphRef.current.setNodeAttribute(
//                 n,
//                 "originalHidden",
//                 graphRef.current.getNodeAttribute(n, "hidden") || false
//               );
//               graphRef.current.setNodeAttribute(n, "hidden", true);
//             } else if (n !== node) {
//               // Store original color for connected nodes
//               graphRef.current.setNodeAttribute(
//                 n,
//                 "originalColor",
//                 graphRef.current.getNodeAttribute(n, "color")
//               );
//             }
//           });

//           graphRef.current.forEachEdge((edge) => {
//             if (!connectedEdges.has(edge)) {
//               // Store original visibility
//               graphRef.current.setEdgeAttribute(
//                 edge,
//                 "originalHidden",
//                 graphRef.current.getEdgeAttribute(edge, "hidden") || false
//               );
//               graphRef.current.setEdgeAttribute(edge, "hidden", true);
//             } else {
//               // Highlight connected edges
//               graphRef.current.setEdgeAttribute(
//                 edge,
//                 "originalColor",
//                 graphRef.current.getEdgeAttribute(edge, "color")
//               );
//               graphRef.current.setEdgeAttribute(edge, "color", "#FF5722");
//               graphRef.current.setEdgeAttribute(
//                 edge,
//                 "originalSize",
//                 graphRef.current.getEdgeAttribute(edge, "size")
//               );
//               graphRef.current.setEdgeAttribute(
//                 edge,
//                 "size",
//                 graphRef.current.getEdgeAttribute(edge, "size") * 1.5
//               );
//             }
//           });

//           // Refresh the renderer
//           renderer.refresh();
//         })
//         // Update the leaveNode event handler to be more robust
//         .on("leaveNode", ({ node }) => {
//           try {
//             // Remove the tooltip
//             const tooltip = graphRef.current.getNodeAttribute(node, "tooltip");
//             if (tooltip) {
//               try {
//                 if (tooltip.parentNode) {
//                   tooltip.parentNode.removeChild(tooltip);
//                 }
//               } catch (tooltipErr) {
//                 console.error("Error removing tooltip:", tooltipErr);
//               }
//               graphRef.current.setNodeAttribute(node, "tooltip", null);
//             }

//             // Restore original visibility and colors
//             graphRef.current.forEachNode((n) => {
//               try {
//                 const originalHidden = graphRef.current.getNodeAttribute(
//                   n,
//                   "originalHidden"
//                 );
//                 if (originalHidden !== undefined) {
//                   graphRef.current.setNodeAttribute(
//                     n,
//                     "hidden",
//                     originalHidden
//                   );
//                   graphRef.current.removeNodeAttribute(n, "originalHidden");
//                 }

//                 const originalColor = graphRef.current.getNodeAttribute(
//                   n,
//                   "originalColor"
//                 );
//                 if (originalColor) {
//                   graphRef.current.setNodeAttribute(n, "color", originalColor);
//                   graphRef.current.removeNodeAttribute(n, "originalColor");
//                 }
//               } catch (nodeErr) {
//                 console.error(`Error restoring node ${n} attributes:`, nodeErr);
//               }
//             });

//             graphRef.current.forEachEdge((edge) => {
//               try {
//                 const originalHidden = graphRef.current.getEdgeAttribute(
//                   edge,
//                   "originalHidden"
//                 );
//                 if (originalHidden !== undefined) {
//                   graphRef.current.setEdgeAttribute(
//                     edge,
//                     "hidden",
//                     originalHidden
//                   );
//                   graphRef.current.removeEdgeAttribute(edge, "originalHidden");
//                 }

//                 const originalColor = graphRef.current.getEdgeAttribute(
//                   edge,
//                   "originalColor"
//                 );
//                 if (originalColor) {
//                   graphRef.current.setEdgeAttribute(
//                     edge,
//                     "color",
//                     originalColor
//                   );
//                   graphRef.current.removeEdgeAttribute(edge, "originalColor");
//                 }

//                 const originalSize = graphRef.current.getEdgeAttribute(
//                   edge,
//                   "originalSize"
//                 );
//                 if (originalSize) {
//                   graphRef.current.setEdgeAttribute(edge, "size", originalSize);
//                   graphRef.current.removeEdgeAttribute(edge, "originalSize");
//                 }
//               } catch (edgeErr) {
//                 console.error(
//                   `Error restoring edge ${edge} attributes:`,
//                   edgeErr
//                 );
//               }
//             });

//             // Refresh the renderer
//             renderer.refresh();
//           } catch (err) {
//             console.error("Error in leaveNode handler:", err);
//           }
//         });

//       // Dark mode
//       if (isDarkMode) {
//         document.body.classList.add("dark");
//       } else {
//         document.body.classList.remove("dark");
//       }

//       // Apply filters
//       applyFilters();

//       // Clean up on unmount
//       return () => {
//         if (sigmaRef.current) {
//           try {
//             sigmaRef.current.kill();
//           } catch (err) {
//             console.error("Error killing Sigma instance on unmount:", err);
//           }
//         }
//         // Clean up tooltips on unmount
//         cleanupTooltips();
//       };
//     } catch (err) {
//       console.error("Error initializing Sigma:", err);
//       setError(
//         "Failed to initialize the knowledge graph. Please try again later."
//       );
//       setIsLoading(false);
//     }
//   }, [filteredGraphData, containerRef, isDarkMode, selectedNode, applyFilters]);

//   // Add this effect to clean up tooltips when language changes
//   useEffect(() => {
//     // Clean up tooltips when language changes
//     return () => {
//       cleanupTooltips();

//       // Also kill sigma instance when language changes
//       if (sigmaRef.current) {
//         try {
//           sigmaRef.current.kill();
//           sigmaRef.current = null;
//         } catch (err) {
//           console.error(
//             "Error killing Sigma instance on language change:",
//             err
//           );
//         }
//       }
//     };
//   }, [language, cleanupTooltips]);

//   // Apply search filter
//   useEffect(() => {
//     if (!graphData.nodes.length) return;

//     if (searchQuery.trim() === "") {
//       setFilteredGraphData(graphData);
//     } else {
//       const filteredNodes = graphData.nodes.filter((node) =>
//         node.label.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));
//       const filteredRelationships = graphData.relationships.filter(
//         (rel) =>
//           filteredNodeIds.has(rel.source) && filteredNodeIds.has(rel.target)
//       );
//       setFilteredGraphData({
//         nodes: filteredNodes,
//         relationships: filteredRelationships,
//       });
//     }
//   }, [searchQuery, graphData]);

//   // Toggle full screen mode
//   const toggleFullScreen = () => {
//     if (!containerRef.current) return;

//     if (!document.fullscreenElement) {
//       // Make the graph container full screen
//       containerRef.current.requestFullscreen();
//       setIsFullScreen(true);
//     } else if (document.exitFullscreen) {
//       document.exitFullscreen();
//       setIsFullScreen(false);
//     }
//   };

//   // Group connected nodes by type and relationship
//   const groupedConnectedNodes = () => {
//     if (!connectedNodes.length) return {};

//     const grouped = {
//       RELATED_TO: [],
//       HAS_DEFINITION: [],
//       BELONGS_TO: [],
//     };

//     connectedNodes.forEach((node) => {
//       if (grouped[node.relType]) {
//         grouped[node.relType].push(node);
//       } else {
//         grouped[node.relType] = [node];
//       }
//     });

//     // Sort nodes within each group
//     Object.keys(grouped).forEach((key) => {
//       grouped[key].sort((a, b) => {
//         // Sort by node type
//         const typeOrder = { term: 1, definition: 2, category: 3 };
//         if (a.nodeType !== b.nodeType) {
//           return typeOrder[a.nodeType] - typeOrder[b.nodeType];
//         }
//         // Then alphabetically by label
//         return a.label.localeCompare(b.label);
//       });
//     });

//     return grouped;
//   };

//   // Get relationship type label
//   const getRelationshipLabel = (relType) => {
//     switch (relType) {
//       case "HAS_DEFINITION":
//         return "Has Definition";
//       case "BELONGS_TO":
//         return "Belongs To";
//       case "RELATED_TO":
//         return "Related To";
//       default:
//         return relType;
//     }
//   };

//   // Get relationship type color
//   const getRelationshipColor = (relType) => {
//     switch (relType) {
//       case "HAS_DEFINITION":
//         return "#4C8EDA";
//       case "BELONGS_TO":
//         return "#8DCC93";
//       case "RELATED_TO":
//         return "#FFC454";
//       default:
//         return "#aaaaaa";
//     }
//   };

//   // Get node type label
//   const getNodeTypeLabel = (nodeType) => {
//     switch (nodeType) {
//       case "term":
//         return "Terms";
//       case "definition":
//         return "Definitions";
//       case "category":
//         return "Categories";
//       default:
//         return nodeType;
//     }
//   };

//   // Toggle all node type filters
//   const toggleAllNodeTypes = (value) => {
//     setNodeTypeFilters({
//       term: value,
//       definition: value,
//       category: value,
//     });
//   };

//   // Toggle all category filters
//   const toggleAllCategories = (value) => {
//     const newCategoryFilters = {};
//     Object.keys(categoryFilters).forEach((category) => {
//       newCategoryFilters[category] = value;
//     });
//     setCategoryFilters(newCategoryFilters);
//   };

//   return (
//     <div className={`graph-visualization ${isDarkMode ? "dark-mode" : ""}`}>
//       <div className="controls">
//         <div className="search-bar">
//           <Search className="icon" />
//           <input
//             type="search"
//             placeholder="Search terms..."
//             value={searchQuery}
//             onChange={handleSearch}
//           />
//         </div>

//         <div className="buttons">
//           <button onClick={() => sigmaRef.current?.getCamera().animatedReset()}>
//             <RefreshCw className="icon" />
//           </button>
//           <button
//             onClick={() => {
//               if (sigmaRef.current) {
//                 const camera = sigmaRef.current.getCamera();
//                 const state = camera.getState();
//                 camera.animate(
//                   { ...state, ratio: state.ratio / 2 }, // Zoom in by reducing ratio
//                   { duration: 300 }
//                 );
//               }
//             }}
//           >
//             <ZoomIn className="icon" />
//           </button>
//           <button
//             onClick={() => {
//               if (sigmaRef.current) {
//                 const camera = sigmaRef.current.getCamera();
//                 const state = camera.getState();
//                 camera.animate(
//                   { ...state, ratio: state.ratio * 2 }, // Zoom out by increasing ratio
//                   { duration: 300 }
//                 );
//               }
//             }}
//           >
//             <ZoomOut className="icon" />
//           </button>
//           <button onClick={toggleFullScreen}>
//             {isFullScreen ? (
//               <Minimize className="icon" />
//             ) : (
//               <Maximize className="icon" />
//             )}
//           </button>
//           <button onClick={toggleDarkMode}>
//             {isDarkMode ? <Sun className="icon" /> : <Moon className="icon" />}
//           </button>
//           <button onClick={exportGraph}>
//             <Download className="icon" />
//           </button>
//           <button onClick={toggleLegend}>
//             <Info className="icon" />
//           </button>
//           <button
//             onClick={toggleFilters}
//             className={showFilters ? "active" : ""}
//           >
//             <Filter className="icon" />
//           </button>
//         </div>
//       </div>

//       {showFilters && (
//         <div className="filters-panel">
//           <div className="filters-header">
//             <h3>Filters</h3>
//             <button onClick={toggleFilters} className="close-button">
//               <X className="icon" size={16} />
//             </button>
//           </div>

//           <div className="filter-section">
//             <div
//               className="filter-section-header"
//               onClick={() => setShowNodeTypeFilters(!showNodeTypeFilters)}
//             >
//               <h4>Node Types</h4>
//               {showNodeTypeFilters ? (
//                 <ChevronUp size={16} />
//               ) : (
//                 <ChevronDown size={16} />
//               )}
//             </div>

//             {showNodeTypeFilters && (
//               <div className="filter-options">
//                 <div className="filter-option">
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={Object.values(nodeTypeFilters).every((v) => v)}
//                       onChange={(e) => toggleAllNodeTypes(e.target.checked)}
//                     />
//                     <span>All Node Types</span>
//                   </label>
//                 </div>

//                 <div className="filter-option">
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={nodeTypeFilters.term}
//                       onChange={(e) =>
//                         setNodeTypeFilters({
//                           ...nodeTypeFilters,
//                           term: e.target.checked,
//                         })
//                       }
//                     />
//                     <span>Terms</span>
//                   </label>
//                 </div>

//                 <div className="filter-option">
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={nodeTypeFilters.definition}
//                       onChange={(e) =>
//                         setNodeTypeFilters({
//                           ...nodeTypeFilters,
//                           definition: e.target.checked,
//                         })
//                       }
//                     />
//                     <span>Definitions</span>
//                   </label>
//                 </div>

//                 <div className="filter-option">
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={nodeTypeFilters.category}
//                       onChange={(e) =>
//                         setNodeTypeFilters({
//                           ...nodeTypeFilters,
//                           category: e.target.checked,
//                         })
//                       }
//                     />
//                     <span>Categories</span>
//                   </label>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="filter-section">
//             <div
//               className="filter-section-header"
//               onClick={() => setShowCategoryFilters(!showCategoryFilters)}
//             >
//               <h4>Categories</h4>
//               {showCategoryFilters ? (
//                 <ChevronUp size={16} />
//               ) : (
//                 <ChevronDown size={16} />
//               )}
//             </div>

//             {showCategoryFilters && (
//               <div className="filter-options">
//                 <div className="filter-option">
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={Object.values(categoryFilters).every((v) => v)}
//                       onChange={(e) => toggleAllCategories(e.target.checked)}
//                     />
//                     <span>All Categories</span>
//                   </label>
//                 </div>

//                 {Object.keys(categoryFilters).map((category) => (
//                   <div className="filter-option" key={category}>
//                     <label>
//                       <input
//                         type="checkbox"
//                         checked={categoryFilters[category]}
//                         onChange={(e) =>
//                           setCategoryFilters({
//                             ...categoryFilters,
//                             [category]: e.target.checked,
//                           })
//                         }
//                       />
//                       <span style={{ color: nodeColors.category[category] }}>
//                         {categoryEmojis[category]} {category}
//                       </span>
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="filter-section">
//             <div className="filter-option clustering-option">
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={clusterByCategory}
//                   onChange={toggleClustering}
//                 />
//                 <span>Cluster by Category</span>
//               </label>
//             </div>
//           </div>

//           <div className="filter-actions">
//             <button
//               onClick={() => {
//                 toggleAllNodeTypes(true);
//                 toggleAllCategories(true);
//                 setClusterByCategory(false);
//               }}
//               className="reset-button"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="graph-container" ref={containerRef}>
//         {isLoading && (
//           <div className="loading-message">Loading knowledge graph...</div>
//         )}
//         {error && <div className="error-message">{error}</div>}
//       </div>

//       {selectedNode && (
//         <div className={`node-panel ${isPanelOpen ? "open" : ""}`}>
//           <button
//             className="panel-toggle"
//             onClick={() => setIsPanelOpen(!isPanelOpen)}
//           >
//             {isPanelOpen ? "«" : "»"}
//           </button>
//           <h2>{selectedNode.label}</h2>
//           <p>
//             <b>Type:</b> {selectedNode.nodeType}
//           </p>
//           {selectedNode.nodeType === "definition" && (
//             <>
//               <p>
//                 <b>Definition Type:</b> {selectedNode.defType}
//               </p>
//               <p>
//                 <b>Full Text:</b> {selectedNode.fullText}
//               </p>
//               {selectedNode.references && (
//                 <p>
//                   <b>References:</b> {selectedNode.references}
//                 </p>
//               )}
//             </>
//           )}

//           {selectedNode.categories && selectedNode.categories.length > 0 && (
//             <div className="node-categories">
//               <h4>Categories</h4>
//               <div className="category-tags">
//                 {selectedNode.categories.map((category) => (
//                   <span
//                     key={category}
//                     className="category-tag"
//                     style={{ backgroundColor: nodeColors.category[category] }}
//                   >
//                     {categoryEmojis[category]} {category}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {selectedNode.category && (
//             <div className="node-categories">
//               <h4>Category</h4>
//               <div className="category-tags">
//                 <span
//                   className="category-tag"
//                   style={{
//                     backgroundColor: nodeColors.category[selectedNode.category],
//                   }}
//                 >
//                   {categoryEmojis[selectedNode.category]}{" "}
//                   {selectedNode.category}
//                 </span>
//               </div>
//             </div>
//           )}

//           {connectedNodes.length > 0 && (
//             <div className="connected-nodes">
//               <h3>Connected Nodes</h3>

//               {Object.entries(groupedConnectedNodes()).map(
//                 ([relType, nodes]) => {
//                   if (nodes.length === 0) return null;

//                   return (
//                     <div key={relType} className="connected-node-group">
//                       <h4>{getRelationshipLabel(relType)}</h4>
//                       <ul>
//                         {nodes.map((node) => (
//                           <li
//                             key={node.id}
//                             onClick={() => navigateToNode(node.id)}
//                             className="connected-node-item"
//                           >
//                             <span
//                               className="relationship-badge"
//                               style={{
//                                 backgroundColor: getRelationshipColor(
//                                   node.relType
//                                 ),
//                               }}
//                             ></span>
//                             <div className="connected-node-content">
//                               <span className="connected-node-label">
//                                 {node.label}
//                               </span>
//                               <span className="connected-node-type">
//                                 ({node.nodeType})
//                               </span>
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   );
//                 }
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {showLegend && (
//         <GraphLegend
//           categories={categories[language] || categories.english}
//           nodeColors={nodeColors}
//         />
//       )}
//     </div>
//   );
// };

// export default GraphVisualization;
=======
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getAllterms } from "../../services/Api";
import "./GraphVisualization.css";

// Import graph libraries
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

// Import the GraphLegend component
import GraphLegend from "./GraphExport";

const GraphVisualization = ({ language = "english" }) => {
  const [graphData, setGraphData] = useState({ nodes: [], relationships: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedRelationships, setHighlightedRelationships] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [ error, setError ] = useState( null );
  const [projectionName, setProjectionName] = useState(null);
  const [filteredGraphData, setFilteredGraphData] = useState({
    nodes: [],
    relationships: [],
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLayoutRunning, setIsLayoutRunning] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Add state for drag-and-drop functionality
  const [draggedNode, setDraggedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [connectedNodes, setConnectedNodes] = useState([]);

  // Add state for filters
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

  // Refs for Sigma.js
  const containerRef = useRef(null);
  const sigmaRef = useRef(null);
  const graphRef = useRef(null);
  const lastClickedNodeRef = useRef(null);
  const lastClickTimeRef = useRef(0);

  // Define categories with proper capitalization
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
      "Contrats informatiques",
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

  // Update the node colors to be more vibrant and distinct
  const nodeColors = {
    term: {
      default: "#8B5CF6", // Purple for terms
      selected: "#FF5722", // Orange for selected
      grayed: "#D1C4E9", // Light purple for grayed out terms
    },
    definition: {
      primary: "#3B82F6", // Blue for primary definitions
      secondary: "#EC4899", // Pink for secondary definitions
      selected: "#FF5722", // Orange for selected
      grayed: "#BBDEFB", // Light blue for grayed out definitions
    },
    category: {
      "Computer Crime": "#EF4444", // Red
      "Personal Data": "#EC4899", // Pink
      "Electronic Commerce": "#10B981", // Green
      Organization: "#F59E0B", // Yellow
      Networks: "#3B82F6", // Blue
      "Intellectual Property": "#8B5CF6", // Purple
      Miscellaneous: "#6366F1", // Indigo
      "Computer Science": "#06B6D4", // Cyan
      // French translations
      "Criminalité informatique": "#EF4444",
      "Données personnelles": "#EC4899",
      "Commerce électronique": "#10B981",
      Organisation: "#F59E0B",
      Réseaux: "#3B82F6",
      "Propriété intellectuelle": "#8B5CF6",
      Divers: "#6366F1",
      Informatique: "#06B6D4",
      // Arabic translations
      "جرائم الكمبيوتر": "#EF4444",
      "البيانات الشخصية": "#EC4899",
      "التجارة الإلكترونية": "#10B981",
      التنظيم: "#F59E0B",
      الشبكات: "#3B82F6",
      "الملكية الفكرية": "#8B5CF6",
      متنوع: "#6366F1",
      "علوم الكمبيوتر": "#06B6D4",
      grayed: "#E5E5E5", // Light gray for grayed out categories
    },
  };

  // Add category emojis
  const categoryEmojis = {
    "Computer Crime": "🔒",
    "Personal Data": "👤",
    "Electronic Commerce": "🛒",
    Organization: "🏢",
    Networks: "🌐",
    "Intellectual Property": "©️",
    Miscellaneous: "📦",
    "Computer Science": "💻",
    // French translations
    "Criminalité informatique": "🔒",
    "Données personnelles": "👤",
    "Commerce électronique": "🛒",
    Organisation: "🏢",
    Réseaux: "🌐",
    "Propriété intellectuelle": "©️",
    Divers: "📦",
    Informatique: "💻",
    // Arabic translations
    "جرائم الكمبيوتر": "🔒",
    "البيانات الشخصية": "👤",
    "التجارة الإلكترونية": "🛒",
    التنظيم: "🏢",
    الشبكات: "🌐",
    "الملكية الفكرية": "©️",
    متنوع: "📦",
    "علوم الكمبيوتر": "💻",
  };

  // Map language prop to API language code
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

  // Toggle dark/light mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Toggle legend visibility
  const toggleLegend = useCallback(() => {
    setShowLegend((prev) => !prev);
  }, []);

  // Toggle filters panel
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // Initialize category filters when categories are available
  useEffect(() => {
    const currentCategories = categories[language] || categories.english;
    const initialCategoryFilters = {};

    currentCategories.forEach((category) => {
      initialCategoryFilters[category] = true;
    });

    setCategoryFilters(initialCategoryFilters);
  }, [language]);

  // Fetch data and transform it into graph structure
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

        // Transform API data into graph structure
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

  // Transform API data to focus on terms, definitions, and categories
  const transformDataToGraph = (termsData, languageCode) => {
    const nodes = [];
    const relationships = [];
    const categoryNodes = new Map();
    const nodeIds = new Set();

    // Get the appropriate category list for the current language
    const categoryList = categories[language] || categories.english;

    // Create category nodes first
    categoryList.forEach((category, index) => {
      const categoryId = `cat-${index}`;

      // Skip if this category ID already exists
      if (nodeIds.has(categoryId)) return;

      // Add emoji to category label
      const emoji = categoryEmojis[category] || "";
      const labelWithEmoji = `${emoji} ${category}`;

      const categoryNode = {
        id: categoryId,
        label: labelWithEmoji,
        originalLabel: category,
        nodeType: "category",
        language: languageCode,
        size: 15,
        color: nodeColors.category[category] || "#6366F1", // Use vibrant colors
        category: category, // Store the category for filtering
      };
      nodes.push(categoryNode);
      categoryNodes.set(category, categoryNode.id);
      nodeIds.add(categoryId);
    });

    // Process terms and ensure unique IDs
    termsData.forEach((term) => {
      if (!term || !term.id) return; // Skip invalid terms

      const termId = `term-${term.id}`;

      // Skip if this term ID already exists
      if (nodeIds.has(termId)) return;

      // Add term node
      const termNode = {
        id: termId,
        label: term.name || "Unnamed Term",
        nodeType: "term",
        language: languageCode,
        size: 8,
        color: nodeColors.term.default, // Purple for terms
        categories: [], // Will store categories for filtering
      };
      nodes.push(termNode);
      nodeIds.add(termId);

      // Process definitions
      if (term.definitions && term.definitions.length > 0) {
        term.definitions.forEach((def, defIndex) => {
          if (!def || def.language !== languageCode) return; // Skip invalid or wrong language definitions

          const defId = `def-${term.id}-${defIndex}`;

          // Skip if this definition ID already exists
          if (nodeIds.has(defId)) return;

          // Track categories for this definition
          const defCategories = [];

          // Add definition node
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
                : nodeColors.definition.secondary, // Blue for primary, Pink for secondary
            categories: [], // Will store categories for filtering
          };
          nodes.push(defNode);
          nodeIds.add(defId);

          // Add relationship between term and definition
          relationships.push({
            id: `rel-term-def-${term.id}-${defIndex}`,
            source: termNode.id,
            target: defNode.id,
            relType: "HAS_DEFINITION",
            label: "HAS_DEFINITION",
            color: "#4C8EDA", // Blue
            size: 2,
            weight: 0.2, // Add a low weight to increase distance
          });

          // Process categories
          if (def.categories && def.categories.length > 0) {
            def.categories.forEach((category) => {
              if (!category) return; // Skip invalid categories

              // Find the closest matching category from our predefined list
              const matchedCategory = findClosestCategory(
                category,
                categoryList
              );

              if (matchedCategory && categoryNodes.has(matchedCategory)) {
                // Add category to definition's categories
                defNode.categories.push(matchedCategory);

                // Add category to term's categories if not already there
                if (!termNode.categories.includes(matchedCategory)) {
                  termNode.categories.push(matchedCategory);
                }

                // Add relationship between definition and category
                relationships.push({
                  id: `rel-def-cat-${term.id}-${defIndex}-${categoryNodes.get(
                    matchedCategory
                  )}`,
                  source: defNode.id,
                  target: categoryNodes.get(matchedCategory),
                  relType: "BELONGS_TO",
                  label: "BELONGS_TO",
                  color: "#8DCC93", // Green
                  size: 1,
                });

                // Add direct relationship between term and category for better visualization
                relationships.push({
                  id: `rel-term-cat-${term.id}-${categoryNodes.get(
                    matchedCategory
                  )}`,
                  source: termNode.id,
                  target: categoryNodes.get(matchedCategory),
                  relType: "BELONGS_TO",
                  label: "BELONGS_TO",
                  color: "#8DCC93", // Green
                  size: 0.5, // Thinner line
                });
              }
            });
          }

          // Process related terms
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

              // Only create relationship if the target term exists or will exist
              if (
                nodeIds.has(relatedTermId) ||
                termsData.some((t) => t.id === relatedTerm.id)
              ) {
                // Add relationship between terms
                relationships.push({
                  id: `rel-term-term-${term.id}-${relatedTerm.id}-${rtIndex}`,
                  source: termNode.id,
                  target: relatedTermId,
                  relType: "RELATED_TO",
                  label: "RELATED_TO",
                  color: "#FFC454", // Yellow
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

  // Find the closest matching category from our predefined list
  const findClosestCategory = (category, categoryList) => {
    if (!category) return categoryList[0];

    // Direct match
    if (categoryList.includes(category)) {
      return category;
    }

    // Case insensitive match
    const lowerCategory = category.toLowerCase();
    for (const cat of categoryList) {
      if (cat.toLowerCase() === lowerCategory) {
        return cat;
      }
    }

    // Partial match
    for (const cat of categoryList) {
      if (
        cat.toLowerCase().includes(lowerCategory) ||
        lowerCategory.includes(cat.toLowerCase())
      ) {
        return cat;
      }
    }

    // Default to first category if no match found
    return categoryList[0];
  };

  // Apply filters to the graph
  const applyFilters = useCallback(() => {
    if (!graphRef.current) return;

    try {
      // Apply node type filters
      graphRef.current.forEachNode((nodeId) => {
        const nodeType = graphRef.current.getNodeAttribute(nodeId, "nodeType");
        const nodeCategories =
          graphRef.current.getNodeAttribute(nodeId, "categories") || [];
        const nodeCategory = graphRef.current.getNodeAttribute(
          nodeId,
          "category"
        ); // For category nodes

        // Check if node type is filtered
        const isNodeTypeVisible = nodeTypeFilters[nodeType] || false;

        // Check if node's categories are filtered (for terms and definitions)
        let isCategoryVisible = true;
        if (nodeType === "term" || nodeType === "definition") {
          // If node has categories, check if any of them are visible
          if (nodeCategories.length > 0) {
            isCategoryVisible = nodeCategories.some(
              (cat) => categoryFilters[cat]
            );
          }
        } else if (nodeType === "category") {
          // For category nodes, check if this specific category is visible
          isCategoryVisible = categoryFilters[nodeCategory] || false;
        }

        // Node is visible only if both node type and category are visible
        const isVisible = isNodeTypeVisible && isCategoryVisible;
        graphRef.current.setNodeAttribute(nodeId, "hidden", !isVisible);
      });

      // Apply edge filters - only show edges between visible nodes
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

      // Apply clustering if enabled
      if (clusterByCategory) {
        applyClustering();
      }

      // Refresh the renderer
      if (sigmaRef.current) {
        sigmaRef.current.refresh();
      }
    } catch (err) {
      console.error("Error applying filters:", err);
    }
  }, [nodeTypeFilters, categoryFilters, clusterByCategory]);

  // Replace the cleanupTooltips function with this improved version
  const cleanupTooltips = useCallback(() => {
    try {
      if (containerRef.current) {
        // Find all tooltips
        const tooltips =
          containerRef.current.querySelectorAll(".sigma-tooltip");

        // Safely remove each tooltip
        tooltips.forEach((tooltip) => {
          try {
            if (tooltip && tooltip.parentNode) {
              tooltip.parentNode.removeChild(tooltip);
            }
          } catch (err) {
            console.error("Error removing individual tooltip:", err);
          }
        });

        // Also check for tooltips stored in graph nodes
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

  // Apply clustering by category
  const applyClustering = useCallback(() => {
    if (!graphRef.current || !sigmaRef.current) return;

    try {
      // Reset positions first
      circular.assign(graphRef.current);

      // Get visible category nodes
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

      // Position categories in a circle with a larger radius
      const radius = 20; // Increased from 10 for more spacing
      const angleStep = (2 * Math.PI) / visibleCategories.length;

      visibleCategories.forEach((catNode, index) => {
        const angle = index * angleStep;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        graphRef.current.setNodeAttribute(catNode.id, "x", x);
        graphRef.current.setNodeAttribute(catNode.id, "y", y);

        // Position related nodes around their category with more spacing
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

            // If this node belongs to this category
            if (nodeCategories.includes(catNode.category)) {
              // Position it near the category with some randomness and more distance
              const nodeRadius = radius * 0.7; // Increased from 0.5 for more spacing
              const nodeAngle = angle + (Math.random() * 0.8 - 0.4) * angleStep; // Wider angle spread
              const nodeX = x + nodeRadius * Math.cos(nodeAngle);
              const nodeY = y + nodeRadius * Math.sin(nodeAngle);

              graphRef.current.setNodeAttribute(nodeId, "x", nodeX);
              graphRef.current.setNodeAttribute(nodeId, "y", nodeY);
            }
          }
        });
      });

      // Apply noverlap with more iterations to prevent node overlap
      noverlap.assign(graphRef.current, { maxIterations: 100 }); // Increased from 50

      // Refresh the renderer
      sigmaRef.current.refresh();

      // Center the camera with a wider view
      sigmaRef.current.getCamera().animatedReset();

      // Zoom out to see the whole graph
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

  // Toggle clustering
  const toggleClustering = useCallback(() => {
    setClusterByCategory((prev) => {
      const newValue = !prev;

      // If enabling clustering, apply it immediately
      if (newValue && graphRef.current && sigmaRef.current) {
        applyClustering();
      } else if (!newValue && graphRef.current && sigmaRef.current) {
        // If disabling, reset to circular layout
        circular.assign(graphRef.current);
        sigmaRef.current.getCamera().animatedReset();
        sigmaRef.current.refresh();
      }

      return newValue;
    });
  }, [applyClustering]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [nodeTypeFilters, categoryFilters, clusterByCategory, applyFilters]);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!graphRef.current) return;

    try {
      if (query.trim() === "") {
        // Reset all nodes and edges visibility
        graphRef.current.forEachNode((node) => {
          graphRef.current.setNodeAttribute(node, "hidden", false);

          // Reset original colors
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
          // Reset edge colors
          const relType = graphRef.current.getEdgeAttribute(edge, "relType");
          if (relType === "HAS_DEFINITION") {
            graphRef.current.setEdgeAttribute(edge, "color", "#4C8EDA");
          } else if (relType === "BELONGS_TO") {
            graphRef.current.setEdgeAttribute(edge, "color", "#8DCC93");
          } else if (relType === "RELATED_TO") {
            graphRef.current.setEdgeAttribute(edge, "color", "#FFC454");
          }
        });

        // Re-apply filters
        applyFilters();
      } else {
        // First, hide all nodes and edges
        graphRef.current.forEachNode((node) => {
          graphRef.current.setNodeAttribute(node, "hidden", true);
        });
        graphRef.current.forEachEdge((edge) => {
          graphRef.current.setEdgeAttribute(edge, "hidden", true);
        });

        // Find matching nodes
        const matchingNodes = new Set();
        const directlyConnectedNodes = new Set();
        const relevantEdges = new Set();

        // First pass: find matching nodes
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

        // Second pass: find all directly connected nodes and edges
        matchingNodes.forEach((nodeId) => {
          try {
            graphRef.current.forEachEdge(
              nodeId,
              (edge, attributes, source, target) => {
                const connectedNodeId = source === nodeId ? target : source;

                // Add connected node and edge to our sets
                directlyConnectedNodes.add(connectedNodeId);
                relevantEdges.add(edge);

                // Make them visible
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

        // Highlight matching nodes
        matchingNodes.forEach((nodeId) => {
          graphRef.current.setNodeAttribute(
            nodeId,
            "color",
            nodeColors.term.selected
          );
        });
      }

      // Refresh the renderer
      if (sigmaRef.current) {
        sigmaRef.current.refresh();
      }
    } catch (err) {
      console.error("Error during search:", err);
    }
  };

  // Add this function after handleNodeClick to implement node dragging
  const handleNodeDrag = (nodeId, event) => {
    if (!graphRef.current || !sigmaRef.current) return;

    try {
      // Get new position of node in graph coordinates
      const pos = sigmaRef.current.viewportToGraph({
        x: event.clientX,
        y: event.clientY,
      });

      // Update node position
      graphRef.current.setNodeAttribute(nodeId, "x", pos.x);
      graphRef.current.setNodeAttribute(nodeId, "y", pos.y);

      // Refresh the renderer
      sigmaRef.current.refresh();
    } catch (err) {
      console.error("Error during node drag:", err);
    }
  };

  // Add this function to find and set connected nodes for the info panel
  const findConnectedNodes = (nodeId) => {
    if (!graphRef.current || !nodeId) return [];

    const connected = [];

    try {
      // First collect all directly connected nodes
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
              // Add additional information for better organization
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

    // Sort connected nodes by relationship type first, then by node type
    return connected.sort((a, b) => {
      // First sort by relationship type
      const relOrder = { HAS_DEFINITION: 1, BELONGS_TO: 2, RELATED_TO: 3 };
      if (a.relType !== b.relType) {
        return relOrder[a.relType] - relOrder[b.relType];
      }

      // Then sort by node type
      const typeOrder = { term: 1, definition: 2, category: 3 };
      return typeOrder[a.nodeType] - typeOrder[b.nodeType];
    });
  };

  // Function to navigate to a connected node
  const navigateToNode = (nodeId) => {
    if (!graphRef.current || !sigmaRef.current) return;

    // Handle node click to select the node
    handleNodeClick(nodeId);

    // Center the camera on the node
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

  // Modify handleNodeClick to also set connected nodes
  const handleNodeClick = async (nodeId) => {
    try {
      if (!graphRef.current) return;

      // Check if the node exists in the graph
      if (!graphRef.current.hasNode(nodeId)) {
        console.warn(`Node ${nodeId} not found in graph`);
        return;
      }

      // Toggle behavior - if clicking the same node, deselect it
      if (lastClickedNodeRef.current === nodeId) {
        setSelectedNode(null);
        setHighlightedRelationships([]);
        setConnectedNodes([]);
        lastClickedNodeRef.current = null;

        // Reset node/edge styles
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
        setProjectionName(null); // Clear projection on deselect
      } else {
        // Select new node
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

        // API CALLS
        try {
          // 1. GET /api/search/node
          const response1 = await fetch(
            `http://localhost:3001/api/search/node?nodeName=${encodeURIComponent(
              node.label
            )}&language=${node.language}`,
            { headers: { "Content-Type": "application/json" } }
          );

          if (!response1.ok) throw new Error("Failed to fetch node details");
          const data1 = await response1.json();
          console.log("Search Node API Response:", data1);

          // ✅ Vérifie si le nœud est bien un "term" connu avant de projeter
          if (node.nodeType !== "term") {
            console.warn("Subgraph projection only allowed for term nodes.");
            return;
          }

          if (!data1.termFound) {
            console.warn(`Term "${node.label}" not found in database`);
            return;
          }

          // 2. POST /api/gds/subgraph-projections
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
            setProjectionName(data2.projectionName); // Transmet à l'extérieur
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
  

  // Enhance the exportGraph function to fix download issues
  const exportGraph = () => {
    if (!containerRef.current || !sigmaRef.current) return;

    try {
      // First, make all nodes and edges visible for the screenshot
      if (graphRef.current) {
        // Store current visibility state
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

        // Refresh to show all nodes
        sigmaRef.current.refresh();

        // Get the sigma canvas element
        const canvas = containerRef.current.querySelector(".sigma-scene");

        if (canvas) {
          // Create a new canvas with the same dimensions
          const exportCanvas = document.createElement("canvas");
          exportCanvas.width = canvas.width;
          exportCanvas.height = canvas.height;

          // Draw the sigma canvas onto our export canvas
          const ctx = exportCanvas.getContext("2d");
          ctx.fillStyle = isDarkMode ? "#1a1a1a" : "#f5f5f7";
          ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          ctx.drawImage(canvas, 0, 0);

          // Convert to image and download
          exportCanvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.download = `knowledge-graph-${language}.png`;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);

              // Restore visibility state
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

              // Refresh to restore original view
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

  // Initialize Sigma.js
  useEffect(() => {
    if (
      isLoading ||
      error ||
      !filteredGraphData.nodes.length ||
      !containerRef.current
    )
      return;

    // Clean up previous instance
    if (sigmaRef.current) {
      try {
        sigmaRef.current.kill();
      } catch (err) {
        console.error("Error killing previous Sigma instance:", err);
      }
      sigmaRef.current = null;
    }

    // Clean up any lingering tooltips
    cleanupTooltips();

    try {
      // Create a new graph
      const graph = new Graph();
      graphRef.current = graph;

      // Track added nodes to prevent duplicates
      const addedNodes = new Set();

      // Add nodes
      filteredGraphData.nodes.forEach((node) => {
        try {
          // Skip if node already exists or has no ID
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
            grayed: false, // Add grayed state for highlighting
            hidden: false, // Add hidden state for filtering
            categories: node.categories || [], // For filtering
            category: node.category || "", // For category nodes
            originalLabel: node.originalLabel || "",
          });

          // Track added node
          addedNodes.add(node.id);
        } catch (err) {
          console.error(`Error adding node ${node.id}:`, err);
        }
      });

      // Add edges
      filteredGraphData.relationships.forEach((rel) => {
        try {
          // Check if both source and target nodes exist
          if (
            !rel.source ||
            !rel.target ||
            !graph.hasNode(rel.source) ||
            !graph.hasNode(rel.target)
          ) {
            return;
          }

          // Avoid duplicate edges
          if (!graph.hasEdge(rel.source, rel.target)) {
            graph.addEdge(rel.source, rel.target, {
              id: rel.id || `edge-${rel.source}-${rel.target}`,
              label: rel.label || "",
              relType: rel.relType || "unknown",
              color: rel.color || "#aaaaaa",
              size: rel.size || 1,
              hidden: false, // Add hidden state for filtering
            });
          }
        } catch (err) {
          console.error(
            `Error adding edge from ${rel.source} to ${rel.target}:`,
            err
          );
        }
      });

      // Apply initial layout - first circular to position nodes
      try {
        circular.assign(graph);
      } catch (err) {
        console.error("Error applying circular layout:", err);
      }

      // Then apply force atlas to create a star-like pattern with longer edges
      try {
        // Configure force atlas for a star-like layout with MUCH longer edges
        const settings = forceAtlas2.inferSettings(graph);
        forceAtlas2.assign(graph, {
          settings: {
            ...settings,
            gravity: 0.5, // Even lower gravity (was 1)
            strongGravityMode: false,
            scalingRatio: 120, // Significantly increased for much longer edges (was 80)
            slowDown: 3, // Reduced for more spread (was 5)
            linLogMode: true,
            outboundAttractionDistribution: true,
            edgeWeightInfluence: 5, // Increased influence of edge weights (was 3)
            barnesHutOptimize: true,
            barnesHutTheta: 0.8,
          },
          iterations: 600, // More iterations for better layout (was 500)
        });

        // Adjust category nodes to be more prominent and further away
        graph.forEachNode((nodeId) => {
          const nodeType = graph.getNodeAttribute(nodeId, "nodeType");
          if (nodeType === "category") {
            // Scale up category node positions to push them outward much further
            const x = graph.getNodeAttribute(nodeId, "x");
            const y = graph.getNodeAttribute(nodeId, "y");
            graph.setNodeAttribute(nodeId, "x", x * 3.0); // Increased scaling (was 2.0)
            graph.setNodeAttribute(nodeId, "y", y * 3.0); // Increased scaling (was 2.0)

            // Make category nodes larger
            graph.setNodeAttribute(nodeId, "size", 30); // Larger size (was 25)
          }
        });

        // Push definition nodes further away from their connected terms
        graph.forEachNode((nodeId) => {
          const nodeType = graph.getNodeAttribute(nodeId, "nodeType");
          if (nodeType === "definition") {
            // Get current position
            const x = graph.getNodeAttribute(nodeId, "x");
            const y = graph.getNodeAttribute(nodeId, "y");

            // Push definitions outward by scaling their position
            graph.setNodeAttribute(nodeId, "x", x * 1.8);
            graph.setNodeAttribute(nodeId, "y", y * 1.8);
          }
        });
      } catch (err) {
        console.error("Error applying force layout:", err);
      }

      // Create Sigma instance with improved settings
      const renderer = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: false,
        allowInvalidContainer: true,
        labelRenderedSizeThreshold: 1,
        labelFont: "Roboto, sans-serif",
        minCameraRatio: 0.1, // Allow zooming out more
        maxCameraRatio: 20, // Allow zooming in more
        labelColor: {
          color: isDarkMode ? "#ffffff" : "#333333",
        },
        defaultEdgeColor: "#e0e0e0",
        defaultEdgeType: "arrow",
        labelSize: 14,
        labelWeight: "normal",
        defaultNodeBorderWidth: 1,
        edgeLabelSize: 12,
        stagePadding: 50, // Add padding to ensure nodes aren't cut off
        nodeReducer: (node, data) => {
          try {
            const res = { ...data };

            // If node is hidden, don't render it
            if (data.hidden) {
              return { ...data, hidden: true };
            }

            // If node is grayed out, reduce its opacity
            if (data.grayed) {
              res.color = isDarkMode ? "#555555" : "#cccccc";
              res.borderColor = isDarkMode ? "#444444" : "#dddddd";
            }

            // Adjust size based on node type
            if (data.nodeType === "category") {
              res.size = data.size * 1.5; // Make categories larger
              // Add a border to distinguish categories
              res.borderColor = isDarkMode ? "#ffffff" : "#333333";
              res.borderWidth = 2;
            } else if (data.nodeType === "term") {
              res.size = data.size * 1.2; // Make terms slightly larger
              res.borderColor = isDarkMode ? "#555555" : "#dddddd";
              res.borderWidth = 1;
            } else if (data.nodeType === "definition") {
              res.size = data.size * 0.8; // Make definitions smaller
            }

            // Highlight selected node
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

            // If edge is hidden, don't render it
            if (data.hidden) {
              return { ...data, hidden: true };
            }

            // Color edges based on relationship type
            if (data.relType === "HAS_DEFINITION") {
              res.color = "#4C8EDA"; // Blue
            } else if (data.relType === "BELONGS_TO") {
              res.color = "#8DCC93"; // Green
            } else if (data.relType === "RELATED_TO") {
              res.color = "#FFC454"; // Yellow
            }

            // Highlight edges connected to selected node
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

      // Add this code after creating the Sigma instance to fit the graph to the view
      setTimeout(() => {
        if (sigmaRef.current) {
          try {
            // Fit graph to view with padding
            sigmaRef.current.getCamera().animatedReset();

            // Apply a specific zoom level (5x)
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

      // Store the renderer
      sigmaRef.current = renderer;

      // Add drag-and-drop functionality
      renderer
        .on("downNode", (e) => {
          setIsDragging(true);
          setDraggedNode(e.node);
          // Highlight the node being dragged
          graph.setNodeAttribute(e.node, "highlighted", true);
          // Prevent camera movement during drag
          if (!renderer.getCustomBBox())
            renderer.setCustomBBox(renderer.getBBox());
        })
        .on("mousemove", (e) => {
          if (isDragging && draggedNode) {
            // Get mouse position in graph coordinates
            const pos = renderer.viewportToGraph(e);

            // Update node position
            graph.setNodeAttribute(draggedNode, "x", pos.x);
            graph.setNodeAttribute(draggedNode, "y", pos.y);

            // Prevent default to avoid camera movement
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
        // Update the enterNode event handler to properly show all relationship types when hovering
        .on("enterNode", ({ node }) => {
          // Get node attributes
          const nodeAttributes = graphRef.current.getNodeAttributes(node);

          // Create a tooltip
          const tooltip = document.createElement("div");
          tooltip.className = "sigma-tooltip";
          tooltip.innerHTML = `<b>${nodeAttributes.label}</b><br/>Type: ${nodeAttributes.nodeType}`;

          // Position the tooltip
          const x = renderer.getNodeDisplayData(node).x;
          const y = renderer.getNodeDisplayData(node).y;
          tooltip.style.left = `${x + 15}px`;
          tooltip.style.top = `${y + 15}px`;

          // Add the tooltip to the container
          containerRef.current.appendChild(tooltip);

          // Store the tooltip for later removal
          graphRef.current.setNodeAttribute(node, "tooltip", tooltip);

          // Find connected nodes and edges
          const connectedNodes = new Set([node]);
          const connectedEdges = new Set();

          // Find all directly connected nodes and edges
          graphRef.current.forEachEdge(
            node,
            (edge, attributes, source, target) => {
              const connectedNode = source === node ? target : source;
              connectedNodes.add(connectedNode);
              connectedEdges.add(edge);
            }
          );

          // Hide all nodes and edges except the hovered node and its connections
          graphRef.current.forEachNode((n) => {
            if (!connectedNodes.has(n)) {
              // Store original visibility
              graphRef.current.setNodeAttribute(
                n,
                "originalHidden",
                graphRef.current.getNodeAttribute(n, "hidden") || false
              );
              graphRef.current.setNodeAttribute(n, "hidden", true);
            } else if (n !== node) {
              // Store original color for connected nodes
              graphRef.current.setNodeAttribute(
                n,
                "originalColor",
                graphRef.current.getNodeAttribute(n, "color")
              );
            }
          });

          graphRef.current.forEachEdge((edge) => {
            if (!connectedEdges.has(edge)) {
              // Store original visibility
              graphRef.current.setEdgeAttribute(
                edge,
                "originalHidden",
                graphRef.current.getEdgeAttribute(edge, "hidden") || false
              );
              graphRef.current.setEdgeAttribute(edge, "hidden", true);
            } else {
              // Highlight connected edges
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

          // Refresh the renderer
          renderer.refresh();
        })
        // Update the leaveNode event handler to be more robust
        .on("leaveNode", ({ node }) => {
          try {
            // Remove the tooltip
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

            // Restore original visibility and colors
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

            // Refresh the renderer
            renderer.refresh();
          } catch (err) {
            console.error("Error in leaveNode handler:", err);
          }
        });

      // Dark mode
      if (isDarkMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }

      // Apply filters
      applyFilters();

      // Clean up on unmount
      return () => {
        if (sigmaRef.current) {
          try {
            sigmaRef.current.kill();
          } catch (err) {
            console.error("Error killing Sigma instance on unmount:", err);
          }
        }
        // Clean up tooltips on unmount
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

  // Add this effect to clean up tooltips when language changes
  useEffect(() => {
    // Clean up tooltips when language changes
    return () => {
      cleanupTooltips();

      // Also kill sigma instance when language changes
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

  // Apply search filter
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

  // Toggle full screen mode
  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      // Make the graph container full screen
      containerRef.current.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Group connected nodes by type and relationship
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

    // Sort nodes within each group
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        // Sort by node type
        const typeOrder = { term: 1, definition: 2, category: 3 };
        if (a.nodeType !== b.nodeType) {
          return typeOrder[a.nodeType] - typeOrder[b.nodeType];
        }
        // Then alphabetically by label
        return a.label.localeCompare(b.label);
      });
    });

    return grouped;
  };

  // Get relationship type label
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

  // Get relationship type color
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

  // Get node type label
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

  // Toggle all node type filters
  const toggleAllNodeTypes = (value) => {
    setNodeTypeFilters({
      term: value,
      definition: value,
      category: value,
    });
  };

  // Toggle all category filters
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
                  { ...state, ratio: state.ratio / 2 }, // Zoom in by reducing ratio
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
                  { ...state, ratio: state.ratio * 2 }, // Zoom out by increasing ratio
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
>>>>>>> Stashed changes
