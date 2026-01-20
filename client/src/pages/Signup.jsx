import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { API_URL } from "../config"; // ✅ استيراد رابط السيرفر

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // ✅ إرسال بيانات التسجيل للسيرفر الحقيقي
      await axios.post(`${API_URL}/api/auth/register`, { 
        email: email,
        username: username,
        password: password 
      });
                                            
      alert("تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول.");
      navigate("/"); // بعد النجاح، نعود لصفحة الدخول

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "فشل إنشاء الحساب! ربما الاسم أو الإيميل مستخدم مسبقاً.");
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
      textAlign: "center",
      border: "1px solid #dbdbdb", // إضافة إطار مثل انستجرام
      padding: "30px",
      borderRadius: "1px"
    },
    logo: {
      fontSize: "3.5rem",
      fontWeight: "800",
      color: "#0066ff",
      marginBottom: "10px",
      letterSpacing: "-1px",
      fontFamily: "cursive" // نفس خط اللوجو في صفحة الدخول
    },
    subtitle: {
      color: "#8e8e8e",
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "20px",
      lineHeight: "20px",
    },
    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    input: {
      width: "100%",
      padding: "12px", // تصغير الحشو قليلاً ليناسب الشكل
      border: "1px solid #dbdbdb",
      backgroundColor: "#fafafa",
      borderRadius: "3px", // حواف أقل دائرية لتطابق الستايل
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box", 
    },
    signupButton: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#0095f6", // لون أزرق انستجرام
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "15px",
      transition: "0.2s opacity"
    },
    divider: {
      width: "100%",
      height: "1px",
      backgroundColor: "#dbdbdb",
      margin: "20px 0",
    },
    loginBox: {
        marginTop: "10px",
        width: "100%",
        maxWidth: "350px",
        border: "1px solid #dbdbdb",
        padding: "20px",
        textAlign: "center",
        fontSize: "14px"
    },
    loginLink: {
      color: "#0095f6",
      fontWeight: "bold",
      cursor: "pointer",
      marginLeft: "5px",
      textDecoration: "none"
    }
  };

  return (
    <div style={styles.container}>
        <div style={styles.wrapper}>
            <div style={styles.logo}>Nexo</div>
            <div style={styles.subtitle}>Sign up to see photos and videos from your friends.</div>
            
            <form onSubmit={handleSignup} style={styles.form}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="text" 
                    placeholder="Username" 
                    style={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <button type="submit" style={styles.signupButton}>Sign up</button>
            </form>
        </div>

        <div style={styles.loginBox}>
            Have an account? 
            <span style={styles.loginLink} onClick={() => navigate("/")}>Log in</span>
        </div>
    </div>
  );
}

export default Signup;
