import React, { useState } from 'react';
import './GraphSearch.css';

const GraphSearch = ({ onSearch, language }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const getPlaceholder = () => {
    const placeholders = {
      english: "Search nodes in graph...",
      french: "Rechercher des nœuds dans le graphe...",
      arabic: "البحث عن العقد في الرسم البياني..."
    };
    return placeholders[language] || placeholders.english;
  };

  const getButtonText = () => {
    const buttonTexts = {
      english: "Search",
      french: "Rechercher",
      arabic: "بحث"
    };
    return buttonTexts[language] || buttonTexts.english;
  };

  return (
    <div className="graph-search">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder={getPlaceholder()}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="graph-search-input"
          />
          <button type="submit" className="graph-search-button">
            {getButtonText()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GraphSearch;