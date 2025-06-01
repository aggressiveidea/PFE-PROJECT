"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  User,
  Mail,
  BookOpen,
  PenTool,
  Loader,
  Eye,
  MessageCircle,
  Heart,
  Bookmark,
  Share2,
} from "lucide-react";
import "./user-profile.css";
import {
  getUserById,
  getownerswritng,
  getArticleById,
} from "../../services/Api";
import { useSearchParams } from "react-router-dom";

export default function UserProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [userWritings, setUserWritings] = useState([]);
  const [loadingWritings, setLoadingWritings] = useState(false);
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userBio: "",
    profileImgUrl: "/placeholder.svg?height=200&width=200",
    role: "User",
    _id: "",
    favourites: [],
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.body.classList.toggle("dark", savedDarkMode);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        let userData = null;

        const localUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (userId && userId !== localUser._id) {
          const res = await getUserById(userId);

          if (res) {
            userData = res;
          } else {
            throw new Error("error on the fetch ");
          }
        } else if (localUser && localUser._id) {
          userData = localUser;
        } else {
          throw new Error(" No user in localStorage ");
        }

        setUser(userData);
      } catch (err) {
        console.error(" Error fetching user data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch favorite articles data
  useEffect(() => {
    const fetchFavoriteArticles = async () => {
      if (
        !user._id ||
        !user.favourites ||
        !Array.isArray(user.favourites) ||
        user.favourites.length === 0
      ) {
        return;
      }

      setLoadingFavorites(true);
      const articlesData = [];

      try {
        // Fetch each article by ID
        for (const articleId of user.favourites) {
          try {
            const articleData = await getArticleById(articleId);
            if (articleData) {
              articlesData.push(articleData);
            }
          } catch (err) {
            console.error(`Error fetching article ${articleId}:`, err);
          }
        }

        setFavoriteArticles(articlesData);
      } catch (err) {
        console.error("Error fetching favorite articles:", err);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavoriteArticles();
  }, [user._id, user.favourites]);

  // Fetch user writings if they are an ICT expert or Content admin
  useEffect(() => {
    const fetchUserWritings = async () => {
      if (!user._id) return;

      // Only fetch writings for ICT experts or Content admins
      if (user.role === "Ict-expert" || user.role === "Content-admin") {
        setLoadingWritings(true);
        try {
            const writings = await getownerswritng( user._id );
            console.log("wtfff", writings); 
          if (writings && Array.isArray(writings)) {
            setUserWritings(writings);
          }
        } catch (err) {
          console.error("Error fetching user writings:", err);
        } finally {
          setLoadingWritings(false);
        }
      }
    };

    fetchUserWritings();
  }, [user._id, user.role]);

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super-admin":
        return "up_badge-admin";
      case "ict-expert":
        return "up_badge-expert";
      case "content-admin":
        return "up_badge-content";
      default:
        return "up_badge-user";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString.slice(0, 10); // Fallback to simple slice if date is invalid
    }
  };

  const getCategoryClass = (category) => {
    if (!category) return "up_category-default";

    const categoryMap = {
      "Criminalité informatique": "up_category-criminalite",
      "Propriété intellectuelle": "up_category-propriete",
      "Contrats informatiques": "up_category-contrats",
      "Données personnelles": "up_category-donnees",
      "Droit d'auteur": "up_category-droit",
      Cybersécurité: "up_category-cyber",
    };

    return categoryMap[category] || "up_category-default";
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return "No content available";
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + "...";
  };

  const isExpertOrAdmin =
    user.role === "Ict-expert" || user.role === "Content-admin";

  // Function to render article cards
  const renderArticleCard = (article, isFavorite) => {
    return (
      <div key={article._id} className="up_article-card">
        <div className="up_article-header">
          <div
            className={`up_article-category ${getCategoryClass(
              article.category
            )}`}
          >
            <span>{article.category || "Uncategorized"}</span>
          </div>
        
        </div>

        <h3 className="up_article-title">{article.title}</h3>

       
        <p className="up_article-excerpt">{truncateText(article.content)}</p>

        <div className="up_article-footer">
          <div className="up_article-stats">
            <div className="up_stat-item">
              <Eye size={16} />
              <span>{article.click || 0}</span>
            </div>
            <div className="up_stat-item">
              <MessageCircle size={16} />
              <span>{article.comment || 0}</span>
            </div>
          </div>

          <div className="up_article-actions">
            <button
              className={`up_action-btn ${isFavorite ? "up_active" : ""}`}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
              <span>{article.favorites || 0}</span>
            </button>
            <button className="up_action-btn">
              <Share2 size={16} />
              <span>{article.share || 0}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`up_container ${darkMode ? "up_dark" : ""}`}>
      <a href="/" className="up_back-button">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </a>

      {loading ? (
        <div className="up_loading-container">
          <div className="up_loading-spinner"></div>
          <p>Loading profile data...</p>
        </div>
      ) : error ? (
        <div className="up_error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : (
        <div className="up_profile-container">
          <div className="up_profile-card">
            <div className="up_profile-banner">
              <div className="up_banner-overlay"></div>
            </div>

            <div className="up_profile-main">
              <div className="up_profile-image-container">
                <div className="up_profile-image">
                  <img
                    src={
                      user.profileImgUrl ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    className="up_profile-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg?height=200&width=200";
                    }}
                  />
                </div>
              </div>

              <div className="up_profile-info">
                <div className="up_profile-title">
                  <h2>
                    {user.firstName} {user.lastName}
                  </h2>
                  <div
                    className={`up_role-badge ${getRoleBadgeClass(user.role)}`}
                  >
                    <Shield size={14} />
                    <span>{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="up_profile-body">
              <div className="up_info-section">
                <h3>
                  <User size={18} />
                  <span>About</span>
                </h3>
                <div className="up_info-grid">
                  <div className="up_info-item up_full-width">
                    <label>
                      <Mail size={16} className="up_icon" />
                      <span>Email Address</span>
                    </label>
                    <p>{user.email}</p>
                  </div>
                  <div className="up_info-item up_full-width">
                    <label>Bio</label>
                    <p className="up_user-bio">
                      {user.userBio || "No bio provided yet."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Articles Section */}
          <div className="up_articles-section">
            <div className="up_section-header">
              <h3>
                <BookOpen size={18} />
                <span>Favorite Articles</span>
              </h3>
              <div className="up_section-underline"></div>
            </div>

            {loadingFavorites ? (
              <div className="up_loading-articles">
                <Loader size={24} className="up_loading-spinner" />
                <p>Loading favorite articles...</p>
              </div>
            ) : favoriteArticles && favoriteArticles.length > 0 ? (
              <div className="up_articles-grid">
                {favoriteArticles.map((article) =>
                  renderArticleCard(article, true)
                )}
              </div>
            ) : (
              <div className="up_no-articles">
                <BookOpen size={48} className="up_empty-icon" />
                <p>No favorite articles yet.</p>
                <span>Articles you like will appear here</span>
              </div>
            )}
          </div>

          {/* User Writings Section - Only shown for ICT experts and Content admins */}
          {isExpertOrAdmin && (
            <div className="up_articles-section up_writings-section">
              <div className="up_section-header">
                <h3>
                  <PenTool size={18} />
                  <span>{user.firstName}'s Writings</span>
                </h3>
                <div className="up_section-underline"></div>
              </div>

              {loadingWritings ? (
                <div className="up_loading-articles">
                  <Loader size={24} className="up_loading-spinner" />
                  <p>Loading writings...</p>
                </div>
              ) : userWritings && userWritings.length > 0 ? (
                <div className="up_articles-grid">
                  {userWritings.map((article) =>
                    renderArticleCard(article, false)
                  )}
                </div>
              ) : (
                <div className="up_no-articles">
                  <PenTool size={48} className="up_empty-icon" />
                  <p>No writings published yet.</p>
                  <span>Articles you write will appear here</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
