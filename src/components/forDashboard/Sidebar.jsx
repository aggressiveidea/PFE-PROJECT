"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Layers, Settings, Shield, LogOut, ChevronLeft, ChevronRight, X, Bell } from "lucide-react"
import "./Sidebar.css"

export default function Sidebar({ collapsed, toggleSidebar, mobileOpen, closeMobileMenu, darkMode }) {
  // Get the current location to determine which link is active
  const location = useLocation()
  const currentPath = location.pathname
  const [isAdmin, setIsAdmin] = useState(false)
  const [isContentAdmin, setIsContentAdmin] = useState(false)
  const [pendingArticles, setPendingArticles] = useState(0)

  // Check user role from localStorage when component mounts
  useEffect(() => {
    const checkUserRole = () => {
      try {
        const userString = localStorage.getItem("user")
        if (userString) {
          const userData = JSON.parse(userString)
          setIsAdmin(userData.role === "Admin")
          setIsContentAdmin(userData.role === "Content-admin" || userData.role === "Admin")

          // If user is content admin, check for pending articles
          if (userData.role === "Content-admin" || userData.role === "admin") {
            const pendingArticlesData = JSON.parse(localStorage.getItem("pendingArticles") || "[]")
            setPendingArticles(pendingArticlesData.length)
          }
        }
      } catch (error) {
        console.error("Error checking user role:", error)
        setIsAdmin(false)
        setIsContentAdmin(false)
      }
    }

    // Check initially
    checkUserRole()

    // Also listen for user updates (e.g., after login/logout)
    window.addEventListener("userUpdated", checkUserRole)

    // Listen for pending articles updates
    window.addEventListener("pendingArticlesUpdated", () => {
      const pendingArticlesData = JSON.parse(localStorage.getItem("pendingArticles") || "[]")
      setPendingArticles(pendingArticlesData.length)
    })

    // Listen for role updates
    window.addEventListener("roleUpdated", checkUserRole)

    // Set up polling to check for role changes every 30 seconds
    const roleCheckInterval = setInterval(() => {
      // Get the current user ID to compare with stored user
      const userString = localStorage.getItem("user")
      if (userString) {
        const userData = JSON.parse(userString)
        const userId = userData._id

        // Check if there's a newer version of the user data in a separate storage location
        // This would be updated by the admin when changing roles
        const updatedUsersString = localStorage.getItem("updatedUsers")
        if (updatedUsersString) {
          try {
            const updatedUsers = JSON.parse(updatedUsersString)
            const updatedUser = updatedUsers.find((user) => user._id === userId)

            // If this user has been updated and the role is different
            if (updatedUser && updatedUser.role !== userData.role) {
              // Update the user data in localStorage
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...userData,
                  role: updatedUser.role,
                }),
              )

              // Trigger a role update
              window.dispatchEvent(new Event("roleUpdated"))
            }
          } catch (error) {
            console.error("Error checking for role updates:", error)
          }
        }
      }
    }, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener("userUpdated", checkUserRole)
      window.removeEventListener("pendingArticlesUpdated", checkUserRole)
      window.removeEventListener("roleUpdated", checkUserRole)
      clearInterval(roleCheckInterval)
    }
  }, [])

  // Function to check if a link is active
  const isActive = (path) => {
    return currentPath === path || currentPath.startsWith(path + "/")
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("authData")
    localStorage.removeItem("token")
    window.location.href = "/signin"
  }

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobileMenu}></div>}

      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""} ${darkMode ? "dark" : ""}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <LayoutDashboard size={20} />
            </div>
            {!collapsed && <span className="sidebar-logo-text">EL-MOUGHITH</span>}
          </div>
          <button className="sidebar-close-mobile" onClick={closeMobileMenu}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          <ul className="sidebar-menu">
            {/* Only show admin links if user is an admin */}
            {isAdmin && (
              <>
                <li className={`sidebar-menu-item ${isActive("/dashboard") ? "active" : ""}`}>
                  <Link to="/dashboard" className="sidebar-menu-link">
                    <LayoutDashboard size={20} />
                    {!collapsed && <span>Dashboard</span>}
                  </Link>
                </li>

                <li className={`sidebar-menu-item ${isActive("/usermanagement") ? "active" : ""}`}>
                  <Link to="/usermanagement" className="sidebar-menu-link">
                    <Layers size={20} />
                    {!collapsed && <span>All users</span>}
                  </Link>
                </li>
              </>
            )}

            {/* Content Admin Dashboard Link */}
            {isContentAdmin && (
              <li className={`sidebar-menu-item ${isActive("/notifs") ? "active" : ""}`}>
                <Link to="/notifs" className="sidebar-menu-link">
                  <Bell size={20} />
                  {!collapsed && <span>Content dashboard</span>}
                </Link>
              </li>
            )}

            <li className={`sidebar-menu-item ${isActive("/settings") ? "active" : ""}`}>
              <Link to="/settings" className="sidebar-menu-link">
                <Settings size={20} />
                {!collapsed && <span>Settings</span>}
              </Link>
            </li>
            <li className={`sidebar-menu-item ${isActive("/profile") ? "active" : ""}`}>
              <Link to="/profile" className="sidebar-menu-link">
                <Shield size={20} />
                {!collapsed && <span>Personal infos</span>}
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <ul className="sidebar-menu">
            <li className={`sidebar-menu-item logout`}>
              <button onClick={handleLogout} className="sidebar-menu-link">
                <LogOut size={20} />
                {!collapsed && <span>Logout</span>}
              </button>
            </li>
          </ul>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  )
}






