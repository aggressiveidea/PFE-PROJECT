"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Shield, User, Mail, BookOpen } from "lucide-react"
import "./user-profile.css"

export default function UserProfile({ userId }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userBio: "",
    profileImgUrl: "/placeholder.svg?height=200&width=200",
    role: "User",
    _id: "",
    favoriteArticles: [],
  })

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        let userData

        if (userId) {
 
          userData = {
            firstName: "Jane",
            lastName: "Doe",
            email: "jane.doe@example.com",
            userBio:
              "Technology enthusiast and avid reader. I love exploring new ICT concepts and sharing knowledge with others.",
            profileImgUrl: "/placeholder.svg?height=200&width=200",
            role: "ICT Expert",
            _id: userId,
            favoriteArticles: [
              {
                id: "1",
                title: "The Future of Artificial Intelligence",
                description: "Exploring how AI will shape our world in the coming decades.",
                imageUrl: "/placeholder.svg?height=150&width=250",
                date: "2023-05-15",
              },
              {
                id: "2",
                title: "Blockchain Technology Explained",
                description: "A comprehensive guide to understanding blockchain and its applications.",
                imageUrl: "/placeholder.svg?height=150&width=250",
                date: "2023-06-22",
              },
              {
                id: "3",
                title: "Cybersecurity Best Practices",
                description: "Essential tips to protect your digital life from threats.",
                imageUrl: "/placeholder.svg?height=150&width=250",
                date: "2023-07-10",
              },
            ],
          }
        } else {

          const storedUser = JSON.parse(localStorage.getItem("user") || "{}")

          if (storedUser && storedUser.email) {
            userData = {
              ...storedUser,
              // Add mock favorite articles since they're not in the original data
              favoriteArticles: [
                {
                  id: "1",
                  title: "Introduction to Cloud Computing",
                  description: "Learn the basics of cloud infrastructure and services.",
                  imageUrl: "/placeholder.svg?height=150&width=250",
                  date: "2023-04-18",
                },
                {
                  id: "2",
                  title: "Web Development Trends 2023",
                  description: "The latest frameworks and technologies in web development.",
                  imageUrl: "/placeholder.svg?height=150&width=250",
                  date: "2023-08-05",
                },
              ],
            }
          } else {
            throw new Error("No user data found")
          }
        }

        setUser(userData)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super-admin":
        return "badge-admin"
      case "ict-expert":
        return "badge-expert"
      case "content-admin":
        return "badge-content"
      default:
        return "badge-user"
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

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
                    src={user.profileImgUrl || "/placeholder.svg?height=200&width=200"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="profile-img"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?height=200&width=200"
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
                    <p className="user-bio">{user.userBio || "No bio provided yet."}</p>
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

            {user.favoriteArticles && user.favoriteArticles.length > 0 ? (
              <div className="articles-grid">
                {user.favoriteArticles.map((article) => (
                  <div className="article-card" key={article.id}>
                    <div className="article-image">
                      <img
                        src={article.imageUrl || "/placeholder.svg?height=150&width=250"}
                        alt={article.title}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg?height=150&width=250"
                        }}
                      />
                    </div>
                    <div className="article-content">
                      <h4>{article.title}</h4>
                      <p className="article-date">{formatDate(article.date)}</p>
                      <p className="article-description">{article.description}</p>
                      <a href={`/articles/${article.id}`} className="read-article">
                        Read Article
                      </a>
                    </div>
                  </div>
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
  )
}



