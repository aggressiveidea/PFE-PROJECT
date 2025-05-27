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


const SearchPage = () => {
  const [searchType, setSearchType] = useState("classic");
  const [selectedLanguage, setSelectedLanguage] = useState("fr"); // Default to French as per your backend
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [relatedTerms, setRelatedTerms] = useState([]);
  const [suggestedTerms, setSuggestedTerms] = useState([]);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [termsData, setTermsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [darkMode, setDarkMode] = useState(false);
  const [displayedTerms, setDisplayedTerms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 8;
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark-mode");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  };

  // Fetch terms data from API
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset any previous errors
        setUsingFallbackData(false);

        const data = await getAllterms(selectedLanguage);

        // Check if we're using fallback data
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

        // Transform the data to match the expected format
        const transformedData = data.map((term) => {
          // Filter out invalid related terms (where name or id is null)
          const validRelatedTerms =
            term.definitions && term.definitions[0]?.relatedTerms
              ? term.definitions[0].relatedTerms.filter(
                  (rt) => rt.name !== null && rt.id !== null && rt.id !== "null"
                )
              : [];

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
              (term.definitions &&
                term.definitions[0]?.categories &&
                term.definitions[0]?.categories[0]) ||
              "Divers",
            definition:
              (term.definitions && term.definitions[0]?.text) ||
              "No definition available",
            reference:
              (term.definitions && term.definitions[0]?.references) || "",
            // Store related terms if available
            relatedTerms: validRelatedTerms,
          };
        });

        setTermsData(transformedData);

        // Initialize displayed terms with first page
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

        // Reset data states on error
        setTermsData([]);
        setDisplayedTerms([]);
        setFilteredTerms([]);
        setHasMore(false);
      }
    };

    fetchTerms();
  }, [selectedLanguage]);

  // Load more terms
  const loadMoreTerms = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newTerms = termsData.slice(startIndex, endIndex);

    setDisplayedTerms((prev) => [...prev, ...newTerms]);
    setCurrentPage(nextPage);
    setHasMore(endIndex < termsData.length);
  };

  // Update the handleTermSelect function to work with the new data structure and find related terms
  const handleTermSelect = (term) => {
    setSelectedTerm(term);

    // Reset expanded sections state
    setExpandedSections({});

    // Find related terms based on the relatedTerms array from the API
    let related = [];

    // First check if the term has related terms from the API
    if (term.relatedTerms && term.relatedTerms.length > 0) {
      // Find the full term objects for the related terms
      related = term.relatedTerms
        .map((relatedTerm) => {
          // Skip invalid related terms
          if (
            !relatedTerm.name ||
            !relatedTerm.id ||
            relatedTerm.id === "null"
          ) {
            return null;
          }

          // Try to find by ID first, then by name
          const fullTerm = termsData.find(
            (t) => t.id === relatedTerm.id || t.name === relatedTerm.name
          );
          return fullTerm || null;
        })
        .filter(Boolean)
        .slice(0, 4);
    }

    // If no related terms from API, find by category
    if (related.length === 0) {
      // Get the term's category or first category from definitions
      const termCategory =
        term.category ||
        (term.allDefinitions &&
        term.allDefinitions.length > 0 &&
        term.allDefinitions[0].categories
          ? term.allDefinitions[0].categories[0]
          : "Divers");

      // Find terms with the same category
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

    // Find suggested terms based on search query
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
      // If no search query, show random terms
      const randomTerms = [...termsData]
        .filter(
          (t) => t.name !== term.name && !related.some((r) => r.name === t.name)
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

      setSuggestedTerms(randomTerms);
    }
  };

  const closeTermDetails = () => {
    setSelectedTerm(null);
  };

  // Function to toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Function to get color for a category - purple-themed colors
  const getCategoryColor = (category) => {
    if (!category) return "#8b5cf6"; // Default violet if category is undefined

    const colorMap = {
      "Computer Science": "#8b5cf6", // Violet
      Networks: "#6366f1", // Indigo
      "Software Development": "#a855f7", // Purple
      "Data Management": "#d946ef", // Fuchsia
      Cybersecurity: "#ec4899", // Pink
      "Computer Crime": "#e879f9", // Pink
      "Données personnelles": "#9333ea", // Purple
      "Commerce électronique": "#c026d3", // Fuchsia
      "Electronic Commerce": "#c026d3", // Fuchsia
      Réseaux: "#7c3aed", // Violet
      "Criminalité informatique": "#e879f9", // Pink
      Divers: "#8b5cf6", // Violet
      "Contrat Informatique": "#a78bfa", // Violet
      "Propriété intellectuelle": "#c084fc", // Purple
      Organisations: "#8b5cf6", // Violet
    };
    return colorMap[category] || "#8b5cf6"; // Default violet
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    if (!category) return <BookOpen size={20} />; // Default icon if category is undefined

    const icons = {
      "Computer Science": <Cpu size={20} />,
      Networks: <Server size={20} />,
      "Software Development": <Code size={20} />,
      "Data Management": <Database size={20} />,
      Cybersecurity: <Shield size={20} />,
      "Computer Crime": <Shield size={20} />,
      "Données personnelles": <BookOpen size={20} />,
      "Commerce électronique": <Zap size={20} />,
      "Electronic Commerce": <Zap size={20} />,
      Réseaux: <Server size={20} />,
      "Criminalité informatique": <Shield size={20} />,
      Divers: <BookOpen size={20} />,
      "Contrat Informatique": <Code size={20} />,
      "Propriété intellectuelle": <BookOpen size={20} />,
      Organisations: <Database size={20} />,
    };
    return icons[category] || <BookOpen size={20} />;
  };

  // Close modal when clicking outside
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

  // Prevent scrolling when modal is open
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

  // Update the handleLanguageChange function
  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    setSearchQuery("");
    setSelectedTerm(null);
  };

  // Handle search query change
  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
  };

  // Toggle view mode
  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Add this function after the handleSearchQueryChange function
  const renderSuggestedTermsForSearch = () => {
    if (!searchQuery || !termsData.length) return null;

    // Find terms that match the search query but aren't in the current filtered results
    const suggestedSearchTerms = termsData
      .filter(
        (term) =>
          term.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !filteredTerms.some((ft) => ft.id === term.id)
      )
      .slice(0, 4);

    if (suggestedSearchTerms.length === 0) return null;

    return (
      <div
        className="_terms_suggested_terms_container"
        style={{
          position: "relative",
          bottom: "auto",
          right: "auto",
          width: "100%",
          marginTop: "30px",
        }}
      >
        <div className="_terms_suggested_terms_header">
          <h3>
            <Sparkles
              size={20}
              className="_terms_suggested_terms_icon"
              style={{ color: "#8b5cf6" }}
            />
            Suggested Laws
          </h3>
          <p>Based on your search for "{searchQuery}"</p>
        </div>
        <div className="_terms_suggested_terms_list">
          {suggestedSearchTerms.map((suggestion, index) => {
            const category = suggestion.category || "Divers";
            return (
              <div
                key={index}
                className="_terms_suggested_term_item"
                onClick={() => handleTermSelect(suggestion)}
                style={{
                  "--suggestion-color": getCategoryColor(category),
                }}
              >
                <div className="_terms_suggestion_glow"></div>
                {getCategoryIcon(category)}
                <div className="_terms_suggested_term_content">
                  <h4>{suggestion.name}</h4>
                  <div className="_terms_suggested_term_categories">
                    {suggestion.allDefinitions &&
                    suggestion.allDefinitions.length > 0 &&
                    suggestion.allDefinitions[0].categories ? (
                      [
                        ...new Set(
                          suggestion.allDefinitions.flatMap(
                            (def) => def.categories || []
                          )
                        ),
                      ].map((category, catIndex) => (
                        <span
                          key={catIndex}
                          className="_terms_suggested_term_category"
                          style={{
                            backgroundColor: `${getCategoryColor(category)}20`,
                            color: getCategoryColor(category),
                          }}
                        >
                          {category}
                        </span>
                      ))
                    ) : (
                      <span
                        className="_terms_suggested_term_category"
                        style={{
                          backgroundColor: `${getCategoryColor(category)}20`,
                          color: getCategoryColor(category),
                        }}
                      >
                        {category}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="_terms_suggested_term_button"
                  style={{
                    backgroundColor: getCategoryColor(category),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Adding ${suggestion.name} to library`);
                  }}
                >
                  <Hash size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`search-page ${darkMode ? "dark-mode" : ""}`}>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="_terms_search_page">
            <div className="_terms_search_page_content">
              <div className="_terms_search_page_header">
                <div className="_terms_search_page_header_glow"></div>
                <h1
                  className="_terms_search_page_title"
                  style={{ color: "#8b5cf6" }}
                >
                  <Sparkles
                    size={28}
                    className="_terms_search_page_title_icon"
                  />
                  Digital Law Dictionary
                </h1>
                <p className="_terms_search_page_subtitle">
                  Explore the world of digital laws and regulations with our
                  interactive knowledge graph
                </p>

                {/* Dark mode toggle and language selector */}
                <div className="_terms_search_page_controls">
                  <button
                    className="_terms_dark_mode_toggle"
                    onClick={toggleDarkMode}
                    aria-label={
                      darkMode ? "Switch to light mode" : "Switch to dark mode"
                    }
                  >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>

                  <div className="_terms_language_selector">
                    <button
                      className={`_terms_language_btn ${
                        selectedLanguage === "en" ? "active" : ""
                      }`}
                      onClick={() => handleLanguageChange("en")}
                      style={{
                        backgroundColor:
                          selectedLanguage === "en"
                            ? "#8b5cf6"
                            : "rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <Globe size={16} />
                      <span>EN</span>
                    </button>
                    <button
                      className={`_terms_language_btn ${
                        selectedLanguage === "fr" ? "active" : ""
                      }`}
                      onClick={() => handleLanguageChange("fr")}
                      style={{
                        backgroundColor:
                          selectedLanguage === "fr"
                            ? "#8b5cf6"
                            : "rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <Globe size={16} />
                      <span>FR</span>
                    </button>
                    <button
                      className={`_terms_language_btn ${
                        selectedLanguage === "ar" ? "active" : ""
                      }`}
                      onClick={() => handleLanguageChange("ar")}
                      style={{
                        backgroundColor:
                          selectedLanguage === "ar"
                            ? "#8b5cf6"
                            : "rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <Globe size={16} />
                      <span>AR</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="_terms_search_page_type_selector">
                <button
                  className={`_terms_search_page_type_btn ${
                    searchType === "classic" ? "active" : ""
                  }`}
                  onClick={() => setSearchType("classic")}
                >
                  <Database size={18} />
                  <span>Law Explorer</span>
                  <div className="_terms_btn_glow"></div>
                </button>
                <button
                  className={`_terms_search_page_type_btn ${
                    searchType === "indexed" ? "active" : ""
                  }`}
                  onClick={() => setSearchType("indexed")}
                >
                  <Code size={18} />
                  <span>Legal Index</span>
                  <div className="_terms_btn_glow"></div>
                </button>

                <div className="_terms_view_toggle">
                  <button
                    className={`_terms_view_toggle_btn ${
                      viewMode === "card" ? "active" : ""
                    }`}
                    onClick={() => toggleViewMode("card")}
                    title="Card View"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    className={`_terms_view_toggle_btn ${
                      viewMode === "list" ? "active" : ""
                    }`}
                    onClick={() => toggleViewMode("list")}
                    title="List View"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div
                  className="_terms_loading"
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "16px",
                    padding: "40px",
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
                  className="_terms_error"
                  style={{
                    margin: "20px 0",
                    background: "rgba(254, 226, 226, 0.5)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(248, 113, 113, 0.5)",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <p>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="_terms_retry_button"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {searchType === "classic" && (
                    <>
                      <ClassicSearch
                        terms={displayedTerms}
                        allTerms={termsData}
                        onTermSelect={handleTermSelect}
                        onSearchChange={handleSearchQueryChange}
                        viewMode={viewMode}
                        language={selectedLanguage}
                        hasMore={hasMore}
                        loadMoreTerms={loadMoreTerms}
                        totalCount={termsData.length}
                      />
                      {searchQuery && renderSuggestedTermsForSearch()}
                    </>
                  )}
                  {searchType === "indexed" && (
                    <IndexedSearch
                      language={selectedLanguage}
                      onTermSelect={handleTermSelect}
                      handleLanguageChange={handleLanguageChange}
                      onSearchChange={handleSearchQueryChange}
                      viewMode={viewMode}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Term Details Modal */}
      {selectedTerm && (
        <div className="_terms_term_details_overlay">
          <div className="_terms_term_details_modal">
            <div className="_terms_term_details_header">
              <div className="_terms_term_details_title_wrapper">
                {getCategoryIcon(selectedTerm.category)}
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
              {/* Organize and display all definitions */}
              {selectedTerm.allDefinitions &&
              selectedTerm.allDefinitions.length > 0 ? (
                <div>
                  {/* First, group and display primary definitions by category */}
                  {(() => {
                    // Get all primary definitions
                    const primaryDefs = selectedTerm.allDefinitions.filter(
                      (def) => def.type === "primary"
                    );

                    if (primaryDefs.length === 0) {
                      return (
                        <div className="_terms_term_simple_details">
                          <div
                            className="_terms_term_category_header"
                            style={{
                              "--category-color": getCategoryColor(
                                selectedTerm.category
                              ),
                            }}
                          >
                            {getCategoryIcon(selectedTerm.category)}
                            <h3>{selectedTerm.category}</h3>
                          </div>
                          <div className="_terms_term_definition_section">
                            <p className="_terms_term_definition_text">
                              {selectedTerm.definition}
                            </p>
                            {selectedTerm.reference && (
                              <div className="_terms_term_references">
                                <h5>Legal Reference</h5>
                                <div className="_terms_term_reference_item">
                                  <Database
                                    size={16}
                                    className="_terms_term_reference_icon"
                                  />
                                  <span>{selectedTerm.reference}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Group primary definitions by category
                    const primaryByCategory = {};
                    primaryDefs.forEach((def) => {
                      if (!def.categories || def.categories.length === 0) {
                        if (!primaryByCategory["Divers"]) {
                          primaryByCategory["Divers"] = [];
                        }
                        primaryByCategory["Divers"].push(def);
                        return;
                      }

                      def.categories.forEach((category) => {
                        if (!primaryByCategory[category]) {
                          primaryByCategory[category] = [];
                        }
                        primaryByCategory[category].push(def);
                      });
                    });

                    // Render primary definitions by category
                    return Object.keys(primaryByCategory).map(
                      (category, catIndex) => {
                        const sectionId = `primary-${catIndex}`;
                        const isExpanded =
                          expandedSections[sectionId] !== false; // Default to expanded

                        return (
                          <div
                            key={sectionId}
                            className="_terms_term_category_section"
                          >
                            <div
                              className="_terms_term_category_header"
                              style={{
                                "--category-color": getCategoryColor(category),
                              }}
                            >
                              {getCategoryIcon(category)}
                              <h3>{category}</h3>
                            </div>

                            {/* Show a preview of the first definition */}
                            <div className="_terms_term_category_content">
                              <div className="_terms_term_definition_section">
                                <h4>Primary Legal Provision</h4>

                                {/* Always show the first definition */}
                                <div className="_terms_term_definition_block">
                                  <p className="_terms_term_definition_text">
                                    {primaryByCategory[category][0].text}
                                  </p>
                                  {primaryByCategory[category][0]
                                    .references && (
                                    <div className="_terms_term_references">
                                      <h5>Legal References</h5>
                                      <ul className="_terms_term_references_list">
                                        <li className="_terms_term_reference_item">
                                          <Database
                                            size={16}
                                            className="_terms_term_reference_icon"
                                          />
                                          <span>
                                            {
                                              primaryByCategory[category][0]
                                                .references
                                            }
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Show more button if there are multiple definitions */}
                                {primaryByCategory[category].length > 1 && (
                                  <button
                                    className="_terms_modal_show_more_button"
                                    onClick={() => toggleSection(sectionId)}
                                  >
                                    {isExpanded ? (
                                      <>
                                        <span>Show Less</span>
                                        <ChevronUp size={16} />
                                      </>
                                    ) : (
                                      <>
                                        <span>Show More</span>
                                        <ChevronDown size={16} />
                                      </>
                                    )}
                                  </button>
                                )}

                                {/* Show the rest of the definitions if expanded */}
                                {isExpanded &&
                                  primaryByCategory[category].length > 1 && (
                                    <div className="_terms_expanded_content">
                                      {primaryByCategory[category]
                                        .slice(1)
                                        .map((def, defIndex) => (
                                          <div
                                            key={`primary-def-${defIndex + 1}`}
                                            className="_terms_term_definition_block"
                                          >
                                            <p className="_terms_term_definition_text">
                                              {def.text}
                                            </p>
                                            {def.references && (
                                              <div className="_terms_term_references">
                                                <h5>Legal References</h5>
                                                <ul className="_terms_term_references_list">
                                                  <li className="_terms_term_reference_item">
                                                    <Database
                                                      size={16}
                                                      className="_terms_term_reference_icon"
                                                    />
                                                    <span>
                                                      {def.references}
                                                    </span>
                                                  </li>
                                                </ul>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                              </div>

                              {/* Now display secondary definitions for this category */}
                              {(() => {
                                const secondaryDefs =
                                  selectedTerm.allDefinitions.filter(
                                    (def) =>
                                      def.type === "secondary" &&
                                      def.categories &&
                                      def.categories.includes(category)
                                  );

                                if (secondaryDefs.length > 0) {
                                  const secondarySectionId = `secondary-${catIndex}`;
                                  const isSecondaryExpanded =
                                    expandedSections[secondarySectionId] !==
                                    false; // Default to expanded

                                  return (
                                    <div className="_terms_term_definition_section _terms_term_secondary">
                                      <h4>Secondary Legal Provisions</h4>

                                      {/* Always show the first secondary definition */}
                                      <div className="_terms_term_definition_block">
                                        <p className="_terms_term_definition_text">
                                          {secondaryDefs[0].text}
                                        </p>
                                        {secondaryDefs[0].references && (
                                          <div className="_terms_term_references">
                                            <h5>Legal References</h5>
                                            <ul className="_terms_term_references_list">
                                              <li className="_terms_term_reference_item">
                                                <Database
                                                  size={16}
                                                  className="_terms_term_reference_icon"
                                                />
                                                <span>
                                                  {secondaryDefs[0].references}
                                                </span>
                                              </li>
                                            </ul>
                                          </div>
                                        )}
                                      </div>

                                      {/* Show more button if there are multiple secondary definitions */}
                                      {secondaryDefs.length > 1 && (
                                        <button
                                          className="_terms_modal_show_more_button"
                                          onClick={() =>
                                            toggleSection(secondarySectionId)
                                          }
                                        >
                                          {isSecondaryExpanded ? (
                                            <>
                                              <span>Show Less</span>
                                              <ChevronUp size={16} />
                                            </>
                                          ) : (
                                            <>
                                              <span>Show More</span>
                                              <ChevronDown size={16} />
                                            </>
                                          )}
                                        </button>
                                      )}

                                      {/* Show the rest of the secondary definitions if expanded */}
                                      {isSecondaryExpanded &&
                                        secondaryDefs.length > 1 && (
                                          <div className="_terms_expanded_content">
                                            {secondaryDefs
                                              .slice(1)
                                              .map((def, defIndex) => (
                                                <div
                                                  key={`secondary-def-${
                                                    defIndex + 1
                                                  }`}
                                                  className="_terms_term_definition_block"
                                                >
                                                  <p className="_terms_term_definition_text">
                                                    {def.text}
                                                  </p>
                                                  {def.references && (
                                                    <div className="_terms_term_references">
                                                      <h5>Legal References</h5>
                                                      <ul className="_terms_term_references_list">
                                                        <li className="_terms_term_reference_item">
                                                          <Database
                                                            size={16}
                                                            className="_terms_term_reference_icon"
                                                          />
                                                          <span>
                                                            {def.references}
                                                          </span>
                                                        </li>
                                                      </ul>
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                          </div>
                                        )}
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </div>
                        );
                      }
                    );
                  })()}

                  {/* If there are any secondary definitions that don't match primary categories, display them last */}
                  {(() => {
                    // Get all primary definition categories
                    const primaryCategories = new Set();
                    selectedTerm.allDefinitions
                      .filter((def) => def.type === "primary")
                      .forEach((def) => {
                        if (def.categories) {
                          def.categories.forEach((cat) =>
                            primaryCategories.add(cat)
                          );
                        }
                      });

                    // Find secondary definitions with categories not in primary
                    const secondaryDefs = selectedTerm.allDefinitions.filter(
                      (def) =>
                        def.type === "secondary" &&
                        def.categories &&
                        def.categories.some(
                          (cat) => !primaryCategories.has(cat)
                        )
                    );

                    // Group these by category
                    const secondaryByCategory = {};
                    secondaryDefs.forEach((def) => {
                      if (!def.categories) return;

                      def.categories.forEach((category) => {
                        if (primaryCategories.has(category)) return; // Skip if already handled

                        if (!secondaryByCategory[category]) {
                          secondaryByCategory[category] = [];
                        }
                        secondaryByCategory[category].push(def);
                      });
                    });

                    // Render these secondary-only categories
                    return Object.keys(secondaryByCategory).map(
                      (category, catIndex) => {
                        const sectionId = `secondary-only-${catIndex}`;
                        const isExpanded =
                          expandedSections[sectionId] !== false; // Default to expanded

                        return (
                          <div
                            key={sectionId}
                            className="_terms_term_category_section"
                          >
                            <div
                              className="_terms_term_category_header"
                              style={{
                                "--category-color": getCategoryColor(category),
                              }}
                            >
                              {getCategoryIcon(category)}
                              <h3>{category}</h3>
                            </div>
                            <div className="_terms_term_category_content">
                              <div className="_terms_term_definition_section _terms_term_secondary">
                                <h4>Secondary Legal Provisions</h4>

                                {/* Always show the first definition */}
                                <div className="_terms_term_definition_block">
                                  <p className="_terms_term_definition_text">
                                    {secondaryByCategory[category][0].text}
                                  </p>
                                  {secondaryByCategory[category][0]
                                    .references && (
                                    <div className="_terms_term_references">
                                      <h5>Legal References</h5>
                                      <ul className="_terms_term_references_list">
                                        <li className="_terms_term_reference_item">
                                          <Database
                                            size={16}
                                            className="_terms_term_reference_icon"
                                          />
                                          <span>
                                            {
                                              secondaryByCategory[category][0]
                                                .references
                                            }
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Show more button if there are multiple definitions */}
                                {secondaryByCategory[category].length > 1 && (
                                  <button
                                    className="_terms_modal_show_more_button"
                                    onClick={() => toggleSection(sectionId)}
                                  >
                                    {isExpanded ? (
                                      <>
                                        <span>Show Less</span>
                                        <ChevronUp size={16} />
                                      </>
                                    ) : (
                                      <>
                                        <span>Show More</span>
                                        <ChevronDown size={16} />
                                      </>
                                    )}
                                  </button>
                                )}

                                {/* Show the rest of the definitions if expanded */}
                                {isExpanded &&
                                  secondaryByCategory[category].length > 1 && (
                                    <div className="_terms_expanded_content">
                                      {secondaryByCategory[category]
                                        .slice(1)
                                        .map((def, defIndex) => (
                                          <div
                                            key={`secondary-only-def-${
                                              defIndex + 1
                                            }`}
                                            className="_terms_term_definition_block"
                                          >
                                            <p className="_terms_term_definition_text">
                                              {def.text}
                                            </p>
                                            {def.references && (
                                              <div className="_terms_term_references">
                                                <h5>Legal References</h5>
                                                <ul className="_terms_term_references_list">
                                                  <li className="_terms_term_reference_item">
                                                    <Database
                                                      size={16}
                                                      className="_terms_term_reference_icon"
                                                    />
                                                    <span>
                                                      {def.references}
                                                    </span>
                                                  </li>
                                                </ul>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    );
                  })()}
                </div>
              ) : (
                // Fallback for terms without definitions
                <div className="_terms_term_simple_details">
                  <div
                    className="_terms_term_category_header"
                    style={{
                      "--category-color": getCategoryColor(
                        selectedTerm.category
                      ),
                    }}
                  >
                    {getCategoryIcon(selectedTerm.category)}
                    <h3>{selectedTerm.category}</h3>
                  </div>
                  <div className="_terms_term_definition_section">
                    <p className="_terms_term_definition_text">
                      {selectedTerm.definition}
                    </p>
                    {selectedTerm.reference && (
                      <div className="_terms_term_references">
                        <h5>Legal Reference</h5>
                        <div className="_terms_term_reference_item">
                          <Database
                            size={16}
                            className="_terms_term_reference_icon"
                          />
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
                  <h4>Related Laws</h4>
                  <div className="_terms_term_relations_list">
                    {relatedTerms.map((relation, index) => (
                      <div
                        key={index}
                        className="_terms_term_relation_item"
                        onClick={() => handleTermSelect(relation)}
                        style={{
                          "--relation-color": getCategoryColor(
                            relation.category
                          ),
                        }}
                      >
                        <div className="_terms_relation_glow"></div>
                        {getCategoryIcon(relation.category)}
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
              >
                <span>Add to Library</span>
                <div className="_terms_term_add_library_icon">
                  <Hash
                    size={16}
                    className={isButtonHovered ? "visible" : ""}
                  />
                </div>
                <div className="_terms_term_add_library_glow"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Terms Section - Moved outside the modal */}
      {selectedTerm && suggestedTerms.length > 0 && searchQuery && (
        <div className="_terms_suggested_terms_container">
          <div className="_terms_suggested_terms_header">
            <h3>
              <Sparkles size={20} className="_terms_suggested_terms_icon" />
              Suggested Laws
            </h3>
            <p>Based on your search for "{searchQuery}"</p>
          </div>
          <div className="_terms_suggested_terms_list">
            {suggestedTerms.map((suggestion, index) => {
              const category = suggestion.category || "Divers";
              return (
                <div
                  key={index}
                  className="_terms_suggested_term_item"
                  onClick={() => handleTermSelect(suggestion)}
                  style={{
                    "--suggestion-color": getCategoryColor(category),
                  }}
                >
                  <div className="_terms_suggestion_glow"></div>
                  {getCategoryIcon(category)}
                  <div className="_terms_suggested_term_content">
                    <h4>{suggestion.name}</h4>
                    <div className="_terms_suggested_term_categories">
                      {suggestion.allDefinitions &&
                      suggestion.allDefinitions.length > 0 &&
                      suggestion.allDefinitions[0].categories ? (
                        // Get unique categories from all definitions
                        [
                          ...new Set(
                            suggestion.allDefinitions.flatMap(
                              (def) => def.categories || []
                            )
                          ),
                        ].map((category, catIndex) => (
                          <span
                            key={catIndex}
                            className="_terms_suggested_term_category"
                            style={{
                              backgroundColor: `${getCategoryColor(
                                category
                              )}20`,
                              color: getCategoryColor(category),
                            }}
                          >
                            {category}
                          </span>
                        ))
                      ) : (
                        <span
                          className="_terms_suggested_term_category"
                          style={{
                            backgroundColor: `${getCategoryColor(category)}20`,
                            color: getCategoryColor(category),
                          }}
                        >
                          {category}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="_terms_suggested_term_button"
                    style={{
                      backgroundColor: getCategoryColor(category),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Adding ${suggestion.name} to library`);
                    }}
                  >
                    <Hash size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default SearchPage;
