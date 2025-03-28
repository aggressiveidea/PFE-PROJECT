"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Grid3X3, NetworkIcon, X, Info } from "lucide-react"
import Sidebar from "../components/forDashboard/Sidebar"
import "./ICTDictionary.css"
import ClassicSearch from "../components/forSearch/ClassicSearch"
import IndexedSearch from "../components/forSearch/IndexedSearch"
import GraphSearch from "../components/forSearch/GraphSearch"

// Convert French categories to English
const categoryTranslations = {
  "Com.élec.": "E-commerce",
  "Con.info.": "IT Contracts",
  "Crim.info.": "IT Crime",
  "Don.pers.": "Personal Data",
  "Org.": "Organizations",
  "Pro.int.": "Intellectual Property",
  "Rés.": "Networks",
}

const ICTDictionary = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchType, setSearchType] = useState("classic")
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [showTermDetails, setShowTermDetails] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(categoryTranslations).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {}),
  )

  const termDetailsRef = useRef(null)

  // Close term details when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (termDetailsRef.current && !termDetailsRef.current.contains(event.target)) {
        setShowTermDetails(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [termDetailsRef])

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:3001/api/ict-dictionary/terms")

        if (!response.ok) {
          throw new Error("Failed to fetch terms")
        }

        const data = await response.json()
        setTerms(data.terms)
      } catch (error) {
        console.error("Error fetching terms:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const openMobileMenu = () => {
    setMobileOpen(true)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)

    if (query.trim() && searchType === "classic") {
      try {
        setLoading(true)
        const response = await fetch(
          `http://localhost:3001/api/ict-dictionary/search?query=${encodeURIComponent(query)}`,
        )

        if (!response.ok) {
          throw new Error("Failed to search terms")
        }

        const data = await response.json()
        setTerms(data.terms)
      } catch (error) {
        console.error("Error searching terms:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter)
  }

  const handleTermSelect = (term) => {
    setSelectedTerm(term)
    setShowTermDetails(true)
  }

  // Filter terms based on selected categories and search query
  const filteredTerms = terms.filter((term) => {
    // Filter by categories
    const categoryMatch = term.categories.some((category) => selectedCategories[category.name])

    // Filter by letter if in indexed search mode
    const letterMatch =
      searchType === "indexed" && selectedLetter
        ? term.name.toLowerCase().startsWith(selectedLetter.toLowerCase())
        : true

    return categoryMatch && letterMatch
  })

  // Create graph data for sigma.js
  const graphData = {
    nodes: filteredTerms.map((term) => ({
      id: term.id.toString(),
      label: term.name,
      size: 15,
      color: getCategoryColor(term.categories[0]?.name),
    })),
    edges: [],
  }

  // Create edges between terms that share categories
  filteredTerms.forEach((term1, i) => {
    filteredTerms.slice(i + 1).forEach((term2) => {
      const term1Categories = term1.categories.map((c) => c.name)
      const term2Categories = term2.categories.map((c) => c.name)

      // Check if terms share any categories
      const sharedCategories = term1Categories.filter((cat) => term2Categories.includes(cat))

      if (sharedCategories.length > 0) {
        graphData.edges.push({
          id: `e${term1.id}-${term2.id}`,
          source: term1.id.toString(),
          target: term2.id.toString(),
          size: 1,
          color: "#ccc",
        })
      }
    })
  })

  function getCategoryColor(category) {
    const colors = {
      "Com.élec.": "#4285F4", // Blue
      "Con.info.": "#EA4335", // Red
      "Crim.info.": "#FBBC05", // Yellow
      "Don.pers.": "#34A853", // Green
      "Org.": "#FF6D01", // Orange
      "Pro.int.": "#46BDC6", // Teal
      "Rés.": "#7B61FF", // Purple
    }

    return colors[category] || "#1877F2" // Default blue
  }

  if (loading) {
    return (
      <div className="ict-dictionary-page">
        <Sidebar
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
          mobileOpen={mobileOpen}
          closeMobileMenu={closeMobileMenu}
        />
        <div className="ict-dictionary-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading ICT Dictionary...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ict-dictionary-page">
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        closeMobileMenu={closeMobileMenu}
      />

      <div className="ict-dictionary-container">
        <div className="ict-dictionary-header">
          <h1>ICT Terms Dictionary</h1>
          <div className="search-type-tabs">
            <button
              className={`search-type-tab ${searchType === "classic" ? "active" : ""}`}
              onClick={() => setSearchType("classic")}
            >
              <Search size={18} />
              <span>Classic Search</span>
            </button>
            <button
              className={`search-type-tab ${searchType === "indexed" ? "active" : ""}`}
              onClick={() => setSearchType("indexed")}
            >
              <Grid3X3 size={18} />
              <span>Indexed Search</span>
            </button>
            <button
              className={`search-type-tab ${searchType === "graph" ? "active" : ""}`}
              onClick={() => setSearchType("graph")}
            >
              <NetworkIcon size={18} />
              <span>Graph Search</span>
            </button>
          </div>
        </div>

        <div className="ict-dictionary-content">
          <div className="ict-dictionary-filters">
            <div className="filters-header">
              <h3>Categories</h3>
              <button className="toggle-all-btn">Toggle All</button>
            </div>
            <div className="categories-list">
              {Object.entries(categoryTranslations).map(([key, value]) => (
                <label key={key} className="category-item">
                  <input type="checkbox" checked={selectedCategories[key]} onChange={() => handleCategoryChange(key)} />
                  <span className="category-color" style={{ backgroundColor: getCategoryColor(key) }}></span>
                  <span className="category-name">{value}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="ict-dictionary-main">
            {searchType === "classic" && (
              <ClassicSearch
                terms={filteredTerms}
                onSearch={handleSearch}
                onTermSelect={handleTermSelect}
                categoryTranslations={categoryTranslations}
                getCategoryColor={getCategoryColor}
              />
            )}

            {searchType === "indexed" && (
              <IndexedSearch
                terms={filteredTerms}
                selectedLetter={selectedLetter}
                onLetterSelect={handleLetterSelect}
                onTermSelect={handleTermSelect}
                categoryTranslations={categoryTranslations}
                getCategoryColor={getCategoryColor}
              />
            )}

            {searchType === "graph" && (
              <GraphSearch
                graphData={graphData}
                onTermSelect={handleTermSelect}
                categoryTranslations={categoryTranslations}
              />
            )}
          </div>
        </div>

        {showTermDetails && selectedTerm && (
          <div className="term-details-overlay">
            <div className="term-details-container" ref={termDetailsRef}>
              <div className="term-details-header">
                <h2>{selectedTerm.name}</h2>
                <button className="close-details-btn" onClick={() => setShowTermDetails(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="term-details-content">
                {selectedTerm.categories.map((category, index) => (
                  <div key={index} className="term-category-section">
                    <div
                      className="term-category-badge"
                      style={{
                        backgroundColor: getCategoryColor(category.name) + "20",
                        color: getCategoryColor(category.name),
                      }}
                    >
                      {categoryTranslations[category.name] || category.name}
                    </div>

                    <div className="term-definition">
                      <p>{category.principal_definition.text}</p>
                      {category.principal_definition.reference && (
                        <div className="term-reference">
                          <Info size={14} />
                          <span>{category.principal_definition.reference}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="term-details-footer">
                <div className="term-pages">
                  <h4>Pages</h4>
                  <div className="term-pages-list">
                    {selectedTerm.pages.map((page, index) => (
                      <div key={index} className="term-page-item">
                        <span className="term-page-lang">{page.lang}</span>
                        <span className="term-page-num">p. {page.num}</span>
                        <span className="term-page-pos">pos. {page.pos}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ICTDictionary



