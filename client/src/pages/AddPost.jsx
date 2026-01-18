import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ModernIcons = {
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Upload: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{color: '#007aff', opacity: 0.8}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  ShareArrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginLeft: '4px'}}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
};

function AddPost() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // معرفة هل القادم من صفحة الريلز؟
  const isReelMode = location.state?.type === "reel";

  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [fileType, setFileType] = useState(""); // image or video

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
      setFileType(file.type.startsWith("video") ? "video" : "image");
    }
  };

  const handleShare = () => {
    if (!media) return alert("Please select media first!");

    // حفظ المنشور في localStorage (محاكاة قاعدة البيانات)
    const newPost = {
      id: Date.now(),
      type: fileType, // 'video' أو 'image'
      url: preview, // في الواقع يجب رفع الملف للسيرفر والحصول على رابط
      caption: caption,
      likes: 0
    };

    // جلب البيانات القديمة وإضافة الجديد
    const savedPosts = JSON.parse(localStorage.getItem("myPosts")) || [];
    localStorage.setItem("myPosts", JSON.stringify([newPost, ...savedPosts]));

    alert(isReelMode ? "✨ Reel Shared!" : "✨ Post Shared!");
    
    // التوجيه حسب النوع
    if (isReelMode || fileType === 'video') {
        navigate("/profile"); // أو لصفحة الريلز
    } else {
        navigate("/home");
    }
  };

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
      background: "linear-gradient(45deg, #007aff, #00c6ff)",
      border: "none",
      color: "white",
      fontWeight: "600",
      padding: "8px 16px",
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    uploadBox: {
      ...glassStyle,
      width: "100%",
      aspectRatio: isReelMode ? "9/16" : "1/1", // أبعاد الريلز مختلفة
      borderRadius: "24px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      marginTop: "20px",
      overflow: "hidden",
      position: "relative",
    },
    mediaPreview: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div onClick={() => navigate(-1)} style={{cursor: "pointer"}}><ModernIcons.Close /></div>
        <span style={{fontWeight: "bold"}}>{isReelMode ? "New Reel" : "New Post"}</span>
        <button style={styles.shareBtn} onClick={handleShare}>
            Share <ModernIcons.ShareArrow />
        </button>
      </div>

      <div style={{padding: "20px"}}>
        <div 
            style={styles.uploadBox}
            onClick={() => document.getElementById("fileInput").click()}
        >
            {preview ? (
                fileType === "video" ? (
                    <video src={preview} style={styles.mediaPreview} autoPlay loop muted />
                ) : (
                    <img src={preview} style={styles.mediaPreview} />
                )
            ) : (
                <div style={{textAlign: "center", color: "#004080"}}>
                    <ModernIcons.Upload />
                    <p style={{fontWeight: "600"}}>Select {isReelMode ? "Video" : "Photo"}</p>
                </div>
            )}
            
            <input 
                type="file" 
                id="fileInput" 
                style={{display: "none"}} 
                accept={isReelMode ? "video/*" : "image/*,video/*"}
                onChange={handleMediaChange}
            />
        </div>

        <textarea 
            style={{...glassStyle, width: "100%", padding: "15px", marginTop: "20px", borderRadius: "15px", border: "none", outline: "none"}} 
            placeholder="Write a caption..." 
            rows="3"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
        />
      </div>
    </div>
  );
}

export default AddPost;
