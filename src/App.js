
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Header from "./components/forHome/Header";
import Signup from "./views/Signup";
import Signin from "./views/Signin";
import SearchPage from "./views/SearchPage";
import Dashboard from "./components/forDashboard/Dashboard";
import UserManagement from "./components/AllUsers/user-management";
import Profile from "./components/forProfile/profile-page";
import Profilelibrary from "./components/forProfile/profileLibrary"
import Setting from "./components/forProfile/SettingsPage";
import Faq from "./components/forFAQ/FaqPage"
import ProfileLibrary from "./views/ProfileLibrary";


function App() {
  return (


    <Router>
      <Routes>
        <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/library" element={<ProfileLibrary />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
      </Routes>
    </Router>
  
     
    

)}; 
    
      

export default App;





