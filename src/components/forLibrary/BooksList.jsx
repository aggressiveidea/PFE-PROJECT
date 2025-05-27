import { useState, useEffect } from "react"
import "./library.css"
import image1 from "../../assets/book 1.jpg"
import image2 from "../../assets/book 2.jpg"
import image3 from "../../assets/book 3.jpg"
import image4 from "../../assets/book 4.jpg"

const updatedBooksData = [
  {
    id: 1,
    title: "Artificial Intelligence in Business",
    author: "Lisa Wong",
    category: "ia",
    description: {
      en: "How businesses can leverage artificial intelligence to improve operations and gain competitive advantage.",
      fr: "Comment les entreprises peuvent utiliser l'intelligence artificielle pour améliorer leurs opérations et obtenir un avantage concurrentiel.",
      ar: "كيف يمكن للشركات الاستفادة من الذكاء الاصطناعي لتحسين العمليات واكتساب ميزة تنافسية.",
    },
    pages: 350,
    datePublished: "2024-04-05",
    languages: ["en", "fr", "ar"],
    isFavorite: false,
    isbn: "978-1234567890",
  },
  {
    id: 2,
    title: "Cloud Computing: Architecture and Implementation",
    author: "Michael Rodriguez",
    category: "security",
    description: {
      en: "A detailed exploration of cloud computing architectures, services, and implementation strategies.",
      fr: "Une exploration détaillée des architectures, services et stratégies d'implémentation du cloud computing.",
      ar: "استكشاف مفصل لبنيات الحوسبة السحابية وخدماتها واستراتيجيات التنفيذ.",
    },
    pages: 420,
    datePublished: "2024-03-10",
    languages: ["en", "fr", "ar"],
    isFavorite: true,
    isbn: "978-2345678901",
  },
  {
    id: 3,
    title: "Cybersecurity Essentials for IT Professionals",
    author: "Sarah Chen",
    category: "security",
    description: {
      en: "Essential knowledge and practical techniques for IT professionals to secure systems and networks.",
      fr: "Connaissances essentielles et techniques pratiques pour les professionnels de l'informatique afin de sécuriser les systèmes et les réseaux.",
      ar: "المعرفة الأساسية والتقنيات العملية لمحترفي تكنولوجيا المعلومات لتأمين الأنظمة والشبكات.",
    },
    pages: 380,
    datePublished: "2024-02-20",
    languages: ["en", "fr", "ar"],
    isFavorite: false,
    isbn: "978-3456789012",
  },
  {
    id: 4,
    title: "Blockchain Technology: Principles and Applications",
    author: "David Kim",
    category: "blockchain",
    description: {
      en: "A comprehensive guide to blockchain technology, its underlying principles, and real-world applications.",
      fr: "Un guide complet sur la technologie blockchain, ses principes sous-jacents et ses applications dans le monde réel.",
      ar: "دليل شامل لتقنية البلوكتشين ومبادئها الأساسية وتطبيقاتها في العالم الحقيقي.",
    },
    pages: 310,
    datePublished: "2024-01-15",
    languages: ["en", "fr", "ar"],
    isFavorite: false,
    isbn: "978-4567890123",
  },
]

