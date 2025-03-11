"use client"

import React from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

function CongratsBox() {
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [])

  return (
    <motion.div
      className="congrats-box"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <h3>Congratulations!</h3>
      <p>You've answered the daily question correctly!</p>
    </motion.div>
  )
}

export default CongratsBox

