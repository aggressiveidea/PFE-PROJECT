"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create a context for theme
const ThemeContext = createContext()

// Theme provider component
export function ThemeProvider({ children }) {
  // Initialize darkMode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(false)

  // Load the saved preference from localStorage on initial render
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
  }, [])

  // Update body class and localStorage when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  // Toggle function for convenience
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode)
  }

  return <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

