"use client"
import { useState, useEffect } from "react"
import { Info, ChevronLeft, ChevronRight } from "lucide-react"
import { indexedSearch, getAllterms } from "../../services/Api"

const IndexedSearch = ({
  terms = [],
  selectedLetter,
  onLetterSelect,
  onTermSelect,
  categoryTranslations,
  getCategoryColor,
}) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [letterTerms, setLetterTerms] = useState([])
  const [allTerms, setAllTerms] = useState([])
  const [letterCounts, setLetterCounts] = useState({})

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [termsPerPage] = useState(8)
  const [totalTerms, setTotalTerms] = useState(0)

  // Fetch all terms on component mount to calculate letter counts
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
        // Process terms to deduplicate categories for display in cards only
        const processedTerms = data.map((term) => {
          // Store the original categories for use in the details view
          term.allCategories = term.categories ? [...term.categories] : []

          // Create deduplicated categories for card display
          if (term.categories && term.categories.length > 0) {
            // Create a map to deduplicate categories by name
            const uniqueCategories = new Map()

            term.categories.forEach((category) => {
              if (!uniqueCategories.has(category.name)) {
                uniqueCategories.set(category.name, category)
              }
            })

            // Convert map values back to array for display in cards
            term.displayCategories = Array.from(uniqueCategories.values())
          } else {
            term.displayCategories = []
          }
          return term
        })

        setAllTerms(processedTerms)

        // Calculate letter counts
        const counts = alphabet.reduce((acc, letter) => {
          acc[letter] = processedTerms.filter((term) => term.name && term.name.toUpperCase().startsWith(letter)).length
          return acc
        }, {})

        setLetterCounts(counts)
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

  // Fetch terms when selected letter changes
  useEffect(() => {
    if (selectedLetter) {
      fetchTermsByLetter(selectedLetter, 1)
    } else {
      setLetterTerms([])
    }
    // Reset to first page when letter changes
    setCurrentPage(1)
  }, [selectedLetter])

  // Fetch terms when page changes
  useEffect(() => {
    if (selectedLetter && currentPage > 1) {
      fetchTermsByLetter(selectedLetter, currentPage)
    }
  }, [currentPage])

  const fetchTermsByLetter = async (letter, page) => {
    if (!letter || letter.length !== 1) {
      console.error("Invalid letter parameter:", letter)
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log(`Fetching terms for letter ${letter}, page ${page}`)

      // Filter from all terms first for immediate feedback
      const filteredTerms = allTerms.filter((term) => term.name && term.name.toUpperCase().startsWith(letter))

      if (filteredTerms.length > 0) {
        const startIndex = (page - 1) * termsPerPage
        const endIndex = startIndex + termsPerPage
        const paginatedTerms = filteredTerms.slice(startIndex, endIndex)

        setLetterTerms(paginatedTerms)
        setTotalTerms(filteredTerms.length)
      } else {
        // If no terms found locally, try API call
        const results = await indexedSearch(letter, page, termsPerPage)

        if (Array.isArray(results)) {
          // Process results to deduplicate categories for display in cards
          const processedResults = results.map((term) => {
            // Store the original categories for use in the details view
            term.allCategories = term.categories ? [...term.categories] : []

            // Create deduplicated categories for card display
            if (term.categories && term.categories.length > 0) {
              // Create a map to deduplicate categories by name
              const uniqueCategories = new Map()

              term.categories.forEach((category) => {
                if (!uniqueCategories.has(category.name)) {
                  uniqueCategories.set(category.name, category)
                }
              })

              // Convert map values back to array for display in cards
              term.displayCategories = Array.from(uniqueCategories.values())
            } else {
              term.displayCategories = []
            }
            return term
          })

          setLetterTerms(processedResults)
          setTotalTerms(letterCounts[letter] || processedResults.length)
        } else {
          console.error("Indexed search results are not an array:", results)
          setLetterTerms([])
          setError("Invalid response format from server")
        }
      }
    } catch (err) {
      console.error(`Error fetching terms for letter ${letter}:`, err)
      setError(`Failed to load terms for letter ${letter}. Please try again.`)
      setLetterTerms([])
    } finally {
      setLoading(false)
    }
  }

  const handleLetterClick = (letter) => {
    if (letterCounts[letter] > 0) {
      onLetterSelect(letter)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(totalTerms / termsPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  return (
    <div className="indexed-search">
      <div className="alphabet-ribbon">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={`letter-button ${selectedLetter === letter ? "active" : ""} ${letterCounts[letter] === 0 ? "disabled" : ""}`}
            onClick={() => handleLetterClick(letter)}
            disabled={letterCounts[letter] === 0}
          >
            <span className="letter">{letter}</span>
            <span className="letter-count">{letterCounts[letter] || 0}</span>
          </button>
        ))}
      </div>

      <div className="indexed-results">
        {!selectedLetter ? (
          <div className="select-letter-prompt">
            <p>Please select a letter from the alphabet above to view terms.</p>
          </div>
        ) : loading ? (
          <div className="loading-indicator">Loading terms...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : letterTerms.length === 0 ? (
          <div className="no-results">
            <p>No terms found starting with '{selectedLetter}'.</p>
          </div>
        ) : (
          <>
            <div className="indexed-results-header">
              <h3>
                Terms starting with '{selectedLetter}' ({totalTerms})
              </h3>
            </div>

            <div className="terms-grid">
              {letterTerms.map((term) => (
                <div key={term.id || term.name} className="term-card" onClick={() => onTermSelect(term)}>
                  <h3 className="term-name">{term.name}</h3>
                  <div className="term-categories-preview">
                    {term.displayCategories &&
                      term.displayCategories.map((category, index) => (
                        <div
                          key={index}
                          className="term-category-tag"
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
                    {term.displayCategories &&
                    term.displayCategories[0] &&
                    term.displayCategories[0].principal_definition ? (
                      <p>{term.displayCategories[0].principal_definition.text.substring(0, 100)}...</p>
                    ) : (
                      <p>No definition available</p>
                    )}
                  </div>
                  {term.displayCategories &&
                    term.displayCategories[0] &&
                    term.displayCategories[0].principal_definition &&
                    term.displayCategories[0].principal_definition.reference && (
                      <div className="term-reference-preview">
                        <Info size={14} />
                        <span>{term.displayCategories[0].principal_definition.reference.substring(0, 40)}...</span>
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

export default IndexedSearch




