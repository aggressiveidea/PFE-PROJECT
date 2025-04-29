"use client";

import { useState, useEffect } from "react";
import { PlusCircle, X, Search } from "lucide-react";
import AddArticleForm from "./AddArticleForm";
import "./filter-section.css";

export default function FilterSection({
  onSearch,
  onCategoryChange,
  onLanguageChange,
  setArticles,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const categories = [
    "All Categories",
    "Contrats informatiques",
    "Criminalité informatique",
    "Données personnelles",
    "Organisations",
    "Propriété intellectuelle",
    "Réseaux",
    "Commerce électronique",
    "Cybersecurity",
  ];

  const languages = ["All Languages", "English", "French", "Arabic"];

  // Check user role on component mount
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserRole(user.role || null);
    } catch (error) {
      console.error("Error getting user role:", error);
      setUserRole(null);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Trigger search on every keystroke
  };

  const handleOpenModal = () => {
    setShowAddModal(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    // Re-enable body scrolling
    document.body.style.overflow = "auto";
  };

  // Check if user can add articles
  const canAddArticles =
    userRole === "Ict-expert" || userRole === "Content-admin";

  return (
    <>
      <div className="filter-container-filtersection">
        {canAddArticles && (
          <div className="filter-actions-filtersection">
            <button className="add-article-button" onClick={handleOpenModal}>
              <PlusCircle size={18} />
              <span>Add Article</span>
            </button>
          </div>
        )}

        <div className="filter-group-filtersection">
          <span className="filter-label">Filter by:</span>
          <select
            className="filter-select-filtersection"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="filter-select-filtersection"
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div className="search-container-filtersection">
          <input
            type="text"
            className="searchfilter-input-filtersection"
            placeholder="Search for ICT laws and regulations..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="searchfilter-button-filtersection">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Add Article Modal */}
      <div className={`add-article-modal ${showAddModal ? "open" : ""}`}>
        <div className="modal-content">
          <button className="modal-close" onClick={handleCloseModal}>
            <X size={20} />
          </button>
          <AddArticleForm setArticles={setArticles} />
        </div>
      </div>
    </>
  );
}
