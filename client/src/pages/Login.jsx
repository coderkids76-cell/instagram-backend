import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { API_URL } from "../config"; 

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate(); // أداة التنقل
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

      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.accessToken || "dummy_token");

      navigate("/home");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Incorrect username or password.");
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. Center Content (Logo + Slogan + Form) */}
      <div style={styles.centerContent}>
        
        {/* Logo */}
        <div style={styles.logo}>Nexo</div>
        
        {/* ✅ الجملة المثيرة للانتباه (Slogan) */}
        <div style={styles.slogan}>
          Connect freely, share uniquely.
        </div>

        {/* Form */}
        <form style={styles.form} onSubmit={handleLogin}>
          <input
            placeholder="Username, email or mobile"
            type="text"
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
        <div style={styles.forgotPass} onClick={() => alert("Reset feature coming soon!")}>
            Forgot password?
        </div>
      </div>

      {/* 2. Bottom Content (Create Account) */}
      <div style={styles.bottomContent}>
        {/* ✅ تصحيح الانتقال: تأكدنا أن يذهب لصفحة signup */}
        <button style={styles.createBtn} onClick={() => navigate("/signup")}>
            Create new account
        </button>
        
        <div style={styles.footer}>
            <div style={{fontWeight: "bold", fontSize: "16px", color: "#444", marginBottom:"2px"}}>Nexo</div>
            <div style={{fontSize: "11px", color: "#666"}}>Social Network Project</div>
        </div>
      </div>

    </div>
  );
}

// --- Styles (Glassmorphism + Layout) ---
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    // خلفية متدرجة متناسقة مع Home.jsx
    background: "linear-gradient(180deg, #E2D1F9 0%, #dbeafe 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // توسيط المحتوى عمودياً
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
    position: "relative"
  },

  // --- Center Section ---
  centerContent: {
    width: "85%",
    maxWidth: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1, // يأخذ المساحة المتاحة ليدفع الفوتر للأسفل
    justifyContent: "center", // يوسط نفسه في المساحة المتاحة
  },
  
  logo: {
    fontFamily: "'Billabong', cursive",
    fontSize: "70px", // حجم كبير وجذاب
    color: "#007aff",
    marginBottom: "5px", // مسافة صغيرة بين اللوجو والشعار
    textShadow: "0 4px 10px rgba(0, 122, 255, 0.15)",
  },

  // ✅ ستايل الجملة الجديدة
  slogan: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#5c87b2", // لون أزرق رمادي متناسق مع الخلفية
    marginBottom: "35px",
    textAlign: "center",
    letterSpacing: "0.5px",
    fontFamily: "'Segoe UI', sans-serif"
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
    border: "1px solid rgba(255, 255, 255, 0.6)",
    background: "rgba(255, 255, 255, 0.6)", // زجاجي أكثر وضوحاً
    backdropFilter: "blur(10px)",
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
    borderRadius: "25px",
    border: "none",
    background: "#007aff",
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
    paddingBottom: "30px", // مسافة من الأسفل
  },

  createBtn: {
    width: "85%",
    maxWidth: "350px",
    padding: "12px",
    borderRadius: "25px",
    background: "rgba(255, 255, 255, 0.3)", // خلفية شفافة خفيفة
    border: "1.5px solid #007aff",
    color: "#007aff",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "40px",
    backdropFilter: "blur(5px)",
  },

  footer: {
    textAlign: "center",
    opacity: 0.9,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
};
