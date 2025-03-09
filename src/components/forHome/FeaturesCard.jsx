import React from "react";
import underText from "../../assets/freepik--background-simple--inject-223.png";

const FeatureCard = ({ title, image, description }) => {
  return (
    <div className="feature-card">
          <div className="feature-image">
        <img src={image} alt={title} />
      </div>
      <div className="feature-content">
        <h1>{title}</h1>
        <img src={underText} alt="Decoration" className="under-text" />
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
