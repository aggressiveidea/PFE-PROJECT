"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import Header from "../components/forHome/Header"
import Footer from "../components/forHome/Footer"
import Sidebar from "../components/forDashboard/Sidebar"
import NotificationToast from "../components/forContentAdmin/NotificationToast"
import SearchAndFilter from "../components/forContentAdmin/SearchAndFilter"
import ArticleList from "../components/forContentAdmin/Articlelist"
import ArticlePreview from "../components/forContentAdmin/ArticlePreview"
import "../views/ContentAdminDashboard.css"

export default function ContentAdminDashboard() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingArticles, setPendingArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All Categories")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("info")
  const [notificationCount, setNotificationCount] = useState(0)

  const categories = [
    "All Categories",
    "Contrats informatiques",
    "Criminalité informatique",
    "Données personnelles",
    "Organisations",
    "Propriété intellectuelle",
    "Réseaux",
    "Commerce électronique",
  ]

  // Load user and pending articles
  useEffect(() => {
    const loadUserAndArticles = () => {
      try {
        const userString = localStorage.getItem("user")
        if (userString) {
          const userData = JSON.parse(userString)
          setUser(userData)
        }

        // Load pending articles from localStorage
        const pendingArticlesData = JSON.parse(localStorage.getItem("pendingArticles") || "[]")
        setPendingArticles(pendingArticlesData)
        setNotificationCount(pendingArticlesData.length)
      } catch (error) {
        console.error("Error loading data:", error)
        // Initialize with empty arrays to prevent undefined errors
        setPendingArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndArticles()

    // Listen for new article submissions
    const handleNewArticle = () => {
      try {
        const pendingArticlesData = JSON.parse(localStorage.getItem("pendingArticles") || "[]")
        setPendingArticles(pendingArticlesData)
        setNotificationCount(pendingArticlesData.length)

        if (pendingArticlesData.length > 0) {
          setNotificationMessage("New article submission received!")
          setNotificationType("info")
          setShowNotification(true)

          // Hide notification after 5 seconds
          setTimeout(() => {
            setShowNotification(false)
          }, 5000)
        }
      } catch (error) {
        console.error("Error handling new article:", error)
      }
    }

    window.addEventListener("pendingArticlesUpdated", handleNewArticle)

    return () => {
      window.removeEventListener("pendingArticlesUpdated", handleNewArticle)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

  // Filter articles based on search term and category
  const filteredArticles = pendingArticles.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.authorName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === "All Categories" || article.category === filterCategory

    return matchesSearch && matchesCategory
  })

  // Handle article validation
  const handleValidateArticle = (articleId) => {
    // Get the article to validate
    const articleToValidate = pendingArticles.find((article) => article._id === articleId)

    if (!articleToValidate) return

    // Remove from pending articles
    const updatedPendingArticles = pendingArticles.filter((article) => article._id !== articleId)
    setPendingArticles(updatedPendingArticles)
    localStorage.setItem("pendingArticles", JSON.stringify(updatedPendingArticles))

    // Add to validated articles
    const validatedArticles = JSON.parse(localStorage.getItem("validatedArticles") || "[]")
    validatedArticles.push({
      ...articleToValidate,
      validatedAt: new Date().toISOString(),
      validatedBy: user?._id,
      status: "approved",
    })
    localStorage.setItem("validatedArticles", JSON.stringify(validatedArticles))

    // Update articles list to include the validated article
    const allArticles = JSON.parse(localStorage.getItem("articles") || "[]")
    allArticles.push({
      ...articleToValidate,
      validatedAt: new Date().toISOString(),
      validatedBy: user?._id,
      status: "approved",
    })
    localStorage.setItem("articles", JSON.stringify(allArticles))

    // Dispatch event to update UI
    window.dispatchEvent(new Event("pendingArticlesUpdated"))
    window.dispatchEvent(new Event("articlesUpdated"))

    // Show success notification
    setNotificationMessage("Article approved and published successfully!")
    setNotificationType("success")
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 5000)

    // Close the article preview
    setSelectedArticle(null)
    setNotificationCount(updatedPendingArticles.length)
  }

  // Handle article rejection
  const handleRejectArticle = (articleId) => {
    // Get the article to reject
    const articleToReject = pendingArticles.find((article) => article._id === articleId)

    if (!articleToReject) return

    // Remove from pending articles
    const updatedPendingArticles = pendingArticles.filter((article) => article._id !== articleId)
    setPendingArticles(updatedPendingArticles)
    localStorage.setItem("pendingArticles", JSON.stringify(updatedPendingArticles))

    // Add to rejected articles
    const rejectedArticles = JSON.parse(localStorage.getItem("rejectedArticles") || "[]")
    rejectedArticles.push({
      ...articleToReject,
      rejectedAt: new Date().toISOString(),
      rejectedBy: user?._id,
      status: "rejected",
    })
    localStorage.setItem("rejectedArticles", JSON.stringify(rejectedArticles))

    // Dispatch event to update UI
    window.dispatchEvent(new Event("pendingArticlesUpdated"))

    // Show rejection notification
    setNotificationMessage("Article has been rejected")
    setNotificationType("error")
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 5000)

    // Close the article preview
    setSelectedArticle(null)
    setNotificationCount(updatedPendingArticles.length)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const openMobileMenu = () => {
    setMobileMenuOpen(true)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (isLoading) {
    return (
      <div className="content-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading content dashboard...</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={closeMobileMenu}
        darkMode={darkMode}
      />

      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Header language={language} setLanguage={setLanguage} darkMode={darkMode} openMobileMenu={openMobileMenu} />

        <div className="content-dashboard-container">
          {showNotification && (
            <NotificationToast
              message={notificationMessage}
              type={notificationType}
              onClose={() => setShowNotification(false)}
            />
          )}

          <div className="content-dashboard-header">
            <div className="content-dashboard-title">
              <h1>Content Dashboard</h1>
              <p>Review and manage article submissions</p>
            </div>
            <div className="content-dashboard-stats">
              <div className="pending-badge">
                <Bell size={16} />
                <span>{pendingArticles.length} Pending</span>
              </div>
            </div>
          </div>

          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            categories={categories}
          />

          <div className="content-dashboard-grid">
            <ArticleList
              articles={filteredArticles}
              pendingCount={pendingArticles.length}
              selectedArticleId={selectedArticle?._id}
              onSelectArticle={setSelectedArticle}
              formatDate={formatDate}
            />

            <div className="article-preview-container">
              <ArticlePreview
                article={selectedArticle}
                onValidate={handleValidateArticle}
                onReject={handleRejectArticle}
                formatDate={formatDate}
              />
            </div>
          </div>
        </div>

        <Footer darkMode={darkMode} setDarkMode={setDarkMode} language={language} />
      </div>
    </div>
  )
}

