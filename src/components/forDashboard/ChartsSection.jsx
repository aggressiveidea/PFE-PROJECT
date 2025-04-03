"use client"

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import "./ChartsSection.css"

export default function ChartsSection({ countryData = [], activityData = [], loading }) {
  // Default data for when API data is not available
  const defaultBarData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
  ]

  const defaultPieData = [
    { name: "United States", value: 17.6, color: "#4f46e5" },
    { name: "United Kingdom", value: 15.3, color: "#7c3aed" },
    { name: "France", value: 12.9, color: "#a855f7" },
    { name: "Germany", value: 11.2, color: "#d946ef" },
    { name: "Canada", value: 9.8, color: "#ec4899" },
  ]

  const defaultLineData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 700 },
    { name: "Jun", value: 900 },
    { name: "Jul", value: 1000 },
    { name: "Aug", value: 1200 },
    { name: "Sep", value: 1100 },
    { name: "Oct", value: 1300 },
    { name: "Nov", value: 1400 },
    { name: "Dec", value: 1200 },
  ]

  // Use real data if available, otherwise use default data
  const barChartData = activityData.length > 0 ? activityData.slice(0, 4) : defaultBarData
  const pieChartData = countryData.length > 0 ? countryData.slice(0, 5) : defaultPieData
  const lineChartData = activityData.length > 0 ? activityData : defaultLineData

  const barColors = ["#4f46e5", "#7c3aed", "#a855f7", "#d946ef"]

  // Custom tooltip for the pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="tooltip-percentage">{`${((payload[0].value / getTotalUsers()) * 100).toFixed(1)}%`}</p>
        </div>
      )
    }
    return null
  }

  // Helper function to get total users for percentage calculation
  const getTotalUsers = () => {
    return pieChartData.reduce((sum, item) => sum + item.value, 0)
  }

  return (
    <div className="charts-section">
      <div className="chart-card">
        <h3 className="chart-title">Recent User Activity</h3>
        <div className="chart-container">
          {loading ? (
            <div className="chart-loading">Loading activity data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Active Users" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Top Countries</h3>
        <div className="chart-container">
          {loading ? (
            <div className="chart-loading">Loading country data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="chart-card full-width">
        <h3 className="chart-title">User Activity Per Month</h3>
        <div className="chart-container">
          {loading ? (
            <div className="chart-loading">Loading monthly activity data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Monthly Active Users"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}


  