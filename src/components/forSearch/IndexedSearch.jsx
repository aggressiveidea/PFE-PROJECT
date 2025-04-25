"use client"

import { useState, useEffect } from "react"
import "./IndexedSearch.css"

const IndexedSearch = ({ language = "english" }) => {
  const [activeLetter, setActiveLetter] = useState("A")
  const [hoveredCard, setHoveredCard] = useState(null)
  const [viewMode, setViewMode] = useState("cards")

  // Define alphabets for different languages
  const alphabets = {
    english: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    french: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    arabic: "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split(""),
  }

  // Get the appropriate alphabet based on selected language
  const letters = alphabets[language] || alphabets.english

  // Sample terms data with language support
  const termsData = {
    english: [
      {
        name: "Algorithm",
        category: "Computer Science",
        definition: "A step-by-step procedure for solving a problem or accomplishing a task.",
        reference: "Introduction to Algorithms, CLRS",
      },
      {
        name: "API",
        category: "Networks",
        definition: "Application Programming Interface - A set of rules that allow programs to talk to each other.",
        reference: "Web APIs: The Definitive Guide",
      },
      {
        name: "Authentication",
        category: "Cybersecurity",
        definition: "The process of verifying the identity of a user or process.",
        reference: "Security Engineering, Ross Anderson",
      },
    ],
    french: [
      {
        name: "Algorithme",
        category: "Informatique",
        definition: "Une procédure étape par étape pour résoudre un problème ou accomplir une tâche.",
        reference: "Introduction aux Algorithmes, CLRS",
      },
      {
        name: "API",
        category: "Réseaux",
        definition:
          "Interface de Programmation d'Application - Un ensemble de règles permettant aux programmes de communiquer entre eux.",
        reference: "Guide Définitif des API Web",
      },
      {
        name: "Authentification",
        category: "Cybersécurité",
        definition: "Le processus de vérification de l'identité d'un utilisateur ou d'un processus.",
        reference: "Ingénierie de la Sécurité, Ross Anderson",
      },
    ],
    arabic: [
      {
        name: "خوارزمية",
        category: "علوم الحاسوب",
        definition: "إجراء خطوة بخطوة لحل مشكلة أو إنجاز مهمة.",
        reference: "مقدمة في الخوارزميات، CLRS",
      },
      {
        name: "واجهة برمجة التطبيقات",
        category: "الشبكات",
        definition: "مجموعة من القواعد التي تسمح للبرامج بالتحدث مع بعضها البعض.",
        reference: "الدليل النهائي لواجهات برمجة تطبيقات الويب",
      },
      {
        name: "المصادقة",
        category: "الأمن السيبراني",
        definition: "عملية التحقق من هوية المستخدم أو العملية.",
        reference: "هندسة الأمن، روس أندرسون",
      },
    ],
  }

  // Get terms for the current language
  const terms = termsData[language] || termsData.english

  // Filter terms by active letter
  const filteredTerms = terms.filter((term) => {
    const firstLetter = term.name.charAt(0).toUpperCase()
    return firstLetter === activeLetter
  })

  // Count terms for each letter
  const getTermCountForLetter = (letter) => {
    return terms.filter((term) => term.name.charAt(0).toUpperCase() === letter).length
  }

  // Set default active letter on language change
  useEffect(() => {
    if (terms.length > 0) {
      const firstTermLetter = terms[0].name.charAt(0).toUpperCase()
      setActiveLetter(firstTermLetter)
    } else {
      setActiveLetter(letters[0])
    }
  }, [language])

  const getCategoryColor = (category) => {
    const colors = {
      "Données personnelles": "#E5DEFF",
      "Commerce électronique": "#FDE1D3",
      Réseaux: "#D3E4FD",
      "Criminalité informatique": "#FFDEE2",
      Divers: "#F1F0FB",
      "Contrat Informatique": "#F2FCE2",
      "Propriété intellectuelle": "#FEF7CD",
      Organisations: "#FEC6A1",
      "Computer Science": "#E5DEFF",
      Networks: "#D3E4FD",
      Cybersecurity: "#FFE5E5",
      Informatique: "#E5DEFF",
      Cybersécurité: "#FFE5E5",
      "علوم الحاسوب": "#E5DEFF",
      الشبكات: "#D3E4FD",
      "الأمن السيبراني": "#FFE5E5",
    }
    return colors[category] || "#F1F0FB"
  }

  const handleLetterClick = (letter) => {
    setActiveLetter(letter)
  }

  const toggleViewMode = (mode) => {
    setViewMode(mode)
  }

  // Set text direction based on language
  const getTextDirection = () => {
    return language === "arabic" ? "rtl" : "ltr"
  }

  return (
    <div className="indexed-search" style={{ direction: getTextDirection() }}>
      <div className="letter-navigation">
        {letters.map((letter) => (
          <div
            key={letter}
            className={`letter-item ${letter === activeLetter ? "active" : ""}`}
            onClick={() => handleLetterClick(letter)}
          >
            <span className="letter">{letter}</span>
            <span className="term-count">{getTermCountForLetter(letter)}</span>
          </div>
        ))}
      </div>
      <div className="terms-list">
        <div className="terms-header">
          <h3>
            {language === "english" && `Terms starting with '${activeLetter}'`}
            {language === "french" && `Termes commençant par '${activeLetter}'`}
            {language === "arabic" && `المصطلحات التي تبدأ بـ '${activeLetter}'`}
          </h3>
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => toggleViewMode("cards")}
            >
              {language === "arabic" ? "بطاقات" : "Cards"}
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => toggleViewMode("list")}
            >
              {language === "arabic" ? "قائمة" : "List"}
            </button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <div className="terms-grid">
            {filteredTerms.map((term, index) => (
              <div
                key={index}
                className={`term-card ${hoveredCard === index ? "hovered" : ""}`}
                style={{ backgroundColor: getCategoryColor(term.category) }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-header">
                  <h3>{term.name}</h3>
                  <span className="category-badge">{term.category}</span>
                </div>
                <div className="card-body">
                  <p className="definition">{term.definition}</p>
                  <p className="reference">
                    {language === "arabic" ? "المصدر: " : "Source: "}
                    {term.reference}
                  </p>
                </div>
                <div className="card-footer">
                  <button className="add-library-btn">
                    <span>
                      {language === "english" && "Add to Library"}
                      {language === "french" && "Ajouter à la Bibliothèque"}
                      {language === "arabic" && "إضافة إلى المكتبة"}
                    </span>
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="terms-list-view">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((term, index) => (
                <div
                  key={index}
                  className="list-item"
                  style={{ borderLeft: `3px solid ${getCategoryColor(term.category)}` }}
                >
                  <div className="list-item-header">
                    <h4>{term.name}</h4>
                    <span className="category-badge small">{term.category}</span>
                  </div>
                  <p className="list-item-definition">{term.definition}</p>
                </div>
              ))
            ) : (
              <div className="no-terms-message">
                {language === "english" && "No terms found starting with this letter."}
                {language === "french" && "Aucun terme trouvé commençant par cette lettre."}
                {language === "arabic" && "لم يتم العثور على مصطلحات تبدأ بهذا الحرف."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default IndexedSearch
