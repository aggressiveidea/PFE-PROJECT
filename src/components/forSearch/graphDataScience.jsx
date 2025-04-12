"use client"

import React, { useState, useEffect } from "react"
import "./GraphDataSciencePanel.css"
import { AlertTriangle, Info, ChevronDown, ChevronUp, Play, X } from "lucide-react"

const GraphDataSciencePanel = ({ graphData, onApplyAlgorithm, darkMode }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null)
  const [expandedInfo, setExpandedInfo] = useState(null)
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Reset results when algorithm changes
  useEffect(() => {
    setResults(null)
    setError(null)
  }, [selectedAlgorithm])

  const algorithms = [
    {
      id: "dijkstra",
      name: "Dijkstra's Algorithm",
      description:
        "Finds the shortest path between nodes in a graph, accounting for edge weights. Ideal for routing and navigation applications.",
      longDescription:
        "Dijkstra's algorithm is a greedy algorithm that solves the single-source shortest path problem for a directed or undirected graph with non-negative edge weights. This makes it ideal for finding the most efficient route between two concepts in your knowledge graph.",
    },
    {
      id: "pagerank",
      name: "PageRank",
      description:
        "Measures the importance of each node based on its connections, similar to how Google ranks web pages.",
      longDescription:
        "PageRank works by counting the number and quality of links to determine a rough estimate of how important a node is. The underlying assumption is that more important nodes are likely to receive more links from other nodes.",
    },
    {
      id: "connected-components",
      name: "Connected Components",
      description: "Identifies isolated subgraphs where any node can reach any other node within the same component.",
      longDescription:
        "This algorithm finds groups of nodes that are connected to each other but disconnected from other groups. It helps identify isolated clusters of concepts in your knowledge graph.",
    },
    {
      id: "betweenness-centrality",
      name: "Betweenness Centrality",
      description: "Measures how often a node appears on the shortest paths between other nodes in the network.",
      longDescription:
        "Betweenness centrality quantifies the number of times a node acts as a bridge along the shortest path between two other nodes. Nodes with high betweenness centrality often control the flow of information in a network.",
    },
    {
      id: "closeness-centrality",
      name: "Closeness Centrality",
      description: "Measures how close a node is to all other nodes in the network based on shortest paths.",
      longDescription:
        "Closeness centrality is calculated as the reciprocal of the sum of the shortest path distances from a node to all other nodes. Nodes with high closeness centrality can efficiently spread information to all other nodes.",
    },
  ]

  const toggleInfo = (id) => {
    setExpandedInfo(expandedInfo === id ? null : id)
  }

  const handleApplyAlgorithm = async (algorithmId) => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      // In a real implementation, this would call your actual algorithm function
      // For now, we'll simulate a response after a delay
      setTimeout(() => {
        const algorithm = algorithms.find((a) => a.id === algorithmId)

        // Generate mock results based on the algorithm
        let mockResults

        switch (algorithmId) {
          case "dijkstra":
            mockResults = {
              path: ["Accès", "Adresse IP", "Algorithme"],
              distance: 2,
              details: "Shortest path found through 2 connections with total weight of 3.5",
            }
            break
          case "pagerank":
            mockResults = {
              topNodes: [
                { name: "Algorithme", score: 0.89 },
                { name: "Accès", score: 0.76 },
                { name: "Adresse IP", score: 0.65 },
                { name: "Abréviation", score: 0.42 },
                { name: "Abonné", score: 0.38 },
              ],
            }
            break
          case "connected-components":
            mockResults = {
              components: [
                { id: 1, nodes: ["Abonné", "Accès", "Adresse IP", "Algorithme"], size: 4 },
                { id: 2, nodes: ["Abréviation", "Message digest", "Condensat checksum"], size: 3 },
              ],
              count: 2,
            }
            break
          case "betweenness-centrality":
            mockResults = {
              topNodes: [
                { name: "Accès", score: 0.85 },
                { name: "Abréviation", score: 0.67 },
                { name: "Adresse IP", score: 0.54 },
              ],
            }
            break
          case "closeness-centrality":
            mockResults = {
              topNodes: [
                { name: "Algorithme", score: 0.92 },
                { name: "Accès", score: 0.78 },
                { name: "Adresse IP", score: 0.65 },
              ],
            }
            break
          default:
            mockResults = { message: "Algorithm executed successfully" }
        }

        setResults(mockResults)

        // Call the parent component's handler to update the graph visualization
        if (onApplyAlgorithm) {
          onApplyAlgorithm(algorithmId, mockResults)
        }

        setIsLoading(false)
      }, 1500)
    } catch (err) {
      setError("Failed to execute algorithm. Please try again.")
      setIsLoading(false)
    }
  }

  const renderResults = () => {
    if (!results) return null

    switch (selectedAlgorithm) {
      case "dijkstra":
        return (
          <div className="search-page-gds-result-content">
            <h4>Shortest Path</h4>
            <div className="search-page-gds-path">
              {results.path.map((node, index) => (
                <React.Fragment key={index}>
                  <span className="search-page-gds-node">{node}</span>
                  {index < results.path.length - 1 && <span className="search-page-gds-arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="search-page-gds-detail">{results.details}</p>
          </div>
        )

      case "pagerank":
      case "betweenness-centrality":
      case "closeness-centrality":
        return (
          <div className="search-page-gds-result-content">
            <h4>Top Ranked Nodes</h4>
            <div className="search-page-gds-ranking">
              {results.topNodes.map((node, index) => (
                <div key={index} className="search-page-gds-rank-item">
                  <span className="search-page-gds-rank-name">{node.name}</span>
                  <div className="search-page-gds-rank-bar-container">
                    <div className="search-page-gds-rank-bar" style={{ width: `${node.score * 100}%` }}></div>
                  </div>
                  <span className="search-page-gds-rank-score">{(node.score * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "connected-components":
        return (
          <div className="search-page-gds-result-content">
            <h4>Connected Components Found: {results.count}</h4>
            <div className="search-page-gds-components">
              {results.components.map((component, index) => (
                <div key={index} className="search-page-gds-component">
                  <h5>
                    Component {component.id} <span>({component.size} nodes)</span>
                  </h5>
                  <div className="search-page-gds-component-nodes">
                    {component.nodes.map((node, nodeIndex) => (
                      <span key={nodeIndex} className="search-page-gds-component-node">
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="search-page-gds-result-content">
            <p>{results.message}</p>
          </div>
        )
    }
  }

  return (
    <div className={`search-page-gds-panel ${darkMode ? "dark" : ""}`}>
      <div className="search-page-gds-header">
        <h3>Graph Data Science Algorithms</h3>
        <p>Apply algorithms to discover insights in your knowledge graph</p>
      </div>

      <div className="search-page-gds-algorithms">
        {algorithms.map((algorithm) => (
          <div
            key={algorithm.id}
            className={`search-page-gds-algorithm ${selectedAlgorithm === algorithm.id ? "active" : ""}`}
          >
            <div className="search-page-gds-algorithm-header">
              <h4>{algorithm.name}</h4>
              <div className="search-page-gds-algorithm-actions">
                <button
                  className="search-page-gds-info-btn"
                  onClick={() => toggleInfo(algorithm.id)}
                  aria-label="Show more information"
                >
                  {expandedInfo === algorithm.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button
                  className={`search-page-gds-apply-btn ${selectedAlgorithm === algorithm.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedAlgorithm(algorithm.id)
                    handleApplyAlgorithm(algorithm.id)
                  }}
                  disabled={isLoading}
                  aria-label="Apply algorithm"
                >
                  {isLoading && selectedAlgorithm === algorithm.id ? (
                    <span className="search-page-gds-loading"></span>
                  ) : (
                    <Play size={16} />
                  )}
                  Apply
                </button>
              </div>
            </div>

            <p className="search-page-gds-algorithm-desc">{algorithm.description}</p>

            {expandedInfo === algorithm.id && (
              <div className="search-page-gds-algorithm-details">
                <p>{algorithm.longDescription}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="search-page-gds-results">
        <div className="search-page-gds-results-header">
          <h4>Results</h4>
          {selectedAlgorithm && results && (
            <button
              className="search-page-gds-clear-btn"
              onClick={() => {
                setResults(null)
                setSelectedAlgorithm(null)
              }}
              aria-label="Clear results"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="search-page-gds-loading-container">
            <div className="search-page-gds-loading"></div>
            <p>Analyzing graph data...</p>
          </div>
        ) : error ? (
          <div className="search-page-gds-error">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        ) : results ? (
          renderResults()
        ) : (
          <div className="search-page-gds-placeholder">
            <Info size={20} />
            <p>Select an algorithm to analyze your knowledge graph</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GraphDataSciencePanel
