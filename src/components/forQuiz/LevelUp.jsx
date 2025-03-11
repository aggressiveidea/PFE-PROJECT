"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import levels from "../../utils/levels.js" 
import "./quiz.css" 

const LevelUp = () => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    let interval
    if (isQuizActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isQuizActive])

  const startQuiz = () => {
    setIsQuizActive(true)
    setTimer(0)
    setScore(0)
    setCurrentQuestion(0)
  }

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer)
    setIsCorrect(answer === levels[currentLevel][currentQuestion].rightAnswer)
    setShowFeedback(true)

    if (answer === levels[currentLevel][currentQuestion].rightAnswer) {
      setScore((prevScore) => prevScore + 1)
    }

    setTimeout(() => {
      setShowFeedback(false)
      setSelectedAnswer(null)
      if (currentQuestion < levels[currentLevel].length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        finishQuiz()
      }
    }, 1500)
  }

  const finishQuiz = () => {
    setIsQuizActive(false)
    if (score >= 5) {
      setCurrentLevel((prev) => Math.min(prev + 1, levels.length - 1))
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <motion.div className="level-up-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h1>ICT Terms Quiz - Level {currentLevel + 1}</h1>
      {!isQuizActive ? (
        <motion.button
          className="start-button"
          onClick={startQuiz}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Quiz
        </motion.button>
      ) : (
        <div className="quiz-container">
          <div className="quiz-header">
            <span>Score: {score}/10</span>
            <span>Time: {formatTime(timer)}</span>
          </div>
          <motion.div
            key={currentQuestion}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h2>{levels[currentLevel][currentQuestion].question}</h2>
            <div className="answers-container">
              {levels[currentLevel][currentQuestion].answers.map((answer, index) => (
                <motion.button
                  key={index}
                  className={`answer-button ${selectedAnswer === answer ? (isCorrect ? "correct" : "incorrect") : ""}`}
                  onClick={() => handleAnswerClick(answer)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {answer}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className={`feedback ${isCorrect ? "correct" : "incorrect"}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {isCorrect ? "Correct!" : "Incorrect!"}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default LevelUp

