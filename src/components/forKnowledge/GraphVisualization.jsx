"use client";

<<<<<<< Updated upstream
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import ForceGraph2D from "react-force-graph-2d"
import GraphSearch from "./GraphSearch"
import GraphInfoPanel from "./GraphInfoPanel"
import "./GraphVisualization.css"

// Simple resize observer hook implementation
const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null)
=======
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Filter,
  Info,
  X,
  AlertTriangle,
  Book,
  FileText,
  Layers,
  Lock,
  Globe,
  ShieldAlert,
  Server,
  ShoppingCart,
  FileCode,
  Copyright,
  Briefcase,
  HelpCircle,
  Move,
} from "lucide-react";
import { getAllterms } from "../../services/Api";
import "./GraphVisualization.css";
import useIsMounted from "./useIsMounted";
import ForceGraph3D from "3d-force-graph";
import ForceGraph2D from "force-graph";
import SpriteText from "three-spritetext";

// Import graph libraries
import Graph from "graphology";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import DOMGraphRenderer from "./DOMGraphRenderer";

const GraphVisualization = ({
  language = "english",
  data,
  onNodeSelect,
  fallbackRenderer,
}) => {
  // State for UI controls
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [showCategories, setShowCategories] = useState(true);
  const [showTerms, setShowTerms] = useState(true);
  const [showDefinitions, setShowDefinitions] = useState(true);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [graphStats, setGraphStats] = useState({
    nodeCount: 0,
    edgeCount: 0,
    visibleNodes: 0,
    visibleEdges: 0,
  });
  const [layoutRunning, setLayoutRunning] = useState(false);
  const [termsData, setTermsData] = useState([]);
  const [apiStatus, setApiStatus] = useState({ status: "idle", message: "" });
  const [renderMode, setRenderMode] = useState("sigma"); // "sigma", "canvas", "dom"
  const [graphNodes, setGraphNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);
  const [relationshipTypes, setRelationshipTypes] = useState([]);
  const [visibleRelationshipTypes, setVisibleRelationshipTypes] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [availableClusters, setAvailableClusters] = useState([]);
  const [viewportCenter, setViewportCenter] = useState({ x: 0, y: 0 });
  const [viewportRadius, setViewportRadius] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [loadedNodeIds, setLoadedNodeIds] = useState(new Set());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [nodeLimit, setNodeLimit] = useState(100); // Initial node limit
  const [is3D, setIs3D] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [canvasSupported, setCanvasSupported] = useState(true);
  const [graphInstance, setGraphInstance] = useState(null);

  // Refs for graph elements
  const containerRef = useRef(null);
  const graphContainerRef = useRef(null);
  const sigmaRef = useRef(null);
  const graphRef = useRef(null);
  const layoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const fetchTimeoutRef = useRef(null);
  const canvasRef = useRef(null);
  const isMountedRef = useIsMounted();
  const panningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
>>>>>>> Stashed changes

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

  // Define relationship types
  const defineRelationshipTypes = useCallback(() => {
    const types = [
      { id: "category-term", name: "Category-Term", color: "#a78bfa" },
      { id: "term-definition", name: "Term-Definition", color: "#67e8f9" },
      { id: "term-term", name: "Term-Term", color: "#fb7185" },
      { id: "category-category", name: "Category-Category", color: "#f59e0b" },
      {
        id: "definition-definition",
        name: "Definition-Definition",
        color: "#10b981",
      },
    ];
    setRelationshipTypes(types);
    setVisibleRelationshipTypes(types.map((t) => t.id));
  }, []);

  // Check if WebGL is supported
  const checkWebGLSupport = useCallback(() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }, []);

  // Check for WebGL and Canvas support
  useEffect(() => {
<<<<<<< Updated upstream
    if (!ref.current) return

    const observeTarget = ref.current
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect)
      })
    })

    resizeObserver.observe(observeTarget)

    return () => {
      resizeObserver.unobserve(observeTarget)
    }
  }, [ref])

  return dimensions
}

// Mock data for fallback when API fails
const generateMockData = () => {
  const nodeCount = 50
  const nodes = []
  const links = []

  // Generate nodes
  for (let i = 1; i <= nodeCount; i++) {
    const nodeType = i % 3 === 0 ? "Term" : i % 3 === 1 ? "Definition" : "Category"
    nodes.push({
      id: `node-${i}`,
      name: `${nodeType} ${i}`,
      label: nodeType,
      category: nodeType,
      properties: {
        name: `${nodeType} ${i}`,
        description: `This is a mock ${nodeType.toLowerCase()} node`,
      },
    })
  }

  // Generate links
  for (let i = 1; i <= nodeCount; i++) {
    // Each node connects to 1-3 other nodes
    const linkCount = Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < linkCount; j++) {
      const target = Math.floor(Math.random() * nodeCount) + 1
      if (`node-${i}` !== `node-${target}`) {
        const linkType = j % 3 === 0 ? "HAS_DEFINITION" : j % 3 === 1 ? "BELONGS_TO" : "RELATED_TO"
        links.push({
          id: `link-${i}-${target}-${j}`,
          source: `node-${i}`,
          target: `node-${target}`,
          type: linkType,
        })
      }
=======
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl"))
        );
      } catch (e) {
        return false;
      }
    };

    const checkCanvasSupport = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext && canvas.getContext("2d"));
      } catch (e) {
        return false;
      }
    };

    setWebGLSupported(checkWebGLSupport());
    setCanvasSupported(checkCanvasSupport());
  }, []);

  // Category colors and icons mapping
  const categoryColors = {
    "Computer Crime": "#f472b6", // Pink
    "Personal Data": "#c084fc", // Purple
    "Electronic Commerce": "#38bdf8", // Sky blue
    Organization: "#a78bfa", // Violet
    Networks: "#22d3ee", // Cyan
    "Intellectual Property": "#818cf8", // Indigo
    Miscellaneous: "#fb7185", // Rose
    "Computer Science": "#60a5fa", // Blue
    "Criminalité informatique": "#f472b6",
    "Données personnelles": "#c084fc",
    "Commerce électronique": "#38bdf8",
    Organisation: "#a78bfa",
    Réseaux: "#22d3ee",
    "Propriété intellectuelle": "#818cf8",
    Divers: "#fb7185",
    Informatique: "#60a5fa",
    "جرائم الكمبيوتر": "#f472b6",
    "البيانات الشخصية": "#c084fc",
    "التجارة الإلكترونية": "#38bdf8",
    التنظيم: "#a78bfa",
    الشبكات: "#22d3ee",
    "الملكية الفكرية": "#818cf8",
    متنوع: "#fb7185",
    "علوم الكمبيوتر": "#60a5fa",
    Uncategorized: "#7f8c8d",
  };

  // Get category icon component
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Computer Crime":
      case "Criminalité informatique":
      case "جرائم الكمبيوتر":
        return <ShieldAlert size={16} />;
      case "Personal Data":
      case "Données personnelles":
      case "البيانات الشخصية":
        return <Lock size={16} />;
      case "Electronic Commerce":
      case "Commerce électronique":
      case "التجارة الإلكترونية":
        return <ShoppingCart size={16} />;
      case "Organization":
      case "Organisation":
      case "التنظيم":
        return <Briefcase size={16} />;
      case "Networks":
      case "Réseaux":
      case "الشبكات":
        return <Server size={16} />;
      case "Intellectual Property":
      case "Propriété intellectuelle":
      case "الملكية الفكرية":
        return <Copyright size={16} />;
      case "Computer Science":
      case "Informatique":
      case "علوم الكمبيوتر":
        return <FileCode size={16} />;
      case "Miscellaneous":
      case "Divers":
      case "متنوع":
        return <HelpCircle size={16} />;
      default:
        return <Globe size={16} />;
    }
  };

  // Relationship types and colors
  const relationshipTypesColors = {
    related_to: "#3498db",
    belongs_to: "#e74c3c",
    defines: "#2ecc71",
    references: "#9b59b6",
    has_definition: "#f39c12",
    default: "#7f8c8d",
  };

  // Cleanup function to handle all resource disposal
  const cleanupResources = () => {
    // Clear any pending timeouts
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }

    // Stop layout if running
    if (layoutRef.current) {
      try {
        layoutRef.current.stop();
        layoutRef.current = null;
      } catch (err) {
        console.error("Error stopping layout:", err);
      }
    }

    // Cancel any animation frames
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Kill Sigma instance
    if (sigmaRef.current) {
      try {
        sigmaRef.current.kill();
        sigmaRef.current = null;
      } catch (err) {
        console.error("Error killing Sigma instance:", err);
      }
    }

    // Clear graph reference
    graphRef.current = null;
  };

  // Initialize dark mode and fullscreen state
  useEffect(() => {
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode !== false); // Default to true if not set

    if (savedDarkMode !== false) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }

    // Set up resize observer to ensure container has dimensions
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // If container has zero width, set explicit dimensions
          if (entry.contentRect.width === 0) {
            containerRef.current.style.width = "100%";
            containerRef.current.style.height = "100%";
          }
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }

    return cleanupResources;
  }, []);

  // Fetch data when component mounts or language changes
  useEffect(() => {
    fetchTermsData();

    // Cleanup when component unmounts or language changes
    return cleanupResources;
  }, [language]);

  // Fetch terms data from API with timeout and error handling
  const fetchTermsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setApiStatus({ status: "loading", message: "Fetching data..." });
      setInitialLoadComplete(false);
      setLoadedNodeIds(new Set());

      // Define relationship types
      defineRelationshipTypes();

      // Check WebGL support
      const hasWebGL = checkWebGLSupport();

      // Set render mode based on capabilities
      if (!hasWebGL) {
        setRenderMode("dom");
      }

      // Clear any existing timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      // Set a timeout for the API call
      const timeoutPromise = new Promise((_, reject) => {
        fetchTimeoutRef.current = setTimeout(() => {
          reject(new Error("API request timed out after 10 seconds"));
        }, 10000);
      });

      const languageCode = getLanguageCode();
      console.log(`Fetching terms data for language: ${languageCode}`);

      // Race between the API call and the timeout
      const data = await Promise.race([
        getAllterms(languageCode),
        timeoutPromise,
      ]);

      // Clear the timeout since we got a response
      clearTimeout(fetchTimeoutRef.current);

      if (!data) {
        throw new Error("No data received from API");
      }

      if (Array.isArray(data) && data.length === 0) {
        throw new Error("API returned empty data");
      }

      console.log(`Received ${data.length} terms from API`);
      setTermsData(data);
      setApiStatus({
        status: "success",
        message: `Loaded ${data.length} terms`,
      });

      // Initialize graph with the fetched data
      initializeGraph(data);
    } catch (err) {
      console.error("Error fetching terms data:", err);
      setError(`Failed to load terms data: ${err.message || "Unknown error"}`);
      setApiStatus({
        status: "error",
        message: err.message || "Unknown error",
      });
      setIsLoading(false);

      // Use mock data as fallback
      const mockData = getMockData(getLanguageCode());
      if (mockData && mockData.length > 0) {
        console.log("Using mock data as fallback");
        setTermsData(mockData);
        initializeGraph(mockData);
      }
    }
  };

  // Generate mock data as fallback
  const getMockData = (languageCode) => {
    // Simple mock data structure that matches the API response format
    const mockData = [
      {
        id: "1",
        name:
          languageCode === "fr"
            ? "Internet"
            : languageCode === "ar"
            ? "إنترنت"
            : "Internet",
        definitions: [
          {
            text:
              languageCode === "fr"
                ? "Réseau informatique mondial accessible au public."
                : languageCode === "ar"
                ? "شبكة معلوماتية عالمية متاحة للجمهور."
                : "Global computer network accessible to the public.",
            language: languageCode,
            type: "primary",
            categories: ["Networks"],
            relatedTerms: [
              { name: "Web", id: "2" },
              { name: "Network", id: "3" },
            ],
          },
        ],
      },
      {
        id: "2",
        name:
          languageCode === "fr" ? "Web" : languageCode === "ar" ? "ويب" : "Web",
        definitions: [
          {
            text:
              languageCode === "fr"
                ? "Système hypertexte public fonctionnant sur Internet."
                : languageCode === "ar"
                ? "نظام نص تشعبي عام يعمل على الإنترنت."
                : "Public hypertext system operating on the Internet.",
            language: languageCode,
            type: "primary",
            categories: ["Networks"],
            relatedTerms: [{ name: "Internet", id: "1" }],
          },
        ],
      },
      {
        id: "3",
        name:
          languageCode === "fr"
            ? "Réseau"
            : languageCode === "ar"
            ? "شبكة"
            : "Network",
        definitions: [
          {
            text:
              languageCode === "fr"
                ? "Ensemble d'ordinateurs et de périphériques connectés les uns aux autres."
                : languageCode === "ar"
                ? "مجموعة من أجهزة الكمبيوتر والأجهزة الطرفية المتصلة ببعضها البعض."
                : "Collection of computers and peripherals connected to each other.",
            language: languageCode,
            type: "primary",
            categories: ["Networks"],
            relatedTerms: [{ name: "Internet", id: "1" }],
          },
        ],
      },
      {
        id: "4",
        name:
          languageCode === "fr"
            ? "Données personnelles"
            : languageCode === "ar"
            ? "بيانات شخصية"
            : "Personal Data",
        definitions: [
          {
            text:
              languageCode === "fr"
                ? "Informations relatives à une personne physique identifiée ou identifiable."
                : languageCode === "ar"
                ? "معلومات تتعلق بشخص طبيعي محدد أو قابل للتحديد."
                : "Information relating to an identified or identifiable natural person.",
            language: languageCode,
            type: "primary",
            categories: ["Personal Data"],
            relatedTerms: [],
          },
        ],
      },
    ];

    return mockData;
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    try {
      setIsFullscreen(!isFullscreen);

      // Allow time for the container to resize before refreshing sigma
      setTimeout(() => {
        if (sigmaRef.current) {
          sigmaRef.current.refresh();
        }
      }, 100);
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
      // Continue without crashing the app
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    try {
      setDarkMode(!darkMode);
      document.body.classList.toggle("dark-mode");

      // Store preference in localStorage
      localStorage.setItem("darkMode", (!darkMode).toString());

      // Dispatch event for other components
      window.dispatchEvent(new Event("darkModeChanged"));
    } catch (err) {
      console.error("Error toggling dark mode:", err);
      // Continue without crashing the app
>>>>>>> Stashed changes
    }
  };

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
    setIsInfoPanelOpen(false);
  };

