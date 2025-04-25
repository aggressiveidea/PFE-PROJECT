"use client"
import { useState } from "react"
import Header from "../components/forHome/Header"
import Sidebar from "../components/forDashboard/Sidebar"
import Footer from "../components/forHome/Footer"
import GraphVisualization from "../components/forKnowledge/GraphVisualization"
import GraphAlgorithmsSection from "../components/forKnowledge/GraphAlgorithms"
import "./ICTDictionary.css"

const ICTDictionary = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english")

  // Set RTL direction for Arabic language
  const isRTL = selectedLanguage === "arabic"

  return (
    <div className="ict-dictionary" dir={isRTL ? "rtl" : "ltr"}>
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <div className="search-controls-wrapper">
            <div className="search-controls">
              <div className="language-selector">
                <label htmlFor="language-select">
                  {selectedLanguage === "english" && "Language:"}
                  {selectedLanguage === "french" && "Langue:"}
                  {selectedLanguage === "arabic" && "اللغة:"}
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="french">Français</option>
                  <option value="arabic">العربية</option>
                </select>
              </div>

              <div className="graph-title">
                <h2>
                  {selectedLanguage === "english" && "Knowledge Graph Visualization"}
                  {selectedLanguage === "french" && "Visualisation du Graphe de Connaissances"}
                  {selectedLanguage === "arabic" && "تصور الرسم البياني للمعرفة"}
                </h2>
              </div>
            </div>
          </div>

          <GraphVisualization language={selectedLanguage} />

          {/* Add the Graph Algorithms Section */}
          <GraphAlgorithmsSection language={selectedLanguage} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ICTDictionary
