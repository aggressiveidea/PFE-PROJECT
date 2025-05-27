"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "react-router-dom"
import {
  Heart,
  Share2,
  BookmarkPlus,
  ArrowLeft,
  MessageCircle,
  Send,
  X,
  User,
  Calendar,
  Eye,
  ThumbsUp,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import "./article-detail.css"
import { getArticleById, getarticlebycat, getUserById, GetAllMessages, sendMessage } from "../../services/Api"
import Footer from "../forHome/Footer"
import EnhancedArticleCard from "./ArticleCard"

const ArticleDetail = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [alertMessage, setAlertMessage] = useState("")
  const [newComment, setNewComment] = useState("")
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [saveAnimation, setSaveAnimation] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const imageRef = useRef(null)
  const cardsPerPage = 3
  const [owner, setOwner] = useState(null)
  const [ownerImageError, setOwnerImageError] = useState(false)
  const [messages, setMessages] = useState([])

  const fetchRelatedArticles = async (category, limit) => {
    try {
      const response = await getarticlebycat(category, limit)
      const filtered = response.filter((article) => article._id !== id)
      setRelatedArticles(filtered)
    } catch (error) {
      console.error("Error fetching related articles:", error)
    }
  }

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true)
      try {
        const data = await getArticleById(id)

        if (!data || !data._id) {
          throw new Error("Invalid article data received")
        }

        setArticle(data)

        if (data.ownerId) {
          const ownerData = await getUserById(data.ownerId)
          if (ownerData) {
            setOwner(ownerData)
          }
        }

        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        setIsFavorite(favorites.includes(data._id))
      } catch (error) {
        console.error("Error fetching article:", error)
        setAlertMessage("Failed to load article. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  useEffect(() => {
    if (!id) return

    const fetchMessages = async () => {
      try {
        const messagesData = await GetAllMessages(id)

        if (messagesData && messagesData.length > 0) {
          const messagesWithUsers = await Promise.all(
            messagesData.map(async (message) => {
              try {
                if (!message.userID) return { ...message, userData: null }

                const userData = await getUserById(message.userID)
                return { ...message, userData }
              } catch (err) {
                console.error(`Error fetching user data for message ${message._id}:`, err)
                return { ...message, userData: null }
              }
            }),
          )

          setMessages(messagesWithUsers)
        } else {
          setMessages([])
        }
      } catch (err) {
        console.error("Error loading messages:", err)
        setMessages([])
      }
    }

    fetchMessages()
  }, [id])

  const handleOwnerImageError = useCallback(() => {
    setOwnerImageError(true)
  }, [])

  useEffect(() => {
    if (article && article.category) {
      fetchRelatedArticles(article.category, 10)
    }
  }, [article])

  const toggleFavorite = () => {
    if (!article) return

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    let newFavorites

    if (isFavorite) {
      newFavorites = favorites.filter((favId) => favId !== article._id)
    } else {
      newFavorites = [...favorites, article._id]
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.content?.substring(0, 100) || "",
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing", err))
    } else {
      alert("Share link copied to clipboard!")
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      if (!user || !user._id) {
        alert("You must be logged in to send messages")
        return
      }

      const content = { text: newComment, userID: user._id }

      const notification = document.createElement("div")
      notification.className = "artd-message-notification"
      notification.innerHTML = `
        <div class="artd-message-notification-content">
          <div class="artd-message-notification-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="artd-message-notification-text">
            <h4>Message Sent Successfully</h4>
            <p>Your message is waiting for validation</p>
          </div>
        </div>
      `
      document.body.appendChild(notification)

      const result = await sendMessage(article._id, content)

      const stored = JSON.parse(localStorage.getItem("notifMessages") || "[]")
      stored.push(result.data)
      localStorage.setItem("notifMessages", JSON.stringify(stored))

      setNewComment("")

      setTimeout(() => {
        notification.classList.add("artd-message-notification-fade-out")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 500)
      }, 3000)
    } catch (e) {
      console.error("Error sending message:", e)
      alert("Failed to send message. Please try again.")
    }
  }

  const addToLibrary = () => {
    if (!article) return

    const library = JSON.parse(localStorage.getItem("articleLibrary")) || []

    const exists = library.some((item) => item._id === article._id)
    if (exists) {
      alert("This article is already in your library!")
      return
    }

    setSaveAnimation(true)

    setTimeout(() => {
      library.push(article)
      localStorage.setItem("articleLibrary", JSON.stringify(library))
      setSaveAnimation(false)
      alert("Article added to your library!")
    }, 1000)
  }

  const handleGoBack = () => {
    window.history.back()
  }

  const openImageModal = () => {
    setImageModalOpen(true)
  }

  const closeImageModal = () => {
    setImageModalOpen(false)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const totalPages = Math.ceil(relatedArticles.length / cardsPerPage)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const indexOfLastArticle = currentPage * cardsPerPage
  const indexOfFirstArticle = indexOfLastArticle - cardsPerPage
  const currentArticles = relatedArticles.slice(indexOfFirstArticle, indexOfLastArticle)

  const handleAuthorClick = (userId) => {
    if (userId) {
      window.location.href = `/userProfile?id=${userId}`
    }
  }

  if (isLoading) {
    return (
      <div className="artd-container">
        <div className="artd-loading">
          <div className="artd-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="artd-container">
        <div className="artd-not-found">
          <h2>Article Not Found</h2>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <button className="artd-back-btn" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            Back to Articles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="artd-container">
      <div className="artd-content">
        {/* Navigation */}
        <div className="artd-navigation">
          <button className="artd-back-btn" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            Back to Articles
          </button>
        </div>

        {/* Category */}
        <div className="artd-category">
          <span>{article.category}</span>
        </div>

        {/* Title */}
        <h1 className="artd-title">{article.title}</h1>

        {/* Author */}
        <div className="artd-author" onClick={() => handleAuthorClick(owner?._id)}>
          <div className="artd-author-avatar">
            {owner?.profileImgUrl && !ownerImageError ? (
              <img
                src={owner.profileImgUrl || "/placeholder.svg"}
                alt="Author"
                onError={handleOwnerImageError}
                className="artd-author-avatar-img"
              />
            ) : (
              <div className="card-avatar-placeholder">
                <User size={20} />
              </div>
            )}
          </div>

          <div className="artd-author-info">
            <h3 className="artd-author-name">{owner ? `${owner.firstName} ${owner.lastName}` : "Unknown Author"}</h3>
            <span className="artd-author-role">{owner?.role}</span>
          </div>
        </div>

        {/* Metadata */}
        <div className="artd-meta">
          <div className="artd-meta-item">
            <Calendar size={16} />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <div className="artd-meta-item">
            <Eye size={16} />
            <span>{article.click} views</span>
          </div>
          <div className="artd-meta-item">
            <ThumbsUp size={16} />
            <span>{article.favorites} likes</span>
          </div>
          <div className="artd-meta-item">
            <Share2 size={16} />
            <span>2 shares</span>
          </div>
          <div className="artd-meta-item">
            <Bookmark size={16} />
            <span> saves</span>
          </div>
        </div>

        {/* Image Section */}
        <div className="artd-image-container" onClick={openImageModal}>
          <img
            ref={imageRef}
            src={article.imageUrl || "/placeholder.svg?height=400&width=800"}
            alt={article.title}
            className="artd-image"
          />
          <div className="artd-image-overlay">
            <span className="artd-zoom-hint">Click to enlarge</span>
          </div>
        </div>

        {/* Image Modal */}
        {imageModalOpen && (
          <div className="artd-modal" onClick={closeImageModal}>
            <div className="artd-modal-content">
              <button
                className="artd-modal-close"
                onClick={(e) => {
                  e.stopPropagation()
                  closeImageModal()
                }}
              >
                <X size={24} />
              </button>
              <img
                src={article.imageUrl || "/placeholder.svg?height=800&width=1200"}
                alt={article.title}
                className="artd-modal-image"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="artd-body">
          <p className="artd-summary">{article.description || article.content?.substring(0, 200)}</p>

          <div
            className="artd-content-text"
            dangerouslySetInnerHTML={{
              __html: typeof article.content === "string" ? article.content : JSON.stringify(article.content),
            }}
          />
        </div>

        {/* Actions */}
        <div className="artd-actions">
          <button
            className={`artd-action-btn artd-favorite-btn ${isFavorite ? "artd-active" : ""}`}
            onClick={toggleFavorite}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            <span>Favorite</span>
          </button>

          <button className="artd-action-btn artd-share-btn" onClick={handleShare}>
            <Share2 size={20} />
            <span>Share</span>
          </button>

          <button
            className={`artd-action-btn artd-library-btn ${saveAnimation ? "artd-save-animation" : ""}`}
            onClick={addToLibrary}
            disabled={saveAnimation}
          >
            <BookmarkPlus size={20} />
            <span>Save to My Library</span>
          </button>
        </div>

        {/* Comments and Chat */}
        <div className="artd-comments">
          <h2 className="artd-comments-title">
            <MessageCircle size={22} />
            Chat ({messages?.length || 0})
          </h2>

          <div className="artd-comments-list">
            {messages.length === 0 ? (
              <p className="artd-no-comments">No chat messages yet—be the first to send one!</p>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className="artd-comment">
                  <div
                    className="artd-comment-avatar"
                    onClick={() => handleAuthorClick(msg.userData?._id)}
                    style={{ cursor: "pointer" }}
                  >
                    {msg.userData?.profileImgUrl ? (
                      <img
                        src={msg.userData.profileImgUrl || "/placeholder.svg"}
                        alt={`${msg.userData.firstName} ${msg.userData.lastName}`}
                        className="artd-author-avatar-img"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.parentNode.innerHTML =
                            '<div class="artd-avatar-placeholder">' +
                            (msg.userData.firstName ? msg.userData.firstName.charAt(0).toUpperCase() : "U") +
                            "</div>"
                        }}
                      />
                    ) : (
                      <div className="artd-avatar-placeholder">
                        {msg.userData?.firstName ? msg.userData.firstName.charAt(0).toUpperCase() : <User size={20} />}
                      </div>
                    )}
                  </div>
                  <div className="artd-comment-content">
                    <div className="artd-comment-header">
                      <h4
                        className="artd-comment-author"
                        onClick={() => handleAuthorClick(msg.userData?._id)}
                        style={{ cursor: "pointer" }}
                      >
                        {msg.userData
                          ? `${msg.userData.firstName} ${msg.userData.lastName}`
                          : msg.userID || "Anonymous User"}
                        {msg.userData?.role && <span className="artd-comment-role">{msg.userData.role}</span>}
                      </h4>
                      <span className="artd-comment-date">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Unknown date"}
                      </span>
                    </div>
                    <p className="artd-comment-text">{msg.text || "No message content"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Comment */}
        <div className="artd-comment-form">
          <div className="artd-form-avatar">
            <User size={20} />
          </div>
          <div className="artd-form-input-container">
            <textarea
              className="artd-form-input"
              placeholder="Write your message here…"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <button className="artd-submit-btn" onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="artd-related">
            <h2 className="artd-related-title">You May Also Like</h2>
            <div className="artd-related-grid">
              {currentArticles.map((relatedArticle) => (
                <EnhancedArticleCard
                  key={relatedArticle._id}
                  article={relatedArticle}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="artd-pagination">
                <button className="artd-pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
                  <ChevronLeft size={20} />
                </button>

                <div className="artd-pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`artd-page-number ${currentPage === page ? "artd-active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button className="artd-pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default ArticleDetail
