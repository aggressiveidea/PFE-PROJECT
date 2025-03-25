"use client"

import { useState, useEffect } from "react"
import { Search, Info } from "lucide-react"

const ClassicSearch = ({ terms, onSearch, onTermSelect, categoryTranslations, getCategoryColor }) => {
  const [query, setQuery] = useState("")
  const [filteredTerms, setFilteredTerms] = useState([])

  useEffect(() => {
    setFilteredTerms(terms)
  }, [terms])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim() === "") {
      setFilteredTerms(terms)
    } else {
      const filtered = terms.filter((term) => term.name.toLowerCase().includes(value.toLowerCase()))
      setFilteredTerms(filtered)
    }

    onSearch(value)
  }

  return (
    <div className="classic-search">
      <div className="search-input-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search for ICT terms..."
          value={query}
          onChange={handleInputChange}
          className="search-input"
        />
      </div>

      <div className="search-results">
        <div className="search-results-header">
          <h3>Results {filteredTerms.length > 0 && `(${filteredTerms.length})`}</h3>
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
                      className="term-category-chip"
                      style={{
                        backgroundColor: getCategoryColor(category.name) + "20",
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
                    <span>{term.categories[0].principal_definition.reference.substring(0, 40)}...</span>
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

