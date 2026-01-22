import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config"; 

// --- مكون المنشور الفردي (PostItem) ---
const PostItem = ({ post, currentUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // نبدأ بـ null للتحقق
  
  // حماية ضد البيانات القديمة
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?._id) || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  
  // التحقق من وجود قائمة المتابعة لتجنب الشاشة البيضاء
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.followings?.includes(post.userId) || false
  );

  // جلب بيانات صاحب المنشور
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users?userId=${post.userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching post user", err);
      }
    };
    fetchUser();
  }, [post.userId]);

  // اللايك
  const handleLike = async () => {
    try {
      await axios.put(`${API_URL}/api/posts/${post._id}/like`, { userId: currentUser._id });
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.log(err);
    }
  };

  // المتابعة
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.put(`${API_URL}/api/users/${post.userId}/unfollow`, { userId: currentUser._id });
      } else {
        await axios.put(`${API_URL}/api/users/${post.userId}/follow`, { userId: currentUser._id });
      }
      setIsFollowing(!isFollowing);
      
      // تحديث LocalStorage لتجنب المشاكل عند التحديث
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      if (isFollowing) {
          updatedUser.followings = updatedUser.followings.filter(id => id !== post.userId);
      } else {
          updatedUser.followings.push(post.userId);
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
    } catch (err) {
      console.log(err);
    }
  };

  // تنسيق التاريخ
  const formatTime = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.post}>
      {/* 1. رأس المنشور */}
      <div style={styles.postHeader}>
        <div style={styles.userInfo} onClick={() => navigate(`/profile`)}> {/* يمكن توجيهها لاحقاً لبروفايل معين */}
          <img 
            src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            style={styles.userAvatar} 
            alt="user" 
          />
          <div style={{display: "flex", flexDirection: "column", marginLeft: "10px"}}>
             <span style={styles.usernameText}>{user?.username || "Loading..."}</span>
             {user?.name && <span style={styles.nameText}>{user.name}</span>}
          </div>
        </div>

        {/* زر المتابعة - يظهر فقط إذا لم يكن حسابي */}
        {user && post.userId !== currentUser._id && (
            <button 
                onClick={(e) => { e.stopPropagation(); handleFollow(); }}
                style={{
                    border: isFollowing ? "1px solid #dbdbdb" : "none",
                    background: isFollowing ? "transparent" : "#0095f6",
                    color: isFollowing ? "#000" : "#fff",
                    fontWeight: "600",
                    fontSize: "12px",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginLeft: "auto",
                    transition: "all 0.2s"
                }}
            >
                {isFollowing ? "Following" : "Follow"}
            </button>
        )}
      </div>

      {/* 2. نص المنشور (فوق الصورة) */}
      {post.desc && (
          <div style={styles.postContentText}>
              {post.desc}
          </div>
      )}

      {/* 3. الصورة (بالمقاسات المطلوبة) */}
      {post.img && (
        <div style={styles.imageContainer}>
             <img src={post.img} style={styles.postImage} alt="post" />
        </div>
      )}
      
      {/* 4. الأزرار */}
      <div style={styles.postActions}>
        <div style={styles.leftActions}>
          <div onClick={handleLike} style={{cursor: "pointer", color: isLiked ? "#ed4956" : "inherit", display:"flex", alignItems:"center"}}>
            {isLiked ? <Icons.HeartFilled /> : <Icons.Heart />}
          </div>
          <div style={{cursor: "pointer"}} onClick={() => alert("Comments feature coming soon!")}><Icons.Comment /></div>
          <div style={{cursor: "pointer"}} onClick={() => navigator.share?.({ title: 'Nexo', text: post.desc, url: window.location.href })}><Icons.Share /></div>
        </div>
        <div style={{cursor: "pointer"}} onClick={() => alert("Post Saved!")}><Icons.Save /></div>
      </div>
      
      <div style={styles.likesCount}>{likeCount} likes</div>
      <div style={styles.time}>{formatTime(post.createdAt)}</div>
    </div>
  );
};


