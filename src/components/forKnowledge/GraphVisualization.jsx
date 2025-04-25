"use client"

import { useState, useRef, useEffect } from "react"
import GraphSearch from "./GraphSearch"
import GraphControls from "./GraphControls"
import GraphInfoPanel from "./GraphInfoPanel"
import GraphExport from "./GraphExport"
import "./GraphVisualization.css"

// Sample data for demonstration
const sampleGraphData = {
  nodes: [
    { id: 1, label: "Algorithm", category: "Computer Science" },
    { id: 2, label: "Data Structure", category: "Computer Science" },
    { id: 3, label: "Encryption", category: "Cybersecurity" },
    { id: 4, label: "Authentication", category: "Cybersecurity" },
    { id: 5, label: "API", category: "Software Development" },
    { id: 6, label: "Database", category: "Data Management" },
    { id: 7, label: "Protocol", category: "Networks" },
    { id: 8, label: "Confidentialité", category: "Données personnelles" },
  ],
  relationships: [
    { source: 1, target: 2, type: "RELATED_TO" },
    { source: 1, target: 5, type: "USED_IN" },
    { source: 2, target: 6, type: "USED_IN" },
    { source: 3, target: 4, type: "RELATED_TO" },
    { source: 3, target: 7, type: "USED_IN" },
    { source: 4, target: 8, type: "HAS_DEFINITION" },
    { source: 5, target: 6, type: "CONNECTS_TO" },
    { source: 7, target: 5, type: "IMPLEMENTS" },
  ],
}

const GraphVisualization = () => {
  const [graphData, setGraphData] = useState(sampleGraphData)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Statistics
  const stats = {
    nodeCount: graphData.nodes.length,
    relationshipCount: graphData.relationships.length,
    nodeLabels: [...new Set(graphData.nodes.map((node) => node.category))],
    relationshipTypes: [...new Set(graphData.relationships.map((rel) => rel.type))],
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      // Set canvas dimensions
      const container = containerRef.current
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply zoom
      ctx.save()
      ctx.scale(zoomLevel, zoomLevel)

      // Center the graph
      const centerX = canvas.width / 2 / zoomLevel
      const centerY = canvas.height / 2 / zoomLevel

      // Draw relationships
      graphData.relationships.forEach((rel) => {
        const source = graphData.nodes.find((n) => n.id === rel.source)
        const target = graphData.nodes.find((n) => n.id === rel.target)

        if (source && target) {
          // Calculate positions (simplified for demo)
          const sourceX = centerX + (source.id * 30 - 120)
          const sourceY = centerY + (source.id * 20 - 80)
          const targetX = centerX + (target.id * 30 - 120)
          const targetY = centerY + (target.id * 20 - 80)

          // Draw line
          ctx.beginPath()
          ctx.moveTo(sourceX, sourceY)
          ctx.lineTo(targetX, targetY)
          ctx.strokeStyle = getRelationshipColor(rel.type)
          ctx.lineWidth = 1.5
          ctx.stroke()

          // Draw relationship type
          const midX = (sourceX + targetX) / 2
          const midY = (sourceY + targetY) / 2
          ctx.fillStyle = "#666"
          ctx.font = "10px Arial"
          ctx.fillText(rel.type, midX, midY)
        }
      })

      // Draw nodes
      graphData.nodes.forEach((node) => {
        // Calculate position (simplified for demo)
        const x = centerX + (node.id * 30 - 120)
        const y = centerY + (node.id * 20 - 80)

        // Draw circle
        ctx.beginPath()
        ctx.arc(x, y, 15, 0, Math.PI * 2)
        ctx.fillStyle = getNodeColor(node.category)
        ctx.fill()

        // Draw border (highlight if selected)
        ctx.lineWidth = selectedNode && selectedNode.id === node.id ? 3 : 1
        ctx.strokeStyle = selectedNode && selectedNode.id === node.id ? "#ff5722" : "#333"
        ctx.stroke()

        // Draw label
        ctx.fillStyle = "#333"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(node.label, x, y + 30)
      })

      ctx.restore()
    }
  }, [graphData, zoomLevel, selectedNode])

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setGraphData(sampleGraphData)
    } else {
      const filteredNodes = sampleGraphData.nodes.filter(
        (node) =>
          node.label.toLowerCase().includes(query.toLowerCase()) ||
          node.category.toLowerCase().includes(query.toLowerCase()),
      )

      const nodeIds = filteredNodes.map((node) => node.id)

      const filteredRelationships = sampleGraphData.relationships.filter(
        (rel) => nodeIds.includes(rel.source) && nodeIds.includes(rel.target),
      )

      setGraphData({
        nodes: filteredNodes,
        relationships: filteredRelationships,
      })
    }
  }

  // Handle node click
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoomLevel
    const y = (e.clientY - rect.top) / zoomLevel

    // Center of the canvas
    const centerX = canvas.width / 2 / zoomLevel
    const centerY = canvas.height / 2 / zoomLevel

    // Check if a node was clicked
    let clickedNode = null

    graphData.nodes.forEach((node) => {
      const nodeX = centerX + (node.id * 30 - 120)
      const nodeY = centerY + (node.id * 20 - 80)

      const distance = Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2))

      if (distance <= 15) {
        clickedNode = node
      }
    })

    setSelectedNode(clickedNode)
  }

  // Helper function to get node color based on category
  const getNodeColor = (category) => {
    const colors = {
      "Computer Science": "#9370db",
      Cybersecurity: "#e74c3c",
      "Software Development": "#2ecc71",
      "Data Management": "#f1c40f",
      Networks: "#3498db",
      "Données personnelles": "#9b59b6",
    }

    return colors[category] || "#95a5a6"
  }

  // Helper function to get relationship color based on type
  const getRelationshipColor = (type) => {
    const colors = {
      RELATED_TO: "#3498db",
      USED_IN: "#2ecc71",
      HAS_DEFINITION: "#9b59b6",
      CONNECTS_TO: "#e74c3c",
      IMPLEMENTS: "#f1c40f",
    }

    return colors[type] || "#95a5a6"
  }

  // Toggle full screen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Handle zoom
  const handleZoom = (direction) => {
    if (direction === "in" && zoomLevel < 2) {
      setZoomLevel(zoomLevel + 0.1)
    } else if (direction === "out" && zoomLevel > 0.5) {
      setZoomLevel(zoomLevel - 0.1)
    } else if (direction === "reset") {
      setZoomLevel(1)
    }
  }

  // Toggle info panel
  const toggleInfoPanel = () => {
    setIsPanelOpen(!isPanelOpen)
  }

  return (
    <div className={`graph-visualization-container ${isFullScreen ? "fullscreen" : ""}`}>
      <div className="graph-header">
        <GraphSearch onSearch={handleSearch} />
        <GraphControls
          onZoomIn={() => handleZoom("in")}
          onZoomOut={() => handleZoom("out")}
          onZoomReset={() => handleZoom("reset")}
          onToggleFullScreen={toggleFullScreen}
          onToggleInfoPanel={toggleInfoPanel}
          isFullScreen={isFullScreen}
          isPanelOpen={isPanelOpen}
        />
      </div>

      <div className="graph-content">
        <div className="graph-canvas-container" ref={containerRef}>
          <canvas ref={canvasRef} onClick={handleCanvasClick} className="graph-canvas" />
        </div>

        {isPanelOpen && (
          <GraphInfoPanel stats={stats} selectedNode={selectedNode} onClose={() => setIsPanelOpen(false)} />
        )}
      </div>

      <GraphExport canvasRef={canvasRef} />
    </div>
  )
}

export default GraphVisualization
