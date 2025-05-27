import { useState, useEffect } from "react"
import { getSavedItems, removeSavedItem } from "../services/libraryService"
import "./library.css"

const SavedLibrary = ({ currentLanguage = "en" }) => {
  const [activeTab, setActiveTab] = useState("books")
  const [savedBooks, setSavedBooks] = useState([])
  const [savedArticles, setSavedArticles] = useState([])
  const [savedTerms, setSavedTerms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(true)

    const books = getSavedItems("book")
    const articles = getSavedItems("article")
    const terms = getSavedItems("term")

    setSavedBooks(books)
    setSavedArticles(articles)
    setSavedTerms(terms)

    setIsLoading(false)
  }, [])

  const handleRemoveItem = (itemId, type) => {
    const removed = removeSavedItem(itemId, type)

    if (removed) {
      if (type === "book") {
        setSavedBooks((prev) => prev.filter((item) => item.id !== itemId))
      } else if (type === "article") {
        setSavedArticles((prev) => prev.filter((item) => item.id !== itemId))
      } else if (type === "term") {
        setSavedTerms((prev) => prev.filter((item) => item.id !== itemId))
      }
    }
  }

  const getText = (key) => {
    const translations = {
      en: {
        savedLibrary: "Saved Library",
        books: "Books",
        articles: "Articles",
        terms: "Terms",
        noItems: "No saved items found",
        tryAdding: "Try adding some items to your library",
        savedOn: "Saved on",
        remove: "Remove",
        view: "View",
        pages: "pages",
      },
      fr: {
        savedLibrary: "Bibliothèque Sauvegardée",
        books: "Livres",
        articles: "Articles",
        terms: "Termes",
        noItems: "Aucun élément sauvegardé trouvé",
        tryAdding: "Essayez d'ajouter des éléments à votre bibliothèque",
        savedOn: "Sauvegardé le",
        remove: "Supprimer",
        view: "Voir",
        pages: "pages",
      },
      ar: {
        savedLibrary: "المكتبة المحفوظة",
        books: "الكتب",
        articles: "المقالات",
        terms: "المصطلحات",
        noItems: "لم يتم العثور على عناصر محفوظة",
        tryAdding: "حاول إضافة بعض العناصر إلى مكتبتك",
        savedOn: "تم الحفظ في",
        remove: "إزالة",
        view: "عرض",
        pages: "صفحات",
      },
    }

    return translations[currentLanguage]?.[key] || translations.en[key]
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(
        currentLanguage === "ar" ? "ar-SA" : currentLanguage === "fr" ? "fr-FR" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
      )
    } catch (error) {
      return dateString
    }
  }

  const renderSavedBooks = () => {
    if (savedBooks.length === 0) {
      return (
        <div className="library-empty-state">
          <div className="library-empty-icon"></div>
          <h3>{getText("noItems")}</h3>
          <p>{getText("tryAdding")}</p>
        </div>
      )
    }

    return (
      <div className="library-books-list">
        {savedBooks.map((book) => (
          <div key={book.id} className="library-book-item library-animate">
            <div className="library-book-cover-wrapper">
              <img
                src={book.coverImage || `https://via.placeholder.com/230x320?text=${encodeURIComponent(book.title)}`}
                alt={`${book.title} cover`}
                className="library-book-cover"
              />
              <div className="library-book-favorite">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </div>

            <div className="library-book-content">
              <div
                className="library-book-category"
                style={{
                  backgroundColor: `rgba(138, 43, 226, 0.2)`,
                  color: "#8a2be2",
                }}
              >
                {book.category || book.tags || "Book"}
              </div>

              <h3 className="library-book-title">{book.title}</h3>
              <p className="library-book-author">
                {getText("by")} {book.author}
              </p>
              <p className="library-book-description">
                {book.description?.[currentLanguage] || book.description?.en || book.description || ""}
              </p>

              <div className="library-book-meta">
                {book.pages && (
                  <span className="library-book-pages">
                    {book.pages} {getText("pages")}
                  </span>
                )}
                <span className="library-book-date">
                  {getText("savedOn")} {formatDate(book.savedAt)}
                </span>
              </div>

              <div className="library-book-languages">
                {(book.languages || ["en"]).map((lang) => (
                  <span
                    key={lang}
                    className={`library-book-language ${lang === currentLanguage ? "library-current" : ""}`}
                  >
                    {lang.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="library-saved-actions">
                <button className="library-saved-remove-button" onClick={() => handleRemoveItem(book.id, "book")}>
                  {getText("remove")}
                </button>

                <a
                  href={book.pdfLink || `#book-${book.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="library-book-read-button"
                >
                  {getText("view")}
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
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderSavedArticles = () => {
    if (savedArticles.length === 0) {
      return (
        <div className="library-empty-state">
          <div className="library-empty-icon"></div>
          <h3>{getText("noItems")}</h3>
          <p>{getText("tryAdding")}</p>
        </div>
      )
    }

    return (
      <div className="library-grid">
        {savedArticles.map((article, index) => (
          <div key={article.id} className="library-article-card library-animate">
            <div className="library-article-header">
              <div className="library-article-category" style={{ backgroundColor: `rgba(138, 43, 226, 0.2)` }}>
                {article.category}
              </div>
              <button
                className="library-article-favorite library-active"
                onClick={() => handleRemoveItem(article.id, "article")}
                aria-label="Remove from favorites"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <h3 className="library-article-title">{article.title}</h3>
            <p className="library-article-author">
              {getText("by")} {article.author}
            </p>
            <p className="library-article-abstract">
              {article.abstract?.[currentLanguage] || article.abstract?.en || ""}
            </p>

            <div className="library-article-languages">
              {(article.languages || ["en"]).map((lang) => (
                <span
                  key={lang}
                  className={`library-article-language ${lang === currentLanguage ? "library-current" : ""}`}
                >
                  {lang.toUpperCase()}
                </span>
              ))}
            </div>

            <div className="library-article-footer">
              <span className="library-article-date">
                {getText("savedOn")} {formatDate(article.savedAt)}
              </span>

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
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderSavedTerms = () => {
    if (savedTerms.length === 0) {
      return (
        <div className="library-empty-state">
          <div className="library-empty-icon"></div>
          <h3>{getText("noItems")}</h3>
          <p>{getText("tryAdding")}</p>
        </div>
      )
    }

    return (
      <div className="library-grid">
        {savedTerms.map((term, index) => (
          <div key={term.id} className="library-term-card library-animate">
            <div className="library-term-header">
              <div className="library-term-category" style={{ backgroundColor: `rgba(138, 43, 226, 0.2)` }}>
                {term.category}
              </div>
              <button
                className="library-term-favorite library-active"
                onClick={() => handleRemoveItem(term.id, "term")}
                aria-label="Remove from favorites"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <h3 className="library-term-title">{term.title}</h3>
            <p className="library-term-definition">{term.definition?.[currentLanguage] || term.definition?.en || ""}</p>

            <div className="library-term-languages">
              {(term.languages || ["en"]).map((lang) => (
                <span
                  key={lang}
                  className={`library-term-language ${lang === currentLanguage ? "library-current" : ""}`}
                >
                  {lang.toUpperCase()}
                </span>
              ))}
            </div>

            <div className="library-term-footer">
              <span className="library-term-date">
                {getText("savedOn")} {formatDate(term.savedAt)}
              </span>

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
        ))}
      </div>
    )
  }

  return (
    <div className="library-container">
      <div className="library-header">
        <h1 className="library-title">{getText("savedLibrary")}</h1>
      </div>

      <div className="library-tabs">
        <button
          className={`library-tab-button ${activeTab === "books" ? "library-active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          <span className="library-books-icon"></span>
          {getText("books")}
        </button>
        <button
          className={`library-tab-button ${activeTab === "articles" ? "library-active" : ""}`}
          onClick={() => setActiveTab("articles")}
        >
          <span className="library-articles-icon"></span>
          {getText("articles")}
        </button>
        <button
          className={`library-tab-button ${activeTab === "terms" ? "library-active" : ""}`}
          onClick={() => setActiveTab("terms")}
        >
          <span className="library-terms-icon"></span>
          {getText("terms")}
        </button>
      </div>

      <div className="library-content">
        {isLoading ? (
          <div className="library-loading-container">
            <div className="library-loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === "books" && renderSavedBooks()}
            {activeTab === "articles" && renderSavedArticles()}
            {activeTab === "terms" && renderSavedTerms()}
          </>
        )}
      </div>
    </div>
  )
}

export default SavedLibrary
