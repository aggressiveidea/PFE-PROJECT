"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import ForceGraph2D from "react-force-graph-2d"
import GraphSearch from "./GraphSearch"
import GraphInfoPanel from "./GraphInfoPanel"
import "./GraphVisualization.css"

// Simple resize observer hook implementation
const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null)

  useEffect(() => {
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
    }
  }

  return { nodes, links }
}

// Helper function to generate a deterministic position based on node ID
const generateDeterministicPosition = (id, radius = 500) => {
  // Create a simple hash from the ID string
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
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

export default GraphVisualization
