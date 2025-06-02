import { useState, useEffect } from "react";
import { X, Hash } from "lucide-react";
import ClassicSearch from "../components/forSearch/ClassicSearch";
import IndexedSearch from "../components/forSearch/IndexedSearch";
import { getAllterms } from "../services/Api";
import "./SearchPage.css";

 
const initialTermsData = [];

const SearchPage = () => {
  const [searchType, setSearchType] = useState("classic");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [relatedTerms, setRelatedTerms] = useState([]);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [termsData, setTermsData] = useState(initialTermsData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedTerms, setDisplayedTerms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [suggestedTerms, setSuggestedTerms] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const ITEMS_PER_PAGE = 8;

   
  const getLanguageCode = (languageName) => {
    switch (languageName) {
      case "english":
        return "en";
      case "french":
        return "fr";
      case "arabic":
        return "ar";
      default:
        return "en";
    }
  };

   
  const termStorage = {
    saveTerm: (term) => {
      try {
        const savedTerms = termStorage.getSavedTerms();
        const termExists = savedTerms.find(
          (t) => t.id === term.id || t.name === term.name
        );

        if (!termExists) {
          const updatedTerms = [
            ...savedTerms,
            {
              ...term,
              savedAt: new Date().toISOString(),
              source: "search",
            },
          ];
          localStorage.setItem("savedTerms", JSON.stringify(updatedTerms));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error saving term:", error);
        return false;
      }
    },

    getSavedTerms: () => {
      try {
        const saved = localStorage.getItem("savedTerms");
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error("Error getting saved terms:", error);
        return [];
      }
    },

    isTermSaved: (termId) => {
      const savedTerms = termStorage.getSavedTerms();
      return savedTerms.some((t) => t.id === termId || t.name === termId);
    },
  };

   
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setUsingFallbackData(false);

        const languageCode = getLanguageCode(selectedLanguage);
        const data = await getAllterms(languageCode);

        if (
          data &&
          data.length > 0 &&
          data[0].id === "36" &&
          data[0].name === "APPZ"
        ) {
          setUsingFallbackData(true);
        }

        if (!data || data.length === 0) {
          throw new Error("No data received from the API");
        }

         
        const transformedData = data.map((term) => {
          const validRelatedTerms =
            term.definitions && term.definitions[0]?.relatedTerms
              ? term.definitions[0].relatedTerms.filter(
                  (rt) => rt && rt.name && rt.id && rt.id !== "null"
                )
              : [];

          return {
            id: term.id || "",
            name: term.name || "",
             
            allDefinitions: term.definitions || [],
             
            categories:
              term.definitions && term.definitions[0]?.categories
                ? term.definitions[0].categories
                : null,
             
            category:
              (term.definitions &&
                term.definitions[0]?.categories &&
                term.definitions[0]?.categories[0]) ||
              "Divers",
            definition:
              (term.definitions && term.definitions[0]?.text) ||
              "No definition available",
            reference:
              (term.definitions && term.definitions[0]?.references) || "",
             
            relatedTerms: validRelatedTerms,
          };
        });

        setTermsData(transformedData);
        setDisplayedTerms(transformedData.slice(0, ITEMS_PER_PAGE));
        setHasMore(transformedData.length > ITEMS_PER_PAGE);
        setCurrentPage(1);
        setFilteredTerms(transformedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch terms:", err);
        setError(
          `Failed to load terms data: ${err.message}. Please try again later.`
        );
        setIsLoading(false);
        setTermsData([]);
        setDisplayedTerms([]);
        setFilteredTerms([]);
        setHasMore(false);
      }
    };

    fetchTerms();
  }, [selectedLanguage]);

   
  const handleTermSelect = (term) => {
    setSelectedTerm(term);
    setIsSaved(termStorage.isTermSaved(term.id || term.name));
    setExpandedSections({});

     
    let related = [];

    if (term.relatedTerms && term.relatedTerms.length > 0) {
      related = term.relatedTerms
        .map((relatedTerm) => {
          if (
            !relatedTerm.name ||
            !relatedTerm.id ||
            relatedTerm.id === "null"
          ) {
            return null;
          }
          const fullTerm = termsData.find(
            (t) => t.id === relatedTerm.id || t.name === relatedTerm.name
          );
          return fullTerm || null;
        })
        .filter(Boolean)
        .slice(0, 4);
    }

    if (related.length === 0) {
      const termCategory =
        term.category ||
        (term.allDefinitions &&
        term.allDefinitions.length > 0 &&
        term.allDefinitions[0].categories
          ? term.allDefinitions[0].categories[0]
          : "Divers");

      related = termsData
        .filter((t) => {
          const tCategory =
            t.category ||
            (t.allDefinitions &&
            t.allDefinitions.length > 0 &&
            t.allDefinitions[0].categories
              ? t.allDefinitions[0].categories[0]
              : "Divers");
          return tCategory === termCategory && t.name !== term.name;
        })
        .slice(0, 4);
    }

    setRelatedTerms(related);

    if (searchQuery) {
      const suggested = termsData
        .filter(
          (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            t.name !== term.name &&
            !related.some((r) => r.name === t.name)
        )
        .slice(0, 4);
      setSuggestedTerms(suggested);
    } else {
      const randomTerms = [...termsData]
        .filter(
          (t) => t.name !== term.name && !related.some((r) => r.name === t.name)
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      setSuggestedTerms(randomTerms);
    }
  };

   
  const handleSaveTerm = () => {
    if (selectedTerm) {
      const success = termStorage.saveTerm(selectedTerm);
      if (success) {
        setIsSaved(true);
      }
    }
  };

  const closeTermDetails = () => {
    setSelectedTerm(null);
  };

   
  const getCategoryColor = (category) => {
    const colorMap = {
      "Computer Science": "#8b5cf6",
      Networks: "#6366f1",
      "Software Development": "#a855f7",
      "Data Management": "#d946ef",
      Cybersecurity: "#ec4899",
      "Données personnelles": "#9333ea",
      "Commerce électronique": "#c026d3",
      Réseaux: "#7c3aed",
      "Criminalité informatique": "#e879f9",
      Divers: "#8b5cf6",
      "Contrat Informatique": "#a78bfa",
      "Propriété intellectuelle": "#c084fc",
      Organisations: "#8b5cf6",
    };
    return colorMap[category] || "#8b5cf6";
  };

   
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectedTerm &&
        event.target.classList.contains("_terms_term_details_overlay")
      ) {
        closeTermDetails();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedTerm]);

   
  useEffect(() => {
    if (selectedTerm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedTerm]);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  return (
    <div className="_terms_search_page">
      <div className="_terms_search_page_content">
        <div className="_terms_search_page_header">
          <h1 className="_terms_search_page_title">Knowledge Graph</h1>
          <p className="_terms_search_page_subtitle">
            Explore terms and concepts powered by Neo4j graph technology
          </p>
        </div>

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

        <div className="_terms_search_page_type_selector">
          <button
            className={`_terms_search_page_type_btn ${
              searchType === "classic" ? "active" : ""
            }`}
            onClick={() => setSearchType("classic")}
          >
            <span>Classic Search</span>
          </button>
          <button
            className={`_terms_search_page_type_btn ${
              searchType === "indexed" ? "active" : ""
            }`}
            onClick={() => setSearchType("indexed")}
          >
            <span>Indexed Search</span>
          </button>
        </div>

        {searchType === "classic" && (
          <ClassicSearch
            terms={termsData}
            onTermSelect={handleTermSelect}
            selectedLanguage={selectedLanguage}
          />
        )}

        {searchType === "indexed" && (
          <IndexedSearch
            language={selectedLanguage}
            onTermSelect={handleTermSelect}
            terms={termsData}
          />
        )}
      </div>

      {/* Term Details Modal - Updated to show ALL categories and definitions */}
      {selectedTerm && (
        <div className="_terms_term_details_overlay">
          <div className="_terms_term_details_modal">
            <div className="_terms_term_details_header">
              <div className="_terms_term_details_title_wrapper">
                <h2>{selectedTerm.name}</h2>
              </div>
              <button
                className="_terms_term_details_close_button"
                onClick={closeTermDetails}
              >
                <X size={24} />
              </button>
            </div>
            <div className="_terms_term_details_content">
              {/* Display ALL definitions from allDefinitions array */}
              {selectedTerm.allDefinitions &&
              selectedTerm.allDefinitions.length > 0 ? (
                selectedTerm.allDefinitions.map((definition, defIndex) => (
                  <div key={defIndex} className="_terms_term_category_section">
                    <div
                      className="_terms_term_category_header"
                      style={{
                        "--category-color": getCategoryColor(
                          definition.categories?.[0] || "Divers"
                        ),
                      }}
                    >
                      <h3>{definition.categories?.[0] || "General"}</h3>
                    </div>
                    <div className="_terms_term_category_content">
                      {/* Primary definition */}
                      <div className="_terms_term_definition_section">
                        <h4>Definition</h4>
                        <div className="_terms_term_definition_block">
                          <p className="_terms_term_definition_text">
                            {definition.text}
                          </p>
                          {definition.references && (
                            <div className="_terms_term_references">
                              <h5>References</h5>
                              <div className="_terms_term_reference_item">
                                <span>{definition.references}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : selectedTerm.categories &&
                selectedTerm.categories.length > 0 ? (
                 
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
                      {category.principale &&
                        category.principale.length > 0 && (
                          <div className="_terms_term_definition_section">
                            <h4>Primary Definition</h4>
                            {category.principale.map((def, defIndex) => (
                              <div
                                key={defIndex}
                                className="_terms_term_definition_block"
                              >
                                {def.definition_principale &&
                                  def.definition_principale.map(
                                    (text, textIndex) => (
                                      <p
                                        key={textIndex}
                                        className="_terms_term_definition_text"
                                      >
                                        {text}
                                      </p>
                                    )
                                  )}
                                {def.references &&
                                  def.references.length > 0 && (
                                    <div className="_terms_term_references">
                                      <h5>References</h5>
                                      <ul className="_terms_term_references_list">
                                        {def.references.map((ref, refIndex) => (
                                          <li
                                            key={refIndex}
                                            className="_terms_term_reference_item"
                                          >
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
                      {category.secondaire &&
                        category.secondaire.length > 0 && (
                          <div className="_terms_term_definition_section _terms_term_secondary">
                            <h4>Secondary Definition</h4>
                            {category.secondaire.map((def, defIndex) => (
                              <div
                                key={defIndex}
                                className="_terms_term_definition_block"
                              >
                                {def.definition_secondaire &&
                                  def.definition_secondaire.map(
                                    (text, textIndex) => (
                                      <p
                                        key={textIndex}
                                        className="_terms_term_definition_text"
                                      >
                                        {text}
                                      </p>
                                    )
                                  )}
                                {def.reference_secondaires &&
                                  def.reference_secondaires.length > 0 && (
                                    <div className="_terms_term_references">
                                      <h5>References</h5>
                                      <ul className="_terms_term_references_list">
                                        {def.reference_secondaires.map(
                                          (ref, refIndex) => (
                                            <li
                                              key={refIndex}
                                              className="_terms_term_reference_item"
                                            >
                                              <span>{ref}</span>
                                            </li>
                                          )
                                        )}
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
                 
                <div className="_terms_term_simple_details">
                  <div
                    className="_terms_term_category_header"
                    style={{
                      "--category-color": getCategoryColor(
                        selectedTerm.category
                      ),
                    }}
                  >
                    <h3>{selectedTerm.category}</h3>
                  </div>
                  <div className="_terms_term_definition_section">
                    <p className="_terms_term_definition_text">
                      {selectedTerm.definition}
                    </p>
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
                              (relation.categories &&
                              relation.categories.length > 0
                                ? relation.categories[0].type
                                : "Divers")
                          ),
                        }}
                      >
                        <span className="_terms_term_relation_name">
                          {relation.name}
                        </span>
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
                onClick={handleSaveTerm}
                disabled={isSaved}
                style={{
                  opacity: isSaved ? 0.6 : 1,
                  cursor: isSaved ? "not-allowed" : "pointer",
                }}
              >
                <span>{isSaved ? "Saved to Library" : "Add to Library"}</span>
                <div className="_terms_term_add_library_icon">
                  <Hash
                    size={16}
                    className={isButtonHovered ? "visible" : ""}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
