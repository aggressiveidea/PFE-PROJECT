"use client"

import { useState } from "react"
import "./BookLibSearch.css"

const BookLibSearch = ({ onSearch, categories }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch({ searchTerm, category: selectedCategory })
  }

  return (
    <div className="BookLibSearch">
      <form onSubmit={handleSearch}>
        <div className="BookLibSearch-input-container">
          <input
            type="text"
            placeholder="Search for books, authors, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="BookLibSearch-input"
          />
          <button type="submit" className="BookLibSearch-button">
            <svg
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
          </button>
        </div>

        <div className="BookLibSearch-filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="BookLibSearch-category-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  )
}

export default BookLibSearch
