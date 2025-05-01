"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Header from "../components/forHome/Header";
import Sidebar from "../components/forDashboard/Sidebar";
import DashboardStats from "../components/forDashboard/DashboardStats";
import AddArticleNotif from "../components/forContentAdmin/AddArticleNotif";
import ArticleCard from "../components/forarticle/ArticleCard";
import MessagePreview from "../components/forDashboard/MessagePreview";
import TermPreview from "../components/forDashboard/TermPreview";
import "./DashboardContentAdmin.css";
import {
  getUserById,
  deletearticle,
  approveArticle,
  getUnverifiedMessages,
  GetUnverifiedarticle,
  deleteMessage,
} from "../services/Api";

export default function ContentAdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [selectedItem, setSelectedItem] = useState(null);
  const [articles, setArticles] = useState([]);
  const [terms, setTerms] = useState([]);
  const [notifMessages, setNotifMessages] = useState([]);
  const [itemStatuses, setItemStatuses] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [favorites, setFavorites] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [stats, setStats] = useState({
    totalArticles: 0,
    pendingArticles: 0,
    totalMessages: 0,
    pendingMessages: 0,
    totalTerms: 0,
    pendingTerms: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Active tab state
  const [activeTab, setActiveTab] = useState("articles");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
    if (prefersDark) document.body.classList.add("dashboard-dark-mode");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dashboard-dark-mode");
  };

  // Calculate dashboard stats from API data
  const fetchStats = async () => {
    try {
      // Get all data for stats calculation
      const [allArticles, allMessages, allTerms] = await Promise.all([]);

         const calculateStats = () => {
           const storedArticles = JSON.parse(
             localStorage.getItem("articles") || "[]"
           );
           const storedMessages = JSON.parse(
             localStorage.getItem("notifMessages") || "[]"
           );
           const storedTerms = JSON.parse(
             localStorage.getItem("terms") || "[]"
           );

           setStats({
             totalArticles: storedArticles.length,
             pendingArticles: storedArticles.filter(
               (a) => !a.status || a.status === "pending"
             ).length,
             totalMessages: storedMessages.length,
             pendingMessages: storedMessages.filter(
               (m) => !m.status || m.status === "pending"
             ).length,
             totalTerms: storedTerms.length,
             pendingTerms: storedTerms.filter(
               (t) => !t.status || t.status === "pending"
             ).length,
           });
         };

         calculateStats();
      // Get unverified/pending items
      const [unverifiedArticles, unverifiedMessages, unverifiedTerms] =
        await Promise.all([
          GetUnverifiedarticle(),
          getUnverifiedMessages(),
          [], // Assuming there's no API for unverified terms yet
        ]);

      setStats({
        totalArticles: allArticles?.length || 0,
        pendingArticles: unverifiedArticles?.length || 0,
        totalMessages: allMessages?.length || 0,
        pendingMessages: unverifiedMessages?.length || 0,
        totalTerms: allTerms?.length || 0,
        pendingTerms: unverifiedTerms?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      showNotification("error", "Failed to load dashboard statistics");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Load data from API based on active tab
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Clear selected item when changing tabs
      setSelectedItem(null);

      // Load data based on active tab
      if (activeTab === "articles") {
        try {
          const unverifiedArticles = await GetUnverifiedarticle();

          if (unverifiedArticles && Array.isArray(unverifiedArticles)) {
            const articlesWithUsers = await Promise.all(
              unverifiedArticles.map(async (article) => {
                try {
                  const user = await getUserById(article.ownerId);
                  return {
                    ...article,
                    userName: `${user?.firstName || "Unknown"} ${
                      user?.lastName || ""
                    }`,
                  };
                } catch (err) {
                  console.error("Error fetching user:", err);
                  return { ...article, userName: "Unknown User" };
                }
              })
            );
            setArticles(articlesWithUsers);
          } else {
            setArticles([]);
            console.error("Invalid articles data format:", unverifiedArticles);
          }
        } catch (error) {
          console.error("Error fetching unverified articles:", error);
          showNotification("error", "Failed to load articles");
          setArticles([]);
        }
      } else if (activeTab === "terms") {
        try {
          const unverifiedTerms = await getUnverifiedMessages();
          setTerms(Array.isArray(unverifiedTerms) ? unverifiedTerms : []);
        } catch (error) {
          console.error("Error fetching unverified terms:", error);
          showNotification("error", "Failed to load terms");
          setTerms([]);
        }
      } else if (activeTab === "messages") {
        try {
          const unverifiedMessages = await getUnverifiedMessages();

          if (unverifiedMessages && Array.isArray(unverifiedMessages)) {
            const messagesWithUsers = await Promise.all(
              unverifiedMessages.map(async (msg) => {
                try {
                  const user = await getUserById(msg.userID);
                  return {
                    ...msg,
                    userName: `${user?.firstName || "Unknown"} ${
                      user?.lastName || ""
                    }`,
                  };
                } catch (err) {
                  console.error("Error fetching user:", err);
                  return { ...msg, userName: "Unknown User" };
                }
              })
            );
            setNotifMessages(messagesWithUsers);
          } else {
            setNotifMessages([]);
            console.error("Invalid messages data format:", unverifiedMessages);
          }
        } catch (error) {
          console.error("Error fetching unverified messages:", error);
          showNotification("error", "Failed to load messages");
          setNotifMessages([]);
        }
      }
    } catch (error) {
      console.error(`Error loading ${activeTab}:`, error);
      showNotification(
        "error",
        `Failed to load ${activeTab}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Show notification function
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Get categories based on active tab
  const getCategories = () => {
    if (activeTab === "articles") {
      return [
        "all",
        ...new Set(articles.map((a) => a.category).filter(Boolean)),
      ];
    } else if (activeTab === "terms") {
      return ["all", ...new Set(terms.map((t) => t.category).filter(Boolean))];
    } else if (activeTab === "messages") {
      return [
        "all",
        ...new Set(notifMessages.map((m) => m.type).filter(Boolean)),
      ];
    }
    return ["all"];
  };

  const categories = getCategories();

  // Filter items based on active tab
  const getFilteredItems = () => {
    if (activeTab === "articles") {
      return articles
        .filter((article) => {
          const matchesSearch =
            searchQuery === "" ||
            article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.userName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            article.category?.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesCategory =
            filterCategory === "all" || article.category === filterCategory;

          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          return sortOrder === "newest"
            ? new Date(b.createdAt || Date.now()) -
                new Date(a.createdAt || Date.now())
            : new Date(a.createdAt || Date.now()) -
                new Date(b.createdAt || Date.now());
        });
    } else if (activeTab === "terms") {
      return terms
        .filter((term) => {
          const matchesSearch =
            searchQuery === "" ||
            term.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            term.content?.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesCategory =
            filterCategory === "all" || term.category === filterCategory;

          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          return sortOrder === "newest"
            ? new Date(b.createdAt || Date.now()) -
                new Date(a.createdAt || Date.now())
            : new Date(a.createdAt || Date.now()) -
                new Date(b.createdAt || Date.now());
        });
    } else if (activeTab === "messages") {
      return notifMessages
        .filter((message) => {
          const matchesSearch =
            searchQuery === "" ||
            message.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.content?.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesCategory =
            filterCategory === "all" || message.type === filterCategory;

          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          return sortOrder === "newest"
            ? new Date(b.createdAt || Date.now()) -
                new Date(a.createdAt || Date.now())
            : new Date(a.createdAt || Date.now()) -
                new Date(b.createdAt || Date.now());
        });
    }
    return [];
  };

  const filteredItems = getFilteredItems();
  console.log( user.profileImgUrl );
  const handleSelectItem = (item) => {
    // Ensure the item has the user's profile picture
    const itemWithProfilePic = {
      ...item,
      // Use the item's profileImgUrl or avatar if available, otherwise use the user's profileImgUrl
     
      profileImgUrl:
        item.profileImgUrl ||
        item.avatar ||
        user.profileImgUrl ||
        "/placeholder.svg?height=40&width=40",
    };
    setSelectedItem(itemWithProfilePic);
  };

  const handleValidateItem = async (item) => {
    try {
      if (activeTab === "articles") {
        // Call API to approve article
        const response = await approveArticle(item._id);

        if (response && response.success) {
          // Update local status
          setItemStatuses((prev) => ({ ...prev, [item._id]: "validated" }));

          // Update stats
          setStats((prev) => ({
            ...prev,
            pendingArticles: prev.pendingArticles - 1,
          }));

          // Show success notification
          showNotification("success", "Article successfully approved!");

          // Refresh the data
          fetchData();
        } else {
          throw new Error("Approval failed");
        }
      } else if (activeTab === "messages") {
        // Handle message approval - assuming there's an API for this
        try {
          // Update local status
          setItemStatuses((prev) => ({ ...prev, [item._id]: "validated" }));

          // Update stats
          setStats((prev) => ({
            ...prev,
            pendingMessages: prev.pendingMessages - 1,
          }));

          showNotification("success", "Message successfully approved!");

          // Refresh the data
          fetchData();
        } catch (error) {
          console.error("Error approving message:", error);
          throw error;
        }
      } else if (activeTab === "terms") {
        // Handle terms approval - assuming there's an API for this
        try {
          // Update local status
          setItemStatuses((prev) => ({ ...prev, [item._id]: "validated" }));

          // Update stats
          setStats((prev) => ({
            ...prev,
            pendingTerms: prev.pendingTerms - 1,
          }));

          showNotification("success", "Term successfully approved!");

          // Refresh the data
          fetchData();
        } catch (error) {
          console.error("Error approving term:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error approving ${activeTab.slice(0, -1)}:`, error);
      showNotification(
        "error",
        `Failed to approve ${activeTab.slice(0, -1)}. Please try again.`
      );
    }
  };

  const handleRejectItem = async (item) => {
    try {
      if (activeTab === "articles") {
        console.log("article id for the delete ", item._id);
        const response = await deletearticle(item._id);

        if (!response || response.success !== true)
          throw new Error("Delete failed");

        console.log("✅ Successfully deleted article from server");

        // Update status
        setItemStatuses((prev) => ({ ...prev, [item._id]: "rejected" }));

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalArticles: prev.totalArticles - 1,
          pendingArticles: prev.pendingArticles - 1,
        }));

        // Show success notification
        showNotification("error", "Article has been rejected and removed.");

        // If the rejected article is currently selected, clear selection
        if (selectedItem && selectedItem._id === item._id) {
          setSelectedItem(null);
        }

        // Refresh the data
        fetchData();
      } else if (activeTab === "messages") {
        // Handle message rejection
        try {
          const response = await deleteMessage(item._id);

          if (!response )
            throw new Error("Delete message failed");

          // Update status
          setItemStatuses((prev) => ({ ...prev, [item._id]: "rejected" }));

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalMessages: prev.totalMessages - 1,
            pendingMessages: prev.pendingMessages - 1,
          }));

          // If the rejected message is currently selected, clear selection
          if (selectedItem && selectedItem._id === item._id) {
            setSelectedItem(null);
          }

          showNotification("error", "Message has been rejected and removed.");

          // Refresh the data
          fetchData();
        } catch (error) {
          console.error("Error deleting message:", error);
          throw error;
        }
      } else if (activeTab === "terms") {
        // Handle terms rejection - assuming there's an API for this
        try {
          // Update status
          setItemStatuses((prev) => ({ ...prev, [item._id]: "rejected" }));

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalTerms: prev.totalTerms - 1,
            pendingTerms: prev.pendingTerms - 1,
          }));

          // If the rejected term is currently selected, clear selection
          if (selectedItem && selectedItem._id === item._id) {
            setSelectedItem(null);
          }

          showNotification("error", "Term has been rejected and removed.");

          // Refresh the data
          fetchData();
        } catch (error) {
          console.error("Error rejecting term:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error rejecting ${activeTab.slice(0, -1)}:`, error);
      showNotification(
        "error",
        `Failed to reject ${activeTab.slice(0, -1)}. Please try again.`
      );
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get section title based on active tab
  const getSectionTitle = () => {
    switch (activeTab) {
      case "articles":
        return "New Articles";
      case "terms":
        return "Terms & Conditions";
      case "messages":
        return "Notification Messages";
      default:
        return "Items";
    }
  };

  // Get section icon based on active tab
  const getSectionIcon = () => {
    switch (activeTab) {
      case "articles":
        return <FileText size={18} />;
      case "terms":
        return <BookOpen size={18} />;
      case "messages":
        return <Bell size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  // Get preview component based on active tab
  const renderPreview = () => {
    if (!selectedItem) {
      return (
        <div className="dashboard-empty-preview">
          {activeTab === "articles" && <FileText size={48} />}
          {activeTab === "messages" && <MessageSquare size={48} />}
          {activeTab === "terms" && <BookOpen size={48} />}
          <p>Select an {activeTab.slice(0, -1)} to preview</p>
        </div>
      );
    }

    switch (activeTab) {
      case "articles":
        return (
          <ArticleCard
            article={selectedItem}
            isFavorite={favorites.includes(selectedItem._id)}
            onToggleFavorite={() => toggleFavorite(selectedItem._id)}
          />
        );
      case "messages":
        return <MessagePreview message={selectedItem} />;
      case "terms":
        return <TermPreview term={selectedItem} />;
      default:
        return <div>No preview available</div>;
    }
  };

  console.log("^^",user.profileImgUrl);
  return (
    <div
      className={`dashboard-container ${darkMode ? "dashboard-dark-mode" : ""}`}
    >
      <Header
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
      />
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main
        className={`dashboard-main ${
          sidebarCollapsed ? "dashboard-sidebar-collapsed" : ""
        }`}
      >
        <div className="dashboard-wrapper">
          {/* Enhanced Welcome Section */}
          <div className="dashboard-welcome-section">
            <div className="dashboard-welcome-content">
              <h1 className="dashboard-welcome-title">Content Management</h1>
              <p className="dashboard-welcome-subtitle">
                Welcome back,{" "}
                <span className="dashboard-welcome-name">
                  {user.firstName || "Admin"}
                </span>
              </p>
            </div>
            <div className="dashboard-welcome-date">
              <div className="dashboard-date-item">
                <Calendar size={16} />
                <span>
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
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

          {/* Dashboard Stats */}
          <DashboardStats
            stats={stats}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Notification alert */}
          {notification.show && (
            <div
              className={`dashboard-notification dashboard-notification-${notification.type}`}
            >
              {notification.type === "success" ? (
                <CheckCircle
                  size={18}
                  className="dashboard-notification-icon"
                />
              ) : (
                <AlertCircle
                  size={18}
                  className="dashboard-notification-icon"
                />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Tabs Section */}
          <div className="dashboard-tabs">
            <button
              className={`dashboard-tab ${
                activeTab === "articles" ? "active" : ""
              }`}
              onClick={() => setActiveTab("articles")}
            >
              <FileText size={18} className="dashboard-tab-icon" />
              Articles
            </button>
            <button
              className={`dashboard-tab ${
                activeTab === "messages" ? "active" : ""
              }`}
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare size={18} className="dashboard-tab-icon" />
              Messages
            </button>
            <button
              className={`dashboard-tab ${
                activeTab === "terms" ? "active" : ""
              }`}
              onClick={() => setActiveTab("terms")}
            >
              <BookOpen size={18} className="dashboard-tab-icon" />
              Terms
            </button>
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
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="dashboard-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-items-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  {getSectionIcon()}
                  {getSectionTitle()}
                </h2>
                <span className="dashboard-count">{filteredItems.length}</span>
              </div>

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
                        selectedItem?._id === item._id
                          ? "dashboard-item-selected"
                          : ""
                      }`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <AddArticleNotif
                        profileImgUrl={
                          user.profileImgUrl 
                        }
                        userName={
                          item.userName || item.author || "Unknown User"
                        }
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
                    {activeTab === "articles" && <FileText size={48} />}
                    {activeTab === "messages" && <MessageSquare size={48} />}
                    {activeTab === "terms" && <BookOpen size={48} />}
                    <p>No {activeTab} found matching your criteria</p>
                  </div>
                )}
              </div>
            </section>

            <section className="dashboard-preview-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  <Eye size={18} />
                  {activeTab.slice(0, 1).toUpperCase() +
                    activeTab.slice(1, -1)}{" "}
                  Preview
                </h2>
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
                      <span>Validate</span>
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

                {selectedItem &&
                  itemStatuses[selectedItem._id] === "validated" && (
                    <div className="dashboard-status dashboard-validated">
                      <CheckCircle size={16} />
                      <span>Validated</span>
                    </div>
                  )}

                {selectedItem &&
                  itemStatuses[selectedItem._id] === "rejected" && (
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
  );
}
