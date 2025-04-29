"use client"

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
import { getUserById } from "../../services/Api"


export default function EnhancedArticleCard({
  article,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,
}) {
  // Get user from localStorage only once during component initialization
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return {};
    }
  }, []);

  const [isHovered, setIsHovered] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [ownerImageError, setOwnerImageError] = useState(false);
  const [showOwnerTooltip, setShowOwnerTooltip] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  // State for metadata content
  const [metadataContent, setMetadataContent] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();

  const articleId = useMemo(() => article?._id, [article?._id]);
  const ownerId = useMemo(() => article?.ownerId, [article?.ownerId]);
  const userId = useMemo(() => user?._id, [user?._id]);

  // Fetch owner information
  useEffect(() => {
    const fetchOwnerInfo = async () => {
      try {
        const response = await getUserById(ownerId);
        if (response) {
          setOwnerInfo({
            name:
              `${response.firstName || ""} ${response.lastName || ""}`.trim() ||
              "Unknown",
            profilePic: response.profileImgUrl || null,
            role: response.role || null,
          });
        }
      } catch (error) {
        console.error("Error fetching owner info:", error);
      }
    };

    if (ownerId) {
      fetchOwnerInfo();
    }
  }, [ownerId]);

  // Format date if available
  const formattedDate = useMemo(() => {
    if (!article?.createdAt) return "2023-04-15"; // Default date for demo
    try {
      return article.createdAt.slice(0, 10);
    } catch (e) {
      return "Date not available";
    }
  }, [article?.createdAt]);

  // Start animation when component mounts
  useEffect(() => {
    setAnimateCard(true);
  }, []);

  // Check if article is bookmarked
  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setIsBookmarked(bookmarks.includes(articleId));
    } catch (e) {
      console.error("Error checking bookmarks:", e);
    }
  }, [articleId]);

  // Set initial metadata content
  useEffect(() => {
    if (article) {
      setMetadataContent({
        title: article.title || "Untitled Article",
        description: article.content || "No description available",
      });
    }
  }, [article]);

  const handleCardClick = useCallback(
    (e) => {
      if (
        e.target.closest(".card-action-icon") ||
        e.target.closest(".card-edit-btn") ||
        e.target.closest(".card-delete-btn") ||
        e.target.closest(".card-owner-link")
      ) {
        return;
      }
      if (articleId) {
        window.location.href = `/articles/${articleId}`;
      }
    },
    [articleId]
  );

  const handleOwnerClick = useCallback(
    (e) => {
      e.stopPropagation();
      setShowOwnerTooltip(true);

      // Hide tooltip after 3 seconds
      setTimeout(() => {
        setShowOwnerTooltip(false);
      }, 3000);

      if (ownerId) {
        navigate(`/userProfile?id=${ownerId}`);
      }
    },
    [ownerId, navigate]
  );

  const handleEdit = useCallback(
    (e) => {
      e.stopPropagation();
      if (onEdit && articleId) {
        onEdit(articleId);
      }
    },
    [onEdit, articleId]
  );

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      if (onDelete && articleId) {
        onDelete(articleId);
      }
    },
    [onDelete, articleId]
  );

  const handleShare = useCallback(
    (e) => {
      e.stopPropagation();

      // Update metadata content for share
      setMetadataContent({
        title: `Share: ${article?.title || "Article"}`,
        description: `Share this article with your friends and colleagues!`,
      });

      // Share functionality
      if (navigator.share && article) {
        navigator
          .share({
            title: article.title || "Article",
            text:
              article.description ||
              article.content ||
              "Check out this article",
            url: `/articles/${articleId}`,
          })
          .catch((err) => console.log("Error sharing", err));
      }
    },
    [article, articleId]
  );

  const handleToggleFav = useCallback(
    (e) => {
      e.stopPropagation();

      // Update metadata content for favorites
      setMetadataContent({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite
          ? "This article has been removed from your favorites"
          : "This article has been added to your favorites",
      });

      if (articleId && onToggleFavorite) {
        onToggleFavorite(articleId);
      }
    },
    [articleId, onToggleFavorite, isFavorite]
  );

  const handleToggleBookmark = useCallback(
    (e) => {
      e.stopPropagation();

      // Update metadata content for bookmark
      setMetadataContent({
        title: isBookmarked ? "Bookmark removed" : "Bookmark added",
        description: isBookmarked
          ? "This article has been removed from your bookmarks"
          : "This article has been saved to your bookmarks for later reading",
      });

      try {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        let newBookmarks;

        if (isBookmarked) {
          newBookmarks = bookmarks.filter((id) => id !== articleId);
        } else {
          newBookmarks = [...bookmarks, articleId];
        }

        localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
        setIsBookmarked(!isBookmarked);
      } catch (e) {
        console.error("Error updating bookmarks:", e);
      }
    },
    [articleId, isBookmarked]
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleOwnerImageError = useCallback(() => {
    setOwnerImageError(true);
  }, []);

  // Memoize permission checks
  const role = user?.role;
  const canEdit = useMemo(
    () =>
      role === "Content-admin" || (role === "Ict-expert" && userId === ownerId),
    [role, userId, ownerId]
  );
  const canDelete = canEdit;

  // Generate random category color if none exists
  const getCategoryColor = useCallback(() => {
    const colors = [
      "#9333ea", // Purple
      "#c026d3", // Fuchsia
      "#a855f7", // Purple
      "#8b5cf6", // Violet
      "#d946ef", // Fuchsia
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Function to truncate text at word boundaries
  const truncateText = useCallback((text, maxLength) => {
    if (!text || text.length <= maxLength) return text;

    // Find the last space before maxLength
    const lastSpace = text.lastIndexOf(" ", maxLength);

    // If no space found, just cut at maxLength
    if (lastSpace === -1) return text.substring(0, maxLength) + "...";

    // Cut at the last space
    return text.substring(0, lastSpace) + "...";
  }, []);

  return (
    <div
      className={`card-container ${animateCard ? "card-animate-in" : ""}`}
      onClick={handleCardClick}
    >
      <div className="card-inner">
        {/* Image section */}
        <div className="card-image-wrapper">
          <img
            src={article?.imageUrl || "/placeholder.svg?height=220&width=400"}
            alt={article?.title || "Article"}
            className="card-image"
            onError={handleImageError}
          />

          {/* Top action buttons */}
          <div className="card-top-actions">
            <button
              onClick={handleToggleFav}
              className={`card-action-icon like-action ${
                isFavorite ? "card-active" : ""
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              <span className="card-action-count">
                {article?.likes || Math.floor(Math.random() * 20) + 5}
              </span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`card-action-icon ${
                isBookmarked ? "card-active" : ""
              }`}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark article"}
            >
              {isBookmarked ? (
                <BookmarkCheck size={18} />
              ) : (
                <Bookmark size={18} />
              )}
              <span className="card-action-count">
                {Math.floor(Math.random() * 15) + 2}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="card-action-icon share-action"
              aria-label="Share article"
            >
              <Share2 size={18} />
              <span className="card-action-count">
                0
              </span>
            </button>
          </div>

          {/* Category badge */}
          {article?.category && (
            <div
              className="card-category"
              style={{ backgroundColor: getCategoryColor() }}
            >
              <Sparkles size={14} className="card-category-icon" />
              <span>{article.category}</span>
            </div>
          )}

          {/* Trending indicator - animation removed */}
          {article?.click > 25 && (
            <div className="card-trending">
              <TrendingUp size={14} className="card-trending-icon" />
              <span>Trending</span>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="card-content">
          <h3 className="card-title">
            {metadataContent.title || article?.title || "Untitled Article"}
          </h3>

          {/* Author info */}
          <div className="card-author-row">
            <div className="card-owner-link" onClick={handleOwnerClick}>
              <div className="card-avatar">
                {ownerInfo?.profilePic && !ownerImageError ? (
                  <img
                    src={ownerInfo.profilePic || "/placeholder.svg"}
                    alt="Author"
                    onError={handleOwnerImageError}
                  />
                ) : (
                  <div className="card-avatar-placeholder">
                    <User size={20} />
                  </div>
                )}
              </div>
              <div className="card-author-info">
                <span className="card-author-name">
                  {ownerInfo?.name || article?.ownerName || "Unknown author"}
                </span>
                {showOwnerTooltip && (
                  <div className="card-tooltip">View profile</div>
                )}
              </div>
            </div>

            <div className="card-date">
              <Calendar size={14} className="card-date-icon" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Description with improved truncation */}
          <p className="card-description">
            {truncateText(
              metadataContent.description ||
                article?.content ||
                "No description available",
              120
            )}
          </p>

          {/* Stats and admin actions row */}
          <div className="card-footer">
            <div className="card-stats">
              <div className="card-stat">
                <Eye size={16} className="card-stat-icon" />
                <span>
                  {article?.views ||
                    article?.click ||
                    Math.floor(Math.random() * 100) + 5}
                </span>
              </div>
              <div className="card-stat">
                <MessageCircle size={16} className="card-stat-icon" />
                <span>
                  {article?.comments || Math.floor(Math.random() * 20) + 1}
                </span>
              </div>
            </div>

            {/* Admin actions with enhanced hover animations */}
            {(canEdit || canDelete) && (
              <div className="card-admin-actions">
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="card-admin-btn card-edit-btn"
                    aria-label="Edit article"
                  >
                    <Edit size={18} className="card-admin-icon" />
                    <span className="card-admin-text">Edit</span>
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="card-admin-btn card-delete-btn"
                    aria-label="Delete article"
                  >
                    <Trash size={18} className="card-admin-icon" />
                    <span className="card-admin-text">Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
