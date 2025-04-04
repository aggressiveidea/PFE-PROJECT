"use client"

import { useState } from "react"
import "./PopularTerms.css"

const PopularTerms = () => {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All" },
    { id: "hardware", name: "Hardware" },
    { id: "software", name: "Software" },
    { id: "networking", name: "Networking" },
    { id: "security", name: "Security" },
    { id: "ai", name: "AI" },
  ]

  const terms = [
    {
      id: 1,
      name: "Artificial Intelligence",
      definition: "The simulation of human intelligence processes by machines, especially computer systems.",
      category: "ai",
    },
    {
      id: 2,
      name: "Cloud Computing",
      definition:
        "The delivery of different services through the Internet, including data storage, servers, databases, networking, and software.",
      category: "networking",
    },
    {
      id: 3,
      name: "Machine Learning",
      definition:
        "A subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.",
      category: "ai",
    },
    {
      id: 4,
      name: "Blockchain",
      definition:
        "A distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.",
      category: "security",
    },
    {
      id: 5,
      name: "Internet of Things",
      definition:
        "The network of physical objects embedded with sensors, software, and other technologies for the purpose of connecting and exchanging data with other devices and systems over the Internet.",
      category: "networking",
    },
    {
      id: 6,
      name: "Virtual Reality",
      definition:
        "A simulated experience that can be similar to or completely different from the real world, created using computer technology and special equipment.",
      category: "hardware",
    },
    {
      id: 7,
      name: "Cybersecurity",
      definition:
        "The practice of protecting systems, networks, and programs from digital attacks that aim to access, change, or destroy sensitive information.",
      category: "security",
    },
    {
      id: 8,
      name: "Big Data",
      definition:
        "Extremely large data sets that may be analyzed computationally to reveal patterns, trends, and associations, especially relating to human behavior and interactions.",
      category: "software",
    },
  ]

  const filteredTerms = activeCategory === "all" ? terms : terms.filter((term) => term.category === activeCategory)

  return (
    <section id="popular-terms" className="popular-terms">
      <div className="container">
        <div className="section-header">
          <div className="badge">Trending</div>
          <h2>Popular ICT Terms</h2>
          <p>Explore the most frequently searched ICT terms in our dictionary.</p>
        </div>

        <div className="categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="terms-grid">
          {filteredTerms.map((term) => (
            <div key={term.id} className="term-card">
              <h3>{term.name}</h3>
              <p>{term.definition}</p>
              <div className="card-footer">
                <span className="category-tag">{categories.find((c) => c.id === term.category).name}</span>
                <button className="view-details">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularTerms

