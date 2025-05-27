
const STORAGE_KEYS = {
    SAVED_BOOKS: "saved_books",
    SAVED_ARTICLES: "saved_articles",
    SAVED_TERMS: "saved_terms",
  }

  const initializeStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_BOOKS)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_BOOKS, JSON.stringify([]))
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_ARTICLES)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify([]))
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_TERMS)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_TERMS, JSON.stringify([]))
    }
  }

  export const getSavedItems = (type) => {
    initializeStorage()
    const key = STORAGE_KEYS[`SAVED_${type.toUpperCase()}S`]
    try {
      return JSON.parse(localStorage.getItem(key)) || []
    } catch (error) {
      console.error(`Error getting saved ${type}s:`, error)
      return []
    }
  }

  export const saveItem = (item, type) => {
    initializeStorage()
    const key = STORAGE_KEYS[`SAVED_${type.toUpperCase()}S`]
    try {
      const savedItems = getSavedItems(type)

      const exists = savedItems.some((savedItem) => savedItem.id === item.id)
  
      if (!exists) {

        const itemToSave = {
          ...item,
          savedAt: new Date().toISOString(),
          isFavorite: true,
        }
  
        const updatedItems = [...savedItems, itemToSave]
        localStorage.setItem(key, JSON.stringify(updatedItems))
        return true
      }
      return false
    } catch (error) {
      console.error(`Error saving ${type}:`, error)
      return false
    }
  }

  export const removeSavedItem = (itemId, type) => {
    initializeStorage()
    const key = STORAGE_KEYS[`SAVED_${type.toUpperCase()}S`]
    try {
      const savedItems = getSavedItems(type)
      const updatedItems = savedItems.filter((item) => item.id !== itemId)
      localStorage.setItem(key, JSON.stringify(updatedItems))
      return true
    } catch (error) {
      console.error(`Error removing saved ${type}:`, error)
      return false
    }
  }

  export const isItemSaved = (itemId, type) => {
    const savedItems = getSavedItems(type)
    return savedItems.some((item) => item.id === itemId)
  }

  export const formatBookForLibrary = (book) => {
    return {
      id: book._id || book.id || `book-${Date.now()}`,
      title: book.title,
      author: book.author,
      description: {
        en: book.description || "",
        fr: book.description || "",
        ar: book.description || "",
      },
      category: book.tags?.toLowerCase() || "programming",
      languages: ["en", "fr", "ar"],
      datePublished: book.publishedYear ? `${book.publishedYear}-01-01` : new Date().toISOString().split("T")[0],
      isFavorite: true,
      coverImage: book.coverImgUrl,
      isbn: book.isbn || `ISBN-${Date.now()}`,
      pages: book.pages || 0,
      pdfLink: book.pdfLink || "",
      level: book.level || "Beginner",
    }
  }
  