"use client"

import { useState, useEffect } from "react"
import Footer from "../components/forHome/Footer"
import BookLibShelf from "../components/forBooks/BookLibShelf"
import BookLibDetail from "../components/forBooks/BookLibDetail"
import BookLibSearch from "../components/forBooks/BookLibSearch"
import BookLibAddForm from "../components/forBooks/BookLibAddForm"
import Sidebar from "../components/forDashboard/Sidebar"
import { getBooks } from "../services/Api"
import "./BooksLib.css"

const BooksLib = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [searchParams, setSearchParams] = useState({ searchTerm: "", category: "all" })
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for books data from API
  const [booksData, setBooksData] = useState({
    featured: [],
    popular: [],
    new: [],
  })

  // State for filtered books
  const [filteredBooks, setFilteredBooks] = useState({
    featured: [],
    popular: [],
    new: [],
  })

  // Sample categories
  const categories = [
    { id: "programming", name: "Programming" },
    { id: "cybersecurity", name: "Cybersecurity" },
    { id: "networking", name: "Networking" },
    { id: "blockchain", name: "Blockchain & Cryptocurrency" },
    { id: "ai", name: "Artificial Intelligence" },
    { id: "quantum", name: "Quantum Computing" },
    { id: "operating-systems", name: "Operating Systems" },
    { id: "databases", name: "Databases" },
    { id: "web-development", name: "Web Development" },
  ]

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log("Fetching books from API...")
        const response = await getBooks()
        console.log("API response:", response)

        if (response && response.data) {
          // Process the books data
          const books = response.data
          console.log("Books data:", books)

          // Organize books into categories
          // This is a simple categorization - you might want to adjust based on your actual data
          const categorizedBooks = {
            featured: books.slice(0, 5), // First 5 books as featured
            popular: books.slice(5, 10), // Next 5 as popular
            new: books.slice(10), // Rest as new
          }

          console.log("Categorized books:", categorizedBooks)
          setBooksData(categorizedBooks)
        } else {
          console.error("Invalid response format:", response)
          setError("Failed to load books. Invalid response format.")
        }
      } catch (error) {
        console.error("Error fetching books:", error)
        setError("Failed to load books. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Initialize with filtered books
  useEffect(() => {
    setFilteredBooks(booksData)
  }, [booksData])

  // Apply dark mode to the entire document and header
  useEffect(() => {
    // Force light mode initially
    if (darkMode === false) {
      document.body.classList.remove("BookLib-body-dark-mode")
      document.documentElement.style.setProperty("--sidebar-z-index", "50")

      // Remove dark mode from header
      const appHeader = document.querySelector("header")
      if (appHeader) {
        appHeader.classList.remove("BookLib-dark-header")
      }
    } else {
      document.body.classList.add("BookLib-body-dark-mode")
      document.documentElement.style.setProperty("--sidebar-z-index", "50")

      // Find and update the header from the parent application if it exists
      const appHeader = document.querySelector("header")
      if (appHeader) {
        appHeader.classList.add("BookLib-dark-header")
      }
    }

    // Cleanup function
    return () => {
      document.body.classList.remove("BookLib-body-dark-mode")
      const appHeader = document.querySelector("header")
      if (appHeader) {
        appHeader.classList.remove("BookLib-dark-header")
      }
    }
  }, [darkMode])

  // Filter books based on search parameters
  useEffect(() => {
    if (searchParams.searchTerm === "" && searchParams.category === "all") {
      setFilteredBooks(booksData)
      return
    }

    const filterBook = (book) => {
      const matchesSearchTerm =
        searchParams.searchTerm === "" ||
        book.title?.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchParams.searchTerm.toLowerCase())

      const matchesCategory =
        searchParams.category === "all" ||
        book.tags?.toLowerCase() === searchParams.category.toLowerCase() ||
        categories.find((cat) => cat.id === searchParams.category)?.name.toLowerCase() === book.tags?.toLowerCase()

      return matchesSearchTerm && matchesCategory
    }

    const filtered = {
      featured: booksData.featured.filter(filterBook),
      popular: booksData.popular.filter(filterBook),
      new: booksData.new.filter(filterBook),
    }

    setFilteredBooks(filtered)
  }, [searchParams, booksData, categories])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleBookClick = (book) => {
    if (book.pdfLink) {
      // If the book has a PDF URL, open it in a new tab
      window.open(book.pdfLink, "_blank")
    } else {
      // Otherwise, show the book details
      setSelectedBook(book)
    }
  }

  const handleCloseBookDetail = () => {
    setSelectedBook(null)
  }

  const handleAddToLibrary = (book) => {
    // Implementation for adding book to user's library
    alert(`Added "${book.title}" to your library!`)
  }

  const handleReadNow = (book) => {
    // Implementation for reading the book - open the PDF URL
    if (book.pdfLink) {
      window.open(book.pdfLink, "_blank")
    } else {
      alert("No PDF link available for this book.")
    }
  }

  const handleSearch = (params) => {
    setSearchParams(params)
  }

  const handleAddBook = async (newBook) => {
    try {
      console.log("Adding new book:", newBook)

      // The API call is now handled in the BookLibAddForm component
      // Here we just need to update our local state with the book data
      // including the image preview for the UI

      // Add the new book to the "new" category
      setBooksData((prevData) => ({
        ...prevData,
        new: [
          {
            ...newBook,
            // Use the preview URL for display in the UI if available
            coverImgUrl: newBook.coverImgPreview || newBook.coverImgUrl,
          },
          ...prevData.new,
        ],
      }))

      setShowAddForm(false)
      alert(`"${newBook.title}" has been added to the library!`)
    } catch (error) {
      console.error("Error adding book:", error)
      alert("Failed to add book. Please try again.")
    }
  }

  return (
    <div className={`BookLib-page ${darkMode ? "BookLib-dark-mode" : ""}`}>
      {/* Custom header that will properly toggle with dark mode */}
      <div className={`BookLib-custom-header ${darkMode ? "BookLib-dark-header" : ""}`}>
        <div className="BookLib-logo">
          <h1>ICT Digital Library</h1>
        </div>
        <div className="BookLib-header-actions">
          <button
            className="BookLib-dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Integrate Sidebar component */}
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        closeMobileMenu={closeMobileMenu}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className={`BookLib-main ${collapsed ? "BookLib-main-expanded" : ""}`}>
        <div className="BookLib-content">
          <div className="BookLib-header">
            <h1>ICT Digital Library</h1>
            <p>Explore our collection of technology and computer science books</p>
          </div>

          <div className="BookLib-actions">
            <BookLibSearch onSearch={handleSearch} categories={categories} />
            <button className="BookLib-add-button" onClick={() => setShowAddForm(true)}>
              <span className="BookLib-add-icon">+</span>
              Add New Book
            </button>
          </div>

          {isLoading ? (
            <div className="BookLib-loading">
              <p>Loading books...</p>
            </div>
          ) : error ? (
            <div className="BookLib-error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="BookLib-retry-button">
                Retry
              </button>
            </div>
          ) : (
            <div className="BookLib-shelves">
              {filteredBooks.featured.length > 0 && (
                <BookLibShelf
                  title="Featured ICT Books"
                  books={filteredBooks.featured}
                  onBookClick={handleBookClick}
                  viewAllLink="/bookslib/featured"
                />
              )}

              {filteredBooks.popular.length > 0 && (
                <BookLibShelf
                  title="Popular in Computer Science"
                  books={filteredBooks.popular}
                  onBookClick={handleBookClick}
                  viewAllLink="/bookslib/popular"
                />
              )}

              {filteredBooks.new.length > 0 && (
                <BookLibShelf
                  title="New Additions"
                  books={filteredBooks.new}
                  onBookClick={handleBookClick}
                  viewAllLink="/bookslib/new"
                />
              )}

              {Object.values(filteredBooks).every((shelf) => shelf.length === 0) && (
                <div className="BookLib-no-results">
                  <h3>No books found matching your search criteria</h3>
                  <p>Try adjusting your search terms or category filter</p>
                  <button
                    onClick={() => setSearchParams({ searchTerm: "", category: "all" })}
                    className="BookLib-reset-search"
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedBook && (
            <BookLibDetail
              book={selectedBook}
              onClose={handleCloseBookDetail}
              onAddToLibrary={handleAddToLibrary}
              onReadNow={handleReadNow}
            />
          )}

          {showAddForm && (
            <BookLibAddForm
              categories={categories}
              onAddBook={handleAddBook}
              onCancel={() => setShowAddForm(false)}
              className={darkMode ? "BookLibAddForm-dark" : ""}
            />
          )}
        </div>

        <Footer darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </div>
  )
}

export default BooksLib

