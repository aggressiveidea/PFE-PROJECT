"use client"

import { useEffect, useRef } from "react"
import "./KnowledgeGraph.css"
import { translations } from "../../utils/translations"
import { initInteractiveGraph } from "../../utils/interactiveGraph"

const KnowledgeGraph = ({ language }) => {
  const graphContainerRef = useRef(null)
  const t = translations[language]
  const isRtl = language === "ar"

  useEffect(() => {
    if (graphContainerRef.current) {
      // Initialize the interactive graph
      const cleanup = initInteractiveGraph(graphContainerRef.current, language)

      // Cleanup on component unmount
      return cleanup
    }
  }, [language])

  return (
    <section id="explore" className={`knowledge-graph section ${isRtl ? "rtl" : ""}`}>
      <div className="container">
        <div className="section-header">
          <div className="badge">{t.interactive}</div>
          <h2 className="section-title">{t.knowledgeGraphTitle}</h2>
          <p className="section-description">{t.knowledgeGraphDescription}</p>
        </div>

        <div className="interactive-graph-container">
          <div className="interactive-graph" ref={graphContainerRef}></div>
          <div className="graph-info-panel">
            <div className="info-panel-header">
              <h3>{t.selectedTerm}</h3>
              <button className="close-btn">×</button>
            </div>
            <div className="info-panel-content">
              <h4 className="term-title">Cloud Computing</h4>

              <div className="term-translations">
                <div className="translation-item">
                  <span className="language-label">EN:</span>
                  <span className="translation-text">Cloud Computing</span>
                </div>
                <div className="translation-item">
                  <span className="language-label">FR:</span>
                  <span className="translation-text">Informatique en nuage</span>
                </div>
                <div className="translation-item">
                  <span className="language-label">AR:</span>
                  <span className="translation-text">الحوسبة السحابية</span>
                </div>
              </div>

              <div className="term-definition">
                <p>
                  Cloud computing is the on-demand availability of computer system resources, especially data storage
                  and computing power, without direct active management by the user.
                </p>
              </div>

              <div className="related-terms">
                <h5>{t.relatedTerms}</h5>
                <div className="related-terms-list">
                  <span className="related-term">SaaS</span>
                  <span className="related-term">PaaS</span>
                  <span className="related-term">IaaS</span>
                  <span className="related-term">Virtualization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default KnowledgeGraph

