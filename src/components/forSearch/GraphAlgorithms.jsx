"use client"

import { useState } from "react"
import { Calculator, ArrowRight, BarChart2, Network, GitBranch } from "lucide-react"
import './GraphAlgorithms.css'
const GraphAlgorithms = ({ graphData, onApplyAlgorithm, darkMode, algorithmResults }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("")
  const [sourceNode, setSourceNode] = useState("")
  const [targetNode, setTargetNode] = useState("")
  const [maxDepth, setMaxDepth] = useState(3)
  const [limit, setLimit] = useState(10)

  const algorithms = [
    {
      id: "shortestPath",
      name: "Shortest Path",
      description: "Find the shortest path between two terms",
      icon: <ArrowRight size={18} />,
      requiresSource: true,
      requiresTarget: true,
    },
    {
      id: "centrality",
      name: "Centrality Analysis",
      description: "Identify the most important terms in the network",
      icon: <BarChart2 size={18} />,
      requiresLimit: true,
    },
    {
      id: "community",
      name: "Community Detection",
      description: "Detect communities of related terms",
      icon: <Network size={18} />,
    },
    {
      id: "connectedComponents",
      name: "Connected Components",
      description: "Find groups of connected terms",
      icon: <GitBranch size={18} />,
    },
  ]

  const handleAlgorithmSelect = (algorithmId) => {
    setSelectedAlgorithm(algorithmId)
    if (algorithmId === "") {
      // Clear results when deselecting
      onApplyAlgorithm(null)
    }
  }

  const handleApplyAlgorithm = () => {
    const algorithm = algorithms.find((a) => a.id === selectedAlgorithm)
    if (!algorithm) return

    const params = {}

    if (algorithm.requiresSource && sourceNode) {
      params.source = sourceNode
    }

    if (algorithm.requiresTarget && targetNode) {
      params.target = targetNode
    }

    if (algorithm.requiresLimit) {
      params.limit = limit
    }

    params.maxDepth = maxDepth

    onApplyAlgorithm(selectedAlgorithm, params)
  }

  const renderAlgorithmForm = () => {
    const algorithm = algorithms.find((a) => a.id === selectedAlgorithm)
    if (!algorithm) return null

    return (
      <div className="ict-algorithm-form">
        <h3 className="ict-algorithm-form-title">{algorithm.name} Parameters</h3>
        <p className="ict-algorithm-form-description">{algorithm.description}</p>

        {algorithm.requiresSource && (
          <div className="ict-form-group">
            <label htmlFor="sourceNode">Source Term:</label>
            <input
              type="text"
              id="sourceNode"
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              placeholder="Enter source term name"
              className="ict-form-input"
            />
          </div>
        )}

        {algorithm.requiresTarget && (
          <div className="ict-form-group">
            <label htmlFor="targetNode">Target Term:</label>
            <input
              type="text"
              id="targetNode"
              value={targetNode}
              onChange={(e) => setTargetNode(e.target.value)}
              placeholder="Enter target term name"
              className="ict-form-input"
            />
          </div>
        )}

        <div className="ict-form-group">
          <label htmlFor="maxDepth">Max Depth:</label>
          <input
            type="number"
            id="maxDepth"
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number.parseInt(e.target.value))}
            min="1"
            max="5"
            className="ict-form-input"
          />
        </div>

        {algorithm.requiresLimit && (
          <div className="ict-form-group">
            <label htmlFor="limit">Result Limit:</label>
            <input
              type="number"
              id="limit"
              value={limit}
              onChange={(e) => setLimit(Number.parseInt(e.target.value))}
              min="1"
              max="50"
              className="ict-form-input"
            />
          </div>
        )}

        <button className="ict-apply-algorithm-btn" onClick={handleApplyAlgorithm}>
          Apply {algorithm.name}
        </button>
      </div>
    )
  }

  const renderAlgorithmResults = () => {
    if (!algorithmResults) return null

    return (
      <div className="ict-algorithm-results">
        <h3 className="ict-algorithm-results-title">Algorithm Results</h3>

        {algorithmResults.pathLength && (
          <div className="ict-result-item">
            <span className="ict-result-label">Path Length:</span>
            <span className="ict-result-value">{algorithmResults.pathLength}</span>
          </div>
        )}

        {algorithmResults.path && (
          <div className="ict-result-item">
            <span className="ict-result-label">Path:</span>
            <span className="ict-result-value">{algorithmResults.path.join(" → ")}</span>
          </div>
        )}

        {algorithmResults.communityCount && (
          <div className="ict-result-item">
            <span className="ict-result-label">Communities Found:</span>
            <span className="ict-result-value">{algorithmResults.communityCount}</span>
          </div>
        )}

        {algorithmResults.topNodes && (
          <div className="ict-result-table">
            <h4>Top Terms by Importance</h4>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Term</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {algorithmResults.topNodes.map((node, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{node.name}</td>
                    <td>{node.score.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {algorithmResults.components && (
          <div className="ict-result-communities">
            <h4>Communities</h4>
            {algorithmResults.components.map((component, index) => (
              <div key={index} className="ict-community-item">
                <h5>
                  Community {index + 1} ({component.nodes.length} terms)
                </h5>
                <div className="ict-community-terms">
                  {component.nodes.map((term, i) => (
                    <span key={i} className="ict-community-term">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`graph-algorithms ${darkMode ? "dark" : ""}`}>
      <div className="ict-algorithms-container">
        <div className="ict-algorithms-header">
          <h2 className="ict-algorithms-title">
            <Calculator size={20} />
            <span>Graph Algorithms</span>
          </h2>
          <p className="ict-algorithms-description">
            Apply graph algorithms to analyze the relationships between ICT terms
          </p>
        </div>

        <div className="ict-algorithms-selection">
          {algorithms.map((algorithm) => (
            <button
              key={algorithm.id}
              className={`ict-algorithm-btn ${selectedAlgorithm === algorithm.id ? "active" : ""}`}
              onClick={() => handleAlgorithmSelect(algorithm.id)}
            >
              <div className="ict-algorithm-icon">{algorithm.icon}</div>
              <div className="ict-algorithm-info">
                <span className="ict-algorithm-name">{algorithm.name}</span>
                <span className="ict-algorithm-desc">{algorithm.description}</span>
              </div>
            </button>
          ))}
        </div>

        {renderAlgorithmForm()}
        {renderAlgorithmResults()}
      </div>
    </div>
  )
}

export default GraphAlgorithms
