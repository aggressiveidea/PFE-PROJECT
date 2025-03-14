import "./BioSection.css"

function BioSection({ profile }) {
  // Add a null check to prevent the error
  if (!profile) {
    return (
      <div className="bio-section">
        <h2 className="section-title">Biography</h2>
        <div className="bio-content">
          <p>Profile data not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bio-section">
      <h2 className="section-title">Biography</h2>

      <div className="bio-content">
        <div className="bio-header">
          <div className="bio-avatar">
            {profile.fullName
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </div>
          <div className="bio-name-container">
            <h3 className="bio-name">{profile.fullName}</h3>
            <p className="bio-role">{profile.additionalInfo}</p>
          </div>
        </div>

        <div className="bio-details">
          <div className="bio-item">
            <h4 className="bio-label">Email</h4>
            <div className="bio-value-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="bio-icon"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span className="bio-value">{profile.email}</span>
            </div>
          </div>

          <div className="bio-item">
            <h4 className="bio-label">Date of Birth</h4>
            <div className="bio-value-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="bio-icon"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className="bio-value">{profile.dateOfBirth}</span>
            </div>
          </div>

          <div className="bio-item">
            <h4 className="bio-label">Institution</h4>
            <div className="bio-value-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="bio-icon"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span className="bio-value">{profile.institution}</span>
            </div>
          </div>
        </div>

        <div className="bio-text">
          <h4 className="bio-section-title">About Me</h4>
          <p className="bio-paragraph">{profile.parcours}</p>

          {profile.experience && (
            <>
              <h4 className="bio-section-title">Experience</h4>
              <p className="bio-paragraph">{profile.experience}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BioSection

