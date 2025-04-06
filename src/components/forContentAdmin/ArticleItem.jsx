"use client"

import { Calendar, Eye, User } from "lucide-react"

export default function ArticleItem({ article, isSelected, onClick, formatDate }) {
  if (!article) return null

  const handleClick = () => {
    if (onClick) onClick(article)
  }

  const formattedDate = formatDate ? formatDate(article.createdAt) : new Date(article.createdAt).toLocaleDateString()

  return (
    <div className={`article-item ${isSelected ? "selected" : ""}`} onClick={handleClick}>
      <div className="article-item-header">
        <div>
          <h3 className="article-item-title">{article.title || "Untitled Article"}</h3>
          <div className="article-item-meta">
            <span className="article-category-tag">{article.category || "Uncategorized"}</span>
            <span className="article-date">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
        </div>
        <button
          className="view-button"
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          <Eye size={16} />
        </button>
      </div>
      <p className="article-item-excerpt">
        {article.content ? `${article.content.substring(0, 120)}...` : "No content available"}
      </p>
      <div className="article-item-author">
        <User size={12} />
        By {article.authorName || "Unknown Author"}
      </div>
    </div>
  )
}



