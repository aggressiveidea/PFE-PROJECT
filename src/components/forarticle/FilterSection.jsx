"use client";

import { useState } from "react";
import "./filter-section.css";

export default function FilterSection({
  onSearch,
  onCategoryChange,
  onLanguageChange,
}) {
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Trigger search on every keystroke
  };

  return (
    <div className="filter-container-filtersection">
      <div className="filter-group">
        <span className="filter-label">Filter by:</span>
        <select
          className="filter-select"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="searchfilter-input"
          placeholder="Search for ICT laws and regulations..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="searchfilter-button">
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
    </div>
  );
}
