"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Check, X, Clock, AlertTriangle } from "lucide-react"
import { fetchQuizQuestions } from "../../services/Api"
import "./QuestionPage.css"

const QuestionPage = ({ darkMode }) => {
  const { level } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const tickAudioRef = useRef(null)
  const lastTickTimeRef = useRef(0)

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)
        setError(null)

        const fetchedQuestions = await fetchQuizQuestions(level)
        setQuestions(fetchedQuestions)
      } catch (err) {
        console.error("Error loading questions:", err)
        setError("Failed to load questions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [level])

  // Timer effect with ticking sound
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => {
        // Store time spent in session storage for results page
        sessionStorage.setItem("quizTimeSpent", (prev + 1).toString())

        // Play tick sound every second if enabled
        if (soundEnabled && tickAudioRef.current) {
          const now = Date.now()
          // Ensure we don't play sounds too rapidly (debounce)
          if (now - lastTickTimeRef.current > 900) {
            tickAudioRef.current.currentTime = 0
            tickAudioRef.current.play().catch((e) => console.log("Audio play prevented:", e))
            lastTickTimeRef.current = now
          }
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [soundEnabled])

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  const handleOptionSelect = (option) => {
    if (showAnswer) return // Prevent changing answer after submission
    setSelectedOption(option)
  }

  const handleSubmit = () => {
    if (!selectedOption) return

    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowAnswer(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setShowAnswer(false)
    } else {
      // Quiz completed, navigate to results page
      navigate(`/quiz/results/${level}/${score}`)
    }
  }

  const handleBack = () => {
    navigate("/quiz/level")
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading questions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="question-error">
        <div className="error-icon">
          <AlertTriangle size={32} />
        </div>
        <h2>Error</h2>
        <p>{error}</p>
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>Back to Levels</span>
        </button>
      </div>
    )
  }

  if (!questions.length) {
    return (
      <div className="question-error">
        <div className="error-icon">
          <AlertTriangle size={32} />
        </div>
        <h2>No Questions Available</h2>
        <p>We couldn't find any questions for this difficulty level.</p>
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>Back to Levels</span>
        </button>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100

  // Determine level color
  const levelColor =
    level === "easy"
      ? { light: "#10b981", dark: "#34d399" }
      : level === "medium"
        ? { light: "#f59e0b", dark: "#fbbf24" }
        : { light: "#ef4444", dark: "#f87171" }

  return (
    <div className="question-page">
      {/* Audio element for tick sound */}
      <audio ref={tickAudioRef} preload="auto">
        <source
          src="data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD4+Pj4+Pj4+Pj4+Pj4+Pj4//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYFAAAAAAAAAbD5VK2IAAAAAAAAAAAAAAAAAAAAAP/jYMQAEvgiwl9DAAAAO1ALSi19XgYG7wIAAAJOD5R0HygIAmD5+sEHLB94gBwMXwTB8oCAkMRLjuCgOee/5/ggGBgYG/n5+QckCwf/4IAAA5of+fwQcZeWb5YPnggIcZe+CAZeWD5//iAZeWD//+WYQDDDD//jYMQQEgABGQAAAABMQU1FMy45OC4yVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU="
          type="audio/mp3"
        />
      </audio>

      <div className="question-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <h1>
          ICT {level.charAt(0).toUpperCase() + level.slice(1)} Quiz
          <span className="question-counter">
            Question {currentQuestion + 1}/{questions.length}
          </span>
        </h1>

        <div className="timer-container">
          <button className="sound-toggle" onClick={toggleSound} title={soundEnabled ? "Mute timer" : "Unmute timer"}>
            {soundEnabled ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            )}
          </button>
          <div className="timer">
            <Clock size={18} />
            <span>{formatTime(timeSpent)}</span>
          </div>
        </div>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: darkMode ? levelColor.dark : levelColor.light,
          }}
        ></div>
      </div>

      <div className="question-container">
        <h2 className="question-text" dangerouslySetInnerHTML={{ __html: question.question }}></h2>

        <div className="options-container">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === option
            const isCorrect = showAnswer && option === question.correctAnswer
            const isIncorrect = showAnswer && isSelected && !isCorrect
            const optionLetters = ["A", "B", "C", "D"]

            return (
              <div
                key={index}
                className={`option ${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${
                  isIncorrect ? "incorrect" : ""
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="option-letter">{optionLetters[index]}</div>
                <div className="option-text" dangerouslySetInnerHTML={{ __html: option }}></div>
                {isCorrect && (
                  <div className="feedback-icon correct-icon">
                    <Check size={20} />
                  </div>
                )}
                {isIncorrect && (
                  <div className="feedback-icon incorrect-icon">
                    <X size={20} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="question-footer">
        {!showAnswer ? (
          <button
            className={`submit-button ${!selectedOption ? "disabled" : ""}`}
            onClick={handleSubmit}
            disabled={!selectedOption}
            style={{
              backgroundColor: darkMode ? levelColor.dark : levelColor.light,
              opacity: !selectedOption ? 0.7 : 1,
            }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            className="next-button"
            onClick={handleNext}
            style={{
              backgroundColor: darkMode ? levelColor.dark : levelColor.light,
            }}
          >
            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
          </button>
        )}
      </div>
    </div>
  )
}

export default QuestionPage