<<<<<<< Updated upstream
  return { nodes, links }
}

// Helper function to generate a deterministic position based on node ID
const generateDeterministicPosition = (id, radius = 500) => {
  // Create a simple hash from the ID string
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
=======
  // Toggle info panel
  const toggleInfoPanel = () => {
    setIsInfoPanelOpen(!isInfoPanelOpen);
    setIsFilterPanelOpen(false);
  };

  // Toggle legend visibility
  const toggleLegend = () => {
    setIsLegendVisible(!isLegendVisible);
  };

  // Reset view
  const resetView = () => {
    try {
      if (sigmaRef.current) {
        sigmaRef.current.getCamera().animatedReset();
      }

      // Reset search
      setSearchQuery("");

      // Reset selected and hovered nodes
      setSelectedNode(null);
      setHoveredNode(null);

      // Reset cluster selection
      setSelectedCluster(null);

      // Reset visibility filters
      setShowCategories(true);
      setShowTerms(true);
      setShowDefinitions(true);

      // Apply visibility to graph
      if (graphRef.current) {
        graphRef.current.forEachNode((node) => {
          graphRef.current.setNodeAttribute(node, "hidden", false);
        });

        graphRef.current.forEachEdge((edge) => {
          graphRef.current.setEdgeAttribute(edge, "hidden", false);
        });

        if (sigmaRef.current) {
          sigmaRef.current.refresh();
        }
      }

      // Reset viewport center and load initial nodes
      setViewportCenter({ x: 0, y: 0 });
      loadNodesInViewport({ x: 0, y: 0 }, viewportRadius);
    } catch (err) {
      console.error("Error resetting view:", err);
      // Provide fallback behavior
      if (sigmaRef.current) {
        try {
          sigmaRef.current.getCamera().reset();
        } catch (innerErr) {
          console.error("Fallback reset also failed:", innerErr);
        }
      }
    }
  };

  // Zoom in
  const zoomIn = () => {
    try {
      if (sigmaRef.current) {
        const camera = sigmaRef.current.getCamera();
        const ratio = camera.getState().ratio / 1.5;
        camera.animate({ ratio }, { duration: 200 });
      }
    } catch (err) {
      console.error("Error zooming in:", err);
      // Provide fallback behavior
      if (sigmaRef.current) {
        try {
          const camera = sigmaRef.current.getCamera();
          camera.setState({ ratio: camera.getState().ratio / 1.5 });
        } catch (innerErr) {
          console.error("Fallback zoom in also failed:", innerErr);
        }
      }
    }
  };

  // Zoom out
  const zoomOut = () => {
    try {
      if (sigmaRef.current) {
        const camera = sigmaRef.current.getCamera();
        const ratio = camera.getState().ratio * 1.5;
        camera.animate({ ratio }, { duration: 200 });
      }
    } catch (err) {
      console.error("Error zooming out:", err);
      // Provide fallback behavior
      if (sigmaRef.current) {
        try {
          const camera = sigmaRef.current.getCamera();
          camera.setState({ ratio: camera.getState().ratio * 1.5 });
        } catch (innerErr) {
          console.error("Fallback zoom out also failed:", innerErr);
        }
      }
    }
  };

  // Toggle force-directed layout
  const toggleLayout = () => {
    if (layoutRunning) {
      stopLayout();
    } else {
      startLayout();
    }
  };

  // Start force-directed layout with error handling
  const startLayout = () => {
    try {
      if (!graphRef.current) {
        console.error("Cannot start layout: Graph instance not available");
        return;
      }

      setLayoutRunning(true);

      // Configure the layout
      const settings = {
        gravity: 1,
        scalingRatio: 10,
        strongGravityMode: true,
        slowDown: 10,
        edgeWeightInfluence: 1,
        linLogMode: true,
        outboundAttractionDistribution: false,
        adjustSizes: true,
      };

      // Create a layout instance
      layoutRef.current = forceAtlas2(graphRef.current, { settings });

      // Start the layout
      layoutRef.current.start();

      // Animation loop to update the rendering
      const animate = () => {
        try {
          if (layoutRef.current && sigmaRef.current) {
            layoutRef.current.tick();
            sigmaRef.current.refresh();
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        } catch (err) {
          console.error("Error in layout animation loop:", err);
          stopLayout(); // Stop the layout if there's an error
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    } catch (err) {
      console.error("Error starting layout:", err);
      setLayoutRunning(false);
      setError("Failed to start layout algorithm. Try refreshing the page.");
    }
  };

  // Stop force-directed layout with error handling
  const stopLayout = () => {
    try {
      if (layoutRef.current) {
        layoutRef.current.stop();
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      setLayoutRunning(false);
    } catch (err) {
      console.error("Error stopping layout:", err);
      // Force the state to be correct even if there was an error
      setLayoutRunning(false);
    }
  };

  // Handle search with error handling
  const handleSearch = (e) => {
    try {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      if (!graphRef.current) {
        console.warn("Cannot search: Graph instance not available");
        return;
      }

      if (query.trim() === "") {
        // Reset all nodes visibility
        graphRef.current.forEachNode((node) => {
          try {
            graphRef.current.setNodeAttribute(
              node,
              "hidden",
              (!showCategories &&
                graphRef.current.getNodeAttribute(node, "nodeType") ===
                  "category") ||
                (!showTerms &&
                  graphRef.current.getNodeAttribute(node, "nodeType") ===
                    "term") ||
                (!showDefinitions &&
                  graphRef.current.getNodeAttribute(node, "nodeType") ===
                    "definition")
            );
          } catch (nodeErr) {
            console.error(
              `Error setting visibility for node ${node}:`,
              nodeErr
            );
          }
        });
      } else {
        // Show/hide nodes based on search
        graphRef.current.forEachNode((node) => {
          try {
            const label = (
              graphRef.current.getNodeAttribute(node, "label") || ""
            ).toLowerCase();
            const content = (
              graphRef.current.getNodeAttribute(node, "content") || ""
            ).toLowerCase();
            const matches = label.includes(query) || content.includes(query);

            // If node matches, show it and its direct connections
            if (matches) {
              graphRef.current.setNodeAttribute(node, "hidden", false);

              // Show connected nodes
              graphRef.current.forEachNeighbor(node, (neighbor) => {
                try {
                  graphRef.current.setNodeAttribute(neighbor, "hidden", false);
                } catch (neighborErr) {
                  console.error(
                    `Error setting visibility for neighbor ${neighbor}:`,
                    neighborErr
                  );
                }
              });
            } else {
              // Check if this node is connected to any matching node
              let isConnectedToMatch = false;
              graphRef.current.forEachNeighbor(node, (neighbor) => {
                try {
                  const neighborLabel = (
                    graphRef.current.getNodeAttribute(neighbor, "label") || ""
                  ).toLowerCase();
                  const neighborContent = (
                    graphRef.current.getNodeAttribute(neighbor, "content") || ""
                  ).toLowerCase();
                  if (
                    neighborLabel.includes(query) ||
                    neighborContent.includes(query)
                  ) {
                    isConnectedToMatch = true;
                  }
                } catch (neighborErr) {
                  console.error(
                    `Error checking neighbor ${neighbor}:`,
                    neighborErr
                  );
                }
              });

              graphRef.current.setNodeAttribute(
                node,
                "hidden",
                !isConnectedToMatch
              );
            }
          } catch (nodeErr) {
            console.error(`Error processing search for node ${node}:`, nodeErr);
          }
        });

        // If we have matching nodes, center the view on the first one
        if (sigmaRef.current) {
          const matchingNodes = [];
          graphRef.current.forEachNode((node) => {
            const label = (
              graphRef.current.getNodeAttribute(node, "label") || ""
            ).toLowerCase();
            const content = (
              graphRef.current.getNodeAttribute(node, "content") || ""
            ).toLowerCase();
            if (label.includes(query) || content.includes(query)) {
              matchingNodes.push(node);
            }
          });

          if (matchingNodes.length > 0) {
            const firstNode = matchingNodes[0];
            const nodeAttributes =
              graphRef.current.getNodeAttributes(firstNode);
            sigmaRef.current
              .getCamera()
              .animate(
                { x: nodeAttributes.x, y: nodeAttributes.y, ratio: 0.5 },
                { duration: 500 }
              );
          }
        }
      }

      // Refresh the renderer
      if (sigmaRef.current) {
        sigmaRef.current.refresh();
      }

      // Update stats
      updateGraphStats();
    } catch (err) {
      console.error("Error during search:", err);
      // Don't set error state to avoid disrupting the UI
    }
  };

  // Toggle node type visibility with error handling
  const toggleNodeTypeVisibility = (type) => {
    try {
      if (type === "category") {
        setShowCategories(!showCategories);
      } else if (type === "term") {
        setShowTerms(!showTerms);
      } else if (type === "definition") {
        setShowDefinitions(!showDefinitions);
      }

      if (!graphRef.current) {
        console.warn("Cannot toggle visibility: Graph instance not available");
        return;
      }

      // Update node visibility
      graphRef.current.forEachNode((node) => {
        try {
          const nodeType = graphRef.current.getNodeAttribute(node, "nodeType");

          if (nodeType === type) {
            const shouldHide =
              type === "category"
                ? !showCategories
                : type === "term"
                ? !showTerms
                : type === "definition"
                ? !showDefinitions
                : false;

            graphRef.current.setNodeAttribute(node, "hidden", !shouldHide);
          }
        } catch (nodeErr) {
          console.error(`Error toggling visibility for node ${node}:`, nodeErr);
        }
      });

      // Refresh the renderer
      if (sigmaRef.current) {
        sigmaRef.current.refresh();
      }

      // Update stats
      updateGraphStats();
    } catch (err) {
      console.error(`Error toggling ${type} visibility:`, err);
      // Don't set error state to avoid disrupting the UI
    }
  };

  // Toggle relationship type visibility
  const toggleRelationshipType = (typeId) => {
    setVisibleRelationshipTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((id) => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });

    // Update edge visibility if graph is available
    if (graphRef.current && sigmaRef.current) {
      const graph = graphRef.current;
      const newVisibleTypes = visibleRelationshipTypes.includes(typeId)
        ? visibleRelationshipTypes.filter((id) => id !== typeId)
        : [...visibleRelationshipTypes, typeId];

      graph.forEachEdge((edgeId) => {
        const edgeAttrs = graph.getEdgeAttributes(edgeId);
        const typeHidden = !newVisibleTypes.includes(
          edgeAttrs.edgeType || edgeAttrs.type
        );

        // Also check if source or target is hidden
        const source = graph.source(edgeId);
        const target = graph.target(edgeId);
        const sourceHidden = graph.getNodeAttribute(source, "hidden");
        const targetHidden = graph.getNodeAttribute(target, "hidden");

        graph.setEdgeAttribute(
          edgeId,
          "hidden",
          sourceHidden || targetHidden || typeHidden
        );
      });

      sigmaRef.current.refresh();

      // Update stats
      updateGraphStats();
    }
  };

  // Select a cluster
  const selectCluster = (categoryId) => {
    try {
      if (!graphRef.current || !sigmaRef.current) {
        console.warn("Cannot select cluster: Graph instance not available");
        return;
      }

      // If already selected, deselect
      if (selectedCluster === categoryId) {
        setSelectedCluster(null);

        // Show all nodes based on current filters
        graphRef.current.forEachNode((nodeId) => {
          const nodeType = graphRef.current.getNodeAttribute(
            nodeId,
            "nodeType"
          );
          const shouldHide =
            (nodeType === "category" && !showCategories) ||
            (nodeType === "term" && !showTerms) ||
            (nodeType === "definition" && !showDefinitions);

          graphRef.current.setNodeAttribute(nodeId, "hidden", shouldHide);
        });

        // Show all edges based on current filters
        graphRef.current.forEachEdge((edgeId) => {
          const edgeType = graphRef.current.getEdgeAttribute(
            edgeId,
            "edgeType"
          );
          const typeHidden = !visibleRelationshipTypes.includes(edgeType);

          // Also check if source or target is hidden
          const source = graphRef.current.source(edgeId);
          const target = graphRef.current.target(edgeId);
          const sourceHidden = graphRef.current.getNodeAttribute(
            source,
            "hidden"
          );
          const targetHidden = graphRef.current.getNodeAttribute(
            target,
            "hidden"
          );

          graphRef.current.setEdgeAttribute(
            edgeId,
            "hidden",
            sourceHidden || targetHidden || typeHidden
          );
        });
      } else {
        setSelectedCluster(categoryId);

        // Get the category name
        const categoryNode = graphRef.current.getNodeAttributes(categoryId);
        const categoryName = categoryNode.category || categoryNode.label;

        // Hide all nodes first
        graphRef.current.forEachNode((nodeId) => {
          graphRef.current.setNodeAttribute(nodeId, "hidden", true);
        });

        // Show the category node
        graphRef.current.setNodeAttribute(categoryId, "hidden", false);

        // Find all terms in this category and their definitions
        const relatedNodes = new Set([categoryId]);

        // First, find all terms directly connected to this category
        graphRef.current.forEachNeighbor(categoryId, (neighborId) => {
          const neighborType = graphRef.current.getNodeAttribute(
            neighborId,
            "nodeType"
          );
          if (neighborType === "term") {
            relatedNodes.add(neighborId);
            graphRef.current.setNodeAttribute(neighborId, "hidden", false);

            // Then find all definitions connected to these terms
            graphRef.current.forEachNeighbor(neighborId, (defId) => {
              const defType = graphRef.current.getNodeAttribute(
                defId,
                "nodeType"
              );
              if (defType === "definition") {
                relatedNodes.add(defId);
                graphRef.current.setNodeAttribute(defId, "hidden", false);
              }
            });
          }
        });

        // Show edges between visible nodes
        graphRef.current.forEachEdge((edgeId) => {
          const source = graphRef.current.source(edgeId);
          const target = graphRef.current.target(edgeId);
          const edgeType = graphRef.current.getEdgeAttribute(
            edgeId,
            "edgeType"
          );
          const typeHidden = !visibleRelationshipTypes.includes(edgeType);

          const isVisible =
            relatedNodes.has(source) && relatedNodes.has(target) && !typeHidden;
          graphRef.current.setEdgeAttribute(edgeId, "hidden", !isVisible);
        });

        // Center the view on the category node
        sigmaRef.current
          .getCamera()
          .animate(
            { x: categoryNode.x, y: categoryNode.y, ratio: 0.8 },
            { duration: 500 }
          );
      }

      // Refresh the renderer
      sigmaRef.current.refresh();

      // Update stats
      updateGraphStats();
    } catch (err) {
      console.error("Error selecting cluster:", err);
      // Don't set error state to avoid disrupting the UI
    }
  };

  // Update graph statistics
  const updateGraphStats = () => {
    if (!graphRef.current) return;

    try {
      let visibleNodes = 0;
      let visibleEdges = 0;
      let termCount = 0;
      let definitionCount = 0;
      let categoryCount = 0;

      graphRef.current.forEachNode((nodeId) => {
        const nodeType = graphRef.current.getNodeAttribute(nodeId, "nodeType");
        const isHidden = graphRef.current.getNodeAttribute(nodeId, "hidden");

        if (!isHidden) {
          visibleNodes++;
        }

        if (nodeType === "term") {
          termCount++;
        } else if (nodeType === "definition") {
          definitionCount++;
        } else if (nodeType === "category") {
          categoryCount++;
        }
      });

      graphRef.current.forEachEdge((edgeId) => {
        if (!graphRef.current.getEdgeAttribute(edgeId, "hidden")) {
          visibleEdges++;
        }
      });

      setGraphStats({
        nodeCount: graphRef.current.order,
        edgeCount: graphRef.current.size,
        visibleNodes,
        visibleEdges,
        termCount,
        definitionCount,
        categoryCount,
      });
    } catch (err) {
      console.error("Error updating graph stats:", err);
    }
  };

  // Load nodes in the current viewport
  const loadNodesInViewport = (center, radius) => {
    if (!graphRef.current || !termsData || termsData.length === 0) return;

    try {
      const newLoadedNodeIds = new Set(loadedNodeIds);
      let nodesAdded = 0;
      const maxNodesToAdd = 50; // Limit how many nodes we add at once

      // Calculate which nodes should be in the viewport
      termsData.forEach((term, index) => {
        // Skip if we've already loaded enough nodes
        if (nodesAdded >= maxNodesToAdd) return;

        // Skip if we've already loaded this node
        const termId = `term-${term.id}`;
        if (newLoadedNodeIds.has(termId)) return;

        // Calculate position based on index
        const angle = (index * 2 * Math.PI) / termsData.length;
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);

        // Check if this position is within our viewport
        const distance = Math.sqrt(
          Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)
        );
        if (distance <= radius) {
          // Add this node to the graph
          addNodeToGraph(term, x, y);
          newLoadedNodeIds.add(termId);
          nodesAdded++;
        }
      });

      // Update the set of loaded node IDs
      setLoadedNodeIds(newLoadedNodeIds);

      // Update stats
      updateGraphStats();

      // If this is the first load, mark it as complete
      if (!initialLoadComplete && nodesAdded > 0) {
        setInitialLoadComplete(true);
      }
    } catch (err) {
      console.error("Error loading nodes in viewport:", err);
    }
  };

  // Add a node to the graph
  const addNodeToGraph = (term, x, y) => {
    if (!graphRef.current) return;

    try {
      const termId = `term-${term.id}`;

      // Skip if node already exists
      if (graphRef.current.hasNode(termId)) return;

      // Get the first definition to determine category
      const firstDef =
        term.definitions && term.definitions.length > 0
          ? term.definitions[0]
          : null;
      const termCategories =
        firstDef && firstDef.categories
          ? firstDef.categories
          : ["Uncategorized"];
      const primaryCategory = termCategories[0] || "Uncategorized";

      // Add the term node
      graphRef.current.addNode(termId, {
        label: term.name,
        type: "circle",
        nodeType: "term",
        category: primaryCategory,
        content: "",
        size: 10,
        color:
          categoryColors[primaryCategory] || categoryColors["Uncategorized"],
        hidden: false,
        highlighted: false,
        x: x,
        y: y,
      });

      // Add all categories from this term
      termCategories.forEach((category) => {
        if (!category) return;

        // Create category node if it doesn't exist
        const categoryId = `category-${category
          .replace(/\s+/g, "-")
          .toLowerCase()}`;

        if (!graphRef.current.hasNode(categoryId)) {
          graphRef.current.addNode(categoryId, {
            label: category,
            type: "circle",
            nodeType: "category",
            category: category,
            content: "",
            size: 15,
            color: categoryColors[category] || categoryColors["Uncategorized"],
            icon: getCategoryIcon(category) || getCategoryIcon("Uncategorized"),
            hidden: false,
            highlighted: false,
            x: x + Math.random() * 10 - 5,
            y: y + Math.random() * 10 - 5,
          });
        }

        // Add edge from term to category if it doesn't already exist
        if (
          !graphRef.current.hasEdge(termId, categoryId) &&
          !graphRef.current.hasEdge(categoryId, termId)
        ) {
          graphRef.current.addEdge(termId, categoryId, {
            type: "arrow", // Use standard Sigma edge type
            edgeType: "category-term", // Keep our custom type in a different attribute
            size: 1,
            color: relationshipTypesColors["belongs_to"],
            hidden: false,
            highlighted: false,
            label: "belongs to",
          });
        }
      });

      // Add definitions as nodes
      if (term.definitions && term.definitions.length > 0) {
        term.definitions.forEach((def, index) => {
          if (!def || !def.text) return;

          const defId = `def-${term.id}-${index}`;

          // Skip if definition node already exists
          if (graphRef.current.hasNode(defId)) return;

          // Truncate long definition texts for the label
          const shortText =
            def.text.length > 30 ? def.text.substring(0, 30) + "..." : def.text;

          graphRef.current.addNode(defId, {
            label: shortText,
            type: "circle",
            nodeType: "definition",
            category: primaryCategory,
            content: def.text,
            fullText: def.text,
            size: 7,
            color: "#95a5a6", // Gray color for definitions
            hidden: false,
            highlighted: false,
            x: x + Math.random() * 5 - 2.5,
            y: y + Math.random() * 5 - 2.5,
          });

          // Add edge from term to definition
          if (
            !graphRef.current.hasEdge(termId, defId) &&
            !graphRef.current.hasEdge(defId, termId)
          ) {
            graphRef.current.addEdge(termId, defId, {
              type: "arrow", // Use standard Sigma edge type
              edgeType: "term-definition", // Keep our custom type in a different attribute
              size: 1,
              color: relationshipTypesColors["has_definition"],
              hidden: false,
              highlighted: false,
              label: "defines",
            });
          }
        });
      }

      // Add edges between related terms
      if (term.definitions) {
        term.definitions.forEach((def) => {
          if (!def || !def.relatedTerms) return;

          def.relatedTerms.forEach((relatedTerm) => {
            if (!relatedTerm || !relatedTerm.id) return;

            const relatedTermId = `term-${relatedTerm.id}`;

            // Only add edge if the related term exists in the graph
            if (
              graphRef.current.hasNode(relatedTermId) &&
              !graphRef.current.hasEdge(termId, relatedTermId) &&
              !graphRef.current.hasEdge(relatedTermId, termId)
            ) {
              graphRef.current.addEdge(termId, relatedTermId, {
                type: "arrow", // Use standard Sigma edge type
                edgeType: "term-term", // Keep our custom type in a different attribute
                size: 1,
                color: relationshipTypesColors["related_to"],
                hidden: false,
                highlighted: false,
                label: "related to",
              });
            }
          });
        });
      }

      // Refresh the renderer if available
      if (sigmaRef.current) {
        sigmaRef.current.refresh();
      }
    } catch (err) {
      console.error(`Error adding node to graph for term ${term.id}:`, err);
    }
  };

  // Handle camera movement to load new nodes
  const handleCameraUpdate = (event) => {
    if (!initialLoadComplete) return;

    try {
      const camera = event.target;
      const state = camera.getState();
      const newCenter = { x: state.x, y: state.y };

      // Check if we've moved far enough to load new nodes
      const distance = Math.sqrt(
        Math.pow(newCenter.x - viewportCenter.x, 2) +
          Math.pow(newCenter.y - viewportCenter.y, 2)
      );

      if (distance > viewportRadius / 2) {
        setViewportCenter(newCenter);
        loadNodesInViewport(newCenter, viewportRadius);
      }
    } catch (err) {
      console.error("Error handling camera update:", err);
    }
  };

  // Toggle render mode
  const toggleRenderMode = () => {
    const modes = ["sigma", "canvas", "dom"];
    const currentIndex = modes.indexOf(renderMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const newMode = modes[nextIndex];

    setRenderMode(newMode);

    // Re-initialize graph with the new renderer
    setTimeout(() => {
      if (termsData.length > 0) {
        initializeGraph(termsData);
      }
    }, 100);
  };

  // Initialize graph
  useEffect(() => {
    if (!data && !containerRef.current) return;

    // Clear previous graph
    if (graphRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Determine which renderer to use
    let graph;
    if (webGLSupported && is3D) {
      graph = ForceGraph3D()(containerRef.current);
    } else if (canvasSupported) {
      graph = ForceGraph2D()(containerRef.current);
      setIs3D(false);
    } else {
      // Use fallback DOM-based renderer
      return;
    }

    // Configure graph
    graph
      .graphData(data)
      .backgroundColor("#1a1a1a")
      .nodeColor((node) => {
        // Color nodes based on category or type
        const colors = {
          term: "#3a8eff",
          definition: "#4cd964",
          concept: "#ff3b30",
          category: "#ff9500",
          entity: "#af52de",
        };

        return colors[node.type] || colors[node.category] || "#cccccc";
      })
      .nodeLabel(
        (node) =>
          `${node.name}${node.description ? `: ${node.description}` : ""}`
      )
      .linkColor(() => "rgba(255, 255, 255, 0.2)")
      .linkWidth((link) => link.value || 1)
      .onNodeClick((node) => {
        setSelectedNode(node);
        if (onNodeSelect) onNodeSelect(node);

        // Focus on the node
        const distance = 40;
        const distRatio =
          1 + distance / Math.hypot(node.x, node.y, node.z || 0);

        if (is3D) {
          graph.cameraPosition(
            {
              x: node.x * distRatio,
              y: node.y * distRatio,
              z: (node.z || 0) * distRatio,
            },
            node,
            2000
          );
        } else {
          graph.centerAt(node.x, node.y, 1000);
          graph.zoom(2, 1000);
        }
      })
      .onNodeHover((node) => {
        setHoveredNode(node);
        containerRef.current.style.cursor = node ? "pointer" : "default";
      });

    // 3D specific configurations
    if (is3D) {
      graph
        .nodeThreeObject((node) => {
          // Create a sprite text for the node label
          const sprite = new SpriteText(node.name);
          sprite.color = node === selectedNode ? "#ffffff" : "#cccccc";
          sprite.backgroundColor =
            node === selectedNode
              ? "rgba(58, 142, 255, 0.8)"
              : "rgba(0, 0, 0, 0.6)";
          sprite.borderColor = node === hoveredNode ? "#ffffff" : "transparent";
          sprite.borderWidth = node === hoveredNode ? 0.1 : 0;
          sprite.padding = 2;
          sprite.textHeight = node.importance ? node.importance * 2 : 2;
          return sprite;
        })
        .linkThreeObjectExtend(true)
        .linkThreeObject((link) => {
          // Create a sprite text for the link label
          if (link.type) {
            const sprite = new SpriteText(link.type);
            sprite.color = "#aaaaaa";
            sprite.backgroundColor = "rgba(0, 0, 0, 0.6)";
            sprite.padding = 1;
            sprite.textHeight = 1.5;
            return sprite;
          }
          return null;
        })
        .linkPositionUpdate((sprite, { start, end }) => {
          if (!sprite) return;
          // Position the link label at the middle of the link
          const middlePos = {
            x: start.x + (end.x - start.x) / 2,
            y: start.y + (end.y - start.y) / 2,
            z: (start.z || 0) + ((end.z || 0) - (start.z || 0)) / 2,
          };
          Object.assign(sprite.position, middlePos);
        });
    } else {
      // 2D specific configurations
      graph.nodeCanvasObject((node, ctx, globalScale) => {
        const label = node.name;
        const fontSize = node.importance ? node.importance * 3 : 3;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        );

        // Node background
        ctx.fillStyle =
          node === selectedNode
            ? "rgba(58, 142, 255, 0.8)"
            : "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(
          node.x - bckgDimensions[0] / 2,
          node.y - bckgDimensions[1] / 2,
          bckgDimensions[0],
          bckgDimensions[1]
        );

        // Node border on hover
        if (node === hoveredNode) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            bckgDimensions[0],
            bckgDimensions[1]
          );
        }

        // Node text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = node === selectedNode ? "#ffffff" : "#cccccc";
        ctx.fillText(label, node.x, node.y);
      });
    }

    // Save references
    graphRef.current = graph;
    setGraphInstance(graph);

    // Adjust graph size to container
    const resizeGraph = () => {
      if (graphRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        graphRef.current.width(width);
        graphRef.current.height(height);
      }
    };

    // Initial resize and add listener
    resizeGraph();
    window.addEventListener("resize", resizeGraph);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeGraph);
    };
  }, [
    data,
    webGLSupported,
    canvasSupported,
    is3D,
    selectedNode,
    hoveredNode,
    onNodeSelect,
  ]);

  // Initialize the graph with the fetched data
  const initializeGraph = (data) => {
    try {
      // Add error tracking
      let errorCount = 0;
      const maxErrors = 50; // Limit errors to prevent console flooding
      const trackError = (message, err) => {
        if (errorCount < maxErrors) {
          console.error(message, err);
          errorCount++;
          if (errorCount === maxErrors) {
            console.warn(
              "Maximum error count reached. Suppressing further errors."
            );
          }
        }
      };

      // Clean up any existing graph
      cleanupResources();

      // Deduplicate the data if needed
      const processedIds = new Set();
      const deduplicatedData = [];

      data.forEach((term) => {
        if (term && term.id && !processedIds.has(term.id)) {
          processedIds.add(term.id);
          deduplicatedData.push(term);
        }
      });

      console.log(
        `Deduplicated data: ${data.length} items -> ${deduplicatedData.length} unique items`
      );

      // Create a new graph with multi-edge support to prevent duplicate edge errors
      const graph = new Graph({ multi: false, allowSelfLoops: false });
      graphRef.current = graph;

      // Reset loaded node IDs
      setLoadedNodeIds(new Set());

      // Extract all unique categories
      const categories = new Set();
      deduplicatedData.forEach((term) => {
        if (term.definitions && term.definitions.length > 0) {
          term.definitions.forEach((def) => {
            if (def.categories && def.categories.length > 0) {
              def.categories.forEach((category) => {
                if (category) categories.add(category);
              });
            }
          });
        }
      });

      // Create category nodes first
      const categoryNodes = [];
      categories.forEach((category) => {
        const categoryId = `category-${category
          .replace(/\s+/g, "-")
          .toLowerCase()}`;
        const angle = Math.random() * 2 * Math.PI;
        const radius = 30;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        graph.addNode(categoryId, {
          label: category,
          type: "circle",
          nodeType: "category",
          category: category,
          content: "",
          size: 15,
          color: categoryColors[category] || categoryColors["Uncategorized"],
          icon: getCategoryIcon(category) || getCategoryIcon("Uncategorized"),
          hidden: false,
          highlighted: false,
          x: x,
          y: y,
        });

        categoryNodes.push({
          id: categoryId,
          label: category,
          type: "category",
          nodeType: "category",
          category: category,
          content: "",
          size: 15,
          color: categoryColors[category] || categoryColors["Uncategorized"],
          icon: getCategoryIcon(category) || getCategoryIcon("Uncategorized"),
          hidden: false,
          highlighted: false,
          x: x,
          y: y,
        });
      });

      // Store available clusters
      setAvailableClusters(Array.from(categories));

      // Load initial nodes (limited to nodeLimit)
      const initialNodes = deduplicatedData.slice(0, nodeLimit);
      initialNodes.forEach((term, index) => {
        const angle = (index * 2 * Math.PI) / initialNodes.length;
        const radius = 20;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        addNodeToGraph(term, x, y);
        setLoadedNodeIds((prev) => new Set([...prev, `term-${term.id}`]));
      });

      // Set initial viewport center
      setViewportCenter({ x: 0, y: 0 });
      setInitialLoadComplete(true);

      // Store nodes and edges for alternative renderers
      const nodes = [];
      const edges = [];

      graph.forEachNode((nodeId) => {
        const nodeAttrs = graph.getNodeAttributes(nodeId);
        nodes.push({
          id: nodeId,
          ...nodeAttrs,
        });
      });

      graph.forEachEdge((edgeId) => {
        const edgeAttrs = graph.getEdgeAttributes(edgeId);
        const source = graph.source(edgeId);
        const target = graph.target(edgeId);
        edges.push({
          id: edgeId,
          source,
          target,
          ...edgeAttrs,
        });
      });

      setGraphNodes(nodes);
      setGraphEdges(edges);

      // Update graph stats
      updateGraphStats();

      // Initialize Sigma renderer
      if (containerRef.current && renderMode === "sigma") {
        try {
          // Clear the container
          containerRef.current.innerHTML = "";

          // Create Sigma instance with error handling
          const renderer = new Sigma(graph, containerRef.current, {
            renderEdgeLabels: false,
            labelRenderedSizeThreshold: 1,
            labelFont: "Roboto, sans-serif",
            defaultEdgeType: "arrow",
            minCameraRatio: 0.1,
            maxCameraRatio: 20,
            labelSize: 14,
            labelWeight: "bold",
            labelColor: {
              color: darkMode ? "#ffffff" : "#000000",
              attribute: "color",
            },
            nodeReducer: (node, data) => {
              try {
                const res = { ...data };

                // Handle node highlighting
                if (hoveredNode === node) {
                  res.highlighted = true;
                  res.color = "#ff0000";
                  res.size = data.size * 1.5;
                } else if (hoveredNode) {
                  // Check if this node is connected to the hovered node
                  try {
                    const neighbors = graph.neighbors(node);
                    if (neighbors.includes(node)) {
                      res.highlighted = true;
                      res.size = data.size * 1.2;
                    } else {
                      res.color = "#dddddd";
                      res.size = data.size * 0.8;
                      res.label = undefined; // Hide label for non-connected nodes
                    }
                  } catch (neighborErr) {
                    console.error(
                      `Error checking neighbors for node ${node}:`,
                      neighborErr
                    );
                  }
                }

                // Handle node selection
                if (selectedNode && selectedNode.id === node) {
                  res.highlighted = true;
                  res.color = "#ff0000";
                  res.size = data.size * 1.5;
                }

                return res;
              } catch (err) {
                console.error(`Error in nodeReducer for node ${node}:`, err);
                return data; // Return original data on error
              }
            },
            edgeReducer: (edge, data) => {
              try {
                const res = { ...data };
                const edgeAttrs = graph.getEdgeAttributes(edge);
                const edgeType = edgeAttrs.edgeType || edgeAttrs.type;

                // Handle edge highlighting
                if (hoveredNode) {
                  try {
                    const [source, target] = graph.extremities(edge);
                    if (source === hoveredNode || target === hoveredNode) {
                      res.size = data.size * 2;
                      res.color = "#ff0000";
                    } else {
                      res.color = "#dddddd";
                      res.size = data.size * 0.5;
                    }
                  } catch (extremitiesErr) {
                    console.error(
                      `Error getting extremities for edge ${edge}:`,
                      extremitiesErr
                    );
                  }
                }

                // Handle edge selection
                if (selectedNode) {
                  try {
                    const [source, target] = graph.extremities(edge);
                    if (
                      source === selectedNode.id ||
                      target === selectedNode.id
                    ) {
                      res.size = data.size * 2;
                      res.color = "#ff0000";
                    }
                  } catch (extremitiesErr) {
                    console.error(
                      `Error getting extremities for edge ${edge}:`,
                      extremitiesErr
                    );
                  }
                }

                return res;
              } catch (err) {
                console.error(`Error in edgeReducer for edge ${edge}:`, err);
                return data; // Return original data on error
              }
            },
          });

          // Store the renderer
          sigmaRef.current = renderer;

          // Add event listeners with error handling
          renderer.on("clickNode", (e) => {
            try {
              const nodeId = e.node;
              const nodeAttributes = graph.getNodeAttributes(nodeId);

              // If it's a category node, toggle cluster selection
              if (nodeAttributes.nodeType === "category") {
                selectCluster(nodeId);
              } else {
                // For other nodes, show details
                setSelectedNode({
                  id: nodeId,
                  ...nodeAttributes,
                });

                // Load any additional related nodes that aren't already in the graph
                if (nodeAttributes.nodeType === "term") {
                  const termId = nodeId.replace("term-", "");
                  const term = deduplicatedData.find((t) => t.id === termId);
                  if (term && term.definitions) {
                    term.definitions.forEach((def) => {
                      if (def.relatedTerms) {
                        def.relatedTerms.forEach((relatedTerm) => {
                          if (!relatedTerm || !relatedTerm.id) return;

                          const relatedTermId = `term-${relatedTerm.id}`;
                          if (!graph.hasNode(relatedTermId)) {
                            // Find the term data
                            const relatedTermData = deduplicatedData.find(
                              (t) => t.id === relatedTerm.id
                            );
                            if (relatedTermData) {
                              // Add the related term near the current term
                              const currentX = nodeAttributes.x;
                              const currentY = nodeAttributes.y;
                              const angle = Math.random() * 2 * Math.PI;
                              const distance = 5 + Math.random() * 5;
                              const newX =
                                currentX + distance * Math.cos(angle);
                              const newY =
                                currentY + distance * Math.sin(angle);

                              addNodeToGraph(relatedTermData, newX, newY);
                              setLoadedNodeIds(
                                (prev) => new Set([...prev, relatedTermId])
                              );
                            }
                          }
                        });
                      }
                    });
                  }
                }
              }
            } catch (err) {
              console.error(
                `Error handling clickNode for node ${e?.node || "unknown"}:`,
                err
              );
            }
          });

          renderer.on("clickStage", () => {
            setSelectedNode(null);
          });

          renderer.on("enterNode", (e) => {
            try {
              setHoveredNode(e.node);
              renderer.refresh();
            } catch (err) {
              console.error(
                `Error handling enterNode for node ${e?.node || "unknown"}:`,
                err
              );
            }
          });

          renderer.on("leaveNode", () => {
            try {
              setHoveredNode(null);
              renderer.refresh();
            } catch (err) {
              console.error("Error handling leaveNode:", err);
            }
          });

          // Add camera update listener for lazy loading
          renderer.getCamera().on("updated", handleCameraUpdate);

          // Start the layout
          startLayout();

          // Stop the layout after 5 seconds
          setTimeout(() => {
            stopLayout();
          }, 5000);

          console.log("Graph visualization initialized successfully");
        } catch (rendererErr) {
          console.error("Error initializing Sigma renderer:", rendererErr);
          setError(
            `Failed to initialize graph renderer: ${rendererErr.message}`
          );
          // Fall back to DOM renderer
          setRenderMode("dom");
          console.log(
            "Falling back to DOM renderer due to Sigma initialization error"
          );
        }
      } else if (renderMode === "canvas" && containerRef.current) {
        renderCanvasGraph(nodes, edges);
      }
      // DOM renderer is handled in the JSX

      // Add a summary of duplicates if any were found
      if (
        window._duplicateNodeWarnings &&
        window._duplicateNodeWarnings.size > 0
      ) {
        console.info(
          `Processed graph with ${window._duplicateNodeWarnings.size} duplicate node IDs that were skipped.`
        );
        // Reset for next initialization
        window._duplicateNodeWarnings = new Set();
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error initializing graph:", err);
      setError(`Failed to initialize graph visualization: ${err.message}`);
      setIsLoading(false);
    }

    // Fall back to DOM renderer if Sigma fails
    if (renderMode === "sigma") {
      console.log(
        "Falling back to DOM renderer due to graph initialization error"
      );
      setRenderMode("dom");

      // Try again with DOM renderer after a short delay
      setTimeout(() => {
        if (data && data.length > 0) {
          try {
            // Process the data for DOM renderer
            const nodes = [];
            const edges = [];

            // Simple processing to extract basic node and edge data
            data.forEach((term) => {
              if (!term || !term.id || !term.name) return;

              const termId = `term-${term.id}`;
              nodes.push({
                id: termId,
                label: term.name,
                nodeType: "term",
                size: 10,
                color: "#60a5fa",
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
              });

              // Add basic related terms
              if (term.definitions) {
                term.definitions.forEach((def, idx) => {
                  if (def.relatedTerms) {
                    def.relatedTerms.forEach((related) => {
                      if (related && related.id) {
                        edges.push({
                          source: termId,
                          target: `term-${related.id}`,
                          type: "term-term",
                        });
                      }
                    });
                  }
                });
              }
            });

            setGraphNodes(nodes);
            setGraphEdges(edges);
            setGraphStats({
              nodeCount: nodes.length,
              edgeCount: edges.length,
              visibleNodes: nodes.length,
              visibleEdges: edges.length,
            });
          } catch (fallbackErr) {
            console.error("Error in DOM renderer fallback:", fallbackErr);
          }
        }

        setIsLoading(false);
      }, 500);
    }
  };

  // Render graph using Canvas API
  const renderCanvasGraph = (nodes, edges) => {
    if (!containerRef.current) {
      console.warn("Container ref is null, aborting Canvas rendering");
      return;
    }

    // Clear the container
    containerRef.current.innerHTML = "";

    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.width = containerRef.current.clientWidth || 500;
    canvas.height = containerRef.current.clientHeight || 400;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1"; // Ensure it's above other elements

    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    // Get 2D context
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get canvas context");
      setRenderMode("dom");
      return;
    }

    // Draw background
    ctx.fillStyle = darkMode ? "#1a1a1a" : "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate center and scale
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 50;

    // Filter nodes and edges based on cluster mode
    let visibleNodes = nodes;
    let visibleEdges = edges;

    if (selectedCluster) {
      const clusterNode = nodes.find((n) => n.id === selectedCluster);
      if (clusterNode) {
        const categoryName = clusterNode.category || clusterNode.label;
        visibleNodes = nodes.filter(
          (node) =>
            node.id === selectedCluster ||
            node.category === categoryName ||
            node.nodeType === "term"
        );

        // Only show edges between visible nodes
        const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
        visibleEdges = edges.filter(
          (edge) =>
            visibleNodeIds.has(edge.source) &&
            visibleNodeIds.has(edge.target) &&
            visibleRelationshipTypes.includes(edge.type)
        );
      }
    } else {
      // Filter by node type visibility
      visibleNodes = nodes.filter(
        (node) =>
          (node.nodeType === "category" && showCategories) ||
          (node.nodeType === "term" && showTerms) ||
          (node.nodeType === "definition" && showDefinitions)
      );

      // Filter by relationship type
      visibleEdges = edges.filter((edge) => {
        const sourceNode = visibleNodes.find((n) => n.id === edge.source);
        const targetNode = visibleNodes.find((n) => n.id === edge.target);

        return (
          sourceNode &&
          targetNode &&
          visibleRelationshipTypes.includes(edge.type || edge.edgeType)
        );
      });
    }

    // Draw edges
    visibleEdges.forEach((edge) => {
      const source = visibleNodes.find((n) => n.id === edge.source);
      const target = visibleNodes.find((n) => n.id === edge.target);

      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(centerX + source.x * scale, centerY + source.y * scale);
      ctx.lineTo(centerX + target.x * scale, centerY + target.y * scale);
      ctx.strokeStyle = edge.color || "#a78bfa";
      ctx.lineWidth = edge.size || 1;

      if (edge.type === "dashed") {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }

      // Highlight edges connected to hovered node
      if (
        hoveredNode &&
        (edge.source === hoveredNode || edge.target === hoveredNode)
      ) {
        ctx.strokeStyle = "#ff9e00";
        ctx.lineWidth = (edge.size || 1) * 2;
      }

      ctx.stroke();

      // Draw edge label
      if (edge.label) {
        const midX =
          (centerX + source.x * scale + centerX + target.x * scale) / 2;
        const midY =
          (centerY + source.y * scale + centerY + target.y * scale) / 2;

        ctx.font = "8px Arial";
        ctx.fillStyle = darkMode ? "#ffffff" : "#333333";
        ctx.textAlign = "center";
        ctx.fillText(edge.label, midX, midY - 5);
      }
    });

    // Draw nodes
    visibleNodes.forEach((node) => {
      const x = centerX + node.x * scale;
      const y = centerY + node.y * scale;
      const size = (node.size || 5) * 2;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);

      // Highlight nodes connected to hovered node
      if (
        hoveredNode &&
        visibleEdges.some(
          (e) =>
            (e.source === node.id && e.target === hoveredNode) ||
            (e.source === hoveredNode && e.target === node.id)
        )
      ) {
        ctx.fillStyle = "#ff9e00";
      } else if (selectedNode && node.id === selectedNode.id) {
        ctx.fillStyle = "#ff0000";
      } else {
        ctx.fillStyle = node.color || "#8b5cf6";
      }

      ctx.fill();

      // Draw border
      ctx.strokeStyle = darkMode ? "#2d3748" : "#ffffff";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw node icon/label
      if (
        size >= 10 ||
        node.id === (selectedNode && selectedNode.id) ||
        node.id === hoveredNode
      ) {
        // Draw node type indicator
        ctx.font = `${size / 2}px Arial`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let indicator = "";
        switch (node.nodeType) {
          case "category":
            indicator = "C";
            break;
          case "term":
            indicator = "T";
            break;
          case "definition":
            indicator = "D";
            break;
          default:
            indicator = "?";
        }

        ctx.fillText(indicator, x, y);

        // Draw label below
        ctx.font = "10px Arial";
        ctx.fillStyle = darkMode ? "#ffffff" : "#333333";
        ctx.fillText(node.label || node.id, x, y + size + 10);
      }
    });

    // Add click handler
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if clicked on any node
      for (const node of visibleNodes) {
        const nodeX = centerX + node.x * scale;
        const nodeY = centerY + node.y * scale;
        const size = (node.size || 5) * 2;

        const distance = Math.sqrt(
          Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2)
        );

        if (distance <= size) {
          if (node.nodeType === "category") {
            selectCluster(node.id);
          } else {
            setSelectedNode(node);
          }
          return;
        }
      }

      // If clicked outside any node, deselect
      setSelectedNode(null);
    });

    // Add hover handler
    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if hovering over any node
      let hoveredNodeId = null;
      for (const node of visibleNodes) {
        const nodeX = centerX + node.x * scale;
        const nodeY = centerY + node.y * scale;
        const size = (node.size || 5) * 2;

        const distance = Math.sqrt(
          Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2)
        );

        if (distance <= size) {
          hoveredNodeId = node.id;
          break;
        }
      }

      if (hoveredNodeId !== hoveredNode) {
        setHoveredNode(hoveredNodeId);
        // Redraw canvas on hover change
        renderCanvasGraph(nodes, edges);
      }
    });

    canvas.addEventListener("mouseleave", () => {
      setHoveredNode(null);
      // Redraw canvas when mouse leaves
      renderCanvasGraph(nodes, edges);
    });
  };

  // Get all unique categories from the data with error handling
  const getUniqueCategories = () => {
    try {
      const categories = new Set();

      termsData.forEach((term) => {
        try {
          if (term.definitions && term.definitions.length > 0) {
            term.definitions.forEach((def) => {
              try {
                if (def.categories && def.categories.length > 0) {
                  def.categories.forEach((category) => {
                    if (category) categories.add(category);
                  });
                }
              } catch (defErr) {
                console.error(
                  `Error processing definition categories for term ${term.id}:`,
                  defErr
                );
              }
            });
          }
        } catch (termErr) {
          console.error(
            `Error processing term categories ${term?.id || "unknown"}:`,
            termErr
          );
        }
      });

      return Array.from(categories);
    } catch (err) {
      console.error("Error getting unique categories:", err);
      return []; // Return empty array on error
    }
  };

  // Translations for UI elements
  const translations = {
    english: {
      title: "Knowledge Graph",
      search: "Search nodes...",
      loading: "Loading graph visualization...",
      error: "Failed to load graph",
      retry: "Retry",
      nodes: "nodes",
      edges: "edges",
      visible: "visible",
      filterOptions: "Filter Options",
      nodeTypes: "Node Types",
      showCategories: "Show Categories",
      showTerms: "Show Terms",
      showDefinitions: "Show Definitions",
      categories: "Categories",
      relationshipTypes: "Relationship Types",
      information: "Information",
      help: "Graph Visualization Help",
      nodeDetails: "Node Details",
      connections: "Connections",
      apiError: "API Error",
      noData: "No data available",
      fallbackUsed: "Using fallback data",
      clusterModes: {
        all: "Show All",
        categories: "Categories Only",
        terms: "Terms Only",
        "categories-terms": "Categories & Terms",
      },
      legend: "Legend",
      relationshipLegend: {
        "category-term": "Category-Term",
        "term-definition": "Term-Definition",
        "term-term": "Term-Term",
      },
      noNodeSelected: "No node selected. Click on a node to view details.",
      panToExplore: "Pan around to explore more nodes",
      graphInformation: "Graph Information",
      statistics: "Statistics",
      totalNodes: "Total Nodes",
      terms: "Terms",
      definitions: "Definitions",
      categories: "Categories",
      relationships: "Relationships",
      selectedNode: "Selected Node",
    },
    french: {
      title: "Graphe de Connaissances",
      search: "Rechercher des nœuds...",
      loading: "Chargement de la visualisation du graphe...",
      error: "Échec du chargement du graphe",
      retry: "Réessayer",
      nodes: "nœuds",
      edges: "liens",
      visible: "visibles",
      filterOptions: "Options de Filtrage",
      nodeTypes: "Types de Nœuds",
      showCategories: "Afficher les Catégories",
      showTerms: "Afficher les Termes",
      showDefinitions: "Afficher les Définitions",
      categories: "Catégories",
      relationshipTypes: "Types de Relations",
      information: "Information",
      help: "Aide sur la Visualisation du Graphe",
      nodeDetails: "Détails du Nœud",
      connections: "Connexions",
      apiError: "Erreur d'API",
      noData: "Aucune donnée disponible",
      fallbackUsed: "Utilisation des données de secours",
      clusterModes: {
        all: "Tout afficher",
        categories: "Catégories uniquement",
        terms: "Termes uniquement",
        "categories-terms": "Catégories et termes",
      },
      legend: "Légende",
      relationshipLegend: {
        "category-term": "Catégorie-Terme",
        "term-definition": "Terme-Définition",
        "term-term": "Terme-Terme",
      },
      noNodeSelected:
        "Aucun nœud sélectionné. Cliquez sur un nœud pour afficher les détails.",
      panToExplore: "Déplacez-vous pour explorer plus de nœuds",
      graphInformation: "Informations sur le Graphe",
      statistics: "Statistiques",
      totalNodes: "Nœuds Totaux",
      terms: "Termes",
      definitions: "Définitions",
      categories: "Catégories",
      relationships: "Relations",
      selectedNode: "Nœud Sélectionné",
    },
    arabic: {
      title: "رسم بياني للمعرفة",
      search: "البحث في العقد...",
      loading: "جاري تحميل الرسم البياني...",
      error: "فشل تحميل الرسم البياني",
      retry: "إعادة المحاولة",
      nodes: "عقد",
      edges: "روابط",
      visible: "مرئية",
      filterOptions: "خيارات التصفية",
      nodeTypes: "أنواع العقد",
      showCategories: "عرض الفئات",
      showTerms: "عرض المصطلحات",
      showDefinitions: "عرض التعريفات",
      categories: "الفئات",
      relationshipTypes: "أنواع العلاقات",
      information: "معلومات",
      help: "مساعدة حول تصور الرسم البياني",
      nodeDetails: "تفاصيل العقدة",
      connections: "الاتصالات",
      apiError: "خطأ في واجهة برمجة التطبيقات",
      noData: "لا توجد بيانات متاحة",
      fallbackUsed: "استخدام البيانات الاحتياطية",
      clusterModes: {
        all: "عرض الكل",
        categories: "الفئات فقط",
        terms: "المصطلحات فقط",
        "categories-terms": "الفئات والمصطلحات",
      },
      legend: "مفتاح الرموز",
      relationshipLegend: {
        "category-term": "فئة-مصطلح",
        "term-definition": "مصطلح-تعريف",
        "term-term": "مصطلح-مصطلح",
      },
      noNodeSelected: "لم يتم تحديد أي عقدة. انقر على عقدة لعرض التفاصيل.",
      panToExplore: "تحرك لاستكشاف المزيد من العقد",
      graphInformation: "معلومات الرسم البياني",
      statistics: "إحصائيات",
      totalNodes: "إجمالي العقد",
      terms: "المصطلحات",
      definitions: "التعريفات",
      categories: "الفئات",
      relationships: "العلاقات",
      selectedNode: "العقدة المحددة",
    },
  };

  const t = translations[language] || translations.english;

  // Fallback to DOM renderer if WebGL and Canvas are not supported
  if (!webGLSupported && !canvasSupported && fallbackRenderer) {
    return fallbackRenderer({ data, onNodeSelect });
>>>>>>> Stashed changes
  }

  // Use the hash to generate an angle
  const angle = ((Math.abs(hash) % 1000) / 1000) * Math.PI * 2

  // Calculate position using polar coordinates
  return {
    x: Math.cos(angle) * radius * (0.2 + 0.8 * Math.random()),
    y: Math.sin(angle) * radius * (0.2 + 0.8 * Math.random()),
  }
}

