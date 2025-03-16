"use client"

import { useState } from "react"
import "./Header.css"
import {translations }from "../../utils/translations"
import { Link } from "react-router-dom"; 


const Header = ({ language, setLanguage, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = translations[language]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="16" fill="url(#paint0_linear)" />
            <path
              d="M10 16L14 20L22 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9333EA" />
                <stop offset="1" stopColor="#C026D3" />
              </linearGradient>
            </defs>
          </svg>
          <span>EL-MOUGHITH</span>
        </a>

        <div className={`nav-container ${isMenuOpen ? "active" : ""}`}>
          <nav className="main-nav">
            <ul>
              <li>
                <a href="#home">{t.home}</a>
              </li>
              <li>
                <a href="#about">{t.about}</a>
              </li>
              <li>
                <a href="#explore">{t.explore}</a>
              </li>
              <li>
              <a href="#footer">{t.contact}</a>
              </li>
            </ul>
          </nav>

          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>

          <a href="#explore" className="cta-button">
            {t.startExploring}
          </a>
         <div className="buttons">
         <Link to="/signup">
            <button className="btn-signup">Sign up</button>
          </Link>
          <Link to="/login">
            <button className="btn-login">Login</button>
          </Link>
         </div>
        </div>
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header


