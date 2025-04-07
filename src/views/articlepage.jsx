"use client";

import { useState, useRef, useEffect } from "react";
import Footer from "../components/forarticle/Footer";
import FilterSection from "../components/forarticle/FilterSection";
import AddArticleForm from "../components/forarticle/AddArticleForm";
import UpdateArticleForm from "../components/forarticle/UpdateArticleForm";
import ArticleCard from "../components/forarticle/ArticleCard";
import { ThemeProvider } from "../components/forarticle/ThemeContext";
import { useTheme } from "../components/forarticle/ThemeContext";
import "../components/forarticle/globals.css";
import Header from "../components/forHome/Header";



import { getallarticles } from "../services/Api";
import { deletearticle } from "../services/Api";
import { updatearticle } from "../services/Api";

function Articlepage() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [languageFilter, setLanguageFilter] = useState("All Languages");
  const [articles, setArticles] = useState([]);
  const [articleToEdit, setArticleToEdit] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [ favorites, setFavorites ] = useState( [] );
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const articlesRef = useRef(null);
  const addArticleRef = useRef(null);
  const servicesRef = useRef(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);

  
    const fetchArticles = async () => {
      setLoading(true); // Start loading

      try {
        console.log("Fetching articles...");
        const response = await getallarticles();

        console.log("Response received:", response);

        if (response && Array.isArray(response)) {
          setArticles(response);
          setAlertMessage("Articles loaded successfully!");
        } else {
          setAlertMessage("No articles found.");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setAlertMessage("Error loading articles. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
  useEffect( () =>
  {
    fetchArticles();
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add garden color effect to CTA button on hover
  useEffect(() => {
    const ctaButton = document.querySelector(".cta-button");
    if (ctaButton) {
      ctaButton.addEventListener("mouseenter", () => {
        ctaButton.classList.add("garden-hover");
      });
      ctaButton.addEventListener("mouseleave", () => {
        ctaButton.classList.remove("garden-hover");
      });
    }

    return () => {
      if (ctaButton) {
        ctaButton.removeEventListener("mouseenter", () => {});
        ctaButton.removeEventListener("mouseleave", () => {});
      }
    };
  }, []);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleEditArticle = (id) => {
    const article = articles.find((article) => article._id === id);
    const canEdit =
      user.role === "Content-admin" ||
      (user.role === "Ict-expert" && user.id === article.ownerId);
    console.log( "userid ", article.ownerId, user.id );
    console.log( "can edit ", canEdit)
    if (canEdit) {
      setArticleToEdit( article );
      // Show form
      setShowUpdateForm( true );
    }
  };

 const handleUpdateArticle = async (updatedArticle) => {
   try {
     // Fetch the response
     const response = await updatearticle(updatedArticle._id, updatedArticle);

     console.log( "type", typeof ( response ) );
     console.log( "type", typeof ( response.success ) );
     
     if ( !response.success )
     {
       throw new Error("error in the delete ");
     }

     // Update the articles in the state
     setArticles((prevArticles) =>
       prevArticles.map((article) =>
         article._id === updatedArticle._id ? updatedArticle : article
       )
     );

     // Close the update form and reset the article to edit
     setShowUpdateForm(false);
     setArticleToEdit(null);

     console.log("Successfully updated");

     // Fetch the updated list of articles (if necessary)
     fetchArticles();
   } catch (error) {
     console.error("Error updating API:", error);
   }
 };



  const handleDeleteArticle = async (id) => {
  const article = articles.find((article) => article._id === id);

    console.log( "id of the article ", id );
    console.log("userid ", article.ownerId, user.id);
    if (
      user.role === "Content-admin" ||
      ( user.role === "Ict-expert" && user.id === article.ownerId )
      
    )
    {
      setArticles( articles.filter( ( article ) => article._id !== id ) );
    
      try {
        const response = await deletearticle(id);

        if (!response.ok) {
          throw new Error("error in the delete ");
        }

        
        console.log("successfully deleted ");
      } catch (error) {
        console.error(" Error fetching deleting API:", error);
      }
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <Header
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
      />
      <div className="stars-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="planet planet1"></div>
      <div className="planet planet2"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star shooting-star2"></div>
      <div className="comet"></div>

      <main className="main-content-article ">
        <section className="hero-section">
          <h1 className="hero-title">Navigating the Digital Frontier</h1>
          <p className="hero-subtitle">
            Explore the latest developments in ICT laws, cybersecurity, and
            digital regulations
          </p>
          <button
            className="cta-button"
            onClick={() => scrollToSection(articlesRef)}
          >
            Discover Articles
          </button>
        </section>
        <section ref={articlesRef} className="articles-section">
          <h1 className="section-title">Latest Articles</h1>
          <p className="section-subtitle">
            Stay informed with our curated collection of articles on ICT laws
            and regulations
          </p>

          <FilterSection
            onSearch={setSearchTerm}
            onCategoryChange={setCategoryFilter}
            onLanguageChange={setLanguageFilter}
          />

          {loading ? (
            <p>Loading articles...</p>
          ) : (
            <div className="articles-container">
              <div className="article-grid">
                {articles
                  .filter((article) => {
                    // Filter by search term
                    if (
                      searchTerm &&
                      !article.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                      !article.content
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                      !article.category
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return false;
                    }

                    if (
                      categoryFilter !== "All Categories" &&
                      article.category !== categoryFilter
                    ) {
                      return false;
                    }

                    if (
                      languageFilter !== "All Languages" &&
                      !article.language.includes(languageFilter)
                    ) {
                      return false;
                    }

                    return true;
                  })
                  .map((article) => (
                    <ArticleCard
                      key={article._id}
                      article={article}
                      isFavorite={favorites.includes(article._id)}
                      onToggleFavorite={() => toggleFavorite(article._id)}
                      user={user}
                      onEdit={handleEditArticle}
                      onDelete={handleDeleteArticle}
                    />
                  ))}
              </div>
            </div>
          )}
        </section>
        {(user.role === "Content-admin" || user.role === "Ict-expert") && (
          <section ref={addArticleRef} className="add-article-section">
            <h2 className="section-title">Contribute an Article</h2>
            <p className="section-subtitle">
              Share your knowledge with the ICT law community
            </p>
            <div className="articles-container">
              <AddArticleForm setArticles={setArticles} />
            </div>
          </section>
        )}
        <section ref={servicesRef} className="services-section">
          <h2 className="section-title">Explore ICT Law Areas</h2>
          <p className="section-subtitle">
            Discover specialized legal domains in information and communication
            technology
          </p>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-purple"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>Cybersecurity</h3>
              <p>Legal frameworks for digital security and breach prevention</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-purple"
                >
                  <path d="M12 2s8 3 8 10v3.5C20 19 16.42 21 12 21s-8-2-8-5.5V12c0-7 8-10 8-10z"></path>
                </svg>
              </div>
              <h3>Data Protection</h3>
              <p>Regulations governing personal data and privacy rights</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-purple"
                >
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a2 2 0 1 1 0 4h-1a7 7 0 0 1-7 7h-1v1.27c.6.34 1 .99 1 1.73a2 2 0 0 1-4 0c0-.74.4-1.39 1-1.73V18h-1a7 7 0 0 1-7-7H2a2 2 0 1 1 0-4h1a7 7 0 0 1 7-7h1V4.27C10.4 3.93 10 3.26 10 2.5a2 2 0 0 1 2-2z"></path>
                </svg>
              </div>
              <h3>AI Ethics</h3>
              <p>
                Ethical and legal considerations for artificial intelligence
              </p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-purple"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <h3>Digital Rights</h3>
              <p>Legal protections in the digital environment</p>
            </div>
          </div>

          <div className="explore-button-container">
            <a
              href="#"
              className="explore-main-button"
              onClick={() => scrollToSection(articlesRef)}
            >
              Explore
            </a>
          </div>
        </section>
        {showUpdateForm && (
          <UpdateArticleForm
            article={articleToEdit}
            onUpdate={handleUpdateArticle}
            onClose={() => setShowUpdateForm(false)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Articlepage />
    </ThemeProvider>
  );
}

export default App;
