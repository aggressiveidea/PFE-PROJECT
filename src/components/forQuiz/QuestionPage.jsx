import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Check, X, Clock, AlertTriangle, Volume2, VolumeX } from "lucide-react"
import { fetchQuizQuestions2, getCategoryDetails } from "../../services/Api"
import "./QuestionPage.css"

const QuestionPage = ({ darkMode }) => {
  const { category } = useParams()
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
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null)
  const [animateProgress, setAnimateProgress] = useState(false)
  const [categoryInfo, setCategoryInfo] = useState({ name: "", color: "#6366f1" })

  const tickAudioRef = useRef(null)
  const correctAudioRef = useRef(null)
  const incorrectAudioRef = useRef(null)
  const lastTickTimeRef = useRef(0)
  const questionContainerRef = useRef(null)

  useEffect(() => {
    if (!category) {
      setError("No category specified")
      setLoading(false)
      return
    }

    try {
      const details = getCategoryDetails(category)
      setCategoryInfo(details)
    } catch (err) {
      console.error("Error getting category details:", err)
      setCategoryInfo({ name: "Unknown Category", color: "#6366f1" })
    }

    const loadQuestions = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Loading questions for category:", category)
        const fetchedQuestions = await fetchQuizQuestions2(category)

        console.log("Fetched questions:", fetchedQuestions)

        if (!fetchedQuestions || !Array.isArray(fetchedQuestions) || fetchedQuestions.length === 0) {
          throw new Error("No questions available for this category")
        }

        setQuestions(fetchedQuestions)
      } catch (err) {
        console.error("Error loading questions:", err)
        setError(err.message || "Failed to load questions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [category])
  useEffect(() => {
    if (questions.length > 0) {
      setAnimateProgress(true)
      const timer = setTimeout(() => setAnimateProgress(false), 600)
      return () => clearTimeout(timer)
    }
  }, [currentQuestion, questions.length])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => {
        sessionStorage.setItem("quizTimeSpent", (prev + 1).toString())

        if (soundEnabled && tickAudioRef.current) {
          const now = Date.now()
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

  useEffect(() => {
    if (questionContainerRef.current && questions.length > 0) {
      questionContainerRef.current.classList.add("question-enter")
      const timer = setTimeout(() => {
        if (questionContainerRef.current) {
          questionContainerRef.current.classList.remove("question-enter")
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentQuestion, questions.length])

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  const handleOptionSelect = (option) => {
    if (showAnswer) return 
    setSelectedOption(option)
  }

  const handleSubmit = () => {
    if (!selectedOption || !questions.length || !questions[currentQuestion]) return

    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer
    setIsAnswerCorrect(isCorrect)

    if (isCorrect) {
      setScore(score + 1)
      if (soundEnabled && correctAudioRef.current) {
        correctAudioRef.current.currentTime = 0
        correctAudioRef.current.play().catch((e) => console.log("Audio play prevented:", e))
      }
    } else {
      if (soundEnabled && incorrectAudioRef.current) {
        incorrectAudioRef.current.currentTime = 0
        incorrectAudioRef.current.play().catch((e) => console.log("Audio play prevented:", e))
      }
    }
    setShowAnswer(true)
  }

  const handleNext = () => {
    if (!questions.length) return

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setShowAnswer(false)
      setIsAnswerCorrect(null)
    } else {
      navigate(`/quiz/results/${category}/${score}`)
    }
  }

  const handleBack = () => {
    navigate("/quiz")
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (loading) {
    return (
      <div className="question-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="question-page">
        <div className="question-error">
          <div className="error-icon">
            <AlertTriangle size={32} />
          </div>
          <h2>Error</h2>
          <p>{error}</p>
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={18} />
            <span>Back to Quiz Hub</span>
          </button>
        </div>
      </div>
    )
  }
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="question-page">
        <div className="question-error">
          <div className="error-icon">
            <AlertTriangle size={32} />
          </div>
          <h2>No Questions Available</h2>
          <p>We couldn't find any questions for this category.</p>
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={18} />
            <span>Back to Quiz Hub</span>
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  if (!question) {
    return (
      <div className="question-page">
        <div className="question-error">
          <div className="error-icon">
            <AlertTriangle size={32} />
          </div>
          <h2>Question Not Found</h2>
          <p>The current question could not be loaded.</p>
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={18} />
            <span>Back to Quiz Hub</span>
          </button>
        </div>
      </div>
    )
  }

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="question-page">
    
      <audio ref={tickAudioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
          type="audio/wav"
        />
      </audio>
      <audio ref={correctAudioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
          type="audio/wav"
        />
      </audio>
      <audio ref={incorrectAudioRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
          type="audio/wav"
        />
      </audio>

      <div className="question-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <h1>
          {categoryInfo.name} Quiz
          <span className="question-counter">
            Question {currentQuestion + 1}/{questions.length}
          </span>
        </h1>

        <div className="timer-container">
          <button className="sound-toggle" onClick={toggleSound} title={soundEnabled ? "Mute timer" : "Unmute timer"}>
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <div className="timer">
            <Clock size={18} />
            <span>{formatTime(timeSpent)}</span>
          </div>
        </div>
      </div>

      <div className="progress-container">
        <div
          className={`progress-bar ${animateProgress ? "animate-progress" : ""}`}
          style={{
            width: `${progressPercentage}%`,
            background: `linear-gradient(to right, ${categoryInfo.color}, ${categoryInfo.color}CC)`,
          }}
        ></div>
      </div>

      <div className="question-container" ref={questionContainerRef}>
        <h2 className="question-text">{question.question}</h2>

        <div className="options-container">
          {question.options &&
            question.options.map((option, index) => {
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
                  data-index={index}
                >
                  <div className="option-letter">{optionLetters[index]}</div>
                  <div className="option-text">{option}</div>
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
              background: `linear-gradient(to right, ${categoryInfo.color}, ${categoryInfo.color}CC)`,
            }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            className="next-button"
            onClick={handleNext}
            style={{
              background: `linear-gradient(to right, ${categoryInfo.color}, ${categoryInfo.color}CC)`,
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
