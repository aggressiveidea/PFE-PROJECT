"use client"

import { useState, useEffect } from "react"
import { Shield, Edit2, Save, X, Camera, User, Mail, FileText } from "lucide-react"
import Sidebar from "../forDashboard/Sidebar"
import Header from "../forHome/Header"
import Footer from "../forHome/Footer"
import "./PersonalInfo.css"
import { updateUser, getProfile } from "../../services/Api"

export default function PersonalInfo() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // User state with default empty values
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userBio: "",
    profileImgUrl: "/placeholder.svg?height=200&width=200",
    role: "User",
    _id: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({ ...user })
  const [previewImage, setPreviewImage] = useState(null)

  // Check for dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [])

  // Update dark mode when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

  // Fetch user data from API or localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        // Check if we have a token in localStorage
        const authData = JSON.parse(localStorage.getItem("authData") || "{}")
        const token = authData.token

        if (token) {
          // If we have a token, fetch the user profile from the API
          const profileData = await getProfile(token)
          console.log("Profile data from API:", profileData)

          if (profileData && profileData.user) {
            // Set the user data from the API response
            const userData = {
              firstName: profileData.user.firstName || "",
              lastName: profileData.user.lastName || "",
              email: profileData.user.email || "",
              userBio: profileData.user.userBio || "",
              profileImgUrl: profileData.user.profileImgUrl || "/placeholder.svg?height=200&width=200",
              role: profileData.user.role || "User",
              _id: profileData.user._id || profileData.user.id || "",
            }

            setUser(userData)
            setEditedUser(userData)

            // Update localStorage with the latest data including ID
            localStorage.setItem("user", JSON.stringify(userData))

            // Dispatch event to notify other components of user update
            window.dispatchEvent(new Event("userUpdated"))
          }
        } else {
          // If no token, try to get user data from localStorage (from signup)
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
          console.log("User data from localStorage:", storedUser)

          if (storedUser && storedUser.email) {
            const userData = {
              firstName: storedUser.firstName || "",
              lastName: storedUser.lastName || "",
              email: storedUser.email || "",
              userBio: storedUser.userBio || "",
              profileImgUrl: storedUser.profileImgUrl || "/placeholder.svg?height=200&width=200",
              role: storedUser.role || "User",
              _id: storedUser._id || storedUser.id || "",
            }

            setUser(userData)
            setEditedUser(userData)
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const openMobileMenu = () => {
    setMobileOpen(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedUser({
      ...editedUser,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setEditedUser({
          ...editedUser,
          profileImgUrl: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      // Only proceed if we have a user ID
      if (!user._id) {
        console.error("User ID is missing:", user)
        alert("Cannot update profile: User ID is missing")
        return
      }

      console.log("Updating user with ID:", user._id)

      // Call the API to update the user
      const response = await updateUser(user._id, editedUser)
      console.log("Update response:", response)

      if (response && !response.error) {
        // Update the local user state with the edited data
        setUser(editedUser)

        // Update the user data in localStorage to keep it in sync
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        const updatedUserData = {
          ...storedUser,
          firstName: editedUser.firstName,
          lastName: editedUser.lastName,
          email: editedUser.email,
          userBio: editedUser.userBio,
          profileImgUrl: editedUser.profileImgUrl,
          role: editedUser.role,
          _id: editedUser._id || user._id,
        }

        localStorage.setItem("user", JSON.stringify(updatedUserData))

        // Dispatch event to notify other components of user update
        window.dispatchEvent(new Event("userUpdated"))

        setIsEditing(false)
        setPreviewImage(null)
        alert("Profile updated successfully!")
      } else {
        throw new Error(response.error || "Failed to update profile")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      alert("Failed to update profile: " + (err.message || "Unknown error"))
    }
  }

  const handleCancel = () => {
    setEditedUser({ ...user })
    setIsEditing(false)
    setPreviewImage(null)
  }

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "super-admin":
        return "badge-admin"
      case "ict-expert":
        return "badge-expert"
      case "content-admin":
        return "badge-content"
      default:
        return "badge-user"
    }
  }

  return (
    <div className={`app-container ${darkMode ? "dark" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Header language={language} setLanguage={setLanguage} />

      <div className="content-wrapper">
        <Sidebar
          collapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          mobileOpen={mobileOpen}
          closeMobileMenu={closeMobileMenu}
          darkMode={darkMode}
        />

        <div className="main-content">
          <button className="mobile-menu-button" onClick={openMobileMenu}>
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

          <div className="personal-info-container">
            <div className="feature-badge">Personal Profile</div>
            <div className="personal-info-header">
              <h1>Personal Information</h1>
              <p>View and manage your profile information</p>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading profile data...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
              </div>
            ) : (
              <div className="personal-info-content">
                <div className="profile-card">
                  <div className="profile-banner">
                    <div className="banner-overlay"></div>
                  </div>

                  <div className="profile-main">
                    <div className="profile-image-container">
                      <div className="profile-image">
                        <img
                          src={isEditing ? previewImage || editedUser.profileImgUrl : user.profileImgUrl}
                          alt="Profile"
                          className="profile-img"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=200&width=200"
                          }}
                        />
                        {isEditing && (
                          <>
                            <label htmlFor="profile-upload" className="profile-upload-label">
                              <Camera size={20} />
                              <span>Change</span>
                            </label>
                            <input
                              type="file"
                              id="profile-upload"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="profile-upload-input"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="profile-info">
                      <div className="profile-title">
                        <h2>
                          {user.firstName} {user.lastName}
                        </h2>
                        <div className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                          <Shield size={14} />
                          <span>{user.role}</span>
                        </div>
                      </div>

                      <div className="profile-actions">
                        {!isEditing ? (
                          <button className="edit-button" onClick={() => setIsEditing(true)}>
                            <Edit2 size={18} />
                            <span>Edit Profile</span>
                          </button>
                        ) : (
                          <div className="edit-actions">
                            <button className="save-button" onClick={handleSave}>
                              <Save size={18} />
                              <span>Save Changes</span>
                            </button>
                            <button className="cancel-button" onClick={handleCancel}>
                              <X size={18} />
                              <span>Cancel</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="profile-body">
                    <div className="info-section">
                      <h3>
                        <User size={18} />
                        <span>Basic Information</span>
                      </h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>First Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="firstName"
                              value={editedUser.firstName}
                              onChange={handleInputChange}
                              className="input-field"
                            />
                          ) : (
                            <p>{user.firstName}</p>
                          )}
                        </div>
                        <div className="info-item">
                          <label>Last Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="lastName"
                              value={editedUser.lastName}
                              onChange={handleInputChange}
                              className="input-field"
                            />
                          ) : (
                            <p>{user.lastName}</p>
                          )}
                        </div>
                        <div className="info-item full-width">
                          <label>
                            <Mail size={16} className="icon" />
                            <span>Email Address</span>
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={editedUser.email}
                              onChange={handleInputChange}
                              className="input-field"
                              disabled // Email should typically not be editable
                            />
                          ) : (
                            <p>{user.email}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3>
                        <FileText size={18} />
                        <span>About</span>
                      </h3>
                      <div className="info-item full-width">
                        <label>Bio</label>
                        {isEditing ? (
                          <textarea
                            name="userBio"
                            value={editedUser.userBio || ""}
                            onChange={handleInputChange}
                            rows="4"
                            className="textarea-field"
                            placeholder="Tell us about yourself..."
                          ></textarea>
                        ) : (
                          <p className="user-bio">{user.userBio || "No bio provided yet."}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} setDarkMode={setDarkMode} language={language} />
    </div>
  )
}


