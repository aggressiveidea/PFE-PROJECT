"use client"

import { useEffect, useState } from "react"
import { Eye, Heart, MessageCircle, TrendingUp, Clock } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules"
import { toparticles, getUserById } from "../../services/Api"
import "./TrendingTopics.css"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

const TrendingTopics = () => {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [owners, setOwners] = useState({})

  const fetchTopArticles = async () => {
    setIsLoading(true)
    try {
      const response = await toparticles()

      if (response && Array.isArray(response)) {
        const articlesWithMetrics = response.map((article) => ({
          ...article,
          views: article.click || 0,
          likes: article.favourites || 0,
          comments: article.comment || 0,
        }))

        setArticles(articlesWithMetrics)
        const ownerPromises = articlesWithMetrics.map(async (article) => {
          if (article.ownerId) {
            try {
              const ownerData = await getUserById(article.ownerId)
              if (ownerData) {
                return { id: article.ownerId, data: ownerData }
              }
            } catch (err) {
              console.error(`Error fetching owner for article ${article._id}:`, err)
            }
          }
          return null
        })

        const ownersData = await Promise.all(ownerPromises)
        const ownersMap = {}

        ownersData.forEach((owner) => {
          if (owner) {
            ownersMap[owner.id] = owner.data
          }
        })

        setOwners(ownersMap)
      }
    } catch (err) {
      console.error("Failed to fetch top articles:", err)
      const fallbackArticles = [
        {
          _id: "article-1",
          title: "The Impact of GDPR on Global Data Protection Standards",
          category: "Data Protection",
          createdAt: new Date().toISOString(),
          imageUrl: "/data-protection-concept.png",
          ownerId: "user-1",
          ownerName: "Alex Johnson",
          ownerProfilePic: "/abstract-profile.png",
          click: 1245,
          favourites: 328,
          comment: 47,
        },
        {
          _id: "article-2",
          title: "Cybersecurity Laws: A Comparative Study Across Jurisdictions",
          category: "Cybersecurity",
          createdAt: new Date().toISOString(),
          imageUrl: "/cybersecurity-network.png",
          ownerId: "user-2",
          ownerName: "Maria Garcia",
          ownerProfilePic: "/abstract-profile.png",
          click: 982,
          favourites: 215,
          comment: 32,
        },
        {
          _id: "article-3",
          title: "AI Regulation: Balancing Innovation and Ethics",
          category: "AI Regulation",
          createdAt: new Date().toISOString(),
          imageUrl: "/ai-ethics.png",
          ownerId: "user-3",
          ownerName: "David Chen",
          ownerProfilePic: "/abstract-profile.png",
          click: 876,
          favourites: 194,
          comment: 28,
        },
        {
          _id: "article-4",
          title: "Digital Rights in the Age of Social Media",
          category: "Digital Rights",
          createdAt: new Date().toISOString(),
          imageUrl: "/digital-rights.png",
          ownerId: "user-4",
          ownerName: "Sarah Smith",
          ownerProfilePic: "/abstract-profile.png",
          click: 754,
          favourites: 168,
          comment: 23,
        },
        {
          _id: "article-5",
          title: "Blockchain Technology and Legal Frameworks",
          category: "Blockchain",
          createdAt: new Date().toISOString(),
          imageUrl: "/blockchain-legal.png",
          ownerId: "user-5",
          ownerName: "Michael Brown",
          ownerProfilePic: "/abstract-profile.png",
          click: 654,
          favourites: 142,
          comment: 19,
        },
        {
          _id: "article-6",
          title: "Privacy Laws in the Digital Age: A Global Perspective",
          category: "Privacy Law",
          createdAt: new Date().toISOString(),
          imageUrl: "/privacy-law-digital-tech.png",
          ownerId: "user-6",
          ownerName: "Jennifer Wilson",
          ownerProfilePic: "/abstract-profile.png",
          click: 589,
          favourites: 127,
          comment: 15,
        },
      ]
      setArticles(fallbackArticles)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTopArticles()
  }, [])

  const handleTopicClick = (article) => {
    window.location.href = `/articles/${article._id}`
  }

  const handleAuthorClick = (e, authorId) => {
    e.stopPropagation()
    window.location.href = `/userProfile?id=${authorId}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getOwnerName = (article) => {
    if (owners[article.ownerId]) {
      return owners[article.ownerId].firstName + " " + owners[article.ownerId].lastName
    }
    return article.ownerName || "Unknown Author"
  }

  const getOwnerProfilePic = (article) => {
    if (owners[article.ownerId] && owners[article.ownerId].profileImgUrl) {
      return owners[article.ownerId].profileImgUrl
    }
    return article.ownerProfilePic || "/abstract-profile.png"
  }

  const formatNumber = (num) => {
    if (num === undefined || num === null) {
      return "0"
    }

    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  return (
    <div className="trending-section">
      {/* Background Elements */}
      <div className="bg-gradient"></div>
      <div className="bg-pattern"></div>

      <div className="trending-header">
        <div className="header-badge">
          <TrendingUp size={16} />
          <span>What's Hot</span>
        </div>
        <h2 className="trending-title">TRENDING TOPICS</h2>
        <div className="title-underline"></div>
        <p className="trending-subtitle">Discover the most engaging discussions in ICT law and technology</p>
      </div>

      {isLoading ? (
        <div className="trending-loading">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              <span>Loading trending topics</span>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="trending-carousel-wrapper">
          <div className="nav-button nav-prev"></div>
          <div className="nav-button nav-next"></div>

          <div className="trending-carousel-container">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              spaceBetween={24}
              slidesPerView={1}
              centeredSlides={true}
              effect="coverflow"
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 2.5,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              navigation={{
                prevEl: ".nav-prev",
                nextEl: ".nav-next",
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              className="trending-carousel"
            >
              {articles.map((article, index) => (
                <SwiperSlide key={article._id || index}>
                  <div className="topic-card" onClick={() => handleTopicClick(article)}>
                    <div className="topic-image">
                      <img src={article.imageUrl || "/placeholder.svg?height=280&width=400"} alt={article.title} />
                      <div className="image-overlay"></div>
                      <div className="topic-category">{article.category}</div>
                      <div className="trending-indicator">
                        <TrendingUp size={14} />
                      </div>
                    </div>
                    <div className="topic-content">
                      <h3 className="topic-title">{article.title}</h3>

                      <div className="topic-meta">
                        <div className="topic-author" onClick={(e) => handleAuthorClick(e, article.ownerId)}>
                          <div className="author-avatar-container">
                            <img
                              src={getOwnerProfilePic(article) || "/placeholder.svg"}
                              alt={getOwnerName(article)}
                              className="author-avatar"
                            />
                          </div>
                          <div className="author-details">
                            <span className="author-name">{getOwnerName(article)}</span>
                            <div className="publish-info">
                              <Clock size={12} />
                              <span>{formatDate(article.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="topic-stats">
                        <div className="stat views">
                          <Eye size={16} />
                          <span>{formatNumber(article.views || 0)}</span>
                        </div>
                        <div className="stat likes">
                          <Heart size={16} />
                          <span>{formatNumber(article.likes || 0)}</span>
                        </div>
                        <div className="stat comments">
                          <MessageCircle size={16} />
                          <span>{formatNumber(article.comments || 0)}</span>
                        </div>
                      </div>

                      <div className="read-more">
                        <span>Read Article</span>
                        <div className="arrow-icon">→</div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrendingTopics
