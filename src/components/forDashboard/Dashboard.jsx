"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import WelcomeSection from "./WelcomeSection"
import StatisticsSection from "./StatisticsSection"
import ChartsSection from "./ChartsSection"
import Header from "../forHome/Header"
import Footer from "../forHome/Footer"
import { Menu } from "lucide-react"
import "./Dashboard.css"
import { getTotalUsers, getActiveUsers, getUsersByCountry, getUserActivityPerMonth } from "../../services/Api"

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [statsData, setStatsData] = useState(null)
  const [countryData, setCountryData] = useState([])
  const [activityData, setActivityData] = useState([])
  const [loading, setLoading] = useState(true)

  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

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
          totalExperts: totalUsersData?.["ICT-Expert"] || 0,
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
            value: item.count,
          }))
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

  // Helper function to get color for pie chart
  const getColorForIndex = (index) => {
    const colors = ["#4f46e5", "#7c3aed", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#8b5cf6", "#6366f1"]
    return colors[index % colors.length]
  }

  // Helper function to convert month number to name
  const getMonthName = (monthNum) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[monthNum - 1] || `Month ${monthNum}`
  }

  return (
    <div className="dashboard-container">
      {/* Mobile menu button */}
      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        <Menu size={24} />
      </button>

      <Sidebar
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileMenuOpen}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />

      <Header language={language} setLanguage={setLanguage} darkMode={darkMode} />

      <main className={`dashboard-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="dashboard-header">
          {/* <SearchBar /> */}
          {/* <ProfileSection /> */}
        </div>

        <div className="dashboard-content fade-in">
          <WelcomeSection />
          <StatisticsSection data={statsData} loading={loading} />
          <ChartsSection countryData={countryData} activityData={activityData} loading={loading} />
        </div>
        <Footer darkMode={darkMode} setDarkMode={setDarkMode} language={language} />
      </main>
    </div>
  )
}



