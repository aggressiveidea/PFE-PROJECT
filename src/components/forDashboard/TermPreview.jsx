import { useState } from "react";
import { Calendar, BookOpen, Tag, ChevronDown, ChevronUp } from "lucide-react";
import "./TermPreview.css";

const TermPreview = ({ term }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Date not available";
    }
  };

  return (
    <div className="dashboard-term-preview">
      <div className="dashboard-term-header">
        <div className="dashboard-term-title-container">
          <BookOpen size={20} className="dashboard-term-icon" />
          <h3 className="dashboard-term-title">
            {term?.title || "Untitled Term"}
          </h3>
        </div>

        <div className="dashboard-term-meta">
          {term?.category && (
            <div className="dashboard-term-category">
              <Tag size={14} />
              <span>{term.category}</span>
            </div>
          )}

          <div className="dashboard-term-date">
            <Calendar size={14} />
            <span>{formatDate(term?.createdAt)}</span>
          </div>

          {term?.version && (
            <div className="dashboard-term-version">
              <span>v{term.version}</span>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-term-content">
        <div className={`dashboard-term-body ${expanded ? "expanded" : ""}`}>
          {term?.content ? (
            <div dangerouslySetInnerHTML={{ __html: term.content }} />
          ) : (
            <p className="dashboard-term-empty">
              No content available for this term.
            </p>
          )}
        </div>

        {term?.content && term.content.length > 300 && (
          <button
            className="dashboard-term-expand-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <span>Show Less</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>Show More</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {term?.effectiveDate && (
        <div className="dashboard-term-footer">
          <div className="dashboard-term-effective-date">
            <span className="dashboard-term-label">Effective Date:</span>
            <span className="dashboard-term-value">
              {formatDate(term.effectiveDate)}
            </span>
          </div>

          {term?.expiryDate && (
            <div className="dashboard-term-expiry-date">
              <span className="dashboard-term-label">Expiry Date:</span>
              <span className="dashboard-term-value">
                {formatDate(term.expiryDate)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TermPreview;