const BooksList = ({
  searchQuery,
  categoryFilter,
  languageFilter,
  sortOption,
  showFavoritesOnly,
  currentPage,
  currentLanguage,
}) => {
  const [filteredItems, setFilteredItems] = useState([])
  const [animateItems, setAnimateItems] = useState(false)
  const itemsPerPage = 8


  useEffect(() => {
    const filtered = updatedBooksData.filter((item) => {
      const searchInCurrentLanguage = (text) => {
        if (!text) return true
        return text.toLowerCase().includes(searchQuery.toLowerCase())
      }

      const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      const contentMatch = searchInCurrentLanguage(item.description[currentLanguage])
      const matchesSearch = searchQuery === "" || titleMatch || contentMatch

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      const matchesLanguage = languageFilter === "all" || (item.languages && item.languages.includes(languageFilter))

      const matchesFavorites = !showFavoritesOnly || item.isFavorite

      return matchesSearch && matchesCategory && matchesLanguage && matchesFavorites
    })

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "dateNewest":
          return new Date(b.datePublished) - new Date(a.datePublished)
        case "dateOldest":
          return new Date(a.datePublished) - new Date(b.datePublished)
        case "alphabetical":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredItems(filtered)

    setAnimateItems(false)
    setTimeout(() => {
      setAnimateItems(true)
    }, 100)
  }, [searchQuery, categoryFilter, languageFilter, sortOption, showFavoritesOnly, currentLanguage])

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  if (paginatedItems.length === 0) {
    return (
      <div className="library-empty-state">
        <div className="library-empty-icon"></div>
        <h3>No items found</h3>
        <p>Try changing the filters or search query.</p>
      </div>
    )
  }

  const getCategoryColor = (category) => {
    const metadata = {
      "e-commerce": "#29ABE2",
      "it-compliance": "#8E44AD",
      security: "#E74C3C",
      legal: "#16A085",
      marketing: "#F39C12",
      programming: "#3498DB",
      ia: "#4CAF50",
      blockchain: "#FF9800",
    }
    return metadata[category] || "#95A5A6"
  }


  const getText = (key) => {
    const translations = {
      en: { pages: "pages", publishedOn: "Published on", by: "By", read: "Read Now" },
      fr: { pages: "pages", publishedOn: "Publié le", by: "Par", read: "Lire" },
      ar: { pages: "صفحات", publishedOn: "نشر في", by: "بواسطة", read: "اقرأ الآن" },
    }
    return translations[currentLanguage]?.[key] || translations.en[key]
  }

  const getBookImage = (bookId) => {
    switch (bookId) {
      case 1:
        return image1
      case 2:
        return image2
      case 3:
        return image3
      case 4:
        return image4
      default:
        return "/placeholder.svg?height=320&width=230"
    }
  }

  return (
    <div className="library-books-container">
      <div className="library-books-list">
        {paginatedItems.map((book, index) => (
          <div
            key={book.id}
            className={`library-book-item ${animateItems ? "library-animate" : ""}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="library-book-cover-wrapper">
              <img
                src={getBookImage(book.id) || "/placeholder.svg"}
                alt={book.title}
                className="library-book-cover"
                style={{ width: "230px", height: "100%" }}
              />
              {book.isFavorite && (
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
              )}
            </div>

            <div className="library-book-content">
              <div
                className="library-book-category"
                style={{
                  backgroundColor: `${getCategoryColor(book.category)}20`,
                  color: getCategoryColor(book.category),
                }}
              >
                {book.category}
              </div>

              <h3 className="library-book-title">{book.title}</h3>

              <p className="library-book-author">
                {getText("by")} {book.author}
              </p>

              <p className="library-book-description">
                {book.description?.[currentLanguage] || book.description?.en || ""}
              </p>

              <div className="library-book-meta">
                <span className="library-book-pages">
                  {book.pages} {getText("pages")}
                </span>
                <span className="library-book-date">
                  {getText("publishedOn")} {book.datePublished}
                </span>
              </div>

              <div className="library-book-languages">
                {book.languages.map((lang) => (
                  <span
                    key={lang}
                    className={`library-book-language ${lang === currentLanguage ? "library-current" : ""}`}
                  >
                    {lang.toUpperCase()}
                  </span>
                ))}
              </div>

              <a
                href={book.externalLink || `https://example.com/books/${book.isbn || book.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="library-book-read-button"
              >
                {getText("read")}
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
        ))}
      </div>

      <div className="library-books-coming-soon">
        <p>Our technical team is working hard to add more ICT books to our collection. Stay tuned!</p>
      </div>
    </div>
  )
}

export default BooksList


