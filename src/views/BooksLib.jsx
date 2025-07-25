import { useState, useEffect } from "react"
import Footer from "../components/forHome/Footer"
import BookLibShelf from "../components/forBooks/BookLibShelf"
import BookLibDetail from "../components/forBooks/BookLibDetail"
import BookLibSearch from "../components/forBooks/BookLibSearch"
import BookLibAddForm from "../components/forBooks/BookLibAddForm"
import Sidebar from "../components/forDashboard/Sidebar"
import { getBooks } from "../services/Api"
import { useUserPermissions } from "../hooks/useUserPermissions"
import "./BooksLib.css"

const BooksLib = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [searchParams, setSearchParams] = useState({
    searchTerm: "",
    category: "all",
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const { canAddBooks, user, loading: permissionLoading } = useUserPermissions()

  const [booksData, setBooksData] = useState({
    featured: [],
    popular: [],
    new: [],
  })

  const [filteredBooks, setFilteredBooks] = useState({
    featured: [],
    popular: [],
    new: [],
  })

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

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log("Fetching books from API...")
        const response = await getBooks()
        console.log("API response:", response)

        if (response && response.data) {
          const books = response.data
          console.log("Books data:", books)

          const categorizedBooks = {
            featured: books.slice(0, 5),
            popular: books.slice(5, 10),
            new: books.slice(10),
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

  useEffect(() => {
    setFilteredBooks(booksData)
  }, [booksData])

  useEffect(() => {
    if (darkMode === false) {
      document.body.classList.remove("BookLib-body-dark-mode")
      document.documentElement.style.setProperty("--sidebar-z-index", "50")

      const appHeader = document.querySelector("header")
      if (appHeader) {
        appHeader.classList.remove("BookLib-dark-header")
      }
    } else {
      document.body.classList.add("BookLib-body-dark-mode")
      document.documentElement.style.setProperty("--sidebar-z-index", "50")

      const appHeader = document.querySelector("header")
      if (appHeader) {
        appHeader.classList.add("BookLib-dark-header")
      }
    }

    return () => {
      document.body.classList.remove("BookLib-body-dark-mode")
      const appHeader = document.querySelector("header")
      if (appHeader) {
        appHeader.classList.remove("BookLib-dark-header")
      }
    }
  }, [darkMode])

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
      window.open(book.pdfLink, "_blank")
    } else {
      setSelectedBook(book)
    }
  }

  const handleCloseBookDetail = () => {
    setSelectedBook(null)
  }

  const handleAddToLibrary = (book) => {
    try {
      const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]")

      const isAlreadySaved = savedBooks.some((savedBook) => savedBook.id === book._id || savedBook.id === book.id)

      if (isAlreadySaved) {
        alert(`"${book.title}" is already in your digital library!`)
        return
      }

      const bookData = {
        id: book._id || book.id || Date.now().toString(),
        title: book.title || "Untitled Book",
        author: book.author || "Unknown Author",
        description: book.description || "No description available",
        coverImgUrl: book.coverImgUrl || book.coverImgPreview || "/placeholder.svg?height=300&width=200",
        pdfLink: book.pdfLink || null,
        tags: book.tags || "Uncategorized",
        category: book.category || book.tags || "General",
        publishedDate: book.publishedDate || book.createdAt || new Date().toISOString(),
        pages: book.pages || 0,
        language: book.language || "English",
        isbn: book.isbn || null,
        publisher: book.publisher || "Unknown Publisher",
        rating: book.rating || 0,
        downloadCount: book.downloadCount || 0,
        fileSize: book.fileSize || "Unknown",
        addedToLibraryAt: new Date().toISOString(),
        source: "digital_library",
      }

      const updatedSavedBooks = [...savedBooks, bookData]

      localStorage.setItem("savedBooks", JSON.stringify(updatedSavedBooks))

      alert(`"${book.title}" has been added to your digital library!`)

      console.log("Book saved to digital library:", bookData)
    } catch (error) {
      console.error("Error saving book to digital library:", error)
      alert("Failed to add book to your library. Please try again.")
    }
  }

  const handleReadNow = (book) => {
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

      setBooksData((prevData) => ({
        ...prevData,
        new: [
          {
            ...newBook,
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

   
  const handleOpenAddForm = () => {
    if (canAddBooks()) {
      setShowAddForm(true)
    } else {
      alert("You don't have permission to add books. Only Content Admins and ICT Experts can add books.")
    }
  }

  return (
    <div className={`BookLib-page ${darkMode ? "BookLib-dark-mode" : ""}`}>
      
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
          
          <div className="bookslib-welcome-section">
            <div className="bookslib-welcome-content">
              <div className="bookslib-welcome-badge">
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
                  <path d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>ICT Digital Library</span>
              </div>
              <h1 className="bookslib-welcome-title">
                Digital Knowledge Hub
                <span className="bookslib-code-accent">{"<library/>"}</span>
              </h1>
              <p className="bookslib-welcome-subtitle">
                Explore our comprehensive collection of ICT books, research papers, and technical documentation.
              </p>

              
              <div className="bookslib-code-snippet">
                <div className="bookslib-code-header">
                  <div className="bookslib-code-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="bookslib-code-title">digital-library.js</span>
                </div>
                <div className="bookslib-code-content">
                  <span className="bookslib-code-line">
                    <span className="bookslib-code-function">library</span>
                    <span className="bookslib-code-punctuation">.</span>
                    <span className="bookslib-code-function">searchBooks</span>
                    <span className="bookslib-code-punctuation">(</span>
                    <span className="bookslib-code-string">"{searchParams.searchTerm || "technology"}"</span>
                    <span className="bookslib-code-punctuation">);</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bookslib-welcome-stats">
              <div className="bookslib-date-info">
                <div className="bookslib-date-item">
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="bookslib-date-item">
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>
                    {new Date().toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            
            <div className="bookslib-tech-bg">
              <div className="bookslib-circuit-pattern"></div>
              <div className="bookslib-floating-icons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="bookslib-floating-icon"
                >
                  <path d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="bookslib-floating-icon"
                >
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="bookslib-floating-icon"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            </div>
          </div>

          <div className="BookLib-actions">
            <BookLibSearch onSearch={handleSearch} categories={categories} />

            
            {!permissionLoading && canAddBooks() && (
              <button className="BookLib-add-button" onClick={handleOpenAddForm} title={`Add New Book (${user?.role})`}>
                <span className="BookLib-add-icon">+</span>
                Add New Book
              </button>
            )}

            
            {process.env.NODE_ENV === "development" && (
              <div
                style={{
                  background: darkMode ? "#2d2d3a" : "#f0f0f0",
                  color: darkMode ? "#fff" : "#333",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "4px",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                }}
              >
                <strong>Debug Info:</strong>
                <br />
                User: {user?.firstName} {user?.lastName}
                <br />
                Role: {user?.role}
                <br />
                Can Add Books: {canAddBooks() ? "Yes" : "No"}
                <br />
                Permission Loading: {permissionLoading ? "Yes" : "No"}
              </div>
            )}
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
