"use client"

import { useState, useEffect } from "react"
import { Users, FileText, Settings, Moon, Sun, LayoutDashboard, Bell, LogOut, Grid, User, BookOpen } from "lucide-react"
import "./Sidebar.css"

export default function Sidebar({ collapsed, toggleSidebar, mobileOpen, closeMobileMenu, darkMode, toggleDarkMode }) {
  const [activeItem, setActiveItem] = useState("content")
  const [userRole, setUserRole] = useState("User") // Default role

  // Fetch user role from localStorage on component mount
  useEffect(() => {
    const getUserRole = () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        if (userData && userData.role) {
          setUserRole(userData.role)
        }
      } catch (error) {
        console.error("Error getting user role:", error)
      }
    }

    getUserRole()

    // Listen for user updates (e.g., after profile changes)
    const handleUserUpdate = () => getUserRole()
    window.addEventListener("userUpdated", handleUserUpdate)

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate)
    }
  }, [])

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
    } else if (path.includes("quiz")) {
      setActiveItem("quiz")
    }
  }, [])

  // Define all navigation links with their access permissions
  const allNavLinks = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["Admin", "Ict-expert"], // Admin and ICT expert can access
    },
    {
      id: "content",
      label: "Content dashboard",
      icon: FileText,
      href: "/content-dashboard",
      roles: ["Content-admin", "Ict-expert"], // Content admin and ICT expert can access
    },
    {
      id: "users",
      label: "All users",
      icon: Users,
      href: "/users",
      roles: ["Admin"], // Only admin can access
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/notifications",
      roles: ["Admin", "Content-admin", "Ict-expert", "User"], // All roles can access
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      roles: ["Admin", "Content-admin", "Ict-expert", "User"], // All roles can access
    },
    {
      id: "personal",
      label: "Personal infos",
      icon: User,
      href: "/personal",
      roles: ["Admin", "Content-admin", "Ict-expert", "User"], // All roles can access
    },
    {
      id: "quiz",
      label: "ICT Quiz",
      icon: BookOpen,
      href: "/quiz",
      roles: ["Admin", "Content-admin", "Ict-expert", "User"], // All roles can access
    },
  ]

  // Filter navigation links based on user role
  const navLinks = allNavLinks.filter((link) => link.roles.includes(userRole))

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






