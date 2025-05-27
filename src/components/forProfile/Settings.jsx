import { useState, useEffect, useRef } from "react"
import Header from "../forHome/Header"
import Sidebar from "../forDashboard/Sidebar"
import Footer from "../forHome/Footer"
import { User, Lock, LogOut, Trash2, ImageIcon, AlertTriangle, Calendar, Clock, Code, Terminal } from "lucide-react"
import "./Settings.css"
import { requestPasswordReset, deleteUser } from "../../services/Api"

const Settings = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const modalRef = useRef(null)

  const [profilePicture, setProfilePicture] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const fileInputRef = useRef(null)

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [newsletterSubscription, setNewsletterSubscription] = useState(false)

  const [resetEmail, setResetEmail] = useState("")
  const [resetEmailStatus, setResetEmailStatus] = useState({ loading: false, success: false, error: "" })

  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("settingsPage-dark-mode")
    } else {
      document.body.classList.remove("settingsPage-dark-mode")
    }

    const loadUserData = async () => {
      try {
        setLoading(true)
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          if (userData.profileImgUrl && !userData.profileImgUrl.includes("placeholder.svg")) {
            setPreviewUrl(userData.profileImgUrl)
          }
          setEmailNotifications(userData.emailNotifications !== false)
          setPushNotifications(userData.pushNotifications !== false)
          setNewsletterSubscription(userData.newsletterSubscription === true)
          if (userData.email) {
            setResetEmail(userData.email)
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)

    if (darkMode) {
      document.body.classList.add("settingsPage-dark-mode")
    } else {
      document.body.classList.remove("settingsPage-dark-mode")
    }
  }, [darkMode])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowDeleteModal(false)
      }
    }

    if (showDeleteModal) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDeleteModal])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const openMobileMenu = () => {
    setMobileOpen(true)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()

    setPasswordError("")
    setPasswordSuccess("")

    if (!currentPassword) {
      setPasswordError("Current password is required")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    setTimeout(() => {
      setPasswordSuccess("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        setPasswordSuccess("")
      }, 3000)
    }, 1000)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      return
    }

    setDeleteLoading(true)
    setDeleteError("")

    try {
  
      const userId = user._id || user.id

      if (!userId) {
        throw new Error("User ID not found")
      }
      await deleteUser(userId)
      localStorage.removeItem("authData")
      localStorage.removeItem("user")

      alert("Your account has been successfully deleted.")
      window.location.href = "/"
    } catch (error) {
      console.error("Error deleting account:", error)
      setDeleteError(error.message || "Failed to delete account. Please try again later.")
      setDeleteLoading(false)
    }
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePicture(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfilePictureUpload = () => {
    if (!profilePicture) return

    if (user) {
      const updatedUser = { ...user, profileImgUrl: previewUrl }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      alert("Profile picture updated successfully")
    }
  }

  const saveNotificationPreferences = () => {
    if (user) {
      const updatedUser = {
        ...user,
        emailNotifications,
        pushNotifications,
        newsletterSubscription,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      alert("Notification preferences saved successfully")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authData")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleResetPasswordRequest = async (e) => {
    e.preventDefault()

    if (!resetEmail) {
      setResetEmailStatus({
        loading: false,
        success: false,
        error: "Please enter your email address",
      })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail)) {
      setResetEmailStatus({
        loading: false,
        success: false,
        error: "Please enter a valid email address",
      })
      return
    }

    setResetEmailStatus({
      loading: true,
      success: false,
      error: "",
    })

    try {
      const result = await requestPasswordReset(resetEmail)
      setResetEmailStatus({
        loading: false,
        success: true,
        error: "",
      })

      setTimeout(() => {
        setResetEmailStatus((prev) => ({
          ...prev,
          success: false,
        }))
      }, 5000)
    } catch (error) {
      console.error("Error sending reset email:", error)
      setResetEmailStatus({
        loading: false,
        success: false,
        error: "An error occurred. Please try again later.",
      })
    }
  }

  return (
    <div className="settingsPage-app-container">
      <Header language={language} setLanguage={setLanguage} darkMode={false} />
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        closeMobileMenu={closeMobileMenu}
      />

      <main className={`settingsPage-main-content ${sidebarCollapsed ? "settingsPage-sidebar-collapsed" : ""}`}>
        <div className="settingsPage-wrapper">
          <div className="settingsPage-welcome-section">
            <div className="settingsPage-welcome-content">
              <div className="settingsPage-welcome-badge">
                <User size={16} />
                <span>Settings Panel</span>
              </div>
              <h1 className="settingsPage-welcome-title">
                Account Settings<span className="settingsPage-code-accent">{"<settings/>"}</span>
              </h1>
              <p className="settingsPage-welcome-subtitle">Manage your account preferences and security settings</p>

              <div className="settingsPage-code-snippet">
                <div className="settingsPage-code-header">
                  <div className="settingsPage-code-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="settingsPage-code-title">settings.js</span>
                </div>
                <div className="settingsPage-code-content">
                  <span className="settingsPage-code-line">
                    <span className="settingsPage-code-comment">// Account configuration</span>
                  </span>
                  <span className="settingsPage-code-line">
                    <span className="settingsPage-code-keyword">const</span>{" "}
                    <span className="settingsPage-code-variable">user</span>{" "}
                    <span className="settingsPage-code-punctuation">=</span>{" "}
                    <span className="settingsPage-code-punctuation">{"{"}</span>
                  </span>
                  <span className="settingsPage-code-line">
                    &nbsp;&nbsp;<span className="settingsPage-code-property">status</span>
                    <span className="settingsPage-code-punctuation">:</span>{" "}
                    <span className="settingsPage-code-string">"active"</span>
                    <span className="settingsPage-code-punctuation">,</span>
                  </span>
                  <span className="settingsPage-code-line">
                    &nbsp;&nbsp;<span className="settingsPage-code-property">preferences</span>
                    <span className="settingsPage-code-punctuation">:</span>{" "}
                    <span className="settingsPage-code-string">"updated"</span>
                  </span>
                  <span className="settingsPage-code-line">
                    <span className="settingsPage-code-punctuation">{"}"}</span>
                    <span className="settingsPage-code-punctuation">;</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="settingsPage-welcome-stats">
              <div className="settingsPage-date-info">
                <div className="settingsPage-date-item">
                  <Calendar size={16} />
                  <span>
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="settingsPage-date-item">
                  <Clock size={16} />
                  <span>
                    {new Date().toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="settingsPage-tech-bg">
              <div className="settingsPage-circuit-pattern"></div>
              <div className="settingsPage-floating-icons">
                <Code size={24} className="settingsPage-floating-icon" />
                <Terminal size={20} className="settingsPage-floating-icon" />
                <User size={22} className="settingsPage-floating-icon" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="settingsPage-loading-container">
              <div className="settingsPage-loading-spinner"></div>
              <p>Loading your account settings...</p>
            </div>
          ) : !user ? (
            <div className="settingsPage-not-logged-in">
              <p>You need to be logged in to access account settings.</p>
              <a href="/login" className="settingsPage-login-button">
                Log In
              </a>
            </div>
          ) : (
            <div className="settingsPage-content">
              <div className="settingsPage-profile-card">
                <h2 className="settingsPage-section-title">
                  <User size={20} />
                  Profile Information
                </h2>
                <div className="settingsPage-profile-info">
                  <div className="settingsPage-profile-picture-container">
                    <div className="settingsPage-profile-picture">
                      {previewUrl ? (
                        <img src={previewUrl || "/placeholder.svg"} alt="Profile" />
                      ) : (
                        <div className="settingsPage-profile-initials">
                          {user.firstName ? user.firstName[0] : ""}
                          {user.lastName ? user.lastName[0] : ""}
                        </div>
                      )}
                    </div>
                    <div className="settingsPage-profile-picture-actions">
                      <button
                        className="settingsPage-upload-picture-button"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <ImageIcon size={16} />
                        Change Picture
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePictureChange}
                        accept="image/*"
                        className="settingsPage-hidden-file-input"
                      />
                      {profilePicture && (
                        <button className="settingsPage-save-picture-button" onClick={handleProfilePictureUpload}>
                          Save Picture
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="settingsPage-profile-details">
                    <div className="settingsPage-profile-field">
                      <label>Email</label>
                      <p>{user.email || "Not set"}</p>
                    </div>
                    <div className="settingsPage-profile-field">
                      <label>First Name</label>
                      <p>{user.firstName || "Not set"}</p>
                    </div>
                    <div className="settingsPage-profile-field">
                      <label>Last Name</label>
                      <p>{user.lastName || "Not set"}</p>
                    </div>
                    <div className="settingsPage-profile-field">
                      <label>Role</label>
                      <p>{user.role || "User"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="settingsPage-profile-card">
                <h2 className="settingsPage-section-title">
                  <Lock size={20} />
                  Password Reset
                </h2>
                <div className="settingsPage-forgot-password-container">
                  <p className="settingsPage-forgot-password-description">
                    Forgot your password? No problem. Enter your email address below and we'll send you instructions to
                    reset your password.
                  </p>
                  <form className="settingsPage-forgot-password-form" onSubmit={handleResetPasswordRequest}>
                    <div className="settingsPage-form-group">
                      <label htmlFor="resetEmail">Email Address</label>
                      <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="settingsPage-reset-email-input"
                        required
                      />
                    </div>

                    {resetEmailStatus.error && (
                      <div className="settingsPage-password-error">
                        <AlertTriangle size={16} />
                        {resetEmailStatus.error}
                      </div>
                    )}

                    {resetEmailStatus.success && (
                      <div className="settingsPage-password-success">
                        If your email exists in our system, you will receive password reset instructions shortly. Please
                        check your inbox and spam folder.
                      </div>
                    )}

                    <div className="settingsPage-reset-actions">
                      <button
                        type="submit"
                        className="settingsPage-reset-password-button"
                        disabled={resetEmailStatus.loading}
                      >
                        {resetEmailStatus.loading ? (
                          <span className="settingsPage-loading-spinner">
                            <span className="settingsPage-spinner"></span>
                            Sending...
                          </span>
                        ) : (
                          "Send Reset Instructions"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="settingsPage-profile-card settingsPage-danger-zone">
                <h2 className="settingsPage-section-title settingsPage-danger">Account Actions</h2>
                <div className="settingsPage-account-actions">
                  <div className="settingsPage-action-card">
                    <div className="settingsPage-action-icon settingsPage-logout">
                      <LogOut size={24} />
                    </div>
                    <div className="settingsPage-action-details">
                      <h3>Logout</h3>
                      <p>Sign out of your account on this device</p>
                      <button className="settingsPage-logout-button" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>

                  <div className="settingsPage-action-card">
                    <div className="settingsPage-action-icon settingsPage-delete">
                      <Trash2 size={24} />
                    </div>
                    <div className="settingsPage-action-details">
                      <h3>Delete Account</h3>
                      <p>Permanently delete your account and all associated data</p>
                      <button className="settingsPage-delete-account-button" onClick={() => setShowDeleteModal(true)}>
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer darkMode={darkMode} setDarkMode={setDarkMode} />

      {showDeleteModal && (
        <div className="settingsPage-modal-overlay">
          <div className="settingsPage-delete-modal" ref={modalRef}>
            <h2>Delete Account</h2>
            <p className="settingsPage-delete-warning">
              <AlertTriangle size={24} />
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <p>To confirm, type "DELETE" in the field below:</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="settingsPage-delete-confirm-input"
            />

            {deleteError && (
              <div className="settingsPage-password-error">
                <AlertTriangle size={16} />
                {deleteError}
              </div>
            )}

            <div className="settingsPage-modal-actions">
              <button
                className="settingsPage-cancel-button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteError("")
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="settingsPage-confirm-delete-button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || deleteLoading}
              >
                {deleteLoading ? (
                  <span className="settingsPage-loading-spinner">
                    <span className="settingsPage-spinner"></span>
                    Deleting...
                  </span>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
