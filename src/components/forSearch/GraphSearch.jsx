"use client"

import { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, RotateCcw, SlidersHorizontal, X, Maximize, Download, Share2 } from "lucide-react"

const GraphSearch = ({ graphData, onTermSelect, categoryTranslations, darkMode, getCategoryColor = () => "#666" }) => {
  const containerRef = useRef(null)
  const [network, setNetwork] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredNode, setHoveredNode] = useState(null)

  // Get all unique categories from graph nodes
  const allCategories = [
    ...new Set(
      graphData.nodes
        .map((node) => {
          // Extract category from node color or other property
          const categoryName = getCategoryFromNode(node)
          return categoryName
        })
        .filter(Boolean),
    ),
  ]

  // Function to determine category from node
  function getCategoryFromNode(node) {
    if (node.color === "#4285F4") return "Données personnelles"
    if (node.color === "#EA4335") return "Commerce électronique"
    if (node.color === "#FBBC05") return "Réseaux"
    return null
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Import vis-network dynamically to avoid SSR issues
    import("vis-network").then(({ Network }) => {
      const container = containerRef.current

      // Filter nodes based on selected categories if any
      let filteredNodes = [...graphData.nodes]
      let filteredEdges = [...graphData.edges]

      if (selectedCategories.length > 0) {
        const nodeIds = filteredNodes
          .filter((node) => {
            const category = getCategoryFromNode(node)
            return category && selectedCategories.includes(category)
          })
          .map((node) => node.id)

        filteredNodes = filteredNodes.filter((node) => nodeIds.includes(node.id))
        filteredEdges = filteredEdges.filter((edge) => nodeIds.includes(edge.from) && nodeIds.includes(edge.to))
      }

      // Create the network
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
          },
          font: {
            size: 10,
            color: darkMode ? "#d1d5db" : "#6b7280",
            strokeWidth: 0,
            background: darkMode ? "#1f2937" : "#ffffff",
          },
        },
        physics: {
          stabilization: false,
          barnesHut: {
            gravitationalConstant: -80,
            springConstant: 0.001,
            springLength: 200,
          },
        },
        interaction: {
          navigationButtons: true,
          keyboard: true,
          hover: true,
          tooltipDelay: 200,
        },
      }

      const newNetwork = new Network(container, data, options)

      // Add event listeners
      newNetwork.on("click", (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0]
          const node = data.nodes.find((n) => n.id === nodeId)
          if (node) {
            // Find the term in your terms data and call onTermSelect
            const term = {
              id: node.id,
              name: node.label,
              categories: [
                {
                  name: getCategoryFromNode(node) || "Unknown",
                  principal_definition: {
                    text: "Definition would be here in a real implementation.",
                    reference: null,
                  },
                },
              ],
            }
            onTermSelect(term)
          }
        }
      })

      newNetwork.on("hoverNode", (params) => {
        const nodeId = params.node
        const node = data.nodes.find((n) => n.id === nodeId)
        if (node) {
          setHoveredNode({
            id: node.id,
            label: node.label,
            category: getCategoryFromNode(node) || "Unknown",
          })
        }
      })

      newNetwork.on("blurNode", () => {
        setHoveredNode(null)
      })

      setNetwork(newNetwork)

      return () => {
        newNetwork.destroy()
      }
    })
  }, [graphData, darkMode, selectedCategories, onTermSelect])

  const handleZoomIn = () => {
    if (network) {
      const scale = network.getScale() * 1.2
      network.moveTo({ scale })
    }
  }

  const handleZoomOut = () => {
    if (network) {
      const scale = network.getScale() * 0.8
      network.moveTo({ scale })
    }
  }

  const handleReset = () => {
    if (network) {
      network.fit()
    }
  }

  const handleFullscreen = () => {
    const container = containerRef.current
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        container.requestFullscreen()
      }
    }
  }

  const handleExportImage = () => {
    if (network) {
      const dataURL = network.canvas.frame.canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.href = dataURL
      downloadLink.download = "ict-terms-graph.png"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
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

      <div className="ict-graph-container" ref={containerRef}>
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
    </div>
  )
}

export default GraphSearch

