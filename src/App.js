import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/forDashboard/Dashboard";
import ProfilePreview from "./components/Profile/ProfilePreview";
import Signup from "./views/Signup";
function App() {
  return (
   
      <div>
        <Signup></Signup>
        <ProfilePreview></ProfilePreview>
      </div>
     
  );
}

export default App;


