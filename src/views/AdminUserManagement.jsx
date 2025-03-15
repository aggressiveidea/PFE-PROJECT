"use client"

import Sidebar from "../components/forDashboard/Sidebar"
import "../style/AdminUserManagement.css"

function AdminUserManagement() {
  return (
    <div className="app">
      <Sidebar isLoggedIn={true} isAdmin={true} />
      <main className="admin-users-content">
        <div className="admin-users-header">
          <h1>User Management</h1>
          <p>Manage all users in the system</p>
        </div>

        <div className="admin-users-controls">
          <div className="search-container">
            <input type="text" placeholder="Search users..." className="search-input" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="search-icon"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <div className="filter-container">
            <select className="role-filter">
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="expert">ICT Experts</option>
              <option value="user">Regular Users</option>
            </select>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="user-name">
                  <div className="user-avatar">JD</div>
                  <div className="user-name-text">John Doe</div>
                </td>
                <td>johndoe@example.com</td>
                <td><span className="role-badge user">User</span></td>
                <td>01/01/2024</td>
                <td className="action-buttons">
                  <button className="make-expert-button">Make ICT Expert</button>
                  <button className="delete-button">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default AdminUserManagement;


