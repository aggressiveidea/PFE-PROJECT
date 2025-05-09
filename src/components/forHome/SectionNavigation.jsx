"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const SectionNavigation = () => {
  const [activeSection, setActiveSection] = useState("home")
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Define all navigable sections in order
  const sections = [
    { id: "home", label: "Home" },
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
      const scrollPosition = window.scrollY + 100

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
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      // Add a class to the section for animation
      section.classList.add("home-section-entering")

      // Smooth scroll to section
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      })

      // Remove the animation class after transition completes
      setTimeout(() => {
        section.classList.remove("home-section-entering")
      }, 1000)
    }
  }

  const getNextSection = () => {
    const currentIndex = sections.findIndex((section) => section.id === activeSection)
    return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null
  }

  const nextSection = getNextSection()

  return (
    <>
      {nextSection && (
        <div className="home-next-section-nav">
          <div className="home-next-section-label" onClick={() => scrollToSection(nextSection.id)}>
            <span>Next: {nextSection.label}</span>
          </div>
          <div
            className="home-next-section-arrow"
            onClick={() => scrollToSection(nextSection.id)}
            aria-label={`Navigate to ${nextSection.label}`}
          >
            <ChevronDown size={24} />
          </div>
        </div>
      )}

      <div
        className={`home-back-to-top ${showBackToTop ? "home-visible" : ""}`}
        onClick={() => scrollToSection("home")}
        aria-label="Back to top"
      >
        <ChevronUp size={24} />
      </div>
    </>
  )
}

export default SectionNavigation


