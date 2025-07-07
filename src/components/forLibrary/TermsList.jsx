"use client";

import { useState, useEffect } from "react";
import TermCard from "./TermCard";
import TermModal from "./TermModal";
import "./simple-term-card.css";

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
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const filtered = data.filter((item) => {
      const titleMatch = item.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const definitionMatch = item.definition
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSearch = searchQuery === "" || titleMatch || definitionMatch;

      const matchesCategory =
        categoryFilter === "all" ||
        item.category === categoryFilter ||
        (item.categories && item.categories.includes(categoryFilter));

      const matchesLanguage =
        languageFilter === "all" ||
        (item.allDefinitions &&
          item.allDefinitions.some((def) => def.language === languageFilter));

      const matchesFavorites = !showFavoritesOnly || item.isFavorite;

      return (
        matchesSearch && matchesCategory && matchesLanguage && matchesFavorites
      );
    });

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "dateNewest":
          return (
            new Date(b.savedAt || b.createdAt || 0) -
            new Date(a.savedAt || a.createdAt || 0)
          );
        case "dateOldest":
          return (
            new Date(a.savedAt || a.createdAt || 0) -
            new Date(b.savedAt || b.createdAt || 0)
          );
        case "titleAZ":
          return (a.name || "").localeCompare(b.name || "");
        case "titleZA":
          return (b.name || "").localeCompare(a.name || "");
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

  const handleCardClick = (term) => {
    setSelectedTerm(term);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTerm(null);
  };

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
    <>
      <div className="library-grid">
        {paginatedItems.map((item, index) => (
          <TermCard
            key={item.id}
            term={item}
            index={index}
            animateItems={animateItems}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      <TermModal
        term={selectedTerm}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default TermsList;
