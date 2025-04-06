
"use client"

import { Search, Filter } from "lucide-react"

export default function SearchAndFilter({
  searchTerm,
  onSearchChange,
  filterCategory,
  onFilterChange,
  categories = [],
}) {
  return (
    <div className="content-dashboard-filters">
      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search articles by title, content, or author..."
          className="search-input"
          value={searchTerm || ""}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-container">
        <Filter className="filter-icon" />
        <select
          className="filter-select"
          value={filterCategory || "All Categories"}
          onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
