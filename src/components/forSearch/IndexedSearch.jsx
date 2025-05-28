import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { indexedSearch } from "../../services/Api";
import "./IndexedSearch.css";

const IndexedSearch = ({ language = "en", onTermSelect }) => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 8;

  // Define alphabet for index
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Mock indexed terms data
  const mockIndexedTerms = {
    A: [
      { name: "Algorithm", category: "Computer Science" },
      { name: "Authentication", category: "Cybersecurity" },
      { name: "API", category: "Software Development" },
      { name: "Abstraction", category: "Computer Science" },
    ],
    B: [
      { name: "Blockchain", category: "Cybersecurity" },
      { name: "Browser", category: "Software Development" },
      { name: "Bandwidth", category: "Networks" },
    ],
    C: [
      { name: "Cryptography", category: "Cybersecurity" },
      { name: "Cloud Computing", category: "Data Management" },
      { name: "Confidentialité", category: "Données personnelles" },
    ],
    D: [
      { name: "Database", category: "Data Management" },
      { name: "Data Structure", category: "Computer Science" },
      { name: "DNS", category: "Networks" },
    ],
    E: [
      { name: "Encryption", category: "Networks" },
      { name: "Ethernet", category: "Networks" },
    ],
    F: [
      { name: "Firewall", category: "Cybersecurity" },
      { name: "Framework", category: "Software Development" },
    ],
    G: [
      { name: "Gateway", category: "Networks" },
      { name: "GUI", category: "Software Development" },
    ],
    H: [
      { name: "HTTP", category: "Networks" },
      { name: "Hashing", category: "Cybersecurity" },
    ],
    I: [
      { name: "IP Address", category: "Networks" },
      { name: "Interface", category: "Software Development" },
    ],
    J: [
      { name: "JavaScript", category: "Software Development" },
      { name: "JSON", category: "Data Management" },
    ],
    K: [
      { name: "Kernel", category: "Computer Science" },
      { name: "Key", category: "Cybersecurity" },
    ],
    L: [
      { name: "Linux", category: "Computer Science" },
      { name: "LAN", category: "Networks" },
    ],
    M: [
      { name: "Malware", category: "Cybersecurity" },
      { name: "Metadata", category: "Data Management" },
    ],
    N: [
      { name: "Network", category: "Networks" },
      { name: "Node.js", category: "Software Development" },
    ],
    O: [
      { name: "Operating System", category: "Computer Science" },
      { name: "OAuth", category: "Cybersecurity" },
    ],
    P: [
      { name: "Protocol", category: "Networks" },
      { name: "Programming", category: "Software Development" },
    ],
    Q: [
      { name: "Query", category: "Data Management" },
      { name: "QR Code", category: "Software Development" },
    ],
    R: [
      { name: "Router", category: "Networks" },
      { name: "REST API", category: "Software Development" },
    ],
    S: [
      { name: "Server", category: "Networks" },
      { name: "SQL", category: "Data Management" },
    ],
    T: [
      { name: "TCP/IP", category: "Networks" },
      { name: "Trojan", category: "Cybersecurity" },
    ],
    U: [
      { name: "URL", category: "Networks" },
      { name: "UI/UX", category: "Software Development" },
    ],
    V: [
      { name: "VPN", category: "Networks" },
      { name: "Virus", category: "Cybersecurity" },
    ],
    W: [
      { name: "Web", category: "Networks" },
      { name: "Wireless", category: "Networks" },
    ],
    X: [
      { name: "XML", category: "Data Management" },
      { name: "XSS", category: "Cybersecurity" },
    ],
    Y: [{ name: "YAML", category: "Data Management" }],
    Z: [
      { name: "Zero-day", category: "Cybersecurity" },
      { name: "ZIP", category: "Data Management" },
    ],
  };

  // Function to get color for a category - purple-themed colors
  const getCategoryColor = (category) => {
    
      const colorMap = {
        "Computer Crime": "#e879f9",         // Pink
        "Personal Data": "#9333ea",         // Purple
        "Electronic Commerce": "#c026d3",   // Fuchsia
        Organizations: "#8b5cf6",           // Violet
        Networks: "#6366f1",                // Indigo
        "Intellectual Property": "#c084fc", // Purple
        Miscellaneous: "#8b5cf6",           // Violet
        "Computer Contracts": "#a78bfa",    // Violet
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
    

  // Get category name based on selected language
  const getCategoryName = (category) => {
    return categoryTranslations[language][category] || category;
  };

  useEffect(() => {
    // Initialize with mock data
    setIndexedTerms(mockIndexedTerms);

    // Set first index as active by default
    if (Object.keys(mockIndexedTerms).length > 0 && !activeIndex) {
      setActiveIndex(Object.keys(mockIndexedTerms)[0]);
    }

    // Generate suggested terms
    const allTerms = Object.values(mockIndexedTerms).flat();
    const randomTerms = [...allTerms]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    setSuggestedTerms(randomTerms);
  }, []);

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
          'en'
        );

        // Transform the data to match the expected format
        const transformedData = data.map((term) => {
          return {
            id: term.id,
            name: term.name,
            // Store all definitions for detailed view
            allDefinitions: term.definition,
            // Also keep a simple format for the cards display
            category: term.definition[0]?.categories[0] || "Divers",
            definition: term.definition[0]?.text || "No definition available",
            reference: term.definition[0]?.references || "",
            // Store related terms if available
            relatedTerms: term.definition[0]?.relatedTerms || [],
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
    const alphabet = Object.keys(indexedTerms);
    if (!activeIndex && alphabet.length > 0) {
      setActiveIndex(alphabet[0]);
      setCurrentPage(1);
    }
  }, [indexedTerms, activeIndex]);

  // Filter terms based on search input
  const getFilteredTerms = () => {
    if (!activeIndex || !indexedTerms[activeIndex]) return [];

    if (!searchInput) return indexedTerms[activeIndex];

    return indexedTerms[activeIndex].filter((term) =>
      term.name.toLowerCase().includes(searchInput.toLowerCase())
    );
  };

  // Update the search functionality to include autocomplete
  // Modify the handleSearchChange function to provide autocomplete suggestions
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);

    // Generate suggestions as user types (autocomplete)
    if (e.target.value.length > 1) {
      const allTerms = Object.values(indexedTerms).flat();
      const autocompleteSuggestions = allTerms
        .filter(
          (term) =>
            term.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            term.category.toLowerCase().includes(e.target.value.toLowerCase())
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
            term.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            term.category.toLowerCase().includes(searchInput.toLowerCase())
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
          {displayedTerms.map((term, index) => (
            <div
              key={index}
              className="_terms_indexed_search_term_item"
              onClick={() => onTermSelect(term)}
              style={{
                "--term-color": getCategoryColor(term.category),
                backgroundColor: `rgba(${getCategoryColor(term.category)
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
                  backgroundColor: `rgba(${getCategoryColor(term.category)
                    .replace("#", "")
                    .match(/.{2}/g)
                    .map((x) => Number.parseInt(x, 16))
                    .join(", ")}, 0.4)`,
                  color: getCategoryColor(term.category),
                }}
              >
                {getCategoryName(term.category)}
              </span>
            </div>
          ))}

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
              const category = term.category;
              return (
                <div
                  key={index}
                  className="_terms_search_suggested_item"
                  onClick={() => onTermSelect(term)}
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
              Search for a term to see suggestions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexedSearch;
