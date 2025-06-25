import { createContext, useState, useEffect, useContext } from "react"

export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDarkMode = localStorage.getItem("darkMode")

      if (storedDarkMode !== null) {
        setDarkMode(storedDarkMode === "true")
      } else {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setDarkMode(systemPrefersDark)
        localStorage.setItem("darkMode", systemPrefersDark.toString())
      }

      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.body.classList.add("dark")
      } else {
        document.body.classList.remove("dark")
      }

      localStorage.setItem("darkMode", darkMode.toString())

      window.dispatchEvent(new Event("darkModeChanged"))
    }
  }, [darkMode, mounted])

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode)
  }

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}
