"use client"

import { useState } from "react"
import LevelCards from "./Quiz"

export default function DemoPage() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {!showDemo ? (
        <div className="max-w-md mx-auto pt-20 text-center px-4">
          <h1 className="text-4xl font-bold mb-6 text-[#030465]">ICT Learning Platform</h1>
          <p className="mb-8 text-[#0077B5]">
            Experience our interactive learning platform with gamified levels and progress tracking.
          </p>
          <button
            className="px-6 py-3 bg-[#0077B5] text-white rounded-md hover:bg-[#00B4D8] transition-colors"
            onClick={() => setShowDemo(true)}
          >
            Start Demo
          </button>
        </div>
      ) : (
        <LevelCards />
      )}
    </div>
  )
}