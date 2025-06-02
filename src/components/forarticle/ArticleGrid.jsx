import { useState, useEffect, useCallback } from "react";
import ArticleCard from "./ArticleCard";
import "./article-grid.css";
import { X } from "lucide-react";
import { getallarticles } from "../../services/Api";

export default function ArticlesSection({
  searchTerm,
  selectedCategory,
  selectedLanguage,
}) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const articlesPerPage = 6;


  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getallarticles(0);
      console.log("Response received:", response);

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
      setIsLoading(false);
    }
  }, []);

 
  useEffect(() => {
    fetchArticles();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector(".articles-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, [fetchArticles]);

  useEffect(() => {
    if (articles.length > 0) {
      let filtered = [...articles];

      if (searchTerm && searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (article) =>
            article.title.toLowerCase().includes(term) ||
            article.content.toLowerCase().includes(term)
        );
      }

      if (selectedCategory && selectedCategory !== "All Categories") {
        filtered = filtered.filter(
          (article) => article.category === selectedCategory
        );
      }

      if (selectedLanguage && selectedLanguage !== "All Languages") {
        filtered = filtered.filter(
          (article) => article.language === selectedLanguage
        );
      }

      setFilteredArticles(filtered);
      setVisibleArticles(filtered.slice(0, page * articlesPerPage));
      setHasMore(filtered.length > page * articlesPerPage);
    }
  }, [
    searchTerm,
    selectedCategory,
    selectedLanguage,
    articles,
    page,
    articlesPerPage,
  ]);

  useEffect(() => {
    try {
      const storedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      setFavorites(storedFavorites);
    } catch (e) {
      console.error("Error loading favorites:", e);
    }
  }, []);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const endIndex = nextPage * articlesPerPage;

    setVisibleArticles(filteredArticles.slice(0, endIndex));
    setPage(nextPage);
    setHasMore(endIndex < filteredArticles.length);
  }, [page, filteredArticles, articlesPerPage]);

  const handleToggleFavorite = useCallback((articleId) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(articleId);
      const updatedFavorites = isFavorite
        ? prevFavorites.filter((id) => id !== articleId)
        : [...prevFavorites, articleId];

      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);
  const handleEditArticle = useCallback(
    (articleId) => {
      const article = articles.find((a) => a._id === articleId);
      if (article) {
        setCurrentArticle(article);
        setShowUpdateForm(true);
      }
    },
    [articles]
  );

   
  const handleDeleteArticle = useCallback(
    (articleId) => {
      if (window.confirm("Are you sure you want to delete this article?")) {
        setArticles((prev) => prev.filter((a) => a._id !== articleId));
        setFilteredArticles((prev) => prev.filter((a) => a._id !== articleId));
        setVisibleArticles((prev) => prev.filter((a) => a._id !== articleId));
        if (favorites.includes(articleId)) {
          handleToggleFavorite(articleId);
        }
      }
    },
    [favorites, handleToggleFavorite]
  );

  const handleCloseUpdateForm = useCallback(() => {
    setShowUpdateForm(false);
    setCurrentArticle(null);
  }, []);

  if (isLoading) {
    return <div className="loading">Loading articles...</div>;
  }

  return (
    <section className={`articles-section ${sectionVisible ? "visible" : ""}`}>
      <h2 className="section-title">Recent Articles</h2>
      <p className="section-subtitle">
        Explore the latest articles on ICT laws and regulations from our expert
        contributors.
      </p>

      <div className="articles-container">
        {filteredArticles.length === 0 ? (
          <div className="no-results">
            <p>No articles found matching your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="article-grid">
              {visibleArticles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  isFavorite={favorites.includes(article._id)}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              ))}
            </div>

            {hasMore && (
              <button className="show-more" onClick={loadMore}>
                <span>Show More Articles</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Update Form Modal */}
      {showUpdateForm && currentArticle && (
        <div className="update-form-overlay">
          <div className="update-form-container">
            <button
              className="update-form-close"
              onClick={handleCloseUpdateForm}
            >
              <X size={24} />
            </button>
            {/* Insert your UpdateArticleForm component here */}
          </div>
        </div>
      )}
    </section>
  );
}
