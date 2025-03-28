"use client";

import { useState } from "react";
import ArticleCard from "./ArticleCard";
import "./article-grid.css";
import { getAllArticles } from "../../utils/article-data";

export default function ArticleGrid() {
  const [articles] = useState(getAllArticles());
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="article-grid">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          isFavorite={favorites.includes(article.id)}
          onToggleFavorite={() => toggleFavorite(article.id)}
        />
      ))}
    </div>
  );
}
