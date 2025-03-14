import { Search } from "lucide-react"
import "./SearchBar.css"

export default function SearchBar() {
  return (
    <div className="search-bar">
      <div className="search-input-container">
        <Search className="search-icon" size={20} />
        <input type="text" placeholder="Search anything..." className="search-input" />
      </div>
    </div>
  )
}

