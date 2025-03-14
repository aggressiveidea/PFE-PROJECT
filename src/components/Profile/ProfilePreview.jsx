import "./ProfilePreview.css"

function ProfilePreview({ profile }) {
  if (!profile) {
    return (
      <div className="profile-preview">
        <h2 className="section-title">Preview</h2>
        <div className="preview-card">
          <p>Profile data not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-preview">
      <h2 className="section-title">Preview</h2>

      <div className="preview-card">
        <div className="profile-header">
          <div className="avatar">
            {profile.fullName
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </div>
          <h3 className="profile-name">{profile.fullName}</h3>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="detail-icon"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>{profile.email}</span>
          </div>

          <div className="detail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="detail-icon"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{profile.dateOfBirth}</span>
          </div>

          <div className="detail-section">
            <h4 className="detail-title">Student Information</h4>
            <p className="detail-text">{profile.institution}</p>
            <p className="detail-subtext">{profile.additionalInfo}</p>
          </div>

          <div className="detail-section">
            <h4 className="detail-title">Parcours</h4>
            <p className="detail-text">{profile.parcours}</p>
          </div>

          {profile.experience && (
            <div className="detail-section">
              <h4 className="detail-title">Experience</h4>
              <p className="detail-text">{profile.experience}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePreview


