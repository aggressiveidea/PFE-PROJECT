"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import "./ClassicSearch.css";

const ClassicSearch = ({ terms, onSearch, onTermSelect }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredTerms, setFilteredTerms] = useState(terms);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [activeCategories, setActiveCategories] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [suggestedTerms, setSuggestedTerms] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [visibleTerms, setVisibleTerms] = useState(6);

  // Fixed French legal terms to always include in suggestions
  const fixedSuggestedTerms = [
    {
      name: "Droit d'accès",
      category: "Personal Data",
      definition:
        "Le droit pour une personne d'obtenir la confirmation que des données à caractère personnel la concernant sont ou ne sont pas traitées et d'accéder auxdites données.",
      reference: "Article 15 RGPD",
      priority: 10,
      categories: [{ type: "Personal Data" }],
    },
    {
      name: "Droit à l'information",
      category: "Personal Data",
      definition:
        "Le droit d'être informé de manière claire et transparente sur le traitement des données personnelles.",
      reference: "Articles 13-14 RGPD",
      priority: 9,
      categories: [{ type: "Personal Data" }],
    },
    {
      name: "Droit de contestation",
      category: "Personal Data",
      definition:
        "Le droit de contester une décision prise uniquement sur la base d'un traitement automatisé.",
      reference: "Article 22 RGPD",
      priority: 9,
      categories: [{ type: "Personal Data" }],
    },
    {
      name: "Droit de rectification",
      category: "Personal Data",
      definition:
        "Le droit d'obtenir la rectification des données à caractère personnel inexactes et de compléter les données incomplètes.",
      reference: "Article 16 RGPD",
      priority: 9,
      categories: [{ type: "Personal Data" }],
    },
    {
      name: "Droit de retrait",
      category: "Personal Data",
      definition:
        "Le droit de retirer son consentement à tout moment lorsque le traitement est fondé sur le consentement.",
      reference: "Article 7(3) RGPD",
      priority: 9,
      categories: [{ type: "Personal Data" }],
    },
    {
      name: "Droit d'opposition",
      category: "Personal Data",
      definition:
        "Le droit de s'opposer à tout moment au traitement des données à caractère personnel pour des raisons tenant à sa situation particulière.",
      reference: "Article 21 RGPD",
      priority: 5,
      categories: [{ type: "Personal Data" }],
    },
  ];

  // Function to get color for a category - purple-themed colors
  const getCategoryColor = (category) => {
    const colorMap = {
      "Computer Crime": "#e879f9", // Pink
      "Personal Data": "#9333ea", // Purple
      "Electronic Commerce": "#c026d3", // Fuchsia
      Organizations: "#8b5cf6", // Violet
      Networks: "#6366f1", // Indigo
      "Intellectual Property": "#c084fc", // Purple
      Miscellaneous: "#8b5cf6", // Violet
      "Computer Contracts": "#a78bfa", // Violet
    };
    return colorMap[category] || "#8b5cf6"; // Default violet
  };

  // Category translations (standardized)
  const categoryTranslations = {
    english: {
      "Computer Crime": "Computer Crime Law",
      "Personal Data": "Personal Data Law",
      "Electronic Commerce": "Electronic Commerce Law",
      Organizations: "Organizations Law",
      Networks: "Network Law",
      "Intellectual Property": "Intellectual Property Law",
      Miscellaneous: "Miscellaneous Law",
      "Computer Contracts": "Computer Contracts Law",
    },
    french: {
      "Computer Crime": "Criminalité informatique",
      "Personal Data": "Données personnelles",
      "Electronic Commerce": "Commerce électronique",
      Organizations: "Organisations",
      Networks: "Réseaux",
      "Intellectual Property": "Propriété intellectuelle",
      Miscellaneous: "Divers",
      "Computer Contracts": "Contrats informatiques",
    },
    arabic: {
      "Computer Crime": "الجريمة الإلكترونية",
      "Personal Data": "البيانات الشخصية",
      "Electronic Commerce": "التجارة الإلكترونية",
      Organizations: "المنظمات",
      Networks: "الشبكات",
      "Intellectual Property": "الملكية الفكرية",
      Miscellaneous: "متنوعة",
      "Computer Contracts": "العقود الإلكترونية",
    },
  };

  // Get the first 7 categories based on language
  const getLanguageSpecificCategories = () => {
    const allCategories = Object.keys(
      categoryTranslations[selectedLanguage] || {}
    );
    return allCategories.slice(0, 7); // Only return the first 7 categories
  };

  // Filter terms based on search input, active categories, and language
  useEffect(() => {
    let results = [...terms];

    // Filter by search term
    if (searchInput && hasSearched) {
      results = results.filter((term) =>
        term.name.toLowerCase().includes(searchInput.toLowerCase())
      );

      // Generate suggested terms based on search, always including fixed French terms
      const searchBasedSuggestions = terms
        .filter(
          (term) =>
            !results.includes(term) &&
            (term.category.toLowerCase().includes(searchInput.toLowerCase()) ||
              (term.categories &&
                term.categories.some((cat) =>
                  cat.type.toLowerCase().includes(searchInput.toLowerCase())
                )))
        )
        .slice(0, 3);

      // Combine fixed terms with search-based suggestions, sorted by priority
      const combinedSuggestions = [
        ...fixedSuggestedTerms,
        ...searchBasedSuggestions,
      ]
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .slice(0, 8);

      setSuggestedTerms(combinedSuggestions);
    } else {
      // When no search is active, show fixed terms as default suggestions
      setSuggestedTerms(fixedSuggestedTerms.slice(0, 6));
    }

    // Filter by active categories
    if (activeCategories.length > 0) {
      results = results.filter((term) => {
        // For terms with multiple categories
        if (term.categories && term.categories.length > 0) {
          return term.categories.some((cat) =>
            activeCategories.includes(cat.type)
          );
        }
        // For terms with a single category
        return activeCategories.includes(term.category);
      });
    }

    setFilteredTerms(results);
  }, [searchInput, activeCategories, terms, selectedLanguage, hasSearched]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    if (onSearch) onSearch(searchInput);
  };

  // Update the search functionality to include autocomplete
  // Modify the handleInputChange function to provide autocomplete suggestions
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);

    // Generate suggestions as user types (autocomplete)
    if (e.target.value.length > 1) {
      const autocompleteSuggestions = terms
        .filter(
          (term) =>
            term.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            (term.category &&
              term.category
                .toLowerCase()
                .includes(e.target.value.toLowerCase())) ||
            (term.categories &&
              term.categories.some((cat) =>
                cat.type.toLowerCase().includes(e.target.value.toLowerCase())
              ))
        )
        .slice(0, 3);

      // Include fixed terms that match the search
      const matchingFixedTerms = fixedSuggestedTerms.filter((term) =>
        term.name.toLowerCase().includes(e.target.value.toLowerCase())
      );

      const combinedSuggestions = [
        ...matchingFixedTerms,
        ...autocompleteSuggestions,
      ]
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .slice(0, 8);

      setSuggestedTerms(combinedSuggestions);
      setHasSearched(true);
    } else if (e.target.value === "") {
      setSuggestedTerms(fixedSuggestedTerms.slice(0, 6));
      setHasSearched(false);
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    // Reset active categories when language changes
    setActiveCategories([]);
  };

  const handleCategoryToggle = (category) => {
    setActiveCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Get language-specific categories
  const languageCategories = useMemo(() => {
    return getLanguageSpecificCategories();
  }, [selectedLanguage]);

  // Get category name based on selected language
  const getCategoryName = (category) => {
    return categoryTranslations[selectedLanguage][category] || category;
  };

  // Add function to show more terms
  const handleShowMore = () => {
    setVisibleTerms((prev) => prev + 6);
  };

  const handleTermSelect = (term) => {
    if (onTermSelect) onTermSelect(term);
  };

  return (
    <div className="_terms_search_container">
      <div className="_terms_search_header">
        <div className="_terms_search_language_selector">
          <label htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="_terms_search_language_select"
          >
            <option value="english">English</option>
            <option value="french">French</option>
            <option value="arabic">Arabic</option>
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="_terms_search_form">
          <div className="_terms_search_input_wrapper">
            <Search size={18} className="_terms_search_icon" />
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Search for terms..."
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
        <h3 className="_terms_search_categories_title">Categories</h3>
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
              <span>{getCategoryName(category)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="_terms_search_results">
        <div className="_terms_search_results_header">
          <h3>Terms</h3>
          <span className="_terms_search_results_count">
            {filteredTerms.length} terms found
          </span>
        </div>

        <div className="_terms_search_results_grid">
          {filteredTerms.slice(0, visibleTerms).map((term, index) => {
            // Get all categories for the term
            const categories = term.categories
              ? term.categories.map((cat) => cat.type)
              : term.category
              ? [term.category]
              : [];

            // Get the primary category for styling
            const primaryCategory = categories[0] || "Miscellaneous";

            // Get the primary definition
            const primaryDefinition =
              term.definition ||
              (term.categories &&
                term.categories[0] &&
                term.categories[0].principale &&
                term.categories[0].principale[0] &&
                term.categories[0].principale[0].definition_principale &&
                term.categories[0].principale[0].definition_principale[0]) ||
              "No definition available";

            // Get references if available
            const references = term.reference
              ? [term.reference]
              : (term.categories &&
                  term.categories[0] &&
                  term.categories[0].principale &&
                  term.categories[0].principale[0] &&
                  term.categories[0].principale[0].references) ||
                [];

            return (
              <div
                key={index}
                className="_terms_search_term_card"
                onClick={() => handleTermSelect(term)}
                style={{
                  "--card-bg-color": `rgba(${getCategoryColor(primaryCategory)
                    .replace("#", "")
                    .match(/.{2}/g)
                    .map((x) => Number.parseInt(x, 16))
                    .join(", ")}, 0.05)`,
                  "--category-color": getCategoryColor(primaryCategory),
                }}
              >
                <div className="_terms_search_term_header">
                  <div className="_terms_search_term_title_container">
                    <h4 className="_terms_search_term_title">{term.name}</h4>
                    <span
                      className="_terms_search_term_category_name"
                      style={{ color: getCategoryColor(primaryCategory) }}
                    >
                      {getCategoryName(primaryCategory)}
                    </span>
                  </div>
                </div>

                <div className="_terms_search_term_content">
                  <h5
                    className="_terms_search_term_section_title"
                    style={{
                      "--card-color": getCategoryColor(primaryCategory),
                    }}
                  >
                    Primary Legal Provision
                  </h5>
                  <p className="_terms_search_term_definition">
                    {primaryDefinition}
                  </p>

                  {references && references.length > 0 && (
                    <div className="_terms_search_term_references">
                      <h6 className="_terms_search_term_references_title">
                        Legal References
                      </h6>
                      {references.map((ref, refIndex) => (
                        <div
                          key={refIndex}
                          className="_terms_search_term_reference"
                        >
                          <span
                            className="_terms_search_reference_icon"
                            style={{ color: getCategoryColor(primaryCategory) }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                          </span>
                          <span>{ref}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="_terms_search_save_button"
                  style={{
                    "--save-btn-color": getCategoryColor(primaryCategory),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add save functionality here
                    console.log(`Saving term: ${term.name}`);
                  }}
                >
                  <span className="_terms_search_btn_text">Add to Library</span>
                </button>
              </div>
            );
          })}
        </div>

        {filteredTerms.length > visibleTerms && (
          <button className="_terms_search_show_more" onClick={handleShowMore}>
            Show More Terms
          </button>
        )}
      </div>

      {/* Suggested Terms Section */}
      <div className="_terms_search_suggested">
        <h3 className="_terms_search_suggested_title">Suggested Terms</h3>
        <div className="_terms_search_suggested_list">
          {suggestedTerms.length > 0 ? (
            suggestedTerms.map((term, index) => {
              const category = term.categories
                ? term.categories[0]?.type
                : term.category;
              return (
                <div
                  key={index}
                  className="_terms_search_suggested_item"
                  onClick={() => handleTermSelect(term)}
                  style={{
                    "--suggestion-color": getCategoryColor(category),
                  }}
                >
                  <span className="_terms_search_suggested_name">
                    {term.name}
                  </span>
                  <span
                    className="_terms_search_suggested_category"
                    style={{
                      backgroundColor: `rgba(${getCategoryColor(category)
                        .replace("#", "")
                        .match(/.{2}/g)
                        .map((x) => Number.parseInt(x, 16))
                        .join(", ")}, 0.2)`,
                      color: getCategoryColor(category),
                    }}
                  >
                    {getCategoryName(category)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="_terms_search_empty_message">
              {hasSearched
                ? "No suggestions found for this search"
                : "Search for a term to see suggestions"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicSearch;
