"use client"
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { isItemSaved, saveItem, formatBookForLibrary } from "../../services/libraryService"
import "./BookLibShelf.css"

const BookLibShelf = ({ title, books, onBookClick, viewAllLink }) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const shelfRef = useRef(null)
  const [hoveredBook, setHoveredBook] = useState(null)
  const [savedBooks, setSavedBooks] = useState({})

  // Check which books are already saved
  useEffect(() => {
    const savedStatus = {}
    books.forEach((book) => {
      const bookId = book._id || book.id
      savedStatus[bookId] = isItemSaved(bookId, "book")
    })
    setSavedBooks(savedStatus)
  }, [books])

  const handleScroll = (direction) => {
    const shelf = shelfRef.current
    const scrollAmount = 300 // Adjust as needed

    if (direction === "left") {
      shelf.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      shelf.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Update scroll position for showing/hiding scroll buttons
  const updateScrollPosition = () => {
    if (shelfRef.current) {
      setScrollPosition(shelfRef.current.scrollLeft)
    }
  }

  useEffect(() => {
    const shelf = shelfRef.current
    if (shelf) {
      shelf.addEventListener("scroll", updateScrollPosition)
      return () => shelf.removeEventListener("scroll", updateScrollPosition)
    }
  }, [])

  const canScrollLeft = scrollPosition > 0
  const canScrollRight = shelfRef.current
    ? scrollPosition < shelfRef.current.scrollWidth - shelfRef.current.clientWidth - 10
    : false

  const handleAddToLibrary = (e, book) => {
    e.stopPropagation() // Prevent triggering the book click

    // Format the book for the library system
    const formattedBook = formatBookForLibrary(book)

    // Save the book to the library
    const saved = saveItem(formattedBook, "book")

    // Update the saved status in the UI
    const bookId = book._id || book.id
    setSavedBooks((prev) => ({
      ...prev,
      [bookId]: true,
    }))

    // Show feedback to the user
    alert(`"${book.title}" ${saved ? "has been added to" : "is already in"} your library!`)
  }

  return (
    <div className="BookLibShelf">
      <div className="BookLibShelf-header">
        <h2 className="BookLibShelf-title">
          <span className="BookLibShelf-title-dot">•</span> {title}
        </h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="BookLibShelf-view-all">
            View all →
          </Link>
        )}
      </div>

      <div className="BookLibShelf-container">
        {canScrollLeft && (
          <button
            className="BookLibShelf-scroll-button BookLibShelf-scroll-left"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        <div className="BookLibShelf-books" ref={shelfRef}>
          {books.map((book) => {
            const bookId = book._id || book.id
            const isSaved = savedBooks[bookId]

            return (
              <div
                key={bookId}
                className="BookLibShelf-book"
                onClick={() => onBookClick(book)}
                onMouseEnter={() => setHoveredBook(bookId)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                <div className="BookLibShelf-book-cover">
                  {book.coverImgUrl ? (
                    <img
                      src={book.coverImgUrl || "/placeholder.svg"}
                      alt={`${book.title} cover`}
                      onError={(e) => {
                        // If image fails to load, replace with placeholder
                        e.target.src = `https://via.placeholder.com/150x200?text=${encodeURIComponent(book.title)}`
                        e.target.onerror = null // Prevent infinite loop
                      }}
                    />
                  ) : (
                    <div className="BookLibShelf-book-placeholder">
                      <span>{book.title}</span>
                    </div>
                  )}

                  {/* Overlay with book info and add to library button */}
                  <div className={`BookLibShelf-book-overlay ${hoveredBook === bookId ? "active" : ""}`}>
                    <div className="BookLibShelf-book-overlay-content">
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                      <button
                        className={`BookLibShelf-add-library-btn ${isSaved ? "BookLibShelf-saved" : ""}`}
                        onClick={(e) => handleAddToLibrary(e, book)}
                      >
                        {isSaved ? "Saved to Library ✓" : "Add to Library +"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="BookLibShelf-book-info">
                  <h3 className="BookLibShelf-book-title">{book.title}</h3>
                  <p className="BookLibShelf-book-author">{book.author}</p>
                </div>
              </div>
            )
          })}
        </div>

        {canScrollRight && (
          <button
            className="BookLibShelf-scroll-button BookLibShelf-scroll-right"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>
    </div>
  )
}

export default BookLibShelf
