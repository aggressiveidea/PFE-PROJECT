"use client";

import { useEffect, useState } from "react";
import "./TrendingTopics.css";
import sampleImage from "../../assets/4da4441108a5238b1d18206cac2ebbe8.jpg";
import Image from "../../assets/7464e3b2a9599cab8f6cef02f6c4ac50.jpg";
import { toparticles, getUserById } from "../../services/Api";
import {
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  ChevronDown,
} from "lucide-react";


const TrendingTopics = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [owners, setOwners] = useState({});

  // Refined purple color palette (no blue)
  const colors = {
    primary: "#9333ea",
    secondary: "#c026d3",
    tertiary: "#d946ef",
    light: "#f5d0fe",
    dark: "#7e22ce",
    white: "#FFFFFF",
    gray: "#64748b",
  };

  // Category color mapping with purple tones
  const categoryColors = {
    Security: "#e879f9",
    Quantum: "#c084fc",
    Legal: "#d8b4fe",
    Technology: "#f0abfc",
    Business: "#a855f7",
    Health: "#e879f9",
    General: "#f5d0fe",
    default: "#d8b4fe",
    Cybersecurity: "#e879f9",
    "Data Protection": "#c084fc",
    "Digital Rights": "#d8b4fe",
    "AI Regulation": "#f0abfc",
    "Privacy Laws": "#a855f7",
  };

  const fetchTopArticles = async () => {
    setIsLoading(true);
    try {
      // Using your original fetch code
      const response = await toparticles();

      if (response && Array.isArray(response)) {
        // Process articles
        const articlesWithMetrics = response.slice(0, 4).map((article) => ({
          ...article,
          views: article.click || 0,
          likes: article.favourites || 0,
          comments: article.comment || 0,
        }));

        setArticles(articlesWithMetrics);

        // Fetch owner info for each article
        const ownerPromises = articlesWithMetrics.map(async (article) => {
          if (article.ownerId) {
            try {
              const ownerData = await getUserById(article.ownerId);
              if (ownerData) {
                return { id: article.ownerId, data: ownerData };
              }
            } catch (err) {
              console.error(
                `Error fetching owner for article ${article._id}:`,
                err
              );
            }
          }
          return null;
        });

        // Process owner data
        const ownersData = await Promise.all(ownerPromises);
        const ownersMap = {};

        ownersData.forEach((owner) => {
          if (owner) {
            ownersMap[owner.id] = owner.data;
          }
        });

        setOwners(ownersMap);
      }
    } catch (err) {
      console.error("Failed to fetch top articles:", err);
      // Fallback data in case API fails
      const fallbackArticles = [
        {
          _id: "article-1",
          title: "The Impact of GDPR on Global Data Protection Standards",
          content:
            "An in-depth analysis of how GDPR has influenced data protection laws worldwide and set new standards for privacy.",
          category: "Data Protection",
          language: "English",
          createdAt: new Date().toISOString(),
          imageUrl: "/placeholder.svg?height=350&width=600",
          ownerId: "user-1",
          ownerName: "Alex Johnson",
          ownerProfilePic: "/placeholder.svg?height=60&width=60",
          views: 1245,
          likes: 328,
          comments: 47,
          click: 1500,
        },
        {
          _id: "article-2",
          title: "Cybersecurity Laws: A Comparative Study Across Jurisdictions",
          content:
            "This article examines how different countries approach cybersecurity legislation and enforcement.",
          category: "Cybersecurity",
          language: "English",
          createdAt: new Date().toISOString(),
          imageUrl: "/placeholder.svg?height=120&width=120",
          ownerId: "user-2",
          ownerName: "Maria Garcia",
          ownerProfilePic: "/placeholder.svg?height=60&width=60",
          views: 982,
          likes: 215,
          comments: 32,
          click: 1100,
        },
        {
          _id: "article-3",
          title: "AI Regulation: Balancing Innovation and Ethics",
          content:
            "A look at emerging regulatory frameworks for artificial intelligence and their implications for developers and users.",
          category: "AI Regulation",
          language: "English",
          createdAt: new Date().toISOString(),
          imageUrl: "/placeholder.svg?height=120&width=120",
          ownerId: "user-3",
          ownerName: "David Chen",
          ownerProfilePic: "/placeholder.svg?height=60&width=60",
          views: 876,
          likes: 194,
          comments: 28,
          click: 950,
        },
        {
          _id: "article-4",
          title: "Digital Rights in the Age of Social Media",
          content:
            "Exploring how digital rights are evolving in response to the challenges posed by social media platforms.",
          category: "Digital Rights",
          language: "English",
          createdAt: new Date().toISOString(),
          imageUrl: "/placeholder.svg?height=120&width=120",
          ownerId: "user-4",
          ownerName: "Sarah Smith",
          ownerProfilePic: "/placeholder.svg?height=60&width=60",
          views: 754,
          likes: 168,
          comments: 23,
          click: 820,
        },
      ];
      setArticles(fallbackArticles);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopArticles();
  }, []);

  const handleTopicClick = (article) => {
    console.log("Go to article:", article.title);
    // Navigate to article page
    window.location.href = `/articles/${article._id}`;
  };

  const handleAuthorClick = (e, authorId) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    console.log("Go to author profile:", authorId);
    window.location.href = `/userProfile?id=${authorId}`;
  };

  const scrollToNextSection = () => {
    const authorsSection = document.querySelector(".authors-section");
    if (authorsSection) {
      authorsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get color for a category
  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors.default;
  };

  // Truncate text to a specific length
  const truncateText = (text, length) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get owner name from owners map or fallback to article.ownerName
  const getOwnerName = (article) => {
    if (owners[article.ownerId]) {
      return (
        owners[article.ownerId].firstName +
        " " +
        owners[article.ownerId].lastName
      );
    }
    return article.ownerName || "Unknown Author";
  };

  // Get owner profile pic from owners map or fallback to article.ownerProfilePic
  const getOwnerProfilePic = (article) => {
    if (owners[article.ownerId] && owners[article.ownerId].profileImgUrl) {
      return owners[article.ownerId].profileImgUrl;
    }
    return article.ownerProfilePic || "/placeholder.svg?height=40&width=40";
  };

  return (
    <div className="ictlaws_trending-section">
      {/* Static star decorations */}
      <div className="ictlaws_star ictlaws_star-1"></div>
      <div className="ictlaws_star ictlaws_star-2"></div>
      <div className="ictlaws_star ictlaws_star-3"></div>
      <div className="ictlaws_star ictlaws_star-4"></div>
      <div className="ictlaws_star ictlaws_star-5"></div>
      <div className="ictlaws_star ictlaws_star-6"></div>
      <div className="ictlaws_star ictlaws_star-7"></div>
      <div className="ictlaws_star ictlaws_star-8"></div>
      <div className="ictlaws_star ictlaws_star-9"></div>
      <div className="ictlaws_star ictlaws_star-10"></div>
      <div className="ictlaws_star ictlaws_star-11"></div>
      <div className="ictlaws_star ictlaws_star-12"></div>
      <div className="ictlaws_star ictlaws_star-13"></div>
      <div className="ictlaws_star ictlaws_star-14"></div>
      <div className="ictlaws_star ictlaws_star-15"></div>

      <div className="ictlaws_trending-header">
        <h2 className="ictlaws_section-title">Trending Topics</h2>
        <p className="ictlaws_section-subtitle">
          Stay updated with the most popular ICT law topics and discussions.
        </p>
      </div>

      {isLoading ? (
        <div className="ictlaws_trending-loading">
          <div className="ictlaws_loading-spinner"></div>
          <p>Loading trending topics...</p>
        </div>
      ) : (
        <div className="ictlaws_trending-content">
          {/* Featured Topic with more subtle blur effect */}
          {articles[0] && (
            <div
              className="ictlaws_featured-topic"
              onClick={() => handleTopicClick(articles[0])}
            >
              <div className="ictlaws_featured-image">
                <img
                  src={
                    articles[0].imageUrl ||
                    "/placeholder.svg?height=350&width=600" ||
                    "/placeholder.svg"
                  }
                  alt={articles[0].title}
                  className="ictlaws_featured-img"
                />
                <div className="ictlaws_featured-overlay">
                  <div className="ictlaws_featured-badge">
                    <span
                      className="ictlaws_tag"
                      style={{
                        backgroundColor: getCategoryColor(articles[0].category),
                      }}
                    >
                      {articles[0].category || "General"}
                    </span>
                    <span className="ictlaws_trend">
                      <TrendingUp size={14} /> Top Pick
                    </span>
                  </div>
                  <h3 className="ictlaws_featured-title">
                    {truncateText(articles[0].title, 60)}
                  </h3>

                  {/* Author info - clickable */}
                  <div
                    className="ictlaws_featured-author"
                    onClick={(e) => handleAuthorClick(e, articles[0].ownerId)}
                  >
                    <div className="ictlaws_author-avatar">
                      <img
                        src={
                          getOwnerProfilePic(articles[0]) || "/placeholder.svg"
                        }
                        alt={getOwnerName(articles[0])}
                      />
                    </div>
                    <div className="ictlaws_author-info">
                      <span className="ictlaws_author-name">
                        {getOwnerName(articles[0])}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced date display */}
                  <div className="ictlaws_featured-date">
                    {formatDate(articles[0].createdAt)}
                  </div>

                  <div className="ictlaws_metrics">
                    <div className="ictlaws_metric">
                      <Eye size={14} />
                      <span>{articles[0].views || articles[0].click || 0}</span>
                    </div>
                    <div className="ictlaws_metric">
                      <Heart size={14} />
                      <span>
                        {articles[0].likes || articles[0].favourites || 0}
                      </span>
                    </div>
                    <div className="ictlaws_metric">
                      <MessageCircle size={14} />
                      <span>
                        {articles[0].comments || articles[0].comment || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Topics with more subtle blur effect */}
          <div className="ictlaws_sidebar-topics">
            {articles.slice(1).map((article, index) => (
              <div
                className="ictlaws_sidebar-topic"
                key={article._id || index}
                onClick={() => handleTopicClick(article)}
              >
                <div className="ictlaws_sidebar-img">
                  <img
                    src={
                      article.imageUrl ||
                      "/placeholder.svg?height=120&width=120" ||
                      "/placeholder.svg"
                    }
                    alt={article.category}
                  />
                </div>
                <div className="ictlaws_sidebar-text">
                  <span
                    className="ictlaws_topic-tag"
                    style={{
                      backgroundColor: getCategoryColor(article.category),
                    }}
                  >
                    {article.category || "General"}
                  </span>
                  <p className="ictlaws_sidebar-title">
                    {truncateText(article.title, 45)}
                  </p>

                  {/* Author info - clickable */}
                  <div
                    className="ictlaws_sidebar-author"
                    onClick={(e) => handleAuthorClick(e, article.ownerId)}
                  >
                    <div className="ictlaws_author-avatar-small">
                      <img
                        src={getOwnerProfilePic(article) || "/placeholder.svg"}
                        alt={getOwnerName(article)}
                      />
                    </div>
                    <span className="ictlaws_author-name-small">
                      {getOwnerName(article)}
                    </span>
                  </div>

                  {/* Added date display for sidebar items */}
                  <div className="ictlaws_sidebar-date">
                    {formatDate(article.createdAt)}
                  </div>

                  <div className="ictlaws_sidebar-metrics">
                    <div className="ictlaws_sidebar-metric">
                      <Eye size={14} />
                      <span>{article.views || article.click || 0}</span>
                    </div>
                    <div className="ictlaws_sidebar-metric">
                      <Heart size={14} />
                      <span>{article.likes || article.favourites || 0}</span>
                    </div>
                    <div className="ictlaws_sidebar-metric">
                      <MessageCircle size={14} />
                      <span>{article.comments || article.comment || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="ictlaws_sidebar-arrow">
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

     
    </div>
  );
};

export default TrendingTopics;
