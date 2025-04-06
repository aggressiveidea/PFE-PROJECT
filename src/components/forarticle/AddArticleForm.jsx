"use client";

import { useState, useEffect } from "react";
import "./add-article-form.css";
import { addArticle } from "../../services/Api";

export default function AddArticleForm({ setArticles }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    language: "English",
    content: "",
    imageUrl: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  const categories = [
    "All Categories",
    "Contrats informatiques",
    "Criminalité informatique",
    "Données personnelles",
    "Organisations",
    "Propriété intellectuelle",
    "Réseaux",
    "Commerce électronique",
  ];

  const languages = ["All Languages", "English", "French", "Arabic"];

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.id) {
        setUserId(storedUser.id);
      } else {
        setError("Vous devez être connecté pour ajouter un article.");
      }
    } catch (e) {
      console.error("Invalid user in localStorage", e);
      setError("Erreur de récupération de l'utilisateur.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setFormData((f) => ({
      ...f,
      imageUrl: reader.result, // ✅ base64 ici
    }));
    setPreviewImage(reader.result);
  };
  reader.readAsDataURL(file); // ⬅️ encodage
};


  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    setIsSubmitting( true );
    setError( "" );

    if ( !userId )
    {
      setError( "Vous devez être connecté pour soumettre un article." );
      setIsSubmitting( false );
      return;
    }

    const articleData = {
      title: formData.title,
      category: formData.category,
      language: formData.language,
      content: formData.content,
      ownerId: userId,
      imageUrl: formData.imageUrl || null, 
    };

    try
    {
      const createdArticle = await addArticle( articleData ); 
      setArticles( ( prev ) => [ ...prev, createdArticle ] );
      setShowSuccess( true );
      setFormData({
        title: "",
        category: "",
        language: "English",
        content: "",
        imageUrl: null,
      });
      setPreviewImage( null );
      setTimeout( () => setShowSuccess( false ), 3000 );
    } catch ( err )
    {
      console.error( err );
      setError( "Erreur lors de l'ajout de l'article." );
    } finally
    {
      setIsSubmitting( false );
    }
  };  

  return (
    <div className="add-article-form-container">
      {showSuccess ? (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h3>Article ajouté avec succès !</h3>
          <p>
            Merci pour votre contribution. Il sera examiné par notre équipe.
          </p>
        </div>
      ) : (
        <form className="add-article-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="title">Titre de l'article</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Entrez un titre descriptif"
              required
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="language">Langue principale</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="form-select"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Description</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Fournissez un résumé de votre article"
              required
              className="form-textarea"
              rows={4}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image (optionnelle)</label>
            <div className="image-upload-container">
              <div className="image-upload-area">
                {previewImage ? (
                  <div className="image-preview">
                    <img src={previewImage} alt="Aperçu" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData((f) => ({ ...f, imageUrl: null }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <p>Glissez une image ou cliquez pour parcourir</p>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="file-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`submit-button ${isSubmitting ? "submitting" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading-spinner"></span>
            ) : (
              <span>Soumettre l'article</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
