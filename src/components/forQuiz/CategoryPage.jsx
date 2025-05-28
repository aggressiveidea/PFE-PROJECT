<<<<<<< Updated upstream
import { useNavigate } from "react-router-dom"
import { Database, ShoppingCart, Network, Shield, FileQuestion, FileText, Copyright, Building } from "lucide-react"
import "./CategoryPage.css"

const CategoryPage = ({ darkMode }) => {
  const navigate = useNavigate()

  const handleCategorySelect = (category) => {
   
    localStorage.setItem("currentCategory", category.toLowerCase())

   
    navigate(`/quiz/question/${category.toLowerCase()}`)
  }
=======
"use client";

import { useNavigate } from "react-router-dom";
import {
  Database,
  ShoppingCart,
  Network,
  Shield,
  FileQuestion,
  FileText,
  Copyright,
  Building,
} from "lucide-react";
import "./CategoryPage.css";

const CategoryPage = ({ darkMode }) => {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    // Store the selected category in localStorage for progression
    localStorage.setItem("currentCategory", category.toLowerCase());

    // Navigate to the question page with the category parameter
    navigate(`/quiz/question/${category.toLowerCase()}`);
  };
>>>>>>> Stashed changes

  const categories = [
    {
      id: "personal-data",
      name: "Personal Data",
      icon: <Database />,
<<<<<<< Updated upstream
      description: "Questions about data protection, privacy laws, and personal information management.",
      features: ["GDPR concepts", "Data subject rights", "Data protection principles"],
=======
      description:
        "Questions about data protection, privacy laws, and personal information management.",
      features: [
        "GDPR concepts",
        "Data subject rights",
        "Data protection principles",
      ],
>>>>>>> Stashed changes
    },
    {
      id: "e-commerce",
      name: "E-commerce",
      icon: <ShoppingCart />,
<<<<<<< Updated upstream
      description: "Test your knowledge of online business, digital transactions, and e-commerce regulations.",
      features: ["Online marketplace rules", "Consumer rights", "Digital payment systems"],
=======
      description:
        "Test your knowledge of online business, digital transactions, and e-commerce regulations.",
      features: [
        "Online marketplace rules",
        "Consumer rights",
        "Digital payment systems",
      ],
>>>>>>> Stashed changes
    },
    {
      id: "networks",
      name: "Networks",
      icon: <Network />,
<<<<<<< Updated upstream
      description: "Questions about network infrastructure, protocols, and communication systems.",
=======
      description:
        "Questions about network infrastructure, protocols, and communication systems.",
>>>>>>> Stashed changes
      features: ["Network types", "Internet protocols", "Network security"],
    },
    {
      id: "cybercrime",
      name: "Cybercrime",
      icon: <Shield />,
<<<<<<< Updated upstream
      description: "Test your knowledge of computer crimes, digital forensics, and cybersecurity laws.",
      features: ["Hacking laws", "Digital evidence", "Cybersecurity regulations"],
=======
      description:
        "Test your knowledge of computer crimes, digital forensics, and cybersecurity laws.",
      features: [
        "Hacking laws",
        "Digital evidence",
        "Cybersecurity regulations",
      ],
>>>>>>> Stashed changes
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      icon: <FileQuestion />,
<<<<<<< Updated upstream
      description: "Various IT topics that don't fit into other categories, including emerging technologies.",
=======
      description:
        "Various IT topics that don't fit into other categories, including emerging technologies.",
>>>>>>> Stashed changes
      features: ["AI ethics", "Blockchain", "Digital transformation"],
    },
    {
      id: "it-contract",
      name: "IT Contract",
      icon: <FileText />,
<<<<<<< Updated upstream
      description: "Questions about technology agreements, service contracts, and licensing.",
=======
      description:
        "Questions about technology agreements, service contracts, and licensing.",
>>>>>>> Stashed changes
      features: ["SLAs", "Licensing terms", "Contract compliance"],
    },
    {
      id: "intellectual-property",
      name: "Intellectual Property",
      icon: <Copyright />,
<<<<<<< Updated upstream
      description: "Test your knowledge of patents, copyrights, and digital IP protection.",
=======
      description:
        "Test your knowledge of patents, copyrights, and digital IP protection.",
>>>>>>> Stashed changes
      features: ["Software patents", "Copyright laws", "IP infringement"],
    },
    {
      id: "organizations",
      name: "Organizations",
      icon: <Building />,
<<<<<<< Updated upstream
      description: "Questions about IT governance, standards bodies, and regulatory organizations.",
      features: ["ISO standards", "Industry consortiums", "Regulatory bodies"],
    },
  ]
=======
      description:
        "Questions about IT governance, standards bodies, and regulatory organizations.",
      features: ["ISO standards", "Industry consortiums", "Regulatory bodies"],
    },
  ];
>>>>>>> Stashed changes

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>Select Quiz Category</h1>
<<<<<<< Updated upstream
        <p>Choose a category to test your knowledge in specific IT and data protection areas</p>
=======
        <p>
          Choose a category to test your knowledge in specific IT and data
          protection areas
        </p>
>>>>>>> Stashed changes
      </div>

      <div className="category-grid">
        {categories.map((category) => (
<<<<<<< Updated upstream
          <div className="category-card" key={category.id} data-category={category.id}>
=======
          <div
            className="category-card"
            key={category.id}
            data-category={category.id}
          >
>>>>>>> Stashed changes
            <div className="category-card-inner">
              <div className="category-card-header">
                <div className="category-icon">{category.icon}</div>
                <h2>{category.name}</h2>
                <span className="category-badge">Quiz</span>
              </div>
              <div className="category-card-content">
                <p className="category-description">{category.description}</p>
                <ul className="category-features">
                  {category.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
<<<<<<< Updated upstream
                <button className="category-button" onClick={() => handleCategorySelect(category.id)}>
=======
                <button
                  className="category-button"
                  onClick={() => handleCategorySelect(category.id)}
                >
>>>>>>> Stashed changes
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
<<<<<<< Updated upstream
  )
}

export default CategoryPage
=======
  );
};

export default CategoryPage;
>>>>>>> Stashed changes
