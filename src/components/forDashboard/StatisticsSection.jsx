"use client"

import { useState, useEffect } from "react"
import { Users, UserCheck, Activity } from "lucide-react"
import "./StatisticsSection.css"


function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        const nextCount = Math.floor((progress / duration) * end)
        setCount(nextCount)
        animationFrame = requestAnimationFrame(updateCount)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [end, duration])

  return <span>{count.toLocaleString()}</span>
}

export default function StatisticsSection({ data, loading }) {
  // Calculate statistics from data
  const getTotalUsers = () => data?.users?.length || 0
  const getTotalExperts = () => data?.experts?.length || 0
  const getActiveUsers = () => data?.activeUsers?.length || 0
  const getActiveExperts = () => data?.activeExperts?.length || 0

  const statisticsData = [
    {
      title: "Total Users",
      getValue: getTotalUsers,
      icon: <Users size={24} />,
      gradientClass: "gradient-blue-indigo",
    },
    {
      title: "Total ICT Experts",
      getValue: getTotalExperts,
      icon: <UserCheck size={24} />,
      gradientClass: "gradient-indigo-purple",
    },
    {
      title: "Active Users",
      getValue: getActiveUsers,
      icon: <Activity size={24} />,
      gradientClass: "gradient-purple-pink",
    },
    {
      title: "Active ICT Experts",
      getValue: getActiveExperts,
      icon: <UserCheck size={24} />,
      gradientClass: "gradient-pink-rose",
    },
  ]

  return (
    <div className="statistics-section">
      {statisticsData.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.gradientClass}`} style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="stat-card-content">
            <div className="stat-card-header">
              <h3 className="stat-card-title">{stat.title}</h3>
              <div className="stat-card-icon">{stat.icon}</div>
            </div>
            <div className="stat-card-value">
              {loading ? (
                <div className="stat-loading-indicator">Loading...</div>
              ) : (
                <AnimatedCounter end={stat.getValue()} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


