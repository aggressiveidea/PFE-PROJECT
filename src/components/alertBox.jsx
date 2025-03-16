"use client"
import "./alertBox.css"

function AlertBox({ message, onClose }) {
  return (
    <div className="alert-box">
      <div className="message">{message}</div>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  )
}

export default AlertBox

