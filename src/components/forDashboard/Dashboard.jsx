"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import SearchBar from "./SearchBar"
import WelcomeSection from "./WelcomeSection"
import StatisticsSection from "./StatisticsSection"
import ChartsSection from "./ChartsSection"
import ProfileSection from "./ProfileSection"
import Header from "../forHome/Header";
import Footer  from "../forHome/Footer"
import { Menu } from "lucide-react"
import "./Dashboard.css"

// Mock data fetching function - replace with your actual API call
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        users: Array(7265).fill({}),
        experts: Array(1432).fill({}),
        activeUsers: Array(5879).fill({}),
        activeExperts: Array(1089).fill({}),
      })
    }, 1000)
  })
}

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [data, setData] = useState(null)
  const [ loading, setLoading ] = useState( true )
  
   const [darkMode, setDarkMode] = useState(false);
   const [language, setLanguage] = useState("en");

   useEffect(() => {
     if (darkMode) {
       document.body.classList.add("dark");
     } else {
       document.body.classList.remove("dark");
     }
   }, [darkMode]);


  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  useEffect(() => {
    // Fetch data when component mounts
    const getData = async () => {
      setLoading(true)
      try {
        const result = await fetchData()
        setData(result)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [])

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

      <Header
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
      />
      
      <main
        className={`dashboard-main ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div className="dashboard-header">
          {/* <SearchBar /> */}
          {/* <ProfileSection /> */}
        </div>

        <div className="dashboard-content fade-in">
          <WelcomeSection />
          <StatisticsSection data={data} loading={loading} />
          <ChartsSection />
        </div>
        <Footer
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        />

      </main>
      
    </div>
  );
}


