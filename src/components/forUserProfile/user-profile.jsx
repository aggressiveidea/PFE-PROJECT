"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Shield, User, Mail, BookOpen } from "lucide-react";
import "./user-profile.css";
import { getUserById } from "../../services/Api";
import ArticleCard from "../forarticle/ArticleCard";
import { useSearchParams } from "react-router-dom";

export default function UserProfile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userBio: "",
    profileImgUrl: "/placeholder.svg?height=200&width=200",
    role: "User",
    _id: "",
    favoriteArticles: [],
  });

  console.log("userid", userId);
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
      const storedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );

      console.log(" userId:", userId);
      console.log(" localUser:", localUser);
      console.log(" storedFavorites:", storedFavorites);

      if (userId && userId !== localUser._id) {
        const res = await getUserById(userId);
        console.log(" API response (getUserById):", res);

        if (res) {
          userData = res;
          console.log("", userData);
        } else {
          throw new Error("error on the fetch ");
        }
      } else if (localUser && localUser._id) {
        userData = localUser;
      } else {
        throw new Error(" No user in localStorage ");
      }

      userData.favoriteArticles = storedFavorites;

      setUser(userData);
      console.log(" User data set:", userData);
    } catch (err) {
      console.error(" Error fetching user data:", err);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [userId]);



  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super-admin":
        return "badge-admin";
      case "ict-expert":
        return "badge-expert";
      case "content-admin":
        return "badge-content";
      default:
        return "badge-user";
    }
  };

  const formatData = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <a href="/" className="back-button">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </a>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile data...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : (
        <div className="personal-info-container">
          <div className="profile-card">
            <div className="profile-banner">
              <div className="banner-overlay"></div>
            </div>

            <div className="profile-main">
              <div className="profile-image-container">
                <div className="profile-image">
                  <img
                    src={
                      user.profileImgUrl ||
                      "/placeholder.svg?height=200&width=200"
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    className="profile-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg?height=200&width=200";
                    }}
                  />
                </div>
              </div>

              <div className="profile-info">
                <div className="profile-title">
                  <h2>
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    <Shield size={14} />
                    <span>{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-body">
              <div className="info-section">
                <h3>
                  <User size={18} />
                  <span>About</span>
                </h3>
                <div className="info-grid">
                  <div className="info-item full-width">
                    <label>
                      <Mail size={16} className="icon" />
                      <span>Email Address</span>
                    </label>
                    <p>{user.email}</p>
                  </div>
                  <div className="info-item full-width">
                    <label>Bio</label>
                    <p className="user-bio">
                      {user.userBio || "No bio provided yet."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="favorite-articles-section">
            <div className="section-header">
              <h3>
                <BookOpen size={18} />
                <span>Favorite Articles</span>
              </h3>
            </div>

            {user.favoriteArticles.length > 0 ? (
              <div className="articles-grid">
                {user.favoriteArticles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    isFavorite={true}
                    onToggleFavorite={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="no-articles">
                <p>No favorite articles yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
