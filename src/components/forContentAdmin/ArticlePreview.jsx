"use client"

import { Check, X, User, Calendar, Clock } from "lucide-react"
import EmptyState from "./EmptyState"

export default function ArticlePreview({ article, onValidate, onReject, formatDate }) {
  if (!article) {
    return (
      <div className="no-article-selected">
        <EmptyState
          title="No Article Selected"
          message="Select an article from the list to preview and validate its content"
        />
      </div>
    )
  }

  const formattedDate = formatDate ? formatDate(article.createdAt) : new Date(article.createdAt).toLocaleDateString()

  const handleValidate = () => {
    if (onValidate) onValidate(article._id)
  }

  const handleReject = () => {
    if (onReject) onReject(article._id)
  }

  return (
    <div className="article-preview">
      <div className="article-preview-header">
        <div>
          <span className="article-category-tag">{article.category || "Uncategorized"}</span>
          <h2 className="article-preview-title">{article.title || "Untitled Article"}</h2>
          <div className="article-preview-meta">
            <div className="meta-item">
              <User size={14} />
              <span>Submitted by {article.authorName || "Unknown Author"}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="meta-item">
              <Clock size={14} />
              <span>Awaiting approval</span>
            </div>
          </div>
        </div>
        <div className="article-actions">
          <button className="reject-button" onClick={handleReject} title="Reject this article">
            <X size={16} />
            <span>Reject</span>
          </button>
          <button className="validate-button" onClick={handleValidate} title="Approve and publish this article">
            <Check size={16} />
            <span>Approve & Publish</span>
          </button>
        </div>
      </div>

      {article.imageUrl && (
        <div className="article-preview-image">
          <img src={article.imageUrl || "/placeholder.svg"} alt={article.title || "Article image"} />
        </div>
      )}

      <div className="article-preview-content">
        {article.description && <p className="article-preview-description">{article.description}</p>}
        <div className="article-preview-body">{article.content || "No content available"}</div>
      </div>
    </div>
  )
}


