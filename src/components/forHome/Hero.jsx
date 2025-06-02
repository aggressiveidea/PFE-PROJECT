import { useEffect, useRef } from "react"
import "./Hero.css"
import { translations } from "../../utils/translations"
import { initKnowledgeGraphAnimation } from "../../utils/graphAnimation"
import { Search } from 'lucide-react'

const Hero = ({ language }) => {
  const graphRef = useRef(null)
  const t = translations[language]
  const isRtl = language === "ar"

  useEffect(() => {
    if (graphRef.current) {
      const cleanup = initKnowledgeGraphAnimation(graphRef.current)
      return cleanup
    }
  }, [])

  return (
    <section id="home" className={`tired-hero ${isRtl ? "rtl" : ""}`}>
      <div className="tired-hero-container">
        <div className="tired-hero-content">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>

          <div className="tired-hero-search">
            <input type="text" placeholder={t.searchIctTerms} className="tired-hero-search-input" />
            <button className="tired-hero-search-btn">
              <Search size={20} />
            </button>
          </div>

          <div className="tired-hero-stats">
            <div className="tired-stat-item">
              <span className="tired-stat-number">3</span>
              <span className="tired-stat-label">{t.languages}</span>
            </div>
            <div className="tired-stat-item">
              <span className="tired-stat-number">800+</span>
              <span className="tired-stat-label">{t.ictTerms}</span>
            </div>
            <div className="tired-stat-item">
              <span className="tired-stat-number">8</span>
              <span className="tired-stat-label">{t.categoriesCount}</span>
            </div>
          </div>
        </div>

        <div className="tired-hero-graph-container">
          <div className="tired-hero-graph" ref={graphRef}></div>
        </div>
      </div>
    </section>
  )
}

export default Hero