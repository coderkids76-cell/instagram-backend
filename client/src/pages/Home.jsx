import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config"; 

// --- الأيقونات (تم تحسين الألوان لتناسب الزجاج) ---
const Icons = {
  Logo: () => <div style={{fontFamily: "'Billabong', cursive", fontSize: "32px", background: "linear-gradient(45deg, #007aff, #00c6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "bold"}}>Nexo</div>, 
  Heart: () => <svg aria-label="Notifications" color="#004080" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.956-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>,
  Home: () => <svg aria-label="Home" color="currentColor" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>,
  Search: () => <svg aria-label="Search" color="currentColor" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="16.511" x2="21.643" y1="16.511" y2="21.643"></line></svg>,
  Plus: () => <svg aria-label="New Post" color="currentColor" fill="none" height="24" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" width="24"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>,
  Reels: () => <svg aria-label="Reels" color="currentColor" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.022 2.155 0 3.991-.009 4.614-.009ZM2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2c-1.689 0-3.151.253-4.328.675l2.647 4.965h4.283c.516.29.833.81.833 1.385v5.474c0 .828-.672 1.5-1.5 1.5H6.617c-.828 0-1.5-.672-1.5-1.5V9.025c0-.575.317-1.095.833-1.385h1.233l-2.05-3.839A8.15 8.15 0 0 0 2 8.552v3.449Z"></path></svg>,
  Messenger: () => <svg aria-label="Messenger" color="currentColor" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M12.003 2.001a9.705 9.705 0 1 1-2.335 19.129 8.595 8.595 0 0 1-2.812.872 1.423 1.423 0 0 1-1.579-1.077 3.518 3.518 0 0 1 1.072-3.328 9.536 9.536 0 0 1-6.68-6.096Zm-4.937 9.13a1.43 1.43 0 0 0-1.879 2.112l2.67 2.854a1.865 1.865 0 0 0 2.536.196l2.365-1.928a.591.591 0 0 1 .74-.012l3.42 2.776a1.43 1.43 0 0 0 2.227-1.464l-2.062-8.31a1.859 1.859 0 0 0-2.613-1.189l-7.405 3.965Z"></path></svg>,
  Comment: () => <svg aria-label="Comment" color="currentColor" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>,
  Share: () => <svg aria-label="Share Post" color="currentColor" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>,
  Save: () => <svg aria-label="Save" color="currentColor" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>,
  More: () => <svg aria-label="More" color="currentColor" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
};

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        const res = await axios.get(`${API_URL}/api/posts/timeline/${user._id}`);
        setPosts(res.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user?._id, navigate]);

  // ✅ الدالة الذكية للتحقق من الميديا
  // المتصفح يفهم تلقائياً إذا كان src رابط أو base64
  // لكننا نتحقق هنا إذا كان الحقل فارغاً لنخفي عنصر الصورة
  const getPostMedia = (imgSrc) => {
    if (!imgSrc || imgSrc === "") return null;
    return (
      <img src={imgSrc} alt="post" style={styles.postImage} loading="lazy" />
    );
  };

  // Stories (Dummy Data for UI)
  const stories = [
    { id: 0, user: user?.username || "You", img: user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png", isUser: true },
    { id: 1, user: "nexo_ofc", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150" },
    { id: 2, user: "travel_x", img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150" },
    { id: 3, user: "vibes", img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150" },
  ];

  // --- Glassmorphism Styles ---
  const glassStyle = {
    background: "rgba(255, 255, 255, 0.65)", // شفافية أعلى
    backdropFilter: "blur(12px)", // تأثير الزجاج
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
  };

  const styles = {
    container: {
      // خلفية متدرجة حديثة لإظهار تأثير الزجاج
      background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      minHeight: "100vh",
      paddingBottom: "80px", // مساحة للناف بار العائم
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    header: {
      ...glassStyle,
      position: "sticky",
      top: 0,
      zIndex: 100,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      height: "60px",
      borderRadius: "0 0 20px 20px",
      marginBottom: "15px",
    },
    headerIcons: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
      color: "#005bb5",
    },
    storiesContainer: {
      ...glassStyle,
      padding: "15px 0",
      display: "flex",
      gap: "15px",
      overflowX: "auto",
      scrollbarWidth: "none", // إخفاء السكرول
      paddingLeft: "16px",
      marginBottom: "20px",
      borderRadius: "20px",
      margin: "0 10px 20px 10px", // هوامش جانبية
    },
    storyItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: "70px",
      cursor: "pointer",
    },
    storyRingUser: { width: "64px", height: "64px", borderRadius: "50%", position: "relative" },
    storyRing: {
        width: "64px", height: "64px", borderRadius: "50%", padding: "2px",
        background: "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)", // تدرج لوني للستوري
        display: "flex", justifyContent: "center", alignItems: "center",
    },
    storyImg: { width: "100%", height: "100%", borderRadius: "50%", border: "2px solid white", objectFit: "cover" },
    addStoryBadge: {
        position: "absolute", bottom: "0", right: "0",
        backgroundColor: "#007aff", color: "white", borderRadius: "50%",
        width: "22px", height: "22px", display: "flex", justifyContent: "center",
        alignItems: "center", fontSize: "16px", border: "2px solid white",
    },
    storyName: { fontSize: "11px", marginTop: "5px", color: "#004080", fontWeight: "600", textShadow: "0 1px 2px rgba(255,255,255,0.8)" },
    
    // --- Post Styles ---
    post: {
      ...glassStyle, // تطبيق الزجاج
      marginBottom: "20px",
      borderRadius: "24px",
      paddingBottom: "10px",
      overflow: "hidden", 
      margin: "0 10px 20px 10px", // هوامش جانبية لكروت البوست
    },
    postHeader: {
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 15px",
    },
    userInfo: {
      display: "flex", alignItems: "center", gap: "10px", fontWeight: "700", fontSize: "14px", color: "#003366",
    },
    userAvatar: { width: '36px', height: '36px', borderRadius: '50%', objectFit: "cover", border: "1px solid rgba(255,255,255,0.8)" },
    postImage: {
      width: "100%",
      objectFit: "cover",   
      display: "block",
      maxHeight: "550px",
      // الحواف ليست دائرية هنا لكي تملأ عرض الكارت
    },
    postActions: {
        padding: "12px 15px 0 15px", display: "flex", justifyContent: "space-between", color: "#005bb5",
    },
    leftActions: { display: "flex", gap: "18px" },
    postContent: { padding: "0 15px" },
    likes: { fontWeight: "700", fontSize: "14px", marginBottom: "6px", marginTop: "10px", color: "#003366" },
    caption: { fontSize: "14px", lineHeight: "1.5", color: "#004080" },
    time: { fontSize: "11px", color: "#6688aa", marginTop: "8px", marginBottom: "12px" },
    
    // --- Bottom Nav (Floating Glass) ---
    bottomNav: {
      ...glassStyle,
      position: "fixed",
      bottom: "20px", // يطفو فوق القاع قليلاً
      left: "15px",
      right: "15px",
      height: "65px",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 1000,
      borderRadius: "35px", // حواف دائرية جداً
      color: "#005bb5",
    },
    profileIcon: {
        width: "30px", height: "30px", borderRadius: "50%", overflow: "hidden",
        cursor: "pointer", border: "2px solid #007aff",
    },
    emptyState: { textAlign: "center", padding: "60px 20px", color: "#555", fontSize: "16px", textShadow: "0 1px 1px white" }
  };

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <Icons.Logo />
        <div style={styles.headerIcons}>
          <Icons.Heart />
          <div style={{position: 'relative', cursor: "pointer"}} onClick={() => navigate("/messages")}>
            <Icons.Messenger />
            <div style={{position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', backgroundColor: '#ff3b30', borderRadius: '50%', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: "0 2px 4px rgba(0,0,0,0.2)"}}>3</div>
          </div>
        </div>
      </div>

      {/* Stories */}
      <div style={styles.storiesContainer}>
        {stories.map((story) => (
          <div key={story.id} style={styles.storyItem}>
            {story.isUser ? (
                <div style={styles.storyRingUser}>
                    <img src={story.img} style={styles.storyImg} alt="story" />
                    <div style={styles.addStoryBadge}>+</div>
                </div>
            ) : (
                <div style={styles.storyRing}>
                    <img src={story.img} style={styles.storyImg} alt="story" />
                </div>
            )}
            <span style={styles.storyName}>{story.user}</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
          <div style={styles.emptyState}>
            <div style={{marginBottom: "15px"}}>✨ Loading Nexo...</div>
          </div>
      ) : posts.length === 0 ? (
          <div style={styles.emptyState}>
              <p style={{fontWeight: "bold", fontSize: "18px"}}>Welcome to Nexo! 🚀</p>
              <p style={{fontSize: "14px", marginTop: "10px", opacity: 0.8}}>Your feed is empty. Start by sharing a moment.</p>
              <button 
                onClick={() => navigate("/create")}
                style={{marginTop: "20px", padding: "12px 24px", background: "linear-gradient(45deg, #007aff, #00c6ff)", color: "white", border: "none", borderRadius: "25px", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0, 122, 255, 0.3)", cursor: "pointer"}}
              >
                  Create Your First Post
              </button>
          </div>
      ) : (
        posts.map((post) => (
            <div key={post._id} style={styles.post}>
            {/* Header */}
            <div style={styles.postHeader}>
                <div style={styles.userInfo}>
                    <img 
                        src={post.userAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        style={styles.userAvatar} 
                        alt="user" 
                    />
                    {post.username || "Nexo User"} 
                </div>
                <Icons.More />
            </div>

            {/* ✅ Image Logic: يظهر الصورة إذا وجدت، سواء كانت Base64 أو رابط */}
            {getPostMedia(post.img)}
            
            {/* Actions */}
            <div style={styles.postActions}>
                <div style={styles.leftActions}>
                    <Icons.Heart />
                    <Icons.Comment />
                    <Icons.Share />
                </div>
                <Icons.Save />
            </div>
            
            {/* Caption & Likes */}
            <div style={styles.postContent}>
                {post.likes?.length > 0 && (
                   <div style={styles.likes}>{post.likes.length} likes</div>
                )}
                
                <div style={styles.caption}>
                    <span style={{fontWeight: "700", marginRight: "6px", color: "#003366"}}>{post.username || "User"}</span>
                    {post.desc}
                </div>
                
                <div style={styles.time}>{new Date(post.createdAt).toDateString()}</div>
            </div>
            </div>
        ))
      )}

      {/* Floating Glass Bottom Nav */}
      <div style={styles.bottomNav}>
        <div onClick={() => navigate("/home")} style={{cursor: "pointer", opacity: 1}}><Icons.Home /></div>
        <div onClick={() => navigate("/search")} style={{cursor: "pointer", opacity: 0.6}}><Icons.Search /></div>
        
        <div 
            style={{background: 'linear-gradient(135deg, #007aff, #005bb5)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', boxShadow: '0 8px 20px rgba(0, 122, 255, 0.4)', cursor: "pointer", transform: "translateY(-15px)"}}
            onClick={() => navigate("/create")} 
        >
            <Icons.Plus />
        </div>
        
        <div onClick={() => navigate("/reels")} style={{cursor: "pointer", opacity: 0.6}}><Icons.Reels /></div>
        <div style={styles.profileIcon} onClick={() => navigate("/profile")}>
            <img src={stories[0].img} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="profile" />
        </div>
      </div>

    </div>
  );
}

export default Home;
