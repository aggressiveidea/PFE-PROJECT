import { ThemeProvider } from "../context/theme-context"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Sidebar from "../components/Sidebar"
import { useState } from "react"
import "../styles/darkMode.css"

export default function ClientLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const openMobileMenu = () => {
    setMobileMenuOpen(true)
  }

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="app-container">
            <Header openMobileMenu={openMobileMenu} />
            <Sidebar
              collapsed={sidebarCollapsed}
              toggleSidebar={toggleSidebar}
              mobileOpen={mobileMenuOpen}
              closeMobileMenu={closeMobileMenu}
            />
            <main className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
