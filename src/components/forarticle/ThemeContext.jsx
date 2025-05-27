import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
  
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {

    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
    }

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
