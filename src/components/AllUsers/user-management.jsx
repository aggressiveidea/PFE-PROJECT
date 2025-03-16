"use client"

import { useState, useEffect } from "react"
import "./user-management.css"
import { UserIcon, TrashIcon, MoreHorizontalIcon, FilterIcon, CheckIcon, ListOrderedIcon as SortIcon, Loader2Icon } from 'lucide-react'
import { getAllUsers, deleteUser, createUser, updateUser } from "../../services/Api"

const UserManagement = () => {
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
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Admin",
    status: "Active",
  })

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
  
      const response = await getAllUsers();
      console.log("Fetched response:", response);
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
  

  // Initial data fetch
  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm && users.length > 0) {
      const filtered = users.filter(
        (user) =>
          (user._id && user._id.toString().includes(searchTerm)) ||
          (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  // Handle select all checkbox
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
        // Refresh the user list after deletion
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
        await updateUser(selectedUser._id, { ...selectedUser, role: newRole })
        // Refresh the user list after update
        await fetchUsers()
        closeModal()
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
      role: "Admin",
      status: "Active",
    })
  }

  const handleAddUser = async () => {
    if (newUser.firstName && newUser.lastName && newUser.email) {
      try {
        setIsLoading(true)
        await createUser(newUser)
        // Refresh the user list after adding a new user
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

  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "role-admin"
      case "editor":
        return "role-editor"
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

  // Get user ID - adapt to your actual data structure
  const getUserId = (user) => {
    return user._id || user.id || "N/A"
  }

  // Get user status - adapt to your actual data structure
  const getUserStatus = (user) => {
    return user.status || "Active"
  }

  // Get user last login - adapt to your actual data structure
  const getUserLastLogin = (user) => {
    if (user.lastLogin) return user.lastLogin
    if (user.updatedAt) return new Date(user.updatedAt).toLocaleString()
    if (user.createdAt) return new Date(user.createdAt).toLocaleString()
    return "Unknown"
  }

  return (
    <div className="user-management-container">
      <div className="controls-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />

        <div className="action-buttons">
          <button className="filter-button">
            <FilterIcon size={16} /> Filters
          </button>
          <button className="add-button" onClick={openAddUserModal}>
            + Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUsers}>Try Again</button>
        </div>
      )}

      <div className="table-container">
        {isLoading && !isDeleting ? (
          <div className="loading-container">
            <Loader2Icon className="loading-spinner" />
            <p>Loading users...</p>
          </div>
        ) : (
          <>
            <table className="users-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <label className="checkbox-container">
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                      <span className="checkmark"></span>
                    </label>
                  </th>
                  <th className="id-column">
                    ID <SortIcon size={14} />
                  </th>
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
                    <td className="user-info">
                      <div className="user-avatar">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.firstName} {user.lastName}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleClass(user.role)}`}>{user.role || "User"}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(getUserStatus(user))}`}>
                        {getUserStatus(user) === "Active" && <CheckIcon size={12} className="status-icon" />}
                        {getUserStatus(user)}
                      </span>
                    </td>
                    <td>{getUserLastLogin(user)}</td>
                    <td className="actions">
                      <button className="action-button" onClick={() => openModal("changeRole", user)} title="Change Role">
                        <UserIcon size={16} />
                      </button>
                      <button className="action-button" onClick={() => openModal("delete", user)} title="Delete User">
                        <TrashIcon size={16} />
                      </button>
                      <button className="action-button" title="More Options">
                        <MoreHorizontalIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && !isLoading && (
              <div className="no-results">
                <h3>No users found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modalType === "delete" ? "Delete User" : "Change User Role"}</h3>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-content">
              {modalType === "delete" ? (
                <div>
                  <p>Are you sure you want to delete this user?</p>
                  <p className="user-name">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="user-id">ID: {getUserId(selectedUser)}</p>
                  <p className="warning">This action cannot be undone.</p>
                  <div className="modal-footer">
                    <button className="cancel-button" onClick={closeModal} disabled={isDeleting}>
                      Cancel
                    </button>
                    <button 
                      className="confirm-button delete" 
                      onClick={handleDeleteUser} 
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2Icon className="loading-spinner-small" />
                          Deleting...
                        </>
                      ) : (
                        "Delete User"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>Change role for user:</p>
                  <p className="user-name">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="user-id">ID: {getUserId(selectedUser)}</p>
                  <div className="role-selector">
                    <label htmlFor="role">Select new role:</label>
                    <select id="role" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button className="cancel-button" onClick={closeModal}>
                      Cancel
                    </button>
                    <button className="confirm-button" onClick={handleChangeRole}>
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
                <label htmlFor="newUserRole">Role</label>
                <select id="newUserRole" name="role" value={newUser.role} onChange={handleNewUserChange}>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={newUser.status} onChange={handleNewUserChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="cancel-button" onClick={closeAddUserModal}>
                  Cancel
                </button>
                <button
                  className="confirm-button"
                  onClick={handleAddUser}
                  disabled={!newUser.firstName || !newUser.lastName || !newUser.email || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="loading-spinner-small" />
                      Adding...
                    </>
                  ) : (
                    "Add User"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement



  





