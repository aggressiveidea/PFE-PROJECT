import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
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
} from "lucide-react";
import "./article-detail.css";
import { getArticleById, getarticlebycat , getUserById } from "../../services/Api";
import Footer from "./Footer";
import EnhancedArticleCard from "./ArticleCard";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [newComment, setNewComment] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const imageRef = useRef(null);
  const cardsPerPage = 3;
  const [owner, setOwner] = useState(null); 


  const sampleComments = [
    {
      id: 1,
      userName: "TechExpert",
      text: "Great article! I particularly appreciate the section on predictive security measures. It's becoming increasingly important for organizations to adopt proactive approaches.",
      date: "2023-04-16T14:22:00Z",
      avatar: null,
    },
    {
      id: 2,
      userName: "SecurityAnalyst",
      text: "I'd add that the integration of AI with human expertise is crucial. AI can process vast amounts of data, but human intuition and experience are still invaluable in interpreting results and making strategic decisions.",
      date: "2023-04-17T09:15:00Z",
      avatar: null,
    },
  ];

  const [comments, setComments] = useState(sampleComments);

  const fetchRelatedArticles = async (category, limit) => {
    try {
      const response = await getarticlebycat(category, limit);

      const filtered = response.filter((article) => article._id !== id);
      setRelatedArticles(filtered);
    } catch (error) {
      console.error("Error fetching related articles:", error);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const data = await getArticleById(id);

        if (!data || !data._id) {
          throw new Error("Invalid article data received");
        }

        setArticle(data);

        if (data.ownerId) {
          const ownerData = await getUserById( data.ownerId );
          
          if (ownerData) {
            setOwner(ownerData); 
          }
        }

        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(data._id));
      } catch (error) {
        console.error("Error fetching article:", error);
        setAlertMessage("Failed to load article. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    if (article && article.category) {
      fetchRelatedArticles(article.category, 10); 
    }
  }, [article]);

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

      alert("Share link copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    let userName = "Guest";
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.firstName || user.lastName) {
        userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      } else if (user.username) {
        userName = user.username;
      }
    } catch (e) {
      console.error("Error getting user from localStorage:", e);
    }

    const comment = {
      id: Date.now(),
      userName: userName,
      text: newComment,
      date: new Date().toISOString(),
      avatar: null,
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const addToLibrary = () => {
    if (!article) return;

    const library = JSON.parse(localStorage.getItem("articleLibrary")) || [];

    const exists = library.some((item) => item._id === article._id);
    if (exists) {
      alert("This article is already in your library!");
      return;
    }

    setSaveAnimation(true);
    setTimeout(() => {
      library.push(article);
      localStorage.setItem("articleLibrary", JSON.stringify(library));
      setSaveAnimation(false);
      alert("Article added to your library!");
    }, 1000);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const openImageModal = () => {
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };

  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalPages = Math.ceil(relatedArticles.length / cardsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const indexOfLastArticle = currentPage * cardsPerPage;
  const indexOfFirstArticle = indexOfLastArticle - cardsPerPage;
  const currentArticles = relatedArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handleAuthorClick = () => {
    if (article && article.ownerId) {
      window.location.href = `/userProfile?id=${article.ownerId}`;
    }
  };

  const renderTitleGraphSVG = () => {
    return (
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="50"
          r="25"
          fill="#e0e7ff"
          stroke="#7b68ee"
          strokeWidth="2.5"
        />
        <text
          x="100"
          y="55"
          textAnchor="middle"
          fill="#7b68ee"
          fontSize="14"
          fontWeight="bold"
        >
          ICT
        </text>
        <circle
          cx="50"
          cy="120"
          r="20"
          fill="#fae8ff"
          stroke="#d946ef"
          strokeWidth="2"
        />
        <text x="50" y="125" textAnchor="middle" fill="#d946ef" fontSize="12">
          Cyber
        </text>
        <circle
          cx="150"
          cy="120"
          r="20"
          fill="#dbeafe"
          stroke="#6366f1"
          strokeWidth="2"
        />
        <text x="150" y="125" textAnchor="middle" fill="#6366f1" fontSize="12">
          Tech
        </text>
        <line
          x1="100"
          y1="75"
          x2="50"
          y2="100"
          stroke="#7b68ee"
          strokeWidth="2"
        />
        <line
          x1="100"
          y1="75"
          x2="150"
          y2="100"
          stroke="#7b68ee"
          strokeWidth="2"
        />
        <line
          x1="50"
          y1="140"
          x2="150"
          y2="140"
          stroke="#d946ef"
          strokeWidth="2"
          strokeDasharray="5"
        />
      </svg>
    );
  };

  const renderGraphSVG = (type) => {
    switch (type) {
      case "top":
        return (
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle
              cx="40"
              cy="30"
              r="15"
              fill="#e0e7ff"
              stroke="#7b68ee"
              strokeWidth="2.5"
            />
            <text
              x="40"
              y="35"
              textAnchor="middle"
              fill="#7b68ee"
              fontSize="10"
              fontWeight="bold"
            >
              Cloud
            </text>
            <circle
              cx="100"
              cy="40"
              r="12"
              fill="#fae8ff"
              stroke="#d946ef"
              strokeWidth="2.5"
            />
            <text
              x="100"
              y="44"
              textAnchor="middle"
              fill="#d946ef"
              fontSize="8"
              fontWeight="bold"
            >
              API
            </text>
            <circle
              cx="70"
              cy="90"
              r="18"
              fill="#dbeafe"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <text
              x="70"
              y="94"
              textAnchor="middle"
              fill="#6366f1"
              fontSize="10"
              fontWeight="bold"
            >
              Data
            </text>
            <line
              x1="40"
              y1="45"
              x2="70"
              y2="72"
              stroke="#7b68ee"
              strokeWidth="2"
            />
            <line
              x1="100"
              y1="52"
              x2="70"
              y2="72"
              stroke="#d946ef"
              strokeWidth="2"
            />
          </svg>
        );
      case "middle1":
        return (
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="#dbeafe"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fill="#6366f1"
              fontSize="12"
              fontWeight="bold"
            >
              Security
            </text>
            <circle
              cx="120"
              cy="60"
              r="15"
              fill="#e0e7ff"
              stroke="#7b68ee"
              strokeWidth="2.5"
            />
            <text
              x="120"
              y="64"
              textAnchor="middle"
              fill="#7b68ee"
              fontSize="9"
              fontWeight="bold"
            >
              Firewall
            </text>
            <circle
              cx="90"
              cy="120"
              r="18"
              fill="#fae8ff"
              stroke="#d946ef"
              strokeWidth="2.5"
            />
            <text
              x="90"
              y="124"
              textAnchor="middle"
              fill="#d946ef"
              fontSize="10"
              fontWeight="bold"
            >
              Network
            </text>
            <line
              x1="70"
              y1="50"
              x2="105"
              y2="60"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <line
              x1="120"
              y1="75"
              x2="90"
              y2="102"
              stroke="#7b68ee"
              strokeWidth="2"
            />
            <line
              x1="50"
              y1="70"
              x2="90"
              y2="102"
              stroke="#6366f1"
              strokeWidth="2"
            />
          </svg>
        );
      case "middle2":
        return (
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="40"
              r="20"
              fill="#fae8ff"
              stroke="#d946ef"
              strokeWidth="2.5"
            />
            <text
              x="80"
              y="45"
              textAnchor="middle"
              fill="#d946ef"
              fontSize="12"
              fontWeight="bold"
            >
              AI
            </text>
            <circle
              cx="40"
              cy="90"
              r="15"
              fill="#dbeafe"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <text
              x="40"
              y="94"
              textAnchor="middle"
              fill="#6366f1"
              fontSize="9"
              fontWeight="bold"
            >
              ML
            </text>
            <circle
              cx="120"
              cy="90"
              r="15"
              fill="#e0e7ff"
              stroke="#7b68ee"
              strokeWidth="2.5"
            />
            <text
              x="120"
              y="94"
              textAnchor="middle"
              fill="#7b68ee"
              fontSize="9"
              fontWeight="bold"
            >
              IoT
            </text>
            <line
              x1="80"
              y1="60"
              x2="40"
              y2="75"
              stroke="#d946ef"
              strokeWidth="2"
            />
            <line
              x1="80"
              y1="60"
              x2="120"
              y2="75"
              stroke="#d946ef"
              strokeWidth="2"
            />
            <line
              x1="55"
              y1="90"
              x2="105"
              y2="90"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="4"
            />
          </svg>
        );
      case "bottom1":
        return (
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="30"
              r="15"
              fill="#e0e7ff"
              stroke="#7b68ee"
              strokeWidth="2.5"
            />
            <text
              x="70"
              y="34"
              textAnchor="middle"
              fill="#7b68ee"
              fontSize="9"
              fontWeight="bold"
            >
              HTTP
            </text>
            <circle
              cx="30"
              cy="70"
              r="12"
              fill="#dbeafe"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <text
              x="30"
              y="74"
              textAnchor="middle"
              fill="#6366f1"
              fontSize="8"
              fontWeight="bold"
            >
              SSL
            </text>
            <circle
              cx="110"
              cy="70"
              r="12"
              fill="#fae8ff"
              stroke="#d946ef"
              strokeWidth="2.5"
            />
            <text
              x="110"
              y="74"
              textAnchor="middle"
              fill="#d946ef"
              fontSize="8"
              fontWeight="bold"
            >
              DNS
            </text>
            <circle
              cx="70"
              cy="110"
              r="15"
              fill="#e0e7ff"
              stroke="#7b68ee"
              strokeWidth="2.5"
            />
            <text
              x="70"
              y="114"
              textAnchor="middle"
              fill="#7b68ee"
              fontSize="9"
              fontWeight="bold"
            >
              TCP/IP
            </text>
            <line
              x1="70"
              y1="45"
              x2="30"
              y2="58"
              stroke="#7b68ee"
              strokeWidth="2"
            />
            <line
              x1="70"
              y1="45"
              x2="110"
              y2="58"
              stroke="#7b68ee"
              strokeWidth="2"
            />
            <line
              x1="30"
              y1="82"
              x2="70"
              y2="95"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <line
              x1="110"
              y1="82"
              x2="70"
              y2="95"
              stroke="#d946ef"
              strokeWidth="2"
            />
          </svg>
        );
      case "bottom2":
        return (
          <svg width="170" height="170" viewBox="0 0 170 170">
            <circle
              cx="85"
              cy="40"
              r="20"
              fill="#dbeafe"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <text
              x="85"
              y="45"
              textAnchor="middle"
              fill="#6366f1"
              fontSize="12"
              fontWeight="bold"
            >
              Database
            </text>
            <circle
              cx="40"
              cy="100"
              r="15"
              fill="#e0e7ff"
              stroke="#7b68ee"
              strokeWidth="2.5"
            />
            <text
              x="40"
              y="104"
              textAnchor="middle"
              fill="#7b68ee"
              fontSize="9"
              fontWeight="bold"
            >
              SQL
            </text>
            <circle
              cx="130"
              cy="100"
              r="15"
              fill="#fae8ff"
              stroke="#d946ef"
              strokeWidth="2.5"
            />
            <text
              x="130"
              y="104"
              textAnchor="middle"
              fill="#d946ef"
              fontSize="9"
              fontWeight="bold"
            >
              NoSQL
            </text>
            <line
              x1="85"
              y1="60"
              x2="40"
              y2="85"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <line
              x1="85"
              y1="60"
              x2="130"
              y2="85"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <line
              x1="55"
              y1="100"
              x2="115"
              y2="100"
              stroke="#7b68ee"
              strokeWidth="2"
              strokeDasharray="4"
            />
          </svg>
        );
      case "bottom3":
        return (
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle
              cx="65"
              cy="30"
              r="15"
              fill="#fae8ff"
              stroke="#d946ef"
              strokeWidth="2.5"
            />
            <text
              x="65"
              y="34"
              textAnchor="middle"
              fill="#d946ef"
              fontSize="9"
              fontWeight="bold"
            >
              Frontend
            </text>
            <circle
              cx="30"
              cy="80"
              r="12"
              fill="#e0e7ff"
              stroke="#7b68ee"
              strokeWidth="2.5"
            />
            <text
              x="30"
              y="84"
              textAnchor="middle"
              fill="#7b68ee"
              fontSize="8"
              fontWeight="bold"
            >
              HTML
            </text>
            <circle
              cx="65"
              cy="80"
              r="12"
              fill="#dbeafe"
              stroke="#6366f1"
              strokeWidth="2.5"
            />
            <text
              x="65"
              y="84"
              textAnchor="middle"
              fill="#6366f1"
              fontSize="8"
              fontWeight="bold"
            >
              CSS
            </text>
            <circle
              cx="100"
              cy="80"
              r="12"
              fill="#fae8ff"
              stroke="#d946ef"
              strokeWidth="2.5"
            />
            <text
              x="100"
              y="84"
              textAnchor="middle"
              fill="#d946ef"
              fontSize="8"
              fontWeight="bold"
            >
              JS
            </text>
            <line
              x1="65"
              y1="45"
              x2="30"
              y2="68"
              stroke="#d946ef"
              strokeWidth="2"
            />
            <line
              x1="65"
              y1="45"
              x2="65"
              y2="68"
              stroke="#d946ef"
              strokeWidth="2"
            />
            <line
              x1="65"
              y1="45"
              x2="100"
              y2="68"
              stroke="#d946ef"
              strokeWidth="2"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="artd-container">
        <div className="artd-loading">
          <div className="artd-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="artd-container">
        <div className="artd-not-found">
          <h2>Article Not Found</h2>
          <p>
            The article you're looking for doesn't exist or has been removed.
          </p>
          <button className="artd-back-btn" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="artd-container">
      <div className="artd-graph-title">{renderTitleGraphSVG()}</div>
      <div className="artd-graph-top">{renderGraphSVG("top")}</div>
      <div className="artd-graph-middle-1">{renderGraphSVG("middle1")}</div>
      <div className="artd-graph-middle-2">{renderGraphSVG("middle2")}</div>
      <div className="artd-graph-bottom-1">{renderGraphSVG("bottom1")}</div>
      <div className="artd-graph-bottom-2">{renderGraphSVG("bottom2")}</div>
      <div className="artd-graph-bottom-3">{renderGraphSVG("bottom3")}</div>

      <div className="artd-content">
        <div className="artd-navigation">
          <button className="artd-back-btn" onClick={handleGoBack}>
            <ArrowLeft size={18} />
            Back to Articles
          </button>
        </div>

        <div className="artd-category">
          <span>{article.category}</span>
        </div>

        <h1 className="artd-title">{article.title}</h1>

        <div className="artd-author" onClick={handleAuthorClick}>
          <div className="artd-author-avatar">
            <User size={24} />
          </div>
          <div className="artd-author-info">
            <h3 className="artd-author-name">
              {owner
                ? `${owner.firstName} ${owner.lastName}`
                : "Unknown Author"}
            </h3>
            <span className="artd-author-role">
              {owner?.role || "Content Creator"}
            </span>
          </div>
        </div>

        <div className="artd-meta">
          <div className="artd-meta-item">
            <Calendar size={16} />
            <span>{formatDate(article.createdAt || new Date())}</span>
          </div>
          <div className="artd-meta-item">
            <Eye size={16} />
            <span>{article.views || article.click || 0} views</span>
          </div>
          <div className="artd-meta-item">
            <ThumbsUp size={16} />
            <span>
              {article.likes || Math.floor(Math.random() * 50) + 5} likes
            </span>
          </div>
          <div className="artd-meta-item">
            <Share2 size={16} />
            <span>{Math.floor(Math.random() * 20) + 2} shares</span>
          </div>
          <div className="artd-meta-item">
            <Bookmark size={16} />
            <span>{Math.floor(Math.random() * 30) + 10} saves</span>
          </div>
        </div>

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

        {imageModalOpen && (
          <div className="artd-modal" onClick={closeImageModal}>
            <div className="artd-modal-content">
              <button className="artd-modal-close" onClick={closeImageModal}>
                <X size={24} />
              </button>
              <img
                src={
                  article.imageUrl || "/placeholder.svg?height=800&width=1200"
                }
                alt={article.title}
                className="artd-modal-image"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        <div className="artd-body">
          <p className="artd-summary">
            {article.description || article.content?.substring(0, 200)}
          </p>

          <div className="artd-content-text">{article.content}</div>
        </div>

        <div className="artd-actions">
          <button
            className={`artd-action-btn artd-favorite-btn ${
              isFavorite ? "artd-active" : ""
            }`}
            onClick={toggleFavorite}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            <span>Favorite</span>
          </button>

          <button
            className="artd-action-btn artd-share-btn"
            onClick={handleShare}
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>

          <button
            className={`artd-action-btn artd-library-btn ${
              saveAnimation ? "artd-save-animation" : ""
            }`}
            onClick={addToLibrary}
            disabled={saveAnimation}
          >
            <BookmarkPlus size={20} />
            <span>Save to My Library</span>
          </button>
        </div>

        <div className="artd-comments">
          <h2 className="artd-comments-title">
            <MessageCircle size={22} />
            Comments ({comments.length})
          </h2>

          <div className="artd-comments-list">
            {comments.length === 0 ? (
              <p className="artd-no-comments">
                Be the first to comment on this article!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="artd-comment">
                  <div className="artd-comment-avatar">
                    {comment.avatar ? (
                      <img
                        src={comment.avatar || "/placeholder.svg"}
                        alt={comment.userName}
                      />
                    ) : (
                      <div className="artd-avatar-placeholder">
                        {getInitial(comment.userName)}
                      </div>
                    )}
                  </div>
                  <div className="artd-comment-content">
                    <div className="artd-comment-header">
                      <h4 className="artd-comment-author">
                        {comment.userName}
                      </h4>
                      <span className="artd-comment-date">
                        {formatDate(comment.date)}
                      </span>
                    </div>
                    <p className="artd-comment-text">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="artd-comment-form">
            <div className="artd-form-avatar">
              <User size={20} />
            </div>
            <div className="artd-form-input-container">
              <textarea
                className="artd-form-input"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              ></textarea>
              <button
                className="artd-submit-btn"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

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

            {totalPages > 1 && (
              <div className="artd-pagination">
                <button
                  className="artd-pagination-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="artd-pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`artd-page-number ${
                          currentPage === page ? "artd-active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="artd-pagination-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