// --- الصفحة الرئيسية ---
function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // قراءة المستخدم بأمان
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // إذا لم يكن هناك مستخدم، التوجيه لصفحة الدخول فوراً
    if (!user) {
        navigate("/");
        return;
    }

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/timeline/${user._id}`);
        setPosts(res.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user?._id, navigate]); // الاعتماد على ID فقط لتجنب التكرار

  // Stories (بيانات تجريبية)
  const stories = [
    { id: 0, user: "You", img: user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png", isUser: true },
    { id: 1, user: "nexo_team", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150" },
    { id: 2, user: "travel_99", img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150" },
  ];

  if (!user) return null; // منع عرض أي شيء إذا لم يسجل الدخول

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Icons.Logo />
        <div style={styles.headerIcons}>
          <Icons.Heart />
          <div onClick={() => navigate("/messages")} style={{cursor: "pointer"}}><Icons.Messenger /></div>
        </div>
      </div>

      {/* Stories */}
      <div style={styles.storiesContainer}>
        {stories.map((story) => (
          <div key={story.id} style={styles.storyItem}>
            <div style={story.isUser ? styles.storyRingUser : styles.storyRing}>
                <img src={story.img} style={styles.storyImg} alt="story" />
                {story.isUser && <div style={styles.addStoryBadge}>+</div>}
            </div>
            <span style={styles.storyName}>{story.user}</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
          <div style={styles.emptyState}>Loading moments... ✨</div>
      ) : posts.length === 0 ? (
          <div style={styles.emptyState}>
              <p>Welcome to Nexo!</p>
              <p style={{fontSize:"13px", marginTop:"5px", color:"#777"}}>Follow people to see their posts here.</p>
              <button onClick={() => navigate("/create")} style={styles.createBtn}>Create First Post</button>
          </div>
      ) : (
        posts.map((post) => (
            <PostItem key={post._id} post={post} currentUser={user} />
        ))
      )}

      {/* Bottom Nav */}
      <div style={styles.bottomNav}>
        <div onClick={() => navigate("/home")}><Icons.HomeFilled /></div>
        <div onClick={() => navigate("/search")} style={{opacity: 0.6}}><Icons.Search /></div>
        <div onClick={() => navigate("/create")} style={styles.plusBtn}><Icons.Plus /></div>
        <div onClick={() => navigate("/reels")} style={{opacity: 0.6}}><Icons.Reels /></div>
        <div onClick={() => navigate("/profile")} style={styles.profileIconNav}>
            <img src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </div>
    </div>
  );
}

// --- Icons & Styles ---
const Icons = {
  Logo: () => <div style={{fontFamily: "'Billabong', cursive", fontSize: "28px", background: "linear-gradient(45deg, #007aff, #00c6ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "bold"}}>Nexo</div>, 
  Heart: () => <svg fill="none" stroke="currentColor" strokeWidth="2" height="24" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.956-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>,
  HeartFilled: () => <svg fill="#ed4956" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>,
  HomeFilled: () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>,
  Search: () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" fill="none" stroke="currentColor" strokeWidth="3"></path><line x1="16.511" x2="21.643" y1="16.511" y2="21.643" stroke="currentColor" strokeWidth="3"></line></svg>,
  Plus: () => <svg fill="none" height="24" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" width="24"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>,
  Reels: () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.022 2.155 0 3.991-.009 4.614-.009ZM2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2c-1.689 0-3.151.253-4.328.675l2.647 4.965h4.283c.516.29.833.81.833 1.385v5.474c0 .828-.672 1.5-1.5 1.5H6.617c-.828 0-1.5-.672-1.5-1.5V9.025c0-.575.317-1.095.833-1.385h1.233l-2.05-3.839A8.15 8.15 0 0 0 2 8.552v3.449Z"></path></svg>,
  Messenger: () => <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M12.003 2.001a9.705 9.705 0 1 1-2.335 19.129 8.595 8.595 0 0 1-2.812.872 1.423 1.423 0 0 1-1.579-1.077 3.518 3.518 0 0 1 1.072-3.328 9.536 9.536 0 0 1-6.68-6.096Zm-4.937 9.13a1.43 1.43 0 0 0-1.879 2.112l2.67 2.854a1.865 1.865 0 0 0 2.536.196l2.365-1.928a.591.591 0 0 1 .74-.012l3.42 2.776a1.43 1.43 0 0 0 2.227-1.464l-2.062-8.31a1.859 1.859 0 0 0-2.613-1.189l-7.405 3.965Z"></path></svg>,
  Comment: () => <svg fill="none" stroke="currentColor" strokeWidth="2" height="24" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path></svg>,
  Share: () => <svg fill="none" stroke="currentColor" strokeWidth="2" height="24" viewBox="0 0 24 24" width="24"><line x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"></polygon></svg>,
  Save: () => <svg fill="none" stroke="currentColor" strokeWidth="2" height="24" viewBox="0 0 24 24" width="24"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon></svg>,
};

const glassStyle = {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
};

const styles = {
    container: {
      background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      minHeight: "100vh", paddingBottom: "80px", fontFamily: "sans-serif",
    },
    header: {
      ...glassStyle, position: "sticky", top: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 16px", height: "50px", borderRadius: "0 0 20px 20px", marginBottom: "15px"
    },
    headerIcons: { display: "flex", gap: "20px", alignItems: "center", color: "#005bb5" },
    storiesContainer: {
      ...glassStyle, padding: "15px 0", display: "flex", gap: "15px", overflowX: "auto",
      paddingLeft: "16px", marginBottom: "20px", borderRadius: "20px", margin: "0 10px 20px 10px",
    },
    storyItem: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: "70px", cursor: "pointer" },
    storyRingUser: { width: "64px", height: "64px", borderRadius: "50%", position: "relative" },
    storyRing: {
        width: "64px", height: "64px", borderRadius: "50%", padding: "2px",
        background: "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
        display: "flex", justifyContent: "center", alignItems: "center",
    },
    storyImg: { width: "100%", height: "100%", borderRadius: "50%", border: "2px solid white", objectFit: "cover" },
    addStoryBadge: {
        position: "absolute", bottom: "0", right: "0", backgroundColor: "#007aff", color: "white", borderRadius: "50%",
        width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid white",
    },
    storyName: { fontSize: "11px", marginTop: "5px", color: "#004080", fontWeight: "600" },
    
    // --- Post Styles ---
    post: {
      ...glassStyle, marginBottom: "20px", borderRadius: "24px", paddingBottom: "10px", overflow: "hidden", margin: "0 10px 20px 10px",
    },
    postHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 15px" },
    userInfo: { display: "flex", alignItems: "center", cursor: "pointer" },
    userAvatar: { width: '38px', height: '38px', borderRadius: '50%', objectFit: "cover", border: "1px solid rgba(0,0,0,0.1)" },
    usernameText: { fontSize: "14px", fontWeight: "700", color: "#003366" },
    nameText: { fontSize: "11px", color: "#666", marginTop: "1px" },
    
    postContentText: {
        padding: "0 15px 12px 15px", fontSize: "15px", lineHeight: "1.5", color: "#222",
        whiteSpace: "pre-line", textAlign: "left",
    },
    
    // ✅ ضبط مقاسات الصور (Container)
    imageContainer: {
        width: "100%",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    postImage: {
        width: "100%",
        height: "auto",
        maxHeight: "1350px", // يسمح بالطول الكامل (4:5)
        objectFit: "cover",
    },

    postActions: { padding: "12px 15px 0 15px", display: "flex", justifyContent: "space-between", color: "#005bb5" },
    leftActions: { display: "flex", gap: "18px" },
    likesCount: { padding: "0 15px", fontWeight: "700", fontSize: "13px", marginTop: "8px", color: "#003366" },
    time: { padding: "0 15px", fontSize: "10px", color: "#6688aa", marginTop: "4px", marginBottom: "5px" },

    bottomNav: {
      ...glassStyle, position: "fixed", bottom: "20px", left: "15px", right: "15px",
      height: "65px", display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 1000, borderRadius: "35px", color: "#005bb5",
    },
    plusBtn: {
        background: 'linear-gradient(135deg, #007aff, #005bb5)', borderRadius: '50%', width: '50px', height: '50px',
        display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
        boxShadow: '0 8px 20px rgba(0, 122, 255, 0.4)', cursor: "pointer", transform: "translateY(-15px)"
    },
    profileIconNav: { width: "30px", height: "30px", borderRadius: "50%", overflow: "hidden", border: "2px solid #007aff", cursor: "pointer" },
    emptyState: { textAlign: "center", padding: "60px 20px", color: "#555", fontSize: "16px" },
    createBtn: { marginTop: "20px", padding: "12px 24px", background: "#007aff", color: "white", border: "none", borderRadius: "20px", fontWeight:"bold" }
};

export default Home;
