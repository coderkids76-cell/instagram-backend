import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { API_URL } from "../config"; 

export default function Signup() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setError(null);

    try {
      // إرسال طلب إنشاء الحساب
      await axios.post(`${API_URL}/api/auth/register`, {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      
      // بعد النجاح، التوجيه لصفحة الدخول
      alert("Account created successfully! Please log in.");
      navigate("/"); 
    } catch (err) {
      console.log(err);
      setLoading(false);
      // عرض رسالة خطأ واضحة إذا كان الاسم أو الإيميل مكرراً
      if (err.response && err.response.status === 409) {
          setError("Username or Email already exists.");
      } else {
          setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. Center Content (Logo + Header + Form) */}
      <div style={styles.centerContent}>
        
        {/* Logo */}
        <div style={styles.logo}>Nexo</div>
        
        {/* Header Sentence */}
        <div style={styles.headerText}>
          Join the Nexo community.
        </div>

        {/* Form */}
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            type="text"
            required
            minLength="3"
            style={styles.input}
            ref={usernameRef}
          />
          <input
            placeholder="Email address"
            type="email"
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

          <button style={styles.signupBtn} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <div style={styles.termsText}>
            By signing up, you agree to our Terms, Data Policy and Cookies Policy.
        </div>
      </div>

      {/* 2. Bottom Content (Switch to Login) */}
      <div style={styles.bottomContent}>
        <button style={styles.loginSwitchBtn} onClick={() => navigate("/")}>
            Already have an account? Log in
        </button>
        
        <div style={styles.footer}>
            <div style={{fontWeight: "bold", fontSize: "16px", color: "#444", marginBottom:"2px"}}>Nexo</div>
            <div style={{fontSize: "11px", color: "#666"}}>from Meta (Social Project)</div>
        </div>
      </div>

    </div>
  );
}

// --- Styles (مطابق تماماً لتصميم Login.jsx) ---
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    // نفس الخلفية المتدرجة
    background: "linear-gradient(180deg, #E2D1F9 0%, #dbeafe 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
    flex: 1,
    justifyContent: "center",
    marginTop: "20px" // إزاحة بسيطة للأسفل
  },
  
  logo: {
    fontFamily: "'Billabong', cursive",
    fontSize: "70px",
    color: "#007aff",
    marginBottom: "10px",
    textShadow: "0 4px 10px rgba(0, 122, 255, 0.15)",
  },

  headerText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#5c87b2",
    marginBottom: "30px",
    textAlign: "center",
    fontFamily: "'Segoe UI', sans-serif"
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  // الحقول الزجاجية
  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    background: "rgba(255, 255, 255, 0.6)", 
    backdropFilter: "blur(10px)",
    outline: "none",
    fontSize: "14px",
    color: "#333",
    boxSizing: "border-box",
    transition: "all 0.3s",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
  },

  signupBtn: {
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
  
  termsText: {
      fontSize: "12px",
      color: "#777",
      textAlign: "center",
      marginTop: "20px",
      lineHeight: "1.4",
      width: "90%"
  },

  // --- Bottom Section ---
  bottomContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "30px",
  },

  loginSwitchBtn: {
    width: "85%",
    maxWidth: "350px",
    padding: "12px",
    borderRadius: "25px",
    background: "rgba(255, 255, 255, 0.3)",
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
