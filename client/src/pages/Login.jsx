import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { API_URL } from "../config"; // تأكد من المسار
import axios from "axios";

// --- تصميم Glassmorphism ---
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", // نفس خلفية التطبيق
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  // دوائر خلفية لإبراز الزجاج
  blob1: {
    position: "absolute", top: "-10%", left: "-10%", width: "300px", height: "300px",
    background: "#a1c4fd", borderRadius: "50%", filter: "blur(50px)", opacity: 0.6
  },
  blob2: {
    position: "absolute", bottom: "-10%", right: "-10%", width: "300px", height: "300px",
    background: "#c2e9fb", borderRadius: "50%", filter: "blur(50px)", opacity: 0.6
  },
  
  // البطاقة الزجاجية
  card: {
    width: "85%",
    maxWidth: "400px",
    padding: "40px 30px",
    background: "rgba(255, 255, 255, 0.25)", // زجاج شفاف
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "30px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  
  logo: {
    fontFamily: "'Billabong', cursive",
    fontSize: "50px",
    color: "#007aff",
    marginBottom: "30px",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  
  input: {
    width: "100%",
    padding: "15px",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    background: "rgba(255, 255, 255, 0.5)",
    outline: "none",
    fontSize: "14px",
    color: "#333",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
  },
  
  button: {
    width: "100%",
    padding: "15px",
    borderRadius: "15px",
    border: "none",
    background: "linear-gradient(45deg, #007aff, #00c6ff)",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 4px 15px rgba(0, 122, 255, 0.3)",
    transition: "transform 0.2s",
  },
  
  link: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#555",
    textDecoration: "none",
  },
  
  signupText: {
    color: "#007aff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  
  error: {
    color: "#ff3b30",
    fontSize: "13px",
    marginBottom: "10px",
    background: "rgba(255, 59, 48, 0.1)",
    padding: "8px",
    borderRadius: "8px",
    width: "100%",
  }
};

export default function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    // ✅✅✅ هذا هو الحل للمشكلة الأولى!
    e.preventDefault(); // يمنع تحديث الصفحة
    
    setLoading(true);
    setError(null);

    try {
      // إرسال طلب تسجيل الدخول
      const res = await axios.post(API_URL + "/api/auth/login", {
        email: email.current.value,
        password: password.current.value,
      });

      // ✅ حفظ المستخدم في LocalStorage (مهم جداً لكي تعمل Home.jsx)
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.accessToken || "dummy_token"); // إذا كنت تستخدم التوكن

      // ✅ التوجيه إلى الصفحة الرئيسية
      navigate("/home");
      
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Wrong email or password! Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      {/* خلفية جمالية */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.card}>
        <div style={styles.logo}>Nexo</div>
        
        {error && <div style={styles.error}>{error}</div>}

        <form style={styles.form} onSubmit={handleClick}>
          <input
            placeholder="Email"
            type="email"
            required
            style={styles.input}
            ref={email}
          />
          <input
            placeholder="Password"
            type="password"
            required
            minLength="6"
            style={styles.input}
            ref={password}
          />
          
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div style={styles.link}>
          Don't have an account?{" "}
          <Link to="/register" style={{textDecoration: "none"}}>
             <span style={styles.signupText}>Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
