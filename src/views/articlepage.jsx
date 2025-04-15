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
import Trends from "../components/forarticle/TrendingTopics";
import Topics from "../components/forarticle/SuggestTopic";
import Authors from "../components/forarticle/TopCreators";
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
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [ language, setLanguage ] = useState( "en" );
  const [index, setIndex] = useState(13);

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
  const [ loading, setLoading ] = useState( true );
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  
    const fetchArticles = async () => {
      setLoading(true); // Start loading

      try {
        console.log("Fetching articles...");
        const response = await getallarticles(0);

        console.log("Response received:", response);

        if (response && Array.isArray(response)) {
          setArticles( response );
          
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
  }, [] );
  
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
  const updatedFavorites = favorites.includes(id)
    ? favorites.filter((favId) => favId !== id)
    : [...favorites, id];

  setFavorites(updatedFavorites);
  
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
  const handleshowingmore = async () => {
    setLoadingMore(true);

    try {
      console.log("please wait...");
      const response = await getallarticles(index);

      console.log("Response realoding :", response);

      if (response && Array.isArray(response)) {
        setArticles((prev) => [...prev, ...response]);
        setIndex((prev) => prev + 12);

        // 👇 If we got less than 12, then there's no more data
        if (response.length === 0) {
          setHasMore(false);
        }

        setAlertMessage("Articles loaded successfully!");
      } else {
        setHasMore(false); // No articles returned
        setAlertMessage("No articles found.");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setAlertMessage("Error loading articles. Please try again.");
    } finally {
      setLoadingMore(false); // 👈 Don't forget to reset this!
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
        <section className="trending-section">
          <Trends />
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
              {hasMore && (
                <button
                  className="show-more"
                  onClick={handleshowingmore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Show More"}
                </button>
              )}
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
        
        <section className="authors-section">
          <Authors />
        </section>
        <section className="suggestiontopics-section">
          <Topics />
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
