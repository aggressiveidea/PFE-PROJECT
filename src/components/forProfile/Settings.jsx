"use client"

import { useState, useEffect, useRef } from "react"
import Header from "../forHome/Header"
import Sidebar from "../forDashboard/Sidebar"
import Footer from "../forHome/Footer"
import { User, Lock, LogOut, Trash2, Bell, ImageIcon, Eye, EyeOff, AlertTriangle } from "lucide-react"
import "./Settings.css"
import { requestPasswordReset } from "../../services/Api"

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

  // New state for reset password email
  const [resetEmail, setResetEmail] = useState("")
  const [resetEmailStatus, setResetEmailStatus] = useState({ loading: false, success: false, error: "" })

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
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

          // Pre-fill reset email with user's email
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
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
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

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") {
      return
    }

    localStorage.removeItem("authData")
    localStorage.removeItem("user")

    window.location.href = "/"
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

  // New function to handle password reset request
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

    // Email format validation
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
      // Use the updated requestPasswordReset function
      const result = await requestPasswordReset(resetEmail)

      // Always show success message even if email doesn't exist (security best practice)
      setResetEmailStatus({
        loading: false,
        success: true,
        error: "",
      })

      // Clear success message after 5 seconds
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
    <div className={`settings-page ${darkMode ? "dark-mode" : ""}`}>
      <Header darkMode={darkMode} language={language} setLanguage={setLanguage} />
      <div className="settings-content">
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          mobileOpen={mobileOpen}
          closeMobileMenu={closeMobileMenu}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className={`settings-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <button className="mobile-menu-button" onClick={openMobileMenu} aria-label="Open menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <h1 className="settings-title">Account Settings</h1>

          {loading ? (
            <div className="settings-loading">
              <div className="spinner"></div>
              <p>Loading your account settings...</p>
            </div>
          ) : !user ? (
            <div className="settings-not-logged-in">
              <p>You need to be logged in to access account settings.</p>
              <a href="/login" className="settings-login-button">
                Log In
              </a>
            </div>
          ) : (
            <div className="settings-container">
              <section className="settings-section">
                <h2 className="section-title">
                  <User size={20} />
                  Profile Information
                </h2>
                <div className="profile-info">
                  <div className="profile-picture-container">
                    <div className="profile-picture">
                      {previewUrl ? (
                        <img src={previewUrl || "/placeholder.svg"} alt="Profile" />
                      ) : (
                        <div className="profile-initials">
                          {user.firstName ? user.firstName[0] : ""}
                          {user.lastName ? user.lastName[0] : ""}
                        </div>
                      )}
                    </div>
                    <div className="profile-picture-actions">
                      <button className="upload-picture-button" onClick={() => fileInputRef.current.click()}>
                        <ImageIcon size={16} />
                        Change Picture
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePictureChange}
                        accept="image/*"
                        className="hidden-file-input"
                      />
                      {profilePicture && (
                        <button className="save-picture-button" onClick={handleProfilePictureUpload}>
                          Save Picture
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="profile-details">
                    <div className="profile-field">
                      <label>Username</label>
                      <p>{user.username || "Not set"}</p>
                    </div>
                    <div className="profile-field">
                      <label>Email</label>
                      <p>{user.email || "Not set"}</p>
                    </div>
                    <div className="profile-field">
                      <label>First Name</label>
                      <p>{user.firstName || "Not set"}</p>
                    </div>
                    <div className="profile-field">
                      <label>Last Name</label>
                      <p>{user.lastName || "Not set"}</p>
                    </div>
                    <div className="profile-field">
                      <label>Role</label>
                      <p>{user.role || "User"}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="settings-section">
                <h2 className="section-title">
                  <Lock size={20} />
                  Change Password
                </h2>
                <form className="password-form" onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="password-input-container">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="password-input-container">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="password-error">
                      <AlertTriangle size={16} />
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && <div className="password-success">{passwordSuccess}</div>}

                  <button type="submit" className="change-password-button">
                    Change Password
                  </button>
                </form>
              </section>

              <section className="settings-section">
                <h2 className="section-title">
                  <Lock size={20} />
                  Forgot Password
                </h2>
                <div className="forgot-password-container">
                  <p className="forgot-password-description">
                    Forgot your password? No problem. Enter your email address below and we'll send you instructions to
                    reset your password.
                  </p>
                  <form className="forgot-password-form" onSubmit={handleResetPasswordRequest}>
                    <div className="form-group">
                      <label htmlFor="resetEmail">Email Address</label>
                      <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="reset-email-input"
                        required
                      />
                    </div>

                    {resetEmailStatus.error && (
                      <div className="password-error">
                        <AlertTriangle size={16} />
                        {resetEmailStatus.error}
                      </div>
                    )}

                    {resetEmailStatus.success && (
                      <div className="password-success">
                        If your email exists in our system, you will receive password reset instructions shortly. Please
                        check your inbox and spam folder.
                      </div>
                    )}

                    <div className="reset-actions">
                      <button type="submit" className="reset-password-button" disabled={resetEmailStatus.loading}>
                        {resetEmailStatus.loading ? (
                          <span className="loading-spinner">
                            <span className="spinner"></span>
                            Sending...
                          </span>
                        ) : (
                          "Send Reset Instructions"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </section>

              <section className="settings-section">
                <h2 className="section-title">
                  <Bell size={20} />
                  Notification Preferences
                </h2>
                <div className="notification-preferences">
                  <div className="notification-option">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="notification-details">
                      <h3>Email Notifications</h3>
                      <p>Receive notifications about account activity via email</p>
                    </div>
                  </div>

                  <div className="notification-option">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="notification-details">
                      <h3>Push Notifications</h3>
                      <p>Receive push notifications in your browser</p>
                    </div>
                  </div>

                  <div className="notification-option">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={newsletterSubscription}
                        onChange={() => setNewsletterSubscription(!newsletterSubscription)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <div className="notification-details">
                      <h3>Newsletter Subscription</h3>
                      <p>Receive our monthly newsletter with updates and tips</p>
                    </div>
                  </div>

                  <button className="save-notifications-button" onClick={saveNotificationPreferences}>
                    Save Preferences
                  </button>
                </div>
              </section>

              <section className="settings-section danger-zone">
                <h2 className="section-title danger">Account Actions</h2>
                <div className="account-actions">
                  <div className="action-card">
                    <div className="action-icon logout">
                      <LogOut size={24} />
                    </div>
                    <div className="action-details">
                      <h3>Logout</h3>
                      <p>Sign out of your account on this device</p>
                      <button className="logout-button" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>

                  <div className="action-card">
                    <div className="action-icon delete">
                      <Trash2 size={24} />
                    </div>
                    <div className="action-details">
                      <h3>Delete Account</h3>
                      <p>Permanently delete your account and all associated data</p>
                      <button className="delete-account-button" onClick={() => setShowDeleteModal(true)}>
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
      <Footer darkMode={darkMode} setDarkMode={setDarkMode} />

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal" ref={modalRef}>
            <h2>Delete Account</h2>
            <p className="delete-warning">
              <AlertTriangle size={24} />
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <p>To confirm, type "DELETE" in the field below:</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="delete-confirm-input"
            />
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="confirm-delete-button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE"}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
