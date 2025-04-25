"use client"

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
  // State management
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
            <div className="library-header">
              <h2 className="library-title">My Library</h2>
              <p className="library-subtitle">Manage your legal and IT terms, articles, and books</p>
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
