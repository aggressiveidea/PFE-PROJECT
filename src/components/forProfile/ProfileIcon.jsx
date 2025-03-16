export default function ProfileIcon() {
    return (
      <div className="profile-wrapper">
        <div className="profile-icon">
          <svg viewBox="0 0 24 24" fill="none" className="user-icon">
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="profile-dropdown">
          <span className="username">John Doe</span>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    )
  }
  
  