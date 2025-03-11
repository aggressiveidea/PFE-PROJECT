"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import CongratsBox from "./CongratsBox"
import "./quiz.css"

function Dailyquiz() {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showCongrats, setShowCongrats] = useState(false)

  const handleSubmit = () => {
    if (selectedAnswer === "Information and Communication Technology") {
      setIsCorrect(true)
      setShowCongrats(true)
    } else {
      setIsCorrect(false)
    }
  }

  return (
    <motion.div
      className="daily-question"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Daily question</h2>
      <div className="question-card">
        <p>What is the definition of ICT?</p>
      </div>

      <div className="answers-grid">
        {[
          "Information and Communication Technology",
          "Internet Connection Terminal",
          "Integrated Circuit Technology",
          "International Computer Terminology",
        ].map((answer, index) => (
          <motion.div
            key={index}
            className={`answer-option ${selectedAnswer === answer ? "selected" : ""}`}
            onClick={() => setSelectedAnswer(answer)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {answer}
          </motion.div>
        ))}
      </div>

      <div className="action-buttons">
        <motion.button
          className="submit-btn"
          onClick={handleSubmit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!selectedAnswer}
        >
          Submit
        </motion.button>
      </div>

      {isCorrect !== null && (
        <motion.div
          className={`feedback ${isCorrect ? "correct" : "incorrect"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {isCorrect ? "Correct!" : "Incorrect. Try again!"}
        </motion.div>
      )}

      {showCongrats && <CongratsBox />}
    </motion.div>
  )
}

export default Dailyquiz

