"use client"

import { useState, useEffect } from "react"
import "./search-page.css"

// Mock data for demonstration
import { glossaryTerms, researchPapers, articles, trendData } from "./mock-data.js"

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [language, setLanguage] = useState("english")
  const [activeTab, setActiveTab] = useState("all")
  const [activeLetter, setActiveLetter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedTerm, setExpandedTerm] = useState(null)
  const [filteredResearch, setFilteredResearch] = useState(researchPapers)
  const [filteredGlossary, setFilteredGlossary] = useState(glossaryTerms)
  const itemsPerPage = 8

  // Filter research papers based on active letter
  useEffect(() => {
    if (activeLetter === "all") {
      setFilteredResearch(researchPapers)
      setFilteredGlossary(glossaryTerms)
    } else {
      setFilteredResearch(
        researchPapers.filter((paper) => paper.title.toLowerCase().startsWith(activeLetter.toLowerCase())),
      )
      setFilteredGlossary(
        glossaryTerms.filter((term) => term.term.toLowerCase().startsWith(activeLetter.toLowerCase())),
      )
    }
    setCurrentPage(1)
  }, [activeLetter])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang)
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // Handle letter filter change
  const handleLetterChange = (letter) => {
    setActiveLetter(letter)
  }

  // Toggle term expansion
  const toggleTermExpansion = (termId) => {
    if (expandedTerm === termId) {
      setExpandedTerm(null)
    } else {
      setExpandedTerm(termId)
    }
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentResearch = filteredResearch.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredResearch.length / itemsPerPage)

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Generate alphabet array for navigation
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))

  // Render chart using canvas
  useEffect(() => {
    const canvas = document.getElementById("trendChart")
    if (canvas) {
      const ctx = canvas.getContext("2d")
      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Set chart styles
      ctx.lineWidth = 3
      ctx.strokeStyle = "#4361EE"
      ctx.fillStyle = "rgba(67, 97, 238, 0.2)"

      // Draw chart
      ctx.beginPath()
      const dataPoints = trendData.map((item, index) => ({
        x: (index / (trendData.length - 1)) * width,
        y: height - (item.value / 100) * height,
      }))

      dataPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })

      // Complete the area under the line
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fill()

      // Draw the line
      ctx.beginPath()
      dataPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.stroke()

      // Draw data points
      dataPoints.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = "#4361EE"
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Draw x-axis labels
      ctx.fillStyle = "#333"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      trendData.forEach((item, index) => {
        const x = (index / (trendData.length - 1)) * width
        ctx.fillText(item.year, x, height - 10)
      })
    }
  }, [])

  return (
    <div className="search-page">
      {/* User Profile Section */}
      <div className="user-profile">
        <div className="user-info">
          <span>John Doe</span>
          <div className="user-avatar">
            <img src="/placeholder.svg?height=40&width=40" alt="User Avatar" />
          </div>
        </div>
      </div>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search ICT terms, articles, or research papers..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="search-button">
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          <div className="language-switcher">
            <button className={language === "english" ? "active" : ""} onClick={() => handleLanguageChange("english")}>
              English
            </button>
            <button className={language === "french" ? "active" : ""} onClick={() => handleLanguageChange("french")}>
              French
            </button>
            <button className={language === "arabic" ? "active" : ""} onClick={() => handleLanguageChange("arabic")}>
              Arabic
            </button>
          </div>
        </div>

        {/* Search Results Tabs */}
        <div className="search-results-tabs">
          <button className={activeTab === "all" ? "active" : ""} onClick={() => handleTabChange("all")}>
            All Results
          </button>
          <button className={activeTab === "glossary" ? "active" : ""} onClick={() => handleTabChange("glossary")}>
            Glossary Terms
          </button>
          <button className={activeTab === "research" ? "active" : ""} onClick={() => handleTabChange("research")}>
            Indexed Research
          </button>
          <button className={activeTab === "articles" ? "active" : ""} onClick={() => handleTabChange("articles")}>
            Articles
          </button>
        </div>
      </section>

      {/* Alphabet Navigation */}
      <div className="alphabet-navigation">
        <button className={activeLetter === "all" ? "active" : ""} onClick={() => handleLetterChange("all")}>
          All
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={activeLetter === letter ? "active" : ""}
            onClick={() => handleLetterChange(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Glossary Section */}
        {(activeTab === "all" || activeTab === "glossary") && (
          <section className="glossary-section">
            <h2>ICT Glossary Terms</h2>
            <div className="glossary-list">
              {filteredGlossary.slice(0, 8).map((term) => (
                <div className="glossary-item" key={term.id}>
                  <div className="glossary-term" onClick={() => toggleTermExpansion(term.id)}>
                    <h3>{term.term}</h3>
                    <span className={`expand-icon ${expandedTerm === term.id ? "expanded" : ""}`}>
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
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </div>
                  {expandedTerm === term.id && (
                    <div className="glossary-definition">
                      <p>{term.definition}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {activeTab === "glossary" && (
              <div className="view-more">
                <button>View All Glossary Terms</button>
              </div>
            )}
          </section>
        )}

        {/* Research Papers Section */}
        {(activeTab === "all" || activeTab === "research") && (
          <section className="research-section">
            <h2>Indexed Research Papers</h2>
            <div className="research-grid">
              {currentResearch.map((paper) => (
                <div className="research-item" key={paper.id}>
                  <h3>{paper.title}</h3>
                  <p>{paper.description}</p>
                  <div className="research-meta">
                    <div className="research-actions">
                      <button className="like-button">
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
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span>{paper.likes}</span>
                      </button>
                      <button className="share-button">
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
                          <circle cx="18" cy="5" r="3"></circle>
                          <circle cx="6" cy="12" r="3"></circle>
                          <circle cx="18" cy="19" r="3"></circle>
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                      </button>
                    </div>
                    <a href={`/research/${paper.id}`} className="read-more">
                      Read Paper
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {activeTab === "research" && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
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
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
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
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </section>
        )}

        {/* Articles Section */}
        {(activeTab === "all" || activeTab === "articles") && (
          <section className="articles-section">
            <h2>Featured ICT Articles</h2>
            <div className="articles-grid">
              {articles.map((article) => (
                <div className="article-card" key={article.id}>
                  <div className="article-image">
                    <img src={article.image || "/placeholder.svg?height=200&width=300"} alt={article.title} />
                  </div>
                  <div className="article-content">
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <a href={`/articles/${article.id}`} className="read-more-button">
                      Read More
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {activeTab === "articles" && (
              <div className="view-more">
                <button>View All Articles</button>
              </div>
            )}
          </section>
        )}

        {/* Graph Section */}
        <section className="graph-section">
          <h2>ICT Trends Analysis</h2>
          <div className="graph-container">
            <canvas id="trendChart" width="800" height="400"></canvas>
            <div className="graph-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "#4361EE" }}></div>
                <span>AI Adoption in ICT Sector (2018-2023)</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SearchPage

