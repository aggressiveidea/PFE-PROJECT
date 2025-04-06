"use client"

import { useState } from "react"
import { translations } from "../../utils/translations"
import "./KnowledgeGraph.css"

const KnowledgeGraph = ({ language = "en" }) => {
  const t = translations[language] || translations.en
  const isRtl = language === "ar"
  const [selectedTerm, setSelectedTerm] = useState(null)

  // Sample data for the knowledge graph
  const terms = [
    {
      id: 1,
      name: "Cloud Computing",
      nameFr: "Informatique en nuage",
      nameAr: "الحوسبة السحابية",
      x: 50,
      y: 50,
      color: "#9333ea",
    },
    {
      id: 2,
      name: "SaaS",
      nameFr: "SaaS",
      nameAr: "البرمجيات كخدمة",
      x: 30,
      y: 30,
      color: "#ec4899",
      related: [1],
    },
    {
      id: 3,
      name: "PaaS",
      nameFr: "PaaS",
      nameAr: "المنصة كخدمة",
      x: 70,
      y: 30,
      color: "#ec4899",
      related: [1],
    },
    {
      id: 4,
      name: "IaaS",
      nameFr: "IaaS",
      nameAr: "البنية التحتية كخدمة",
      x: 30,
      y: 70,
      color: "#ec4899",
      related: [1],
    },
    {
      id: 5,
      name: "Virtualization",
      nameFr: "Virtualisation",
      nameAr: "المحاكاة الافتراضية",
      x: 70,
      y: 70,
      color: "#8b5cf6",
      related: [1],
    },
    {
      id: 6,
      name: "Cybersecurity",
      nameFr: "Cybersécurité",
      nameAr: "الأمن السيبراني",
      x: 20,
      y: 50,
      color: "#f43f5e",
      related: [7],
    },
    {
      id: 7,
      name: "Encryption",
      nameFr: "Chiffrement",
      nameAr: "التشفير",
      x: 10,
      y: 30,
      color: "#f43f5e",
      related: [6],
    },
  ]

  const handleTermClick = (term) => {
    setSelectedTerm(term)
  }

  const closePanel = () => {
    setSelectedTerm(null)
  }

  const getTermName = (term) => {
    if (language === "fr") return term.nameFr
    if (language === "ar") return term.nameAr
    return term.name
  }

  return (
    <section id="knowledge-graph" className={`knowledge-graph ${isRtl ? "rtl" : ""}`}>
      <div className="container">
        <div className="section-header">
          <div className="badge">{t.interactive || "Interactive"}</div>
          <h2>{t.knowledgeGraphTitle || "Explore the Knowledge Graph"}</h2>
          <p>
            {t.knowledgeGraphDescription ||
              "Discover relationships between ICT terms with our interactive visualization. Click on nodes to see details and connections."}
          </p>
        </div>

        <div className="graph-container">
          <div className="graph-visualization">
            {terms.map((term) => (
              <div
                key={term.id}
                className={`term-node ${selectedTerm?.id === term.id ? "selected" : ""}`}
                style={{
                  left: `${term.x}%`,
                  top: `${term.y}%`,
                  backgroundColor: term.color,
                }}
                onClick={() => handleTermClick(term)}
              >
                {term.id === 2 && <span className="term-label">SaaS</span>}

                {term.related &&
                  term.related.map((relatedId) => {
                    const relatedTerm = terms.find((t) => t.id === relatedId)
                    if (relatedTerm) {
                      // Calculate line position and angle
                      const dx = relatedTerm.x - term.x
                      const dy = relatedTerm.y - term.y
                      const distance = Math.sqrt(dx * dx + dy * dy)
                      const angle = (Math.atan2(dy, dx) * 180) / Math.PI

                      return (
                        <div
                          key={`line-${term.id}-${relatedId}`}
                          className="graph-line"
                          style={{
                            width: `${distance}%`,
                            transform: `rotate(${angle}deg)`,
                            backgroundColor: term.color,
                          }}
                        ></div>
                      )
                    }
                    return null
                  })}
              </div>
            ))}
          </div>

          {selectedTerm && (
            <div className="term-panel">
              <div className="panel-header">
                <h3>{t.selectedTerm || "Selected Term"}</h3>
                <button className="close-button" onClick={closePanel}>
                  ×
                </button>
              </div>

              <div className="panel-content">
                <h4>{getTermName(selectedTerm)}</h4>

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

                <p className="definition">
                  {selectedTerm.id === 2
                    ? t.saasDefinition ||
                      "Software as a service is a software licensing and delivery model in which software is licensed on a subscription basis and is centrally hosted."
                    : t[`${selectedTerm.id}Definition`] || "Definition will be displayed here."}
                </p>

                <div className="related-terms">
                  <h5>{t.relatedTerms || "Related Terms"}</h5>
                  <div className="terms-list">
                    {selectedTerm.related &&
                      selectedTerm.related.map((relatedId) => {
                        const relatedTerm = terms.find((t) => t.id === relatedId)
                        return relatedTerm ? (
                          <span key={relatedId} className="term-tag" onClick={() => handleTermClick(relatedTerm)}>
                            {getTermName(relatedTerm)}
                          </span>
                        ) : null
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default KnowledgeGraph

