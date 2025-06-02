import { Moon, Sun } from "lucide-react"
import { translations } from "../../utils/translations"
import { useTheme } from "../../context/theme-context"
import "./Footer.css"

const Footer = ({ language = "en" }) => {
  const { darkMode, toggleDarkMode } = useTheme()

  const t = translations?.[language] || {
    navigation: "Navigation",
    home: "Home",
    features: "Features",
    knowledgeGraph: "Knowledge Graph",
    popularTerms: "Popular Terms",
    resources: "Resources",
    documentation: "Documentation",
    api: "API",
    faq: "FAQ",
    support: "Support",
    legal: "Legal",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    allRightsReserved: "All rights reserved.",
  }

  const isRtl = language === "ar"

  return (
    <footer className={`footer ${darkMode ? "dark" : ""} ${isRtl ? "rtl" : ""}`}>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">✓</span>
            <span className="logo-text">EL-MOUGHITH</span>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>{t.navigation || "Navigation"}</h3>
              <ul>
                <li>
                  <a href="#home">{t.home || "Home"}</a>
                </li>
                <li>
                  <a href="#features">{t.features || "Features"}</a>
                </li>
                <li>
                  <a href="#knowledge-graph">{t.knowledgeGraph || "Knowledge Graph"}</a>
                </li>
                <li>
                  <a href="#popular-terms">{t.popularTerms || "Popular Terms"}</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>{t.resources || "Resources"}</h3>
              <ul>
                <li>
                  <a href="#documentation">{t.documentation || "Documentation"}</a>
                </li>
                <li>
                  <a href="#api">{t.api || "API"}</a>
                </li>
                <li>
                  <a href="#faq">{t.faq || "FAQ"}</a>
                </li>
                <li>
                  <a href="#support">{t.support || "Support"}</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>{t.legal || "Legal"}</h3>
              <ul>
                <li>
                  <a href="#terms">{t.termsOfService || "Terms of Service"}</a>
                </li>
                <li>
                  <a href="#privacy">{t.privacyPolicy || "Privacy Policy"}</a>
                </li>
                <li>
                  <a href="#cookies">{t.cookiePolicy || "Cookie Policy"}</a>
                </li>
              </ul>
            </div>
          </div>

        
        </div>

        <div className="footer-bottom">
          <p>&copy; 2023 EL-MOUGHITH. {t.allRightsReserved || "All rights reserved."}</p>
          <div className="social-links">
            <a href="#twitter" aria-label="Twitter">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>

            <a href="#facebook" aria-label="Facebook">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#linkedin" aria-label="LinkedIn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#github" aria-label="GitHub">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
