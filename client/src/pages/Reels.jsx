import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- أيقونات SVG ---
const Icons = {
  Back: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Camera: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Heart: ({ filled }) => <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#ff3b30" : "none"} stroke={filled ? "#ff3b30" : "white"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Comment: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  Share: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  More: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>,
  Music: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Report: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Delete: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
};

function Reels() {
  const navigate = useNavigate();
  
  // --- States ---
  const [showComments, setShowComments] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null); // لمعرفة أي ريل نعلق عليه
  const [newCommentText, setNewCommentText] = useState("");
  const [showOptions, setShowOptions] = useState(null); // ID الريل المفتوح خياراته

  // بيانات وهمية للريلز
  const [reels, setReels] = useState([
    {
      id: 1,
      user: "travel_addict",
      userImg: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150",
      video: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600&h=900&fit=crop", // صورة تمثل فيديو
      likes: 45000,
      isLiked: false,
      caption: "Sunset lover 🌅 #nature",
      music: "Original Audio",
      commentsCount: "1.2K"
    },
    {
      id: 2,
      user: "fitness_pro",
      userImg: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
      video: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=900&fit=crop",
      likes: 1200,
      isLiked: false,
      caption: "No pain no gain 💪 #gym",
      music: "Workout Motivation",
      commentsCount: "340"
    },
    {
      id: 3,
      user: "foodie_chef",
      userImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      video: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=900&fit=crop",
      likes: 8500,
      isLiked: false,
      caption: "Italian Pasta 🍝 #food",
      music: "Cooking Time",
      commentsCount: "890"
    }
  ]);

  const [comments, setComments] = useState([
    { user: "john_doe", text: "Amazing view! 🔥", img: "https://i.pravatar.cc/150?img=12" },
    { user: "sarah_99", text: "Love this place 😍", img: "https://i.pravatar.cc/150?img=5" },
    { user: "mike_t", text: "Wow! 🌊", img: "https://i.pravatar.cc/150?img=3" },
    { user: "lisa_art", text: "Colors are unreal!", img: "https://i.pravatar.cc/150?img=9" },
    { user: "ahmed_k", text: "Subhanallah ❤️", img: "https://i.pravatar.cc/150?img=11" },
  ]);

  // إعدادات الصفحة عند التحميل
  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    return () => { document.body.style.backgroundColor = ""; }
  }, []);

  // --- Handlers ---
  const toggleLike = (id) => {
    setReels(reels.map(r => r.id === id ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r));
  };

  const handlePostComment = () => {
    if (!newCommentText.trim()) return;
    setComments([...comments, { user: "me", text: newCommentText, img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" }]);
    setNewCommentText("");
  };

  const formatNumber = (num) => num > 999 ? (num/1000).toFixed(1) + 'K' : num;

  // --- CSS Styles ---
  const styles = {
    mainContainer: {
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "black", zIndex: 1,
      // تفعيل السكرول المغناطيسي (Snap)
      overflowY: showComments ? "hidden" : "scroll", // قفل السكرول عند فتح التعليقات
      scrollSnapType: "y mandatory",
      scrollBehavior: "smooth",
    },
    // كل قسم فيديو
    reelSection: {
      position: "relative", width: "100%", height: "100vh", // ملء الشاشة
      scrollSnapAlign: "start", // نقطة التوقف
      overflow: "hidden",
    },
    videoBg: {
      width: "100%", height: "100%", objectFit: "cover",
      filter: "brightness(0.85)"
    },
    // العناصر العائمة (Header, Sidebar, Info)
    overlay: {
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "20px 10px 40px 10px", pointerEvents: "none" // للسماح بالنقر في المنتصف
    },
    // الهيدر
    header: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginTop: "10px", pointerEvents: "auto"
    },
    glassBtn: {
      background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
      borderRadius: "50%", width: "40px", height: "40px",
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "1px solid rgba(255,255,255,0.2)", color: "white", cursor: "pointer"
    },
    // المعلومات في الأسفل
    bottomInfo: {
      display: "flex", alignItems: "flex-end", justifyContent: "space-between",
      pointerEvents: "auto"
    },
    textInfo: {
      color: "white", maxWidth: "75%", 
      textShadow: "0 1px 3px rgba(0,0,0,0.8)"
    },
    userInfo: { display: "flex", alignItems: "center", marginBottom: "10px" },
    userAvatar: { width: "32px", height: "32px", borderRadius: "50%", marginRight: "10px", border: "2px solid white" },
    username: { fontWeight: "bold", fontSize: "14px", marginRight: "10px" },
    followBtn: {
      border: "1px solid white", borderRadius: "6px", padding: "2px 8px",
      fontSize: "12px", fontWeight: "bold", background: "rgba(0,0,0,0.3)"
    },
    caption: { fontSize: "14px", marginBottom: "10px", lineHeight: "1.4" },
    musicTag: { display: "flex", alignItems: "center", fontSize: "12px", gap: "5px" },
    
    // القائمة الجانبية (لايك، كومنت...)
    sideBar: { display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", pointerEvents: "auto" },
    sideItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" },
    actionText: { color: "white", fontSize: "12px", fontWeight: "600", textShadow: "0 1px 2px black" },
    
    // --- قائمة الخيارات (Report/Delete) ---
    optionsMenu: {
      position: "absolute", bottom: "50px", right: "50px",
      background: "rgba(255,255,255,0.9)", backdropFilter: "blur(15px)",
      borderRadius: "12px", padding: "5px", zIndex: 100,
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
      display: "flex", flexDirection: "column", minWidth: "140px"
    },
    optionRow: {
      display: "flex", alignItems: "center", gap: "10px", padding: "10px",
      fontSize: "14px", fontWeight: "600", cursor: "pointer", borderRadius: "8px"
    },

    // --- نافذة التعليقات (Modal) ---
    commentsModal: {
      position: "fixed", bottom: 0, left: 0, width: "100%", height: "60%",
      backgroundColor: "rgba(20, 20, 20, 0.98)", backdropFilter: "blur(20px)",
      borderTopLeftRadius: "20px", borderTopRightRadius: "20px",
      zIndex: 200, color: "white",
      display: "flex", flexDirection: "column",
      transition: "transform 0.3s ease",
      transform: showComments ? "translateY(0)" : "translateY(100%)",
    },
    modalHeader: {
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "15px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)"
    },
    commentList: {
      flex: 1, overflowY: "auto", padding: "15px",
      overscrollBehavior: "contain" // يمنع سكرول الصفحة الخلفية
    },
    commentRow: { display: "flex", gap: "10px", marginBottom: "15px" },
    commentInputBox: {
      borderTop: "1px solid rgba(255,255,255,0.1)", padding: "10px 15px",
      display: "flex", alignItems: "center", gap: "10px",
      paddingBottom: "max(15px, env(safe-area-inset-bottom))", // للنوتش
      backgroundColor: "#1a1a1a" // خلفية صلبة
    },
    inputField: {
      flex: 1, background: "#333", border: "none", borderRadius: "20px",
      padding: "10px 15px", color: "white", fontSize: "14px", outline: "none"
    }
  };

  return (
    <div style={styles.mainContainer}>
      
      {/* حلقة التكرار للريلز */}
      {reels.map((reel) => (
        <div key={reel.id} style={styles.reelSection}>
          <img src={reel.video} style={styles.videoBg} alt="reel" />
          
          {/* الطبقة العائمة */}
          <div style={styles.overlay} onClick={() => { setShowOptions(null); setShowComments(false); }}>
            
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.glassBtn} onClick={(e) => { e.stopPropagation(); navigate("/home"); }}>
                <Icons.Back />
              </div>
              <span style={{color:"white", fontWeight:"bold", fontSize:"18px"}}>Reels</span>
              <div style={styles.glassBtn} onClick={(e) => { e.stopPropagation(); navigate("/create", { state: { type: "reel" } }); }}>
                <Icons.Camera />
              </div>
            </div>

            {/* Bottom Info & Sidebar */}
            <div style={styles.bottomInfo}>
              
              {/* Text Info */}
              <div style={styles.textInfo}>
                <div style={styles.userInfo}>
                  <img src={reel.userImg} style={styles.userAvatar} alt="user" />
                  <span style={styles.username}>{reel.user}</span>
                  <div style={styles.followBtn}>Follow</div>
                </div>
                <div style={styles.caption}>{reel.caption}</div>
                <div style={styles.musicTag}>
                  <Icons.Music /> <marquee style={{maxWidth:"100px"}}>{reel.music}</marquee>
                </div>
              </div>

              {/* Sidebar Buttons */}
              <div style={styles.sideBar}>
                <div style={styles.sideItem} onClick={(e) => { e.stopPropagation(); toggleLike(reel.id); }}>
                  <Icons.Heart filled={reel.isLiked} />
                  <span style={styles.actionText}>{formatNumber(reel.likes)}</span>
                </div>

                <div style={styles.sideItem} onClick={(e) => { e.stopPropagation(); setShowComments(true); setActiveCommentId(reel.id); }}>
                  <Icons.Comment />
                  <span style={styles.actionText}>{reel.commentsCount}</span>
                </div>

                <div style={styles.sideItem} onClick={(e) => { e.stopPropagation(); alert("Shared!"); }}>
                  <Icons.Share />
                  <span style={styles.actionText}>Share</span>
                </div>

                {/* More Options & Menu */}
                <div style={{position: "relative", ...styles.sideItem}}>
                  <div onClick={(e) => { e.stopPropagation(); setShowOptions(showOptions === reel.id ? null : reel.id); }}>
                    <Icons.More />
                  </div>
                  
                  {/* القائمة المنبثقة */}
                  {showOptions === reel.id && (
                    <div style={styles.optionsMenu}>
                      <div style={{...styles.optionRow, color: "#ff4444"}} onClick={() => alert("Reported!")}>
                        <Icons.Report /> Report
                      </div>
                      <div style={styles.optionRow} onClick={() => alert("Deleted!")}>
                        <Icons.Delete /> Delete
                      </div>
                    </div>
                  )}
                </div>

                <img src={reel.userImg} style={{width:"30px", height:"30px", borderRadius:"6px", border:"2px solid white"}} alt="profile" />
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* --- Comments Modal --- */}
      <div style={styles.commentsModal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <span style={{fontWeight:"bold"}}>Comments</span>
          <div onClick={() => setShowComments(false)} style={{cursor:"pointer"}}>
            <Icons.Close />
          </div>
        </div>

        {/* List */}
        <div style={styles.commentList}>
          {comments.map((c, i) => (
            <div key={i} style={styles.commentRow}>
              <img src={c.img} style={styles.userAvatar} alt="user" />
              <div>
                <span style={{fontWeight:"bold", fontSize:"13px", color:"#ddd", marginRight:"5px"}}>{c.user}</span>
                <span style={{color:"white", fontSize:"13px"}}>{c.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={styles.commentInputBox}>
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" style={{width:"32px", height:"32px", borderRadius:"50%"}} />
          <input 
            type="text" 
            style={styles.inputField} 
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <div 
            style={{color:"#0095f6", fontWeight:"bold", fontSize:"14px", cursor:"pointer"}} 
            onClick={handlePostComment}
          >
            Post
          </div>
        </div>
      </div>

    </div>
  );
}

export default Reels;
