"use client"
import { motion } from "framer-motion"
import test from "../../assets/Online test-pana.svg"
import GetStartedBtn from "../forHeader/getStartedBtn"
import bgImage from "../../assets/Union (5).png"
import "./quiz.css"

function HeroQuiz() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div className="hero-section">
        <motion.img
          src={bgImage || "/placeholder.svg"}
          alt="Sky Background"
          className="background"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Welcome to ICT terms quiz
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor <br />
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis <br />
              nostrud exercitation ullamco laboris nisi ut aliquip ex.
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
            >
              <GetStartedBtn displayedText="Take A Quiz" />
            </motion.div>
          </motion.div>
          <motion.div
            className="hero-image"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.img
              src={test || "/placeholder.svg"}
              alt="Quiz Illustration"
              className="testImage"
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default HeroQuiz

