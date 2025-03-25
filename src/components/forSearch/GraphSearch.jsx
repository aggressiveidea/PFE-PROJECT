"use client"

import { useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react"

const GraphSearch = ({ graphData, onTermSelect, categoryTranslations }) => {
  const containerRef = useRef(null)
  const networkRef = useRef(null)

  // Category colors and icons mapping with image URLs
  const categoryInfo = {
    "Com.élec.": {
      color: "#4285F4", // E-commerce (blue)
      imageUrl: "https://cdn-icons-png.flaticon.com/512/3144/3144456.png", // Shopping cart icon
      label: "E-commerce",
    },
    "Con.info.": {
      color: "#EA4335", // IT Contracts (red)
      imageUrl: "https://cdn-icons-png.flaticon.com/512/2521/2521232.png", // Contract/document icon
      label: "IT Contracts",
    },
    "Crim.info.": {
      color: "#FBBC05", // IT Crime (yellow)
      imageUrl: "https://cdn-icons-png.flaticon.com/512/2092/2092757.png", // Hacker/security icon
      label: "IT Crime",
    },
    "Don.pers.": {
      color: "#34A853", // Personal Data (green)
      imageUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077340.png", // Database icon
      label: "Personal Data",
    },
    "Org.": {
      color: "#FF6D01", // Organizations (orange)
      imageUrl: "https://cdn-icons-png.flaticon.com/512/4300/4300059.png", // Organization/building icon
      label: "Organizations",
    },
    "Pro.int.": {
      color: "#46BDC6", // Intellectual Property (teal)
      imageUrl: "https://cdn-icons-png.flaticon.com/512/1668/1668252.png", // Copyright/IP icon
      label: "Intellectual Property",
    },
    "Rés.": {
      color: "#7B61FF", // Networks (purple)
      imageUrl: "https://cdn-icons-png.flaticon.com/512/2885/2885417.png", // Network icon
      label: "Networks",
    },
  }

  useEffect(() => {
    // Skip if no data or container
    if (!graphData || !containerRef.current) return

    // Import libraries dynamically
    const initNetwork = async () => {
      try {
        // Import vis-network dynamically
        const { Network } = await import("vis-network")
        const { DataSet } = await import("vis-data")

        // Create category nodes with images
        const categoryNodes = Object.entries(categoryInfo).map(([category, info]) => ({
          id: `cat_${category}`,
          label: categoryTranslations?.[category] || info.label,
          shape: "image",
          image: info.imageUrl,
          size: 40,
          font: {
            size: 14,
            color: "#333",
            face: "Arial",
            bold: true,
            background: "rgba(255, 255, 255, 0.8)",
            strokeWidth: 2,
            strokeColor: "#ffffff",
            vadjust: -40, // Move the label below the icon
          },
          borderWidth: 2,
          shadow: true,
          shapeProperties: {
            useBorderWithImage: true,
          },
        }))

        // Create term nodes
        const termNodes = graphData.nodes.map((node) => ({
          id: node.id,
          label: node.label || "Unknown",
          color: {
            background: node.color,
            border: node.color,
          },
          shape: "dot",
          size: 15,
          font: { size: 12 },
        }))

        // Create edges between terms and categories
        const categoryEdges = []
        graphData.nodes.forEach((node) => {
          const categoryName = getCategoryFromColor(node.color)
          if (categoryName) {
            categoryEdges.push({
              from: `cat_${categoryName}`,
              to: node.id,
              color: { color: node.color, opacity: 0.6 },
              width: 2,
            })
          }
        })

        // Create edges between terms
        const termEdges = graphData.edges.map((edge) => ({
          from: edge.source,
          to: edge.target,
          color: { color: "#dddddd", opacity: 0.3 },
          width: 1,
          dashes: [5, 5],
        }))

        // Combine all nodes and edges
        const nodes = new DataSet([...categoryNodes, ...termNodes])
        const edges = new DataSet([...categoryEdges, ...termEdges])

        // Network options
        const options = {
          physics: {
            stabilization: {
              enabled: true,
              iterations: 100,
            },
            barnesHut: {
              gravitationalConstant: -2000,
              centralGravity: 0.1,
              springLength: 150,
              springConstant: 0.05,
            },
          },
          interaction: {
            hover: true,
            zoomView: true,
            dragView: true,
          },
          nodes: {
            borderWidth: 2,
            shadow: {
              enabled: true,
              color: "rgba(0,0,0,0.2)",
              size: 5,
              x: 0,
              y: 0,
            },
          },
        }

        // Create network
        const network = new Network(containerRef.current, { nodes, edges }, options)

        // Store network reference
        networkRef.current = network

        // Simple click handler
        network.on("click", (params) => {
          if (params.nodes.length) {
            const nodeId = params.nodes[0]

            // Skip if it's a category node
            if (nodeId.toString().startsWith("cat_")) return

            const node = graphData.nodes.find((n) => n.id === nodeId)
            if (node) {
              // Find the category for this node
              const categoryName = getCategoryFromColor(node.color)

              // Create a safe term object with all required properties
              const termData = {
                id: nodeId,
                name: node.label || "Unknown",
                categories: [
                  {
                    name: categoryName || "Unknown",
                    principal_definition: {
                      text: "Definition not available",
                      reference: null,
                    },
                  },
                ],
                pages: [{ lang: "EN", num: 1, pos: 1 }],
              }

              onTermSelect(termData)
            }
          }
        })

        // Fit the network once it's stabilized
        network.once("stabilizationIterationsDone", () => {
          network.fit()
        })
      } catch (error) {
        console.error("Error initializing network:", error)
      }
    }

    initNetwork()

    // Clean up
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy()
        networkRef.current = null
      }
    }
  }, [graphData, onTermSelect, categoryTranslations])

  // Helper function to get category from color
  const getCategoryFromColor = (color) => {
    // Find the closest color match
    let closestCategory = null
    let closestDistance = Number.POSITIVE_INFINITY

    Object.entries(categoryInfo).forEach(([category, info]) => {
      const distance = Math.abs(color?.localeCompare(info.color) || 100)
      if (distance < closestDistance) {
        closestDistance = distance
        closestCategory = category
      }
    })

    return closestCategory
  }

  // Zoom controls
  const zoomIn = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale() * 1.2
      networkRef.current.moveTo({ scale })
    }
  }

  const zoomOut = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale() / 1.2
      networkRef.current.moveTo({ scale })
    }
  }

  const centerView = () => {
    if (networkRef.current) {
      networkRef.current.fit()
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        className="graph-controls"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={zoomIn}
          style={{
            padding: "8px",
            borderRadius: "4px",
            background: "#8a3ffc",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={zoomOut}
          style={{
            padding: "8px",
            borderRadius: "4px",
            background: "#8a3ffc",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={centerView}
          style={{
            padding: "8px",
            borderRadius: "4px",
            background: "#8a3ffc",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div
        ref={containerRef}
        style={{
          height: "500px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "white",
        }}
      ></div>

      <div
        style={{
          textAlign: "center",
          marginTop: "10px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "10px", flexWrap: "wrap" }}>
          {Object.entries(categoryInfo).map(([category, info]) => (
            <div key={category} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <img
                src={info.imageUrl || "/placeholder.svg"}
                alt={info.label}
                style={{ width: "16px", height: "16px" }}
              />
              <span>{info.label}</span>
            </div>
          ))}
        </div>
        Click on a term to view its details
      </div>
    </div>
  )
}

export default GraphSearch


