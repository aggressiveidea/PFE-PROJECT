"use client"

import "./ArticlePreview.css"
import { User, Clock, Tag, CheckCircle, XCircle } from "lucide-react"

function ArticlePreview({ article, onValidate, onReject }) {
  if (!article) {
    return (
      <div className="article-preview-empty">
        <div className="article-preview-placeholder">
          <div className="placeholder-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <p className="placeholder-text">Select an article to preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="article-preview">
      <div className="article-card">
        <h3 className="article-title">{article.title}</h3>

        <div className="article-meta">
          <div className="article-meta-item">
            <User size={16} />
            <span>{article.userName}</span>
          </div>
          <div className="article-meta-item">
            <Clock size={16} />
            <span>2 hours ago</span>
          </div>
          {article.category && (
            <div className="article-meta-item">
              <Tag size={16} />
              <span>{article.category}</span>
            </div>
          )}
        </div>

        {article.image && (
          <div className="article-image-container">
            <img src={article.image || "/placeholder.svg"} alt={article.title} className="article-image" />
          </div>
        )}

        <div className="article-content">
          <p>{article.text}</p>
        </div>

        <div className="article-actions">
          <button className="btn-approve" onClick={() => onValidate(article)}>
            <CheckCircle size={16} />
            <span>Approve</span>
          </button>
          <button className="btn-reject" onClick={() => onReject(article)}>
            <XCircle size={16} />
            <span>Reject</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ArticlePreview
