import React, { useState } from "react";
import "./CategoriesExplorer.css";

// ICT Categories with timeline data
const categories = [
  {
    id: 1,
    name: "AI & Machine Learning",
    date: "2020",
    description: "Explore artificial intelligence concepts and applications",
  },
  {
    id: 2,
    name: "Cybersecurity",
    date: "2021",
    description: "Protect digital assets and infrastructure",
  },
  {
    id: 3,
    name: "Cloud Computing",
    date: "2022",
    description: "Leverage distributed computing resources",
  },
  {
    id: 4,
    name: "Networking",
    date: "2023",
    description: "Connect systems and enable communication",
  },
  {
    id: 5,
    name: "Big Data",
    date: "2024",
    description: "Process and analyze large datasets",
  },
  {
    id: 6,
    name: "IoT",
    date: "2025",
    description: "Connect physical devices to the internet",
  },
  {
    id: 7,
    name: "Blockchain",
    date: "2026",
    description: "Implement distributed ledger technologies",
  },
];

// Search Input Component
function SearchInput({ value, onChange }) {
  return (
    <div className="search-container">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search for any ICT term..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

// Button Component
function Button({ children, onClick }) {
  return (
    <button className="explore-button" onClick={onClick}>
      {children}
    </button>
  );
}

// Timeline Node Component
function TimelineNode({
  category,
  index,
  totalNodes,
  isActive,
  onMouseEnter,
  onMouseLeave,
}) {
  const position = `${(index / (totalNodes - 1)) * 100}%`;
  const isTop = index % 2 === 0;

  return (
    <div
      className="timeline-node"
      style={{ left: position }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Timeline marker */}
      <div className="node-marker">
        {isActive && <div className="node-pulse"></div>}
      </div>

      {/* Content card */}
      <div className={`node-card ${isTop ? "card-top" : "card-bottom"}`}>
        <h3 className="card-title">{category.name}</h3>
        <p className="card-date">{category.date}</p>
        {isActive && <p className="card-description">{category.description}</p>}

        {/* Connector line */}
        <div
          className={`connector-line ${isTop ? "line-top" : "line-bottom"}`}
        ></div>
      </div>
    </div>
  );
}

// Main Timeline Component
function Timeline({ categories }) {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="timeline-container">
      {/* Main timeline line */}
      <div className="timeline-line"></div>

      {/* Timeline nodes */}
      {categories.map((category, index) => (
        <TimelineNode
          key={category.id}
          category={category}
          index={index}
          totalNodes={categories.length}
          isActive={activeCategory === category.id}
          onMouseEnter={() => setActiveCategory(category.id)}
          onMouseLeave={() => setActiveCategory(null)}
        />
      ))}
    </div>
  );
}

// Main Component
function CategoriesExplorer() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section className="explorer-section">
      <div className="section-header">
        <h2 className="section-title">Explore ICT Categories</h2>
        <p className="section-subtitle">
          Discover interconnected ICT terms and concepts
        </p>
      </div>

      <div className="explorer-container">
        <div className="search-area">
          <SearchInput value={searchQuery} onChange={handleSearchChange} />
        </div>

        {/* Timeline Component */}
        <Timeline categories={categories} />

        <div className="action-area">
          <Button>
            Explore All Categories
            <span className="button-icon">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CategoriesExplorer;
