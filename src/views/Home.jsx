import { useState, useEffect } from "react"
import Header from "../components/forHome/Header"
import Hero from "../components/forHome/Hero"
import Features from "../components/forHome/Features"
import KnowledgeGraph from "../components/forHome/KnowledgeGraph"
import PopularTerms from "../components/forHome/PopularTerms"
import BecomeExpert from "../components/forHome/become-expert"
import Footer from "../components/forHome/Footer"
import { useTheme } from "../context/theme-context"
import "../styles/darkMode.css"
import "./Home.css"

export default function Home() {
  const { darkMode } = useTheme()
  const [language, setLanguage] = useState("en")
  const [activeSection, setActiveSection] = useState("home")
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3
      const totalHeight = document.body.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)

       
      const sections = [
        document.getElementById("home"),
        document.getElementById("features"),
        document.getElementById("knowledge-graph"),
        document.getElementById("popular-terms"),
        document.getElementById("become-expert"),
      ]

       
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()  
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

   
  useEffect(() => {
    const handleKeyDown = (e) => {
       
      const sections = ["home", "features", "knowledge-graph", "popular-terms", "become-expert"]

      const currentIndex = sections.indexOf(activeSection)

      if (e.key === "ArrowDown" && currentIndex < sections.length - 1) {
         
        const nextSection = document.getElementById(sections[currentIndex + 1])
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: "smooth" })
          e.preventDefault()
        }
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
         
        const prevSection = document.getElementById(sections[currentIndex - 1])
        if (prevSection) {
          prevSection.scrollIntoView({ behavior: "smooth" })
          e.preventDefault()
        }
      } else if (e.key === "Home") {
         
        const firstSection = document.getElementById(sections[0])
        if (firstSection) {
          firstSection.scrollIntoView({ behavior: "smooth" })
          e.preventDefault()
        }
      } else if (e.key === "End") {
         
        const lastSection = document.getElementById(sections[sections.length - 1])
        if (lastSection) {
          lastSection.scrollIntoView({ behavior: "smooth" })
          e.preventDefault()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeSection])

  return (
    <div className={`home-page-app-container ${darkMode ? "home-page-dark" : "home-page-light"}`}>
       
      <div className="home-progress-indicator" style={{ width: `${scrollProgress}%` }}></div>

      <Header language={language} setLanguage={setLanguage} activeSection={activeSection} />
      <main>
        <Hero language={language} />
        <Features language={language} />
        <KnowledgeGraph language={language} />
        <PopularTerms language={language} />
        <BecomeExpert language={language} />
      </main>
      <Footer language={language} />
    </div>
  )
}
