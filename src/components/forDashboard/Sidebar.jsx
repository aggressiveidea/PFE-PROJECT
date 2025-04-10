"use client"
import { useState, useEffect } from "react"
import { Users, FileText, Settings, Moon, Sun, LayoutDashboard, Bell, LogOut, Grid, User } from "lucide-react"
import "./Sidebar.css"

export default function Sidebar({ collapsed, toggleSidebar, mobileOpen, closeMobileMenu, darkMode, toggleDarkMode }) {
  const [activeItem, setActiveItem] = useState("content")

  // Get current path to set active menu item
  useEffect(() => {
    const path = window.location.pathname
    if (path.includes("dashboard")) {
      setActiveItem("dashboard")
    } else if (path.includes("content")) {
      setActiveItem("content")
    } else if (path.includes("users")) {
      setActiveItem("users")
    } else if (path.includes("notifications")) {
      setActiveItem("notifications")
    } else if (path.includes("settings")) {
      setActiveItem("settings")
    } else if (path.includes("personal")) {
      setActiveItem("personal")
    }
  }, [])

  // Navigation links with href
  const navLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "content", label: "Content dashboard", icon: FileText, href: "/content-dashboard" },
    { id: "users", label: "All users", icon: Users, href: "/users" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/notifications" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
    { id: "personal", label: "Personal infos", icon: User, href: "/personal" },
  ]

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobileMenu}></div>}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""} ${darkMode ? "dark-mode" : ""}`}
      >
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <Grid size={18} />
            </div>
            <span className="logo-text">EL-MOUGHITH</span>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className={activeItem === link.id ? "active" : ""}
                    onClick={(e) => {
                      // Prevent default if it's just a demo
                      if (link.href === "#") {
                        e.preventDefault()
                      }
                      setActiveItem(link.id)
                    }}
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <a href="/" className="logout-link">
            <LogOut size={20} />
            <span>Logout</span>
          </a>
        </div>
      </aside>
    </>
  )
}






