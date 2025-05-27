import { useState, useEffect } from "react"
import { Shield, Edit2, Save, X, Camera, User, Mail, FileText, Calendar, Clock, Code, Terminal } from "lucide-react"
import Sidebar from "../forDashboard/Sidebar"
import Header from "../forHome/Header"
import "./PersonalInfo.css"
import { updateUser, getProfile, getUserById } from "../../services/Api"

export default function PersonalInfo() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)


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
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        const userId = storedUser._id || storedUser.id

        console.log("PersonalInfo: Fetching user data with token:", !!token, "and userId:", userId)

        if (token && userId) {
          try {
            // First try to get user by ID
            const userData = await getUserById(userId)
            console.log("PersonalInfo: User data from API by ID:", userData)

            if (userData) {
              const updatedUserData = {
                firstName: userData.firstName || storedUser.firstName || "",
                lastName: userData.lastName || storedUser.lastName || "",
                email: userData.email || storedUser.email || "",
                userBio: userData.userBio || storedUser.userBio || "",
                profileImgUrl:
                  userData.profileImgUrl || storedUser.profileImgUrl || "/placeholder.svg?height=200&width=200",
                role: userData.role || storedUser.role || "User",
                _id: userId,
                isVerified: userData.isVerified || storedUser.isVerified || false,
              }

              setUser(updatedUserData)
              setEditedUser(updatedUserData)

              // Update localStorage with the latest data
              localStorage.setItem("user", JSON.stringify(updatedUserData))

              // Dispatch event to notify other components
              window.dispatchEvent(new Event("userUpdated"))
              return
            }
          } catch (idError) {
            console.error("PersonalInfo: Error fetching user by ID, trying profile API:", idError)

            // If getUserById fails, try the profile API
            try {
              const profileData = await getProfile(token)
              console.log("PersonalInfo: Profile data from API:", profileData)

              if (profileData && profileData.user) {
                const userId = profileData.user._id || profileData.user.id

                const updatedUserData = {
                  firstName: profileData.user.firstName || storedUser.firstName || "",
                  lastName: profileData.user.lastName || storedUser.lastName || "",
                  email: profileData.user.email || storedUser.email || "",
                  userBio: profileData.user.userBio || storedUser.userBio || "",
                  profileImgUrl:
                    profileData.user.profileImgUrl ||
                    storedUser.profileImgUrl ||
                    "/placeholder.svg?height=200&width=200",
                  role: profileData.user.role || storedUser.role || "User",
                  _id: userId,
                  isVerified: profileData.user.isVerified || storedUser.isVerified || false,
                }

                setUser(updatedUserData)
                setEditedUser(updatedUserData)

                // Update localStorage with the latest data
                localStorage.setItem("user", JSON.stringify(updatedUserData))

                // Dispatch event to notify other components
                window.dispatchEvent(new Event("userUpdated"))
                return
              }
            } catch (profileError) {
              console.error("PersonalInfo: Error fetching profile, falling back to localStorage:", profileError)
            }
          }
        }

        // Fall back to localStorage if API calls fail or no token/userId
        if (storedUser && storedUser.email) {
          setUser(storedUser)
          setEditedUser(storedUser)
        } else {
          setError("No user data found. Please log in again.")
        }
      } catch (err) {
        console.error("PersonalInfo: Error fetching user data:", err)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()

    // Listen for userUpdated event
    const handleUserUpdate = () => {
      console.log("PersonalInfo: User updated event received")
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (storedUser && storedUser.email) {
        setUser(storedUser)
        setEditedUser(storedUser)
      }
    }

    window.addEventListener("userUpdated", handleUserUpdate)

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate)
    }
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
      setIsEditing(false) // Disable editing mode immediately to prevent multiple submissions
      setUpdateLoading(true)

      // Log the entire user object to see what's available
      console.log("PersonalInfo: Current user object:", user)

      // Check for ID in different possible locations
      const userId =
        user._id || user.id || editedUser._id || editedUser.id || JSON.parse(localStorage.getItem("user") || "{}")._id

      if (!userId) {
        console.error("PersonalInfo: User ID is missing:", user)
        alert("Cannot update profile: User ID is missing")
        setIsEditing(true) // Re-enable editing if there's an error
        setUpdateLoading(false)
        return
      }

      console.log("PersonalInfo: Updating user with ID:", userId)

      // Create a clean copy of the data to update
      const updateData = {
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        userBio: editedUser.userBio || "",
        // Only include profileImgUrl if it's not the placeholder
        ...(editedUser.profileImgUrl && !editedUser.profileImgUrl.includes("placeholder.svg")
          ? { profileImgUrl: editedUser.profileImgUrl }
          : {}),
      }

      const response = await updateUser(userId, updateData)
      console.log("PersonalInfo: Update response:", response)

      // Check for success based on your backend response format
      if (response && response.success === true) {
        // Update the local user state with the response data
        const updatedUserData = response.data || updateData

        const newUserData = {
          ...user,
          ...updatedUserData,
          _id: userId, // Ensure ID is preserved
        }

        setUser(newUserData)

        // Update localStorage with the latest data
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        const updatedStoredData = {
          ...storedUser,
          firstName: updatedUserData.firstName || editedUser.firstName,
          lastName: updatedUserData.lastName || editedUser.lastName,
          userBio: updatedUserData.userBio || editedUser.userBio || "",
          profileImgUrl: updatedUserData.profileImgUrl || editedUser.profileImgUrl,
          _id: userId,
        }

        localStorage.setItem("user", JSON.stringify(updatedStoredData))

        // Notify other components about the update
        window.dispatchEvent(new Event("userUpdated"))

        setPreviewImage(null)
        alert("Profile updated successfully!")
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (err) {
      console.error("PersonalInfo: Error updating profile:", err)
      alert("Failed to update profile: " + (err.message || "Unknown error"))
      setIsEditing(true) // Re-enable editing if there's an error
    } finally {
      setUpdateLoading(false)
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
        return "profileinfos-badge-admin"
      case "ict-expert":
        return "profileinfos-badge-expert"
      case "content-admin":
        return "profileinfos-badge-content"
      default:
        return "profileinfos-badge-user"
    }
  }

  return (
    <div className="profileinfos-app-container">
      <Header language={language} setLanguage={setLanguage} darkMode={false} />
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        closeMobileMenu={closeMobileMenu}
      />

      <main className={`profileinfos-main-content ${sidebarCollapsed ? "profileinfos-sidebar-collapsed" : ""}`}>
        <div className="profileinfos-wrapper">
          {/* Enhanced Welcome Section */}
          <div className="profileinfos-welcome-section">
            <div className="profileinfos-welcome-content">
              <div className="profileinfos-welcome-badge">
                <User size={16} />
                <span>Personal Profile Management</span>
              </div>
              <h1 className="profileinfos-welcome-title">
                Personal Information<span className="profileinfos-code-accent">{"<profile/>"}</span>
              </h1>
              <p className="profileinfos-welcome-subtitle">
                Manage your profile information and keep your account details up to date.
              </p>

              {/* Code snippet */}
              <div className="profileinfos-code-snippet">
                <div className="profileinfos-code-header">
                  <div className="profileinfos-code-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="profileinfos-code-title">user-profile.js</span>
                </div>
                <div className="profileinfos-code-content">
                  <span className="profileinfos-code-line">
                    <span className="profileinfos-code-function">user</span>
                    <span className="profileinfos-code-punctuation">.</span>
                    <span className="profileinfos-code-function">updateProfile</span>
                    <span className="profileinfos-code-punctuation">(</span>
                    <span className="profileinfos-code-string">"{user.firstName || "userData"}"</span>
                    <span className="profileinfos-code-punctuation">);</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="profileinfos-welcome-stats">
              <div className="profileinfos-date-info">
                <div className="profileinfos-date-item">
                  <Calendar size={16} />
                  <span>
                    {new Date().toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="profileinfos-date-item">
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

            {/* IT-themed background elements */}
            <div className="profileinfos-tech-bg">
              <div className="profileinfos-circuit-pattern"></div>
              <div className="profileinfos-floating-icons">
                <Code size={24} className="profileinfos-floating-icon" />
                <Terminal size={20} className="profileinfos-floating-icon" />
                <User size={22} className="profileinfos-floating-icon" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="profileinfos-loading-container">
              <div className="profileinfos-loading-spinner"></div>
              <p>Loading profile data...</p>
            </div>
          ) : error ? (
            <div className="profileinfos-error-container">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : (
            <div className="profileinfos-content">
              <div className="profileinfos-profile-card">
                <div className="profileinfos-profile-banner">
                  <div className="profileinfos-banner-overlay"></div>
                </div>

                <div className="profileinfos-profile-main">
                  <div className="profileinfos-profile-image-container">
                    <div className="profileinfos-profile-image">
                      <img
                        src={isEditing ? previewImage || editedUser.profileImgUrl : user.profileImgUrl}
                        alt="Profile"
                        className="profileinfos-profile-img"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg?height=200&width=200"
                        }}
                      />
                      {isEditing && (
                        <>
                          <label htmlFor="profile-upload" className="profileinfos-profile-upload-label">
                            <Camera size={20} />
                            <span>Change</span>
                          </label>
                          <input
                            type="file"
                            id="profile-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="profileinfos-profile-upload-input"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="profileinfos-profile-info">
                    <div className="profileinfos-profile-title">
                      <h2>
                        {user.firstName} {user.lastName}
                      </h2>
                      <div className={`profileinfos-role-badge ${getRoleBadgeClass(user.role)}`}>
                        <Shield size={14} />
                        <span>{user.role}</span>
                      </div>
                    </div>

                    <div className="profileinfos-profile-actions">
                      {!isEditing ? (
                        <button className="profileinfos-edit-button" onClick={() => setIsEditing(true)}>
                          <Edit2 size={18} />
                          <span>Edit Profile</span>
                        </button>
                      ) : (
                        <div className="profileinfos-edit-actions">
                          <button className="profileinfos-save-button" onClick={handleSave} disabled={updateLoading}>
                            <Save size={18} />
                            <span>{updateLoading ? "Saving..." : "Save Changes"}</span>
                          </button>
                          <button className="profileinfos-cancel-button" onClick={handleCancel}>
                            <X size={18} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="profileinfos-profile-body">
                  <div className="profileinfos-info-section">
                    <h3>
                      <User size={18} />
                      <span>Basic Information</span>
                    </h3>
                    <div className="profileinfos-info-grid">
                      <div className="profileinfos-info-item">
                        <label>First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={editedUser.firstName}
                            onChange={handleInputChange}
                            className="profileinfos-input-field"
                          />
                        ) : (
                          <p>{user.firstName}</p>
                        )}
                      </div>
                      <div className="profileinfos-info-item">
                        <label>Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={editedUser.lastName}
                            onChange={handleInputChange}
                            className="profileinfos-input-field"
                          />
                        ) : (
                          <p>{user.lastName}</p>
                        )}
                      </div>
                      <div className="profileinfos-info-item profileinfos-full-width">
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
                            className="profileinfos-input-field"
                            disabled // Email should typically not be editable
                          />
                        ) : (
                          <p>{user.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="profileinfos-info-section">
                    <h3>
                      <FileText size={18} />
                      <span>About</span>
                    </h3>
                    <div className="profileinfos-info-item profileinfos-full-width">
                      <label>Bio</label>
                      {isEditing ? (
                        <textarea
                          name="userBio"
                          value={editedUser.userBio || ""}
                          onChange={handleInputChange}
                          rows="4"
                          className="profileinfos-textarea-field"
                          placeholder="Tell us about yourself..."
                        ></textarea>
                      ) : (
                        <p className="profileinfos-user-bio">{user.userBio || "No bio provided yet."}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
