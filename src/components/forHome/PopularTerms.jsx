"use client"

import { useState } from "react"
import "./PopularTerms.css"
import { translations } from "../../utils/translations"

const PopularTerms = ({ language }) => {
  const t = translations[language]
  const isRtl = language === "ar"
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: t.all },
    { id: "hardware", name: t.hardware },
    { id: "software", name: t.software },
    { id: "networking", name: t.networking },
    { id: "security", name: t.security },
    { id: "ai", name: t.ai },
  ]

  const popularTerms = [
    {
      id: 1,
      term: "Artificial Intelligence",
      termFr: "Intelligence Artificielle",
      termAr: "الذكاء الاصطناعي",
      definition: t.aiDefinition,
      category: "ai",
    },
    {
      id: 2,
      term: "Cloud Computing",
      termFr: "Informatique en nuage",
      termAr: "الحوسبة السحابية",
      definition: t.cloudDefinition,
      category: "networking",
    },
    {
      id: 3,
      term: "Machine Learning",
      termFr: "Apprentissage automatique",
      termAr: "تعلم الآلة",
      definition: t.mlDefinition,
      category: "ai",
    },
    {
      id: 4,
      term: "Blockchain",
      termFr: "Chaîne de blocs",
      termAr: "سلسلة الكتل",
      definition: t.blockchainDefinition,
      category: "security",
    },
    {
      id: 5,
      term: "Internet of Things",
      termFr: "Internet des objets",
      termAr: "إنترنت الأشياء",
      definition: t.iotDefinition,
      category: "networking",
    },
    {
      id: 6,
      term: "Virtual Reality",
      termFr: "Réalité virtuelle",
      termAr: "الواقع الافتراضي",
      definition: t.vrDefinition,
      category: "hardware",
    },
    {
      id: 7,
      term: "Cybersecurity",
      termFr: "Cybersécurité",
      termAr: "الأمن السيبراني",
      definition: t.cybersecurityDefinition,
      category: "security",
    },
    {
      id: 8,
      term: "Big Data",
      termFr: "Mégadonnées",
      termAr: "البيانات الضخمة",
      definition: t.bigDataDefinition,
      category: "software",
    },
  ]

  const filteredTerms =
    activeCategory === "all" ? popularTerms : popularTerms.filter((term) => term.category === activeCategory)

  return (
    <section id="popular-terms" className={`popular-terms section ${isRtl ? "rtl" : ""}`}>
      <div className="container">
        <div className="section-header">
          <div className="badge">{t.trending}</div>
          <h2 className="section-title">{t.popularTermsTitle}</h2>
          <p className="section-description">{t.popularTermsDescription}</p>
        </div>

        <div className="terms-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="terms-grid">
          {filteredTerms.map((term) => (
            <div className="term-card card" key={term.id}>
              <h3 className="term-card-title">
                {language === "en" ? term.term : language === "fr" ? term.termFr : term.termAr}
              </h3>
              <p className="term-card-definition">{term.definition}</p>
              <div className="term-card-footer">
                <span className="term-category">{t[term.category]}</span>
                <button className="btn btn-secondary term-card-btn">{t.viewDetails}</button>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
          <button className="btn btn-primary view-all-btn">{t.exploreAllTerms}</button>
        </div>
      </div>
    </section>
  )
}

export default PopularTerms

