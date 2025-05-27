import { useState, useEffect } from "react"
import { Search, Filter, UserPlus, MoreHorizontal, Check, Trash2, UserCog, X, RefreshCw } from "lucide-react"
import { getAllUsers, deleteUser, createUser, updateUser } from "../services/Api"
import Header from "../components/forHome/Header"
import Footer from "../components/forHome/Footer"
import Sidebar from "../components/forDashboard/Sidebar"
import Modal from "../components/AllUsers/Modal"
import "./user-management.css"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("")
  const [newRole, setNewRole] = useState("")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleUpdateSuccess, setRoleUpdateSuccess] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "User",
    status: "Active",
  })

  const availableRoles = ["User", "Ict-expert", "Content-admin", "Admin"]
  const availableStatuses = ["Active", "Inactive", "Pending"]

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }

    const handleDarkModeChange = () => {
      const isDarkMode = localStorage.getItem("darkMode") === "true"
      setDarkMode(isDarkMode)
    }
    window.addEventListener("darkModeChanged", handleDarkModeChange)

    return () => {
      window.removeEventListener("darkModeChanged", handleDarkModeChange)
    }
  }, [])

  const toggleDarkMode = (value) => {
    const newDarkMode = value !== undefined ? value : !darkMode
    setDarkMode(newDarkMode)

    if (newDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }

    localStorage.setItem("darkMode", newDarkMode.toString())
    window.dispatchEvent(new Event("darkModeChanged"))
  }

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await getAllUsers()
      console.log("Fetched response:", response)
      if (response?.success && Array.isArray(response.data)) {
        setUsers(response.data)
        setFilteredUsers(response.data)
      } else {
        setError("Invalid response format from server")
      }
    } catch (err) {
      setError("Failed to load users. Please try again.")
      console.error("Error fetching users:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (users.length > 0) {
      let filtered = [...users]

      if (searchTerm) {
        filtered = filtered.filter(
          (user) =>
            (user._id && user._id.toString().includes(searchTerm)) ||
            (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())),
        )
      }

      if (roleFilter !== "all") {
        filtered = filtered.filter((user) => user.role === roleFilter)
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((user) => (user.status || "Active") === statusFilter)
      }

      setFilteredUsers(filtered)
    }
  }, [searchTerm, roleFilter, statusFilter, users])

  useEffect(() => {
    if (selectAll) {
      setSelectedUsers(filteredUsers.map((user) => user._id))
    } else {
      setSelectedUsers([])
    }
  }, [selectAll, filteredUsers])

  useEffect(() => {
    if (roleUpdateSuccess) {
      const timer = setTimeout(() => {
        setRoleUpdateSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [roleUpdateSuccess])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const clearFilters = () => {
    setRoleFilter("all")
    setStatusFilter("all")
    setSearchTerm("")
  }

  const openModal = (type, user) => {
    setSelectedUser(user)
    setModalType(type)
    setNewRole(user.role || "User")
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
    setIsDeleting(false)
  }

  const handleDeleteUser = async () => {
    if (selectedUser && selectedUser._id) {
      try {
        setIsDeleting(true)
        await deleteUser(selectedUser._id)
        await fetchUsers()
        closeModal()
      } catch (err) {
        console.error("Error deleting user:", err)
        setError("Failed to delete user. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleChangeRole = async () => {
    if (selectedUser && selectedUser._id && newRole) {
      try {
        setIsLoading(true)

        const roleUpdateData = {
          ...selectedUser,
          role: newRole,
        }

        const response = await updateUser(selectedUser._id, roleUpdateData)

        if (response && response.success) {

          const updatedUsersCollection = JSON.parse(localStorage.getItem("updatedUsers") || "[]")
          const userIndex = updatedUsersCollection.findIndex((u) => u._id === selectedUser._id)

          if (userIndex >= 0) {
            updatedUsersCollection[userIndex] = {
              ...updatedUsersCollection[userIndex],
              role: newRole,
              updatedAt: new Date().toISOString(),
            }
          } else {
            updatedUsersCollection.push({
              _id: selectedUser._id,
              role: newRole,
              updatedAt: new Date().toISOString(),
            })
          }

          localStorage.setItem("updatedUsers", JSON.stringify(updatedUsersCollection))

          // Trigger a role update event for real-time updates
          window.dispatchEvent(new Event("roleUpdated"))

          await fetchUsers() // Refresh the user list
          closeModal()
          setRoleUpdateSuccess(true)
        } else {
          throw new Error(response?.message || "Failed to update user role")
        }
      } catch (err) {
        console.error("Error updating user role:", err)
        setError("Failed to update user role. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
  }

  const openAddUserModal = () => {
    setIsAddUserModalOpen(true)
  }

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false)
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "User",
      status: "Active",
    })
  }

  const handleAddUser = async () => {
    if (newUser.firstName && newUser.lastName && newUser.email && newUser.password && newUser.role) {
      try {
        setIsLoading(true)
        await createUser(newUser)
        await fetchUsers()
        closeAddUserModal()
      } catch (err) {
        console.error("Error adding user:", err)
        setError("Failed to add user. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleNewUserChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const openMobileMenu = () => {
    setMobileMenuOpen(true)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "usermanagement-role-admin"
      case "ict-expert":
        return "usermanagement-role-ict-expert"
      case "content-admin":
        return "usermanagement-role-content-admin"
      default:
        return "usermanagement-role-user"
    }
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "usermanagement-status-active"
      case "inactive":
        return "usermanagement-status-inactive"
      case "pending":
        return "usermanagement-status-pending"
      default:
        return ""
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U"
  }

  const getUserId = (user) => {
    return user._id || user.id || "N/A"
  }

  const getUserStatus = (user) => {
    return user.status || "Active"
  }

  const getUserLastLogin = (user) => {
    if (user.lastLogin) return user.lastLogin
    if (user.updatedAt) return new Date(user.updatedAt).toLocaleString()
    if (user.createdAt) return new Date(user.createdAt).toLocaleString()
    return "Unknown"
  }

  const getUserAvatar = (user) => {
    if (user.profileImgUrl && !user.profileImgUrl.includes("placeholder.svg")) {
      return (
        <img
          src={user.profileImgUrl || "/placeholder.svg"}
          alt={`${user.firstName} ${user.lastName}`}
          className="usermanagement-avatar-img"
          onError={(e) => {
            e.target.onerror = null
            e.target.style.display = "none"
            e.target.parentNode.textContent = getInitials(user.firstName, user.lastName)
          }}
        />
      )
    } else {
      return getInitials(user.firstName, user.lastName)
    }
  }

  return (
    <div className="app-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={closeMobileMenu}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Header language={language} setLanguage={setLanguage} darkMode={darkMode} openMobileMenu={openMobileMenu} />

        <div className="usermanagement-container">
          <div className="usermanagement-header">
            <h1>User Management</h1>
            <p>View and manage all users in the system</p>
          </div>

          {roleUpdateSuccess && (
            <div className="usermanagement-success">
              <Check size={18} />
              <span>Role updated successfully! Changes take effect immediately - no logout required.</span>
            </div>
          )}

          <div className="usermanagement-controls">
            <div className="usermanagement-search">
              <Search className="usermanagement-search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, role..."
                value={searchTerm}
                onChange={handleSearch}
                className="usermanagement-search-input"
              />
            </div>

            <div className="usermanagement-actions">
              <button className="usermanagement-refresh-btn" onClick={fetchUsers} title="Refresh user list">
                <RefreshCw size={18} />
              </button>
              <button className={`usermanagement-filter-btn ${showFilters ? "active" : ""}`} onClick={toggleFilters}>
                <Filter size={16} /> Filters {showFilters && <span className="usermanagement-filter-count">•</span>}
              </button>
              <button className="usermanagement-add-btn" onClick={openAddUserModal}>
                <UserPlus size={16} /> Add User
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="usermanagement-filters">
              <div className="usermanagement-filters-header">
                <h3>Filter Users</h3>
                <button className="usermanagement-clear-filters" onClick={clearFilters}>
                  Clear all
                </button>
                <button className="usermanagement-close-filters" onClick={toggleFilters}>
                  <X size={18} />
                </button>
              </div>
              <div className="usermanagement-filters-content">
                <div className="usermanagement-filter-group">
                  <label>Role</label>
                  <div className="usermanagement-filter-options">
                    <button
                      className={`usermanagement-filter-option ${roleFilter === "all" ? "selected" : ""}`}
                      onClick={() => setRoleFilter("all")}
                    >
                      All
                    </button>
                    {availableRoles.map((role) => (
                      <button
                        key={role}
                        className={`usermanagement-filter-option ${roleFilter === role ? "selected" : ""}`}
                        onClick={() => setRoleFilter(role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="usermanagement-filter-group">
                  <label>Status</label>
                  <div className="usermanagement-filter-options">
                    <button
                      className={`usermanagement-filter-option ${statusFilter === "all" ? "selected" : ""}`}
                      onClick={() => setStatusFilter("all")}
                    >
                      All
                    </button>
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        className={`usermanagement-filter-option ${statusFilter === status ? "selected" : ""}`}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="usermanagement-error">
              <p>{error}</p>
              <button onClick={fetchUsers}>Try Again</button>
            </div>
          )}

          <div className="usermanagement-table-container">
            {isLoading && !isDeleting ? (
              <div className="usermanagement-loading">
                <div className="usermanagement-spinner" />
                <p>Loading users...</p>
              </div>
            ) : (
              <table className="usermanagement-table">
                <thead>
                  <tr>
                    <th className="usermanagement-checkbox-col">
                      <label className="usermanagement-checkbox">
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                        <span className="usermanagement-checkmark"></span>
                      </label>
                    </th>
                    <th className="usermanagement-id-col">ID</th>
                    <th className="usermanagement-user-col">User</th>
                    <th className="usermanagement-role-col">Role</th>
                    <th className="usermanagement-status-col">Status</th>
                    <th className="usermanagement-login-col">Last Login</th>
                    <th className="usermanagement-actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={getUserId(user)} className={selectedUsers.includes(getUserId(user)) ? "selected" : ""}>
                      <td>
                        <label className="usermanagement-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(getUserId(user))}
                            onChange={() => handleSelectUser(getUserId(user))}
                          />
                          <span className="usermanagement-checkmark"></span>
                        </label>
                      </td>
                      <td className="usermanagement-user-id">{getUserId(user)}</td>
                      <td>
                        <div className="usermanagement-user-info">
                          <div className="usermanagement-avatar">{getUserAvatar(user)}</div>
                          <div className="usermanagement-user-details">
                            <div className="usermanagement-user-name">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="usermanagement-user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`usermanagement-role-badge ${getRoleClass(user.role)}`}>
                          {user.role || "User"}
                        </span>
                      </td>
                      <td>
                        <span className={`usermanagement-status-badge ${getStatusClass(getUserStatus(user))}`}>
                          {getUserStatus(user) === "Active" && (
                            <Check size={12} className="usermanagement-status-icon" />
                          )}
                          {getUserStatus(user)}
                        </span>
                      </td>
                      <td>{getUserLastLogin(user)}</td>
                      <td>
                        <div className="usermanagement-actions">
                          <button
                            className="usermanagement-action-btn edit"
                            onClick={() => openModal("changeRole", user)}
                            title="Change Role"
                          >
                            <UserCog size={22} />
                          </button>
                          <button
                            className="usermanagement-action-btn delete"
                            onClick={() => openModal("delete", user)}
                            title="Delete User"
                          >
                            <Trash2 size={22} />
                          </button>
                          <button className="usermanagement-action-btn more" title="More Options">
                            <MoreHorizontal size={22} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filteredUsers.length === 0 && !isLoading && (
              <div className="usermanagement-no-results">
                <h3>No users found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>

          {isModalOpen && selectedUser && (
            <Modal
              isOpen={isModalOpen}
              modalType={modalType}
              selectedUser={selectedUser}
              newRole={newRole}
              setNewRole={setNewRole}
              closeModal={closeModal}
              handleDeleteUser={handleDeleteUser}
              handleChangeRole={handleChangeRole}
            />
          )}

          {isAddUserModalOpen && (
            <div className="usermanagement-modal-overlay">
              <div className="usermanagement-modal">
                <div className="usermanagement-modal-header">
                  <h3>Add New User</h3>
                  <button className="usermanagement-close-btn" onClick={closeAddUserModal}>
                    ×
                  </button>
                </div>
                <div className="usermanagement-modal-content">
                  <div className="usermanagement-form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleNewUserChange}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="usermanagement-form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleNewUserChange}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="usermanagement-form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="usermanagement-form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleNewUserChange}
                      placeholder="Enter a password"
                    />
                  </div>
                  <div className="usermanagement-form-group">
                    <label htmlFor="newUserRole">Role</label>
                    <select id="newUserRole" name="role" value={newUser.role} onChange={handleNewUserChange}>
                      {availableRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="usermanagement-form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={newUser.status} onChange={handleNewUserChange}>
                      {availableStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="usermanagement-modal-footer">
                    <button className="usermanagement-cancel-btn" onClick={closeAddUserModal}>
                      Cancel
                    </button>
                    <button
                      className="usermanagement-confirm-btn"
                      onClick={handleAddUser}
                      disabled={
                        !newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password || isLoading
                      }
                    >
                      {isLoading ? "Adding..." : "Add User"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer darkMode={darkMode} setDarkMode={toggleDarkMode} language={language} />
      </div>
    </div>
  )
}
