"use client"

import { useState } from "react"
import "./GraphAlgorithms.css"

const algorithms = [
  {
    id: 1,
    name: "Dijkstra's Algorithm",
    category: "Pathfinding",
    complexity: "O(|E| + |V|log|V|) with binary heap",
    formula: "d[v] = min(d[v], d[u] + w(u,v))",
    description: "Finds the shortest path between nodes in a graph with non-negative edge weights.",
    details: "Maintains a priority queue of vertices ordered by their tentative distances from the source.",
  },
  {
    id: 2,
    name: "PageRank",
    category: "Centrality",
    complexity: "O(kE) where k is the number of iterations",
    formula: "PR(p) = (1-d) + d ∑(PR(i)/L(i))",
    description: "Measures the importance of nodes in a graph based on the structure of incoming links.",
    details: "Originally developed by Google, it simulates a random surfer who keeps following links.",
  },
  {
    id: 3,
    name: "Betweenness Centrality",
    category: "Centrality",
    complexity: "O(|V|³) for basic implementation",
    formula: "CB(v) = ∑(s≠v≠t) (σst(v) / σst)",
    description: "Measures the extent to which a vertex lies on paths between other vertices.",
    details: "A high betweenness value indicates that a vertex acts as a bridge between different parts of a graph.",
  },
  {
    id: 4,
    name: "Breadth-First Search",
    category: "Traversal",
    complexity: "O(|V| + |E|)",
    formula: "Queue-based traversal",
    description: "Explores all vertices at the present depth before moving to vertices at the next depth level.",
    details: "Uses a queue data structure to keep track of vertices to be explored.",
  },
]

const GraphAlgorithms = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null)
  const [runOption, setRunOption] = useState("selected")

  const handleSelectAlgorithm = (algo) => {
    setSelectedAlgorithm(algo === selectedAlgorithm ? null : algo)
  }

  const handleRunAlgorithm = () => {
    if (!selectedAlgorithm) return

    // Just a placeholder alert for demonstration purposes
    alert(`Running ${selectedAlgorithm.name} on ${runOption === "selected" ? "selected term" : "entire graph"}`)
  }

  return (
    <div className="graph-algorithms">
      <div className="algorithms-container">
        <div className="algorithms-sidebar">
          <h3 className="algorithms-title">Graph Algorithms</h3>
          <div className="algorithms-list">
            {algorithms.map((algo) => (
              <div
                key={algo.id}
                className={`algorithm-item ${selectedAlgorithm === algo ? "selected" : ""}`}
                onClick={() => handleSelectAlgorithm(algo)}
              >
                <div className="algorithm-item-name">{algo.name}</div>
                <span className="algorithm-item-category">{algo.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="algorithm-details-panel">
          {selectedAlgorithm ? (
            <>
              <div className="algorithm-header">
                <h3>{selectedAlgorithm.name}</h3>
                <span className="complexity">{selectedAlgorithm.complexity}</span>
              </div>

              <div className="algorithm-body">
                <div className="formula-container">
                  <div className="label">Formula:</div>
                  <div className="formula">{selectedAlgorithm.formula}</div>
                </div>

                <div className="description-container">
                  <div className="label">Description:</div>
                  <p>{selectedAlgorithm.description}</p>
                  <p className="details">{selectedAlgorithm.details}</p>
                </div>

                <div className="run-options">
                  <div className="label">Run on:</div>
                  <div className="options">
                    <label>
                      <input
                        type="radio"
                        name="runOption"
                        value="selected"
                        checked={runOption === "selected"}
                        onChange={() => setRunOption("selected")}
                      />
                      <span>Selected Term</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="runOption"
                        value="all"
                        checked={runOption === "all"}
                        onChange={() => setRunOption("all")}
                      />
                      <span>Entire Graph</span>
                    </label>
                  </div>
                </div>

                <button className="run-button" onClick={handleRunAlgorithm}>
                  Run Algorithm
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="icon-person-question"></div>
              <p>Pick an algorithm to run.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GraphAlgorithms
