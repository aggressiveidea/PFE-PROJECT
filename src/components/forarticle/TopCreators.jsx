import React from "react";
import { User } from "lucide-react"; // Si tu veux une icône par défaut
import "./TopCreators.css";

const creators = [
  {
    name: "Jimena Morrow",
    org: "BBC News",
    img: "https://via.placeholder.com/48",
    link: "#",
  },
  {
    name: "Efrain Howell",
    org: "IDN News",
    img: "https://via.placeholder.com/48",
    link: "#",
  },
  {
    name: "Nina Waters",
    org: "Buletin.Inc",
    img: "https://via.placeholder.com/48",
    link: "#",
  },
  {
    name: "Jamar Burns",
    org: "CNN",
    img: "https://via.placeholder.com/48",
    link: "#",
  },
];

const TopCreators = () => {
  const handleImageError = (e) => {
    e.target.style.display = "none";
    // Optionnel : tu peux gérer une image de secours ici si besoin
  };

  return (
    <section className="top-creators-section">
      <div className="top-creators-header">
        <h2>🔥 Top Creators</h2>
        <a href="#" className="see-all">
          See all &rarr;
        </a>
      </div>
      <div className="creators-list">
        {creators.map((creator, index) => (
          <a href={creator.link} className="owner-profile-link" key={index}>
            <div className="owner-info">
              <div className="owner-avatar">
                {creator.img ? (
                  <img
                    src={creator.img}
                    alt={creator.name}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <User size={16} />
                  </div>
                )}
              </div>
              <div className="owner-details">
                <span className="owner-name">{creator.name}</span>
                <span className="owner-role">{creator.org}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default TopCreators;
