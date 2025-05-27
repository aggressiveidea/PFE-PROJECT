import { useState, useEffect } from "react"
import "../components/forLibrary/library.css"
import Sidebar from "../components/forDashboard/Sidebar"
import Header from "../components/forHome/Header"
import Footer from "../components/forHome/Footer"
import SearchBar from "../components/forLibrary/SearchBar"
import FilterControls from "../components/forLibrary/FilterControls"
import TermsList from "../components/forLibrary/TermsList"
import ArticlesList from "../components/forLibrary/ArticlesList"
import BooksList from "../components/forLibrary/BooksList"
import Pagination from "../components/forLibrary/Pagination"

const Library = () => {
  const [activeTab, setActiveTab] = useState("terms")
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [sortOption, setSortOption] = useState("dateNewest")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(true)

  // Check for dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [])

  // Update dark mode when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [activeTab])

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setLanguageFilter("all")
    setShowFavoritesOnly(false)
    setSortOption("dateNewest")
    setCurrentPage(1)
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Mobile menu handlers
  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const openMobileMenu = () => {
    setMobileOpen(true)
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    // Scroll to top of results
    document.querySelector(".library-content").scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div
      className={`library-app-container ${darkMode ? "library-dark" : ""} ${sidebarCollapsed ? "library-sidebar-collapsed" : ""}`}
    >
      <div className="library-header-wrapper">
        <Header language={language} setLanguage={setLanguage} darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <div className="library-content-wrapper">
        <div className={`library-sidebar-wrapper ${mobileOpen ? "library-mobile-open" : ""}`}>
          <Sidebar
            collapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
            mobileOpen={mobileOpen}
            closeMobileMenu={closeMobileMenu}
            darkMode={darkMode}
          />
        </div>

        <div className="library-main-content">
          <button className="library-mobile-menu-button" onClick={openMobileMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className={`library-container ${currentLanguage === "ar" ? "library-rtl" : "library-ltr"}`}>
            {/* Enhanced Welcome Section */}
            <div className="library-welcome-section">
              <div className="library-welcome-content">
                <div className="library-welcome-badge">
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
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <span>Digital Knowledge Library</span>
                </div>
                <h1 className="library-welcome-title">
                  Degital Saver<span className="library-code-accent">{"<saver/>"}</span>
                </h1>
                <p className="library-welcome-subtitle">
                  Explore our comprehensive collection of ICT terms, technical articles, and educational resources.
                </p>

                {/* Code snippet */}
                <div className="library-code-snippet">
                  <div className="library-code-header">
                    <div className="library-code-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="library-code-title">knowledge-base.js</span>
                  </div>
                  <div className="library-code-content">
                    <span className="library-code-line">
                      <span className="library-code-function">library</span>
                      <span className="library-code-punctuation">.</span>
                      <span className="library-code-function">search</span>
                      <span className="library-code-punctuation">(</span>
                      <span className="library-code-string">"{activeTab}"</span>
                      <span className="library-code-punctuation">);</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="library-welcome-stats">
                <div className="library-date-info">
                  <div className="library-date-item">
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
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>
                      {new Date().toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="library-date-item">
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
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span>
                      {new Date().toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* IT-themed background elements */}
              <div className="library-tech-bg">
                <div className="library-circuit-pattern"></div>
                <div className="library-floating-icons">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="library-floating-icon"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="library-floating-icon"
                  >
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="library-floating-icon"
                  >
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Updated tabs with icons */}
            <div className="library-tabs">
              <button
                className={`library-tab-button ${activeTab === "terms" ? "library-active" : ""}`}
                onClick={() => setActiveTab("terms")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Legal Terms
              </button>
              <button
                className={`library-tab-button ${activeTab === "articles" ? "library-active" : ""}`}
                onClick={() => setActiveTab("articles")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
                Articles
              </button>
              <button
                className={`library-tab-button ${activeTab === "books" ? "library-active" : ""}`}
                onClick={() => setActiveTab("books")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Books
              </button>
            </div>

            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} currentLanguage={currentLanguage} />

            <FilterControls
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              languageFilter={languageFilter}
              setLanguageFilter={setLanguageFilter}
              sortOption={sortOption}
              setSortOption={setSortOption}
              showFavoritesOnly={showFavoritesOnly}
              setShowFavoritesOnly={setShowFavoritesOnly}
              resetFilters={resetFilters}
              currentLanguage={currentLanguage}
            />

            <div className="library-content">
              {isLoading ? (
                <div className="library-loading-container">
                  <div className="library-loading-spinner"></div>
                  <p>Loading...</p>
                </div>
              ) : (
                <>
                  {activeTab === "terms" && (
                    <TermsList
                      searchQuery={searchQuery}
                      categoryFilter={categoryFilter}
                      languageFilter={languageFilter}
                      sortOption={sortOption}
                      showFavoritesOnly={showFavoritesOnly}
                      currentPage={currentPage}
                      currentLanguage={currentLanguage}
                    />
                  )}

                  {activeTab === "articles" && (
                    <ArticlesList
                      searchQuery={searchQuery}
                      categoryFilter={categoryFilter}
                      languageFilter={languageFilter}
                      sortOption={sortOption}
                      showFavoritesOnly={showFavoritesOnly}
                      currentPage={currentPage}
                      currentLanguage={currentLanguage}
                    />
                  )}

                  {activeTab === "books" && (
                    <BooksList
                      searchQuery={searchQuery}
                      categoryFilter={categoryFilter}
                      languageFilter={languageFilter}
                      sortOption={sortOption}
                      showFavoritesOnly={showFavoritesOnly}
                      currentPage={currentPage}
                      currentLanguage={currentLanguage}
                    />
                  )}
                </>
              )}
            </div>

            {activeTab !== "books" && (
              <Pagination
                currentPage={currentPage}
                totalPages={5} // This would be dynamic based on filtered results
                handlePageChange={handlePageChange}
                currentLanguage={currentLanguage}
              />
            )}
          </div>
        </div>
      </div>

      <div className="library-footer-wrapper">
        <Footer darkMode={darkMode} setDarkMode={setDarkMode} language={language} />
      </div>
    </div>
  )
}

export default Library
