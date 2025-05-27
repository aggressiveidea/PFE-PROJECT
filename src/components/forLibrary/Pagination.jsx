import "./library.css"

const Pagination = ({ currentPage, totalPages, handlePageChange, currentLanguage }) => {
  if (totalPages <= 1) return null

  const getText = (key) => {
    const translations = {
      en: { previous: "Previous", next: "Next" },
      fr: { previous: "Précédent", next: "Suivant" },
      ar: { previous: "السابق", next: "التالي" },
    }

    return translations[currentLanguage]?.[key] || translations.en[key]
  }

  return (
    <div className={`library-pagination ${currentLanguage === "ar" ? "library-rtl" : "library-ltr"}`}>
      <button
        className="library-pagination-button library-prev-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div className="library-pagination-numbers">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`library-page-number ${currentPage === page ? "library-active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className="library-pagination-button library-next-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  )
}

export default Pagination
