"use client";

import { useState } from "react";
import { User, FileText } from "lucide-react";
import "./creator-styles.css";

const CreatorCard = ({ creator, onClick, style }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Get article count (either from creator object or generate a random number)
  const articleCount = creator.author|| 0;

  // Update the getCardColor function to make colors more distinct
  const getCardColor = () => {
    // Use the creator's ID or index to generate a consistent color
    const colorIndex = creator._id?.charCodeAt(0) || 0;

    // Define more distinct card colors with CSS variables
    const colors = [
      "var(--card-color-1)",
      "var(--card-color-2)",
      "var(--card-color-3)",
      "var(--card-color-4)",
      "var(--card-color-5)",
    ];

    // Add a border gradient based on the card color
    const borderGradients = [
      "var(--card-border-1)",
      "var(--card-border-2)",
      "var(--card-border-3)",
      "var(--card-border-4)",
      "rgba(168, 85, 247, 0.3)",
    ];

    const hoverColors = [
      "var(--card-hover-1)",
      "var(--card-hover-2)",
      "var(--card-hover-3)",
      "var(--card-hover-4)",
      "var(--card-hover-5)",
    ];

    const index = colorIndex % colors.length;

    return {
      backgroundColor: colors[index],
      borderImage: borderGradients[index],
      hoverColor: hoverColors[index],
    };
  };

  // Update the card style to include the border gradient
  const cardColor = getCardColor();

  return (
    <div
      className="creator_card"
      onClick={() => onClick(creator._id)}
      style={{
        ...style,
        "--card-bg-color": cardColor.backgroundColor,
        "--card-hover-color": cardColor.hoverColor,
        borderImageSource: cardColor.borderImage,
        borderImageSlice: "1",
      }}
    >
      {/* Article count badge */}
      <div className="creator_article_count">
        <FileText className="creator_article_count_icon" />
        <span>{articleCount}</span>
      </div>

      <div className="creator_avatar_container">
        {creator.profileImgUrl && !imageError ? (
          <img
            src={creator.profileImgUrl || "/placeholder.svg"}
            alt={`${creator.firstName} ${creator.lastName}`}
            className="creator_img"
            onError={handleImageError}
          />
        ) : (
          <div className="creator_avatar_placeholder">
            <User size={24} />
          </div>
        )}
      </div>
      <div className="creator_info">
        <div className="creator_name">
          {creator.firstName} {creator.lastName}
        </div>
        <div className="creator_role">{creator.role}</div>
      </div>
    </div>
  );
};

export default CreatorCard;
