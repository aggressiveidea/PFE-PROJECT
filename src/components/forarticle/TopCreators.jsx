import React from "react";
import "./TopCreators.css";

const creators = [
  {
    name: "Jimena Morrow",
    org: "BBC News",
    img: "https://via.placeholder.com/48",
  },
  {
    name: "Efrain Howell",
    org: "IDN News",
    img: "https://via.placeholder.com/48",
  },
  {
    name: "Nina Waters",
    org: "Buletin.Inc",
    img: "https://via.placeholder.com/48",
  },
  {
    name: "Jamar Burns",
    org: "CNN",
    img: "https://via.placeholder.com/48",
  },
];

const TopCreators = () => {
  return (
    <section className="top-creators-section">
      <div className="top-creators-header">
        <h2>Top Creator</h2>
        <a href="#" className="see-all">
          See all &rarr;
        </a>
      </div>
      <div className="creators-list">
        {creators.map((creator, index) => (
          <div className="creator" key={index}>
            <img src={creator.img} alt={creator.name} className="creator-img" />
            <div className="creator-info">
              <strong>{creator.name}</strong>
              <p>{creator.org}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCreators;
