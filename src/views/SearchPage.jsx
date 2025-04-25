"use client"

import { useState, useEffect } from "react"
import Header from "../components/forHome/Header"
import Sidebar from "../components/forDashboard/Sidebar"
import Footer from "../components/forHome/Footer"
import Suggestions from "../components/forSearch/Suggestions"
import ClassicSearch from "../components/forSearch/ClassicSearch"
import IndexedSearch from "../components/forSearch/IndexedSearch"
import "./SearchPage.css"

// Sample data for demonstration
const sampleTerms = [
  {
    name: "Algorithm",
    category: "Computer Science",
    definition: "A step-by-step procedure for solving a problem or accomplishing a task.",
    reference: "Introduction to Algorithms, CLRS",
  },
  {
    name: "Protocol",
    category: "Networks",
    definition: "A set of rules governing data communication between devices.",
    reference: "Computer Networks, Tanenbaum",
  },
  {
    name: "Confidentialité",
    ID: "177",
    AR_id: "404",
    AN_id: "160",
    AR_num: "86",
    AN_num: "216",
    info: "",
    categories: [
      {
        type: "Données personnelles",
        principale: [
          {
            definition_principale: [
              "La confidentialité est définie comme l'obligation d'une personne de préserver le caractère secret des renseignements personnels concernant une autre personne.",
            ],
            references: [],
          },
        ],
        secondaire: [
          {
            definition_secondaire: [
              "Les personnes employées dans l'informatique ne doivent pas collecter, traiter ou utiliser des données à caractère personnel sans autorisation (confidentialité). En entrant en fonctions, ces personnes seront requises de s'engager à (promettre de) maintenir une telle confidentialité, pour autant qu'elles travaillent pour des organismes privés. Cet engagement restera valide même après la fin de leur activité",
            ],
            reference_secondaires: ["Loi De Protection De Données, du 1 janvier 2002/Allemagne"],
          },
        ],
      },
      {
        type: "Commerce électronique",
        principale: [
          {
            definition_principale: [
              "Propriété d'une information qui n'est ni disponible, ni divulguée aux personnes, entités ou processus non autorisés. Assurance que l'accès à une information d'un système d'information (ST) est limité aux seules personnes, applications, programmes, équipements admis à la connaître.",
            ],
            references: [],
          },
        ],
        secondaire: [],
      },
    ],
    relations: [],
  },
  {
    name: "Data Structure",
    category: "Computer Science",
    definition: "A specialized format for organizing and storing data to enable efficient access and modification.",
    reference: "Data Structures & Algorithms, Aho",
  },
  {
    name: "Encryption",
    category: "Networks",
    definition: "The process of converting information into a code to prevent unauthorized access.",
    reference: "Cryptography and Network Security, Stallings",
  },
  {
    name: "API",
    category: "Software Development",
    definition: "Application Programming Interface - A set of rules that allow programs to talk to each other.",
    reference: "Web APIs: The Definitive Guide",
  },
  {
    name: "Database",
    category: "Data Management",
    definition:
      "An organized collection of structured information or data, typically stored electronically in a computer system.",
    reference: "Database Systems: The Complete Book",
  },
  {
    name: "Authentication",
    category: "Cybersecurity",
    definition: "The process of verifying the identity of a user or process.",
    reference: "Security Engineering, Ross Anderson",
  },
  {
    name: "Abstraction",
    category: "Computer Science",
    definition: "The process of removing physical, spatial, or temporal details to focus on essential details.",
    reference: "Concepts of Programming Languages, Sebesta",
  },
]

const SearchPage = () => {
  const [searchType, setSearchType] = useState("classic")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [activeCategories, setActiveCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTerms, setFilteredTerms] = useState(sampleTerms)

  const categories = [
    "Données personnelles",
    "Commerce électronique",
    "Réseaux",
    "Criminalité informatique",
    "Divers",
    "Contrat Informatique",
    "Propriété intellectuelle",
    "Organisations",
    "Computer Science",
    "Networks",
    "Software Development",
    "Data Management",
    "Cybersecurity",
  ]

  // Filter terms based on search input and active categories
  useEffect(() => {
    let results = sampleTerms

    // Filter by search term
    if (searchTerm) {
      results = results.filter((term) => term.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by active categories
    if (activeCategories.length > 0) {
      results = results.filter((term) => {
        // For terms with multiple categories
        if (term.categories && term.categories.length > 0) {
          return term.categories.some((cat) => activeCategories.includes(cat.type))
        }
        // For terms with a single category
        return activeCategories.includes(term.category)
      })
    }

    setFilteredTerms(results)
  }, [searchTerm, activeCategories])

  const handleCategoryToggle = (category) => {
    setActiveCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  return (
    <div className="search-page">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="search-controls-wrapper">
            <div className="search-controls">
              <div className="language-selector">
                <label htmlFor="language-select">Language:</label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="french">French</option>
                  <option value="arabic">Arabic</option>
                </select>
              </div>

              <div className="search-types">
                <button
                  className={`search-type-btn ${searchType === "classic" ? "active" : ""}`}
                  onClick={() => setSearchType("classic")}
                >
                  <span className="icon classic-icon"></span>
                  <span className="label">Classic Search</span>
                </button>
                <button
                  className={`search-type-btn ${searchType === "indexed" ? "active" : ""}`}
                  onClick={() => setSearchType("indexed")}
                >
                  <span className="icon indexed-icon"></span>
                  <span className="label">Indexed Search</span>
                </button>
              </div>
            </div>
          </div>

          <div className="terms-search-input">
            <span className="terms-search-icon"></span>
            <input
              type="text"
              placeholder="Search terms starting with..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="terms-search-field"
            />
            <button className="terms-search-button">Search</button>
          </div>

          <div className="category-section">
            <h3 className="category-title">Filter by Category</h3>
            <div className="category-filter">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-btn ${activeCategories.includes(category) ? "active" : ""}`}
                  onClick={() => handleCategoryToggle(category)}
                  data-category={category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {searchType === "classic" && (
            <div className="search-content">
              <div className="content-header">
                <h2>Computer Science Terms</h2>
                <span className="results-count">{filteredTerms.length} results</span>
              </div>
              <ClassicSearch terms={filteredTerms} language={selectedLanguage} />
            </div>
          )}

          {searchType === "indexed" && (
            <div className="search-content">
              <IndexedSearch language={selectedLanguage} />
            </div>
          )}

          <div className="suggestions-section">
            <h3 className="section-title">Suggested Terms</h3>
            <Suggestions />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SearchPage

