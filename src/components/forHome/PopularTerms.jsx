import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, TrendingUp, Eye, ArrowRight, Globe, Database, ShoppingCart, Network, Shield, FileQuestion, FileText, Copyright, Building } from 'lucide-react'
import "./PopularTerms.css"

const PopularTerms = () => {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All", icon: <Globe size={16} /> },
    { id: "personal-data", name: "Personal Data", icon: <Database size={16} /> },
    { id: "e-commerce", name: "E-commerce", icon: <ShoppingCart size={16} /> },
    { id: "networks", name: "Networks", icon: <Network size={16} /> },
    { id: "cybercrime", name: "Cybercrime", icon: <Shield size={16} /> },
    { id: "miscellaneous", name: "Miscellaneous", icon: <FileQuestion size={16} /> },
    { id: "it-contract", name: "IT Contract", icon: <FileText size={16} /> },
    { id: "intellectual-property", name: "Intellectual Property", icon: <Copyright size={16} /> },
    { id: "organizations", name: "Organizations", icon: <Building size={16} /> },
  ]

  const terms = [
    {
      id: 1,
      name: "GDPR Compliance",
      definition: "General Data Protection Regulation compliance ensuring the protection of personal data and privacy rights of EU citizens.",
      category: "personal-data",
      popularity: 95,
      trending: true,
    },
    {
      id: 2,
      name: "Digital Signature",
      definition: "A cryptographic mechanism used to verify the authenticity and integrity of digital messages or documents in e-commerce transactions.",
      category: "e-commerce",
      popularity: 88,
      trending: true,
    },
    {
      id: 3,
      name: "Network Access Control",
      definition: "Security solutions that provide means, hardware, software, or services to enable and control electronic communications access.",
      category: "networks",
      popularity: 92,
      trending: true,
    },
    {
      id: 4,
      name: "Illegal Access",
      definition: "Intentional access without right to all or part of a computer system, as defined by cybercrime legislation.",
      category: "cybercrime",
      popularity: 78,
      trending: false,
    },
    {
      id: 5,
      name: "Information Society",
      definition: "A society where information and communication technologies enable the circulation of intangible and volatile data without geographical constraints.",
      category: "miscellaneous",
      popularity: 85,
      trending: true,
    },
    {
      id: 6,
      name: "Service Level Agreement",
      definition: "A contract defining the level of service expected from a service provider, including performance metrics and support procedures.",
      category: "it-contract",
      popularity: 72,
      trending: false,
    },
    {
      id: 7,
      name: "Computer-Generated Works",
      definition: "Works created by computer in circumstances where there is no human author, raising questions about intellectual property ownership.",
      category: "intellectual-property",
      popularity: 89,
      trending: true,
    },
    {
      id: 8,
      name: "ISO Standards",
      definition: "International Organization for Standardization standards that provide frameworks for information security management and IT governance.",
      category: "organizations",
      popularity: 81,
      trending: false,
    },
    {
      id: 9,
      name: "Data Subject Rights",
      definition: "Rights that allow individuals to view, modify, and challenge the accuracy of their personal data under privacy legislation.",
      category: "personal-data",
      popularity: 87,
      trending: true,
    },
    {
      id: 10,
      name: "Certificate Revocation List",
      definition: "A list of digital certificates that have been revoked before their expiration date, crucial for e-commerce security.",
      category: "e-commerce",
      popularity: 74,
      trending: false,
    },
    {
      id: 11,
      name: "Cryptanalysis",
      definition: "The art of analyzing encrypted messages to decode them and break the code, often used in cybercrime investigations.",
      category: "cybercrime",
      popularity: 83,
      trending: true,
    },
    {
      id: 12,
      name: "End User License Agreement",
      definition: "A contract between the software publisher and the user that defines the legal permissions for using software.",
      category: "it-contract",
      popularity: 69,
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