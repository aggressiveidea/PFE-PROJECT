import { Globe, Search, Network, RefreshCw } from "lucide-react"
import { translations } from "../../utils/translations"
import "./Features.css"

const Features = ({ language = "en" }) => {
  const t = translations[language] || translations.en
  const isRtl = language === "ar"

  return (
    <section id="features" className={`features ${isRtl ? "rtl" : ""}`}>
      <div className="container">
        <div className="section-header">
          <div className="badge">{t.newFeatures || "New Features"}</div>
          <h2>{t.featuresTitle || "Why Use This Dictionary?"}</h2>
          <p>
            {t.featuresDescription ||
              "Our platform offers unique features to help you explore and understand ICT terminology across multiple languages."}
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Globe />
            </div>
            <h3>{t.multilingualSupport || "Multilingual Support"}</h3>
            <p>
              {t.multilingualSupportDesc ||
                "Access ICT terms in English, French, and Arabic with accurate translations and definitions."}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Search />
            </div>
            <h3>{t.aiPoweredSearch || "AI-Powered Search"}</h3>
            <p>
              {t.aiPoweredSearchDesc ||
                "Find exactly what you're looking for with our semantic search powered by artificial intelligence."}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Network />
            </div>
            <h3>{t.interactiveGraph || "Interactive Knowledge Graph"}</h3>
            <p>
              {t.interactiveGraphDesc ||
                "Visualize relationships between ICT terms and explore connections in an interactive graph."}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <RefreshCw />
            </div>
            <h3>{t.regularlyUpdated || "Regularly Updated"}</h3>
            <p>
              {t.regularlyUpdatedDesc ||
                "Our database is continuously updated with the latest ICT terminology and definitions."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features





