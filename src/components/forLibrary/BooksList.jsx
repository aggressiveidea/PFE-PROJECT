import { useState, useEffect } from "react";
import "./library.css";

const BooksList = ({
  data,
  searchQuery,
  categoryFilter,
  languageFilter,
  sortOption,
  showFavoritesOnly,
  currentPage,
  currentLanguage,
  onCardClick,
}) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [animateItems, setAnimateItems] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const filtered = data.filter((item) => {
      const titleMatch = item.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const authorMatch = item.author
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descriptionMatch =
        item.description?.[currentLanguage]
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.description?.en?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSearch = titleMatch || authorMatch || descriptionMatch;
      const matchesCategory =
        categoryFilter === "all" ||
        item.category === categoryFilter ||
        item.tags === categoryFilter;
      const matchesLanguage =
        languageFilter === "all" || item.language === languageFilter;
      const matchesFavorites = !showFavoritesOnly || item.isFavorite;

      return (
        matchesSearch && matchesCategory && matchesLanguage && matchesFavorites
      );
    });

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "dateNewest":
          return (
            new Date(b.addedToLibraryAt || b.createdAt || 0) -
            new Date(a.addedToLibraryAt || a.createdAt || 0)
          );
        case "dateOldest":
          return (
            new Date(a.addedToLibraryAt || a.createdAt || 0) -
            new Date(b.addedToLibraryAt || b.createdAt || 0)
          );
        case "titleAZ":
          return (a.title || "").localeCompare(b.title || "");
        case "titleZA":
          return (b.title || "").localeCompare(a.title || "");
        case "authorAZ":
          return (a.author || "").localeCompare(b.author || "");
        case "authorZA":
          return (b.author || "").localeCompare(a.author || "");
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
    setAnimateItems(false);
    setTimeout(() => {
      setAnimateItems(true);
    }, 100);
  }, [
    data,
    searchQuery,
    categoryFilter,
    languageFilter,
    sortOption,
    showFavoritesOnly,
    currentLanguage,
  ]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (paginatedItems.length === 0) {
    return (
      <div className="library-empty-state">
        <div className="library-empty-icon"></div>
        <h3>No books found</h3>
        <p>Try changing the filters or search query.</p>
      </div>
    );
  }

  const getText = (key) => {
    const translations = {
      en: { pages: "pages", addedOn: "Added on" },
      fr: { pages: "pages", addedOn: "Ajouté le" },
      ar: { pages: "صفحات", addedOn: "أضيف في" },
    };
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return "No description available";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="library-books-container">
      <div className="library-books-list">
        {paginatedItems.map((book, index) => (
          <div
            key={book.id}
            className={`library-book-item ${
              animateItems ? "library-animate" : ""
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onCardClick && onCardClick(book)}
          >
            <div className="library-book-cover-wrapper">
              <img
                src={
                  book.coverImgUrl ||
                  book.coverImgPreview ||
                  "/placeholder.svg?height=240&width=160"
                }
                alt={book.title}
                className="library-book-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=240&width=160";
                }}
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
              <div className="library-book-category">
                {book.category || book.tags || "Uncategorized"}
              </div>

              <h3 className="library-book-title">{book.title}</h3>

              <p className="library-book-description">
                {truncateText(
                  book.description?.[currentLanguage] || book.description?.en
                )}
              </p>

              <div className="library-book-meta">
                {book.pages && (
                  <span className="library-book-pages">
                    {book.pages} {getText("pages")}
                  </span>
                )}
                <span className="library-book-date">
                  {getText("addedOn")}{" "}
                  {formatDate(book.addedToLibraryAt || book.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <div className="library-books-coming-soon">
          <p>
            Showing {paginatedItems.length} of {filteredItems.length} books from
            your digital library.
          </p>
        </div>
      )}
    </div>
  );
};

export default BooksList;
