"use client"

import { useEffect, useState } from "react"

const SectionIndicator = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)

  // Define all navigable sections in order
  const sections = [
    { id: "home", label: "Home" },
    { id: "knowledge-graph", label: "Knowledge Graph" },
    { id: "popular-terms", label: "Popular Terms" },
    { id: "become-expert", label: "Become an Expert" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      // Find the current section index
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section && section.offsetTop <= scrollPosition) {
          setCurrentSectionIndex(i)
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

  return (
    <div className="home-section-indicator">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`home-section-dot ${currentSectionIndex === index ? "home-active" : ""}`}
          onClick={() => scrollToSection(section.id)}
          data-label={section.label}
        />
      ))}
    </div>
  )
}

export default SectionIndicator

