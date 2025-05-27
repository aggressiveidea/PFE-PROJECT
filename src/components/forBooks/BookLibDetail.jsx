"use client"
import { useState } from "react"
import "./BookLibDetail.css"
import { saveItem, formatBookForLibrary } from "../../services/libraryService"

const BookLibDetail = ({ book, onClose, onAddToLibrary, onReadNow }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const handleAddToLibrary = () => {
    setIsLoading(true)

    try {
      const formattedBook = formatBookForLibrary(book)
      const saved = saveItem(formattedBook, "BOOK")
      setSaveMessage(saved ? "Added to your library!" : "Already in your library")

      if (onAddToLibrary) {
        onAddToLibrary(book)
      }
    } catch (error) {
      console.error("Error saving book:", error)
      setSaveMessage("Error saving book")
    } finally {
      setIsLoading(false)

      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    }
  }

  return (
    <div className="BookLibDetail-overlay" onClick={onClose}>
      <div className="BookLibDetail-content" onClick={(e) => e.stopPropagation()}>
        <button className="BookLibDetail-close" onClick={onClose}>
          ×
        </button>

        <div className="BookLibDetail-grid">
          <div className="BookLibDetail-cover">
            {book.coverImgUrl ? (
              <img
                src={book.coverImgUrl || "/placeholder.svg"}
                alt={`${book.title} cover`}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(book.title)}`
                }}
              />
            ) : (
              <div className="BookLibDetail-placeholder">
                <span>{book.title}</span>
              </div>
            )}
          </div>

          <div className="BookLibDetail-info">
            <h2 className="BookLibDetail-title">{book.title}</h2>
            <p className="BookLibDetail-author">by {book.author}</p>

            {book.tags && (
              <div className="BookLibDetail-tags">
                <span className="BookLibDetail-tag">{book.tags}</span>
              </div>
            )}

            <div className="BookLibDetail-meta">
              {book.publishedYear && (
                <div className="BookLibDetail-meta-item">
                  <span className="BookLibDetail-meta-label">Published:</span>
                  <span className="BookLibDetail-meta-value">{book.publishedYear}</span>
                </div>
              )}

              {book.pages && (
                <div className="BookLibDetail-meta-item">
                  <span className="BookLibDetail-meta-label">Pages:</span>
                  <span className="BookLibDetail-meta-value">{book.pages}</span>
                </div>
              )}

              {book.level && (
                <div className="BookLibDetail-meta-item">
                  <span className="BookLibDetail-meta-label">Level:</span>
                  <span className="BookLibDetail-meta-value">{book.level}</span>
                </div>
              )}
            </div>

            {book.description && (
              <div className="BookLibDetail-description">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            {saveMessage && <div className="BookLibDetail-save-message">{saveMessage}</div>}

            <div className="BookLibDetail-actions">
              <button
                className="BookLibDetail-action-button BookLibDetail-add-button"
                onClick={handleAddToLibrary}
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add to Library +"}
              </button>

              {book.pdfLink && (
                <button
                  className="BookLibDetail-action-button BookLibDetail-read-button"
                  onClick={() => onReadNow(book)}
                >
                  Read Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookLibDetail

