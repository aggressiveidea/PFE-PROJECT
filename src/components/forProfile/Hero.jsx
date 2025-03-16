"use client"
import { useState } from "react"
import "./Hero.css"

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")

  const stats = [
    { value: "3", label: "Languages" },
    { value: "150+", label: "ICT Terms" },
    { value: "8", label: "Categories" },
  ]

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Explore ICT Terms in
          <span className="gradient-text"> Three Languages</span>
        </h1>
        <p>
          Discover and visualize relationships between ICT terms in English, French, and Arabic with our interactive
          knowledge graph.
        </p>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search ICT terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <div className="stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-image">
        <div className="graph-preview">
          {/* This would be replaced with your actual graph visualization */}
          <div className="graph-placeholder"></div>
        </div>
      </div>
    </section>
  )
}

