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

  // Simulating data fetch
  useEffect(() => {
    // This would be replaced with actual API call
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/terms');
        // const data = await response.json();

        // Mock data for demonstration
        const mockData = {
          terms: [
            {
              name: "Abonné",
              id: 1,
              pages: [
                { lang: "AR", num: 652, pos: 1332 },
                { lang: "AN", num: 729, pos: 319 },
              ],
              categories: [
                {
                  name: "Don.pers.",
                  principal_definition: {
                    text: "Toute personne physique ou morale qui a conclu un contrat avec le prestataire de services de télécommunications accessibles au public en vue de la fourniture de tels services.",
                    reference:
                      "Directive 97/66/CE du Parlement Européen et du Conseil du 15 décembre 1997 concernant le traitement des données à caractère personnel et la protection de la vie privée dans le secteur des télécommunications.",
                  },
                },
                {
                  name: "Com.élec.",
                  principal_definition: {
                    text: "Veut dire une personne qui est le sujet nommé ou identifié dans un certificat qui lui a été délivré et qui tient une clé privée qui correspond à une clé publique énumérée dans ce certificat.",
                    reference: "Loi sur les transactions électroniques, 1998 / Singapour.",
                  },
                },
                {
                  name: "Rés.",
                  principal_definition: {
                    text: "Personne payant une redevance fixe en échange du droit d'accès à une ligne téléphonique normale ou spécialisée, à un réseau ou à un service. L'abonnement est indépendant de la facturation correspondant à l'utilisation.",
                    reference: null,
                  },
                },
              ],
            },
            {
              name: "IP Address",
              id: 2,
              pages: [{ lang: "AN", num: 245, pos: 567 }],
              categories: [
                {
                  name: "Rés.",
                  principal_definition: {
                    text: "A unique string of numbers separated by periods that identifies each computer using the Internet Protocol to communicate over a network.",
                    reference: "IETF RFC 791",
                  },
                },
              ],
            },
            {
              name: "Package",
              id: 3,
              pages: [{ lang: "AN", num: 312, pos: 789 }],
              categories: [
                {
                  name: "Con.info.",
                  principal_definition: {
                    text: "A collection of related software components that can be deployed together.",
                    reference: "ISO/IEC 19770-2:2015",
                  },
                },
              ],
            },
            {
              name: "Malware",
              id: 4,
              pages: [{ lang: "AN", num: 156, pos: 432 }],
              categories: [
                {
                  name: "Crim.info.",
                  principal_definition: {
                    text: "Software designed to infiltrate or damage a computer system without the owner's informed consent.",
                    reference: "ISO/IEC 27032:2012",
                  },
                },
              ],
            },
            {
              name: "GDPR",
              id: 5,
              pages: [{ lang: "AN", num: 189, pos: 567 }],
              categories: [
                {
                  name: "Don.pers.",
                  principal_definition: {
                    text: "General Data Protection Regulation. A regulation in EU law on data protection and privacy for all individuals within the European Union.",
                    reference: "Regulation (EU) 2016/679",
                  },
                },
              ],
            },
            {
              name: "Copyright",
              id: 6,
              pages: [{ lang: "AN", num: 278, pos: 901 }],
              categories: [
                {
                  name: "Pro.int.",
                  principal_definition: {
                    text: "A legal right that grants the creator of an original work exclusive rights for its use and distribution.",
                    reference: "Berne Convention for the Protection of Literary and Artistic Works",
                  },
                },
              ],
            },
            {
              name: "Blockchain",
              id: 7,
              pages: [{ lang: "AN", num: 345, pos: 678 }],
              categories: [
                {
                  name: "Com.élec.",
                  principal_definition: {
                    text: "A distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.",
                    reference: "ISO/TC 307",
                  },
                },
              ],
            },
            {
              name: "Cloud Computing",
              id: 8,
              pages: [{ lang: "AN", num: 412, pos: 789 }],
              categories: [
                {
                  name: "Con.info.",
                  principal_definition: {
                    text: "A model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources that can be rapidly provisioned and released with minimal management effort.",
                    reference: "NIST Special Publication 800-145",
                  },
                },
              ],
            },
            {
              name: "Phishing",
              id: 9,
              pages: [{ lang: "AN", num: 178, pos: 345 }],
              categories: [
                {
                  name: "Crim.info.",
                  principal_definition: {
                    text: "A type of social engineering attack often used to steal user data, including login credentials and credit card numbers, by disguising as a trustworthy entity in an electronic communication.",
                    reference: "APWG (Anti-Phishing Working Group)",
                  },
                },
              ],
            },
            {
              name: "Firewall",
              id: 10,
              pages: [{ lang: "AN", num: 234, pos: 567 }],
              categories: [
                {
                  name: "Rés.",
                  principal_definition: {
                    text: "A network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules.",
                    reference: "ISO/IEC 27001:2013",
                  },
                },
              ],
            },
          ],
        }

        setTerms(mockData.terms)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching terms:", error)
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

  const handleSearch = (query) => {
    setSearchQuery(query)
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

    // Filter by search query if in classic search mode
    const queryMatch =
      searchType === "classic" && searchQuery ? term.name.toLowerCase().includes(searchQuery.toLowerCase()) : true

    // Filter by letter if in indexed search mode
    const letterMatch =
      searchType === "indexed" && selectedLetter
        ? term.name.toLowerCase().startsWith(selectedLetter.toLowerCase())
        : true

    return categoryMatch && queryMatch && letterMatch
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

