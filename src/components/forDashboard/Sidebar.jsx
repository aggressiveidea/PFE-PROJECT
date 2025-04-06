"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Layers, Settings, Shield, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react'
import "./Sidebar.css"

export default function Sidebar({ collapsed, toggleSidebar, mobileOpen, closeMobileMenu, darkMode }) {
  // Get the current location to determine which link is active
  const location = useLocation()
  const currentPath = location.pathname
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    const checkUserRole = () => {
      try {
        const userString = localStorage.getItem('user')
        if (userString) {
          const userData = JSON.parse(userString)
          setIsAdmin(userData.role === 'Admin')
        }
      } catch (error) {
        console.error('Error checking user role:', error)
        setIsAdmin(false)
      }
    }

    // Check initially
    checkUserRole()

    window.addEventListener('userUpdated', checkUserRole)
    
    return () => {
      window.removeEventListener('userUpdated', checkUserRole)
    }
  }, [])

  // Function to check if a link is active
  const isActive = (path) => {
    return currentPath === path || currentPath.startsWith(path + "/")
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('authData')
    localStorage.removeItem('token')
    window.location.href = '/signin'
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




