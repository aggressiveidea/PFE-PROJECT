"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Network, RefreshCw, Zap, Users } from "lucide-react"
import { translations } from "../../utils/translations"
import "./Features.css"

const Features = ({ language = "en" }) => {
  const t = translations[language] || translations.en
  const isRtl = language === "ar"
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Globe,
      title: t.multilingualSupport || "Multilingual Support",
      description:
        "Navigate seamlessly between English, French, and Arabic with precise translations and cultural context for comprehensive understanding.",
      highlight: "3 Languages",
      color: "#8b5cf6",
    },
    {
      icon: Network,
      title: t.interactiveGraph || "Interactive Knowledge Graph",
      description:
        "Discover hidden relationships between concepts through our AI-powered visualization network that reveals connections.",
      highlight: "Smart Discovery",
      color: "#06d6a0",
    },
    {
      icon: RefreshCw,
      title: t.regularlyUpdated || "Regularly Updated",
      description:
        "Stay current with real-time updates from legal experts and technology professionals worldwide ensuring accuracy.",
      highlight: "Always Fresh",
      color: "#ef476f",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <section id="features" className={`features-features ${isRtl ? "features-rtl" : ""}`}>
      <div className="features-container">
        <motion.div
          className="features-section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="features-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Zap size={16} />
            <span>{t.newFeatures || "New Features"}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {t.featuresTitle || "Why Use This Dictionary?"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {t.featuresDescription ||
              "Our platform offers unique features to help you explore and understand ICT terminology across multiple languages."}
          </motion.p>
        </motion.div>

        <motion.div
          className="features-adventure-map"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        >
          {/* Enhanced Animated Path SVG */}
          <div className="features-journey-path">
            <svg className="features-path-svg" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="featuresAdventureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
                <filter id="featuresGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                className="features-adventure-path"
                d="M 100 300 Q 400 100, 600 200 T 1100 300"
                strokeLinecap="round"
                filter="url(#featuresGlow)"
              />
              {/* Path markers */}
              <circle cx="100" cy="300" r="4" fill="#8b5cf6" className="features-path-marker" />
              <circle cx="600" cy="200" r="4" fill="#ec4899" className="features-path-marker" />
              <circle cx="1100" cy="300" r="4" fill="#a78bfa" className="features-path-marker" />
            </svg>
          </div>

          {/* Feature Stops */}
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const isHovered = activeFeature === index

            return (
              <motion.div
                key={index}
                className={`features-feature-stop features-stop-${index + 1}`}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 1 + index * 0.2,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 400,
                }}
              >
                {/* Icon */}
                <motion.div
                  className="features-feature-icon"
                  style={{
                    backgroundColor: isHovered ? feature.color : "white",
                    color: isHovered ? "white" : feature.color,
                    borderColor: feature.color,
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent size={24} />
                </motion.div>

                {/* Compact Card (Always Visible) */}
                <motion.div
                  className={`features-compact-card ${isHovered ? "features-hovered" : ""}`}
                  style={{ borderColor: `${feature.color}30` }}
                  layout
                >
                  <div className="features-compact-header">
                    <div
                      className="features-compact-badge"
                      style={{
                        backgroundColor: `${feature.color}15`,
                        color: feature.color,
                        borderColor: `${feature.color}30`,
                      }}
                    >
                      {feature.highlight}
                    </div>
                    <div className="features-compact-number" style={{ color: feature.color }}>
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                </motion.div>

                {/* Detailed Card (Hover Only) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="features-detailed-card"
                      style={{ borderColor: `${feature.color}30` }}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
                    >
                      <div className="features-detailed-header">
                        <div
                          className="features-detailed-badge"
                          style={{
                            backgroundColor: `${feature.color}15`,
                            color: feature.color,
                            borderColor: `${feature.color}30`,
                          }}
                        >
                          <Zap size={12} />
                          {feature.highlight}
                        </div>
                        <div className="features-detailed-number" style={{ color: feature.color }}>
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>
                      <div className="features-detailed-content">
                        <h3 className="features-detailed-title">{feature.title}</h3>
                        <p className="features-detailed-description">{feature.description}</p>
                      </div>
                      <motion.button
                        className="features-explore-button"
                        style={{ borderColor: feature.color, color: feature.color }}
                        whileHover={{
                          backgroundColor: `${feature.color}10`,
                          borderColor: feature.color,
                          scale: 1.02,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Explore</span>
                        <Network size={14} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          className="features-features-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="features-summary-content">
            <div className="features-summary-icon">
              <Users size={24} />
            </div>
            <div className="features-summary-text">
              <h4>Ready to explore?</h4>
              <p>Join thousands of users discovering ICT terminology in multiple languages.</p>
            </div>
            <motion.button
              className="features-get-started-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features




