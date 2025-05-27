"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, TrendingUp, Eye, ArrowRight, Globe, Monitor, Package, Shield, Brain, Cpu } from 'lucide-react'
import "./PopularTerms.css"

const PopularTerms = () => {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All", icon: <Globe size={16} /> },
    { id: "hardware", name: "Hardware", icon: <Monitor size={16} /> },
    { id: "software", name: "Software", icon: <Package size={16} /> },
    { id: "networking", name: "Networking", icon: <Globe size={16} /> },
    { id: "security", name: "Security", icon: <Shield size={16} /> },
    { id: "ai", name: "AI", icon: <Brain size={16} /> },
  ]

  const terms = [
    {
      id: 1,
      name: "Artificial Intelligence",
      definition: "The simulation of human intelligence processes by machines, especially computer systems.",
      category: "ai",
      popularity: 95,
      trending: true,
    },
    {
      id: 2,
      name: "Cloud Computing",
      definition:
        "The delivery of different services through the Internet, including data storage, servers, databases, networking, and software.",
      category: "networking",
      popularity: 88,
      trending: true,
    },
    {
      id: 3,
      name: "Machine Learning",
      definition:
        "A subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.",
      category: "ai",
      popularity: 92,
      trending: true,
    },
    {
      id: 4,
      name: "Blockchain",
      definition:
        "A distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.",
      category: "security",
      popularity: 78,
      trending: false,
    },
    {
      id: 5,
      name: "Internet of Things",
      definition:
        "The network of physical objects embedded with sensors, software, and other technologies for the purpose of connecting and exchanging data with other devices and systems over the Internet.",
      category: "networking",
      popularity: 85,
      trending: true,
    },
    {
      id: 6,
      name: "Virtual Reality",
      definition:
        "A simulated experience that can be similar to or completely different from the real world, created using computer technology and special equipment.",
      category: "hardware",
      popularity: 72,
      trending: false,
    },
    {
      id: 7,
      name: "Cybersecurity",
      definition:
        "The practice of protecting systems, networks, and programs from digital attacks that aim to access, change, or destroy sensitive information.",
      category: "security",
      popularity: 89,
      trending: true,
    },
    {
      id: 8,
      name: "Big Data",
      definition:
        "Extremely large data sets that may be analyzed computationally to reveal patterns, trends, and associations, especially relating to human behavior and interactions.",
      category: "software",
      popularity: 81,
      trending: false,
    },
  ]

  const filteredTerms = activeCategory === "all" ? terms : terms.filter((term) => term.category === activeCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="popular-terms" className="popular-popular-terms">
      <div className="popular-container">
        <motion.div
          className="popular-section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="popular-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <TrendingUp size={16} />
            <span>Trending</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Popular ICT Terms
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Explore the most frequently searched ICT terms in our dictionary.
          </motion.p>
        </motion.div>

        <motion.div
          className="popular-categories"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              className={`popular-category-button ${activeCategory === category.id ? "popular-active" : ""}`}
              onClick={() => setActiveCategory(category.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="popular-category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="popular-terms-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredTerms.map((term, index) => (
              <motion.div
                key={term.id}
                className="popular-term-card"
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                layout
              >
                <div className="popular-card-header">
                  <div className="popular-term-info">
                    <h3>{term.name}</h3>
                    {term.trending && (
                      <motion.div
                        className="popular-trending-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                      >
                        <Sparkles size={12} />
                        <span>Hot</span>
                      </motion.div>
                    )}
                  </div>
                  <div className="popular-popularity-indicator">
                    <div className="popular-popularity-bar">
                      <motion.div
                        className="popular-popularity-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${term.popularity}%` }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <span className="popular-popularity-text">{term.popularity}%</span>
                  </div>
                </div>

                <p className="popular-term-definition">{term.definition}</p>

                <div className="popular-card-footer">
                  <div className="popular-footer-left">
                    <span className="popular-category-tag">
                      <span className="popular-category-icon-small">{categories.find((c) => c.id === term.category)?.icon}</span>
                      {categories.find((c) => c.id === term.category)?.name}
                    </span>
                  </div>
                  <motion.button className="popular-view-details" whileHover={{ x: 4 }} whileTap={{ scale: 0.95 }}>
                    <Eye size={16} />
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default PopularTerms
