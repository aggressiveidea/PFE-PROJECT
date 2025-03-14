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
  
  export default function ChartsSection() {
    const barChartData = [
      { name: "Jan", value: 400 },
      { name: "Feb", value: 300 },
      { name: "Mar", value: 600 },
      { name: "Apr", value: 800 },
    ]
  
    const pieChartData = [
      { name: "United States", value: 17.6, color: "#4f46e5" },
      { name: "United Kingdom", value: 15.3, color: "#7c3aed" },
      { name: "France", value: 12.9, color: "#a855f7" },
      { name: "Germany", value: 11.2, color: "#d946ef" },
      { name: "Canada", value: 9.8, color: "#ec4899" },
    ]
  
    const lineChartData = [
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
  
    const barColors = ["#4f46e5", "#7c3aed", "#a855f7", "#d946ef"]
  
    return (
      <div className="charts-section">
        <div className="chart-card">
          <h3 className="chart-title">User Activity</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Activity" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        <div className="chart-card">
          <h3 className="chart-title">Top 5 Countries</h3>
          <div className="chart-container">
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
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        <div className="chart-card full-width">
          <h3 className="chart-title">User Activity Per Month</h3>
          <div className="chart-container">
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
                  name="Monthly Activity"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }
  
  