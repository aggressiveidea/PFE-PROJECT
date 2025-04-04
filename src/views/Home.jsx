"use client"

import { useState, useEffect } from "react"
import Header from "../components/forHome/Header"
import Hero from "../components/forHome/Hero"
import Features from "../components/forHome/Features"
import KnowledgeGraph from "../components/forHome/KnowledgeGraph"
import PopularTerms from "../components/forHome/PopularTerms"
import BecomeExpert from "../components/forHome/become-expert"
import Footer from "../components/forHome/Footer"
import "./global.css"

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <Header language={language} setLanguage={setLanguage} darkMode={darkMode} />
      <main>
        <Hero language={language} />
        <Features language={language} />
        <KnowledgeGraph language={language} />
        <PopularTerms language={language} />
        <BecomeExpert language={language} />
      </main>
      <Footer darkMode={darkMode} setDarkMode={setDarkMode} language={language} />
    </div>
  )
}
