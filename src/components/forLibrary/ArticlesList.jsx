import { useState, useEffect } from "react"
import LibraryCard from "./LibraryCard"
import { mockArticlesData } from "./mockData"
import "./library.css"

const ArticlesList = ({
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

  useEffect(() => {
    const filtered = mockArticlesData.filter((item) => {
 
      const searchInCurrentLanguage = (text) => {
        if (!text) return true
        return text.toLowerCase().includes(searchQuery.toLowerCase())
      }

      const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
      const contentMatch = searchInCurrentLanguage(item.abstract[currentLanguage])
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

  // Pagination
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

  return (
    <div className="library-grid">
      {paginatedItems.map((item, index) => (
        <LibraryCard
          key={item.id}
          item={item}
          index={index}
          animateItems={animateItems}
          currentLanguage={currentLanguage}
          type="article"
        />
      ))}
    </div>
  )
}

export default ArticlesList
