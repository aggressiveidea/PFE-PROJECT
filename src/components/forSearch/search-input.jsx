import { Search } from 'lucide-react'

const SearchInput = ({ 
  placeholder = "Search...", 
  value = "", 
  onChange, 
  onSearch, 
  disabled = false,
  className = ""
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch()
    }
  }

  return (
    <div className={`ict-search-input-wrapper ${className}`}>
      <div className="ict-search-icon-container">
        <Search size={20} className="ict-search-icon" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        className="ict-search-input"
        disabled={disabled}
      />
      {onSearch && (
        <button className="ict-search-button" onClick={onSearch} disabled={disabled}>
          {disabled ? "Searching..." : "Search"}
        </button>
      )}
    </div>
  )
}

export default SearchInput
