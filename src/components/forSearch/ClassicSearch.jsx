"use client";

import { useState, useEffect, useMemo } from "react";
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
import "./ClassicSearch.css";


const ClassicSearch = ({
  terms,
  allTerms,
  onTermSelect,
  onSearchChange,
  viewMode = "card",
  language = "en",
  hasMore = false,
  loadMoreTerms,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredTerms, setFilteredTerms] = useState(terms);
  const [activeCategories, setActiveCategories] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

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

  // Get the first 7 categories based on language
  const getLanguageSpecificCategories = () => {
    try {
      const allCategories = Object.keys(categoryTranslations[language] || {});
      return allCategories.slice(0, 7); // Only return the first 7 categories
    } catch (err) {
      console.error("Error getting language categories:", err);
      return [];
    }
  };

  // Filter terms based on search input, active categories, and language
  useEffect(() => {
    try {
      let results = [...terms];

      // Filter by search term
      if (searchInput) {
        results = results.filter((term) =>
          term.name.toLowerCase().includes(searchInput.toLowerCase())
        );

        // Pass search query to parent component for suggested terms
        if (onSearchChange) {
          onSearchChange(searchInput);
        }
      }

      // Filter by active categories
      if (activeCategories.length > 0) {
        results = results.filter((term) => {
          // For terms with allDefinitions, check all categories across all definitions
          if (term.allDefinitions && term.allDefinitions.length > 0) {
            return term.allDefinitions.some((def) =>
              def.categories.some((cat) => activeCategories.includes(cat))
            );
          }
          // For terms with a single category
          return activeCategories.includes(term.category);
        });
      }

      setFilteredTerms(results);
    } catch (err) {
      console.error("Error filtering terms:", err);
      setFilteredTerms([]);
    }
  }, [searchInput, activeCategories, terms, language, onSearchChange]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryToggle = (category) => {
    try {
      setActiveCategories((prev) => {
        if (prev.includes(category)) {
          return prev.filter((c) => c !== category);
        } else {
          return [...prev, category];
        }
      });
    } catch (err) {
      console.error("Error toggling category:", err);
    }
  };

  // Get language-specific categories
  const languageCategories = useMemo(() => {
    return getLanguageSpecificCategories();
  }, [language]);

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

  return (
    <div className="_terms_search_container">
      <div className="_terms_search_header">
        <form onSubmit={handleSearchSubmit} className="_terms_search_form">
          <div className="_terms_search_input_wrapper">
            <Search size={18} className="_terms_search_icon" />
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Search for laws..."
              className="_terms_search_input"
            />
          </div>
          <button
            type="submit"
            className="_terms_search_button"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <span>Search</span>
            <div className="_terms_search_button_icon">
              <Search size={16} className={isButtonHovered ? "visible" : ""} />
            </div>
          </button>
        </form>
      </div>

      <div className="_terms_search_categories">
        <h3 className="_terms_search_categories_title">
          <Sparkles size={18} className="_terms_search_category_icon" />
          Law Categories
        </h3>
        <div className="_terms_search_categories_list">
          {languageCategories.map((category, index) => (
            <button
              key={index}
              className={`_terms_search_category_btn ${
                activeCategories.includes(category) ? "active" : ""
              }`}
              style={{
                "--category-color": getCategoryColor(category),
              }}
              onClick={() => handleCategoryToggle(category)}
            >
              {getCategoryIcon(category)}
              <span>{getCategoryName(category)}</span>
              <div className="_terms_category_btn_glow"></div>
            </button>
          ))}
        </div>
      </div>

      <div className="_terms_search_results">
        <div className="_terms_search_results_header">
          <h3>
            <Code size={20} className="_terms_search_results_icon" />
            Legal Provisions
          </h3>
          <span className="_terms_search_results_count">
            {filteredTerms.length} of {allTerms.length} laws found
          </span>
        </div>

        {viewMode === "card" ? (
          <div className="_terms_search_results_grid">
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

              // Get the primary definition
              const primaryDefinition =
                term.definition || "No definition available";

              // Get references if available
              const references = term.reference ? [term.reference] : [];

              return (
                <div
                  key={index}
                  className="_terms_search_term_card"
                  style={{
                    "--card-color": cardColor,
                  }}
                  onClick={() => onTermSelect(term)}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="_terms_card_glow"></div>
                  <div className="_terms_search_term_header">
                    <div className="_terms_search_term_title_wrapper">
                      {getCategoryIcon(primaryCategory)}
                      <h4>{term.name}</h4>
                    </div>
                    <div className="_terms_search_term_categories">
                      {categories.map((category, catIndex) => (
                        <span
                          key={catIndex}
                          className="_terms_search_category_tag"
                          style={{
                            backgroundColor: `${getCategoryColor(category)}20`,
                            color: getCategoryColor(category),
                          }}
                        >
                          {getCategoryName(category)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="_terms_search_term_content">
                    <p className="_terms_search_term_definition">
                      {primaryDefinition}
                    </p>
                    {references && references.length > 0 && (
                      <div className="_terms_search_term_references">
                        {references.map((ref, refIndex) => (
                          <div
                            key={refIndex}
                            className="_terms_search_term_reference"
                          >
                            <BookOpen
                              size={14}
                              className="_terms_search_reference_icon"
                            />
                            <span>{ref}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="_terms_search_term_footer">
                      <span className="_terms_search_term_click_hint">
                        View full legal provision
                      </span>
                    </div>
                  </div>
                  <button
                    className="_terms_search_save_button"
                    style={{
                      backgroundColor: cardColor,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Saving law: ${term.name}`);
                    }}
                  >
                    <span className="_terms_search_btn_text">
                      Add to Library
                    </span>
                    <div className="_terms_search_btn_icon">
                      <Hash size={16} />
                    </div>
                  </button>
                </div>
              );
            })}

            {filteredTerms.length === 0 && (
              <div className="_terms_search_no_results">
                <p>No laws found for this criteria.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="_terms_search_results_list_view">
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
                  className="_terms_search_term_list_item"
                  onClick={() => onTermSelect(term)}
                  style={{
                    "--term-color": termColor,
                    borderLeft: `4px solid ${termColor}`,
                  }}
                >
                  <div className="_terms_search_term_list_content">
                    <div className="_terms_search_term_list_header">
                      {getCategoryIcon(primaryCategory)}
                      <h5>{term.name}</h5>
                    </div>
                    <div className="_terms_search_term_list_categories">
                      {categories.map((category, catIndex) => (
                        <span
                          key={catIndex}
                          className="_terms_search_term_list_category"
                          style={{
                            backgroundColor: `${getCategoryColor(category)}20`,
                            color: getCategoryColor(category),
                          }}
                        >
                          {getCategoryName(category)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="_terms_search_term_list_button"
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

            {filteredTerms.length === 0 && (
              <div className="_terms_search_no_results">
                <p>No laws found for this criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Show More button */}
        {hasMore && filteredTerms.length > 0 && (
          <button
            className="_terms_search_show_more_button"
            onClick={loadMoreTerms}
          >
            <span>Show More</span>
            <ChevronDown size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ClassicSearch;
