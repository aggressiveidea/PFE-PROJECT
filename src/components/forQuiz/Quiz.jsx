"use client"

import { useState } from "react"
import { motion } from "framer-motion"

// Custom icons instead of Lucide icons
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
)

const UnlockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
  </svg>
)

const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
)

const DatabaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
)

const ServerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
)

const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
)

// Custom button component
const Button = ({ children, onClick, disabled, variant }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"

  const styles =
    variant === "outline"
      ? `${baseStyles} border border-[#0077B5] text-[#0077B5] hover:bg-[#D0F1F5]`
      : `${baseStyles} bg-[#0077B5] text-white hover:bg-[#00B4D8]`

  return (
    <button
      className={`${styles} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// Custom badge component
const Badge = ({ children, variant }) => {
  const getColor = () => {
    switch (variant) {
      case "success":
        return "bg-[#D0F1F5] text-[#030465]"
      case "secondary":
        return "bg-[#00B4D8] text-white"
      case "destructive":
        return "bg-[#030465] text-white"
      default:
        return "bg-[#90E0EF] text-[#030465]"
    }
  }

  return <span className={`${getColor()} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>{children}</span>
}

// Custom progress component
const Progress = ({ value }) => {
  return (
    <div className="w-full bg-[#D0F1F5] rounded-full h-2.5">
      <div
        className="bg-[#00B4D8] h-2.5 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  )
}

export default function LevelCards() {
  const [levels, setLevels] = useState([
    {
      id: 1,
      title: "HTML Basics",
      description: "Learn the fundamentals of HTML structure and elements",
      icon: <CodeIcon />,
      completed: true,
      difficulty: "beginner",
    },
    {
      id: 2,
      title: "CSS Styling",
      description: "Master cascading style sheets and responsive design",
      icon: <GlobeIcon />,
      completed: false,
      difficulty: "beginner",
    },
    {
      id: 3,
      title: "JavaScript Fundamentals",
      description: "Understand core JavaScript concepts and DOM manipulation",
      icon: <CodeIcon />,
      completed: false,
      difficulty: "intermediate",
    },
    {
      id: 4,
      title: "Database Design",
      description: "Learn SQL and database architecture principles",
      icon: <DatabaseIcon />,
      completed: false,
      difficulty: "intermediate",
    },
    {
      id: 5,
      title: "Backend Development",
      description: "Build server-side applications and APIs",
      icon: <ServerIcon />,
      completed: false,
      difficulty: "advanced",
    },
    {
      id: 6,
      title: "Networking Principles",
      description: "Understand network protocols and infrastructure",
      icon: <ServerIcon />,
      completed: false,
      difficulty: "advanced",
    },
  ])

  const completeLevel = (levelId) => {
    setLevels((prevLevels) => prevLevels.map((level) => (level.id === levelId ? { ...level, completed: true } : level)))
  }

  const completedLevelsCount = levels.filter((level) => level.completed).length
  const totalLevels = levels.length
  const progressPercentage = (completedLevelsCount / totalLevels) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#D0F1F5]">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="text-[#030465] font-bold text-xl">IctGraphic</div>
          <div className="flex space-x-4">
            <a href="#" className="text-[#0077B5] hover:text-[#00B4D8]">
              Home
            </a>
            <a href="#" className="text-[#0077B5] hover:text-[#00B4D8]">
              Search
            </a>
            <a href="#" className="text-[#0077B5] hover:text-[#00B4D8]">
              FAQ
            </a>
            <a href="#" className="text-[#0077B5] hover:text-[#00B4D8]">
              Profile
            </a>
          </div>
          <button className="bg-[#0077B5] text-white px-4 py-1 rounded-md hover:bg-[#00B4D8]">Get Started</button>
        </nav>

        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-[#030465]">Start with IctGraphic</h1>
          <p className="mb-6 text-[#0077B5] max-w-2xl mx-auto">
            Are you tired of searching constantly about a simple ICT term just to find contradictions? IctGraphic is the
            ultimate ICT guide to end your search, with everything you need in one place.
          </p>
          <div className="max-w-md mx-auto mb-8">
            <Progress value={progressPercentage} />
            <p className="mt-2 text-sm text-[#0077B5]">{Math.round(progressPercentage)}% completed...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {levels.map((level, index) => {
            // Check if this level is unlocked (first level or previous level is completed)
            const isUnlocked = level.id === 1 || levels.find((l) => l.id === level.id - 1)?.completed

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: isUnlocked ? 1.03 : 1 }}
                className="relative"
              >
                <div
                  className={`bg-white rounded-lg shadow-md overflow-hidden h-full transition-all duration-300 ${!isUnlocked ? "opacity-80 grayscale" : ""}`}
                >
                  {level.completed && (
                    <motion.div
                      className="absolute -top-2 -right-2 z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Badge variant="success">Completed</Badge>
                    </motion.div>
                  )}

                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div
                        className={`p-2 rounded-full ${
                          level.difficulty === "beginner"
                            ? "bg-[#90E0EF] text-[#030465]"
                            : level.difficulty === "intermediate"
                              ? "bg-[#00B4D8] text-white"
                              : "bg-[#030465] text-white"
                        }`}
                      >
                        {level.icon}
                      </div>
                      <Badge
                        variant={
                          level.difficulty === "beginner"
                            ? "default"
                            : level.difficulty === "intermediate"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {level.difficulty}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-[#030465] mb-2">{level.title}</h3>
                    <p className="text-[#0077B5] mb-4">{level.description}</p>

                    {!isUnlocked && (
                      <motion.div
                        className="flex items-center justify-center p-4"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatType: "reverse" }}
                      >
                        <LockIcon className="text-[#0077B5]" />
                        <p className="ml-2 text-[#0077B5]">Complete previous level to unlock</p>
                      </motion.div>
                    )}

                    <div className="mt-4">
                      {isUnlocked && !level.completed ? (
                        <Button onClick={() => completeLevel(level.id)}>Start Level</Button>
                      ) : isUnlocked && level.completed ? (
                        <Button variant="outline">
                          <UnlockIcon className="mr-2" /> Review Level
                        </Button>
                      ) : (
                        <Button disabled>
                          <LockIcon className="mr-2" /> Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-[#D0F1F5] p-4 rounded-lg mb-4 inline-block">
              <div className="w-12 h-12 bg-[#030465] rounded-lg transform rotate-45 mx-auto"></div>
            </div>
            <h3 className="text-[#030465] font-bold mb-2">create your account</h3>
            <p className="text-[#0077B5] text-sm">
              Learn how to create an account and enjoy your time with IctGraphic.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-[#D0F1F5] p-4 rounded-lg mb-4 inline-block">
              <div className="w-12 h-12 bg-[#030465] rounded-lg transform rotate-45 mx-auto"></div>
            </div>
            <h3 className="text-[#030465] font-bold mb-2">customize your profile</h3>
            <p className="text-[#0077B5] text-sm">
              You can also customize your profile the way you want to make it more personal.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-[#D0F1F5] p-4 rounded-lg mb-4 inline-block">
              <div className="w-12 h-12 bg-[#030465] rounded-lg transform rotate-45 mx-auto"></div>
            </div>
            <h3 className="text-[#030465] font-bold mb-2">start searching</h3>
            <p className="text-[#0077B5] text-sm">
              Use different methods to search and get the best ICT definition you want.
            </p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#030465] mb-4">Search for a term</h2>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-full border border-[#90E0EF] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              placeholder="Enter ICT term..."
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#030465] mb-6">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-[#D0F1F5] rounded-lg p-6 flex flex-col items-center">
                <div className="w-8 h-8 bg-[#030465] rounded-md transform rotate-45 mb-4"></div>
                <p className="text-[#0077B5]">Service {item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation for level completion */}
      {levels.some((level) => level.completed) && (
        <motion.div
          className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: levels.some((level) => level.completed) ? 1 : 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2,
              times: [0, 0.5, 1],
              repeat: 0,
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-r from-[#030465] to-[#00B4D8] flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: 0 }}
              className="text-white text-4xl font-bold"
            >
              🎉
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}




