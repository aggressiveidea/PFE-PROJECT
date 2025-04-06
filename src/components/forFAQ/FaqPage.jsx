"use client"

import { useState, useEffect } from "react"
import "./FaqPage.css"
import Header from "../forHome/Header"
import Footer from "../forHome/Footer"

const FaqPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [darkMode, setDarkMode] = useState(true) // Set default to true for dark mode
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    // Apply dark mode to body
    if (darkMode) {
      document.body.classList.add("dark")
      document.body.style.backgroundColor = "#1a1528"
    } else {
      document.body.classList.remove("dark")
      document.body.style.backgroundColor = ""
    }
  }, [darkMode])

  // Sample FAQ data
  const faqs = [
    {
      id: 1,
      question: "What is EL-MOUGHITH?",
      answer:
        "EL-MOUGHITH is a digital knowledge graph for legal IT terminology. It provides a trilingual (Arabic-French-English) glossary of ICT law terms with semantic relationships between concepts.",
    },
    {
      id: 2,
      question: "How can I contribute to the platform?",
      answer:
        "Legal and IT experts can apply to become contributors through our 'Apply as Expert' form. After verification, you'll be able to suggest new terminology, edit definitions, and contribute to the knowledge graph.",
    },
    {
      id: 3,
      question: "Is the platform free to use?",
      answer:
        "Yes, basic access to the platform is free for all visitors. Registered users get additional features like personal term libraries and search history. Expert contributors get even more capabilities.",
    },
    {
      id: 4,
      question: "How often is the terminology updated?",
      answer:
        "Our terminology database is continuously updated by our expert contributors. All new entries and modifications go through a verification process before being published.",
    },
    {
      id: 5,
      question: "Can I use the content for academic purposes?",
      answer:
        "Yes, you can use our content for academic and research purposes with proper attribution. Please refer to our Terms of Service for detailed information on usage rights.",
    },
  ]

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id)
  }

  return (
    <div className="app-wrapper">
      <Header language={language} setLanguage={setLanguage} darkMode={darkMode} />

      <div className="page-container" id="FAQ">
        <div className="page-header">
          <h1 className="page-title">Frequently Asked Questions</h1>
          <p className="page-description">
            Find answers to common questions about EL-MOUGHITH and how to use our platform.
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((faq) => (
            <div key={faq.id} className={`faq-item ${activeQuestion === faq.id ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleQuestion(faq.id)}>
                <h3>{faq.question}</h3>
                <span className="faq-toggle-icon"></span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-section">
          <h2>Still have questions?</h2>
          <p>If you couldn't find the answer to your question, feel free to contact us directly.</p>
          <button
            onClick={() => (window.location.href = "mailto:support@yourcompany.com?subject=Contact%20Support")}
            className="contact-button"
          >
            Contact Us
          </button>
        </div>
      </div>

      <Footer darkMode={darkMode} setDarkMode={setDarkMode} language={language} />
    </div>
  )
}

export default FaqPage



