"use client"

import React, { useState, useEffect } from "react"
import { AlertTriangle, Info, ChevronDown, ChevronUp, Play, X, BookOpen } from "lucide-react"
import "./GraphAlgorithms.css"

const GraphAlgorithms = ({ graphData, onApplyAlgorithm, darkMode }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null)
  const [expandedInfo, setExpandedInfo] = useState(null)
  const [showFormula, setShowFormula] = useState(null)
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Reset results when algorithm changes
  useEffect(() => {
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
      formula: `
        1. Initialize:
           - dist[source] = 0
           - dist[v] = ∞ for all other vertices
           - Q = set of all vertices
        
        2. While Q is not empty:
           - u = vertex in Q with smallest dist[u]
           - remove u from Q
           - for each neighbor v of u:
             - alt = dist[u] + length(u, v)
             - if alt < dist[v]:
               - dist[v] = alt
               - prev[v] = u
        
        3. Return dist[], prev[]
      `,
      complexity:
        "Time Complexity: O(|E| + |V|log|V|) with a binary heap implementation, where |V| is the number of vertices and |E| is the number of edges.",
    },
    {
      id: "pagerank",
      name: "PageRank",
      description:
        "Measures the importance of each node based on its connections, similar to how Google ranks web pages.",
      longDescription:
        "PageRank works by counting the number and quality of links to determine a rough estimate of how important a node is. The underlying assumption is that more important nodes are likely to receive more links from other nodes.",
      formula: `
        PR(A) = (1-d) + d × (PR(T₁)/C(T₁) + PR(T₂)/C(T₂) + ... + PR(Tₙ)/C(Tₙ))
        
        Where:
        - PR(A) is the PageRank of page A
        - PR(Tᵢ) is the PageRank of pages Tᵢ which link to page A
        - C(Tᵢ) is the number of outbound links from page Tᵢ
        - d is a damping factor (usually 0.85)
      `,
      complexity: "Time Complexity: O(k|V|) where k is the number of iterations and |V| is the number of vertices.",
    },
    {
      id: "connected-components",
      name: "Connected Components",
      description: "Identifies isolated subgraphs where any node can reach any other node within the same component.",
      longDescription:
        "This algorithm finds groups of nodes that are connected to each other but disconnected from other groups. It helps identify isolated clusters of concepts in your knowledge graph.",
      formula: `
        1. Initialize all vertices as unvisited
        2. For each unvisited vertex v:
           - Mark v as visited
           - Find all vertices reachable from v using DFS or BFS
           - All vertices visited in this process form one connected component
        3. Repeat until all vertices are visited
      `,
      complexity: "Time Complexity: O(|V| + |E|) where |V| is the number of vertices and |E| is the number of edges.",
    },
    {
      id: "betweenness-centrality",
      name: "Betweenness Centrality",
      description: "Measures how often a node appears on the shortest paths between other nodes in the network.",
      longDescription:
        "Betweenness centrality quantifies the number of times a node acts as a bridge along the shortest path between two other nodes. Nodes with high betweenness centrality often control the flow of information in a network.",
      formula: `
        BC(v) = ∑ₛ≠ᵥ≠ₜ (σₛₜ(v) / σₛₜ)
        
        Where:
        - BC(v) is the betweenness centrality of vertex v
        - σₛₜ is the total number of shortest paths from node s to node t
        - σₛₜ(v) is the number of those paths that pass through v
      `,
      complexity: "Time Complexity: O(|V|²|E|) for unweighted graphs and O(|V|²log|V| + |V||E|) for weighted graphs.",
    },
    {
      id: "closeness-centrality",
      name: "Closeness Centrality",
      description: "Measures how close a node is to all other nodes in the network based on shortest paths.",
      longDescription:
        "Closeness centrality is calculated as the reciprocal of the sum of the shortest path distances from a node to all other nodes. Nodes with high closeness centrality can efficiently spread information to all other nodes.",
      formula: `
        C(v) = (n-1) / ∑ᵤ d(v,u)
        
        Where:
        - C(v) is the closeness centrality of vertex v
        - n is the number of nodes in the graph
        - d(v,u) is the shortest-path distance between v and u
        - ∑ᵤ d(v,u) is the sum of all shortest path distances from v to all other nodes
      `,
      complexity: "Time Complexity: O(|V||E|) for unweighted graphs and O(|V|²log|V| + |V||E|) for weighted graphs.",
    },
  ]

  const toggleInfo = (id) => {
    setExpandedInfo(expandedInfo === id ? null : id)
  }

  const toggleFormula = (id) => {
    if (showFormula === id) {
      setShowFormula(null)
    } else {
      setShowFormula(id)
      // Close any expanded info when showing formula
      if (expandedInfo === id) {
        setExpandedInfo(null)
      }
    }
  }

  const handleApplyAlgorithm = async (algorithmId) => {
    setIsLoading(true)
    setError(null)

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
          <div className="graph-algo-result-content">
            <h4>Shortest Path</h4>
            <div className="graph-algo-path">
              {results.path.map((node, index) => (
                <React.Fragment key={index}>
                  <span className="graph-algo-node">{node}</span>
                  {index < results.path.length - 1 && <span className="graph-algo-arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="graph-algo-detail">{results.details}</p>
          </div>
        )

      case "pagerank":
      case "betweenness-centrality":
      case "closeness-centrality":
        return (
          <div className="graph-algo-result-content">
            <h4>Top Ranked Nodes</h4>
            <div className="graph-algo-ranking">
              {results.topNodes.map((node, index) => (
                <div key={index} className="graph-algo-rank-item">
                  <span className="graph-algo-rank-name">{node.name}</span>
                  <div className="graph-algo-rank-bar-container">
                    <div className="graph-algo-rank-bar" style={{ width: `${node.score * 100}%` }}></div>
                  </div>
                  <span className="graph-algo-rank-score">{(node.score * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "connected-components":
        return (
          <div className="graph-algo-result-content">
            <h4>Connected Components Found: {results.count}</h4>
            <div className="graph-algo-components">
              {results.components.map((component, index) => (
                <div key={index} className="graph-algo-component">
                  <h5>
                    Component {component.id} <span>({component.size} nodes)</span>
                  </h5>
                  <div className="graph-algo-component-nodes">
                    {component.nodes.map((node, nodeIndex) => (
                      <span key={nodeIndex} className="graph-algo-component-node">
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
          <div className="graph-algo-result-content">
            <p>{results.message}</p>
          </div>
        )
    }
  }

  return (
    <div className="graph-algo-panel">
      <div className="graph-algo-header">
        <h3>Graph Data Science Algorithms</h3>
        <p>Apply algorithms to discover insights in your knowledge graph</p>
      </div>

      <div className="graph-algo-algorithms">
        {algorithms.map((algorithm) => (
          <div
            key={algorithm.id}
            className={`graph-algo-algorithm ${selectedAlgorithm === algorithm.id ? "active" : ""}`}
          >
            <div className="graph-algo-algorithm-header">
              <h4>{algorithm.name}</h4>
              <div className="graph-algo-algorithm-actions">
                <button
                  className="graph-algo-info-btn"
                  onClick={() => toggleInfo(algorithm.id)}
                  aria-label="Show more information"
                >
                  {expandedInfo === algorithm.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button
                  className="graph-algo-formula-btn"
                  onClick={() => toggleFormula(algorithm.id)}
                  aria-label="Show formula"
                >
                  <BookOpen size={16} />
                </button>
                <button
                  className={`graph-algo-apply-btn ${selectedAlgorithm === algorithm.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedAlgorithm(algorithm.id)
                    handleApplyAlgorithm(algorithm.id)
                  }}
                  disabled={isLoading}
                  aria-label="Apply algorithm"
                >
                  {isLoading && selectedAlgorithm === algorithm.id ? (
                    <span className="graph-algo-loading"></span>
                  ) : (
                    <Play size={16} />
                  )}
                  Apply
                </button>
              </div>
            </div>

            <p className="graph-algo-algorithm-desc">{algorithm.description}</p>

            {expandedInfo === algorithm.id && (
              <div className="graph-algo-algorithm-details">
                <p>{algorithm.longDescription}</p>
              </div>
            )}

            {showFormula === algorithm.id && (
              <div className="search-page-gds-algorithm-formula">
                <div className="search-page-gds-formula-sections">
                  <div className="search-page-gds-formula-section">
                    <h5>Algorithm Description</h5>
                    <p>{algorithm.longDescription}</p>
                  </div>

                  <div className="search-page-gds-formula-section">
                    <h5>Mathematical Formula</h5>
                    <pre>{algorithm.formula}</pre>
                  </div>

                  <div className="search-page-gds-formula-section">
                    <h5>Computational Complexity</h5>
                    <p className="search-page-gds-algorithm-complexity">{algorithm.complexity}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="graph-algo-results">
        <div className="graph-algo-results-header">
          <h4>Results</h4>
          {selectedAlgorithm && results && (
            <button
              className="graph-algo-clear-btn"
              onClick={() => {
                setResults(null)
                setSelectedAlgorithm(null)
                if (onApplyAlgorithm) {
                  onApplyAlgorithm(null, null)
                }
              }}
              aria-label="Clear results"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="graph-algo-loading-container">
            <div className="graph-algo-loading"></div>
            <p>Analyzing graph data...</p>
          </div>
        ) : error ? (
          <div className="graph-algo-error">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        ) : results ? (
          renderResults()
        ) : (
          <div className="graph-algo-placeholder">
            <Info size={20} />
            <p>Select an algorithm to analyze your knowledge graph</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GraphAlgorithms

