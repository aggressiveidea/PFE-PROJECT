"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import "./pageNavigation.css"

const PageNavigation = () => {
  const [activeSection, setActiveSection] = useState("home")
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Define all navigable sections in order
  const sections = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "knowledge-graph", label: "Knowledge Graph" },
    { id: "popular-terms", label: "Popular Terms" },
    { id: "become-expert", label: "Become an Expert" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      // Show/hide back to top button
      if (window.scrollY > 500) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }

      // Determine active section
      const scrollPosition = window.scrollY + window.innerHeight / 3

      // Find the current active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once on mount to set initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      // Add animation class to target section
      section.classList.add("home-section-entering")

      // Smooth scroll to section
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      })

      // Remove animation class after transition completes
      setTimeout(() => {
        section.classList.remove("home-section-entering")
      }, 1000)
    }
  }

  // Get next and previous section IDs based on current active section
  const getCurrentSectionIndex = () => {
    return sections.findIndex((section) => section.id === activeSection)
  }

  const getNextSection = () => {
    const currentIndex = getCurrentSectionIndex()
    return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null
  }

  const getPreviousSection = () => {
    const currentIndex = getCurrentSectionIndex()
    return currentIndex > 0 ? sections[currentIndex - 1] : null
  }

  const nextSection = getNextSection()
  const previousSection = getPreviousSection()

  return (
    <>
      {/* Fixed section navigation dots */}
      <div className="home-section-navigation">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`home-nav-button ${activeSection === section.id ? "home-active" : ""}`}
            onClick={() => scrollToSection(section.id)}
            aria-label={`Navigate to ${section.label}`}
          >
            <span className="home-nav-dot"></span>
            <span className="home-nav-label">{section.label}</span>
          </button>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="home-navigation-arrows">
        {previousSection && (
          <button
            className="home-nav-arrow home-prev-arrow"
            onClick={() => scrollToSection(previousSection.id)}
            aria-label={`Previous: ${previousSection.label}`}
          >
            <span className="home-arrow-label">Previous: {previousSection.label}</span>
            <div className="home-arrow-icon">
              <ChevronUp size={20} />
            </div>
          </button>
        )}

        {nextSection && (
          <button
            className="home-nav-arrow home-next-arrow"
            onClick={() => scrollToSection(nextSection.id)}
            aria-label={`Next: ${nextSection.label}`}
          >
            <span className="home-arrow-label">Next: {nextSection.label}</span>
            <div className="home-arrow-icon">
              <ChevronDown size={20} />
            </div>
          </button>
        )}
      </div>

      {/* Back to top button */}
      <button
        className={`home-back-to-top ${showBackToTop ? "home-visible" : ""}`}
        onClick={() => scrollToSection("home")}
        aria-label="Back to top"
      >
        <ChevronUp size={20} />
      </button>
    </>
  )
}

export default PageNavigation
