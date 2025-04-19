"use client"

import { useEffect, useRef } from "react"
import "./BackgroundGradient.css"

const BackgroundGradient = ({ darkMode }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create gradient blobs
    const blobs = []
    const blobCount = 3

    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 100,
        xSpeed: (Math.random() - 0.5) * 0.5,
        ySpeed: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 60 + 240, // Blue to purple range
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw blobs
      blobs.forEach((blob) => {
        // Move blob
        blob.x += blob.xSpeed
        blob.y += blob.ySpeed

        // Bounce off edges
        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius

        // Draw gradient
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius)

        if (darkMode) {
          gradient.addColorStop(0, `hsla(${blob.hue}, 70%, 60%, 0.2)`)
          gradient.addColorStop(1, `hsla(${blob.hue}, 70%, 60%, 0)`)
        } else {
          gradient.addColorStop(0, `hsla(${blob.hue}, 70%, 80%, 0.15)`)
          gradient.addColorStop(1, `hsla(${blob.hue}, 70%, 80%, 0)`)
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [darkMode])

  return <canvas ref={canvasRef} className="background-gradient" />
}

export default BackgroundGradient
