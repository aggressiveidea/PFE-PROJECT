import { useState } from "react"
import { useUserPermissions } from "../../hooks/useUserPermissions"
import BookLibAddForm from "./BookLibAddForm"

const AddBookButton = ({ onAddBook, categories }) => {
  const [showForm, setShowForm] = useState(false)
  const { canAddBooks, user, loading } = useUserPermissions()

 if(loading){
  return null
 }

  if (!canAddBooks()) {
    return null
  }

  const handleOpenForm = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleBookAdded = (newBook) => {
    onAddBook(newBook)
    setShowForm(false)
  }

  return (
    <>
      <button onClick={handleOpenForm} className="add-book-button" title={`Add Book (${user?.role})`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Book
      </button>

      {showForm && <BookLibAddForm categories={categories} onAddBook={handleBookAdded} onCancel={handleCloseForm} />}
    </>
  )
}

export default AddBookButton
