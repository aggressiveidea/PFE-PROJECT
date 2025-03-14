import { Users, UserCheck, Activity } from "lucide-react"
import "./StatisticsSection.css"

export default function StatisticsSection() {
  const statisticsData = [
    {
      title: "Total Users",
      value: "7,265",
      icon: <Users size={24} />,
      gradientClass: "gradient-blue-indigo",
    },
    {
      title: "Total ICT Experts",
      value: "1,432",
      icon: <UserCheck size={24} />,
      gradientClass: "gradient-indigo-purple",
    },
    {
      title: "Active Users",
      value: "5,879",
      icon: <Activity size={24} />,
      gradientClass: "gradient-purple-pink",
    },
    {
      title: "Active ICT Experts",
      value: "1,089",
      icon: <UserCheck size={24} />,
      gradientClass: "gradient-pink-rose",
    },
  ]

  return (
    <div className="statistics-section">
      {statisticsData.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.gradientClass}`}>
          <div className="stat-card-content">
            <div className="stat-card-header">
              <h3 className="stat-card-title">{stat.title}</h3>
              <div className="stat-card-icon">{stat.icon}</div>
            </div>
            <div className="stat-card-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

