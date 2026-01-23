import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react"; // 1. استيراد هذه الأدوات

// 2. استدعاء الصفحات الثقيلة بطريقة Lazy (لا تحمل إلا عند الطلب)
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Search = lazy(() => import("./pages/Search"));
const Create = lazy(() => import("./pages/Create")); // صفحة الرفع الثقيلة
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

// شاشة تحميل بسيطة تظهر أثناء جلب الصفحة (جزء من الثانية)
const LoadingScreen = () => (
  <div style={{height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5"}}>
    <div style={{color: "#007aff", fontWeight: "bold"}}>Nexo...</div>
  </div>
);

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      {/* 3. تغليف التوجيه بـ Suspense */}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
          
          <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
          <Route path="/profile/:username" element={user ? <Profile /> : <Navigate to="/" />} />
          <Route path="/search" element={user ? <Search /> : <Navigate to="/" />} />
          
          {/* صفحة الرفع */}
          <Route path="/create" element={user ? <Create /> : <Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
