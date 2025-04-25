"use client"

import { useState, useEffect } from "react"
import LibraryCard from "./LibraryCard"
import { mockTermsData } from "./mockData"
import "./library.css"

const TermsList = ({
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
  const itemsPerPage = 6

  // Filter and sort items
  useEffect(() => {
    // First apply filters
    const filtered = mockTermsData.filter((item) => {
      // Search query filter
      const searchInCurrentLanguage = (text) => {
        if (!text) return true
        return text.toLowerCase().includes(searchQuery.toLowerCase())
      }

      const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      const contentMatch = searchInCurrentLanguage(item.definition[currentLanguage])
      const matchesSearch = searchQuery === "" || titleMatch || contentMatch

      // Category filter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      // Language filter
      const matchesLanguage = languageFilter === "all" || (item.languages && item.languages.includes(languageFilter))

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || item.isFavorite

      return matchesSearch && matchesCategory && matchesLanguage && matchesFavorites
    })

    // Then sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "dateNewest":
          return new Date(b.dateAdded) - new Date(a.dateAdded)
        case "dateOldest":
          return new Date(a.dateAdded) - new Date(b.dateAdded)
        case "alphabetical":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredItems(filtered)

    // Trigger animation after items are loaded
    setAnimateItems(false)
    setTimeout(() => {
      setAnimateItems(true)
    }, 100)
  }, [searchQuery, categoryFilter, languageFilter, sortOption, showFavoritesOnly, currentLanguage])

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  // Empty state
  if (paginatedItems.length === 0) {
    return (
      <div className="library-empty-state">
        <div className="library-empty-icon"></div>
        <h3>No items found</h3>
        <p>Try changing the filters or search query.</p>
      </div>
    )
  }

  return (
    <div className="library-grid">
      {paginatedItems.map((item, index) => (
        <LibraryCard
          key={item.id}
          item={item}
          index={index}
          animateItems={animateItems}
          currentLanguage={currentLanguage}
          type="term"
        />
      ))}
    </div>
  )
}

export default TermsList

