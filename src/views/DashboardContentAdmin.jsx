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
} from "lucide-react";
import Header from "../components/forHome/Header";
import Sidebar from "../components/forDashboard/Sidebar";
import WelcomeSection from "../components/forDashboard/WelcomeSection";
import AddArticleNotif from "../components/forContentAdmin/AddArticleNotif";
import ArticleCard from "../components/forarticle/ArticleCard";
import "./DashboardContentAdmin.css";
import { getUserById, deletearticle } from "../services/Api";

export default function ContentAdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [articleStatuses, setArticleStatuses] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [articleToEdit, setArticleToEdit] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // New state for active tab
  const [activeTab, setActiveTab] = useState("articles");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
    if (prefersDark) document.body.classList.add("dark-mode");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  useEffect(() => {
    const storedArticles = JSON.parse(localStorage.getItem("articles") || "[]");

    const fetchArticlesWithUsers = async () => {
      const articlesWithUsers = await Promise.all(
        storedArticles.map(async (article) => {
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
    };

    fetchArticlesWithUsers();
  }, []);

  const categories = ["all", ...new Set(articles.map((a) => a.category))];

  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || article.category === filterCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });

  const handleReadArticle = (article) => setSelectedArticle(article);

  const handleValidateArticle = (article) =>
    setArticleStatuses((prev) => ({ ...prev, [article._id]: "validated" }));

  const handleRejectArticle = async (article) => {
    try {
      console.log("article id for the delete ", article._id);
      const response = await deletearticle(article._id);
      if (response.succes !== true) throw new Error("Delete failed");
      console.log("✅ Successfully deleted from server");
    } catch (error) {
      console.error("❌ Delete error:", error);
    }

    // Load articles from localStorage
    const storedArticles = JSON.parse(localStorage.getItem("articles") || "[]");

    // Filter out the deleted article
    const updatedArticles = storedArticles.filter(
      (a) => a && a._id !== article._id
    );

    // Save back to localStorage
    localStorage.setItem("articles", JSON.stringify(updatedArticles));

    console.log("✅ Updated localStorage after deletion");

    // Update status
    setArticleStatuses((prev) => ({ ...prev, [article._id]: "rejected" }));
  };

  const handleEditArticle = (id) => {
    const article = articles.find((a) => a._id === id);
    const canEdit =
      user.role === "Content-admin" ||
      (user.role === "Ict-expert" && user.id === article.ownerId);

    if (canEdit) {
      setArticleToEdit(article);
      setShowUpdateForm(true);
    }
  };

  const handleDeleteArticle = async (id) => {
    const article = articles.find((a) => a._id === id);

    if (
      user.role === "Content-admin" ||
      (user.role === "Ict-expert" && user.id === article.ownerId)
    ) {
      setArticles((prev) => prev.filter((a) => a._id !== id));
      try {
        const response = await deletearticle(id);
        if (!response.ok) throw new Error("Delete failed");
        console.log("Successfully deleted");
      } catch (error) {
        console.error("Delete error:", error);
      }
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

  return (
    <div className={`content-admin-container ${darkMode ? "dark-mode" : ""}`}>
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
        className={`content-admin-main ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div className="content-admin-wrapper">
          <div className="content-admin-header">
            <WelcomeSection role="Content-admin" />

            {/* New Tabs Section */}
            <div className="content-admin-tabs">
              <button
                className={`content-admin-tab ${
                  activeTab === "articles" ? "active" : ""
                }`}
                onClick={() => setActiveTab("articles")}
              >
                <FileText size={18} className="content-admin-tab-icon" />
                Articles
              </button>
              <button
                className={`content-admin-tab ${
                  activeTab === "messages" ? "active" : ""
                }`}
                onClick={() => setActiveTab("messages")}
              >
                <MessageSquare size={18} className="content-admin-tab-icon" />
                Messages
              </button>
              <button
                className={`content-admin-tab ${
                  activeTab === "terms" ? "active" : ""
                }`}
                onClick={() => setActiveTab("terms")}
              >
                <BookOpen size={18} className="content-admin-tab-icon" />
                Terms
              </button>
            </div>

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
                <span className="content-admin-count">
                  {filteredArticles.length}
                </span>
              </div>

              <div className="content-admin-articles-list">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <div
                      key={article._id}
                      className={`content-admin-article-card ${
                        selectedArticle?._id === article._id
                          ? "content-admin-article-selected"
                          : ""
                      }`}
                      onClick={() => handleReadArticle(article)}
                    >
                      <AddArticleNotif
                        image={article.imageUrl}
                        userName={article.userName}
                        time={article.createdAt}
                        onReadArticle={() => handleReadArticle(article)}
                        onValidate={() => handleValidateArticle(article)}
                        onReject={() => handleRejectArticle(article)}
                        status={articleStatuses[article._id]}
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
                {selectedArticle ? (
                  <>
                    <ArticleCard
                      article={selectedArticle}
                      isFavorite={favorites.includes(selectedArticle._id)}
                      onToggleFavorite={() =>
                        toggleFavorite(selectedArticle._id)
                      }
                      onEdit={() => handleEditArticle(selectedArticle._id)}
                      onDelete={() => handleDeleteArticle(selectedArticle._id)}
                    />

                    <div className="article-notification-actions">
                      {!articleStatuses[selectedArticle._id] && (
                        <>
                          <button
                            className="btn btn-validate"
                            onClick={() =>
                              handleValidateArticle(selectedArticle)
                            }
                          >
                            <CheckCircle size={16} />
                            <span>Validate</span>
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => handleRejectArticle(selectedArticle)}
                          >
                            <XCircle size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {articleStatuses[selectedArticle._id] === "validated" && (
                        <div className="article-status validated">
                          <CheckCircle size={16} />
                          <span>Validated</span>
                        </div>
                      )}
                      {articleStatuses[selectedArticle._id] === "rejected" && (
                        <div className="article-status rejected">
                          <XCircle size={16} />
                          <span>Rejected</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="content-admin-no-preview">
                    Select an article to preview
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
