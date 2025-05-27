"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, User } from "lucide-react"
import "./TopCreators.css"
import { topauthors } from "../../services/Api" 

const AuthorsLeaderboard = () => {
  const [creators, setCreators] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const creatorsPerPage = 5

  const fetchTopAuthors = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await topauthors()
      if (response && Array.isArray(response)) {
        setCreators(response)
        setTotalPages(Math.ceil(response.length / creatorsPerPage))
      }
    } catch (err) {
      console.error("Failed to fetch top authors:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTopAuthors()
  }, [fetchTopAuthors])

  const handleCreatorClick = useCallback((creatorId) => {
    window.location.href = `/userProfile?id=${creatorId}`
  }, [])

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const getCurrentPageCreators = () => {
    const startIndex = currentPage * creatorsPerPage
    const endIndex = startIndex + creatorsPerPage
    return creators.slice(startIndex, endIndex)
  }

  const getMedalIcon = (position) => {
    const rank = position + currentPage * creatorsPerPage

    if (rank === 0) return <div className="medal gold">1</div>
    if (rank === 1) return <div className="medal silver">2</div>
    if (rank === 2) return <div className="medal bronze">3</div>

    return <div className="rank">{rank + 1}</div>
  }

  const getRowClass = (position) => {
    const rank = position + currentPage * creatorsPerPage

    if (rank === 0) return "leaderboard-row gold-row"
    if (rank === 1) return "leaderboard-row silver-row"
    if (rank === 2) return "leaderboard-row bronze-row"

    return "leaderboard-row"
  }

  if (isLoading) {
    return <div className="loading">Loading authors...</div>
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">Active Authors</h2>
        <p className="leaderboard-subtitle">
          Discover our most prolific contributors who shape the discourse on ICT law
        </p>
      </div>

      <div className="leaderboard">
        {getCurrentPageCreators().map((creator, index) => (
          <div key={creator._id} className={getRowClass(index)} onClick={() => handleCreatorClick(creator._id)}>
            <div className="rank-container">{getMedalIcon(index)}</div>
            <div className="author-avatar">
              {creator.profileImgUrl ? (
                <img
                  src={creator.profileImgUrl || "/placeholder.svg"}
                  alt={`${creator.firstName} ${creator.lastName}`}
                />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="author-info">
              <div className="author-name">{`${creator.firstName} ${creator.lastName}`}</div>
              <div className="author-role">{creator.role}</div>
            </div>
            <div className="author-score">{creator.articleCount}</div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="page-indicator">
            {currentPage + 1} / {totalPages}
          </div>

          <button
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

export default AuthorsLeaderboard
