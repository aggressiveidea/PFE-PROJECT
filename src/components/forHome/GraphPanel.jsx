"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"

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
  const relatedTerms = getRelatedTerms(selectedTerm.id)
  const category = categories.find((cat) => cat.id === selectedTerm.category)

  return (
    <motion.div
      className="home-page-term-panel"
      initial={{ opacity: 0, x: isRtl ? -400 : 400, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: isRtl ? -400 : 400, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      }}
    >
      <div className="home-page-panel-header" style={{ backgroundColor: getCategoryColor(selectedTerm.category) }}>
        <h3>{t.selectedTerm || "Selected Term"}</h3>
        <motion.button
          className="home-page-close-button"
          onClick={closePanel}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <X size={18} />
        </motion.button>
      </div>

      <motion.div
        className="home-page-panel-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="home-page-term-title">
          <div
            className="home-page-term-icon-large"
            style={{
              backgroundColor: `${getCategoryColor(selectedTerm.category)}15`,
              color: getCategoryColor(selectedTerm.category),
              border: `2px solid ${getCategoryColor(selectedTerm.category)}30`,
            }}
          >
            {selectedTerm.icon}
          </div>
          <h4>{getTermName(selectedTerm)}</h4>
        </div>

        <motion.div
          className="home-page-translations"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="home-page-translation">
            <span className="home-page-language">EN:</span>
            <span>{selectedTerm.name}</span>
          </div>
          <div className="home-page-translation">
            <span className="home-page-language">FR:</span>
            <span>{selectedTerm.nameFr}</span>
          </div>
          <div className="home-page-translation">
            <span className="home-page-language">AR:</span>
            <span>{selectedTerm.nameAr}</span>
          </div>
        </motion.div>

        <motion.div
          className="home-page-term-category"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <span
            className="home-page-category-indicator"
            style={{ backgroundColor: getCategoryColor(selectedTerm.category) }}
          ></span>
          <span>{category?.name}</span>
        </motion.div>

        <motion.div
          className="home-page-definition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {selectedTerm.definition}
        </motion.div>

        {relatedTerms.length > 0 && (
          <motion.div
            className="home-page-related-terms"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h5>{t.relatedTerms || "Related Terms"}</h5>
            <div className="home-page-terms-list">
              {relatedTerms.map((relatedTerm, index) => (
                <motion.div
                  key={relatedTerm.id}
                  className="home-page-term-tag"
                  style={{
                    backgroundColor: `${getCategoryColor(relatedTerm.category)}20`,
                    color: getCategoryColor(relatedTerm.category),
                    border: `1px solid ${getCategoryColor(relatedTerm.category)}40`,
                  }}
                  onClick={() => handleTermClick(relatedTerm)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.7 + index * 0.1,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: `${getCategoryColor(relatedTerm.category)}30`,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="home-page-term-tag-icon">{relatedTerm.icon}</span>
                  <span>{getTermName(relatedTerm)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default GraphPanel
