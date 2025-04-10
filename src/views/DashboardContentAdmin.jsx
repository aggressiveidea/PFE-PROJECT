"use client"

import { useState, useEffect } from "react"
import { FileText, Eye, Search, Filter, SortDesc } from "lucide-react"
import Header from "../components/forHome/Header"
import Sidebar from "../components/forDashboard/Sidebar"
import WelcomeSection from "../components/forDashboard/WelcomeSection"
import AddArticleNotif from "../components/forContentAdmin/AddArticleNotif"
import ArticlePreview from "../components/forContentAdmin/ArticlePreview"
import "./DashboardContentAdmin.css"

// Sample images - replace with your actual imports
const image1 = "/placeholder.svg?height=200&width=200"
const image2 = "/placeholder.svg?height=200&width=200"

// Sample articles data
const articlesData = [
  {
    id: 1,
    title: "Understanding React Hooks",
    text: "React Hooks are a powerful way to use state and lifecycle methods inside functional components. They allow you to reuse stateful logic between components without changing your component hierarchy. This article explores the most commonly used hooks like useState, useEffect, useContext, and more, with practical examples to help you understand how to implement them in your projects.",
    image: image1,
    userName: "Lamia Boughtofa",
    notifImage: image1,
    time: "2 hours ago",
    category: "Frontend Development",
  },
  {
    id: 2,
    title: "Introduction to Node.js",
    text: "Node.js is a runtime environment that allows developers to run JavaScript on the server side. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications. This article covers the basics of Node.js, how to set up your development environment, and build a simple API.",
    image: image2,
    userName: "Anissa Amari",
    notifImage: image2,
    time: "2 hours ago",
    category: "Backend Development",
  },
  {
    id: 3,
    title: "Getting Started with GraphQL",
    text: "GraphQL is a query language for your API that allows clients to request exactly the data they need. This article introduces the core concepts of GraphQL, explains how it differs from REST, and guides you through setting up a basic GraphQL server with Apollo Server.",
    image: image2,
    userName: "Anissa Amari",
    notifImage: image2,
    time: "2 hours ago",
    category: "API Development",
  },
  {
    id: 4,
    title: "CSS Grid Layout: A Complete Guide",
    text: "CSS Grid Layout is a two-dimensional layout system designed for the web. It lets you lay out items in rows and columns, and has many features that make building complex layouts straightforward. This comprehensive guide covers everything from basic concepts to advanced techniques.",
    image: image2,
    userName: "Anissa Amari",
    notifImage: image2,
    time: "2 hours ago",
    category: "CSS",
  },
  {
    id: 5,
    title: "Introduction to Docker",
    text: "Docker is a platform for developing, shipping, and running applications in containers. This article explains what containers are, how they differ from virtual machines, and walks you through creating your first Docker container.",
    image: image2,
    userName: "Amira feras",
    notifImage: image2,
    time: "2 hours ago",
    category: "DevOps",
  },
]

export default function ContentAdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [articles, setArticles] = useState(articlesData)
  const [articleStatuses, setArticleStatuses] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  // Check system preference for dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDark)

    if (prefersDark) {
      document.body.classList.add("dark-mode")
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (darkMode) {
      document.body.classList.remove("dark-mode")
    } else {
      document.body.classList.add("dark-mode")
    }
  }

  // Filter and sort articles
  const filteredArticles = articles
    .filter((article) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = filterCategory === "all" || article.category === filterCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // Sort by newest/oldest
      if (sortOrder === "newest") {
        return new Date(b.time) - new Date(a.time)
      } else {
        return new Date(a.time) - new Date(b.time)
      }
    })

  // Function to handle article selection
  const handleReadArticle = (article) => {
    setSelectedArticle(article)
  }

  // Function to validate an article
  const handleValidateArticle = (article) => {
    setArticleStatuses((prev) => ({
      ...prev,
      [article.id]: "validated",
    }))
  }

  // Function to reject an article
  const handleRejectArticle = (article) => {
    setArticleStatuses((prev) => ({
      ...prev,
      [article.id]: "rejected",
    }))
  }

  // Get all unique categories for filter
  const categories = ["all", ...new Set(articles.map((article) => article.category))]

  return (
    <div className={`content-admin-container ${darkMode ? "dark-mode" : ""}`}>
      <Header language={language} setLanguage={setLanguage} darkMode={darkMode} />

      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className={`content-admin-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="content-admin-wrapper">
          <div className="content-admin-header">
            <WelcomeSection role="Content-admin" />

            <div className="content-admin-controls">
              <div className="content-admin-search">
                <Search size={18} className="content-admin-search-icon" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="content-admin-search-input"
                />
              </div>

              <div className="content-admin-filters">
                <div className="content-admin-filter">
                  <Filter size={16} />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="content-admin-select"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="content-admin-filter">
                  <SortDesc size={16} />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="content-admin-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="content-admin-grid">
            <section className="content-admin-articles">
              <div className="content-admin-section-header">
                <h2 className="content-admin-section-title">
                  <FileText size={18} />
                  New Articles
                </h2>
                <span className="content-admin-count">{filteredArticles.length}</span>
              </div>

              <div className="content-admin-articles-list">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className={`content-admin-article-card ${
                        selectedArticle?.id === article.id ? "content-admin-article-selected" : ""
                      }`}
                      onClick={() => handleReadArticle(article)}
                    >
                      <AddArticleNotif
                        image={article.notifImage}
                        userName={article.userName}
                        time={article.time}
                        onReadArticle={() => handleReadArticle(article)}
                        onValidate={() => handleValidateArticle(article)}
                        onReject={() => handleRejectArticle(article)}
                        status={articleStatuses[article.id]}
                        title={article.title}
                        category={article.category}
                      />
                    </div>
                  ))
                ) : (
                  <div className="content-admin-empty">
                    <FileText size={48} />
                    <p>No articles found matching your criteria</p>
                  </div>
                )}
              </div>
            </section>

            <section className="content-admin-preview-section">
              <div className="content-admin-section-header">
                <h2 className="content-admin-section-title">
                  <Eye size={18} />
                  Article Preview
                </h2>
              </div>

              <div className="content-admin-preview-wrapper">
                <ArticlePreview
                  article={selectedArticle}
                  onValidate={selectedArticle ? () => handleValidateArticle(selectedArticle) : null}
                  onReject={selectedArticle ? () => handleRejectArticle(selectedArticle) : null}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

