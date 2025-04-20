"use client"

import { useState, useEffect } from "react"
import { Users, FileText, Settings, Moon, Sun, LayoutDashboard, Bell, LogOut, Grid, User, BookOpen } from "lucide-react"
import "./Sidebar.css"

export default function Sidebar({ collapsed, toggleSidebar, mobileOpen, closeMobileMenu, darkMode, toggleDarkMode }) {
  const [activeItem, setActiveItem] = useState("content")
  const [userRole, setUserRole] = useState("User")

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

  const allNavLinks = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["Admin"],
    },
    {
      id: "users",
      label: "All users",
      icon: Users,
      href: "/usermanagement",
      roles: ["Admin"], 
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/notifs",
      roles: ["Content-admin"], 
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      roles: ["Admin", "Content-admin", "Ict-expert", "User"], 
    },
    {
      id: "personal",
      label: "Personal infos",
      icon: User,
      href: "/profile",
      roles: ["Admin", "Content-admin", "Ict-expert", "User"], 
    },
    {
      id: "quiz",
      label: "ICT Quiz",
      icon: BookOpen,
      href: "/quiz",
      roles: ["Admin", "Content-admin", "Ict-expert", "User"], 
    },
  ]

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






