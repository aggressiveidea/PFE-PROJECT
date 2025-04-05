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
import Profilelibrary from "./components/forProfile/profileLibrary";
import Setting from "./components/forProfile/SettingsPage";
import Faq from "./components/forFAQ/FaqPage";
import ICTDictionary from "./views/ICTDictionary";
import PersonalInfo from "./components/forTest/PersonalInfo";
import ArticleDetail from "./components/forarticle/ArticleDetailPage";
import Articlepage from "./views/articlepage";
import GraphVisualization from "./views/GraphVisualization";
import VerificationSuccess from "./components/VerificationSuccess";
import UserProfile from "./components/forUserProfile/user-profile";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/library" element={<Profilelibrary />} />
        <Route path="/dictionary" element={<ICTDictionary />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/profile" element = {<PersonalInfo />}></Route>
        <Route path="/graph" element={<GraphVisualization />}></Route>
        <Route path="/articles" element={<Articlepage />}></Route>
        <Route path="/verification-success" element={<VerificationSuccess />}></Route>
        <Route path="/userProfile" element={<UserProfile />}></Route>
      </Routes>
    </Router>

  );

}

export default App;




