"use client"

import { useState, useEffect } from "react"
import { Search, Filter, UserPlus, MoreHorizontal, Check, Trash2, UserCog, X, RefreshCw } from "lucide-react"
import { getAllUsers, deleteUser, createUser, updateUser } from "../../services/Api"
import Header from "../forHome/Header"
import Footer from "../forHome/Footer"
import Sidebar from "../forDashboard/Sidebar"
import Modal from "./Modal"
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

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "User",
    status: "Active",
  })

  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")

  // Available roles and statuses for filtering
  const availableRoles = ["User", "Ict-expert", "Content-admin", "Admin"]
  const availableStatuses = ["Active", "Inactive", "Pending"]

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

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

  // Apply filters when search term, role filter, or status filter changes
  useEffect(() => {
    if (users.length > 0) {
      let filtered = [...users]

      // Apply search filter
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

      // Apply role filter
      if (roleFilter !== "all") {
        filtered = filtered.filter((user) => user.role === roleFilter)
      }

      // Apply status filter
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

        // Create a payload with the role update
        const roleUpdateData = {
          ...selectedUser,
          role: newRole,
        }

        // Use the standard updateUser function with the role included
        const response = await updateUser(selectedUser._id, roleUpdateData)

        if (response && response.success) {
          await fetchUsers() // Refresh the user list
          closeModal()
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
        return "role-admin"
      case "ict-expert":
        return "role-ict-expert"
      case "content-admin":
        return "role-content-admin"
      default:
        return "role-user"
    }
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "status-active"
      case "inactive":
        return "status-inactive"
      case "pending":
        return "status-pending"
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
          className="user-avatar-img"
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
      />

      <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Header language={language} setLanguage={setLanguage} darkMode={darkMode} openMobileMenu={openMobileMenu} />

        <div className="user-management-container">
          <div className="page-header">
            <h1>User Management</h1>
            <p>View and manage all users in the system</p>
          </div>

          <div className="controls-container">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, role..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            <div className="action-buttons">
              <button className="refresh-button" onClick={fetchUsers} title="Refresh user list">
                <RefreshCw size={18} />
              </button>
              <button className={`filter-button ${showFilters ? "active" : ""}`} onClick={toggleFilters}>
                <Filter size={16} /> Filters {showFilters && <span className="filter-count">•</span>}
              </button>
              <button className="add-button" onClick={openAddUserModal}>
                <UserPlus size={16} /> Add User
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filters-header">
                <h3>Filter Users</h3>
                <button className="clear-filters" onClick={clearFilters}>
                  Clear all
                </button>
                <button className="close-filters" onClick={toggleFilters}>
                  <X size={18} />
                </button>
              </div>
              <div className="filters-content">
                <div className="filter-group">
                  <label>Role</label>
                  <div className="filter-options">
                    <button
                      className={`filter-option ${roleFilter === "all" ? "selected" : ""}`}
                      onClick={() => setRoleFilter("all")}
                    >
                      All
                    </button>
                    {availableRoles.map((role) => (
                      <button
                        key={role}
                        className={`filter-option ${roleFilter === role ? "selected" : ""}`}
                        onClick={() => setRoleFilter(role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <label>Status</label>
                  <div className="filter-options">
                    <button
                      className={`filter-option ${statusFilter === "all" ? "selected" : ""}`}
                      onClick={() => setStatusFilter("all")}
                    >
                      All
                    </button>
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        className={`filter-option ${statusFilter === status ? "selected" : ""}`}
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
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchUsers}>Try Again</button>
            </div>
          )}

          <div className="table-container">
            {isLoading && !isDeleting ? (
              <div className="loading-container">
                <div className="loading-spinner" />
                <p>Loading users...</p>
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <label className="checkbox-container">
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                        <span className="checkmark"></span>
                      </label>
                    </th>
                    <th className="id-column">ID</th>
                    <th className="user-column">User</th>
                    <th className="role-column">Role</th>
                    <th className="status-column">Status</th>
                    <th className="login-column">Last Login</th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={getUserId(user)} className={selectedUsers.includes(getUserId(user)) ? "selected" : ""}>
                      <td>
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(getUserId(user))}
                            onChange={() => handleSelectUser(getUserId(user))}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td className="user-id">{getUserId(user)}</td>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">{getUserAvatar(user)}</div>
                          <div className="user-details">
                            <div className="user-name">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${getRoleClass(user.role)}`}>{user.role || "User"}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(getUserStatus(user))}`}>
                          {getUserStatus(user) === "Active" && <Check size={12} className="status-icon" />}
                          {getUserStatus(user)}
                        </span>
                      </td>
                      <td>{getUserLastLogin(user)}</td>
                      <td>
                        <div className="actions">
                          <button
                            className="action-button edit-action"
                            onClick={() => openModal("changeRole", user)}
                            title="Change Role"
                          >
                            <UserCog size={22} />
                          </button>
                          <button
                            className="action-button delete-action"
                            onClick={() => openModal("delete", user)}
                            title="Delete User"
                          >
                            <Trash2 size={22} />
                          </button>
                          <button className="action-button more-action" title="More Options">
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
              <div className="no-results">
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
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Add New User</h3>
                  <button className="close-button" onClick={closeAddUserModal}>
                    ×
                  </button>
                </div>
                <div className="modal-content">
                  <div className="form-group">
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
                  <div className="form-group">
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
                  <div className="form-group">
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
                  <div className="form-group">
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
                  <div className="form-group">
                    <label htmlFor="newUserRole">Role</label>
                    <select id="newUserRole" name="role" value={newUser.role} onChange={handleNewUserChange}>
                      {availableRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={newUser.status} onChange={handleNewUserChange}>
                      {availableStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button className="cancel-button" onClick={closeAddUserModal}>
                      Cancel
                    </button>
                    <button
                      className="confirm-button"
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

        <Footer darkMode={darkMode} setDarkMode={setDarkMode} language={language} />
      </div>
    </div>
  )
}





