"use client";

import { useState } from "react";

const TermCard = ({ term, index, animateItems, onCardClick }) => {
  const getCategoryColor = (category) => {
    const colors = {
      "Computer Crime": "#ec4899",
      "Personal Data": "#3b82f6",
      "Electronic Commerce": "#8b5cf6",
      Networks: "#6366f1",
      Security: "#10b981",
      Privacy: "#f59e0b",
      Legal: "#6b7280",
    };
    return colors[category] || "#8b5cf6";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const [showFullText, setShowFullText] = useState(false);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(term);
    }
  };

  const handleReadMore = (e) => {
    e.stopPropagation();
    setShowFullText(!showFullText);
  };

  return (
    <div
      className={`clean-term-wrapper ${
        animateItems ? "clean-term-animate" : ""
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleCardClick}
    >
      <div className="clean-term-container">
        {/* Term Title */}
        <h3 className="clean-term-title">{term.name}</h3>

        {/* Source */}
        <div className="clean-term-source">
          {term.source === "indexed"
            ? "Dindexed"
            : `D${term.source || "search"}`}
        </div>

        {/* Category Badge */}
        {term.category && (
          <div
            className="clean-term-category-badge"
            style={{ backgroundColor: getCategoryColor(term.category) }}
          >
            {term.category.toUpperCase()}
          </div>
        )}

        {/* Category Name */}
        {term.category && (
          <div
            className="clean-term-category-name"
            style={{ color: getCategoryColor(term.category) }}
          >
            {term.category}
          </div>
        )}

        {/* Definition */}
        <div className="clean-term-definition">
          {showFullText ? term.definition : truncateText(term.definition)}
        </div>

        {/* Read More Link */}
        {term.definition && term.definition.length > 120 && (
          <button className="clean-term-read-more" onClick={handleReadMore}>
            {showFullText ? "Show less" : "Read more"}
          </button>
        )}

        {/* Multiple Definitions Indicator */}
        {term.allDefinitions && term.allDefinitions.length > 1 && (
          <div className="clean-term-definitions-count">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            {term.allDefinitions.length} definitions available
          </div>
        )}

        {/* Save Date */}
        <div className="clean-term-save-date">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Saved {formatDate(term.savedAt)}
        </div>
      </div>
    </div>
  );
};

export default TermCard;
