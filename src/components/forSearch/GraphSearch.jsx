"use client"

import { useState, useRef, useEffect } from "react"
import { ZoomIn, ZoomOut, Download, Maximize, RotateCw } from "lucide-react"
import "./GraphSearch.css"

const GraphSearch = () => {
  const [activeButton, setActiveButton] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const graphRef = useRef(null)

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName)

    // Handle zoom functionality
    if (buttonName === "zoomIn") {
      setZoomLevel((prev) => Math.min(prev + 0.2, 3))
    } else if (buttonName === "zoomOut") {
      setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
    } else if (buttonName === "fullScreen") {
      if (graphRef.current && graphRef.current.requestFullscreen) {
        graphRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`)
        })
      }
    } else if (buttonName === "download") {
      // Placeholder for download functionality
      alert("Download functionality would save the current graph view")
    } else if (buttonName === "reload") {
      // Reset zoom and position
      setZoomLevel(1)
      setPosition({ x: 0, y: 0 })
    }

    // Reset active button state after a short delay
    setTimeout(() => setActiveButton(null), 300)
  }

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      })
    }
  }

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startPosition])

  return (
    <div className="graph-search">
      <div className="toolbar">
        <button
          className={`tool-btn ${activeButton === "zoomIn" ? "active" : ""}`}
          onClick={() => handleButtonClick("zoomIn")}
          aria-label="Zoom In"
        >
          <ZoomIn size={18} />
          <span>Zoom In</span>
        </button>
        <button
          className={`tool-btn ${activeButton === "zoomOut" ? "active" : ""}`}
          onClick={() => handleButtonClick("zoomOut")}
          aria-label="Zoom Out"
        >
          <ZoomOut size={18} />
          <span>Zoom Out</span>
        </button>
        <button
          className={`tool-btn ${activeButton === "download" ? "active" : ""}`}
          onClick={() => handleButtonClick("download")}
          aria-label="Download"
        >
          <Download size={18} />
          <span>Download</span>
        </button>
        <button
          className={`tool-btn ${activeButton === "fullScreen" ? "active" : ""}`}
          onClick={() => handleButtonClick("fullScreen")}
          aria-label="Full Screen"
        >
          <Maximize size={18} />
          <span>Full Screen</span>
        </button>
        <button
          className={`tool-btn ${activeButton === "reload" ? "active" : ""}`}
          onClick={() => handleButtonClick("reload")}
          aria-label="Reload"
        >
          <RotateCw size={18} />
          <span>Reload</span>
        </button>
      </div>

      <div
        ref={graphRef}
        className="graph-container"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          className="graph-placeholder"
          style={{
            transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease",
          }}
        >
          <div className="graph-icon">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <circle cx="30" cy="30" r="10" className="node" />
              <circle cx="70" cy="30" r="10" className="node" />
              <circle cx="50" cy="70" r="10" className="node" />
              <line x1="30" y1="30" x2="70" y2="30" className="edge" />
              <line x1="30" y1="30" x2="50" y2="70" className="edge" />
              <line x1="70" y1="30" x2="50" y2="70" className="edge" />
            </svg>
          </div>
          <p className="placeholder-title">No data available</p>
          <p className="placeholder-subtitle">Graph visualization will appear here</p>
          <button className="load-sample-btn">Load Sample Data</button>
        </div>
      </div>

      <div className="zoom-indicator">
        <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
      </div>
    </div>
  )
}

export default GraphSearch

