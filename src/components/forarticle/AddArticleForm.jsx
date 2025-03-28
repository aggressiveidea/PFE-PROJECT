"use client";

import { useState } from "react";
import "./add-article-form.css";
import { addArticle } from "../../services/Api";

export default function AddArticleForm({ user, setArticles }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    language: "",
    content: "",
    imageUrl: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

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

  // Gestion des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gestion de l'image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    console.log(user)
    if (!user || !user._id) {
      setError("Vous devez être connecté pour ajouter un article.");
      setIsSubmitting(false);
      return;
    }

    const articleData = new FormData();
    articleData.append("title", formData.title);
    articleData.append("category", formData.category);
    articleData.append("description", formData.description);
    articleData.append("language", formData.language);
    articleData.append("author", user._id); // Vérifiez bien que _id est correct

    if (formData.image) {
      articleData.append("image", formData.image);
    }

    try {
      const createdArticle = await addArticle(articleData);

      setArticles((prevArticles) => [...prevArticles, createdArticle]);

      setShowSuccess(true);

      setTimeout(() => {
        setFormData({
          title: "",
          category: "",
          description: "",
          language: "English",
          image: null,
        });
        setPreviewImage(null);
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      setError("Erreur lors de l'ajout de l'article");
      console.error("Erreur API:", error);
    } finally {
      setIsSubmitting(false);
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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Fournissez un résumé de votre article"
              required
              className="form-textarea"
              rows={4}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
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
                        setFormData({ ...formData, image: null });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <p>Glissez une image ou cliquez pour parcourir</p>
                  </>
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
