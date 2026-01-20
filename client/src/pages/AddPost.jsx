import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config"; 

const ModernIcons = {
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Upload: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{color: '#007aff', opacity: 0.8}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  ShareArrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginLeft: '4px'}}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  Remove: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
};

function AddPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReelMode = location.state?.type === "reel";

  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState(""); // لتخزين كود الصورة

  // ✅ دالة سحرية لتحويل الملف إلى نص (Base64)
  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreview(reader.result); // للعرض
        setImageBase64(reader.result); // للإرسال
      };
    }
  };

  const removeMedia = (e) => {
    e.stopPropagation();
    setPreview(null);
    setImageBase64("");
  };

  const handleShare = async () => {
    if (!imageBase64 && !caption.trim()) {
        return alert("Please write something or select media!");
    }

    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ نرسل الصورة كـ نص (img) مباشرة مع البيانات
    const newPost = {
      userId: user._id,
      desc: caption,
      img: imageBase64 // هنا نرسل الصورة المحولة
    };

    try {
        // إرسال المنشور للسيرفر مباشرة (بدون خطوة upload منفصلة)
        await axios.post(`${API_URL}/api/posts`, newPost);

        if (isReelMode) {
            navigate("/profile");
        } else {
            navigate("/home");
        }

    } catch (err) {
        console.error(err);
        alert("Failed to share post.");
    } finally {
        setLoading(false);
    }
  };

  // ... (نفس الستايلات السابقة بدون تغيير)
  const glassStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #f0f8ff 0%, #e6f0ff 50%, #f5faff 100%)",
      fontFamily: "sans-serif",
    },
    header: {
      ...glassStyle,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 20px",
      borderRadius: "0 0 20px 20px",
    },
    shareBtn: {
      background: loading ? "#ccc" : "linear-gradient(45deg, #007aff, #00c6ff)",
      border: "none",
      color: "white",
      fontWeight: "600",
      padding: "8px 16px",
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      cursor: loading ? "not-allowed" : "pointer",
    },
    uploadBox: {
      ...glassStyle,
      width: "100%",
      aspectRatio: preview ? (isReelMode ? "9/16" : "auto") : "2/1", 
      minHeight: "150px",
      borderRadius: "24px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      marginTop: "20px",
      overflow: "hidden",
      position: "relative",
      transition: "all 0.3s ease"
    },
    mediaPreview: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      maxHeight: "400px"
    },
    removeBtn: {
        position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(255,255,255,0.8)", borderRadius: "50%", padding: "5px", cursor: "pointer", zIndex: 10
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div onClick={() => navigate(-1)} style={{cursor: "pointer"}}><ModernIcons.Close /></div>
        <span style={{fontWeight: "bold"}}>{isReelMode ? "New Reel" : "New Post"}</span>
        <button style={styles.shareBtn} onClick={handleShare} disabled={loading}>
            {loading ? "Posting..." : "Share"} {!loading && <ModernIcons.ShareArrow />}
        </button>
      </div>

      <div style={{padding: "20px"}}>
        <textarea 
            style={{...glassStyle, width: "100%", padding: "15px", marginBottom: "20px", borderRadius: "15px", border: "none", outline: "none", fontSize: "16px"}} 
            placeholder="What's on your mind?" 
            rows="4"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
        />
        <div 
            style={styles.uploadBox}
            onClick={() => document.getElementById("fileInput").click()}
        >
            {preview ? (
                <>
                    <div style={styles.removeBtn} onClick={removeMedia}><ModernIcons.Remove /></div>
                    <img src={preview} style={styles.mediaPreview} alt="preview" />
                </>
            ) : (
                <div style={{textAlign: "center", color: "#004080", padding: "20px"}}>
                    <ModernIcons.Upload />
                    <p style={{fontWeight: "600", marginTop: "10px"}}>Add Photo</p>
                </div>
            )}
            <input 
                type="file" 
                id="fileInput" 
                style={{display: "none"}} 
                accept="image/*"
                onChange={handleMediaChange}
            />
        </div>
      </div>
    </div>
  );
}

export default AddPost;
