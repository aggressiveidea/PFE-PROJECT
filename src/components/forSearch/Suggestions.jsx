"use client"

import { useState } from "react"
import "./Suggestions.css"

const Suggestions = () => {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="suggestions">
      <div className={`search-input ${isFocused ? "focused" : ""}`}>
        <input
          type="text"
          placeholder="Enter a term..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button className="clear-button" style={{ opacity: inputValue ? 1 : 0 }}>
          ×
        </button>
      </div>
      <div className="suggestions-list">
        {inputValue ? (
          <div className="typing-animation">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        ) : (
          <div className="placeholder-content">
            <div className="placeholder-icon">
              <svg viewBox="0 0 24 24" width="40" height="40">
                <path
                  fill="#9b87f5"
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </div>
            <p className="placeholder-text">Suggestions will appear here based on your term.</p>
            <p className="placeholder-hint">Try typing "algorithm", "data", or "network"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Suggestions
