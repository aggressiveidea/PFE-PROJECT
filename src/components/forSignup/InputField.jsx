const InputField = ({ type = "text", placeholder, name, value, onChange, className = "" }) => {
  return (
    <div className={`input-field ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
  )
}

export default InputField
