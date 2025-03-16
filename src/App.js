import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Header from "./components/forHome/Header";
import Signup from "./views/Signup";
import Signin from './views/Signin';
import SearchPage from "./views/SearchPage";
import Dashboard from './components/forDashboard/Dashboard'
import UserManagement from "./components/AllUsers/user-management";
function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/signup" element={<Signup />} />
    //     <Route path="/login" element={<Signin />} />
    //   </Routes>
    // </Router>
    <div>
        <UserManagement></UserManagement>
    </div>
   
    
  );
}


export default App;


