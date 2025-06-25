
import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";

const ClassicSearch = ({ terms, onSearch, onTermSelect, selectedLanguage }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredTerms, setFilteredTerms] = useState(terms);
  const [activeCategories, setActiveCategories] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [suggestedTerms, setSuggestedTerms] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [visibleTerms, setVisibleTerms] = useState(6);

  const getCategoryColor = (category) => {
    const colorMap = {
      "Computer Crime": "#e879f9",
      "Personal Data": "#9333ea",
      "Electronic Commerce": "#c026d3",
      Organizations: "#8b5cf6",
      Networks: "#6366f1",
      "Intellectual Property": "#c084fc",
      Miscellaneous: "#8b5cf6",
      "Computer Contracts": "#a78bfa",
    };
    return colorMap[category] || "#8b5cf6";
  };

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

  const getLanguageSpecificCategories = () => {
    const allCategories = Object.keys(
      categoryTranslations[selectedLanguage] || {}
    );
    return allCategories.slice(0, 7);
  };

  useEffect(() => {
    let results = [...terms];

    if (searchInput && hasSearched) {
      results = results.filter(
        (term) =>
          term.name &&
          term.name.toLowerCase().includes(searchInput.toLowerCase())
      );

      const searchBasedSuggestions = terms
        .filter(
          (term) =>
            !results.includes(term) &&
            ((term.category &&
              term.category
                .toLowerCase()
                .includes(searchInput.toLowerCase())) ||
              (term.categories &&
                term.categories.some(
                  (cat) =>
                    cat &&
                    cat.type &&
                    cat.type.toLowerCase().includes(searchInput.toLowerCase())
                )))
        )
        .slice(0, 3);

      setSuggestedTerms(searchBasedSuggestions);
    } else {
      setSuggestedTerms([]);
    }

  
    if (activeCategories.length > 0) {
      results = results.filter((term) => {
        if (term.categories && term.categories.length > 0) {
          return term.categories.some(
            (cat) => cat && cat.type && activeCategories.includes(cat.type)
          );
        }
        return term.category && activeCategories.includes(term.category);
      });
    }

    setFilteredTerms(results);
  }, [searchInput, activeCategories, terms, selectedLanguage, hasSearched]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    if (onSearch) onSearch(searchInput);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);

    if (e.target.value.length > 1) {
      const autocompleteSuggestions = terms
        .filter(
          (term) =>
            (term.name &&
              term.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
            (term.category &&
              term.category
                .toLowerCase()
                .includes(e.target.value.toLowerCase())) ||
            (term.categories &&
              term.categories.some(
                (cat) =>
                  cat &&
                  cat.type &&
                  cat.type.toLowerCase().includes(e.target.value.toLowerCase())
              ))
        )
        .slice(0, 5);

      setSuggestedTerms(autocompleteSuggestions);
      setHasSearched(true);
    } else if (e.target.value === "") {
      setSuggestedTerms([]);
      setHasSearched(false);
    }
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


  const languageCategories = useMemo(() => {
    return getLanguageSpecificCategories();
  }, [selectedLanguage]);


  const getCategoryName = (category) => {
    return categoryTranslations[selectedLanguage][category] || category;
  };

  const handleShowMore = () => {
    setVisibleTerms((prev) => prev + 6);
  };

  const handleTermSelect = (term) => {
    if (onTermSelect) {
 
      try {
        const savedTerms = JSON.parse(
          localStorage.getItem("savedTerms") || "[]"
        );
        const termExists = savedTerms.some(
          (t) => t.id === term.id || t.name === term.name
        );

        if (!termExists) {
          savedTerms.push({
            ...term,
            savedAt: new Date().toISOString(),
            source: "classic",
          });
          localStorage.setItem("savedTerms", JSON.stringify(savedTerms));
        }
      } catch (error) {
        console.error("Error saving term to localStorage:", error);
      }

      onTermSelect(term);
    }
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
            const categories = term.categories
              ? term.categories.map((cat) => cat.type)
              : term.category
              ? [term.category]
              : [];

            const primaryCategory = categories[0] || "Miscellaneous";

            const primaryDefinition =
              term.definition ||
              (term.categories &&
                term.categories[0] &&
                term.categories[0].principale &&
                term.categories[0].principale[0] &&
                term.categories[0].principale[0].definition_principale &&
                term.categories[0].principale[0].definition_principale[0]) ||
              "No definition available";

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
                
                    try {
                      const savedTerms = JSON.parse(
                        localStorage.getItem("savedTerms") || "[]"
                      );
                      const termExists = savedTerms.some(
                        (t) => t.id === term.id || t.name === term.name
                      );

                      if (!termExists) {
                        savedTerms.push({
                          ...term,
                          savedAt: new Date().toISOString(),
                          source: "classic",
                        });
                        localStorage.setItem(
                          "savedTerms",
                          JSON.stringify(savedTerms)
                        );
                        console.log(`Term saved: ${term.name}`);
                      }
                    } catch (error) {
                      console.error(
                        "Error saving term to localStorage:",
                        error
                      );
                    }
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
