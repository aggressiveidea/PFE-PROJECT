import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/forDashboard/Dashboard";
import UserManagement from "./components/AllUsers/user-management"; 

function App() {
  return (
   <div>
     <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
    
   </div>
  );
}

export default App;



