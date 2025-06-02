import { useState, useEffect } from "react"
import {
  FileText,
  Eye,
  Search,
  Filter,
  SortDesc,
  CheckCircle,
  XCircle,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Bell,
  Calendar,
  Clock,
  Code,
  Terminal,
  Database,
  Server,
  Cpu,
  Network,
  Binary,
} from "lucide-react"
import Header from "../components/forHome/Header"
import Sidebar from "../components/forDashboard/Sidebar"
import AddArticleNotif from "../components/forContentAdmin/AddArticleNotif"
import ArticleCard from "../components/forarticle/ArticleCard"
import MessagePreview from "../components/forDashboard/MessagePreview"
import TermPreview from "../components/forDashboard/TermPreview"
import "./DashboardContentAdmin.css"
import {
  getUserById,
  deletearticle,
  approveArticle,
  getUnverifiedMessages,
  GetUnverifiedarticle,
  deleteMessage,
  approveMessage,
} from "../services/Api";

export default function ContentAdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [selectedItem, setSelectedItem] = useState(null)
  const [articles, setArticles] = useState([])
  const [terms, setTerms] = useState([])
  const [notifMessages, setNotifMessages] = useState([])
  const [itemStatuses, setItemStatuses] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [favorites, setFavorites] = useState([])
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  })
  const [stats, setStats] = useState({
    totalArticles: 0,
    pendingArticles: 0,
    totalMessages: 0,
    pendingMessages: 0,
    totalTerms: 0,
    pendingTerms: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

   
  const [activeTab, setActiveTab] = useState("articles")

  const user = JSON.parse(localStorage.getItem("user") || "{}")

   
  const fetchStats = async () => {
    try {
      const calculateStats = () => {
        const storedArticles = JSON.parse(localStorage.getItem("articles") || "[]")
        const storedMessages = JSON.parse(localStorage.getItem("notifMessages") || "[]")
        const storedTerms = JSON.parse(localStorage.getItem("terms") || "[]")

        setStats({
          totalArticles: storedArticles.length,
          pendingArticles: storedArticles.filter((a) => !a.status || a.status === "pending").length,
          totalMessages: storedMessages.length,
          pendingMessages: storedMessages.filter((m) => !m.status || m.status === "pending").length,
          totalTerms: storedTerms.length,
          pendingTerms: storedTerms.filter((t) => !t.status || t.status === "pending").length,
        })
      }

      calculateStats()

       
      const [unverifiedArticles, unverifiedMessages, unverifiedTerms] = await Promise.all([
        GetUnverifiedarticle(),
        getUnverifiedMessages(),
        [],  
      ])

      setStats({
        totalArticles: unverifiedArticles?.length || 0,
        pendingArticles: unverifiedArticles?.length || 0,
        totalMessages: unverifiedMessages?.length || 0,
        pendingMessages: unverifiedMessages?.length || 0,
        totalTerms: unverifiedTerms?.length || 0,
        pendingTerms: unverifiedTerms?.length || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
      showNotification("error", "Failed to load dashboard statistics")
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

   
  const fetchData = async () => {
    setIsLoading(true)
    try {
       
      setSelectedItem(null)

       
      if (activeTab === "articles") {
        try {
          const unverifiedArticles = await GetUnverifiedarticle()

          if (unverifiedArticles && Array.isArray(unverifiedArticles)) {
            const articlesWithUsers = await Promise.all(
              unverifiedArticles.map(async (article) => {
                try {
                  const user = await getUserById(article.ownerId)
                  return {
                    ...article,
                    userName: `${user?.firstName || "Unknown"} ${user?.lastName || ""}`,
                  }
                } catch (err) {
                  console.error("Error fetching user:", err)
                  return { ...article, userName: "Unknown User" }
                }
              }),
            )
            setArticles(articlesWithUsers)
          } else {
            setArticles([])
            console.error("Invalid articles data format:", unverifiedArticles)
          }
        } catch (error) {
          console.error("Error fetching unverified articles:", error)
          showNotification("error", "Failed to load articles")
          setArticles([])
        }
      } else if (activeTab === "terms") {
        try {
          const unverifiedTerms = await getUnverifiedMessages()
          setTerms(Array.isArray(unverifiedTerms) ? unverifiedTerms : [])
        } catch (error) {
          console.error("Error fetching unverified terms:", error)
          showNotification("error", "Failed to load terms")
          setTerms([])
        }
      } else if (activeTab === "messages") {
        try {
          const unverifiedMessages = await getUnverifiedMessages()

          if (unverifiedMessages && Array.isArray(unverifiedMessages)) {
            const messagesWithUsers = await Promise.all(
              unverifiedMessages.map(async (msg) => {
                try
                {
                  
                  console.log("the fucking mssgg", msg)
                  const user = await getUserById(msg.userID)
                  return {
                    ...msg,
                    userName: `${user?.firstName || "Unknown"} ${user?.lastName || ""}`,
                  }
                } catch (err) {
                  console.error("Error fetching user:", err)
                  return { ...msg, userName: "Unknown User" }
                }
              }),
            )
            setNotifMessages(messagesWithUsers)
          } else {
            setNotifMessages([])
            console.error("Invalid messages data format:", unverifiedMessages)
          }
        } catch (error) {
          console.error("Error fetching unverified messages:", error)
          showNotification("error", "Failed to load messages")
          setNotifMessages([])
        }
      }
    } catch (error) {
      console.error(`Error loading ${activeTab}:`, error)
      showNotification("error", `Failed to load ${activeTab}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeTab])

   
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message })

     
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" })
    }, 3000)
  }

   
  const getCategories = () => {
    if (activeTab === "articles") {
      return ["all", ...new Set(articles.map((a) => a.category).filter(Boolean))]
    } else if (activeTab === "terms") {
      return ["all", ...new Set(terms.map((t) => t.category).filter(Boolean))]
    } else if (activeTab === "messages") {
      return ["all", ...new Set(notifMessages.map((m) => m.type).filter(Boolean))]
    }
    return ["all"]
  }

  const categories = getCategories()

   
  const getFilteredItems = () => {
    if (activeTab === "articles") {
      return articles
        .filter((article) => {
          const matchesSearch =
            searchQuery === "" ||
            article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.category?.toLowerCase().includes(searchQuery.toLowerCase())

          const matchesCategory = filterCategory === "all" || article.category === filterCategory

          return matchesSearch && matchesCategory
        })
        .sort((a, b) => {
          return sortOrder === "newest"
            ? new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
            : new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now())
        })
    } else if (activeTab === "terms") {
      return terms
        .filter((term) => {
          const matchesSearch =
            searchQuery === "" ||
            term.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            term.content?.toLowerCase().includes(searchQuery.toLowerCase())

          const matchesCategory = filterCategory === "all" || term.category === filterCategory

          return matchesSearch && matchesCategory
        })
        .sort((a, b) => {
          return sortOrder === "newest"
            ? new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
            : new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now())
        })
    } else if (activeTab === "messages") {
      return notifMessages
        .filter((message) => {
          const matchesSearch =
            searchQuery === "" ||
            message.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.content?.toLowerCase().includes(searchQuery.toLowerCase())

          const matchesCategory = filterCategory === "all" || message.type === filterCategory

          return matchesSearch && matchesCategory
        })
        .sort((a, b) => {
          return sortOrder === "newest"
            ? new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
            : new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now())
        })
    }
    return []
  }

  const filteredItems = getFilteredItems()

  const handleSelectItem = (item) => {
     
    const itemWithProfilePic = {
      ...item,
      profileImgUrl: item.profileImgUrl || item.avatar || user.profileImgUrl || "/placeholder.svg?height=40&width=40",
    }
    setSelectedItem(itemWithProfilePic)
  }

  const handleValidateItem = async (item) => {
    try {
      if (activeTab === "articles") {
         
        const response = await approveArticle(item._id)

        if (response && response.success) {
           
          setItemStatuses((prev) => ({ ...prev, [item._id]: "validated" }))

           
          setStats((prev) => ({
            ...prev,
            pendingArticles: prev.pendingArticles - 1,
          }))

           
          showNotification("success", "Article successfully approved!")

           
          fetchData()
        } else {
          throw new Error("Approval failed")
        }
      } else if (activeTab === "messages") {
         
        const response = await approveMessage(item._id);

        if (response && response.success) {
           
          setItemStatuses((prev) => ({ ...prev, [item._id]: "validated" }));

           
          setStats((prev) => ({
            ...prev,
            pendingMessages: prev.pendingMessages - 1,
          }));

          showNotification("success", "Message successfully approved!");

           
          fetchData();
        } else {
          throw new Error("Approval failed");
        }
      } else if (activeTab === "terms") {
         
        try {
           
          setItemStatuses((prev) => ({ ...prev, [item._id]: "validated" }))

           
          setStats((prev) => ({
            ...prev,
            pendingTerms: prev.pendingTerms - 1,
          }))

          showNotification("success", "Term successfully approved!")

           
          fetchData()
        } catch (error) {
          console.error("Error approving term:", error)
          throw error
        }
      }
    } catch (error) {
      console.error(`Error approving ${activeTab.slice(0, -1)}:`, error)
      showNotification("error", `Failed to approve ${activeTab.slice(0, -1)}. Please try again.`)
    }
  }

  const handleRejectItem = async (item) => {
    try {
      if (activeTab === "articles") {
        console.log("article id for the delete ", item._id)
        const response = await deletearticle(item._id)

        if (!response || response.success !== true) throw new Error("Delete failed")

        console.log("✅ Successfully deleted article from server")

         
        setItemStatuses((prev) => ({ ...prev, [item._id]: "rejected" }))

         
        setStats((prev) => ({
          ...prev,
          totalArticles: prev.totalArticles - 1,
          pendingArticles: prev.pendingArticles - 1,
        }))

         
        showNotification("error", "Article has been rejected and removed.")

         
        if (selectedItem && selectedItem._id === item._id) {
          setSelectedItem(null)
        }

         
        fetchData()
      } else if (activeTab === "messages") {
         
        try {
          const response = await deleteMessage(item._id)

          if (!response) throw new Error("Delete message failed")

           
          setItemStatuses((prev) => ({ ...prev, [item._id]: "rejected" }))

           
          setStats((prev) => ({
            ...prev,
            totalMessages: prev.totalMessages - 1,
            pendingMessages: prev.pendingMessages - 1,
          }))

           
          if (selectedItem && selectedItem._id === item._id) {
            setSelectedItem(null)
          }

          showNotification("error", "Message has been rejected and removed.")

           
          fetchData()
        } catch (error) {
          console.error("Error deleting message:", error)
          throw error
        }
      } else if (activeTab === "terms") {
         
        try {
           
          setItemStatuses((prev) => ({ ...prev, [item._id]: "rejected" }))

           
          setStats((prev) => ({
            ...prev,
            totalTerms: prev.totalTerms - 1,
            pendingTerms: prev.pendingTerms - 1,
          }))

           
          if (selectedItem && selectedItem._id === item._id) {
            setSelectedItem(null)
          }

          showNotification("error", "Term has been rejected and removed.")

           
          fetchData()
        } catch (error) {
          console.error("Error rejecting term:", error)
          throw error
        }
      }
    } catch (error) {
      console.error(`Error rejecting ${activeTab.slice(0, -1)}:`, error)
      showNotification("error", `Failed to reject ${activeTab.slice(0, -1)}. Please try again.`)
    }
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

   
  const formatDate = (dateString) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

   
  const getSectionTitle = () => {
    switch (activeTab) {
      case "articles":
        return "New Articles"
      case "terms":
        return "Terms & Conditions"
      case "messages":
        return "Notification Messages"
      default:
        return "Items"
    }
  }

   
  const getSectionIcon = () => {
    switch (activeTab) {
      case "articles":
        return <FileText size={18} />
      case "terms":
        return <BookOpen size={18} />
      case "messages":
        return <Bell size={18} />
      default:
        return <FileText size={18} />
    }
  }

   
  const renderPreview = () => {
    if (!selectedItem) {
      return (
        <div className="dashboard-empty-preview">
          <div className="dashboard-preview-icon">
            {activeTab === "articles" && <FileText size={48} />}
            {activeTab === "messages" && <MessageSquare size={48} />}
            {activeTab === "terms" && <BookOpen size={48} />}
          </div>
          <h3>No {activeTab.slice(0, -1)} selected</h3>
          <p>Select an {activeTab.slice(0, -1)} from the list to preview its content and take actions.</p>
        </div>
      )
    }

    switch (activeTab) {
      case "articles":
        return (
          <ArticleCard
            article={selectedItem}
            isFavorite={favorites.includes(selectedItem._id)}
            onToggleFavorite={() => toggleFavorite(selectedItem._id)}
          />
        )
      case "messages":
        return <MessagePreview message={selectedItem} />
      case "terms":
        return <TermPreview term={selectedItem} />
      default:
        return <div>No preview available</div>
    }
  }

  return (
    <div className="dashboard-container">
      <Header
        language={language}
        setLanguage={setLanguage}
        darkMode={false}  
      />
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />

      <main className={`dashboard-main ${sidebarCollapsed ? "dashboard-sidebar-collapsed" : ""}`}>
        <div className="dashboard-wrapper">
          {/* Enhanced IT-Themed Welcome Section */}
          <div className="dashboard-welcome-section">
            <div className="dashboard-welcome-content">
              <div className="dashboard-welcome-badge">
                <Terminal size={16} />
                <span>ICT Content Management System</span>
              </div>
              <h1 className="dashboard-welcome-title">
                Welcome back, {user.firstName || "Admin"}!<span className="dashboard-code-accent">{"<dev/>"}</span>
              </h1>
              <p className="dashboard-welcome-subtitle">
                Manage and review ICT content submissions with ease. Keep your platform quality high and your data
                structured.
              </p>

              {/* Simplified IT-themed code snippet */}
              <div className="dashboard-code-snippet">
                <div className="dashboard-code-header">
                  <div className="dashboard-code-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="dashboard-code-title">content-manager.js</span>
                </div>
                <div className="dashboard-code-content">
                  <span className="dashboard-code-line">
                    <span className="dashboard-code-function">console</span>
                    <span className="dashboard-code-punctuation">.</span>
                    <span className="dashboard-code-function">log</span>
                    <span className="dashboard-code-punctuation">(</span>
                    <span className="dashboard-code-string">"welcome back content admin"</span>
                    <span className="dashboard-code-punctuation">);</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-welcome-stats">
              <div className="dashboard-date-info">
                <div className="dashboard-date-item">
                  <Calendar size={16} />
                  <span>
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="dashboard-date-item">
                  <Clock size={16} />
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
            <div className="dashboard-tech-bg">
              <div className="dashboard-circuit-pattern"></div>
              <div className="dashboard-floating-icons">
                <Code size={24} className="dashboard-floating-icon" />
                <Database size={20} className="dashboard-floating-icon" />
                <Server size={22} className="dashboard-floating-icon" />
                <Network size={18} className="dashboard-floating-icon" />
                <Cpu size={26} className="dashboard-floating-icon" />
                <Binary size={16} className="dashboard-floating-icon" />
              </div>
            </div>
          </div>

          {/* Simplified Dashboard Stats - Only Articles and Messages */}
          <div className="dashboard-stats-section">
            <div className="dashboard-stats-grid-simple">
              <div className="dashboard-stat-card-simple dashboard-stat-articles">
                <div className="dashboard-stat-icon-simple">
                  <FileText size={20} />
                </div>
                <div className="dashboard-stat-content-simple">
                  <h3 className="dashboard-stat-title-simple">Articles</h3>
                  <div className="dashboard-stat-number-simple">{stats.totalArticles}</div>
                  <div className="dashboard-stat-sub-simple">Total</div>
                  <div className="dashboard-stat-pending-simple">
                    <span className="dashboard-pending-badge-simple">{stats.pendingArticles}</span>
                    <span>Pending Review</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-stat-card-simple dashboard-stat-messages">
                <div className="dashboard-stat-icon-simple">
                  <MessageSquare size={20} />
                </div>
                <div className="dashboard-stat-content-simple">
                  <h3 className="dashboard-stat-title-simple">Messages</h3>
                  <div className="dashboard-stat-number-simple">{stats.totalMessages}</div>
                  <div className="dashboard-stat-sub-simple">Total</div>
                  <div className="dashboard-stat-pending-simple">
                    <span className="dashboard-pending-badge-simple">{stats.pendingMessages}</span>
                    <span>Pending Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification alert */}
          {notification.show && (
            <div className={`dashboard-notification dashboard-notification-${notification.type}`}>
              {notification.type === "success" ? (
                <CheckCircle size={18} className="dashboard-notification-icon" />
              ) : (
                <AlertCircle size={18} className="dashboard-notification-icon" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Enhanced Controls Section */}
          <div className="dashboard-controls-section">
            <div className="dashboard-controls-header">
              <h2 className="dashboard-controls-title">
                {getSectionIcon()}
                {getSectionTitle()}
                <span className="dashboard-item-count">{filteredItems.length}</span>
              </h2>

              {/* Tabs - Only Articles and Messages */}
              <div className="dashboard-tabs">
                <button
                  className={`dashboard-tab ${activeTab === "articles" ? "active" : ""}`}
                  onClick={() => setActiveTab("articles")}
                >
                  <FileText size={18} />
                  Articles
                  {stats.pendingArticles > 0 && <span className="dashboard-tab-badge">{stats.pendingArticles}</span>}
                </button>
                <button
                  className={`dashboard-tab ${activeTab === "messages" ? "active" : ""}`}
                  onClick={() => setActiveTab("messages")}
                >
                  <MessageSquare size={18} />
                  Messages
                  {stats.pendingMessages > 0 && <span className="dashboard-tab-badge">{stats.pendingMessages}</span>}
                </button>
              </div>
            </div>

            <div className="dashboard-controls">
              <div className="dashboard-search">
                <Search size={18} className="dashboard-search-icon" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dashboard-search-input"
                />
              </div>

              <div className="dashboard-filters">
                <div className="dashboard-filter">
                  <Filter size={16} />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="dashboard-select"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dashboard-filter">
                  <SortDesc size={16} />
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="dashboard-select">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-items-section">
              <div className="dashboard-items-list">
                {isLoading ? (
                  <div className="dashboard-loading">
                    <div className="dashboard-loading-spinner"></div>
                    <p>Loading {activeTab}...</p>
                  </div>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item._id}
                      className={`dashboard-item-card ${
                        selectedItem?._id === item._id ? "dashboard-item-selected" : ""
                      }`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <AddArticleNotif
                        profileImgUrl={user.profileImgUrl}
                        userName={item.userName || item.author || "Unknown User"}
                        time={item.createdAt}
                        onReadArticle={() => handleSelectItem(item)}
                        onValidate={() => handleValidateItem(item)}
                        onReject={() => handleRejectItem(item)}
                        status={itemStatuses[item._id]}
                        title={item.title}
                        category={item.category || item.type}
                      />
                    </div>
                  ))
                ) : (
                  <div className="dashboard-empty">
                    <div className="dashboard-empty-icon">
                      {activeTab === "articles" && <FileText size={48} />}
                      {activeTab === "messages" && <MessageSquare size={48} />}
                    </div>
                    <h3>No {activeTab} found</h3>
                    <p>No {activeTab} match your current search criteria. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="dashboard-preview-section">
              <div className="dashboard-section-header">
                <h3 className="dashboard-section-title">
                  <Eye size={18} />
                  Preview & Actions
                </h3>
              </div>

              <div className="dashboard-preview-wrapper">
                {renderPreview()}

                {selectedItem && !itemStatuses[selectedItem._id] && (
                  <div className="dashboard-notification-actions">
                    <button
                      className="dashboard-btn dashboard-btn-validate"
                      onClick={() => handleValidateItem(selectedItem)}
                    >
                      <CheckCircle size={16} />
                      <span>Approve</span>
                    </button>
                    <button
                      className="dashboard-btn dashboard-btn-reject"
                      onClick={() => handleRejectItem(selectedItem)}
                    >
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {selectedItem && itemStatuses[selectedItem._id] === "validated" && (
                  <div className="dashboard-status dashboard-validated">
                    <CheckCircle size={16} />
                    <span>Approved</span>
                  </div>
                )}

                {selectedItem && itemStatuses[selectedItem._id] === "rejected" && (
                  <div className="dashboard-status dashboard-rejected">
                    <XCircle size={16} />
                    <span>Rejected</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
