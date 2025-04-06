"use client";

import { useState, useEffect } from "react";
import "./update-article-form.css";

export default function UpdateArticleForm({ article, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    language: "English",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        category: article.category || "",
        content: article.content || "",
        language: article.languages?.[0] || "English",
        image: null,
      } );

      // If article has an image, set it as preview
      if (article.image) {
        setPreviewImage(article.image);
      }
    }
  }, [article]);

  const categories = [
    "Contrats informatiques",
    "Criminalité informatique",
    "Données personnelles",
    "Organisations",
    "Propriété intellectuelle",
    "Réseaux",
    "Commerce électronique",
  ];

  const languages = ["All Languages", "English", "French", "Arabic"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create updated article object
    const updatedArticle = {
      ...article,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      languages: [formData.language],
      image: previewImage || article.image,
    };

    // Simulate API call
    setTimeout(() => {
      onUpdate(updatedArticle);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="update-form-overlay" onClick={onClose}>
      <div
        className="update-form-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-update-form" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-primary-purple">
          Update Article
        </h2>

        <form className="add-article-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Article Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title"
              required
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
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
              <label htmlFor="language">Primary Language</label>
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
            <label htmlFor="description">Article Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a brief summary of your article"
              required
              className="form-textarea"
              rows={4}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="image">Featured Image</label>
            <div className="image-upload-container">
              <div className="image-upload-area">
                {previewImage ? (
                  <div className="image-preview">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Preview"
                    />
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
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p>Drag and drop an image or click to browse</p>
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
              "Update Article"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
