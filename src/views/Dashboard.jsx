"use client"

import { useState, useEffect } from "react"
import Sidebar from "../components/forDashboard/Sidebar"
import WelcomeSection from "../components/forDashboard/WelcomeSection"
import StatisticsSection from "../components/forDashboard/StatisticsSection"
import ChartsSection from "../components/forDashboard/ChartsSection"
import Header from "../components/forHome/Header"
import Footer from "../components/forHome/Footer"
import { Menu } from "lucide-react"
import { useTheme } from "../context/theme-context"
import "./Dashboard.css"
import "../components/darkMode.css"
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
    // Fetch data when component mounts
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Get auth token from localStorage
        const authData = JSON.parse(localStorage.getItem("authData") || "{}")
        const token = authData.token

        if (!token) {
          console.error("No authentication token found")
          return
        }

        // Fetch all data in parallel
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

        // Set statistics data
        setStatsData({
          totalUsers: totalUsersData?.User || 0,
          totalExperts: totalUsersData?.["Ict-expert"] || 0,
          activeUsers: activeUsersData?.activeUsers || 0,
          activeExperts: activeUsersData?.activeExperts || 0,
        })

        // Format country data for the pie chart
        if (countryStatsData && Array.isArray(countryStatsData)) {
          const formattedCountryData = countryStatsData.map((item, index) => ({
            name: item._id || "Unknown",
            value: item.count,
            color: getColorForIndex(index),
          }))
          setCountryData(formattedCountryData)
        }

        // Format activity data for the line chart
        if (activityStatsData && Array.isArray(activityStatsData)) {
          const formattedActivityData = activityStatsData.map((item) => ({
            name: getMonthName(item._id.month),
            value: item.activeUsersCount,
          }));
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

        <div className="dashboard-content fade-in">
          <WelcomeSection role={"admin"} />
          <StatisticsSection data={statsData} loading={loading} />
          <ChartsSection countryData={countryData} activityData={activityData} loading={loading} />
        </div>
        <Footer language={language} />
      </main>
    </div>
  )
}
