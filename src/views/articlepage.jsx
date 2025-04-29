"use client";

import { useState, useRef, useEffect } from "react";
//import Footer from "../components/forarticle/Footer";
import FilterSection from "../components/forarticle/FilterSection";
import UpdateArticleForm from "../components/forarticle/UpdateArticleForm";
import ArticleCard from "../components/forarticle/ArticleCard";
import { ThemeProvider } from "../components/forarticle/ThemeContext";
import { useTheme } from "../components/forarticle/ThemeContext";
import "../components/forarticle/globals.css";
import Header from "../components/forHome/Header";
import Trends from "../components/forarticle/TrendingTopics";
import Authors from "../components/forarticle/TopCreators";
import { getallarticles } from "../services/Api";
import { deletearticle } from "../services/Api";
import { updatearticle } from "../services/Api";
import { toparticles } from "../services/Api";
import { X } from "lucide-react";
import Footer from "../components/forHome/Footer"


function Articlepage() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [ darkMode, setDarkMode ] = useState( false );

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [languageFilter, setLanguageFilter] = useState("All Languages");
  const [articles, setArticles] = useState([]);
  const [articleToEdit, setArticleToEdit] = useState(null);
  const [ showUpdateForm, setShowUpdateForm ] = useState( false );

  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [language, setLanguage] = useState("en");
  const [index, setIndex] = useState(13);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const articlesRef = useRef(null);
  const addArticleRef = useRef(null);
  const servicesRef = useRef(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [topArticles, setTopArticles] = useState([]);

  const fetchArticles = async () => {
    setLoading(true); // Start loading

    try {
      console.log("Fetching articles...");
      const response = await getallarticles(0);

      console.log("Response received here:", response);

      if (response && Array.isArray(response)) {
        setArticles(response);

        setAlertMessage("Articles loaded successfully!");
      } else {
        setAlertMessage("No articles found.");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setAlertMessage("Error loading articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchtoparticle = async () => {
    try {
      const response = await toparticles();
      if (response && Array.isArray(response)) {
        setTopArticles(response);
      } else {
        setTopArticles([]);
      }
    } catch (error) {
      console.error("Error fetching top articles:", error);
    }
  };

  useEffect(() => {
    fetchtoparticle();
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add garden color effect to CTA button on hover
  useEffect(() => {
    const ctaButton = document.querySelector(".cta-button");
    if (ctaButton) {
      ctaButton.addEventListener("mouseenter", () => {
        ctaButton.classList.add("garden-hover");
      });
      ctaButton.addEventListener("mouseleave", () => {
        ctaButton.classList.remove("garden-hover");
      });
    }

    return () => {
      if (ctaButton) {
        ctaButton.removeEventListener("mouseenter", () => {});
        ctaButton.removeEventListener("mouseleave", () => {});
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];

    setFavorites(updatedFavorites);
  };

  const handleEditArticle = (id) => {
    const article = articles.find((article) => article._id === id);
    if (!article || !user) return;

    const canEdit =
      user.role === "Content-admin" ||
      (user.role === "Ict-expert" && user.id === article.ownerId);

    if (canEdit) {
      setArticleToEdit(article);
      // Show form
      setShowUpdateForm(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }
  };

  const handleUpdateArticle = async (updatedArticle) => {
    try {
      // Fetch the response
      const response = await updatearticle(updatedArticle._id, updatedArticle);

      if (!response.success) {
        throw new Error("Error updating article");
      }

      // Update the articles in the state
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === updatedArticle._id ? updatedArticle : article
        )
      );

      // Close the update form and reset the article to edit
      setShowUpdateForm(false);
      setArticleToEdit(null);
      // Re-enable scrolling
      document.body.style.overflow = "auto";

      console.log("Successfully updated");

      // Fetch the updated list of articles (if necessary)
      fetchArticles();
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setArticleToEdit(null);
    // Re-enable scrolling
    document.body.style.overflow = "auto";
  };

  const handleDeleteArticle = async (id) => {
    const article = articles.find((article) => article._id === id);
    if (!article || !user) return;

    const canDelete =
      user.role === "Content-admin" ||
      (user.role === "Ict-expert" && user.id === article.ownerId);

    if (canDelete) {
      setArticles(articles.filter((article) => article._id !== id));

      try {
        const response = await deletearticle(id);

        if (!response.ok) {
          throw new Error("Error deleting article");
        }

        console.log("Successfully deleted");
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleShowingMore = async () => {
    setLoadingMore(true);

    try {
      console.log("Loading more articles...");
      const response = await getallarticles(index);

      console.log("Response for loading more:", response);

      if (response && Array.isArray(response)) {
        setArticles((prev) => [...prev, ...response]);
        setIndex((prev) => prev + 12);

        // If we got less than 12, then there's no more data
        if (response.length === 0) {
          setHasMore(false);
        }

        setAlertMessage("Articles loaded successfully!");
      } else {
        setHasMore(false); // No articles returned
        setAlertMessage("No more articles found.");
      }
    } catch (error) {
      console.error("Error fetching more articles:", error);
      setAlertMessage("Error loading more articles. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Filter articles based on search, category, and language
  const filteredArticles = articles.filter((article) => {
    // Filter by search term
    if (
      searchTerm &&
      !article.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !article.content?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !article.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by category
    if (
      categoryFilter !== "All Categories" &&
      article.category !== categoryFilter
    ) {
      return false;
    }

    // Filter by language
    if (
      languageFilter !== "All Languages" &&
      !article.language?.includes(languageFilter)
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <Header
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
      />
      <div className="stars-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="shooting-star"></div>
      <div className="shooting-star shooting-star2"></div>

      <main className="main-content-article">
        {/* Trending Topics Section with Unique Styling */}
        <section className="trending-section">
          <Trends />
        </section>

        {/* Authors Section */}
        <section className="authors-section">
          <Authors />
        </section>

        {/* Articles Section */}
        <section ref={articlesRef} className="articles-section">
          <h2 className="section-title">Latest Articles</h2>
          <p className="section-subtitle">
            Stay informed with our curated collection of articles on ICT laws
            and regulations
          </p>

          <FilterSection
            onSearch={setSearchTerm}
            onCategoryChange={setCategoryFilter}
            onLanguageChange={setLanguageFilter}
            setArticles={setArticles}
          />

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading articles...</p>
            </div>
          ) : (
            <div className="articles-container">
              <div className="article-grid">
                {filteredArticles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    isFavorite={favorites.includes(article._id)}
                    onToggleFavorite={() => toggleFavorite(article._id)}
                    onEdit={handleEditArticle}
                    onDelete={handleDeleteArticle}
                  />
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <p className="no-results">
                  No articles match your search criteria.
                </p>
              )}

              {hasMore && filteredArticles.length > 0 && (
                <button
                  className="show-more"
                  onClick={handleShowingMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Show More"}
                </button>
              )}
            </div>
          )}
        </section>

        {/* Update Form Modal */}
        {showUpdateForm && (
          <div className="update-form-overlay" onClick={handleCloseUpdateForm}>
            <div
              className="update-form-container"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="update-form-close"
                onClick={handleCloseUpdateForm}
              >
                <X size={24} />
              </button>
              <UpdateArticleForm
                article={articleToEdit}
                onUpdate={handleUpdateArticle}
                onClose={handleCloseUpdateForm}
              />
            </div>
          </div>
        )}
      </main>

      <Footer
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Articlepage />
    </ThemeProvider>
  );
}

export default App;
