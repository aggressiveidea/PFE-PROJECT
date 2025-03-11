"use client"
import { motion } from "framer-motion"

function GetStartedBtn({ displayedText, onClick }) {
  return (
    <motion.button
      className="get-started-btn"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {displayedText}
    </motion.button>
  )
}

export default GetStartedBtn

