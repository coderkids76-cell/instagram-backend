import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { API_URL } from "../config"; // ✅ استيراد رابط السيرفر

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ✅ استخدام الرابط الحقيقي للاتصال بالسيرفر
      const res = await axios.post(`${API_URL}/api/auth/login`, { 
        email: email, 
        password: password 
      });

      // حفظ التذكرة في المتصفح
      localStorage.setItem("token", res.data.token);
      
      // حفظ بيانات المستخدم (اختياري، مفيد للبروفايل لاحقاً)
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // الانتقال للرئيسية
      navigate("/home"); 

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "فشل تسجيل الدخول! تأكد من الإيميل وكلمة السر.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "white",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    wrapper: {
      width: "100%",
      maxWidth: "350px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    logo: {
      fontSize: "3.5rem",
      fontWeight: "800",
      color: "#0066ff",
      marginBottom: "40px",
      letterSpacing: "-1px",
      fontFamily: "cursive" // إضافة خط جمالي للشعار
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
      border: "1px solid #dbdbdb",
      backgroundColor: "#fafafa",
      borderRadius: "12px",
      fontSize: "15px",
      outline: "none",
      boxSizing: "border-box", 
    },
    loginButton: {
      width: "100%",
      padding: "15px",
      backgroundColor: "#0066ff",
      color: "white",
      border: "none",
      borderRadius: "50px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
      transition: "background 0.3s"
    },
    forgotPassword: {
      marginTop: "20px",
      color: "#00376b",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
    },
    divider: {
      width: "100%",
      height: "1px",
      backgroundColor: "#dbdbdb",
      margin: "30px 0",
    },
    createAccountBtn: {
        width: "100%",
        padding: "15px",
        backgroundColor: "white",
        color: "#0066ff",
        border: "1px solid #0066ff",
        borderRadius: "50px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
    }
  };

  return (
    <div style={styles.container}>
        <div style={styles.wrapper}>
            <div style={styles.logo}>Nexo</div>
            
            <form onSubmit={handleLogin} style={styles.form}>
                <input 
                    type="email" 
                    placeholder="Phone number, username, or email" 
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" style={styles.loginButton}>Log in</button>
            </form>

            <div style={styles.forgotPassword}>Forgot password?</div>
            
            <div style={styles.divider}></div>

            <button 
                style={styles.createAccountBtn}
                onClick={() => navigate("/signup")}
            >
                Create new account
            </button>
        </div>
    </div>
  );
}

export default Login;
