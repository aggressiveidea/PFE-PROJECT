"use client";

import { useState, useEffect } from "react";
import {
  Search,
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
} from "lucide-react";
import { indexedSearch } from "../../services/Api";
import "./IndexedSearch.css";


const IndexedSearch = ({
  language = "en",
  onTermSelect,
  onSearchChange,
  viewMode = "card",
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [indexedTerms, setIndexedTerms] = useState({});
  const [suggestedTerms, setSuggestedTerms] = useState([]);
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const [hoveredTerm, setHoveredTerm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 8;

  // Generate alphabet array A-Z
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

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
    };
    return colorMap[category] || "#8b5cf6"; // Default violet
  };

  // Category translations
  const categoryTranslations = {
    en: {
      "Computer Science": "Computer Science Law",
      Networks: "Network Law",
      "Software Development": "Software Law",
      "Data Management": "Data Law",
      Cybersecurity: "Cybersecurity Law",
      "Données personnelles": "Personal Data Law",
      "Commerce électronique": "E-Commerce Law",
      Réseaux: "Network Law",
      "Criminalité informatique": "Computer Crime Law",
      Divers: "Miscellaneous Law",
      "Contrat Informatique": "IT Contract Law",
      "Propriété intellectuelle": "Intellectual Property Law",
      Organisations: "Organizational Law",
    },
    fr: {
      "Computer Science": "Loi d'Informatique",
      Networks: "Loi des Réseaux",
      "Software Development": "Loi des Logiciels",
      "Data Management": "Loi des Données",
      Cybersecurity: "Loi de Cybersécurité",
      "Données personnelles": "Loi des Données Personnelles",
      "Commerce électronique": "Loi du Commerce Électronique",
      Réseaux: "Loi des Réseaux",
      "Criminalité informatique": "Loi de Criminalité Informatique",
      Divers: "Lois Diverses",
      "Contrat Informatique": "Loi des Contrats Informatiques",
      "Propriété intellectuelle": "Loi de Propriété Intellectuelle",
      Organisations: "Loi des Organisations",
    },
    ar: {
      "Computer Science": "قانون علوم الكمبيوتر",
      Networks: "قانون الشبكات",
      "Software Development": "قانون تطوير البرمجيات",
      "Data Management": "قانون إدارة البيانات",
      Cybersecurity: "قانون الأمن السيبراني",
      "Données personnelles": "قانون البيانات الشخصية",
      "Commerce électronique": "قانون التجارة الإلكترونية",
      Réseaux: "قانون الشبكات",
      "Criminalité informatique": "قانون الجرائم المعلوماتية",
      Divers: "قوانين متنوعة",
      "Contrat Informatique": "قانون عقود تكنولوجيا المعلومات",
      "Propriété intellectuelle": "قانون الملكية الفكرية",
      Organisations: "قانون المنظمات",
    },
  };

  // Get category name based on selected language
  const getCategoryName = (category) => {
    return categoryTranslations[language][category] || category;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      "Computer Science": <Cpu size={16} />,
      Networks: <Server size={16} />,
      "Software Development": <Code size={16} />,
      "Data Management": <Database size={16} />,
      Cybersecurity: <Shield size={16} />,
      "Données personnelles": <BookOpen size={16} />,
      "Commerce électronique": <Zap size={16} />,
      Réseaux: <Server size={16} />,
      "Criminalité informatique": <Shield size={16} />,
      Divers: <BookOpen size={16} />,
      "Contrat Informatique": <Code size={16} />,
      "Propriété intellectuelle": <BookOpen size={16} />,
      Organisations: <Database size={16} />,
    };
    return icons[category] || <BookOpen size={16} />;
  };

  // Fetch indexed terms when active index changes
  useEffect(() => {
    const fetchIndexedTerms = async () => {
      if (!activeIndex) return;

      try {
        setIsLoading(true);
        setError(null);

        // Use the indexedSearch function from API
        const data = await indexedSearch(
          activeIndex,
          currentPage,
          ITEMS_PER_PAGE,
          language
        );

        // Transform the data to match the expected format
        const transformedData = data.map((term) => {
          return {
            id: term.id,
            name: term.name,
            // Store all definitions for detailed view
            allDefinitions: term.definitions,
            // Also keep a simple format for the cards display
            category: term.definitions[0]?.categories[0] || "Divers",
            definition: term.definitions[0]?.text || "No definition available",
            reference: term.definitions[0]?.references || "",
            // Store related terms if available
            relatedTerms: term.relatedTerms || [],
          };
        });

        // Update indexed terms
        setIndexedTerms((prev) => ({
          ...prev,
          [activeIndex]: [...(prev[activeIndex] || []), ...transformedData],
        }));

        // Check if there are more items to load
        setHasMore(data.length === ITEMS_PER_PAGE);
        setIsLoading(false);

        // Generate suggested terms
        if (transformedData.length > 0) {
          const randomTerms = [...transformedData]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          setSuggestedTerms(randomTerms);
        }
      } catch (err) {
        console.error("Error fetching indexed terms:", err);
        setError("Failed to load indexed terms. Please try again.");
        setIsLoading(false);
      }
    };

    fetchIndexedTerms();
  }, [activeIndex, currentPage, language]);

  // Initialize with first letter
  useEffect(() => {
    if (!activeIndex && alphabet.length > 0) {
      setActiveIndex(alphabet[0]);
      setCurrentPage(1);
    }
  }, [alphabet]);

  // Filter terms based on search input
  const getFilteredTerms = () => {
    try {
      if (!activeIndex || !indexedTerms[activeIndex]) return [];

      if (!searchInput) return indexedTerms[activeIndex];

      return indexedTerms[activeIndex].filter((term) =>
        term.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    } catch (err) {
      console.error("Error filtering terms:", err);
      return [];
    }
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleIndexClick = (index) => {
    if (index === activeIndex) return;

    setActiveIndex(index);
    setCurrentPage(1);
    setSearchInput("");

    // Clear previous terms for this index
    setIndexedTerms((prev) => ({
      ...prev,
      [index]: [],
    }));
  };

  const loadMoreTerms = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const filteredTerms = getFilteredTerms();

  return (
    <div className="_terms_indexed_search_container">
      <div className="_terms_indexed_search_header">
        <h3 className="_terms_indexed_search_title">
          <Sparkles size={20} className="_terms_indexed_search_icon" />
          Legal Alphabet Index
        </h3>
        <div className="_terms_indexed_search_input_wrapper">
          <Search size={18} className="_terms_indexed_search_icon" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search for laws..."
            className="_terms_indexed_search_input"
          />
        </div>
      </div>

      <div className="_terms_indexed_search_alphabet">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={`_terms_indexed_search_letter ${
              activeIndex === letter ? "active" : ""
            }`}
            onClick={() => handleIndexClick(letter)}
            onMouseEnter={() => setHoveredLetter(letter)}
            onMouseLeave={() => setHoveredLetter(null)}
          >
            {letter}
            {(hoveredLetter === letter || activeIndex === letter) && (
              <span className="_terms_letter_glow"></span>
            )}
          </button>
        ))}
      </div>

      <div className="_terms_indexed_search_content">
        <div className="_terms_indexed_search_results_header">
          <h4>
            <Code size={16} className="_terms_indexed_search_results_icon" />
            {activeIndex ? `Laws - ${activeIndex}` : "Select an index"}
          </h4>
          <span className="_terms_indexed_search_results_count">
            {filteredTerms.length}{" "}
            {filteredTerms.length > 0
              ? `of ${indexedTerms[activeIndex]?.length || 0} laws found`
              : "laws found"}
          </span>
        </div>

        {isLoading && currentPage === 1 ? (
          <div
            className="_terms_indexed_search_loading"
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "16px",
              padding: "30px",
              margin: "20px 0",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(233, 213, 255, 0.6)",
            }}
          >
            <div className="_terms_loading_spinner"></div>
            <p>Loading legal provisions...</p>
          </div>
        ) : error ? (
          <div
            className="_terms_indexed_search_error"
            style={{
              margin: "20px 0",
              background: "rgba(254, 226, 226, 0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(248, 113, 113, 0.5)",
            }}
          >
            <p>{error}</p>
            <button
              onClick={() => handleIndexClick(activeIndex)}
              className="_terms_retry_button"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Conditional rendering based on view mode */}
            {viewMode === "card" ? (
              <div className="_terms_indexed_search_results_grid">
                {filteredTerms.map((term, index) => {
                  // Get all unique categories from all definitions
                  const allCategories = new Set();

                  if (term.allDefinitions && term.allDefinitions.length > 0) {
                    term.allDefinitions.forEach((def) => {
                      def.categories.forEach((cat) => allCategories.add(cat));
                    });
                  } else if (term.category) {
                    allCategories.add(term.category);
                  }

                  const categories = Array.from(allCategories);

                  // Get the primary category for styling
                  const primaryCategory = categories[0] || "Divers";
                  const cardColor = getCategoryColor(primaryCategory);

                  return (
                    <div
                      key={index}
                      className="_terms_indexed_search_term_item"
                      onClick={() => onTermSelect(term)}
                      style={{
                        "--term-color": cardColor,
                      }}
                      onMouseEnter={() => setHoveredTerm(index)}
                      onMouseLeave={() => setHoveredTerm(null)}
                    >
                      <div className="_terms_indexed_term_glow"></div>
                      <div className="_terms_indexed_search_term_header">
                        {getCategoryIcon(primaryCategory)}
                        <h5>{term.name}</h5>
                      </div>
                      <div className="_terms_indexed_search_term_categories">
                        {categories.map((category, catIndex) => (
                          <span
                            key={catIndex}
                            className="_terms_indexed_search_term_category"
                            style={{
                              backgroundColor: `${getCategoryColor(
                                category
                              )}20`,
                              color: getCategoryColor(category),
                            }}
                          >
                            {getCategoryName(category)}
                          </span>
                        ))}
                      </div>
                      <Hash
                        size={16}
                        className="_terms_indexed_search_term_hash"
                      />
                    </div>
                  );
                })}

                {filteredTerms.length === 0 && !isLoading && (
                  <div className="_terms_indexed_search_no_results">
                    <p>No laws found for this criteria.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="_terms_indexed_search_results_list_view">
                {filteredTerms.map((term, index) => {
                  // Get all unique categories from all definitions
                  const allCategories = new Set();

                  if (term.allDefinitions && term.allDefinitions.length > 0) {
                    term.allDefinitions.forEach((def) => {
                      def.categories.forEach((cat) => allCategories.add(cat));
                    });
                  } else if (term.category) {
                    allCategories.add(term.category);
                  }

                  const categories = Array.from(allCategories);

                  // Get the primary category for styling
                  const primaryCategory = categories[0] || "Divers";
                  const termColor = getCategoryColor(primaryCategory);

                  return (
                    <div
                      key={index}
                      className="_terms_indexed_search_term_list_item"
                      onClick={() => onTermSelect(term)}
                      style={{
                        "--term-color": termColor,
                      }}
                    >
                      <div className="_terms_indexed_term_list_content">
                        <div className="_terms_indexed_search_term_list_header">
                          {getCategoryIcon(primaryCategory)}
                          <h5>{term.name}</h5>
                        </div>
                        <div className="_terms_indexed_search_term_list_categories">
                          {categories.map((category, catIndex) => (
                            <span
                              key={catIndex}
                              className="_terms_indexed_search_term_list_category"
                              style={{
                                backgroundColor: `${getCategoryColor(
                                  category
                                )}20`,
                                color: getCategoryColor(category),
                              }}
                            >
                              {getCategoryName(category)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        className="_terms_indexed_search_term_list_button"
                        style={{
                          backgroundColor: termColor,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Adding ${term.name} to library`);
                        }}
                      >
                        <Hash size={16} />
                      </button>
                    </div>
                  );
                })}

                {filteredTerms.length === 0 && !isLoading && (
                  <div className="_terms_indexed_search_no_results">
                    <p>No laws found for this criteria.</p>
                  </div>
                )}
              </div>
            )}

            {/* Show More button */}
            {hasMore && !isLoading && filteredTerms.length > 0 && (
              <button
                className="_terms_indexed_show_more_button"
                onClick={loadMoreTerms}
              >
                <span>Show More</span>
                <ChevronDown size={16} />
              </button>
            )}

            {/* Loading indicator for pagination */}
            {isLoading && currentPage > 1 && (
              <div className="_terms_indexed_search_loading_more">
                <div className="_terms_loading_spinner_small"></div>
                <span>Loading more...</span>
              </div>
            )}
          </>
        )}
      </div>

      {suggestedTerms.length > 0 && (
        <div className="_terms_indexed_search_suggestions">
          <h4 className="_terms_indexed_search_suggestions_title">
            <Zap size={16} className="_terms_indexed_search_suggestions_icon" />
            Related Laws
          </h4>
          <div className="_terms_indexed_search_suggestions_list">
            {suggestedTerms.map((term, index) => {
              // Get the primary category for styling
              const primaryCategory =
                term.category ||
                (term.allDefinitions && term.allDefinitions.length > 0
                  ? term.allDefinitions[0].categories[0]
                  : "Divers");

              return (
                <div
                  key={index}
                  className="_terms_indexed_search_suggestion_item"
                  onClick={() => onTermSelect(term)}
                  style={{
                    "--suggestion-color": getCategoryColor(primaryCategory),
                  }}
                >
                  <div className="_terms_suggestion_glow"></div>
                  {getCategoryIcon(primaryCategory)}
                  <span className="_terms_indexed_search_suggestion_name">
                    {term.name}
                  </span>
                  <span
                    className="_terms_indexed_search_suggestion_category"
                    style={{
                      backgroundColor: `${getCategoryColor(primaryCategory)}20`,
                      color: getCategoryColor(primaryCategory),
                    }}
                  >
                    {getCategoryName(primaryCategory)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexedSearch;
