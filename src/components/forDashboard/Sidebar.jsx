"use client"

import { Link } from "react-router-dom"
import { LayoutDashboard, Layers, Settings, Shield, LogOut, ChevronLeft, ChevronRight, X } from "lucide-react"
import "./Sidebar.css"

// Update the Sidebar component to accept darkMode prop
export default function Sidebar({ collapsed, toggleSidebar, mobileOpen, closeMobileMenu, darkMode }) {
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
            <li className="sidebar-menu-item active">
              <Link to="/dashboard" className="sidebar-menu-link">
                <LayoutDashboard size={20} />
                {!collapsed && <span>Dashboard</span>}
              </Link>
            </li>

            <li className="sidebar-menu-item">
              <Link to="/usermanagement" className="sidebar-menu-link">
                <Layers size={20} />
                {!collapsed && <span>All users</span>}
              </Link>
            </li>

            <li className="sidebar-menu-item">
              <Link to="/settings" className="sidebar-menu-link">
                <Settings size={20} />
                {!collapsed && <span>Settings</span>}
              </Link>
            </li>
            <li className="sidebar-menu-item">
              <Link to="/profile" className="sidebar-menu-link">
                <Shield size={20} />
                {!collapsed && <span>Personal infos</span>}
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item logout">
              <Link to="/logout" className="sidebar-menu-link">
                <LogOut size={20} />
                {!collapsed && <span>Logout</span>}
              </Link>
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