// Helper function to get node color based on type
const getNodeColor = (node) => {
  if (!node) return "#aaaaaa"

  const category = node.category || node.label

  const categoryColors = {
    Term: "#9370db",
    Definition: "#2ecc71",
    Category: "#e74c3c",
    // Add more categories as needed
  }

  return categoryColors[category] || "#aaaaaa"
}

// Helper function to get link color based on type
const getLinkColor = (link) => {
  if (!link) return "#cccccc"

  const typeColors = {
    HAS_DEFINITION: "#9b59b6",
    BELONGS_TO: "#3498db",
    RELATED_TO: "#e67e22",
    DEFINED_IN: "#f1c40f",
    // Add more types as needed
  }

  return typeColors[link.type] || "#cccccc"
}

const GraphVisualization = ({ language = "english", apiBaseUrl = "/api", forceMockData = false }) => {
  const containerRef = useRef(null)
  const graphRef = useRef(null)
  const dimensions = useResizeObserver(containerRef)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isExpanding, setIsExpanding] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [zoomLevel, setZoomLevel] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 })
  const [layoutAlgorithm, setLayoutAlgorithm] = useState("force") // force, radial, circular
  const [forceStrength, setForceStrength] = useState(-300)
  const [linkDistance, setLinkDistance] = useState(120)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [stats, setStats] = useState({
    nodeCount: 0,
    relationshipCount: 0,
    nodeLabels: [],
    relationshipTypes: [],
  })
  const [useMockData, setUseMockData] = useState(forceMockData)

  // Update useMockData when forceMockData changes
  useEffect(() => {
    setUseMockData(forceMockData)
  }, [forceMockData])

  // API endpoint based on language
  const getApiEndpoint = useCallback(() => {
    const langParam = language === "english" ? "en" : language === "french" ? "fr" : "ar"

    // Check if we're using the default API base URL
    if (apiBaseUrl === "/api") {
      // Try the backend API endpoints in order of preference
      return `/api/graph?language=${langParam}`
    } else {
      // Use the custom API base URL
      return `${apiBaseUrl}/graph?language=${langParam}`
    }
  }, [language, apiBaseUrl])

  // Fetch graph data with pagination
  const fetchGraphData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // If we're using mock data, generate it instead of fetching
      if (useMockData) {
        console.log("Using mock data instead of API")
        const mockData = generateMockData()

        // Process nodes to ensure they have positions
        const processedNodes = mockData.nodes.map((node) => ({
          ...node,
          ...generateDeterministicPosition(node.id),
        }))

        setGraphData({
          nodes: processedNodes,
          links: mockData.links,
        })

        // Update stats
        const nodeLabels = [...new Set(processedNodes.map((node) => node.label || node.category))]
        const relationshipTypes = [...new Set(mockData.links.map((link) => link.type))]

        setStats({
          nodeCount: processedNodes.length,
          relationshipCount: mockData.links.length,
          nodeLabels,
          relationshipTypes,
        })

        setLoading(false)
        return
      }

      // Try to fetch from API
      const apiUrl = getApiEndpoint()
      console.log(`Fetching graph data from: ${apiUrl}`)

      try {
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        // Check if response is OK
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        // Try to parse as JSON
        let data
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          data = await response.json()
        } else {
          // If not JSON, log the text and throw error
          const text = await response.text()
          console.error("API returned non-JSON response:", text.substring(0, 500) + "...")
          throw new Error("API returned non-JSON response. Check console for details.")
        }

        // Extract nodes and links from the response
        const nodes = data.nodes || []
        const links = data.relationships || data.links || []

        if (!nodes.length) {
          console.warn("API returned empty nodes array, falling back to mock data")
          setUseMockData(true)
          fetchGraphData() // Call again with mock data
          return
        }

        // Process nodes to ensure they have positions
        const processedNodes = nodes.map((node) => ({
          ...node,
          id: node.id.toString(),
          name: node.properties?.name || node.name || `Node ${node.id}`,
          label: node.labels?.[0] || node.label || "Node",
          category: node.labels?.[0] || node.category || "Node",
          ...generateDeterministicPosition(node.id.toString()),
        }))

        // Process links to ensure they have proper source/target references
        const processedLinks = links.map((link) => ({
          ...link,
          id: link.id?.toString() || `${link.source || link.startNode}-${link.target || link.endNode}`,
          source: (link.source || link.startNode).toString(),
          target: (link.target || link.endNode).toString(),
          type: link.type || "RELATED_TO",
        }))

        // Update the graph data
        setGraphData({
          nodes: processedNodes,
          links: processedLinks,
        })

        // Update stats
        const nodeLabels = [...new Set(processedNodes.map((node) => node.label || node.category))]
        const relationshipTypes = [...new Set(processedLinks.map((link) => link.type))]

        setStats({
          nodeCount: processedNodes.length,
          relationshipCount: processedLinks.length,
          nodeLabels,
          relationshipTypes,
        })

        console.log(`Loaded ${processedNodes.length} nodes and ${processedLinks.length} links`)
      } catch (fetchError) {
        console.error("Fetch error:", fetchError)
        throw fetchError
      }
    } catch (err) {
      console.error("Error fetching graph data:", err)
      setError(err.message || "Failed to load graph data")

      // Fall back to mock data after error
      console.log("Falling back to mock data due to API error")
      setUseMockData(true)
      fetchGraphData() // Call again with mock data
    } finally {
      if (!useMockData) {
        setLoading(false)
      }
    }
  }, [language, apiBaseUrl, useMockData, getApiEndpoint])

  // Fetch data on component mount and when language changes
  useEffect(() => {
    fetchGraphData()
  }, [fetchGraphData, language])

  // Handle node click
  const handleNodeClick = useCallback(
    (node) => {
      setSelectedNode(node)
      setShowInfoPanel(true)

      // Center view on clicked node
      if (graphRef.current) {
        graphRef.current.centerAt(node.x, node.y, 1000)
        graphRef.current.zoom(zoomLevel * 1.5, 1000)
      }
    },
    [zoomLevel],
  )

  // Expand a node to load its connections
  const handleExpandNode = useCallback(
    async (nodeId) => {
      if (expandedNodes.has(nodeId) || isExpanding) return

      setIsExpanding(true)

      try {
        // If using mock data, simulate expansion
        if (useMockData) {
          // Create some new nodes connected to this one
          const newNodes = []
          const newLinks = []

          for (let i = 0; i < 5; i++) {
            const newNodeId = `${nodeId}-expanded-${i}`
            const nodeType = i % 3 === 0 ? "Term" : i % 3 === 1 ? "Definition" : "Category"

            newNodes.push({
              id: newNodeId,
              name: `${nodeType} ${newNodeId}`,
              label: nodeType,
              category: nodeType,
              properties: {
                name: `${nodeType} ${newNodeId}`,
                description: `This is a mock expanded ${nodeType.toLowerCase()} node`,
              },
              ...generateDeterministicPosition(newNodeId),
            })

            newLinks.push({
              id: `link-${nodeId}-${newNodeId}`,
              source: nodeId,
              target: newNodeId,
              type: i % 2 === 0 ? "RELATED_TO" : "HAS_DEFINITION",
            })
          }

          // Add new nodes and links to the graph
          setGraphData((prev) => ({
            nodes: [...prev.nodes, ...newNodes],
            links: [...prev.links, ...newLinks],
          }))

          // Mark node as expanded
          setExpandedNodes((prev) => new Set([...prev, nodeId]))
          setTimeout(() => setIsExpanding(false), 500)
          return
        }

        // Try to fetch from API
        const baseEndpoint = getApiEndpoint().split("?")[0] // Remove query params
        const expandUrl = `${baseEndpoint}/expand/${nodeId}`
        console.log(`Expanding node from: ${expandUrl}`)

        const response = await fetch(expandUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        // Try to parse as JSON
        let data
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          data = await response.json()
        } else {
          // If not JSON, log the text and throw error
          const text = await response.text()
          console.error("API returned non-JSON response:", text.substring(0, 500) + "...")
          throw new Error("API returned non-JSON response. Check console for details.")
        }

        // Process new nodes and links
        const newNodes = (data.nodes || []).map((node) => ({
          ...node,
          id: node.id.toString(),
          name: node.properties?.name || node.name || `Node ${node.id}`,
          label: node.labels?.[0] || node.label || "Node",
          category: node.labels?.[0] || node.category || "Node",
          ...generateDeterministicPosition(node.id.toString()),
        }))

        const newLinks = (data.relationships || data.links || []).map((link) => ({
          ...link,
          id: link.id?.toString() || `${link.source || link.startNode}-${link.target || link.endNode}`,
          source: (link.source || link.startNode).toString(),
          target: (link.target || link.endNode).toString(),
          type: link.type || "RELATED_TO",
        }))

        // Add new nodes and links to the graph
        setGraphData((prev) => {
          // Filter out nodes and links that already exist
          const existingNodeIds = new Set(prev.nodes.map((n) => n.id))
          const existingLinkIds = new Set(prev.links.map((l) => l.id))

          const filteredNewNodes = newNodes.filter((node) => !existingNodeIds.has(node.id))
          const filteredNewLinks = newLinks.filter((link) => !existingLinkIds.has(link.id))

          return {
            nodes: [...prev.nodes, ...filteredNewNodes],
            links: [...prev.links, ...filteredNewLinks],
          }
        })

        // Mark node as expanded
        setExpandedNodes((prev) => new Set([...prev, nodeId]))
      } catch (err) {
        console.error("Error expanding node:", err)

        // If API fails, simulate expansion with mock data
        if (!useMockData) {
          console.log("Simulating node expansion with mock data")
          setUseMockData(true)
          handleExpandNode(nodeId)
        }
      } finally {
        setIsExpanding(false)
      }
    },
    [expandedNodes, isExpanding, useMockData, getApiEndpoint],
  )

  // Handle search
  const handleSearch = useCallback(
    (searchTerm) => {
      if (!searchTerm) return

      // Find node that matches the search term
      const foundNode = graphData.nodes.find(
        (node) =>
          node.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.properties?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      if (foundNode) {
        handleNodeClick(foundNode)
      } else {
        // Could implement API search here if needed
        console.log("No matching node found for:", searchTerm)
      }
    },
    [graphData.nodes, handleNodeClick],
  )

  // Custom node rendering function
  const nodeCanvasObject = useCallback(
    (node, ctx, globalScale) => {
      const { x, y } = node
      const size = node === selectedNode ? 8 : 5
      const fontSize = 12 / globalScale

      // Draw node circle
      ctx.beginPath()
      ctx.arc(x, y, size / globalScale, 0, 2 * Math.PI)
      ctx.fillStyle = getNodeColor(node)
      ctx.fill()

      // Draw border for selected node
      if (node === selectedNode) {
        ctx.beginPath()
        ctx.arc(x, y, (size + 2) / globalScale, 0, 2 * Math.PI)
        ctx.strokeStyle = "#ff0000"
        ctx.lineWidth = 1.5 / globalScale
        ctx.stroke()
      }

      // Draw expansion indicator if node has not been expanded
      if (!expandedNodes.has(node.id)) {
        ctx.beginPath()
        ctx.arc(x, y, (size + 4) / globalScale, 0, 2 * Math.PI)
        ctx.strokeStyle = getNodeColor(node)
        ctx.setLineDash([2, 2])
        ctx.lineWidth = 1 / globalScale
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Draw node label if zoomed in enough
      if (globalScale > 1.5 || node === selectedNode) {
        const label = node.name || node.id

        ctx.font = `${fontSize}px Sans-Serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Draw background for text
        const textWidth = ctx.measureText(label).width
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fillRect(x - textWidth / 2 - 2, y + size / globalScale + 2, textWidth + 4, fontSize + 2)

        // Draw text
        ctx.fillStyle = "#333333"
        ctx.fillText(label, x, y + size / globalScale + fontSize / 2 + 2)
      }
    },
    [selectedNode, expandedNodes],
  )

  // Apply custom force simulation settings
  const forceEngineOptions = useMemo(() => {
    return {
      // Customize force simulation
      d3AlphaDecay: 0.02, // Lower values make the simulation run longer
      d3VelocityDecay: 0.4, // Higher values make nodes settle faster
      d3AlphaMin: 0.001, // Lower values make the simulation more accurate
      ngraphPhysics: {
        springLength: linkDistance,
        springCoeff: 0.0008,
        gravity: -1.2,
        theta: 0.8,
        dragCoeff: 0.02,
      },
    }
  }, [linkDistance])

  // Apply different layout algorithms
  const applyLayout = useCallback(() => {
    if (!graphRef.current || !graphData.nodes.length) return

    const graph = graphRef.current

    switch (layoutAlgorithm) {
      case "force":
        // Force-directed layout is handled by ForceGraph2D
        graph.d3Force("charge").strength(forceStrength)
        graph.d3Force("link").distance(linkDistance)
        graph.d3ReheatSimulation()
        break

      case "radial":
        // Arrange nodes in concentric circles based on their type
        const nodesByType = {}
        graphData.nodes.forEach((node) => {
          const type = node.category || node.label
          if (!nodesByType[type]) nodesByType[type] = []
          nodesByType[type].push(node)
        })

        const types = Object.keys(nodesByType)
        types.forEach((type, typeIndex) => {
          const nodes = nodesByType[type]
          const radius = 200 + typeIndex * 150

          nodes.forEach((node, i) => {
            const angle = (i / nodes.length) * 2 * Math.PI
            node.x = Math.cos(angle) * radius
            node.y = Math.sin(angle) * radius

            // Fix node position
            node.fx = node.x
            node.fy = node.y
          })
        })

        // Run simulation briefly to adjust links
        graph.d3ReheatSimulation()

        // Release fixed positions after a delay
        setTimeout(() => {
          graphData.nodes.forEach((node) => {
            node.fx = undefined
            node.fy = undefined
          })
        }, 2000)
        break

      case "circular":
        // Arrange all nodes in a circle
        const total = graphData.nodes.length
        graphData.nodes.forEach((node, i) => {
          const angle = (i / total) * 2 * Math.PI
          const radius = Math.sqrt(total) * 15

          node.x = Math.cos(angle) * radius
          node.y = Math.sin(angle) * radius

          // Fix node position
          node.fx = node.x
          node.fy = node.y
        })

        // Run simulation briefly to adjust links
        graph.d3ReheatSimulation()

        // Release fixed positions after a delay
        setTimeout(() => {
          graphData.nodes.forEach((node) => {
            node.fx = undefined
            node.fy = undefined
          })
        }, 2000)
        break

      default:
        break
    }
  }, [layoutAlgorithm, forceStrength, linkDistance, graphData.nodes])

  // Apply layout when settings change or graph data updates
  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0 && !loading) {
      // Wait a moment for the graph to initialize
      setTimeout(() => {
        applyLayout()
      }, 500)
    }
  }, [applyLayout, graphData.nodes.length, loading])

  // Handle layout change
  const handleLayoutChange = (e) => {
    setLayoutAlgorithm(e.target.value)
  }

  // Get translations based on language
  const getTranslations = () => {
    const translations = {
      english: {
        layout: "Layout:",
        forceDirected: "Force-directed",
        radial: "Radial by type",
        circular: "Circular",
        applyLayout: "Apply Layout",
        loading: "Loading graph data...",
        error: "Error",
        retry: "Retry",
        displaying: "Displaying",
        nodes: "nodes",
        relationships: "relationships",
        nodeTypes: "Node Types",
        term: "Term",
        definition: "Definition",
        category: "Category",
        usingMockData: "Using demo data",
      },
      french: {
        layout: "Disposition:",
        forceDirected: "Force dirigée",
        radial: "Radiale par type",
        circular: "Circulaire",
        applyLayout: "Appliquer",
        loading: "Chargement des données du graphe...",
        error: "Erreur",
        retry: "Réessayer",
        displaying: "Affichage de",
        nodes: "nœuds",
        relationships: "relations",
        nodeTypes: "Types de Nœuds",
        term: "Terme",
        definition: "Définition",
        category: "Catégorie",
        usingMockData: "Utilisation des données de démonstration",
      },
      arabic: {
        layout: "تخطيط:",
        forceDirected: "موجه بالقوة",
        radial: "شعاعي حسب النوع",
        circular: "دائري",
        applyLayout: "تطبيق التخطيط",
        loading: "جاري تحميل بيانات الرسم البياني...",
        error: "خطأ",
        retry: "إعادة المحاولة",
        displaying: "عرض",
        nodes: "عقد",
        relationships: "علاقات",
        nodeTypes: "أنواع العقد",
        term: "مصطلح",
        definition: "تعريف",
        category: "فئة",
        usingMockData: "استخدام بيانات العرض التوضيحي",
      },
    }

    return translations[language] || translations.english
  }

  const t = getTranslations()

  // Make sure the graph resizes when the container changes size
  useEffect(() => {
    // ForceGraph2D takes width and height as props, not methods
    // We don't need to do anything here as we're passing dimensions to the component
    console.log("Container dimensions updated:", dimensions)
  }, [dimensions])

  return (
<<<<<<< Updated upstream
    <div className="graph-visualization-container">
      <div className="graph-header">
        <GraphSearch onSearch={handleSearch} language={language} />

        <div className="layout-controls">
          <label htmlFor="layout-select" className="mr-2">
            {t.layout}
          </label>
          <select id="layout-select" value={layoutAlgorithm} onChange={handleLayoutChange} className="layout-select">
            <option value="force">{t.forceDirected}</option>
            <option value="radial">{t.radial}</option>
            <option value="circular">{t.circular}</option>
          </select>
          <button onClick={applyLayout} className="apply-layout-button">
            {t.applyLayout}
          </button>

          {useMockData && <div className="mock-data-indicator">{t.usingMockData}</div>}
        </div>
      </div>

      <div className="graph-content">
        <div
          ref={containerRef}
          className="graph-canvas-container"
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          {/* Loading overlay */}
          {loading && (
            <div className="graph-loading-overlay">
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>{t.loading}</p>
                {loadingProgress.total > 0 && (
                  <div className="loading-progress-bar">
                    <div
                      className="loading-progress-fill"
                      style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && !useMockData && (
            <div className="graph-loading-overlay">
              <div className="error-container">
                <h3>{t.error}</h3>
                <p>{error}</p>
                <div className="error-actions">
                  <button className="retry-button" onClick={() => fetchGraphData()}>
                    {t.retry}
                  </button>
                  <button
                    className="mock-data-button"
                    onClick={() => {
                      setUseMockData(true)
                      fetchGraphData()
                    }}
                  >
                    Use Demo Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Graph visualization */}
          {!loading && (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeId="id"
              linkSource="source"
              linkTarget="target"
              nodeCanvasObject={nodeCanvasObject}
              linkColor={(link) => getLinkColor(link)}
              linkWidth={1}
              linkDirectionalParticles={3}
              linkDirectionalParticleWidth={2}
              linkDirectionalParticleSpeed={0.005}
              onNodeClick={handleNodeClick}
              onNodeRightClick={(node) => {
                handleExpandNode(node.id)
                return true // Prevent default context menu
              }}
              cooldownTicks={100}
              width={dimensions ? dimensions.width : 800}
              height={dimensions ? dimensions.height : 600}
              {...forceEngineOptions}
            />
          )}

          {/* Stats overlay */}
          <div className="stats-overlay">
            <p>
              {t.displaying} {graphData.nodes.length} {t.nodes}, {graphData.links.length} {t.relationships}
            </p>
          </div>

          {/* Simple legend */}
          <div className="graph-legend">
            <p>{t.nodeTypes}</p>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#9370db" }}></div>
                <span>{t.term}</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#2ecc71" }}></div>
                <span>{t.definition}</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#e74c3c" }}></div>
                <span>{t.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        {showInfoPanel && (
          <GraphInfoPanel
            stats={stats}
            selectedNode={selectedNode}
            onClose={() => setShowInfoPanel(false)}
            language={language}
          />
        )}
      </div>

      <div className="graph-export">
        <button className="export-button">Export</button>
      </div>
    </div>
  )
}
=======
    <div
      className={`graph-container ${isFullscreen ? "fullscreen" : ""} ${
        darkMode ? "dark-mode" : ""
      }`}
      ref={graphContainerRef}
    >
      <div className="graph-main">
        <div className="graph-header">
          <div className="graph-title">
            <h2>{t.title}</h2>
            <div className="graph-stats">
              <span>
                {graphStats.nodeCount} {t.nodes}
              </span>
              <span>
                {graphStats.edgeCount} {t.edges}
              </span>
              <span>
                ({graphStats.visibleNodes} {t.visible})
              </span>
              {apiStatus.status === "error" && (
                <span className="api-error-badge" title={apiStatus.message}>
                  <AlertTriangle size={14} /> {t.apiError}
                </span>
              )}
            </div>
          </div>

          <div className="graph-search">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
              disabled={isLoading}
            />
          </div>

          <div className="graph-controls">
            <button
              className="control-button"
              onClick={toggleFilterPanel}
              title={t.filterOptions}
              disabled={isLoading}
            >
              <Filter size={18} />
            </button>

            <button
              className="control-button"
              onClick={toggleInfoPanel}
              title={t.information}
              disabled={isLoading}
            >
              <Info size={18} />
            </button>

            <button
              className="control-button"
              onClick={toggleLayout}
              title={layoutRunning ? "Stop Layout" : "Start Layout"}
              disabled={isLoading}
            >
              <RefreshCw
                size={18}
                className={layoutRunning ? "spinning" : ""}
              />
            </button>

            <button
              className="control-button"
              onClick={zoomIn}
              title="Zoom In"
              disabled={isLoading}
            >
              <ZoomIn size={18} />
            </button>

            <button
              className="control-button"
              onClick={zoomOut}
              title="Zoom Out"
              disabled={isLoading}
            >
              <ZoomOut size={18} />
            </button>

            <button
              className="control-button"
              onClick={resetView}
              title="Reset View"
              disabled={isLoading}
            >
              <RefreshCw size={18} />
            </button>

            <button
              className="control-button"
              onClick={toggleRenderMode}
              title={`Render Mode: ${renderMode}`}
              disabled={isLoading}
            >
              <Layers size={18} />
            </button>

            <button
              className="control-button"
              onClick={toggleDarkMode}
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="control-button"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        <div className="graph-content">
          {isLoading ? (
            <div className="graph-loading">
              <div className="loading-spinner"></div>
              <p>{t.loading}</p>
              {apiStatus.status === "loading" && (
                <p className="loading-message">{apiStatus.message}</p>
              )}
            </div>
          ) : error ? (
            <div className="graph-error">
              <p>{error}</p>
              <button className="retry-button" onClick={fetchTermsData}>
                {t.retry}
              </button>
              {apiStatus.status === "error" && (
                <p className="error-details">
                  {t.fallbackUsed}: {apiStatus.message}
                </p>
              )}
            </div>
          ) : graphStats.nodeCount === 0 ? (
            <div className="graph-error">
              <p>{t.noData}</p>
              <button className="retry-button" onClick={fetchTermsData}>
                {t.retry}
              </button>
            </div>
          ) : (
            <>
              <div className="graph-canvas-container">
                {renderMode === "dom" ? (
                  <DOMGraphRenderer
                    nodes={graphNodes.filter((node) => {
                      // Filter by cluster mode
                      if (selectedCluster) {
                        const clusterNode = graphNodes.find(
                          (n) => n.id === selectedCluster
                        );
                        if (clusterNode) {
                          const categoryName =
                            clusterNode.category || clusterNode.label;
                          return (
                            node.id === selectedCluster ||
                            node.category === categoryName ||
                            (node.nodeType === "term" &&
                              graphEdges.some(
                                (e) =>
                                  (e.source === node.id &&
                                    e.target === selectedCluster) ||
                                  (e.source === selectedCluster &&
                                    e.target === node.id)
                              ))
                          );
                        }
                      }

                      // Filter by node type
                      return (
                        (node.nodeType === "category" && showCategories) ||
                        (node.nodeType === "term" && showTerms) ||
                        (node.nodeType === "definition" && showDefinitions)
                      );
                    })}
                    edges={graphEdges.filter((edge) => {
                      // Filter by relationship type
                      return visibleRelationshipTypes.includes(
                        edge.type || edge.edgeType
                      );
                    })}
                    width={
                      containerRef.current?.clientWidth ||
                      window.innerWidth - 300
                    }
                    height={
                      containerRef.current?.clientHeight || window.innerHeight
                    }
                    onNodeClick={(nodeId) => {
                      const node = graphNodes.find((n) => n.id === nodeId);
                      if (node) {
                        if (node.nodeType === "category") {
                          selectCluster(node.id);
                        } else {
                          setSelectedNode(node);
                        }
                      }
                    }}
                    selectedNodeId={selectedNode?.id}
                    hoveredNodeId={hoveredNode}
                    onNodeHover={setHoveredNode}
                    isDarkMode={darkMode}
                  />
                ) : (
                  <div
                    className="graph-canvas"
                    ref={containerRef}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  ></div>
                )}

                {/* Legend */}
                {isLegendVisible && (
                  <div
                    className={`graph-legend ${darkMode ? "dark-mode" : ""}`}
                  >
                    <div className="legend-header">
                      <h4>{t.legend}</h4>
                    </div>
                    <div className="legend-content">
                      <div className="legend-section">
                        <h5>{t.nodeTypes}</h5>
                        <div className="legend-item">
                          <span className="legend-icon category-icon">C</span>
                          <span className="legend-label">
                            {t.showCategories}
                          </span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-icon term-icon">T</span>
                          <span className="legend-label">{t.showTerms}</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-icon definition-icon">D</span>
                          <span className="legend-label">
                            {t.showDefinitions}
                          </span>
                        </div>
                      </div>
                      <div className="legend-section">
                        <h5>{t.relationshipTypes}</h5>
                        {relationshipTypes.map((type) => (
                          <div className="legend-item" key={type.id}>
                            <span
                              className="legend-line"
                              style={{ backgroundColor: type.color }}
                            ></span>
                            <span className="legend-label">
                              {t.relationshipLegend[type.id] || type.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter panel */}
              {isFilterPanelOpen && (
                <div className={`filter-panel ${darkMode ? "dark-mode" : ""}`}>
                  <div className="panel-header">
                    <h3>{t.filterOptions}</h3>
                    <button
                      className="close-button"
                      onClick={toggleFilterPanel}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="filter-content">
                    <div className="filter-section">
                      <h4>{t.nodeTypes}</h4>
                      <label className="filter-option">
                        <input
                          type="checkbox"
                          checked={showCategories}
                          onChange={() => toggleNodeTypeVisibility("category")}
                        />
                        {t.showCategories}
                      </label>
                      <label className="filter-option">
                        <input
                          type="checkbox"
                          checked={showTerms}
                          onChange={() => toggleNodeTypeVisibility("term")}
                        />
                        {t.showTerms}
                      </label>
                      <label className="filter-option">
                        <input
                          type="checkbox"
                          checked={showDefinitions}
                          onChange={() =>
                            toggleNodeTypeVisibility("definition")
                          }
                        />
                        {t.showDefinitions}
                      </label>
                    </div>

                    <div className="filter-section">
                      <h4>{t.relationshipTypes}</h4>
                      {relationshipTypes.map((type) => (
                        <label key={type.id} className="filter-option">
                          <input
                            type="checkbox"
                            checked={visibleRelationshipTypes.includes(type.id)}
                            onChange={() => toggleRelationshipType(type.id)}
                          />
                          {t.relationshipLegend[type.id] || type.name}
                        </label>
                      ))}
                    </div>

                    <div className="filter-section">
                      <h4>{t.categories}</h4>
                      {availableClusters.map((category) => (
                        <div
                          key={category}
                          className={`category-filter-item ${
                            selectedCluster ===
                            `category-${category
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            selectCluster(
                              `category-${category
                                .replace(/\s+/g, "-")
                                .toLowerCase()}`
                            )
                          }
                        >
                          <span
                            className="category-color"
                            style={{
                              backgroundColor:
                                categoryColors[category] ||
                                categoryColors["Uncategorized"],
                            }}
                          ></span>
                          <span className="category-icon">
                            {getCategoryIcon(category)}
                          </span>
                          <span className="category-name">{category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Info panel */}
              {isInfoPanelOpen && (
                <div className={`info-panel ${darkMode ? "dark-mode" : ""}`}>
                  <div className="panel-header">
                    <h3>{t.information}</h3>
                    <button className="close-button" onClick={toggleInfoPanel}>
                      <X size={18} />
                    </button>
                  </div>

                  <div className="info-content">
                    <h4>{t.help}</h4>
                    <p>
                      This is a graph visualization of knowledge terms and their
                      relationships. You can use the search bar to find specific
                      nodes, and the filter panel to show or hide different
                      types of nodes and relationships.
                    </p>
                    <ul>
                      <li>
                        Click on a node to view its details and connections.
                      </li>
                      <li>
                        Hover over a node to highlight its direct connections.
                      </li>
                      <li>
                        Click on a category node to filter by that category.
                      </li>
                      <li>Use the zoom controls to zoom in and out.</li>
                      <li>
                        Use the reset view button to reset the zoom and pan.
                      </li>
                      <li>
                        Toggle the force-directed layout to automatically
                        arrange the nodes.
                      </li>
                      <li>Pan around the graph to load more nodes.</li>
                      <li>Use the search to quickly find specific terms.</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="graph-sidebar">
        {/* Graph Information Section */}
        <div className="sidebar-section">
          <div className="sidebar-header">
            <h3>{t.graphInformation}</h3>
          </div>
          <div className="sidebar-content">
            <h4>{t.statistics}</h4>
            <div className="statistics-item">
              <span className="statistics-label">{t.totalNodes}:</span>
              <span className="statistics-value">{graphStats.nodeCount}</span>
            </div>
            <div className="statistics-item">
              <span className="statistics-label">{t.terms}:</span>
              <span className="statistics-value">
                {graphStats.termCount || 0}
              </span>
            </div>
            <div className="statistics-item">
              <span className="statistics-label">{t.definitions}:</span>
              <span className="statistics-value">
                {graphStats.definitionCount || 0}
              </span>
            </div>
            <div className="statistics-item">
              <span className="statistics-label">{t.categories}:</span>
              <span className="statistics-value">
                {graphStats.categoryCount || 0}
              </span>
            </div>
            <div className="statistics-item">
              <span className="statistics-label">{t.relationships}:</span>
              <span className="statistics-value">{graphStats.edgeCount}</span>
            </div>
          </div>
        </div>
>>>>>>> Stashed changes

        {/* Relationship Types Section */}
        <div className="sidebar-section">
          <div className="sidebar-header">
            <h3>{t.relationshipTypes}</h3>
          </div>
          <div className="relationship-types-section">
            {relationshipTypes.map((type) => (
              <div className="relationship-type-item" key={type.id}>
                <div
                  className="relationship-color"
                  style={{ backgroundColor: type.color }}
                ></div>
                <div className="relationship-name">
                  {t.relationshipLegend[type.id] || type.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Section */}
        <div className="sidebar-section node-details-section">
          <div className="sidebar-header">
            <h3>{t.selectedNode}</h3>
          </div>
          <div className="node-details-content">
            {selectedNode ? (
              <>
                <div className="node-header">
                  <div className="node-icon-wrapper">
                    {selectedNode.nodeType === "category" ? (
                      getCategoryIcon(
                        selectedNode.category || selectedNode.label
                      )
                    ) : selectedNode.nodeType === "term" ? (
                      <Book size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </div>
                  <h4 className="node-title">{selectedNode.label}</h4>
                  <span className="node-type-badge">
                    {selectedNode.nodeType}
                  </span>
                </div>

                {selectedNode.category && (
                  <div className="node-category">
                    <span
                      className="category-color"
                      style={{
                        backgroundColor:
                          categoryColors[selectedNode.category] ||
                          categoryColors["Uncategorized"],
                      }}
                    ></span>
                    <span>{selectedNode.category}</span>
                  </div>
                )}

                {selectedNode.content && (
                  <div className="node-content">
                    <p>{selectedNode.content}</p>
                  </div>
                )}

                {selectedNode.fullText && (
                  <div className="node-content">
                    <p>{selectedNode.fullText}</p>
                  </div>
                )}

                <div className="node-connections">
                  <h5>{t.connections}</h5>
                  {graphRef.current && (
                    <ul className="connections-list">
                      {(() => {
                        try {
                          return graphRef.current
                            .neighbors(selectedNode.id)
                            .map((neighborId) => {
                              try {
                                const neighbor =
                                  graphRef.current.getNodeAttributes(
                                    neighborId
                                  );
                                const edge =
                                  graphRef.current.edge(
                                    selectedNode.id,
                                    neighborId
                                  ) ||
                                  graphRef.current.edge(
                                    neighborId,
                                    selectedNode.id
                                  );
                                const edgeType = edge
                                  ? graphRef.current.getEdgeAttribute(
                                      edge,
                                      "edgeType"
                                    )
                                  : "default";

                                return (
                                  <li
                                    key={neighborId}
                                    className="connection-item"
                                    onClick={() => {
                                      setSelectedNode({
                                        id: neighborId,
                                        ...neighbor,
                                      });
                                    }}
                                  >
                                    <span
                                      className="connection-type"
                                      style={{
                                        backgroundColor:
                                          relationshipTypesColors[edgeType] ||
                                          relationshipTypesColors["default"],
                                      }}
                                    >
                                      {edgeType.replace(/_/g, " ")}
                                    </span>
                                    <span className="connection-label">
                                      {neighbor.label}
                                    </span>
                                    <span className="connection-node-type">
                                      {neighbor.nodeType}
                                    </span>
                                  </li>
                                );
                              } catch (neighborErr) {
                                console.error(
                                  `Error rendering neighbor ${neighborId}:`,
                                  neighborErr
                                );
                                return null; // Skip this neighbor on error
                              }
                            })
                            .filter(Boolean); // Filter out null values
                        } catch (neighborsErr) {
                          console.error(
                            `Error getting neighbors for node ${selectedNode.id}:`,
                            neighborsErr
                          );
                          return []; // Return empty array on error
                        }
                      })()}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="no-node-selected">
                <p>{t.noNodeSelected}</p>
                <p className="pan-hint">
                  <Move size={16} />
                  {t.panToExplore}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;
