import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react"
import { User, Bell, Settings, LogOut, ChevronDown } from "lucide-react"
import "./ProfileSection.css"

export default function ProfileSection() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="profile-section" ref={dropdownRef}>
      <div className="notifications">
        <button className="notification-button">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
      </div>

      <div className="profile-container">
        <button className="profile-button" onClick={toggleDropdown}>
          <div className="profile-avatar">
            <User size={20} />
          </div>
          <div className="profile-info">
            <span className="profile-name">Admin User</span>
            <span className="profile-role">Administrator</span>
          </div>
          <ChevronDown
            size={16}
            className={`dropdown-icon ${dropdownOpen ? "open" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <span className="dropdown-name">Admin User</span>
              <span className="dropdown-email">admin@example.com</span>
            </div>

            <div className="dropdown-divider"></div>

            <ul className="dropdown-menu">
              <li className="dropdown-item">
                <Link to="/profile" className="dropdown-link">
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
              </li>
              <li className="dropdown-item">
                <Link to="/settings" className="dropdown-link">
                  <Settings size={16} />
                  <span>Account Settings</span>
                </Link>
              </li>
              <li className="dropdown-item">
                <button className="dropdown-link logout">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

