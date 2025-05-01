"use client";

import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  MessageSquare,
  Tag,
  FileText,
  LinkIcon,
} from "lucide-react";
import "./MessagePreview.css";
import { getArticleById } from "../../services/Api";

const MessagePreview = ({ message }) => {
  const [expanded, setExpanded] = useState(false);
  const [articleInfo, setArticleInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch article information when message is selected
  useEffect(() => {
    const fetchArticleInfo = async () => {
      if (message?.articleId) {
        setLoading(true);
        try {
          const articleData = await getArticleById(message.articleId);
          if (articleData) {
            setArticleInfo({
              title: articleData.title || "Untitled Article",
              category: articleData.category || "Uncategorized",
            });
          }
        } catch (error) {
          console.error("Error fetching article info:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticleInfo();
  }, [message?.articleId]);

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Date not available";
    }
  };

  if (!message) {
    return (
      <div className="dashboard-message-preview dashboard-message-empty">
        <MessageSquare size={48} className="dashboard-message-empty-icon" />
        <p>No message selected</p>
      </div>
    );
  }

  return (
    <div className="dashboard-message-preview">
      <div className="dashboard-message-header">
        <div className="dashboard-message-sender">
          <div className="dashboard-message-avatar">
            {message?.profileImgUrl ? (
              <img
                src={message.profileImgUrl || "/placeholder.svg"}
                alt="Sender"
              />
            ) : (
              <div className="dashboard-message-avatar-placeholder">
                <User size={20} />
              </div>
            )}
          </div>
          <div className="dashboard-message-sender-info">
            <h3 className="dashboard-message-sender-name">
              {message?.userName || "Unknown Sender"}
            </h3>
            {message?.userID && (
              <p className="dashboard-message-sender-email">
                User ID: {message.userID}
              </p>
            )}
          </div>
        </div>
        <div className="dashboard-message-meta">
          <div className="dashboard-message-date">
            <Calendar size={14} />
            <span>{formatDate(message?.createdAt)}</span>
          </div>
          <div className="dashboard-message-status">
            <Tag size={14} />
            <span>{message?.verified ? "Verified" : "Unverified"}</span>
          </div>
        </div>
      </div>

      {/* Article reference section */}
      {message.articleId && (
        <div className="dashboard-message-article-ref">
          <div className="dashboard-message-article-header">
            <FileText size={16} />
            <span>Referenced Article</span>
          </div>

          {loading ? (
            <div className="dashboard-message-loading">
              Loading article information...
            </div>
          ) : articleInfo ? (
            <div className="dashboard-message-article-info">
              <h4 className="dashboard-message-article-title">
                <LinkIcon size={14} />
                {articleInfo.title}
              </h4>
              {articleInfo.category && (
                <span className="dashboard-message-article-category">
                  {articleInfo.category}
                </span>
              )}
            </div>
          ) : (
            <div className="dashboard-message-article-not-found">
              Article information not available
            </div>
          )}
        </div>
      )}

      <div className="dashboard-message-content">
        <h4 className="dashboard-message-title">Message Content</h4>

        <div className={`dashboard-message-body ${expanded ? "expanded" : ""}`}>
          <p>{message?.text || "No message content available."}</p>
        </div>

        {message?.text && message.text.length > 200 && (
          <button
            className="dashboard-message-expand-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MessagePreview;
