"use client"

import React from "react"
import Sidebar from "./Sidebar"
import SearchBar from "./SearchBar"
import WelcomeSection from "./WelcomeSection"
import StatisticsSection from "./StatisticsSection"
import ChartsSection from "./ChartsSection"
import "./Dashboard.css"

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="dashboard-container">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <main className={`dashboard-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="dashboard-content">
          <SearchBar />
          <WelcomeSection />
          <StatisticsSection />
          <ChartsSection />
        </div>
      </main>
    </div>
  )
}

