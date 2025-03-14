"use client"
import {
  LayoutDashboard,
  BarChart2,
  Layers,
  MessageSquare,
  Settings,
  Shield,
  Globe,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import "./Sidebar.css"

export default function Sidebar({ collapsed, toggleSidebar, mobileOpen, closeMobileMenu }) {
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobileMenu}></div>}

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <LayoutDashboard size={20} />
            </div>
            {!collapsed && <span className="sidebar-logo-text">Admin Panel</span>}
          </div>
          <button className="sidebar-close-mobile" onClick={closeMobileMenu}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item active">
              <a href="#" className="sidebar-menu-link">
                <LayoutDashboard size={20} />
                {!collapsed && <span>Dashboard</span>}
              </a>
            </li>
            <li className="sidebar-menu-item">
              <a href="#" className="sidebar-menu-link">
                <BarChart2 size={20} />
                {!collapsed && <span>Metrics</span>}
              </a>
            </li>
            <li className="sidebar-menu-item">
              <a href="#" className="sidebar-menu-link">
                <Layers size={20} />
                {!collapsed && <span>All users</span>}
              </a>
            </li>
            <li className="sidebar-menu-item">
              <a href="#" className="sidebar-menu-link">
                <MessageSquare size={20} />
                {!collapsed && <span>Comments</span>}
              </a>
            </li>
            <li className="sidebar-menu-item">
              <a href="#" className="sidebar-menu-link">
                <Settings size={20} />
                {!collapsed && <span>Settings</span>}
              </a>
            </li>
            <li className="sidebar-menu-item">
              <a href="#" className="sidebar-menu-link">
                <Shield size={20} />
                {!collapsed && <span>Privacy & Security</span>}
              </a>
            </li>
            <li className="sidebar-menu-item">
              <a href="#" className="sidebar-menu-link">
                <Globe size={20} />
                {!collapsed && <span>Language</span>}
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <ul className="sidebar-menu">
            <li className="sidebar-menu-item logout">
              <a href="#" className="sidebar-menu-link">
                <LogOut size={20} />
                {!collapsed && <span>Logout</span>}
              </a>
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



