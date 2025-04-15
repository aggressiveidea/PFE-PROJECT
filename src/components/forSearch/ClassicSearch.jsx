"use client"

import { useState, useEffect } from "react"
import { Search, Info, Filter, X, SlidersHorizontal, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { classicSearch, getAllterms } from "../../services/Api"

const ClassicSearch = ({ terms = [], onSearch, onTermSelect, categoryTranslations, getCategoryColor }) => {
  const [query, setQuery] = useState("")
  const [filteredTerms, setFilteredTerms] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [allTerms, setAllTerms] = useState([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [termsPerPage] = useState(8)
  const [totalTerms, setTotalTerms] = useState(0)

  // Fetch all terms on component mount
  useEffect(() => {
    fetchAllTerms()
  }, [])

  // Fetch all terms from the database
  const fetchAllTerms = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getAllterms()

      if (Array.isArray(data)) {
        setAllTerms(data)
        setFilteredTerms(data)
        setTotalTerms(data.length)
      } else {
        console.error("Terms data is not an array:", data)
        setError("Failed to load terms. Invalid data format.")
      }
    } catch (err) {
      console.error("Error fetching all terms:", err)
      setError("Failed to load terms. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get all unique categories
  const allCategories =
    allTerms && allTerms.length > 0
      ? [...new Set(allTerms.flatMap((term) => (term.categories ? term.categories.map((cat) => cat.name) : [])))]
      : []

  // Filter terms based on search query and selected categories
  useEffect(() => {
    if (!Array.isArray(allTerms)) {
      console.error("Terms is not an array:", allTerms)
      setFilteredTerms([])
      setTotalTerms(0)
      return
    }

    let filtered = [...allTerms]

    if (query.trim() !== "") {
      filtered = filtered.filter(
        (term) =>
          term.name.toLowerCase().includes(query.toLowerCase()) ||
          (term.categories &&
            term.categories.some(
              (cat) =>
                cat.principal_definition &&
                cat.principal_definition.text &&
                cat.principal_definition.text.toLowerCase().includes(query.toLowerCase()),
            )),
      )
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (term) => term.categories && term.categories.some((cat) => selectedCategories.includes(cat.name)),
      )
    }

    setFilteredTerms(filtered)
    setTotalTerms(filtered.length)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [query, allTerms, selectedCategories])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      // If empty query, just reset to show all terms
      setFilteredTerms(allTerms)
      setTotalTerms(allTerms.length)
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log(`Searching for: "${query}"`)
      // Call the API function
      const results = await classicSearch(query, 1, termsPerPage)

      console.log("Search results:", results)

      if (Array.isArray(results)) {
        setFilteredTerms(results)
        setTotalTerms(results.length)
      } else {
        console.error("Search results are not an array:", results)
        setFilteredTerms([])
        setTotalTerms(0)
        setError("Invalid response format from server")
      }
      onSearch && onSearch(query) // Notify parent component
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to perform search. Please try again.")
      setFilteredTerms([])
      setTotalTerms(0)
    } finally {
      setLoading(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
  }

  // Pagination logic
  const indexOfLastTerm = currentPage * termsPerPage
  const indexOfFirstTerm = indexOfLastTerm - termsPerPage
  const currentTerms = filteredTerms.slice(indexOfFirstTerm, indexOfLastTerm)
  const totalPages = Math.ceil(totalTerms / termsPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
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
            onKeyPress={handleKeyPress}
            className="ict-search-input"
          />
          <button className="ict-search-button" onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
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
          <h3>Results {totalTerms > 0 && `(${totalTerms})`}</h3>
          {totalTerms > 0 && (
            <div className="ict-view-options">
              <Eye size={16} />
              <span>View</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-indicator">Loading terms...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : totalTerms === 0 ? (
          <div className="no-results">
            <p>No terms found matching your search.</p>
            <p>Try using different keywords or check your spelling.</p>
          </div>
        ) : (
          <>
            <div className="terms-grid">
              {currentTerms.map((term) => (
                <div key={term.id || term.name} className="term-card" onClick={() => onTermSelect(term)}>
                  <h3 className="term-name">{term.name}</h3>
                  <div className="term-categories-preview">
                    {term.categories &&
                      term.categories.map((category, index) => (
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
                    {term.categories && term.categories[0] && term.categories[0].principal_definition ? (
                      <p>{term.categories[0].principal_definition.text.substring(0, 100)}...</p>
                    ) : (
                      <p>No definition available</p>
                    )}
                  </div>
                  {term.categories &&
                    term.categories[0] &&
                    term.categories[0].principal_definition &&
                    term.categories[0].principal_definition.reference && (
                      <div className="term-reference-preview">
                        <Info size={14} />
                        <span>{term.categories[0].principal_definition.reference}</span>
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="ict-pagination">
                <button
                  className="ict-pagination-btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="ict-pagination-info">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  className="ict-pagination-btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ClassicSearch

