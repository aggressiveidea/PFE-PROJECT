import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Header from "./components/forHome/Header";
import Signup from "./views/Signup";
import Signin from "./views/Signin";
import SearchPage from "./views/SearchPage";
import Dashboard from "./views/Dashboard";
import UserManagement from "./views/user-management";
import Profile from "./components/forProfile/profile-page";
import Profilelibrary from "./components/forProfile/profileLibrary";
import Setting from "./components/forProfile/SettingsPage";
import Faq from "./components/forFAQ/FaqPage";
import ICTDictionary from "./views/ICTDictionary";
import PersonalInfo from "./components/forTest/PersonalInfo";
import ArticleDetail from "./components/forarticle/ArticleDetailPage";
import Articlepage from "./views/articlepage";
//import GraphVisualization from "./views/GraphVisualization";
import VerificationSuccess from "./components/VerificationSuccess";
import UserProfile from "./components/forUserProfile/user-profile";
import ContentAdminDashboard from "./views/ContentAdminDashboard";
import CategoriesExplorer from "./views/SearchInput";
function App() {
  //<Route path="/graph" element={<GraphVisualization />}></Route>
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
        <Route path="/profile" element={<PersonalInfo />}></Route>
        <Route path="/articles" element={<Articlepage />}></Route>
        <Route
          path="/verification-success"
          element={<VerificationSuccess />}
        ></Route>
        <Route path="/userProfile" element={<UserProfile />}></Route>
        <Route path="/notifs" element={<ContentAdminDashboard />}></Route>
        <Route path="/articles/:id" element={<ArticleDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
