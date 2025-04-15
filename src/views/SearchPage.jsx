"use client"

import { useState, useEffect } from "react"
import { Search, Info, Network, Share2, GitBranch, Calculator } from "lucide-react"
import Sidebar from "../components/forDashboard/Sidebar"
import Header from "../components/forHome/Header"
import Footer from "../components/forHome/Footer"
import IndexedSearch from "../components/forSearch/IndexedSearch"
import GraphSearch from "../components/forSearch/GraphSearch"
import ClassicSearch from "../components/forSearch/ClassicSearch"
import GraphAlgorithms from "../components/forSearch/GraphAlgorithms"
import { classicSearch, indexedSearch, graphSearch, runGraphAlgorithm, getAllterms } from "../services/Api"
import "./SearchPage.css"

// Mock data for initial render
const initialTermsData = []

const initialGraphData = {
  nodes: [],
  edges: [],
}

const categoryTranslations = {
  "Données personnelles": "Personal Data",
  "Commerce électronique": "E-commerce",
  Réseaux: "Networks",
  "Criminalité informatique": "Cybercrime",
}

const getCategoryColor = (categoryName) => {
  const categoryColors = {
    "Données personnelles": "#4285F4",
    "Commerce électronique": "#EA4335",
    Réseaux: "#FBBC05",
    "Criminalité informatique": "#34A853",
    "Com.élec.": "#4285F4",
    "Con.info.": "#EA4335",
    "Crim.info.": "#FBBC05",
    "Don.pers.": "#34A853",
    Org: "#FF6D01",
    "Pro.int.": "#46BDC6",
    Rés: "#7B61FF",
  }
  return categoryColors[categoryName] || "#666"
}

