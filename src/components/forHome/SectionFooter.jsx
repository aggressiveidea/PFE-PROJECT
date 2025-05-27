import { ChevronDown } from "lucide-react"
import "./SectionFooter.css"

const SectionFooter = ({ nextSectionId, nextSectionLabel }) => {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById(nextSectionId)
    if (nextSection) {
      nextSection.classList.add("home-section-entering")
      window.scrollTo({
        top: nextSection.offsetTop,
        behavior: "smooth",
      })

      setTimeout(() => {
        nextSection.classList.remove("home-section-entering")
      }, 1000)
    }
  }

  return (
    <div className="section-footer">
      <button
        className="section-arrow-button"
        onClick={scrollToNextSection}
        aria-label={`Scroll to ${nextSectionLabel}`}
      >
        <span className="section-arrow-label">Next: {nextSectionLabel}</span>
        <div className="section-arrow-icon">
          <ChevronDown size={24} />
        </div>
      </button>
    </div>
  )
}

export default SectionFooter

