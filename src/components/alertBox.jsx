import "../styles/AlertBox.css"

const AlertBox = ({ message, type = "error", onClose }) => {
  const alertClass = `alert-box ${type === "success" ? "alert-success" : "alert-error"}`

  return (
    <div className={alertClass}>
      <div className="alert-icon">
        {type === "success" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
      </div>
      <div className="message">{message}</div>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  )
}

export default AlertBox

