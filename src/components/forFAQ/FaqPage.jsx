"use client"

import { useState } from "react"
import "./FaqPage.css"
import Header from "../forHome/Header"
import Footer from "../forHome/Footer"

const FaqPage = () => {
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [language, setLanguage] = useState("en")

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
      <Header language={language} setLanguage={setLanguage} />

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
          <div className="contact-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="22,6 12,13 2,6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Still have questions?</h2>
          <p>If you couldn't find the answer to your question, feel free to contact us directly.</p>
          <button
            onClick={() => (window.location.href = "mailto:support@yourcompany.com?subject=Contact%20Support")}
            className="contact-button"
          >
            <span>Contact Us</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 5L19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <Footer language={language} />
    </div>
  )
}

export default FaqPage
