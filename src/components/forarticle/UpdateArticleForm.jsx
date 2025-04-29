"use client"

import { useState, useEffect } from "react"
import "./update-article-form.css"

export default function UpdateArticleForm({ article, onUpdate, onClose }) {
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    category: "",
    language: "English",
    content: "",
    imageUrl: null,
  })

  const [previewImage, setPreviewImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const categories = [
    "All Categories",
    "Contrats informatiques",
    "Criminalité informatique",
    "Données personnelles",
    "Organisations",
    "Propriété intellectuelle",
    "Réseaux",
    "Commerce électronique",
  ]

  const languages = ["All Languages", "English", "French", "Arabic"]

  useEffect(() => {
    if (article) {
      setFormData({
        _id: article._id || "",
        title: article.title || "",
        category: article.category || "",
        language: article.language || "English",
        content: article.content || "",
        imageUrl: article.imageUrl || null,
      })

      if (article.imageUrl) {
        setPreviewImage(article.imageUrl)
      }
    }
  }, [article])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((f) => ({ ...f, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((f) => ({
        ...f,
        imageUrl: reader.result,
      }))
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      await onUpdate(formData)
      onClose()
    } catch (err) {
      console.error(err)
      setError("Erreur lors de la mise à jour de l'article.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="update-article-overlay">
      <div className="update-article-form-container">
        <div className="update-article-header">
          <h2>Modifier l'article</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="update-article-form" onSubmit={handleSubmit}>
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
                    <img src={previewImage || "/placeholder.svg"} alt="Aperçu" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => {
                        setPreviewImage(null)
                        setFormData((f) => ({ ...f, imageUrl: null }))
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

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </button>
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? "submitting" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading-spinner"></span> : <span>Mettre à jour</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
