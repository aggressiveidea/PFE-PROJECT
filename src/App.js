import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Home from "./views/Home"
import Header from "./components/forHome/Header"
import Signup from "./views/Signup"
import Signin from "./views/Signin"
import SearchPage from "./views/SearchPage"
import Dashboard from "./views/Dashboard"
import UserManagement from "./views/user-management"
import Library from "./views/Library" 
import Setting from "./components/forProfile/Settings"
import Faq from "./components/forFAQ/FaqPage"
import ICTDictionary from "./views/ICTDictionary"
import PersonalInfo from "./components/forTest/PersonalInfo"
import ArticleDetail from "./components/forarticle/ArticleDetail"
import Articlepage from "./views/articlepage"
import VerificationSuccess from "./components/VerificationSuccess"
import UserProfile from "./components/forUserProfile/user-profile"
import ContentAdminDashboard from "./views/DashboardContentAdmin"
import QuizPage from "./views/QuizPage"
import BookLib from "./views/BooksLib"
import PasswordReset from "./components/password-reset"
import ForgotPassword from "./components/forSignup/forgotPassword"

function AppContent() {
  const location = useLocation()
  
  const hideHeaderRoutes = ['/signup', '/login', '/forgot-password', '/reset-password']
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname)

  console.log("App rendering, current path:", location.pathname)

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/library" element={<Library />} />
        <Route path="/dictionary" element={<ICTDictionary />} />
        <Route path="/profile" element={<PersonalInfo />} />
        <Route path="/articles" element={<Articlepage />} />
        <Route path="/verification-success" element={<VerificationSuccess />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/notifs" element={<ContentAdminDashboard />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/terms" element={<SearchPage />} />
        <Route path="/quiz/*" element={<QuizPage />} />
        <Route path="/book" element={<BookLib />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="*"
          element={
            <div style={{ padding: "50px", textAlign: "center" }}>
              <h1>Page Not Found</h1>
              <p>The requested page {location.pathname} does not exist.</p>
              <button onClick={() => (window.location.href = "/")}>Go to Home</button>
            </div>
          }
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App