export default function SearchPage() {
  const [selectedSearchType, setSelectedSearchType] = useState("classic")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [graphData, setGraphData] = useState(initialGraphData)
  const [algorithmResults, setAlgorithmResults] = useState(null)
  const [language, setLanguage] = useState("en")
  const [terms, setTerms] = useState(initialTermsData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load initial data
  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode")
    if (storedTheme !== null) {
      setDarkMode(storedTheme === "true")
    }

    // Fetch initial terms for the main page
    fetchInitialTerms()
  }, [])

  // Fetch initial terms
  const fetchInitialTerms = async () => {
    setIsLoading(true)
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

        setTerms(processedTerms)
      } else {
        console.error("Terms data is not an array:", data)
        setError("Failed to load terms. Invalid data format.")
      }
    } catch (error) {
      console.error("Error fetching initial terms:", error)
      setError("Failed to load initial terms. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString())
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const handleSearchTypeChange = (type) => {
    setSelectedSearchType(type)
  }

  const handleSearch = async (term) => {
    setSearchTerm(term)
    try {
      if (term.trim() !== "") {
        setIsLoading(true)
        const results = await classicSearch(term, 1, 8)
        if (Array.isArray(results)) {
          // Process results to deduplicate categories for display in cards only
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

          setTerms(processedResults)
        } else {
          console.error("Search results are not an array:", results)
          setError("Invalid search results format")
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Search error:", error)
      setError("Failed to perform search. Please try again.")
      setIsLoading(false)
    }
  }

  const handleLetterSelect = async (letter) => {
    setSelectedLetter(letter)
    try {
      setIsLoading(true)
      const results = await indexedSearch(letter, 1, 8)
      if (Array.isArray(results)) {
        // Process results to deduplicate categories for display in cards only
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

        setTerms(processedResults)
      } else {
        console.error("Indexed search results are not an array:", results)
        setError("Invalid indexed search results format")
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Indexed search error:", error)
      setError(`Failed to load terms for letter ${letter}. Please try again.`)
      setIsLoading(false)
    }
  }

  const handleTermSelect = async (term) => {
    // Use the original categories (allCategories) for the details view if available
    if (term.allCategories) {
      term.categories = term.allCategories
    }

    setSelectedTerm(term)
    try {
      // If we're in graph search mode, fetch the graph data
      if (selectedSearchType === "graphic") {
        setIsLoading(true)
        const results = await graphSearch(term.name, 2)
        setGraphData(results)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Term selection error:", error)
      setError("Failed to load graph data. Please try again.")
      setIsLoading(false)
    }
  }

  const handleApplyAlgorithm = async (algorithmId, params = {}) => {
    if (!algorithmId) {
      // Just clearing results
      setAlgorithmResults(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const results = await runGraphAlgorithm(algorithmId, params)
      setAlgorithmResults(results)

      // Update graph visualization based on algorithm results
      let updatedNodes = [...graphData.nodes]
      let updatedEdges = [...graphData.edges]

      switch (algorithmId) {
        case "dijkstra":
          updatedNodes = updatedNodes.map((node) => {
            if (results.path && results.path.includes(node.label)) {
              return { ...node, color: "#FF6B6B", borderWidth: 3 }
            }
            return { ...node, color: node.color, borderWidth: 1 }
          })

          updatedEdges = updatedEdges.map((edge) => {
            const fromNode = updatedNodes.find((n) => n.id === edge.from)
            const toNode = updatedNodes.find((n) => n.id === edge.to)

            if (
              fromNode &&
              toNode &&
              results.path &&
              results.path.includes(fromNode.label) &&
              results.path.includes(toNode.label) &&
              results.path.indexOf(fromNode.label) === results.path.indexOf(toNode.label) - 1
            ) {
              return { ...edge, color: "#FF6B6B", width: 3 }
            }
            return { ...edge, color: undefined, width: 1 }
          })
          break

        case "pagerank":
        case "betweenness-centrality":
        case "closeness-centrality":
          // Adjust node sizes based on importance scores
          if (results.topNodes) {
            updatedNodes = updatedNodes.map((node) => {
              const rankNode = results.topNodes.find((n) => n.name === node.label)
              if (rankNode) {
                return {
                  ...node,
                  size: 20 + rankNode.score * 30,
                  color: rankNode.score > 0.7 ? "#FF6B6B" : rankNode.score > 0.5 ? "#FFA500" : node.color,
                }
              }
              return { ...node, size: 15 }
            })
          }
          break

        case "connected-components":
          const componentColors = ["#FF6B6B", "#46BDC6", "#FFA500", "#7B61FF", "#34A853"]

          if (results.components) {
            updatedNodes = updatedNodes.map((node) => {
              for (let i = 0; i < results.components.length; i++) {
                if (results.components[i].nodes.includes(node.label)) {
                  return {
                    ...node,
                    color: componentColors[i % componentColors.length],
                    borderWidth: 2,
                  }
                }
              }
              return node
            })
          }
          break
      }

      setGraphData({ nodes: updatedNodes, edges: updatedEdges })
      setIsLoading(false)
    } catch (error) {
      console.error("Algorithm error:", error)
      setError("Failed to execute algorithm. Please try again.")
      setIsLoading(false)
    }
  }

  const renderSearchComponent = () => {
    switch (selectedSearchType) {
      case "indexed":
        return (
          <IndexedSearch
            terms={terms}
            selectedLetter={selectedLetter}
            onLetterSelect={handleLetterSelect}
            onTermSelect={handleTermSelect}
            categoryTranslations={categoryTranslations}
            getCategoryColor={getCategoryColor}
          />
        )
      case "graphic":
        return (
          <GraphSearch
            graphData={graphData}
            onTermSelect={handleTermSelect}
            categoryTranslations={categoryTranslations}
            darkMode={darkMode}
            getCategoryColor={getCategoryColor}
          />
        )
      case "algorithms":
        return (
          <div className="search-page-algorithms-container">
            <GraphAlgorithms
              graphData={graphData}
              onApplyAlgorithm={handleApplyAlgorithm}
              darkMode={darkMode}
              algorithmResults={algorithmResults}
            />
          </div>
        )
      case "classic":
      default:
        return (
          <ClassicSearch
            terms={terms}
            onSearch={handleSearch}
            onTermSelect={handleTermSelect}
            categoryTranslations={categoryTranslations}
            getCategoryColor={getCategoryColor}
          />
        )
    }
  }

  return (
    <div className={`search-page-container ${darkMode ? "dark" : ""}`}>
      <Header language={language} setLanguage={setLanguage} darkMode={darkMode} />

      <div className="search-page-layout">
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          mobileOpen={mobileMenuOpen}
          closeMobileMenu={closeMobileMenu}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="search-page-main">
          <header className="search-page-header">
            <div className="search-page-header-left">
              <h1 className="search-page-title">ICT Terms Dictionary</h1>
              <p className="search-page-subtitle">
                Explore and discover information & communication technology terminology
              </p>
            </div>

            <div className="search-page-header-right">{/* Header right content can be added here if needed */}</div>
          </header>

          <div className="search-page-type-selector">
            <button
              className={`search-page-type-btn ${selectedSearchType === "classic" ? "active" : ""}`}
              onClick={() => handleSearchTypeChange("classic")}
            >
              <Search size={18} />
              <span>Classic Search</span>
            </button>
            <button
              className={`search-page-type-btn ${selectedSearchType === "indexed" ? "active" : ""}`}
              onClick={() => handleSearchTypeChange("indexed")}
            >
              <GitBranch size={18} />
              <span>Indexed Search</span>
            </button>
            <button
              className={`search-page-type-btn ${selectedSearchType === "graphic" ? "active" : ""}`}
              onClick={() => handleSearchTypeChange("graphic")}
            >
              <Network size={18} />
              <span>Graph Search</span>
            </button>
            <button
              className={`search-page-type-btn ${selectedSearchType === "algorithms" ? "active" : ""}`}
              onClick={() => handleSearchTypeChange("algorithms")}
            >
              <Calculator size={18} />
              <span>Graph Algorithms</span>
            </button>
          </div>

          <main className="search-page-content">
            {isLoading && <div className="global-loading-indicator">Loading data...</div>}
            {error && <div className="global-error-message">{error}</div>}

            <div className="search-page-search-container">{renderSearchComponent()}</div>

            {selectedTerm && (
              <div className="search-page-term-details">
                <div className="search-page-term-details-header">
                  <h2>{selectedTerm.name}</h2>
                  <button
                    className="search-page-close-btn"
                    onClick={() => setSelectedTerm(null)}
                    aria-label="Close details"
                  >
                    ×
                  </button>
                </div>
                <div className="search-page-term-details-content">
                  {selectedTerm.categories &&
                    selectedTerm.categories.map((category, index) => (
                      <div key={index} className="search-page-term-category">
                        <div
                          className="search-page-term-category-header"
                          style={{
                            backgroundColor: getCategoryColor(category.name) + "20",
                            color: getCategoryColor(category.name),
                          }}
                        >
                          {categoryTranslations[category.name] || category.name}
                        </div>
                        <div className="search-page-term-definition">
                          <p>{category.principal_definition.text}</p>
                          {category.principal_definition.reference && (
                            <div className="search-page-term-reference">
                              <Info size={14} />
                              <span>{category.principal_definition.reference}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  {selectedTerm.relations && selectedTerm.relations.length > 0 && (
                    <div className="search-page-term-relations">
                      <h3>Related Terms</h3>
                      <div className="search-page-relation-tags">
                        {selectedTerm.relations.map((relation, index) => (
                          <span key={index} className="search-page-relation-tag">
                            <Share2 size={14} />
                            {relation}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <footer className="search-page-footer-wrapper">
        <Footer darkMode={darkMode} setDarkMode={setDarkMode} language={language} />
      </footer>
    </div>
  )
}





