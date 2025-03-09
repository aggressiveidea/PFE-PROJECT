import React from "react";
import "./HeroSection.css";

const CarouselItem = ({ item }) => {
  return (
    <div className="carousel-item">
      <div className="carousel-content">
        <h2 className="carousel-title">{item.title}</h2>
        <p className="carousel-description">{item.description}</p>
      </div>
      <div className="carousel-image-container">
        <img className="carousel-img" src={item.icon} alt={item.title} />
      </div>
    </div>
  );
};

export default CarouselItem;
