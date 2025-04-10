"use client"

import { CheckCircle, XCircle } from "lucide-react"
import "./ArticleNotification.css"

function AddArticleNotif({ image, userName, time, onReadArticle, onValidate, onReject, status, title, category }) {
  return (
    <div className={`article-notification ${status ? `article-${status}` : ""}`}>
      <div className="article-notification-avatar">
        <img src={image || "/placeholder.svg?height=40&width=40"} alt={`${userName}'s avatar`} />
      </div>
      <div className="article-notification-content">
        <div className="article-notification-header">
          <h4 className="article-notification-username">{userName}</h4>
          <span className="article-notification-time">{time || "2 hours ago"}</span>
        </div>
        <p className="article-notification-message">Added a new article to the platform</p>

        {/* Added article title and category */}
        {title && (
          <div className="content-admin-article-details">
            <span className="content-admin-article-title">{title}</span>
            {category && <span className="content-admin-article-category">{category}</span>}
          </div>
        )}
      </div>
      <div className="article-notification-actions">
        {!status && (
          <>
            <button className="btn btn-validate" onClick={onValidate}>
              <CheckCircle size={16} />
              <span>Validate</span>
            </button>
            <button className="btn btn-reject" onClick={onReject}>
              <XCircle size={16} />
              <span>Reject</span>
            </button>
          </>
        )}
        {status === "validated" && (
          <div className="article-status validated">
            <CheckCircle size={16} />
            <span>Validated</span>
          </div>
        )}
        {status === "rejected" && (
          <div className="article-status rejected">
            <XCircle size={16} />
            <span>Rejected</span>
          </div>
        )}
        <button className="btn btn-read" onClick={onReadArticle}>
          Read
        </button>
      </div>
    </div>
  )
}

export default AddArticleNotif

