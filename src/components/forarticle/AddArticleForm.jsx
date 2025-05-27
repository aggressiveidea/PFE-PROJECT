import { useState, useEffect } from "react"
import "./add-article-form.css"
import { addArticle } from "../../services/Api"

export default function AddArticleForm({ setArticles }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    language: "English",
    content: "",
    imageUrl: null,
  })

  const [previewImage, setPreviewImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState(null)

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
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"))
      if (storedUser && storedUser._id) {
        setUserId(storedUser._id)
      } else {
        setError("you gotta be connected to add an article")
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e)
      setError("Error getting the user")
    }
  }, [])

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

    if (!userId) {
      setError("you have to be connected to add the article ")
      setIsSubmitting(false)
      return
    }

    const articleData = {
      title: formData.title,
      category: formData.category,
      language: formData.language,
      content: formData.content,
      ownerId: userId,
      verified: false,
    }

    if (formData.imageUrl) {
      articleData.imageUrl = formData.imageUrl
    }

    try {
      const createdArticle = await addArticle(articleData)

      // 1. Update React state
      setArticles((prev) => [...prev, createdArticle])

      // 2. Update localStorage
      const storedArticles = JSON.parse(localStorage.getItem("articles")) || []
      storedArticles.push(createdArticle)
      localStorage.setItem("articles", JSON.stringify(storedArticles))

      // 3. Reset & feedback
      setShowSuccess(true)
      setFormData({
        title: "",
        category: "",
        language: "English",
        content: "",
        imageUrl: "",
      })
      setPreviewImage(null)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error(err)
      setError("Error adding the article")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="quiz-add-article-container">
      {showSuccess ? (
        <div className="quiz-success-message">
          <div className="quiz-success-icon">✓</div>
          <h3>Article has been added successfully!</h3>
          <p>Merci for your contribution this will be analysed by our administrators</p>
        </div>
      ) : (
        <form className="quiz-add-article-form" onSubmit={handleSubmit}>
          {error && <p className="quiz-error-message">{error}</p>}

          <div className="quiz-form-group">
            <label htmlFor="title">Article's title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Entrez un titre descriptif"
              required
              className="quiz-form-input"
            />
          </div>

          <div className="quiz-form-row">
            <div className="quiz-form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="quiz-form-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="quiz-form-group">
              <label htmlFor="language">priciple language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="quiz-form-select"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="quiz-form-group">
            <label htmlFor="content">Description</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Fournissez un résumé de votre article"
              required
              className="quiz-form-textarea"
              rows={4}
            ></textarea>
          </div>

          <div className="quiz-form-group">
            <label htmlFor="image">Image (optionel)</label>
            <div className="quiz-image-upload-container">
              <div className="quiz-image-upload-area">
                {previewImage ? (
                  <div className="quiz-image-preview">
                    <img src={previewImage || "/placeholder.svg"} alt="Aperçu" />
                    <button
                      type="button"
                      className="quiz-remove-image-btn"
                      onClick={() => {
                        setPreviewImage(null)
                        setFormData((f) => ({ ...f }))
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <p>Drag an image or click to browse</p>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="quiz-file-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`quiz-submit-button ${isSubmitting ? "quiz-submitting" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="quiz-loading-spinner"></span> : <span>Submit Article</span>}
          </button>
        </form>
      )}
    </div>
  )
}
