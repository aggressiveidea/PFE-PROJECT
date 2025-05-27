import { useState } from "react"
import { Search } from "lucide-react"
import "./SearchBar.css"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search anything..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  )
}



