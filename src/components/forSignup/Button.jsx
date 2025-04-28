"use client"

const Button = ({ text, type = "button", onClick, disabled = false, className = "" }) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`custom-button ${className}`}>
      {text}
    </button>
  )
}

export default Button
