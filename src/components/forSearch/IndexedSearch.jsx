"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const IndexedSearch = ({ language = "english", onTermSelect, terms = [] }) => {
  const [searchInput, setSearchInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [indexedTerms, setIndexedTerms] = useState({});
  const [suggestedTerms, setSuggestedTerms] = useState([]);
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const [hoveredTerm, setHoveredTerm] = useState(null);
  const [searchedTerm, setSearchedTerm] = useState("");
  const [visibleTerms, setVisibleTerms] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define alphabet for index
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Function to get color for a category - purple-themed colors
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

  // Get category name based on selected language
  const getCategoryName = (category) => {
    return categoryTranslations[language]?.[category] || category;
  };

  // Organiser les termes par lettre initiale en utilisant les termes de l'API
  useEffect(() => {
    if (terms && terms.length > 0) {
      const organizedTerms = {};

      // Initialiser toutes les lettres de l'alphabet
      alphabet.forEach((letter) => {
        organizedTerms[letter] = [];
      });

      // Organiser les termes par lettre initiale
      terms.forEach((term) => {
        const firstLetter = term.name.charAt(0).toUpperCase();
        if (alphabet.includes(firstLetter)) {
          organizedTerms[firstLetter].push(term);
        }
      });

      setIndexedTerms(organizedTerms);

      // Définir la première lettre avec des termes comme active
      const firstLetterWithTerms = alphabet.find(
        (letter) => organizedTerms[letter].length > 0
      );
      if (firstLetterWithTerms && !activeIndex) {
        setActiveIndex(firstLetterWithTerms);
      }

      // Générer des termes suggérés
      const allTerms = terms;
      const randomTerms = [...allTerms]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      setSuggestedTerms(randomTerms);
    }
  }, [terms, language]);

  // Filter terms based on search input
  const getFilteredTerms = () => {
    if (!activeIndex || !indexedTerms[activeIndex]) return [];

    if (!searchInput) return indexedTerms[activeIndex];

    return indexedTerms[activeIndex].filter(
      (term) =>
        term.name && term.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  // Update the search functionality to include autocomplete
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);

    // Generate suggestions as user types (autocomplete)
    if (e.target.value.length > 1) {
      const allTerms = Object.values(indexedTerms).flat();
      const autocompleteSuggestions = allTerms
        .filter(
          (term) =>
            (term.name &&
              term.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
            (term.category &&
              term.category
                .toLowerCase()
                .includes(e.target.value.toLowerCase()))
        )
        .slice(0, 5);

      setSuggestedTerms(autocompleteSuggestions);
    } else if (e.target.value === "") {
      setSuggestedTerms([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchedTerm(searchInput);

    // Generate suggested terms based on search
    if (searchInput) {
      const allTerms = Object.values(indexedTerms).flat();
      const relatedTerms = allTerms
        .filter(
          (term) =>
            (term.name &&
              term.name.toLowerCase().includes(searchInput.toLowerCase())) ||
            (term.category &&
              term.category.toLowerCase().includes(searchInput.toLowerCase()))
        )
        .slice(0, 5);

      setSuggestedTerms(relatedTerms);
    }
  };

  const handleIndexClick = (index) => {
    setActiveIndex(index);
    setSearchInput("");
    setVisibleTerms(6);
  };

  const handleShowMore = () => {
    setVisibleTerms((prev) => prev + 6);
  };

  // Modifiez la fonction handleTermSelect pour sauvegarder dans localStorage
  const handleTermSelect = (term) => {
    if (onTermSelect) {
      // Sauvegarder dans localStorage avant de passer au parent
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
            source: "indexed",
          });
          localStorage.setItem("savedTerms", JSON.stringify(savedTerms));
        }
      } catch (error) {
        console.error("Error saving term to localStorage:", error);
      }

      onTermSelect(term);
    }
  };

  const filteredTerms = getFilteredTerms();
  const displayedTerms = filteredTerms.slice(0, visibleTerms);

  return (
    <div className="_terms_indexed_search_container">
      <div className="_terms_indexed_search_header">
        <h3 className="_terms_indexed_search_title">Digital Terms Index</h3>
        <form
          onSubmit={handleSearchSubmit}
          className="_terms_indexed_search_input_wrapper"
        >
          <Search size={18} className="_terms_indexed_search_icon" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Filter digital terms..."
            className="_terms_indexed_search_input"
          />
        </form>
      </div>

      <div className="_terms_indexed_search_alphabet">
        {Object.keys(indexedTerms).map((letter) => (
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
          </button>
        ))}
      </div>

      <div className="_terms_indexed_search_content">
        <div className="_terms_indexed_search_results_header">
          <h4>{activeIndex ? `Terms - ${activeIndex}` : "Select an index"}</h4>
          <span className="_terms_indexed_search_results_count">
            {filteredTerms.length} terms found
          </span>
        </div>

        <div className="_terms_indexed_search_results_list">
          {displayedTerms.map((term, index) => {
            const categoryColor = getCategoryColor(
              term.category || "Miscellaneous"
            );
            return (
              <div
                key={index}
                className="_terms_indexed_search_term_item"
                onClick={() => handleTermSelect(term)}
                style={{
                  "--term-color": categoryColor,
                  backgroundColor: `rgba(${categoryColor
                    .replace("#", "")
                    .match(/.{2}/g)
                    .map((x) => Number.parseInt(x, 16))
                    .join(", ")}, 0.05)`,
                }}
                onMouseEnter={() => setHoveredTerm(index)}
                onMouseLeave={() => setHoveredTerm(null)}
              >
                <div className="_terms_indexed_search_term_header">
                  <h5>{term.name}</h5>
                </div>
                <span
                  className="_terms_indexed_search_term_category"
                  style={{
                    backgroundColor: `rgba(${categoryColor
                      .replace("#", "")
                      .match(/.{2}/g)
                      .map((x) => Number.parseInt(x, 16))
                      .join(", ")}, 0.4)`,
                    color: categoryColor,
                  }}
                >
                  {getCategoryName(term.category || "Miscellaneous")}
                </span>
              </div>
            );
          })}

          {filteredTerms.length === 0 && (
            <div className="_terms_indexed_search_no_results">
              <p>No terms found for this criteria.</p>
            </div>
          )}
        </div>

        {filteredTerms.length > visibleTerms && (
          <button
            className="_terms_indexed_search_show_all"
            onClick={handleShowMore}
          >
            Show More Terms
          </button>
        )}
      </div>

      <div className="_terms_search_suggested">
        <h3 className="_terms_search_suggested_title">Suggested Terms</h3>
        <div className="_terms_search_suggested_list">
          {suggestedTerms.length > 0 ? (
            suggestedTerms.map((term, index) => {
              const category = term.category || "Miscellaneous";
              const categoryColor = getCategoryColor(category);
              return (
                <div
                  key={index}
                  className="_terms_search_suggested_item"
                  onClick={() => handleTermSelect(term)}
                  style={{
                    "--suggestion-color": categoryColor,
                  }}
                >
                  <span className="_terms_search_suggested_name">
                    {term.name}
                  </span>
                  <span
                    className="_terms_search_suggested_category"
                    style={{
                      backgroundColor: `rgba(${categoryColor
                        .replace("#", "")
                        .match(/.{2}/g)
                        .map((x) => Number.parseInt(x, 16))
                        .join(", ")}, 0.2)`,
                      color: categoryColor,
                    }}
                  >
                    {getCategoryName(category)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="_terms_search_empty_message">
              Search for a term to see suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexedSearch;
