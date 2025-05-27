import { useState, useEffect } from "react";
import Header from "../components/forHome/Header";
import Sidebar from "../components/forDashboard/Sidebar";
import GraphVisualization from "../components/forKnowledge/GraphVisualization";
import GraphAlgorithmsSection from "../components/forKnowledge/GraphAlgorithms";
import AlgorithmModal from "../components/forKnowledge/AlgorithmModal";
import AccessLock from "../components/forKnowledge/AccessLock";
import "./ICTDictionary.css";
import { History, X, Filter } from "lucide-react";

const KnowledgeGraphPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [darkMode, setDarkMode] = useState(false);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeHistoryFilter, setActiveHistoryFilter] = useState("all");

  const isRTL = selectedLanguage === "arabic";

  useEffect(() => {
    const checkUserVerification = () => {
      try {
 
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        if (userData && userData.isVerified === true) {
          setIsUserVerified(true);
        } else {
          setIsUserVerified(false);
        }
      } catch (error) {
        console.error("Error checking user verification:", error);
        setIsUserVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserVerification();

    // Listen for user updates
    window.addEventListener("userUpdated", checkUserVerification);

    return () => {
      window.removeEventListener("userUpdated", checkUserVerification);
    };
  }, []);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }

    // Listen for dark mode changes from other components
    const handleDarkModeChange = () => {
      const isDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkMode(isDarkMode);
    };
    window.addEventListener("darkModeChanged", handleDarkModeChange);

    return () => {
      window.removeEventListener("darkModeChanged", handleDarkModeChange);
    };
  }, []);

  // Fetch search history when history panel is opened
  useEffect(() => {
    if (showHistory) {
      fetchSearchHistory();
    }
  }, [showHistory]);

  const fetchSearchHistory = async () => {
    try {
      // Mock data using the actual terms and specified enum types
      const mockHistory = [
        {
          id: 1,
          query: "Access",
          termId: "4",
          type: "node_click",
          category: "Networks",
          timestamp: "2023-05-22 14:30:45",
        },
        {
          id: 2,
          query: "Illegal Access",
          termId: "5",
          type: "simple_search",
          category: "Computer Crime",
          timestamp: "2023-05-22 13:15:22",
        },
        {
          id: 3,
          query: "Centrality Algorithm",
          termId: null,
          type: "algorithm",
          category: null,
          timestamp: "2023-05-21 09:45:12",
        },
        {
          id: 4,
          query: "Access",
          termId: "4",
          type: "simple_search",
          category: "Personal Data",
          timestamp: "2023-05-20 16:20:33",
        },
        {
          id: 5,
          query: "right of access",
          termId: null,
          type: "simple_search",
          category: null,
          timestamp: "2023-05-19 11:05:18",
        },
        {
          id: 6,
          query: "Community Detection",
          termId: null,
          type: "algorithm",
          category: null,
          timestamp: "2023-05-18 10:22:37",
        },
        {
          id: 7,
          query: "Illegal Access",
          termId: "5",
          type: "node_click",
          category: "Computer Crime",
          timestamp: "2023-05-17 15:40:12",
        },
      ];

      setSearchHistory(mockHistory);

      // Uncomment and modify when ready to use actual API
      /*
      const response = await fetch('/api/search-history');
      if (!response.ok) {
        throw new Error('Failed to fetch search history');
      }
      const data = await response.json();
      setSearchHistory(data);
      */
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
  };

  const handleCloseModal = () => {
    setSelectedAlgorithm(null);
  };

  const filterHistory = (type) => {
    setActiveHistoryFilter(type);
  };

  const getFilteredHistory = () => {
    if (activeHistoryFilter === "all") {
      return searchHistory;
    }
    return searchHistory.filter((item) => item.type === activeHistoryFilter);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "node_click":
        return t.nodeClick;
      case "simple_search":
        return t.simpleSearch;
      case "algorithm":
        return t.algorithm;
      default:
        return type;
    }
  };

  // Translations
  const translations = {
    english: {
      title: "Knowledge Graph",
      subtitle: "Explore terms and concepts powered by Neo4j graph technology",
      loading: "Loading...",
      history: "History",
      historyTitle: "Search History",
      query: "Query",
      type: "Type",
      category: "Category",
      timestamp: "Timestamp",
      noHistory: "No search history found",
      close: "Close",
      all: "All",
      nodeClick: "Node Click",
      simpleSearch: "Simple Search",
      algorithm: "Algorithm",
      filter: "Filter",
    },
    french: {
      title: "Graphe de Connaissances",
      subtitle:
        "Explorez les termes et concepts alimentés par la technologie de graphe Neo4j",
      loading: "Chargement...",
      history: "Historique",
      historyTitle: "Historique de Recherche",
      query: "Requête",
      type: "Type",
      category: "Catégorie",
      timestamp: "Horodatage",
      noHistory: "Aucun historique de recherche trouvé",
      close: "Fermer",
      all: "Tous",
      nodeClick: "Clic sur Nœud",
      simpleSearch: "Recherche Simple",
      algorithm: "Algorithme",
      filter: "Filtrer",
    },
    arabic: {
      title: "الرسم البياني للمعرفة",
      subtitle:
        "استكشف المصطلحات والمفاهيم المدعومة بتقنية الرسم البياني Neo4j",
      loading: "جار التحميل...",
      history: "السجل",
      historyTitle: "سجل البحث",
      query: "الاستعلام",
      type: "النوع",
      category: "الفئة",
      timestamp: "الوقت",
      noHistory: "لم يتم العثور على سجل بحث",
      close: "إغلاق",
      all: "الكل",
      nodeClick: "نقرة على العقدة",
      simpleSearch: "بحث بسيط",
      algorithm: "خوارزمية",
      filter: "تصفية",
    },
  };

  const t = translations[selectedLanguage] || translations.english;

  // Language button colors
  const languageColors = {
    english: "#8b5cf6", // Purple
    french: "#ec4899", // Pink
    arabic: "#3b82f6", // Blue
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  return (
    <div
      className={`knowledge-graph-page ${darkMode ? "dark-mode" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header />
      <div className="main-content">

        <div className="content-area">
          <div className="knowledge-graph-container">
            <div className="knowledge-graph-content">
              <div className="knowledge-graph-header">
                <h1 className="knowledge-graph-title">{t.title}</h1>
                <p className="knowledge-graph-subtitle">{t.subtitle}</p>

                <div className="purple-divider"></div>

                <div className="knowledge-graph-controls">
                  <div className="language-control">
                    <span className="language-label">Language:</span>
                    <div className="language-selector">
                      <button
                        className={`language-btn ${
                          selectedLanguage === "english" ? "active" : ""
                        }`}
                        onClick={() => setSelectedLanguage("english")}
                        style={{
                          backgroundColor:
                            selectedLanguage === "english"
                              ? languageColors.english
                              : "#f9fafb",
                          color:
                            selectedLanguage === "english"
                              ? "white"
                              : "#374151",
                        }}
                      >
                        English
                      </button>
                      <button
                        className={`language-btn ${
                          selectedLanguage === "french" ? "active" : ""
                        }`}
                        onClick={() => setSelectedLanguage("french")}
                        style={{
                          backgroundColor:
                            selectedLanguage === "french"
                              ? languageColors.french
                              : "#f9fafb",
                          color:
                            selectedLanguage === "french" ? "white" : "#374151",
                        }}
                      >
                        Français
                      </button>
                      <button
                        className={`language-btn ${
                          selectedLanguage === "arabic" ? "active" : ""
                        }`}
                        onClick={() => setSelectedLanguage("arabic")}
                        style={{
                          backgroundColor:
                            selectedLanguage === "arabic"
                              ? languageColors.arabic
                              : "#f9fafb",
                          color:
                            selectedLanguage === "arabic" ? "white" : "#374151",
                        }}
                      >
                        العربية
                      </button>
                    </div>
                  </div>

                  <button
                    className="history-button"
                    onClick={toggleHistory}
                    aria-label={t.history}
                  >
                    <History size={20} />
                    <span className="history-text">{t.history}</span>
                  </button>
                </div>
              </div>

              {showHistory && (
                <div className="history-panel">
                  <div className="history-panel-header">
                    <h2>{t.historyTitle}</h2>
                    <button
                      className="close-history-btn"
                      onClick={() => setShowHistory(false)}
                      aria-label={t.close}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="history-filter">
                    <span className="filter-label">
                      <Filter size={16} />
                      {t.filter}:
                    </span>
                    <div className="filter-buttons">
                      <button
                        className={`filter-btn ${
                          activeHistoryFilter === "all" ? "active" : ""
                        }`}
                        onClick={() => filterHistory("all")}
                      >
                        {t.all}
                      </button>
                      <button
                        className={`filter-btn ${
                          activeHistoryFilter === "node_click" ? "active" : ""
                        }`}
                        onClick={() => filterHistory("node_click")}
                      >
                        {t.nodeClick}
                      </button>
                      <button
                        className={`filter-btn ${
                          activeHistoryFilter === "simple_search"
                            ? "active"
                            : ""
                        }`}
                        onClick={() => filterHistory("simple_search")}
                      >
                        {t.simpleSearch}
                      </button>
                      <button
                        className={`filter-btn ${
                          activeHistoryFilter === "algorithm" ? "active" : ""
                        }`}
                        onClick={() => filterHistory("algorithm")}
                      >
                        {t.algorithm}
                      </button>
                    </div>
                  </div>

                  <div className="history-panel-content">
                    {getFilteredHistory().length > 0 ? (
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>{t.query}</th>
                            <th>{t.type}</th>
                            <th>{t.category}</th>
                            <th>{t.timestamp}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredHistory().map((item) => (
                            <tr
                              key={item.id}
                              className={`history-row history-type-${item.type}`}
                            >
                              <td className="query-cell">{item.query}</td>
                              <td className="type-cell">
                                {getTypeLabel(item.type)}
                              </td>
                              <td className="category-cell">
                                {item.category || "-"}
                              </td>
                              <td className="timestamp-cell">
                                {item.timestamp}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-history-message">{t.noHistory}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="graph-visualization-wrapper">
                <GraphVisualization language={selectedLanguage} />
              </div>

              <div className="section-spacer"></div>

              <div className="graph-algorithms-wrapper">
                <GraphAlgorithmsSection
                  language={selectedLanguage}
                  onAlgorithmSelect={handleAlgorithmSelect}
                />
              </div>

              {selectedAlgorithm && (
                <AlgorithmModal
                  algorithm={selectedAlgorithm}
                  onClose={handleCloseModal}
                  language={selectedLanguage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {!isUserVerified && <AccessLock />}
    </div>
  );
};

export default KnowledgeGraphPage;
