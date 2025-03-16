"use client"
import "./inputField.css"

function InputFeild({ placeholder, type = "text", name, value, onChange, className }) {
  return (
    <div className={`input-field ${className || ""}`}>
      <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} />
    </div>
  )
}

export default InputFeild

