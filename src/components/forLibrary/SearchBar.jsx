import "./library.css"

const SearchBar = ({ searchQuery, setSearchQuery, currentLanguage }) => {
  const getPlaceholderText = () => {
    const placeholders = {
      en: "Search terms, articles, or books...",
      fr: "Rechercher des termes, des articles ou des livres...",
      ar: "البحث عن مصطلحات أو مقالات أو كتب...",
    }
    return placeholders[currentLanguage] || placeholders.en
  }

  return (
    <div className="library-search-container">
      <input
        type="text"
        placeholder={getPlaceholderText()}
        className="library-search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <svg
        className="library-search-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
  )
}

export default SearchBar

