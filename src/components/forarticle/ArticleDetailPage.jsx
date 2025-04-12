"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./article-detail.css";
import RelatedArticleCard from "./RelatedArticleCard";
import { getArticleById } from "../../services/Api";
import { getarticlebycat } from "../../services/Api";
import Footer from "./Footer";
import Image from "../../assets/cde57eb697132f9d4316f8076379469d.jpg";

// Define the category colors (same as in ArticleCard)
const categoryColors = {
  "Contrats informatiques": { bg: "bg-blue-100", text: "text-blue-600" },
  "Criminalité informatique": { bg: "bg-purple-100", text: "text-purple-600" },
  "Données personnelles": { bg: "bg-green-100", text: "text-green-600" },
  Organisations: { bg: "bg-pink-100", text: "text-pink-600" },
  "Propriété intellectuelle": { bg: "bg-orange-100", text: "text-orange-600" },
  Réseaux: { bg: "bg-indigo-100", text: "text-indigo-600" },
  "Commerce électronique": { bg: "bg-yellow-100", text: "text-yellow-600" },
  Cybersecurity: { bg: "bg-yellow-100", text: "text-yellow-600" },
};

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(""); // For error messages

  const fetchRelatedArticles = async (category, limit) => {
    try {
      console.log("Fetching related articles for category:", category);
      const response = await getarticlebycat(category, limit);
      console.log("API response:", response);
      setRelatedArticles(response);
    } catch (error) {
      console.error("Error fetching related articles:", error);
    }
  };
  useEffect(() => {
    // Fetch article data
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching article with ID:", id);

        const data = await getArticleById(id);
        console.log("API response:", data);

        if (!data || !data._id) {
          throw new Error("Invalid article data received");
        }

        setArticle(data);

        // Check if article is in favorites
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(data._id));
      } catch (error) {
        console.error("Error fetching article:", error);
        setAlertMessage("Failed to load article. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article) {
      fetchRelatedArticles(article.category, 3);
    }
  }, [article]);

  useEffect(() => {
    console.log("Updated relatedArticles:", relatedArticles);
  }, [relatedArticles]);

  const toggleFavorite = () => {
    if (!article) return;

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((favId) => favId !== article._id);
    } else {
      newFavorites = [...favorites, article._id];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.content?.substring(0, 100) || "",
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing", err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert("Share link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="article-detail-container">
        <div className="article-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-container">
        <div className="article-detail-not-found">
          <h2>Article Not Found</h2>
          <p>
            The article you're looking for doesn't exist or has been removed.
          </p>
          <button className="back-button" onClick={() => navigate("/articles")}>
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
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      <div className="stars-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="planet planet1"></div>
      <div className="planet planet2"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star shooting-star2"></div>
      <div className="comet"></div>

      <div className="article-detail-content">
        <div className="article-navigation">
          <button className="back-button" onClick={() => navigate("/articles")}>
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
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Articles
          </button>
        </div>

        <div className="article-category-tag">
          <span
            className={`${categoryColors[article.category]?.bg} ${
              categoryColors[article.category]?.text
            }`}
          >
            {article.category}
          </span>
        </div>

        <h1 className="article-detail-title">{article.title}</h1>

        <div className="article-detail-image-container">
          <img
            src={Image}
            alt={article.title}
            className="article-detail-image"
          />
        </div>

        <div className="article-detail-body">
          <p className="article-summary">
            {article.description || article.content?.substring(0, 200)}
          </p>

          <div className="article-content">{article.content}</div>
        </div>

        <div className="article-actions">
          <button
            className={`action-button favorite-button ${
              isFavorite ? "active" : ""
            }`}
            onClick={toggleFavorite}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Favorite</span>
          </button>

          <button className="action-button share-button" onClick={handleShare}>
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
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>Share</span>
          </button>
          <button className="action-button add-button" onClick={handleShare}>
            <span>Add to Library </span>
          </button>
        </div>

        {relatedArticles.length > 0 && (
          <div className="related-articles-section">
            <h2 className="related-articles-title">You May Also Like</h2>
            <div className="related-articles-grid">
              {relatedArticles.map((relatedArticle) => (
                <RelatedArticleCard
                  key={relatedArticle._id}
                  article={relatedArticle}
                  categoryColors={categoryColors}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
