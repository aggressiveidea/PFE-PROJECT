"use client"

import { useState } from "react"
import "./library.css"

const LibraryCard = ({ item, index, animateItems, currentLanguage, type }) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite)
  const [isExpanded, setIsExpanded] = useState(false)

  // Get category metadata
  const getCategoryMetadata = (category) => {
    const metadata = {
      "e-commerce": {
        label: { en: "E-Commerce", fr: "Commerce électronique", ar: "التجارة الإلكترونية" },
        color: "#29ABE2",
      },
      "it-compliance": {
        label: { en: "IT Compliance", fr: "Conformité IT", ar: "الامتثال لتكنولوجيا المعلومات" },
        color: "#8E44AD",
      },
      security: {
        label: { en: "Security", fr: "Sécurité", ar: "الأمن" },
        color: "#E74C3C",
      },
      legal: {
        label: { en: "Legal", fr: "Légal", ar: "قانوني" },
        color: "#16A085",
      },
      marketing: {
        label: { en: "Marketing", fr: "Marketing", ar: "التسويق" },
        color: "#F39C12",
      },
      programming: {
        label: { en: "Programming", fr: "Programmation", ar: "البرمجة" },
        color: "#3498DB",
      },
    }

    return (
      metadata[category] || {
        label: { en: category, fr: category, ar: category },
        color: "#95A5A6",
      }
    )
  }

  // Toggle favorite status
  const toggleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  // Toggle expanded view
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Get category label based on current language
  const getCategoryLabel = (category) => {
    const metadata = getCategoryMetadata(category)
    return metadata.label[currentLanguage] || metadata.label.en
  }

  // Get date label based on item type
  const getDateLabel = () => {
    const translations = {
      en: { addedOn: "Added on", publishedOn: "Published on" },
      fr: { addedOn: "Ajouté le", publishedOn: "Publié le" },
      ar: { addedOn: "أضيف في", publishedOn: "نشر في" },
    }

    const text = translations[currentLanguage] || translations.en

    if (type === "term") {
      return `${text.addedOn} ${item.dateAdded}`
    } else {
      return `${text.publishedOn} ${item.datePublished}`
    }
  }

  // Get UI text based on current language
  const getText = (key) => {
    const translations = {
      en: { view: "View", share: "Share", by: "By", languages: "Languages" },
      fr: { view: "Voir", share: "Partager", by: "Par", languages: "Langues" },
      ar: { view: "عرض", share: "شارك", by: "بواسطة", languages: "اللغات" },
    }

    return translations[currentLanguage]?.[key] || translations.en[key]
  }

  // Get available languages
  const getLanguageLabel = (code) => {
    const languages = {
      en: "English",
      fr: "Français",
      ar: "العربية",
    }

    return languages[code] || code
  }

  if (type === "term") {
    return (
      <div
        className={`library-term-card ${animateItems ? "library-animate" : ""}`}
        style={{ animationDelay: `${index * 0.05}s` }}
        onClick={toggleExpand}
      >
        <div className="library-term-header">
          <div
            className="library-term-category"
            style={{ backgroundColor: `${getCategoryMetadata(item.category).color}20` }}
          >
            {getCategoryLabel(item.category)}
          </div>
          <button
            className={`library-term-favorite ${isFavorite ? "library-active" : ""}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <h3 className="library-term-title">{item.title}</h3>

        <p className="library-term-definition">{item.definition?.[currentLanguage] || item.definition?.en || ""}</p>

        <div className="library-term-languages">
          {item.languages.map((lang) => (
            <span key={lang} className={`library-term-language ${lang === currentLanguage ? "library-current" : ""}`}>
              {getLanguageLabel(lang)}
            </span>
          ))}
        </div>

        <div className="library-term-footer">
          <span className="library-term-date">{getDateLabel()}</span>

          <div className="library-term-actions">
            <button className="library-term-action library-view-action">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{getText("view")}</span>
            </button>
          </div>
        </div>
      </div>
    )
  } else if (type === "article") {
    return (
      <div
        className={`library-article-card ${animateItems ? "library-animate" : ""}`}
        style={{ animationDelay: `${index * 0.05}s` }}
        onClick={toggleExpand}
      >
        <div className="library-article-header">
          <div
            className="library-article-category"
            style={{ backgroundColor: `${getCategoryMetadata(item.category).color}20` }}
          >
            {getCategoryLabel(item.category)}
          </div>
          <button
            className={`library-article-favorite ${isFavorite ? "library-active" : ""}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <h3 className="library-article-title">{item.title}</h3>

        <p className="library-article-author">
          {getText("by")} {item.author}
        </p>

        <p className="library-article-abstract">{item.abstract?.[currentLanguage] || item.abstract?.en || ""}</p>

        <div className="library-article-languages">
          {item.languages.map((lang) => (
            <span
              key={lang}
              className={`library-article-language ${lang === currentLanguage ? "library-current" : ""}`}
            >
              {getLanguageLabel(lang)}
            </span>
          ))}
        </div>

        <div className="library-article-footer">
          <span className="library-article-date">{getDateLabel()}</span>

          <div className="library-article-actions">
            <button className="library-article-action library-view-action">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{getText("view")}</span>
            </button>
            <button className="library-article-action library-share-action">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span>{getText("share")}</span>
            </button>
          </div>
        </div>
      </div>
    )
  } else {
    // Book type is handled in BooksList.jsx
    return null
  }
}

export default LibraryCard

