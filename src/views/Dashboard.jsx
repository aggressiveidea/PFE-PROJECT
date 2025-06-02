import { useState, useEffect } from "react"
import Sidebar from "../components/forDashboard/Sidebar"
import StatisticsSection from "../components/forDashboard/StatisticsSection"
import ChartsSection from "../components/forDashboard/ChartsSection"
import Header from "../components/forHome/Header"
import Footer from "../components/forHome/Footer"
import { Menu } from "lucide-react"
import { useTheme } from "../context/theme-context"
import "./Dashboard.css"
import "../styles/darkMode.css"
import { getTotalUsers, getActiveUsers, getUsersByCountry, getUserActivityPerMonth } from "../services/Api"

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [statsData, setStatsData] = useState(null)
  const [countryData, setCountryData] = useState([])
  const [activityData, setActivityData] = useState([])
  const [loading, setLoading] = useState(true)
  const { darkMode } = useTheme()
  const [language, setLanguage] = useState("en")

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  useEffect(() => {
     
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
         
        const authData = JSON.parse(localStorage.getItem("authData") || "{}")
        const token = authData.token

        if (!token) {
          console.error("No authentication token found")
          return
        }

         
        const [totalUsersData, activeUsersData, countryStatsData, activityStatsData] = await Promise.all([
          getTotalUsers(token),
          getActiveUsers(token),
          getUsersByCountry(token),
          getUserActivityPerMonth(token),
        ])

        console.log("Total Users Data:", totalUsersData)
        console.log("Active Users Data:", activeUsersData)
        console.log("Country Stats:", countryStatsData)
        console.log("Activity Stats:", activityStatsData)

         
        setStatsData({
          totalUsers: totalUsersData?.User || 0,
          totalExperts: totalUsersData?.["Ict-expert"] || 0,
          activeUsers: activeUsersData?.activeUsers || 0,
          activeExperts: activeUsersData?.activeExperts || 0,
        })

         
        if (countryStatsData && Array.isArray(countryStatsData)) {
          const formattedCountryData = countryStatsData.map((item, index) => ({
            name: item._id || "Unknown",
            value: item.count,
            color: getColorForIndex(index),
          }))
          setCountryData(formattedCountryData)
        }

         
        if (activityStatsData && Array.isArray(activityStatsData)) {
          const formattedActivityData = activityStatsData.map((item) => ({
            name: getMonthName(item._id.month),
            value: item.activeUsersCount,
          }))
          console.log(formattedActivityData)
          setActivityData(formattedActivityData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getColorForIndex = (index) => {
    const colors = ["#4f46e5", "#7c3aed", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#8b5cf6", "#6366f1"]
    return colors[index % colors.length]
  }

  const getMonthName = (monthNum) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[monthNum - 1] || `Month ${monthNum}`
  }

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        <Menu size={24} />
      </button>

      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />

      <Header language={language} setLanguage={setLanguage} />

      <main className={`dashboard-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="dashboard-header">
          {/* <SearchBar /> */}
          {/* <ProfileSection /> */}
        </div>

        <div className="dashboardAdmin-enhanced-welcome">
          <div className="dashboardAdmin-welcome-container">
            <div className="dashboardAdmin-welcome-badge">
              <svg
                className="dashboardAdmin-badge-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Admin Dashboard
            </div>

            <h1 className="dashboardAdmin-welcome-title">
              Welcome to your <span className="dashboardAdmin-code-accent">&lt;dashboard/&gt;</span>
            </h1>

            <p className="dashboardAdmin-welcome-subtitle">
              Monitor system performance, track user analytics, and manage your platform with comprehensive
              administrative tools and real-time insights.
            </p>

            <div className="dashboardAdmin-code-snippet">
              <div className="dashboardAdmin-code-header">
                <div className="dashboardAdmin-code-dots">
                  <span className="dashboardAdmin-dot dashboardAdmin-dot-red"></span>
                  <span className="dashboardAdmin-dot dashboardAdmin-dot-yellow"></span>
                  <span className="dashboardAdmin-dot dashboardAdmin-dot-green"></span>
                </div>
                <span className="dashboardAdmin-code-filename">admin-dashboard.js</span>
              </div>
              <div className="dashboardAdmin-code-content">
                <span className="dashboardAdmin-code-keyword">const</span>{" "}
                <span className="dashboardAdmin-code-variable">dashboard</span> ={" "}
                <span className="dashboardAdmin-code-function">await</span>{" "}
                <span className="dashboardAdmin-code-method">admin.getAnalytics</span>();
                <br />
                <span className="dashboardAdmin-code-comment">{statsData?.totalUsers || 0}</span>
                <br />
                <span className="dashboardAdmin-code-comment">{statsData?.activeUsers || 0}</span>
              </div>
            </div>

            <div className="dashboardAdmin-welcome-meta">
              <div className="dashboardAdmin-meta-item">
                <svg
                  className="dashboardAdmin-meta-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="2" rx="1" ry="1" />
                  <rect x="3" y="8" width="18" height="2" rx="1" ry="1" />
                  <rect x="3" y="12" width="18" height="2" rx="1" ry="1" />
                  <rect x="3" y="16" width="18" height="2" rx="1" ry="1" />
                  <rect x="3" y="20" width="18" height="2" rx="1" ry="1" />
                </svg>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="dashboardAdmin-meta-item">
                <svg
                  className="dashboardAdmin-meta-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="dashboardAdmin-floating-elements">
              <div className="dashboardAdmin-floating-icon dashboardAdmin-icon-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <div className="dashboardAdmin-floating-icon dashboardAdmin-icon-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="dashboardAdmin-floating-icon dashboardAdmin-icon-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
            </div>

            <div className="dashboardAdmin-circuit-pattern"></div>
          </div>
        </div>

        <div className="dashboard-content fade-in">
          <StatisticsSection data={statsData} loading={loading} />
          <ChartsSection countryData={countryData} activityData={activityData} loading={loading} />
        </div>
        <Footer language={language} />
      </main>
    </div>
  )
}

