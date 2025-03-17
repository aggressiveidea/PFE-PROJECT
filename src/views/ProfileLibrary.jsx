"use client";

import { useState, useEffect } from "react";
import Header from "../components/forHome/Header";
import Footer from "../components/forHome/Footer";
import ProfileLibrarie from "../components/forProfile/profileLibrary"
import "./ProfileLibrary.css"


export default function ProfileLibrary() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <Header
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
      />
      <main>
        <ProfileLibrarie language={language}  />
      </main>
      <Footer
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
      />
    </div>
  );
}