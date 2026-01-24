import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// ✅ استيراد عادي (بدون lazy) لجميع الصفحات
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import AddPost from "./pages/AddPost"; // ✅ استبدال Create بـ AddPost

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        {/* التوجيه والتحقق من المستخدم */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
        
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        
        {/* مسارات البروفايل */}
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/profile/:username" element={user ? <Profile /> : <Navigate to="/" />} />
        
        <Route path="/search" element={user ? <Search /> : <Navigate to="/" />} />
        
        {/* ✅ توجيه الرابط /create لفتح صفحة AddPost */}
        <Route path="/create" element={user ? <AddPost /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
