import { useState } from "react"
import "./ResearchSection.css"

const researchTypes = [
  { id: "indexed", label: "Indexed Research" },
  { id: "advanced", label: "Advanced Research" },
  { id: "graph", label: "Graph Research" },
]

const mockResearch = [
  {
    id: 1,
    title: "AI in Cybersecurity",
    description: "Exploring the implementation of AI in modern cybersecurity systems.",
    likes: 245,
  },
  {
    id: 2,
    title: "Quantum Computing Applications",
    description: "Analysis of practical quantum computing use cases in industry.",
    likes: 189,
  },
]

export default function ResearchSection() {
  const [selectedType, setSelectedType] = useState("indexed")
  const [activeLetter, setActiveLetter] = useState("all")

  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

  const renderResearchContent = () => {
    switch (selectedType) {
      case "indexed":
        return (
          <>
            <div className="alphabet-nav">
              <button
                className={`letter-btn ${activeLetter === "all" ? "active" : ""}`}
                onClick={() => setActiveLetter("all")}
              >
                All
              </button>
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  className={`letter-btn ${activeLetter === letter ? "active" : ""}`}
                  onClick={() => setActiveLetter(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
            <div className="research-grid">
              {mockResearch.map((paper) => (
                <div className="research-card" key={paper.id}>
                  <h3>{paper.title}</h3>
                  <p>{paper.description}</p>
                  <div className="card-actions">
                    <button className="like-btn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span>{paper.likes}</span>
                    </button>
                    <button className="share-btn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      case "advanced":
        return (
          <div className="advanced-research">
            <div className="filters">
              <p className="placeholder-text">Advanced research filters and visualization coming soon...</p>
            </div>
          </div>
        )
      case "graph":
        return (
          <div className="graph-research">
            <div className="graph-placeholder">
              <p className="placeholder-text">Graph visualization coming soon...</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section className="research-section">
      <div className="research-header">
        <h2>Research Explorer</h2>
        <div className="research-types">
          {researchTypes.map((type) => (
            <button
              key={type.id}
              className={`type-btn ${selectedType === type.id ? "active" : ""}`}
              onClick={() => setSelectedType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      <div className="research-content">{renderResearchContent()}</div>
    </section>
  )
}

