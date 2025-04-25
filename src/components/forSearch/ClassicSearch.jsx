"use client"

import { useState } from "react"
import "./ClassicSearch.css"

const ClassicSearch = ({ terms = [], language = "english" }) => {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [sortOrder, setSortOrder] = useState("alphabetical")
  const [viewMode, setViewMode] = useState("grid")

  // Get language-specific labels
  const getLabels = () => {
    switch (language) {
      case "french":
        return {
          title: "Termes informatiques",
          searchPlaceholder: "Rechercher des termes...",
          searchButton: "Rechercher",
          sortBy: "Trier par",
          alphabetical: "Alphabétique",
          category: "Catégorie",
          addToLibrary: "Ajouter à la bibliothèque",
          source: "Source",
          viewAs: "Afficher comme",
          grid: "Grille",
          list: "Liste",
        }
      case "arabic":
        return {
          title: "مصطلحات علوم الحاسوب",
          searchPlaceholder: "البحث عن المصطلحات...",
          searchButton: "بحث",
          sortBy: "ترتيب حسب",
          alphabetical: "أبجدي",
          category: "الفئة",
          addToLibrary: "إضافة إلى المكتبة",
          source: "المصدر",
          viewAs: "عرض كـ",
          grid: "شبكة",
          list: "قائمة",
        }
      default:
        return {
          title: "Computer Science Terms",
          searchPlaceholder: "Search terms...",
          searchButton: "Search",
          sortBy: "Sort by",
          alphabetical: "Alphabetical",
          category: "Category",
          addToLibrary: "Add to Library",
          source: "Source",
          viewAs: "View as",
          grid: "Grid",
          list: "List",
        }
    }
  }

  const labels = getLabels()

  // Sort terms based on current sort order
  const sortedTerms = [...terms].sort((a, b) => {
    if (sortOrder === "alphabetical") {
      return a.name.localeCompare(b.name)
    } else if (sortOrder === "category") {
      const categoryA = a.category || (a.categories && a.categories[0]?.type) || ""
      const categoryB = b.category || (b.categories && b.categories[0]?.type) || ""
      return categoryA.localeCompare(categoryB)
    }
    return 0
  })

  const getCategoryColor = (category) => {
    const colors = {
      "Données personnelles": "#E5DEFF",
      "Commerce électronique": "#FDE1D3",
      Réseaux: "#D3E4FD",
      "Criminalité informatique": "#FFDEE2",
      Divers: "#F1F0FB",
      "Contrat Informatique": "#F2FCE2",
      "Propriété intellectuelle": "#FEF7CD",
      Organisations: "#FEC6A1",
      "Computer Science": "#E5DEFF",
      Networks: "#D3E4FD",
      "Software Development": "#E0F5E9",
      "Data Management": "#FFF6D9",
      Cybersecurity: "#FFE5E5",
    }
    return colors[category] || "#F1F0FB"
  }

  // Get the primary category for a term
  const getPrimaryCategory = (term) => {
    return term.category || (term.categories && term.categories[0]?.type) || ""
  }

  // Get the primary definition for a term
  const getPrimaryDefinition = (term) => {
    if (term.definition) return term.definition
    if (term.categories && term.categories[0]?.principale && term.categories[0].principale[0]?.definition_principale) {
      return term.categories[0].principale[0].definition_principale[0]
    }
    return ""
  }

  // Get the reference for a term
  const getReference = (term) => {
    if (term.reference) return term.reference
    if (term.categories && term.categories[0]?.principale && term.categories[0].principale[0]?.references) {
      return term.categories[0].principale[0].references[0] || ""
    }
    return ""
  }

  // Set text direction based on language
  const getTextDirection = () => {
    return language === "arabic" ? "rtl" : "ltr"
  }

  return (
    <div className="classic-search" style={{ direction: getTextDirection() }}>
      <div className="search-header">
        <h2>{labels.title}</h2>
        <div className="search-controls">
          <div className="search-bar">
            <input type="text" placeholder={labels.searchPlaceholder} />
            <button className="search-button">{labels.searchButton}</button>
          </div>
          <div className="view-options">
            <div className="sort-control">
              <label>{labels.sortBy}:</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="alphabetical">{labels.alphabetical}</option>
                <option value="category">{labels.category}</option>
              </select>
            </div>
            <div className="view-toggle">
              <label>{labels.viewAs}:</label>
              <div className="toggle-buttons">
                <button
                  className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  {labels.grid}
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  {labels.list}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="term-grid">
          {sortedTerms.map((term, index) => (
            <div
              className={`term-card ${hoveredCard === index ? "hovered" : ""}`}
              key={index}
              style={{ backgroundColor: getCategoryColor(getPrimaryCategory(term)) }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-content">
                <h3>{term.name}</h3>
                <p className="category">{getPrimaryCategory(term)}</p>
                <p className="definition">{getPrimaryDefinition(term)}</p>
                {getReference(term) && (
                  <p className="reference">
                    {language === "arabic" ? "المصدر: " : "Source: "}
                    {getReference(term)}
                  </p>
                )}
              </div>
              <button className="add-library-btn">
                <span className="btn-text">{labels.addToLibrary}</span>
                <span className="btn-icon">+</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="term-list">
          {sortedTerms.map((term, index) => (
            <div
              key={index}
              className="term-list-item"
              style={{
                borderLeft: language !== "arabic" ? `4px solid ${getCategoryColor(getPrimaryCategory(term))}` : "none",
                borderRight: language === "arabic" ? `4px solid ${getCategoryColor(getPrimaryCategory(term))}` : "none",
              }}
            >
              <div className="term-list-header">
                <h3>{term.name}</h3>
                <span className="term-list-category">{getPrimaryCategory(term)}</span>
              </div>
              <p className="term-list-definition">{getPrimaryDefinition(term)}</p>
              {getReference(term) && (
                <p className="term-list-reference">
                  {language === "arabic" ? "المصدر: " : "Source: "}
                  {getReference(term)}
                </p>
              )}
              <button className="term-list-button">{labels.addToLibrary}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClassicSearch
