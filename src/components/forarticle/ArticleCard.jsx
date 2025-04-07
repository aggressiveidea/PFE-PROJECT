"use client";

import { useState } from "react";
import "./article-card.css";

// Define the category colors
const categoryColors = {
  "Contrats informatiques": { bg: "bg-blue-100", text: "text-blue-600" },
  "Criminalité informatique": { bg: "bg-purple-100", text: "text-purple-600" },
  "Données personnelles": { bg: "bg-green-100", text: "text-green-600" },
  Organisations: { bg: "bg-pink-100", text: "text-pink-600" },
  "Propriété intellectuelle": { bg: "bg-orange-100", text: "text-orange-600" },
  Réseaux: { bg: "bg-indigo-100", text: "text-indigo-600" },
  "Commerce électronique": { bg: "bg-indigo-100", text: "text-indigo-600" },
};

export default function ArticleCard({
  article,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,
} )
{
  const user = JSON.parse( localStorage.getItem( "user" ) );
  console.log( "user :",user.role  );
  
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = (e) => {
    if (
      e.target.closest(".action-button") ||
      e.target.closest(".favorite-button") ||
      e.target.closest(".share-button") ||
      e.target.closest(".edit-button") ||
      e.target.closest(".delete-button")
    ) {
      return;
    }
    window.location.href = `/articles/${article._id}`;
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(article._id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if ( onDelete )
    {
      onDelete(article._id);
    }
  };

  const role = user?.role; // Convertir en minuscule

  //console.log("User role:", user?.role);
  //console.log("Normalized role:", role);
        console.log("delete", article._id);

  console.log( 'article',article );
  console.log( 'ownerId',article.ownerId );

  const canEdit =
    role === "Content-admin" ||
    (role === "Ict-expert" && user._id === article.ownerId);

   console.log("userid ", article.ownerId, user._id);
   console.log("can edit ", canEdit);
  const canDelete = canEdit; // Puisque les permissions sont les mêmes

  console.log("onEdit defined?", typeof onEdit);

  console.log( "Can Edit:", canEdit );
  console.log( "Can Delete:", canDelete );

  console.log("User object:", user);

  return (
    <div
      className="article-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Show category first */}
      <div
        className={`article-category ${categoryColors[article.category]?.bg} ${
          categoryColors[article.category]?.text
        }`}
      >
        {article.category}
      </div>

      {/* Show title */}
      <h3 className="article-title">{article.title}</h3>

      {/* Show base64 image below title */}
      {article.imageUrl && (
        <div className="article-image-wrapper">
          <img
            src={`data:image/jpeg;base64,${article.imageUrl}`} 
            alt={article.title}
            className="article-image"
          />
        </div>
      )}

      {/* Show truncated description */}
      <p className="article-description">
        {article.content?.length > 100
          ? `${article.content.substring(0, 100)}...`
          : article.content}
      </p>

      <div className="article-actions">
        <div className="action-buttons-articlepage-first">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(article._id);
            }}
            className={`action-button favorite-button ${
              isFavorite ? "active" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button
            className="action-button share-button"
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
              if (navigator.share) {
                navigator
                  .share({
                    title: article.title,
                    text: article.description,
                    url: `/articles/${article._id}`,
                  })
                  .catch((err) => console.log("Error sharing", err));
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>

        {(canEdit || canDelete) && (
          <div className="action-buttons-articlepage-second">
            {canEdit && (
              <button
                onClick={handleEdit}
                className="action-button edit-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="action-button delete-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );


}
