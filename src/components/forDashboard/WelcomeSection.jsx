import "./WelcomeSection.css"

export default function WelcomeSection({ role }) {
  return (
    <div className="welcome-section">
      <h1 className="welcome-title">Welcome back</h1>
      <p className="welcome-subtitle">{role}, here's the website's status</p>
    </div>
  )
}
