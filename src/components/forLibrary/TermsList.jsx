"use client";

import { useState, useEffect } from "react";
import LibraryCard from "./LibraryCard";
import "./library.css";

const TermsList = ({
  data,  
  searchQuery,
  categoryFilter,
  languageFilter,
  sortOption,
  showFavoritesOnly,
  currentPage,
  currentLanguage,
}) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const [animateItems, setAnimateItems] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const filtered = data.filter((item) => {
       
      const titleMatch = item.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const definitionMatch = item.definition
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSearch = searchQuery === "" || titleMatch || definitionMatch;

       
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

       
      const matchesLanguage =
        languageFilter === "all" || item.language === languageFilter;

       
      const matchesFavorites = !showFavoritesOnly || item.isFavorite;

      return (
        matchesSearch && matchesCategory && matchesLanguage && matchesFavorites
      );
    });

     
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "dateNewest":
          return (
            new Date(b.dateAdded || b.createdAt || 0) -
            new Date(a.dateAdded || a.createdAt || 0)
          );
        case "dateOldest":
          return (
            new Date(a.dateAdded || a.createdAt || 0) -
            new Date(b.dateAdded || b.createdAt || 0)
          );
        case "titleAZ":
          return (a.title || "").localeCompare(b.title || "");
        case "titleZA":
          return (b.title || "").localeCompare(a.title || "");
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (paginatedItems.length === 0) {
    return (
      <div className="library-empty-state">
        <div className="library-empty-icon"></div>
        <h3>No terms found</h3>
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
          type="term"
        />
      ))}
    </div>
  );
};

export default TermsList;
