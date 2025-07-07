"use client";

import { useEffect } from "react";

const TermModal = ({ term, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !term) return null;

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
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="clean-modal-backdrop" onClick={onClose}>
      <div className="clean-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="clean-modal-header-section">
          <h2 className="clean-modal-main-title">{term.name}</h2>
          <button className="clean-modal-close-btn" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="clean-modal-content-area">
          {/* Primary Category */}
          {term.category && (
            <div className="clean-modal-category-section">
              <h3
                className="clean-modal-category-header"
                style={{ color: getCategoryColor(term.category) }}
              >
                {term.category}
              </h3>
            </div>
          )}

          {/* Primary Definition */}
          <div className="clean-modal-definition-section">
            <div className="clean-modal-section-title">
              <div
                className="clean-modal-title-indicator"
                style={{ backgroundColor: getCategoryColor(term.category) }}
              ></div>
              <h4>Definition</h4>
            </div>
            <p className="clean-modal-definition-content">{term.definition}</p>

            {/* References */}
            {term.reference && (
              <div className="clean-modal-references-box">
                <h5>References</h5>
                <p>{term.reference}</p>
              </div>
            )}
          </div>

          {/* Additional Definitions */}
          {term.allDefinitions && term.allDefinitions.length > 1 && (
            <>
              {term.allDefinitions.slice(1).map((def, index) => (
                <div key={index} className="clean-modal-definition-section">
                  <div className="clean-modal-category-section">
                    <h3
                      className="clean-modal-category-header"
                      style={{
                        color: getCategoryColor(
                          def.categories?.[0] || term.category
                        ),
                      }}
                    >
                      {def.categories?.[0] || "Additional Definition"}
                    </h3>
                  </div>

                  <div className="clean-modal-section-title">
                    <div
                      className="clean-modal-title-indicator"
                      style={{
                        backgroundColor: getCategoryColor(
                          def.categories?.[0] || term.category
                        ),
                      }}
                    ></div>
                    <h4>Definition</h4>
                  </div>
                  <p className="clean-modal-definition-content">{def.text}</p>

                  {def.references && (
                    <div className="clean-modal-references-box">
                      <h5>References</h5>
                      <p>{def.references}</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Related Terms */}
          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div className="clean-modal-definition-section">
              <div className="clean-modal-section-title">
                <div
                  className="clean-modal-title-indicator"
                  style={{ backgroundColor: getCategoryColor(term.category) }}
                ></div>
                <h4>Related Terms</h4>
              </div>
              <div className="clean-modal-related-list">
                {term.relatedTerms.map((relatedTerm, index) => (
                  <span key={index} className="clean-modal-related-item">
                    {relatedTerm}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="clean-modal-bottom-section">
          <div className="clean-modal-date-info">
            {term.savedAt && <span>Saved {formatDate(term.savedAt)}</span>}
          </div>
          <button
            className="clean-modal-library-btn"
            style={{ backgroundColor: getCategoryColor(term.category) }}
          >
            Saved to Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermModal;
