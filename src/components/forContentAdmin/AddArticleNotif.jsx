import { CheckCircle, XCircle } from "lucide-react"
import "./ArticleNotification.css"

function AddArticleNotif({
  profileImgUrl,
  userName,
  time,
  onReadArticle,
  onValidate,
  onReject,
  status,
  title,
  category,
}) {
  return (
    <div className={`article-notif ${status ? `article-notif-${status}` : ""}`}>
      <div className="article-notif-avatar">
        <img src={profileImgUrl || "/placeholder.svg?height=40&width=40"} alt={`${userName}'s avatar`} />
      </div>
      <div className="article-notif-content">
        <div className="article-notif-header">
          <h4 className="article-notif-username">{userName}</h4>
          <span className="article-notif-time">{time || "2 hours ago"}</span>
        </div>
        <p className="article-notif-message">Added a new article to the platform</p>

        {title && (
          <div className="article-notif-details">
            <span className="article-notif-title">{title}</span>
            {category && <span className="article-notif-category">{category}</span>}
          </div>
        )}
      </div>
      <div className="article-notif-actions">
        {!status && (
          <>
            <button className="article-notif-btn article-notif-btn-validate" onClick={onValidate}>
              <CheckCircle size={16} />
              <span>Validate</span>
            </button>
            <button className="article-notif-btn article-notif-btn-reject" onClick={onReject}>
              <XCircle size={16} />
              <span>Reject</span>
            </button>
          </>
        )}
        {status === "validated" && (
          <div className="article-notif-status article-notif-validated">
            <CheckCircle size={16} />
            <span>Validated</span>
          </div>
        )}
        {status === "rejected" && (
          <div className="article-notif-status article-notif-rejected">
            <XCircle size={16} />
            <span>Rejected</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddArticleNotif
