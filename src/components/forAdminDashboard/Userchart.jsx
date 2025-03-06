import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
//ni ntester berk 
const userData = [
  { month: "Jan", users: 50 },
  { month: "Feb", users: 100 },
  { month: "Mar", users: 150 },
  { month: "Apr", users: 200 },
  { month: "May", users: 300 },
];

const UserChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={userData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="users" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserChart;
