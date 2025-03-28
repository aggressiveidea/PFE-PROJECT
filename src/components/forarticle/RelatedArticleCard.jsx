"use client";

import { useNavigate } from "react-router-dom";
import "./related-article-card.css";
import Image from "../../assets/cde57eb697132f9d4316f8076379469d.jpg";

const RelatedArticleCard = ({ article, categoryColors }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/articles/${article._id}`);
  };

  return (
    <div className="related-article-card" onClick={handleClick}>
      <div className="related-article-image">
        <img src={Image} alt={article.title} />
      </div>
      <div className="related-article-content">
        <div
          className={`related-article-category ${
            categoryColors[article.category]?.bg
          } ${categoryColors[article.category]?.text}`}
        >
          {article.category}
        </div>
        <h3 className="related-article-title">{article.title}</h3>
      </div>
    </div>
  );
};

export default RelatedArticleCard;
