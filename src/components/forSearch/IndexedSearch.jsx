"use client"
import { Info } from "lucide-react"

const IndexedSearch = ({
  terms,
  selectedLetter,
  onLetterSelect,
  onTermSelect,
  categoryTranslations,
  getCategoryColor,
}) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  // Count terms for each letter
  const letterCounts = alphabet.reduce((acc, letter) => {
    acc[letter] = terms.filter((term) => term.name.toUpperCase().startsWith(letter)).length
    return acc
  }, {})

  // Filter terms by selected letter
  const filteredTerms = selectedLetter ? terms.filter((term) => term.name.toUpperCase().startsWith(selectedLetter)) : []

  return (
    <div className="indexed-search">
      <div className="alphabet-ribbon">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={`letter-button ${selectedLetter === letter ? "active" : ""} ${letterCounts[letter] === 0 ? "disabled" : ""}`}
            onClick={() => letterCounts[letter] > 0 && onLetterSelect(letter)}
            disabled={letterCounts[letter] === 0}
          >
            <span className="letter">{letter}</span>
            <span className="letter-count">{letterCounts[letter]}</span>
          </button>
        ))}
      </div>

      <div className="indexed-results">
        {!selectedLetter ? (
          <div className="select-letter-prompt">
            <p>Please select a letter from the alphabet above to view terms.</p>
          </div>
        ) : filteredTerms.length === 0 ? (
          <div className="no-results">
            <p>No terms found starting with '{selectedLetter}'.</p>
          </div>
        ) : (
          <>
            <div className="indexed-results-header">
              <h3>
                Terms starting with '{selectedLetter}' ({filteredTerms.length})
              </h3>
            </div>

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
          </>
        )}
      </div>
    </div>
  )
}

export default IndexedSearch

