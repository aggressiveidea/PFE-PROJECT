"use client";

import { useState, useEffect } from "react";
import { FileText, Eye, Search, Filter, SortDesc } from "lucide-react";
import Header from "../components/forHome/Header";
import Sidebar from "../components/forDashboard/Sidebar";
import WelcomeSection from "../components/forDashboard/WelcomeSection";
import AddArticleNotif from "../components/forContentAdmin/AddArticleNotif";
import ArticlePreview from "../components/forContentAdmin/ArticlePreview";
import "./DashboardContentAdmin.css";
import { getUserById } from "../services/Api";

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

  // Set dark mode based on system preference
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
    if (prefersDark) document.body.classList.add("dark-mode");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  useEffect(() => {
    const storedArticles = JSON.parse(localStorage.getItem("articles") || "[]");
   
    const fetchArticlesWithUsers = async () => {
      const articlesWithUsers = await Promise.all(
        storedArticles.map(async (article) => {
          try
          {
            console.log( article );
            console.log( article.ownerId );
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

  // Get all unique categories for filter
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

  const handleReadArticle = (article) => {
    setSelectedArticle(article);
  };

  const handleValidateArticle = (article) => {
    setArticleStatuses((prev) => ({
      ...prev,
      [article._id]: "validated",
    }));
  };

  const handleRejectArticle = (article) => {
    setArticleStatuses((prev) => ({
      ...prev,
      [article._id]: "rejected",
    }));
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
                        selectedArticle?.id === article._id
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
                <ArticlePreview
                  article={selectedArticle}
                  onValidate={
                    selectedArticle
                      ? () => handleValidateArticle(selectedArticle)
                      : null
                  }
                  onReject={
                    selectedArticle
                      ? () => handleRejectArticle(selectedArticle)
                      : null
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
