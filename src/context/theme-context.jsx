"use client"

import { createContext, useState, useEffect, useContext } from "react"

// Create a context for theme management
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
})

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Effect to initialize dark mode from localStorage or system preference
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // Get stored preference or check system preference
      const storedDarkMode = localStorage.getItem("darkMode")

      if (storedDarkMode !== null) {
        // Use stored preference if available
        setDarkMode(storedDarkMode === "true")
      } else {
        // Otherwise check system preference
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setDarkMode(systemPrefersDark)
        localStorage.setItem("darkMode", systemPrefersDark.toString())
      }

      setMounted(true)
    }
  }, [])

  // Effect to apply dark mode to the document
  useEffect(() => {
    if (mounted) {
      // Apply dark mode class to the document body
      if (darkMode) {
        document.body.classList.add("dark")
      } else {
        document.body.classList.remove("dark")
      }

      // Store preference in localStorage
      localStorage.setItem("darkMode", darkMode.toString())

      // Dispatch an event for any non-React components
      window.dispatchEvent(new Event("darkModeChanged"))
    }
  }, [darkMode, mounted])

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode)
  }

  // Provide the theme context to children
  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}
