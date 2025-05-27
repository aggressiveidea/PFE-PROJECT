import { useEffect, useRef } from "react"
import "./Hero.css"
import { translations } from "../../utils/translations"
import { initKnowledgeGraphAnimation } from "../../utils/graphAnimation"
import { Search } from "lucide-react"

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
    <section id="home" className={`hero ${isRtl ? "rtl" : ""}`}>
      <div className="hero-container">
        <div className="hero-content">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>

          <div className="hero-search">
            <input type="text" placeholder={t.searchIctTerms} className="hero-search-input" />
            <button className="hero-search-btn">
              <Search size={20} />
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">{t.languages}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">800+</span>
              <span className="stat-label">{t.ictTerms}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">{t.categoriesCount}</span>
            </div>
          </div>
        </div>

        <div className="hero-graph-container">
          <div className="hero-graph" ref={graphRef}></div>
        </div>
      </div>
    </section>
  )
}

export default Hero

