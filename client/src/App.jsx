import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Create from "./pages/Create"; // تأكد أن هذا الملف موجود أو احذف السطر

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        
        {/* ✅ هذا هو السطر الأهم لإصلاح مشكلة البروفايل */}
        <Route path="/profile/:username" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        
        <Route path="/search" element={user ? <Search /> : <Navigate to="/" />} />
        <Route path="/create" element={user ? <Create /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
