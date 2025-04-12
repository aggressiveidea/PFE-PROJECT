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
import "./SearchPage.css"

// Sample data based on the provided JSON structure
const termsData = [
  {
    id: "1",
    name: "Abonné",
    categories: [
      {
        name: "Données personnelles",
        principal_definition: {
          text: "Toute personne physique ou morale qui a conclu un contrat avec le prestataire de services de télécommunications accessibles au public en vue de la fourniture de tels services",
          reference: "Directive 97/66/CE",
        },
      },
      {
        name: "Commerce électronique",
        principal_definition: {
          text: "Veut dire une personne qui est le sujet nommé ou identifié dans un certificat qui lui a été délivré et qui tient une clé privée qui correspond à une clé publique énumérée dans ce certificat",
          reference: "Loi sur les transactions électroniques 1998 Singapour",
        },
      },
    ],
  },
  {
    id: "2",
    name: "Abréviation",
    categories: [
      {
        name: "Commerce électronique",
        principal_definition: {
          text: "Version raccourcie d'un message. Les fonctions de hachage permettent de générer des abréviations qui peuvent servir à vérifier leur intégrité ou, cryptées, peuvent servir de signature électronique",
          reference: null,
        },
      },
    ],
    relations: ["message digest", "condensat checksum"],
  },
  {
    id: "3",
    name: "Accès",
    categories: [
      {
        name: "Réseaux",
        principal_definition: {
          text: "Possibilité d'utiliser les ressources d'un système informatique, d'y introduire des données ou d'en extraire des données",
          reference: "ISO/IEC 2382-1:1993",
        },
      },
    ],
  },
  {
    id: "4",
    name: "Adresse IP",
    categories: [
      {
        name: "Réseaux",
        principal_definition: {
          text: "Numéro qui identifie chaque expéditeur ou récepteur de paquets d'information qui circulent sur Internet",
          reference: "RFC 791",
        },
      },
    ],
  },
  {
    id: "5",
    name: "Algorithme",
    categories: [
      {
        name: "Données personnelles",
        principal_definition: {
          text: "Ensemble de règles opératoires dont l'application permet de résoudre un problème énoncé au moyen d'un nombre fini d'opérations",
          reference: "ISO 2382-1:1993",
        },
      },
    ],
  },
]

const sampleGraphData = {
  nodes: [
    { id: "1", label: "Abonné", color: "#4285F4" },
    { id: "2", label: "Abréviation", color: "#EA4335" },
    { id: "3", label: "Accès", color: "#FBBC05" },
    { id: "4", label: "Adresse IP", color: "#FBBC05" },
    { id: "5", label: "Algorithme", color: "#4285F4" },
    { id: "6", label: "Message digest", color: "#EA4335" },
    { id: "7", label: "Condensat checksum", color: "#EA4335" },
  ],
  edges: [
    { from: "1", to: "3", label: "utilise" },
    { from: "2", to: "6", label: "est un" },
    { from: "2", to: "7", label: "est un" },
    { from: "3", to: "4", label: "requiert" },
    { from: "5", to: "2", label: "génère" },
  ],
}

const categoryTranslations = {
  "Données personnelles": "Personal Data",
  "Commerce électronique": "E-commerce",
  Réseaux: "Networks",
}

const getCategoryColor = (categoryName) => {
  const categoryColors = {
    "Données personnelles": "#4285F4",
    "Commerce électronique": "#EA4335",
    Réseaux: "#FBBC05",
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
  const [graphData, setGraphData] = useState(sampleGraphData)
  const [algorithmResults, setAlgorithmResults] = useState(null)
  const [language, setLanguage] = useState("en")

  // Load dark mode from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode")
    if (storedTheme !== null) {
      setDarkMode(storedTheme === "true")
    }
  }, [])

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

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter)
  }

  const handleTermSelect = (term) => {
    setSelectedTerm(term)
  }

  const handleApplyAlgorithm = (algorithmId, results) => {
    setAlgorithmResults(results)

    // Update graph visualization based on algorithm results
    let updatedNodes = [...graphData.nodes]
    let updatedEdges = [...graphData.edges]

    switch (algorithmId) {
      case "dijkstra":

        updatedNodes = updatedNodes.map((node) => {
          if (results.path.includes(node.label)) {
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
        break

      case "connected-components":
        const componentColors = ["#FF6B6B", "#46BDC6", "#FFA500", "#7B61FF", "#34A853"]

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
        break
    }

    setGraphData({ nodes: updatedNodes, edges: updatedEdges })
  }

  const renderSearchComponent = () => {
    switch (selectedSearchType) {
      case "indexed":
        return (
          <IndexedSearch
            terms={termsData}
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
            terms={termsData}
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
                  {selectedTerm.categories.map((category, index) => (
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
