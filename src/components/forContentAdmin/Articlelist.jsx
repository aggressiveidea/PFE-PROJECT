// Update the ArticleList component to handle undefined articles
"use client"

import { FileText } from "lucide-react"
import ArticleItem from "./ArticleItem"
import EmptyState from "./EmptyState"

export default function ArticleList({
  articles = [],
  pendingCount = 0,
  selectedArticleId,
  onSelectArticle,
  formatDate,
}) {
  return (
    <div className="pending-articles-container">
      <h2 className="section-title">
        <FileText size={18} />
        Pending Articles
      </h2>

      {articles.length === 0 ? (
        <div className="no-articles-message">
          {pendingCount === 0 ? (
            <EmptyState
              title="No pending articles"
              message="When ICT experts submit articles, they'll appear here for your review"
            />
          ) : (
            <p>No articles match your search criteria</p>
          )}
        </div>
      ) : (
        <div className="articles-list">
          {articles.map((article) => (
            <ArticleItem
              key={article._id}
              article={article}
              isSelected={selectedArticleId === article._id}
              onClick={onSelectArticle || (() => {})}
              formatDate={formatDate || ((date) => new Date(date).toLocaleDateString())}
            />
          ))}
        </div>
      )}
    </div>
  )
}


