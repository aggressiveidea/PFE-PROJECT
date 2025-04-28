"use client"
import { useState } from "react"
import "./BookLibCard.css"

const BookLibCard = ({ book, onClick }) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div
      className="BookLibCard"
      onClick={() => onClick(book)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`BookLibCard-cover ${isHovered ? "BookLibCard-hovered" : ""}`}>
        {!imageError ? (
          <img src={book.coverUrl || "/placeholder.svg"} alt={book.title} onError={handleImageError} loading="lazy" />
        ) : (
          <div className="BookLibCard-placeholder">
            <div className="BookLibCard-placeholder-title">{book.title}</div>
            <div className="BookLibCard-placeholder-author">{book.author}</div>
          </div>
        )}
        <div className="BookLibCard-hover-info">
          <h4>{book.title}</h4>
          <p>{book.author}</p>
          {book.pdfUrl && <span className="BookLibCard-read-badge">Read Now</span>}
        </div>
      </div>
      <div className="BookLibCard-info">
        <h4 className="BookLibCard-title">{book.title}</h4>
        <p className="BookLibCard-author">{book.author}</p>
      </div>
    </div>
  )
}

export default BookLibCard
