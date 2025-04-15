"use client"

import { useState, useEffect } from "react"
import { Search, Info, Filter, X, SlidersHorizontal, Eye } from "lucide-react"

const ClassicSearch = ({ terms, onSearch, onTermSelect, categoryTranslations, getCategoryColor }) => {
  const [query, setQuery] = useState("")
  const [filteredTerms, setFilteredTerms] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Get all unique categories
  const allCategories = [...new Set(terms.flatMap((term) => term.categories.map((cat) => cat.name)))]

  useEffect(() => {
    let filtered = terms

    // Filter by search query
    if (query.trim() !== "") {
      filtered = filtered.filter(
        (term) =>
          term.name.toLowerCase().includes(query.toLowerCase()) ||
          term.categories.some((cat) => cat.principal_definition.text.toLowerCase().includes(query.toLowerCase())),
      )
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((term) => term.categories.some((cat) => selectedCategories.includes(cat.name)))
    }

    setFilteredTerms(filtered)
  }, [query, terms, selectedCategories])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
  }

  return (
    <div className="classic-search">
      <div className="search-header">
        <div className="ict-search-input-wrapper">
          <div className="ict-search-icon-container">
            <Search size={20} className="ict-search-icon" />
          </div>
          <input
            type="text"
            placeholder="Search for ICT terms..."
            value={query}
            onChange={handleInputChange}
            className="ict-search-input"
          />
          <button
            className={`ict-filter-toggle-btn ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <Filter size={18} />
          </button>
        </div>

        {showFilters && (
          <div className="ict-category-filter-container">
            <div className="ict-filter-header">
              <div className="ict-filter-title">
                <SlidersHorizontal size={16} />
                <span>Filter Categories</span>
              </div>
              {selectedCategories.length > 0 && (
                <button className="ict-clear-filters-btn" onClick={clearFilters}>
                  <X size={14} />
                  <span>Clear</span>
                </button>
              )}
            </div>
            <div className="ict-category-chips">
              {allCategories.map((category) => (
                <button
                  key={category}
                  className={`ict-category-chip ${selectedCategories.includes(category) ? "active" : ""}`}
                  onClick={() => toggleCategory(category)}
                  style={{
                    backgroundColor: selectedCategories.includes(category)
                      ? getCategoryColor(category) + "15"
                      : "transparent",
                    borderColor: getCategoryColor(category),
                    color: getCategoryColor(category),
                  }}
                >
                  <span
                    className="ict-category-indicator"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  ></span>
                  <span className="ict-category-name">{categoryTranslations[category] || category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="search-results">
        <div className="search-results-header">
          <h3>Results {filteredTerms.length > 0 && `(${filteredTerms.length})`}</h3>
          {filteredTerms.length > 0 && (
            <div className="ict-view-options">
              <Eye size={16} />
              <span>View</span>
            </div>
          )}
        </div>

        {filteredTerms.length === 0 ? (
          <div className="no-results">
            <p>No terms found matching your search.</p>
            <p>Try using different keywords or check your spelling.</p>
          </div>
        ) : (
          <div className="terms-grid">
            {filteredTerms.map((term) => (
              <div key={term.id} className="term-card" onClick={() => onTermSelect(term)}>
                <h3 className="term-name">{term.name}</h3>
                <div className="term-categories-preview">
                  {term.categories.map((category, index) => (
                    <div
                      key={index}
                      className="term-category-tag"
                      style={{
                        backgroundColor: getCategoryColor(category.name) + "15",
                        color: getCategoryColor(category.name),
                      }}
                    >
                      {categoryTranslations[category.name] || category.name}
                    </div>
                  ))}
                </div>
                <div className="term-preview">
                  <p>{term.categories[0].principal_definition.text.substring(0, 100)}...</p>
                </div>
                {term.categories[0].principal_definition.reference && (
                  <div className="term-reference-preview">
                    <Info size={14} />
                    <span>{term.categories[0].principal_definition.reference}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassicSearch


