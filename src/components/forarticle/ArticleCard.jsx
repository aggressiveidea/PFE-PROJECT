import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Heart,
  Share2,
  Edit,
  Trash,
  User,
  Calendar,
  MessageCircle,
  Eye,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import "./article-card.css"
import { getUserById, favorCounter, shareCounter } from "../../services/Api"

export default function ArticleCard({ article, isFavorite, onToggleFavorite, onEdit, onDelete }) {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}")
    } catch (e) {
      console.error("Error parsing user from localStorage:", e)
      return {}
    }
  }, [])

  const [animateCard, setAnimateCard] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [ownerInfo, setOwnerInfo] = useState(null)
  const [ownerImageError, setOwnerImageError] = useState(false)
  const [showOwnerTooltip, setShowOwnerTooltip] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [metadataContent, setMetadataContent] = useState({
    title: "",
    description: "",
  })
  const navigate = useNavigate()

  const articleId = useMemo(() => article?._id, [article?._id])
  const ownerId = useMemo(() => article?.ownerId, [article?.ownerId])
  const userId = useMemo(() => user?._id, [user?._id])
  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        const response = await getUserById(ownerId)
        if (response) {
          setOwnerInfo({
            name: `${response.firstName || ""} ${response.lastName || ""}`.trim() || "Unknown",
            profilePic: response.profileImgUrl || null,
            role: response.role || null,
          })
        }
      } catch (error) {
        console.error("Error fetching owner info:", error)
      }
    }

    if (ownerId) {
      fetchOwnerInfo()
    }
  }, [ownerId])

  const formattedDate = useMemo(() => {
    if (!article?.createdAt) return "2023-04-15"
    try {
      return article.createdAt.slice(0, 10)
    } catch (e) {
      return "Date not available"
    }
  }, [article?.createdAt])

  useEffect(() => {
    setAnimateCard(true)
  }, [])

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
      setIsBookmarked(bookmarks.includes(articleId))
    } catch (e) {
      console.error("Error checking bookmarks:", e)
    }
  }, [articleId])

  useEffect(() => {
    if (article) {
      setMetadataContent({
        title: article.title || "Untitled Article",
        description: article.content || "No description available",
      })
    }
  }, [article])

  const handleCardClick = useCallback(
    (e) => {
      if (
        e.target.closest(".quiz-card-action-icon") ||
        e.target.closest(".quiz-card-edit-btn") ||
        e.target.closest(".quiz-card-delete-btn") ||
        e.target.closest(".quiz-card-owner-link")
      ) {
        return
      }
      if (articleId) {
        window.location.href = `/articles/${articleId}`
      }
    },
    [articleId],
  )

  const handleOwnerClick = useCallback(
    (e) => {
      e.stopPropagation()
      setShowOwnerTooltip(true)
      setTimeout(() => {
        setShowOwnerTooltip(false)
      }, 3000)

      if (ownerId) {
        navigate(`/userProfile?id=${ownerId}`)
      }
    },
    [ownerId, navigate],
  )

  const handleEdit = useCallback(
    (e) => {
      e.stopPropagation()
      if (onEdit && articleId) {
        onEdit(articleId)
      }
    },
    [onEdit, articleId],
  )

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation()
      if (onDelete && articleId) {
        onDelete(articleId)
      }
    },
    [onDelete, articleId],
  )

  const handleShare = useCallback(
    (e) => {
      e.stopPropagation()

      setMetadataContent({
        title: `Share: ${article?.title || "Article"}`,
        description: `Share this article with your friends and colleagues!`,
      })

      if (navigator.share && article) {
        navigator
          .share({
            title: article.title || "Article",
            text: article.description || article.content || "Check out this article",
            url: `/articles/${articleId}`,
          })
          .then(async () => {
            try {
              await shareCounter(articleId)
            } catch (err) {
              console.error("Error updating share counter:", err)
            }
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.log("Error sharing", err)
            }
          })
      } else {
        navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
        try {
          shareCounter(articleId)
        } catch (err) {
          console.error("Error updating share counter:", err)
        }
      }
    },
    [article, articleId],
  )

  const handleToggleFav = useCallback(
    (e) => {
      e.stopPropagation()
      setMetadataContent({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite
          ? "This article has been removed from your favorites"
          : "This article has been added to your favorites",
      })

      if (articleId && onToggleFavorite) {
        onToggleFavorite(articleId)

      
        try {
          favorCounter(articleId)
        } catch (err) {
          console.error("Error updating favorite counter:", err)
        }
      }
    },
    [articleId, onToggleFavorite, isFavorite],
  )

  const handleToggleBookmark = useCallback(
    (e) => {
      e.stopPropagation()

      setMetadataContent({
        title: isBookmarked ? "Bookmark removed" : "Bookmark added",
        description: isBookmarked
          ? "This article has been removed from your bookmarks"
          : "This article has been saved to your bookmarks for later reading",
      })

      try {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]")
        let newBookmarks

        if (isBookmarked) {
          newBookmarks = bookmarks.filter((id) => id !== articleId)
        } else {
          newBookmarks = [...bookmarks, articleId]
        }

        localStorage.setItem("bookmarks", JSON.stringify(newBookmarks))
        setIsBookmarked(!isBookmarked)
      } catch (e) {
        console.error("Error updating bookmarks:", e)
      }
    },
    [articleId, isBookmarked],
  )

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const handleOwnerImageError = useCallback(() => {
    setOwnerImageError(true)
  }, [])

  const role = user?.role
  const canEdit = useMemo(
    () => role === "Content-admin" || (role === "Ict-expert" && userId === ownerId),
    [role, userId, ownerId],
  )
  const canDelete = canEdit
  const getCategoryColor = useCallback(() => {
    const colors = [
      "var(--color-primary)",
      "var(--color-easy)",
      "var(--color-medium)",
      "var(--color-hard)",
      "var(--color-primary-light)",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }, [])

  const truncateText = useCallback((text, maxLength) => {
    if (!text || text.length <= maxLength) return text

    const lastSpace = text.lastIndexOf(" ", maxLength)
    if (lastSpace === -1) return text.substring(0, maxLength) + "..."

    return text.substring(0, lastSpace) + "..."
  }, [])

  return (
    <div className={`quiz-card-container ${animateCard ? "quiz-card-animate-in" : ""}`} onClick={handleCardClick}>
      <div className="quiz-card-inner">
        <div className="quiz-card-image-wrapper">
          <img
            src={article?.imageUrl || "/placeholder.svg?height=220&width=400"}
            alt={article?.title || "Article"}
            className="quiz-card-image"
            onError={handleImageError}
          />
          <div className="quiz-card-top-actions">
            <button
              onClick={handleToggleFav}
              className={`quiz-card-action-icon ${isFavorite ? "quiz-card-active" : ""}`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              <span className="quiz-card-action-count">{article?.favorites || 0}</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`quiz-card-action-icon ${isBookmarked ? "quiz-card-active" : ""}`}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark article"}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>

            <button onClick={handleShare} className="quiz-card-action-icon" aria-label="Share article">
              <Share2 size={18} />
              <span className="quiz-card-action-count">{article?.shares || 0}</span>
            </button>
          </div>
          {article?.category && (
            <div className="quiz-card-category" style={{ backgroundColor: getCategoryColor() }}>
              <Sparkles size={14} className="quiz-card-category-icon" />
              <span>{article.category}</span>
            </div>
          )}

          {article?.click > 25 && (
            <div className="quiz-card-trending">
              <TrendingUp size={14} className="quiz-card-trending-icon" />
              <span>Trending</span>
            </div>
          )}
        </div>

        <div className="quiz-card-content">
          <h3 className="quiz-card-title">{metadataContent.title || article?.title || "Untitled Article"}</h3>

          <div className="quiz-card-author-row">
            <div className="quiz-card-owner-link" onClick={handleOwnerClick}>
              <div className="quiz-card-avatar">
                {ownerInfo?.profilePic && !ownerImageError ? (
                  <img src={ownerInfo.profilePic || "/placeholder.svg"} alt="Author" onError={handleOwnerImageError} />
                ) : (
                  <div className="quiz-card-avatar-placeholder">
                    <User size={20} />
                  </div>
                )}
              </div>
              <div className="quiz-card-author-info">
                <span className="quiz-card-author-name">
                  {ownerInfo?.name || article?.ownerName || "Unknown author"}
                </span>
                {showOwnerTooltip && <div className="quiz-card-tooltip">View profile</div>}
              </div>
            </div>

            <div className="quiz-card-date">
              <Calendar size={14} className="quiz-card-date-icon" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <p className="quiz-card-description">
            {truncateText(metadataContent.description || article?.content || "No description available", 120)}
          </p>

          <div className="quiz-card-footer">
            <div className="quiz-card-stats">
              <div className="quiz-card-stat">
                <Eye size={16} className="quiz-card-stat-icon" />
                <span>{article?.views || article?.click || 0}</span>
              </div>
              <div className="quiz-card-stat">
                <MessageCircle size={16} className="quiz-card-stat-icon" />
                <span>{article?.comments || 0}</span>
              </div>
            </div>
            {(canEdit || canDelete) && (
              <div className="quiz-card-admin-actions">
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="quiz-card-admin-btn quiz-card-edit-btn"
                    aria-label="Edit article"
                  >
                    <Edit size={18} className="quiz-card-admin-icon" />
                    <span className="quiz-card-admin-text">Edit</span>
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="quiz-card-admin-btn quiz-card-delete-btn"
                    aria-label="Delete article"
                  >
                    <Trash size={18} className="quiz-card-admin-icon" />
                    <span className="quiz-card-admin-text">Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
