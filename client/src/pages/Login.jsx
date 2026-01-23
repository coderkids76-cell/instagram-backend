import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { API_URL } from "../config"; 

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      // حفظ البيانات
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.accessToken || "dummy_token");

      navigate("/home");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Incorrect username or password.");
    }
  };

  const handleForgotPassword = () => {
      // هنا يمكنك إضافة منطق استعادة كلمة المرور لاحقاً
      alert("Reset password feature coming soon! 🔒");
  };

  return (
    <div style={styles.container}>
      
      {/* 1. Header (مكان اللغة سابقاً) */}
      <div style={styles.topBar}>
        <span style={{opacity: 0.6, fontSize: "12px", fontWeight: "600"}}>English (US)</span>
      </div>

      {/* 2. Center Content (Logo + Form) */}
      <div style={styles.centerContent}>
        {/* Logo */}
        <div style={styles.logo}>Nexo</div>

        {/* Form */}
        <form style={styles.form} onSubmit={handleLogin}>
          <input
            placeholder="Username, email or mobile"
            type="text" // غيرناه لـ text ليقبل اليوزرنام أيضاً
            required
            style={styles.input}
            ref={emailRef}
          />
          <input
            placeholder="Password"
            type="password"
            required
            minLength="6"
            style={styles.input}
            ref={passwordRef}
          />
          
          {error && <div style={styles.errorMsg}>{error}</div>}

          <button style={styles.loginBtn} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Forgot Password */}
        <div style={styles.forgotPass} onClick={handleForgotPassword}>
            Forgot password?
        </div>
      </div>

      {/* 3. Bottom Content (Create Account + Footer) */}
      <div style={styles.bottomContent}>
        <button style={styles.createBtn} onClick={() => navigate("/register")}>
            Create new account
        </button>
        
        <div style={styles.footer}>
            <div style={{fontWeight: "bold", fontSize: "14px", color: "#555"}}>Nexo</div>
            <div style={{fontSize: "10px", color: "#777"}}>Social Network Project</div>
        </div>
      </div>

    </div>
  );
}

// --- Styles (Glassmorphism + Instagram Layout) ---
const styles = {
  container: {
    width: "100vw",
    height: "100vh", // يملأ الشاشة
    // نفس تدرج Home.jsx
    background: "linear-gradient(180deg, #E2D1F9 0%, #dbeafe 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between", // توزيع العناصر (فوق - وسط - تحت)
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
  },

  // --- Top Section ---
  topBar: {
    width: "100%",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    color: "#004080",
  },

  // --- Center Section ---
  centerContent: {
    width: "85%",
    maxWidth: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "40px", // رفعه قليلاً للأعلى
  },
  
  logo: {
    fontFamily: "'Billabong', cursive",
    fontSize: "60px", // حجم كبير مثل انستقرام
    color: "#007aff",
    marginBottom: "40px",
    textShadow: "0 4px 10px rgba(0, 122, 255, 0.2)",
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.6)", // حدود شفافة
    background: "rgba(255, 255, 255, 0.45)", // خلفية زجاجية للحقل
    backdropFilter: "blur(5px)",
    outline: "none",
    fontSize: "14px",
    color: "#333",
    boxSizing: "border-box",
    transition: "all 0.3s",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
  },

  loginBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "25px", // دائري بالكامل (Pill shape)
    border: "none",
    background: "#007aff", // أزرق Nexo
    color: "white",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 4px 15px rgba(0, 122, 255, 0.3)",
    transition: "transform 0.2s",
  },

  errorMsg: {
    color: "#e74c3c",
    fontSize: "13px",
    textAlign: "center",
    background: "rgba(231, 76, 60, 0.1)",
    padding: "8px",
    borderRadius: "8px",
  },

  forgotPass: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#004080",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "none",
  },

  // --- Bottom Section ---
  bottomContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "20px",
  },

  createBtn: {
    width: "85%",
    maxWidth: "350px",
    padding: "12px",
    borderRadius: "25px",
    background: "transparent", // شفاف
    border: "1.5px solid #007aff", // حدود زرقاء
    color: "#007aff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "30px", // مسافة قبل الفوتر
    backdropFilter: "blur(5px)",
  },

  footer: {
    textAlign: "center",
    opacity: 0.8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px"
  }
};
