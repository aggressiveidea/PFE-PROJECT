"use client"
import "./checkBox.css"

function CheckBox({ name, checked, onChange, label = "Remember me" }) {
  return (
    <div className="checkbox-container">
      <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} />
      <label htmlFor={name}>{label}</label>
    </div>
  )
}

export default CheckBox

