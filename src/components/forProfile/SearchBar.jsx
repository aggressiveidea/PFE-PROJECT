import { useState } from "react"
import "./SearchBar.css"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [language, setLanguage] = useState("english")

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search ICT terms, articles, or research papers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
      </div>

      <div className="language-switcher">
        <button className={`lang-btn ${language === "english" ? "active" : ""}`} onClick={() => setLanguage("english")}>
          English
        </button>
        <button className={`lang-btn ${language === "french" ? "active" : ""}`} onClick={() => setLanguage("french")}>
          French
        </button>
        <button className={`lang-btn ${language === "arabic" ? "active" : ""}`} onClick={() => setLanguage("arabic")}>
          Arabic
        </button>
      </div>
    </div>
  )
}

