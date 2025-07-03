"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import "./ClassicSearch.css";

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
      // Add French variants
      Divers: "#8b5cf6",
      متنوعة: "#8b5cf6",
    };
    return colorMap[category] || "#8b5cf6";
  };

  const categoryTranslations = {
    english: {
      "Computer Crime": "Computer Crime",
      "Personal Data": "Personal Data",
      "Electronic Commerce": "Electronic Commerce",
      Organizations: "Organizations",
      Networks: "Networks",
      "Intellectual Property": "Intellectual Property",
      Miscellaneous: "Miscellaneous",
      "Computer Contracts": "Computer Contracts",
      // Add French variants for English
      Divers: "Miscellaneous",
      متنوعة: "Miscellaneous",
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
      // Add variants
      Divers: "Divers",
      متنوعة: "Divers",
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
      // Fix: Add all possible variants that should translate to متنوعة
      Divers: "متنوعة",
      متنوعة: "متنوعة",
      General: "متنوعة",
      general: "متنوعة",
      GENERAL: "متنوعة",
    },
  };

  const getLanguageSpecificCategories = () => {
    const allCategories = Object.keys(
      categoryTranslations[selectedLanguage] || {}
    );
    return allCategories.slice(0, 7);
  };

  // Fix: Updated function to check if category should be hidden
  const shouldHideCategory = (category) => {
    if (!category) return true;

    const normalizedCategory = category.trim();

    // Check for all possible miscellaneous variants
    const miscellaneousVariants = [
      "Miscellaneous",
      "miscellaneous",
      "MISCELLANEOUS",
      "Divers",
      "divers",
      "DIVERS",
      "General",
      "general",
      "GENERAL",
      "متنوعة",
      "",
    ];

    return miscellaneousVariants.includes(normalizedCategory);
  };

  const getCategoryName = (category) => {
    if (!category) return "";

    // Fix: Normalize category and ensure proper translation lookup
    const normalizedCategory = category.trim();

    // First try exact match
    let translatedCategory =
      categoryTranslations[selectedLanguage]?.[normalizedCategory];

    // If no exact match, try case-insensitive search
    if (!translatedCategory) {
      const categoryKeys = Object.keys(
        categoryTranslations[selectedLanguage] || {}
      );
      const matchingKey = categoryKeys.find(
        (key) => key.toLowerCase() === normalizedCategory.toLowerCase()
      );
      if (matchingKey) {
        translatedCategory =
          categoryTranslations[selectedLanguage][matchingKey];
      }
    }

    // Return translated category or original if no translation found
    return translatedCategory || normalizedCategory;
  };

  useEffect(() => {
    let results = [...terms];

    // Fix: Updated search logic to work with your actual data structure
    if (searchInput && searchInput.trim().length > 0) {
      const searchTerm = searchInput.toLowerCase().trim();
      results = results.filter((term) => {
        // Search in term name
        const nameMatch =
          term.name && term.name.toLowerCase().includes(searchTerm);

        // Search in main category
        const categoryMatch =
          term.category && term.category.toLowerCase().includes(searchTerm);

        // Search in categories array
        const categoriesMatch =
          term.categories &&
          term.categories.some(
            (cat) => cat && cat.toLowerCase().includes(searchTerm)
          );

        // Search in translated categories
        const translatedCategoryMatch =
          term.category &&
          getCategoryName(term.category)?.toLowerCase().includes(searchTerm);

        // Search in definition text
        const definitionMatch =
          term.definition && term.definition.toLowerCase().includes(searchTerm);

        // Search in allDefinitions array
        const allDefinitionsMatch =
          term.allDefinitions &&
          term.allDefinitions.some(
            (def) => def.text && def.text.toLowerCase().includes(searchTerm)
          );

        // Search in references
        const referenceMatch =
          term.reference && term.reference.toLowerCase().includes(searchTerm);

        // Search in allDefinitions references
        const allReferencesMatch =
          term.allDefinitions &&
          term.allDefinitions.some(
            (def) =>
              def.references &&
              def.references.toLowerCase().includes(searchTerm)
          );

        return (
          nameMatch ||
          categoryMatch ||
          categoriesMatch ||
          translatedCategoryMatch ||
          definitionMatch ||
          allDefinitionsMatch ||
          referenceMatch ||
          allReferencesMatch
        );
      });

      // Show suggestions when actively searching
      if (searchTerm.length > 1) {
        const searchBasedSuggestions = terms
          .filter((term) => {
            if (results.includes(term)) return false;

            const categoryMatch =
              term.category && term.category.toLowerCase().includes(searchTerm);
            const categoriesMatch =
              term.categories &&
              term.categories.some(
                (cat) => cat && cat.toLowerCase().includes(searchTerm)
              );
            const translatedCategoryMatch = getCategoryName(term.category)
              ?.toLowerCase()
              .includes(searchTerm);

            return categoryMatch || categoriesMatch || translatedCategoryMatch;
          })
          .slice(0, 3);
        setSuggestedTerms(searchBasedSuggestions);
      } else {
        setSuggestedTerms([]);
      }
    } else {
      setSuggestedTerms([]);
    }

    // Filter by active categories - Updated to work with your data structure
    if (activeCategories.length > 0) {
      results = results.filter((term) => {
        // Check main category
        const mainCategoryMatch =
          term.category && activeCategories.includes(term.category);

        // Check categories array
        const categoriesArrayMatch =
          term.categories &&
          term.categories.some((cat) => activeCategories.includes(cat));

        // Check allDefinitions categories
        const allDefinitionsCategoriesMatch =
          term.allDefinitions &&
          term.allDefinitions.some(
            (def) =>
              def.categories &&
              def.categories.some((cat) => activeCategories.includes(cat))
          );

        return (
          mainCategoryMatch ||
          categoriesArrayMatch ||
          allDefinitionsCategoriesMatch
        );
      });
    }

    setFilteredTerms(results);
  }, [searchInput, activeCategories, terms, selectedLanguage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setHasSearched(true);
    if (onSearch) onSearch(searchInput);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    // Fix: Reset visible terms when searching
    setVisibleTerms(6);
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
    <div className="terms-classic-search-container">
      <div className="terms-classic-search-header">
        <h3 className="terms-classic-search-title">Digital Terms Search</h3>
        <form
          onSubmit={handleSearchSubmit}
          className="terms-classic-search-input-wrapper"
        >
          <Search size={18} className="terms-classic-search-icon" />
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Search digital terms..."
            className="terms-classic-search-input"
          />
          <button
            type="submit"
            className="terms-classic-search-button"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Search
          </button>
        </form>
      </div>

      <div className="terms-classic-search-filters">
        <div className="terms-classic-search-categories">
          <h4>Categories</h4>
          <div className="terms-classic-search-category-buttons">
            {languageCategories.map((category, index) => (
              <button
                key={index}
                className={`terms-classic-search-category-button ${
                  activeCategories.includes(category) ? "active" : ""
                }`}
                onClick={() => handleCategoryToggle(category)}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="terms-classic-search-content">
        <div className="terms-classic-search-results-header">
          <h4>Terms</h4>
          <span className="terms-classic-search-results-count">
            {filteredTerms.length} terms found
          </span>
        </div>
        <div className="terms-classic-search-results-list">
          {filteredTerms.slice(0, visibleTerms).map((term, index) => {
            // Updated to work with your data structure
            const primaryCategory =
              term.category ||
              (term.categories && term.categories[0]) ||
              "Miscellaneous";
            const primaryDefinition =
              term.definition || "No definition available";
            const references = term.reference ? [term.reference] : [];

            return (
              <div
                key={index}
                className="terms-classic-search-term-card"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
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
                <div className="terms-classic-search-term-header">
                  <div className="terms-classic-search-term-title">
                    <h5>{term.name}</h5>
                    {/* Fix: Only show category if it's not Miscellaneous */}
                    {!shouldHideCategory(primaryCategory) && (
                      <span className="terms-classic-search-term-category">
                        {getCategoryName(primaryCategory)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="terms-classic-search-term-content">
                  <div className="terms-classic-search-term-definition">
                    <h6>Primary Legal Provision</h6>
                    <p>{primaryDefinition}</p>
                  </div>
                  {references && references.length > 0 && (
                    <div className="terms-classic-search-term-references">
                      <h6>Legal References</h6>
                      {references.map((ref, refIndex) => (
                        <span
                          key={refIndex}
                          className="terms-classic-search-term-reference"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="terms-classic-search-save-button"
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
                  Add to Library
                </button>
              </div>
            );
          })}
        </div>
        {filteredTerms.length > visibleTerms && (
          <button
            className="terms-classic-search-show-more"
            onClick={handleShowMore}
          >
            Show More Terms
          </button>
        )}
      </div>
    </div>
  );
};

export default ClassicSearch;
  