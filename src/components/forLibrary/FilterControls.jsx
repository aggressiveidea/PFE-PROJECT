"use client"
import "./library.css"

const FilterControls = ({
  categoryFilter,
  setCategoryFilter,
  languageFilter,
  setLanguageFilter,
  sortOption,
  setSortOption,
  showFavoritesOnly,
  setShowFavoritesOnly,
  resetFilters,
  currentLanguage,
}) => {
  // UI translations
  const uiTranslations = {
    en: {
      allCategories: "All Categories",
      allLanguages: "All Languages",
      dateNewest: "Date (Newest)",
      dateOldest: "Date (Oldest)",
      alphabetical: "Alphabetical",
      favorites: "Favorites",
    },
    fr: {
      allCategories: "Toutes Catégories",
      allLanguages: "Toutes les Langues",
      dateNewest: "Date (Plus Récent)",
      dateOldest: "Date (Plus Ancien)",
      alphabetical: "Alphabétique",
      favorites: "Favoris",
    },
    ar: {
      allCategories: "جميع الفئات",
      allLanguages: "جميع اللغات",
      dateNewest: "التاريخ (الأحدث)",
      dateOldest: "التاريخ (الأقدم)",
      alphabetical: "أبجدي",
      favorites: "المفضلة",
    },
  }

  const getText = (key) => {
    return uiTranslations[currentLanguage]?.[key] || uiTranslations.en[key]
  }

  // Categories data
  const categories = [
    { value: "e-commerce", label: "E-Commerce" },
    { value: "it-compliance", label: "IT Compliance" },
    { value: "security", label: "Security" },
    { value: "legal", label: "Legal" },
    { value: "marketing", label: "Marketing" },
    { value: "programming", label: "Programming" },
  ]

  // Languages data
  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "ar", label: "العربية" },
  ]

  return (
    <div className="library-filter-controls">
      <div className="library-filter-group">
        {/* Category filter */}
        <div className="library-filter-container">
          <select
            className="library-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">{getText("allCategories")}</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <svg
            className="library-filter-icon"
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
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </div>

        {/* Language filter */}
        <div className="library-filter-container">
          <select
            className="library-filter-select"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="all">{getText("allLanguages")}</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          <svg
            className="library-filter-icon"
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
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </div>

        {/* Sort options */}
        <div className="library-filter-container">
          <select className="library-filter-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="dateNewest">{getText("dateNewest")}</option>
            <option value="dateOldest">{getText("dateOldest")}</option>
            <option value="alphabetical">{getText("alphabetical")}</option>
          </select>
          <svg
            className="library-filter-icon"
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
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
        </div>

        {/* Favorites toggle */}
        <button
          className={`library-favorites-toggle ${showFavoritesOnly ? "library-active" : ""}`}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          aria-label={getText("favorites")}
        >
          <svg
            className="library-favorites-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={showFavoritesOnly ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>{getText("favorites")}</span>
        </button>

        {/* Reset filters */}
        <button className="library-reset-filters-button" onClick={resetFilters} aria-label="Reset filters">
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
            <path d="M23 4v6h-6"></path>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default FilterControls

