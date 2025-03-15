import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/forDashboard/Dashboard";
import ProfilePreview from "./components/Profile/ProfilePreview";
import Signup from "./views/Signup";
import AdminUserManagement from "./views/AdminUserManagement";
function App() {
  return (
   
      <div>
        <AdminUserManagement></AdminUserManagement>
      </div>
     
  );
}

export default App;


