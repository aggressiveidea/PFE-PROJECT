import { useState } from "react";
import "./library.css";

const LibraryCard = ({
  item,
  index,
  animateItems,
  currentLanguage,
  type,
  onCardClick,
}) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);

  const getCategoryMetadata = (category) => {
    const metadata = {
      "Données personnelles": {
        label: {
          en: "Personal Data",
          fr: "Données personnelles",
          ar: "البيانات الشخصية",
        },
        color: "#29ABE2",
      },
      "it-compliance": {
        label: {
          en: "IT Compliance",
          fr: "Conformité IT",
          ar: "الامتثال لتكنولوجيا المعلومات",
        },
        color: "#8E44AD",
      },
      security: {
        label: { en: "Security", fr: "Sécurité", ar: "الأمن" },
        color: "#E74C3C",
      },
      legal: {
        label: { en: "Legal", fr: "Légal", ar: "قانوني" },
        color: "#16A085",
      },
      marketing: {
        label: { en: "Marketing", fr: "Marketing", ar: "التسويق" },
        color: "#F39C12",
      },
      programming: {
        label: { en: "Programming", fr: "Programmation", ar: "البرمجة" },
        color: "#3498DB",
      },
    };

    return (
      metadata[category] || {
        label: { en: category, fr: category, ar: category },
        color: "#95A5A6",
      }
    );
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(item);
    }
  };

  const getCategoryLabel = (category) => {
    const metadata = getCategoryMetadata(category);
    return metadata.label[currentLanguage] || metadata.label.en || category;
  };

  const getDateLabel = () => {
    const translations = {
      en: { addedOn: "Added on", publishedOn: "Published on" },
      fr: { addedOn: "Ajouté le", publishedOn: "Publié le" },
      ar: { addedOn: "أضيف في", publishedOn: "نشر في" },
    };

    const text = translations[currentLanguage] || translations.en;
    const date =
      item.bookmarkedAt ||
      item.createdAt ||
      item.dateAdded ||
      item.datePublished;

    if (type === "term") {
      return `${text.addedOn} ${new Date(date).toLocaleDateString()}`;
    } else {
      return `${text.publishedOn} ${new Date(date).toLocaleDateString()}`;
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "No content available";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (type === "article") {
    return (
      <div
        className={`library-article-card ${
          animateItems ? "library-animate" : ""
        }`}
        style={{ animationDelay: `${index * 0.05}s` }}
        onClick={handleCardClick}
      >
      
        <div className="library-article-image">
          <img
            src={
              item.imageUrl ||
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VEQRQgOh77L44yDusYYhmOqACc0jVK.png"
            }
            alt={item.title}  
            onError={(e) => {
              e.target.src =
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VEQRQgOh77L44yDusYYhmOqACc0jVK.png";
            }}
          />

          <div className="library-article-header">
            <div className="library-article-category">
              {getCategoryLabel(item.category)}
            </div>
            <button
              className={`library-article-favorite ${
                isFavorite ? "library-active" : ""
              }`}
              onClick={toggleFavorite}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
          </div>
        </div>

        <div className="library-article-content">
          <h3 className="library-article-title">{item.title}</h3>
          <p className="library-article-abstract">
            {truncateText(item.content)}
          </p>

          <div className="library-article-footer">
            <div className="library-article-stats">
              <div className="stat-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>{item.click || 0}</span>
              </div>

              <div className="stat-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{item.favorites || 0}</span>
              </div>

              <div className="stat-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>{item.share || 0}</span>
              </div>

              <div className="stat-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{item.comment || 0}</span>
              </div>
            </div>

            <span className="library-article-date">{getDateLabel()}</span>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default LibraryCard;
