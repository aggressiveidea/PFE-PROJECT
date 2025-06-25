import { useState, useRef } from "react"
import "./BookLibAddForm.css"
import { createNewBook } from "../../services/Api"

const BookLibAddForm = ({ categories, onAddBook, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    coverImgUrl: "",
    description: "",
    tags: "",
    pages: "",
    publishedYear: "",
    level: "Beginner",
    pdfLink: "",
  })

  const [coverImageFile, setCoverImageFile] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTag, setSelectedTag] = useState("")
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "pages" || name === "publishedYear" ? Number.parseInt(value) || "" : value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        coverImgUrl: "Please select a valid image file (JPEG, PNG, GIF, WEBP)",
      })
      return
    }

    if (errors.coverImgUrl) {
      const { coverImgUrl, ...restErrors } = errors
      setErrors(restErrors)
    }

    setCoverImageFile(file)
    const previewUrl = URL.createObjectURL(file)
    setCoverImagePreview(previewUrl)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.author) newErrors.author = "Author is required"
    if (!coverImageFile && !coverImagePreview) newErrors.coverImgUrl = "Cover image is required"
    if (!formData.pdfLink) newErrors.pdfLink = "PDF link is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.tags) newErrors.tags = "Tag is required"
    if (!formData.pages) newErrors.pages = "Number of pages is required"
    if (!formData.publishedYear) newErrors.publishedYear = "Published year is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      try {
        console.log("Preparing to submit book data...")

        const bookFormData = new FormData()

        Object.keys(formData).forEach((key) => {
          if (key !== "coverImgUrl") {
            bookFormData.append(key, formData[key])
          }
        })

        if (coverImageFile) {
          bookFormData.append("coverImage", coverImageFile)
          console.log("Added cover image to form data:", coverImageFile.name)
        }

        console.log("Submitting book data to API...")

        const response = await createNewBook(bookFormData)
        console.log("API response for book creation:", response)

        if (response && response.data) {
          const bookWithPreview = {
            ...response.data,
            coverImgUrl: response.data.coverImgUrl || coverImagePreview,
          }
          onAddBook(bookWithPreview)

          setFormData({
            title: "",
            author: "",
            coverImgUrl: "",
            description: "",
            tags: "",
            pages: "",
            publishedYear: "",
            level: "Beginner",
            pdfLink: "",
          })
          setCoverImageFile(null)
          setCoverImagePreview(null)

          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        } else {
          throw new Error("Invalid response from server")
        }
      } catch (error) {
        console.error("Error creating book:", error)
        alert("Failed to create book. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleSelectImage = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="BookLibAddForm">
      <div className="BookLibAddForm-container">
        <h2 className="BookLibAddForm-title">Add New Book</h2>

        <form onSubmit={handleSubmit} className="BookLibAddForm-form" encType="multipart/form-data">
          <div className="BookLibAddForm-field">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "BookLibAddForm-input-error" : ""}
            />
            {errors.title && <span className="BookLibAddForm-error">{errors.title}</span>}
          </div>

          <div className="BookLibAddForm-field">
            <label htmlFor="author">Author*</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? "BookLibAddForm-input-error" : ""}
            />
            {errors.author && <span className="BookLibAddForm-error">{errors.author}</span>}
          </div>

          <div className="BookLibAddForm-field">
            <label htmlFor="coverImage">Cover Image*</label>
            <div className="BookLibAddForm-image-upload">
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <div
                className={`BookLibAddForm-image-preview ${errors.coverImgUrl ? "BookLibAddForm-input-error" : ""}`}
                onClick={handleSelectImage}
              >
                {coverImagePreview ? (
                  <img src={coverImagePreview || "/placeholder.svg"} alt="Book cover preview" />
                ) : (
                  <div className="BookLibAddForm-image-placeholder">
                    <span>Click to select image</span>
                  </div>
                )}
              </div>
              <button type="button" className="BookLibAddForm-image-button" onClick={handleSelectImage}>
                {coverImagePreview ? "Change Image" : "Upload Cover Image"}
              </button>
            </div>
            {errors.coverImgUrl && <span className="BookLibAddForm-error">{errors.coverImgUrl}</span>}
          </div>

          <div className="BookLibAddForm-field">
            <label htmlFor="pdfLink">PDF URL or Link to Read*</label>
            <input
              type="text"
              id="pdfLink"
              name="pdfLink"
              value={formData.pdfLink}
              onChange={handleChange}
              placeholder="https://example.com/book.pdf"
              className={errors.pdfLink ? "BookLibAddForm-input-error" : ""}
            />
            {errors.pdfLink && <span className="BookLibAddForm-error">{errors.pdfLink}</span>}
            <small className="BookLibAddForm-hint">
              Provide a direct link to the PDF or a website where the book can be read
            </small>
          </div>

          <div className="BookLibAddForm-field">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={errors.description ? "BookLibAddForm-input-error" : ""}
            ></textarea>
            {errors.description && <span className="BookLibAddForm-error">{errors.description}</span>}
          </div>

          <div className="BookLibAddForm-field">
            <label htmlFor="tags">Tag*</label>
            <select
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className={errors.tags ? "BookLibAddForm-input-error" : ""}
            >
              <option value="">Select a tag</option>
              <option value="Personal Data">Personal Data</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Networks">Networks</option>
              <option value="Computer Crime">Computer Crime</option>
              <option value="Miscellaneous">Miscellaneous</option>
              <option value="Intellectual Property">Intellectual Property</option>
              <option value="Organizations">Organizations</option>
              <option value="IT Contract">IT Contract</option>
            </select>
            {errors.tags && <span className="BookLibAddForm-error">{errors.tags}</span>}
          </div>

          <div className="BookLibAddForm-row">
            <div className="BookLibAddForm-field">
              <label htmlFor="pages">Pages*</label>
              <input
                type="number"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                min="1"
                className={errors.pages ? "BookLibAddForm-input-error" : ""}
              />
              {errors.pages && <span className="BookLibAddForm-error">{errors.pages}</span>}
            </div>

            <div className="BookLibAddForm-field">
              <label htmlFor="publishedYear">Published Year*</label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                min="1800"
                max={new Date().getFullYear()}
                className={errors.publishedYear ? "BookLibAddForm-input-error" : ""}
              />
              {errors.publishedYear && <span className="BookLibAddForm-error">{errors.publishedYear}</span>}
            </div>
          </div>

          <div className="BookLibAddForm-field">
            <label htmlFor="level">Level</label>
            <select id="level" name="level" value={formData.level} onChange={handleChange}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Beginner To Intermediate">Beginner to Intermediate</option>
              <option value="Intermediate To Advanced">Intermediate to Advanced</option>
              <option value="Beginner To Advanced">Beginner to Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>

          <div className="BookLibAddForm-actions">
            <button type="button" onClick={onCancel} className="BookLibAddForm-cancel">
              Cancel
            </button>
            <button type="submit" className="BookLibAddForm-submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookLibAddForm
