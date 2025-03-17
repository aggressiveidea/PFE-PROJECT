import EnhancedLibrary from "./profileLibrary";
import "./Profile-page.css";

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            <img
              src="/placeholder.svg?height=100&width=100"
              alt="User avatar"
            />
          </div>
          <div className="profile-details">
            <h1 className="profile-name">Ahmed Hassan</h1>
            <p className="profile-role">Legal IT Specialist</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">42</span>
                <span className="stat-label">Saved Terms</span>
              </div>
              <div className="stat">
                <span className="stat-value">16</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="stat">
                <span className="stat-value">8</span>
                <span className="stat-label">Contributions</span>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-edit-button">Edit Profile</button>
          <button className="profile-settings-button">Settings</button>
        </div>
      </header>

      <div className="profile-content">
        <EnhancedLibrary />
      </div>
    </div>
  );
};

export default ProfilePage;

