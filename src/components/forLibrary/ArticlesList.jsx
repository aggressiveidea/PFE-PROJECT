"use client";

import { useState, useEffect } from "react";
import LibraryCard from "./LibraryCard";
import "./library.css";

const ArticlesList = ({
  data, // Real data from localStorage passed from parent
  searchQuery,
  categoryFilter,
  languageFilter,
  sortOption,
  showFavoritesOnly,
  currentPage,
  currentLanguage,
  onCardClick, // Navigation handler from parent
}) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [animateItems, setAnimateItems] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const filtered = data.filter((item) => {
      // Search in title, content, author name
      const titleMatch = item.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const contentMatch = item.content
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const authorMatch = item.ownerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSearch =
        searchQuery === "" || titleMatch || contentMatch || authorMatch;

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      // Language filter (if applicable)
      const matchesLanguage =
        languageFilter === "all" || item.language === languageFilter;

      // Favorites filter (you can implement this based on your needs)
      const matchesFavorites = !showFavoritesOnly || item.isFavorite;

      return (
        matchesSearch && matchesCategory && matchesLanguage && matchesFavorites
      );
    });

    // Sort the filtered data
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "dateNewest":
          return (
            new Date(b.bookmarkedAt || b.createdAt || 0) -
            new Date(a.bookmarkedAt || a.createdAt || 0)
          );
        case "dateOldest":
          return (
            new Date(a.bookmarkedAt || a.createdAt || 0) -
            new Date(b.bookmarkedAt || b.createdAt || 0)
          );
        case "titleAZ":
          return (a.title || "").localeCompare(b.title || "");
        case "titleZA":
          return (b.title || "").localeCompare(a.title || "");
        case "authorAZ":
          return (a.ownerName || "").localeCompare(b.ownerName || "");
        case "authorZA":
          return (b.ownerName || "").localeCompare(a.ownerName || "");
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

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (paginatedItems.length === 0) {
    return (
      <div className="library-empty-state">
        <div className="library-empty-icon"></div>
        <h3>No articles found</h3>
        <p>Try changing the filters or search query.</p>
      </div>
    );
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
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default ArticlesList;
