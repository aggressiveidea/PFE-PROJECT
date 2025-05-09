"use client"

import { motion } from "framer-motion"

const GraphPanel = ({
  selectedTerm,
  closePanel,
  getTermName,
  getCategoryColor,
  getRelatedTerms,
  handleTermClick,
  categories,
  t,
  isRtl,
}) => {
  return (
    <motion.div
      className="term-panel"
      initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="panel-header" style={{ background: getCategoryColor(selectedTerm.category) }}>
        <h3>{t.selectedTerm || "Selected Term"}</h3>
        <button className="close-button" onClick={closePanel}>
          ×
        </button>
      </div>

      <div className="panel-content">
        <div className="term-title">
          <span className="term-icon-large">{selectedTerm.icon}</span>
          <h4>{getTermName(selectedTerm)}</h4>
        </div>

        <div className="translations">
          <div className="translation">
            <span className="language">EN:</span>
            <span>{selectedTerm.name}</span>
          </div>
          <div className="translation">
            <span className="language">FR:</span>
            <span>{selectedTerm.nameFr}</span>
          </div>
          <div className="translation">
            <span className="language">AR:</span>
            <span>{selectedTerm.nameAr}</span>
          </div>
        </div>

        <div className="term-category">
          <span
            className="category-indicator"
            style={{ backgroundColor: getCategoryColor(selectedTerm.category) }}
          ></span>
          <span>{categories.find((cat) => cat.id === selectedTerm.category)?.name || selectedTerm.category}</span>
        </div>

        <p className="definition">
          {selectedTerm.definition || t[`${selectedTerm.id}Definition`] || "Definition will be displayed here."}
        </p>

        <div className="related-terms">
          <h5>{t.relatedTerms || "Related Terms"}</h5>
          <div className="terms-list">
            {getRelatedTerms(selectedTerm.id).map((relatedTerm) => (
              <motion.span
                key={relatedTerm.id}
                className="term-tag"
                style={{
                  backgroundColor: `${getCategoryColor(relatedTerm.category)}20`,
                  color: getCategoryColor(relatedTerm.category),
                }}
                onClick={() => handleTermClick(relatedTerm)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="term-tag-icon">{relatedTerm.icon}</span>
                {getTermName(relatedTerm)}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GraphPanel
