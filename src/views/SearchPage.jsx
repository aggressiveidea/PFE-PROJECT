import { useState, useEffect } from "react";
import {
  X,
  Database,
  Code,
  Server,
  Shield,
  Cpu,
  Zap,
  BookOpen,
  Hash,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Globe,
  Grid,
  List,
} from "lucide-react";

// Import components without file extensions
import Header from "../components/forHome/Header";
import Sidebar from "../components/forDashboard/Sidebar";
import Footer from "../components/forHome/Footer";
import ClassicSearch from "../components/forSearch/ClassicSearch";
import IndexedSearch from "../components/forSearch/IndexedSearch";
import { getAllterms } from "../services/Api";
import "./SearchPage.css";



// Mock data for initial render
const initialTermsData = [
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
            references: ["GDPR Article 5", "ISO/IEC 27001"],
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
            references: ["RFC 2196", "NIST SP 800-53"],
          },
        ],
        secondaire: [],
      },
    ],
    relations: ["Data Protection", "Privacy", "Information Security"],
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

function SearchPage() {
  const [searchType, setSearchType] = useState("classic")
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [relatedTerms, setRelatedTerms] = useState([])
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [termsData, setTermsData] = useState(initialTermsData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedSections, setExpandedSections] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [displayedTerms, setDisplayedTerms] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filteredTerms, setFilteredTerms] = useState([])
  const [usingFallbackData, setUsingFallbackData] = useState(false)
  const [suggestedTerms, setSuggestedTerms] = useState([])
  const ITEMS_PER_PAGE = 8

  // Fetch terms data from API
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true)
        setError(null) // Reset any previous errors
        setUsingFallbackData(false)

        const data = await getAllterms(selectedLanguage)

        // Check if we're using fallback data
        if (data && data.length > 0 && data[0].id === "36" && data[0].name === "APPZ") {
          setUsingFallbackData(true)
        }

        if (!data || data.length === 0) {
          throw new Error("No data received from the API")
        }

        // Transform the data to match the expected format
        const transformedData = data.map((term) => {
          // Filter out invalid related terms (where name or id is null)
          const validRelatedTerms =
            term.definitions && term.definitions[0]?.relatedTerms
              ? term.definitions[0].relatedTerms.filter((rt) => rt.name !== null && rt.id !== null && rt.id !== "null")
              : []

          return {
            id: term.id,
            name: term.name,
            // Store all definitions for detailed view
            allDefinitions: term.definitions || [],
            // We'll use this organized structure for displaying in the modal
            organizedDefinitions: {
              primary: {},
              secondary: {},
            },
            // Also keep a simple format for the cards display
            category:
              (term.definitions && term.definitions[0]?.categories && term.definitions[0]?.categories[0]) || "Divers",
            definition: (term.definitions && term.definitions[0]?.text) || "No definition available",
            reference: (term.definitions && term.definitions[0]?.references) || "",
            // Store related terms if available
            relatedTerms: validRelatedTerms,
          }
        })

        setTermsData(transformedData)

        // Initialize displayed terms with first page
        setDisplayedTerms(transformedData.slice(0, ITEMS_PER_PAGE))
        setHasMore(transformedData.length > ITEMS_PER_PAGE)
        setCurrentPage(1)
        setFilteredTerms(transformedData)

        setIsLoading(false)
      } catch (err) {
        console.error("Failed to fetch terms:", err)
        setError(`Failed to load terms data: ${err.message}. Please try again later.`)
        setIsLoading(false)

        // Reset data states on error
        setTermsData([])
        setDisplayedTerms([])
        setFilteredTerms([])
        setHasMore(false)
      }
    }

    fetchTerms()
  }, [selectedLanguage])

  // Load more terms
  const loadMoreTerms = () => {
    const nextPage = currentPage + 1
    const startIndex = currentPage * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newTerms = termsData.slice(startIndex, endIndex)

    setDisplayedTerms((prev) => [...prev, ...newTerms])
    setCurrentPage(nextPage)
    setHasMore(endIndex < termsData.length)
  }

  // Update the handleTermSelect function to work with the new data structure and find related terms
  const handleTermSelect = (term) => {
    setSelectedTerm(term)

    // Reset expanded sections state
    setExpandedSections({})

    // Find related terms based on the relatedTerms array from the API
    let related = []

    // First check if the term has related terms from the API
    if (term.relatedTerms && term.relatedTerms.length > 0) {
      // Find the full term objects for the related terms
      related = term.relatedTerms
        .map((relatedTerm) => {
          // Skip invalid related terms
          if (!relatedTerm.name || !relatedTerm.id || relatedTerm.id === "null") {
            return null
          }

          // Try to find by ID first, then by name
          const fullTerm = termsData.find((t) => t.id === relatedTerm.id || t.name === relatedTerm.name)
          return fullTerm || null
        })
        .filter(Boolean)
        .slice(0, 4)
    }

    // If no related terms from API, find by category
    if (related.length === 0) {
      // Get the term's category or first category from definitions
      const termCategory =
        term.category ||
        (term.allDefinitions && term.allDefinitions.length > 0 && term.allDefinitions[0].categories
          ? term.allDefinitions[0].categories[0]
          : "Divers")

      // Find terms with the same category
      related = termsData
        .filter((t) => {
          const tCategory =
            t.category ||
            (t.allDefinitions && t.allDefinitions.length > 0 && t.allDefinitions[0].categories
              ? t.allDefinitions[0].categories[0]
              : "Divers")
          return tCategory === termCategory && t.name !== term.name
        })
        .slice(0, 4)
    }

    setRelatedTerms(related)

    // Find suggested terms based on search query
    if (searchQuery) {
      const suggested = termsData
        .filter(
          (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            t.name !== term.name &&
            !related.some((r) => r.name === t.name),
        )
        .slice(0, 4)

      setSuggestedTerms(suggested)
    } else {
      // If no search query, show random terms
      const randomTerms = [...termsData]
        .filter((t) => t.name !== term.name && !related.some((r) => r.name === t.name))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)

      setSuggestedTerms(randomTerms)
    }
  }

  const closeTermDetails = () => {
    setSelectedTerm(null)
  }

  // Function to toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  // Function to get color for a category - purple-themed colors
  const getCategoryColor = (category) => {
    const colorMap = {
      "Computer Science": "#8b5cf6", // Violet
      Networks: "#6366f1", // Indigo
      "Software Development": "#a855f7", // Purple
      "Data Management": "#d946ef", // Fuchsia
      Cybersecurity: "#ec4899", // Pink
      "Données personnelles": "#9333ea", // Purple
      "Commerce électronique": "#c026d3", // Fuchsia
      Réseaux: "#7c3aed", // Violet
      "Criminalité informatique": "#e879f9", // Pink
      Divers: "#8b5cf6", // Violet
      "Contrat Informatique": "#a78bfa", // Violet
      "Propriété intellectuelle": "#c084fc", // Purple
      Organisations: "#8b5cf6", // Violet
    }
    return colorMap[category] || "#8b5cf6" // Default violet
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedTerm && event.target.classList.contains("_terms_term_details_overlay")) {
        closeTermDetails()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [selectedTerm])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedTerm) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [selectedTerm])

  return (
    <div className="_terms_search_page">
      <div className="_terms_search_page_content">
        <div className="_terms_search_page_header">
          <h1 className="_terms_search_page_title">Knowledge Graph</h1>
          <p className="_terms_search_page_subtitle">Explore terms and concepts powered by Neo4j graph technology</p>
        </div>

        <div className="_terms_search_page_type_selector">
          <button
            className={`_terms_search_page_type_btn ${searchType === "classic" ? "active" : ""}`}
            onClick={() => setSearchType("classic")}
          >
            <span>Classic Search</span>
          </button>
          <button
            className={`_terms_search_page_type_btn ${searchType === "indexed" ? "active" : ""}`}
            onClick={() => setSearchType("indexed")}
          >
            <span>Indexed Search</span>
          </button>
        </div>

        {searchType === "classic" && <ClassicSearch terms={termsData} onTermSelect={handleTermSelect} />}

        {searchType === "indexed" && <IndexedSearch language={selectedLanguage} onTermSelect={handleTermSelect} />}
      </div>

      {/* Term Details Modal */}
      {selectedTerm && (
        <div className="_terms_term_details_overlay">
          <div className="_terms_term_details_modal">
            <div className="_terms_term_details_header">
              <div className="_terms_term_details_title_wrapper">
                <h2>{selectedTerm.name}</h2>
              </div>
              <button className="_terms_term_details_close_button" onClick={closeTermDetails}>
                <X size={24} />
              </button>
            </div>
            <div className="_terms_term_details_content">
              {/* For terms with categories array */}
              {selectedTerm.categories && selectedTerm.categories.length > 0 ? (
                selectedTerm.categories.map((category, catIndex) => (
                  <div key={catIndex} className="_terms_term_category_section">
                    <div
                      className="_terms_term_category_header"
                      style={{
                        "--category-color": getCategoryColor(category.type),
                      }}
                    >
                      <h3>{category.type}</h3>
                    </div>
                    <div className="_terms_term_category_content">
                      {/* Principal definition */}
                      {category.principale && category.principale.length > 0 && (
                        <div className="_terms_term_definition_section">
                          <h4>Primary Definition</h4>
                          {category.principale.map((def, defIndex) => (
                            <div key={defIndex} className="_terms_term_definition_block">
                              {def.definition_principale &&
                                def.definition_principale.map((text, textIndex) => (
                                  <p key={textIndex} className="_terms_term_definition_text">
                                    {text}
                                  </p>
                                ))}
                              {def.references && def.references.length > 0 && (
                                <div className="_terms_term_references">
                                  <h5>References</h5>
                                  <ul className="_terms_term_references_list">
                                    {def.references.map((ref, refIndex) => (
                                      <li key={refIndex} className="_terms_term_reference_item">
                                        <span>{ref}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Secondary definition */}
                      {category.secondaire && category.secondaire.length > 0 && (
                        <div className="_terms_term_definition_section _terms_term_secondary">
                          <h4>Secondary Definition</h4>
                          {category.secondaire.map((def, defIndex) => (
                            <div key={defIndex} className="_terms_term_definition_block">
                              {def.definition_secondaire &&
                                def.definition_secondaire.map((text, textIndex) => (
                                  <p key={textIndex} className="_terms_term_definition_text">
                                    {text}
                                  </p>
                                ))}
                              {def.reference_secondaires && def.reference_secondaires.length > 0 && (
                                <div className="_terms_term_references">
                                  <h5>References</h5>
                                  <ul className="_terms_term_references_list">
                                    {def.reference_secondaires.map((ref, refIndex) => (
                                      <li key={refIndex} className="_terms_term_reference_item">
                                        <span>{ref}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // For simple terms without categories array
                <div className="_terms_term_simple_details">
                  <div
                    className="_terms_term_category_header"
                    style={{
                      "--category-color": getCategoryColor(selectedTerm.category),
                    }}
                  >
                    <h3>{selectedTerm.category}</h3>
                  </div>
                  <div className="_terms_term_definition_section">
                    <p className="_terms_term_definition_text">{selectedTerm.definition}</p>
                    {selectedTerm.reference && (
                      <div className="_terms_term_references">
                        <h5>Reference</h5>
                        <div className="_terms_term_reference_item">
                          <span>{selectedTerm.reference}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Related terms */}
              {relatedTerms.length > 0 && (
                <div className="_terms_term_relations_section">
                  <h4>Related Terms</h4>
                  <div className="_terms_term_relations_list">
                    {relatedTerms.map((relation, index) => (
                      <div
                        key={index}
                        className="_terms_term_relation_item"
                        onClick={() => handleTermSelect(relation)}
                        style={{
                          "--relation-color": getCategoryColor(
                            relation.category ||
                              (relation.categories && relation.categories.length > 0
                                ? relation.categories[0].type
                                : "Divers"),
                          ),
                        }}
                      >
                        <span className="_terms_term_relation_name">{relation.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="_terms_term_details_footer">
              <button
                className="_terms_term_add_library_btn"
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <span>Add to Library</span>
                <div className="_terms_term_add_library_icon">
                  <Hash size={16} className={isButtonHovered ? "visible" : ""} />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage
