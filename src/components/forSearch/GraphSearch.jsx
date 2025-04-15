"use client"

import { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, RotateCcw, SlidersHorizontal, X, Maximize, Download, Share2 } from "lucide-react"
import { graphSearch } from "../../services/Api"
import "./GraphSearch.css"

const GraphSearch = ({ graphData, onTermSelect, categoryTranslations, darkMode, getCategoryColor = () => "#666" }) => {
  const containerRef = useRef(null)
  const [network, setNetwork] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentGraphData, setCurrentGraphData] = useState(graphData)
  const [visLoaded, setVisLoaded] = useState(false)
  const networkRef = useRef(null) // Add a ref to track the network instance
  const isMounted = useRef(true) // Track if component is mounted

  // Get all unique categories from graph nodes
  const allCategories = [
    ...new Set(
      (currentGraphData.nodes || []).map((node) => node.category || getCategoryFromNode(node)).filter(Boolean),
    ),
  ]

  // Function to determine category from node
  function getCategoryFromNode(node) {
    if (!node) return null
    if (node.category) return node.category

    // Fallback to color-based detection
    if (node.color === "#4285F4") return "Données personnelles"
    if (node.color === "#EA4335") return "Commerce électronique"
    if (node.color === "#FBBC05") return "Réseaux"
    if (node.color === "#34A853") return "Criminalité informatique"
    return null
  }

  // Set isMounted to false when component unmounts
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Update local graph data when props change
  useEffect(() => {
    if (graphData && graphData.nodes && graphData.nodes.length > 0) {
      setCurrentGraphData(graphData)
    }
  }, [graphData])

  // Load vis-network dynamically
  useEffect(() => {
    const loadVisNetwork = async () => {
      try {
        await import("vis-network")
        if (isMounted.current) {
          setVisLoaded(true)
        }
      } catch (err) {
        console.error("Failed to load vis-network:", err)
        if (isMounted.current) {
          setError("Failed to load visualization library. Please refresh the page.")
        }
      }
    }

    loadVisNetwork()
  }, [])

  // Fetch graph data for a term
  const fetchGraphData = async (termName, depth = 2) => {
    if (!termName || !isMounted.current) return

    setLoading(true)
    setError(null)

    try {
      console.log(`Fetching graph data for term: ${termName}, depth: ${depth}`)
      const data = await graphSearch(termName, depth)

      if (!isMounted.current) return

      if (data && data.nodes && data.nodes.length > 0 && data.edges) {
        console.log(`Received graph data: ${data.nodes.length} nodes, ${data.edges.length} edges`)

        // Convert edges to links if needed
        if (data.edges && !data.links) {
          data.links = data.edges
        }

        setCurrentGraphData(data)
      } else {
        console.error("Invalid or empty graph data format:", data)

        // Don't clear existing graph data if the new fetch returns empty data
        if (currentGraphData.nodes && currentGraphData.nodes.length > 0) {
          console.log("Keeping existing graph data")
          setError("No additional graph data available for this term")
        } else {
          setError("No graph data available for this term")
        }
      }
    } catch (err) {
      console.error(`Error fetching graph data for ${termName}:`, err)
      if (isMounted.current) {
        setError(`Failed to load graph data. Please try again.`)

        // Don't clear existing graph data on error
        if (!(currentGraphData.nodes && currentGraphData.nodes.length > 0)) {
          // Only set mock data if we don't have any data
          const mockData = generateMockGraphData(termName)
          setCurrentGraphData(mockData)
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  // Add this helper function to generate mock data if needed
  const generateMockGraphData = (termName) => {
    // Create a simple mock graph with the term as the central node
    const nodes = [
      {
        id: "node-central",
        label: termName,
        title: termName,
        color: "#4285F4",
        category: "Unknown",
        value: 5,
        shape: "dot",
      },
    ]

    // Add some related mock nodes
    const relatedTerms = ["Internet", "Data", "Network", "Security", "Protocol"]
    const edges = []

    relatedTerms.forEach((term, index) => {
      nodes.push({
        id: `node-${index}`,
        label: term,
        title: term,
        color: "#999999",
        category: "Unknown",
        value: 3,
        shape: "dot",
      })

      edges.push({
        from: "node-central",
        to: `node-${index}`,
        arrows: "to",
        color: { color: "#999999", opacity: 0.5 },
      })
    })

    return { nodes, edges }
  }

  // Preserve graph data between renders
  useEffect(() => {
    // Store current graph data in session storage when it changes
    if (currentGraphData && currentGraphData.nodes && currentGraphData.nodes.length > 0) {
      try {
        // Only store if we have meaningful data
        if (currentGraphData.nodes.length > 2) {
          console.log("Storing graph data in session storage")
          sessionStorage.setItem("graphData", JSON.stringify(currentGraphData))
        }
      } catch (err) {
        console.error("Failed to store graph data in session storage:", err)
      }
    }
  }, [currentGraphData])

  // Load stored graph data on initial render
  useEffect(() => {
    if (!currentGraphData || !currentGraphData.nodes || currentGraphData.nodes.length === 0) {
      try {
        const storedData = sessionStorage.getItem("graphData")
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          if (parsedData && parsedData.nodes && parsedData.nodes.length > 0) {
            console.log("Loaded graph data from session storage:", parsedData)
            setCurrentGraphData(parsedData)
          }
        }
      } catch (err) {
        console.error("Failed to load graph data from session storage:", err)
      }
    }
  }, [])

  // Cleanup function to safely destroy the network
  const safelyDestroyNetwork = () => {
    try {
      if (networkRef.current) {
        console.log("Safely destroying network")
        // Remove all event listeners first
        networkRef.current.off()
        // Destroy the network
        networkRef.current.destroy()
        networkRef.current = null
      }
    } catch (err) {
      console.error("Error destroying network:", err)
    }
  }

  // Validate and sanitize graph data
  const validateGraphData = (data) => {
    if (!data || !data.nodes || !Array.isArray(data.nodes)) {
      return { nodes: [], edges: [] }
    }

    // Ensure all nodes have required properties
    const validNodes = data.nodes
      .filter(
        (node) =>
          node &&
          typeof node === "object" &&
          node.id &&
          (typeof node.label === "string" || typeof node.label === "number"),
      )
      .map((node) => ({
        ...node,
        // Ensure required properties have default values
        shape: node.shape || "dot",
        color: node.color || "#999999",
        value: node.value || 3,
      }))

    // Get edges from either edges or links property
    const edgesArray = data.edges || data.links || []

    // Ensure all edges have required properties and reference valid nodes
    const nodeIds = new Set(validNodes.map((n) => n.id))
    const validEdges = edgesArray
      .filter(
        (edge) =>
          edge &&
          typeof edge === "object" &&
          (edge.from || edge.source) &&
          (edge.to || edge.target) &&
          nodeIds.has(edge.from || edge.source) &&
          nodeIds.has(edge.to || edge.target),
      )
      .map((edge) => ({
        from: edge.from || edge.source,
        to: edge.to || edge.target,
        arrows: edge.arrows || "to",
        color: edge.color || { color: "#999999", opacity: 0.5 },
      }))

    return { nodes: validNodes, edges: validEdges }
  }

  // Initialize or update the network visualization
  useEffect(() => {
    if (!containerRef.current || !visLoaded || !isMounted.current) return

    // Safely destroy any existing network first
    safelyDestroyNetwork()

    try {
      const { Network } = require("vis-network")
      const container = containerRef.current

      // Validate and sanitize the graph data
      const validatedData = validateGraphData(currentGraphData)

      // If no valid data, don't try to create the network
      if (validatedData.nodes.length === 0) {
        console.log("No valid graph data available yet")
        return
      }

      console.log("Initializing graph with validated data:", validatedData)

      // Apply category filters if any
      let filteredNodes = [...validatedData.nodes]
      let filteredEdges = [...validatedData.edges]

      if (selectedCategories.length > 0) {
        const nodeIds = filteredNodes
          .filter((node) => {
            const category = node.category || getCategoryFromNode(node)
            return category && selectedCategories.includes(category)
          })
          .map((node) => node.id)

        filteredNodes = filteredNodes.filter((node) => nodeIds.includes(node.id))
        filteredEdges = filteredEdges.filter((edge) => nodeIds.includes(edge.from) && nodeIds.includes(edge.to))
      }

      // Create the network with more conservative physics settings
      const data = {
        nodes: filteredNodes,
        edges: filteredEdges,
      }

      const options = {
        nodes: {
          shape: "dot",
          size: 16,
          font: {
            size: 12,
            color: darkMode ? "#f9fafb" : "#111827",
          },
          borderWidth: 1,
          shadow: true,
          scaling: {
            label: {
              enabled: true,
            },
          },
        },
        edges: {
          width: 1,
          color: { inherit: "from" },
          smooth: {
            type: "continuous",
            forceDirection: "none",
            roundness: 0.5,
          },
          font: {
            size: 10,
            color: darkMode ? "#d1d5db" : "#6b7280",
            strokeWidth: 0,
            background: darkMode ? "#1f2937" : "#ffffff",
          },
        },
        physics: {
          enabled: true,
          stabilization: {
            enabled: true,
            iterations: 100,
            updateInterval: 50,
            fit: true,
          },
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
          },
          maxVelocity: 50,
          minVelocity: 0.1,
          solver: "barnesHut",
          timestep: 0.5,
        },
        interaction: {
          navigationButtons: true,
          keyboard: true,
          hover: true,
          tooltipDelay: 200,
          hideEdgesOnDrag: true,
          hideEdgesOnZoom: true,
        },
      }

      try {
        // Create new network with error handling
        const newNetwork = new Network(container, data, options)

        // Store the network in both state and ref
        setNetwork(newNetwork)
        networkRef.current = newNetwork

        // Add event listeners with error handling
        newNetwork.on("click", (params) => {
          try {
            if (!isMounted.current || !containerRef.current) return

            if (params.nodes && params.nodes.length > 0) {
              const nodeId = params.nodes[0]
              const node = filteredNodes.find((n) => n.id === nodeId)
              if (node) {
                console.log("Node clicked:", node)

                // Create a more complete term object with better category handling
                const term = {
                  id: node.id,
                  name: node.label,
                  categories: [
                    {
                      name: node.category || getCategoryFromNode(node) || "Unknown",
                      principal_definition: {
                        text: node.description || "No detailed definition available for this term.",
                        reference: null,
                      },
                    },
                  ],
                }

                // Call onTermSelect without clearing the current graph
                onTermSelect(term)

                // Only fetch new graph data if we don't already have data for this term
                // This prevents the graph from disappearing
                if (currentGraphData.nodes.length < 3) {
                  fetchGraphData(node.label)
                }
              }
            }
          } catch (err) {
            console.error("Error handling node click:", err)
          }
        })

        newNetwork.on("hoverNode", (params) => {
          try {
            if (!isMounted.current || !containerRef.current) return

            const nodeId = params.node
            const node = filteredNodes.find((n) => n.id === nodeId)
            if (node) {
              setHoveredNode({
                id: node.id,
                label: node.label,
                category: node.category || getCategoryFromNode(node) || "Unknown",
              })
            }
          } catch (err) {
            console.error("Error handling node hover:", err)
          }
        })

        newNetwork.on("blurNode", (params) => {
          try {
            if (!isMounted.current || !containerRef.current) return
            setHoveredNode(null)
          } catch (err) {
            console.error("Error handling node blur:", err)
          }
        })

        // Fit the network to view all nodes after it's stabilized
        newNetwork.once("stabilizationIterationsDone", () => {
          try {
            if (!isMounted.current || !containerRef.current) return

            newNetwork.fit({
              animation: {
                duration: 1000,
                easingFunction: "easeInOutQuad",
              },
            })
          } catch (err) {
            console.error("Error fitting network view:", err)
          }
        })

        // Handle stabilization end
        newNetwork.once("stabilized", () => {
          try {
            if (!isMounted.current || !containerRef.current) return
            console.log("Network stabilized")
          } catch (err) {
            console.error("Error handling stabilization:", err)
          }
        })
      } catch (error) {
        console.error("Error initializing network:", error)
        if (isMounted.current) {
          setError("Failed to initialize graph visualization. Please try again.")
        }
      }
    } catch (error) {
      console.error("Error loading vis-network:", error)
      if (isMounted.current) {
        setError("Failed to load visualization library. Please try again.")
      }
    }

    // Cleanup function
    return () => {
      safelyDestroyNetwork()
    }
  }, [currentGraphData, darkMode, selectedCategories, visLoaded])

  // Add a useEffect to load initial graph data
  useEffect(() => {
    const loadInitialGraphData = async () => {
      if (!isMounted.current) return

      try {
        // Import the getFullGraphData function
        const { getFullGraphData } = await import("../../services/Api")

        setLoading(true)
        const data = await getFullGraphData()

        if (!isMounted.current) return

        if (data && data.nodes && data.nodes.length > 0) {
          console.log("Loaded initial graph data:", data)
          setCurrentGraphData(data)
        } else {
          console.log("No initial graph data available")
        }
      } catch (error) {
        console.error("Error loading initial graph data:", error)
      } finally {
        if (isMounted.current) {
          setLoading(false)
        }
      }
    }

    // Only load initial data if we don't already have graph data
    if ((!currentGraphData || !currentGraphData.nodes || currentGraphData.nodes.length === 0) && visLoaded) {
      loadInitialGraphData()
    }
  }, [visLoaded])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      safelyDestroyNetwork()
    }
  }, [])

  const handleZoomIn = () => {
    if (networkRef.current && containerRef.current) {
      try {
        const scale = networkRef.current.getScale() * 1.2
        networkRef.current.moveTo({ scale })
      } catch (err) {
        console.error("Error zooming in:", err)
      }
    }
  }

  const handleZoomOut = () => {
    if (networkRef.current && containerRef.current) {
      try {
        const scale = networkRef.current.getScale() * 0.8
        networkRef.current.moveTo({ scale })
      } catch (err) {
        console.error("Error zooming out:", err)
      }
    }
  }

  const handleReset = () => {
    if (networkRef.current && containerRef.current) {
      try {
        networkRef.current.fit({
          animation: {
            duration: 1000,
            easingFunction: "easeInOutQuad",
          },
        })
      } catch (err) {
        console.error("Error resetting view:", err)
      }
    }
  }

  const handleFullscreen = () => {
    const container = containerRef.current
    if (container) {
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          container.requestFullscreen()
        }
      } catch (err) {
        console.error("Error toggling fullscreen:", err)
      }
    }
  }

  const handleExportImage = () => {
    if (networkRef.current && containerRef.current) {
      try {
        const dataURL = networkRef.current.canvas.frame.canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.href = dataURL
        downloadLink.download = "ict-terms-graph.png"
        document.body.appendChild(downloadLink)
        downloadLink.click()
        setTimeout(() => {
          try {
            document.body.removeChild(downloadLink)
          } catch (err) {
            // Ignore errors when removing the download link
          }
        }, 100)
      } catch (err) {
        console.error("Error exporting image:", err)
        alert("Failed to export image. Please try again.")
      }
    }
  }

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
  }

  return (
    <div className="graph-search">
      <div className="ict-graph-controls-container">
        <div className="ict-graph-controls-group">
          <button className="ict-graph-control-btn" onClick={handleZoomIn} aria-label="Zoom in">
            <ZoomIn size={18} />
          </button>
          <button className="ict-graph-control-btn" onClick={handleZoomOut} aria-label="Zoom out">
            <ZoomOut size={18} />
          </button>
          <button className="ict-graph-control-btn" onClick={handleReset} aria-label="Reset view">
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="ict-graph-controls-group">
          <button className="ict-graph-control-btn" onClick={handleFullscreen} aria-label="Fullscreen">
            <Maximize size={18} />
          </button>
          <button className="ict-graph-control-btn" onClick={handleExportImage} aria-label="Export as image">
            <Download size={18} />
          </button>
          <button
            className={`ict-graph-control-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Filter categories"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="ict-category-filter-container">
          <div className="ict-filter-header">
            <div className="ict-filter-title">
              <SlidersHorizontal size={16} />
              <span>Filter Categories</span>
            </div>
            {selectedCategories.length > 0 && (
              <button className="ict-clear-filters-btn" onClick={clearFilters}>
                <X size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>
          <div className="ict-category-chips">
            {allCategories.map((category) => (
              <button
                key={category}
                className={`ict-category-chip ${selectedCategories.includes(category) ? "active" : ""}`}
                onClick={() => toggleCategory(category)}
                style={{
                  backgroundColor: selectedCategories.includes(category)
                    ? getCategoryColor(category) + "15"
                    : "transparent",
                  borderColor: getCategoryColor(category),
                  color: getCategoryColor(category),
                }}
              >
                <span className="ict-category-indicator" style={{ backgroundColor: getCategoryColor(category) }}></span>
                <span className="ict-category-name">{categoryTranslations[category] || category}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="loading-indicator">Loading graph data...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="ict-graph-container" ref={containerRef}>
        {!visLoaded && !loading && !error && <div className="loading-indicator">Loading visualization library...</div>}

        {currentGraphData && currentGraphData.nodes && currentGraphData.nodes.length === 0 && !loading && (
          <div className="no-data-message">
            <p>No graph data available. Please select a term to visualize its relationships.</p>
          </div>
        )}

        {hoveredNode && (
          <div className="ict-node-tooltip">
            <h4>{hoveredNode.label}</h4>
            <div
              className="ict-tooltip-category"
              style={{
                backgroundColor: getCategoryColor(hoveredNode.category) + "15",
                color: getCategoryColor(hoveredNode.category),
              }}
            >
              {categoryTranslations[hoveredNode.category] || hoveredNode.category}
            </div>
            <div className="ict-tooltip-action">
              <Share2 size={12} />
              <span>Click to view details</span>
            </div>
          </div>
        )}
      </div>

      {allCategories.length > 0 && (
        <div className="ict-graph-legend">
          <div className="ict-legend-title">Legend</div>
          <div className="ict-legend-items">
            {allCategories.map((category) => (
              <div key={category} className="ict-legend-item">
                <span className="ict-legend-color" style={{ backgroundColor: getCategoryColor(category) }}></span>
                <span className="ict-legend-label">{categoryTranslations[category] || category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GraphSearch







