import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config"; 

// --- الأيقونات (تمت استعادة الألوان الزرقاء وتحديث ايقونة الرسائل والتعليقات) ---
const Icons = {
  // ✅ العودة للون الأزرق للشعار
  Logo: () => <div style={{fontFamily: "'Billabong', cursive", fontSize: "29px", color: "#007aff", fontWeight: "bold", letterSpacing: "0.5px"}}>Nexo</div>, 
  
  // ✅ أيقونات الهيدر العلوية (زرقاء)
  HeartHeader: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  // ✅ أيقونة الرسائل الجديدة (مثل انستقرام - الطائرة الورقية) - زرقاء
  Messenger: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,

  // ✅ أيقونات البوست (زرقاء)
  Heart: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  HeartFilled: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff3040" stroke="#ff3040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  // ✅ أيقونة التعليقات القديمة (الشكل الدائري) - زرقاء
  Comment: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinejoin="round"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path></svg>,
  Share: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Save: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>,
  
  More: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>,

  // ✅ Bottom Nav (أزرق)
  HomeFilled: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="#007aff" stroke="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Search: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Plus: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Reels: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>,
};


const PostItem = ({ post, currentUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?._id) || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isFollowing, setIsFollowing] = useState(currentUser?.followings?.includes(post.userId) || false);
  
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(post.desc || "");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users?userId=${post.userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };
    fetchUser();
  }, [post.userId]);

  const handleLike = async () => {
    try {
      await axios.put(`${API_URL}/api/posts/${post._id}/like`, { userId: currentUser._id });
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      setIsLiked(!isLiked);
    } catch (err) { console.log(err); }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.put(`${API_URL}/api/users/${post.userId}/unfollow`, { userId: currentUser._id });
      } else {
        await axios.put(`${API_URL}/api/users/${post.userId}/follow`, { userId: currentUser._id });
      }
      setIsFollowing(!isFollowing);
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      if (isFollowing) {
          updatedUser.followings = updatedUser.followings.filter(id => id !== post.userId);
      } else {
          updatedUser.followings.push(post.userId);
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) { console.log(err); }
  };

  const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this post?")) {
        try {
            await axios.delete(`${API_URL}/api/posts/${post._id}`, { data: { userId: currentUser._id } });
            window.location.reload(); 
        } catch (err) {
            alert("Failed to delete post");
        }
      }
  };

  const handleUpdate = async () => {
      try {
          await axios.put(`${API_URL}/api/posts/${post._id}`, {
              userId: currentUser._id,
              desc: editDesc
          });
          setIsEditing(false);
          setShowMenu(false);
      } catch (err) {
          alert("Failed to update post");
      }
  };

  const formatTime = (date) => {
      const d = new Date(date);
      const now = new Date();
      const diff = Math.floor((now - d) / 1000);
      if (diff < 60) return "Just now";
      if (diff < 3600) return `${Math.floor(diff/60)}m`;
      if (diff < 86400) return `${Math.floor(diff/3600)}h`;
      return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.post}>
      {/* Header */}
      <div style={styles.postHeader}>
        <div style={styles.userInfo} onClick={() => navigate(`/profile`)}>
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

        <div style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px"}}>
            {user && post.userId !== currentUser._id && (
                <button 
                    onClick={(e) => { e.stopPropagation(); handleFollow(); }}
                    style={{
                        ...styles.followBtn,
                        background: isFollowing ? "rgba(0,122,255,0.1)" : "#007aff",
                        color: isFollowing ? "#007aff" : "#fff",
                        border: isFollowing ? "1px solid #007aff" : "none",
                    }}
                >
                    {isFollowing ? "Following" : "Follow"}
                </button>
            )}

            <div style={{position: "relative", cursor: "pointer"}} onClick={() => setShowMenu(!showMenu)}>
                <Icons.More />
                {showMenu && (
                    <div style={styles.menuDropdown}>
                        {post.userId === currentUser._id ? (
                            <>
                                <div style={styles.menuItem} onClick={() => { setIsEditing(true); setShowMenu(false); }}>Edit</div>
                                <div style={{...styles.menuItem, color: "red"}} onClick={handleDelete}>Delete</div>
                            </>
                        ) : (
                            <div style={styles.menuItem} onClick={() => alert("Reported")}>Report</div>
                        )}
                        <div style={styles.menuItem} onClick={() => setShowMenu(false)}>Cancel</div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Text Content */}
      {isEditing ? (
          <div style={{padding: "10px 15px"}}>
              <textarea 
                style={styles.editInput} 
                value={editDesc} 
                onChange={(e) => setEditDesc(e.target.value)}
              />
              <div style={{display: "flex", gap: "10px", marginTop: "5px"}}>
                  <button style={styles.saveBtn} onClick={handleUpdate}>Save</button>
                  <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
          </div>
      ) : (
          post.desc && <div style={styles.postContentText}>{post.desc}</div>
      )}

      {/* Image */}
      {post.img && (
        <div style={styles.imageContainer}>
             <img src={post.img} style={styles.postImage} alt="post" />
        </div>
      )}
      
      {/* Actions */}
      <div style={styles.postActions}>
        <div style={styles.leftActions}>
          <div 
            onClick={handleLike} 
            style={{
                cursor: "pointer", display:"flex", alignItems:"center",
                transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                transform: isLiked ? "scale(1.15)" : "scale(1)"
            }}
          >
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


function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) { navigate("/"); return; }
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
  }, [user?._id, navigate]);

  const stories = [
    { id: 0, user: "You", img: user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png", isUser: true },
    { id: 1, user: "nexo_team", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150" },
    { id: 2, user: "travel_99", img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150" },
  ];

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Icons.Logo />
        <div style={styles.headerIcons}>
          <div style={{cursor: "pointer", display: "flex"}}><Icons.HeartHeader /></div>
          <div onClick={() => navigate("/messages")} style={{cursor: "pointer", display: "flex"}}><Icons.Messenger /></div>
        </div>
      </div>

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

      {loading ? (
          <div style={styles.emptyState}>Loading moments... ✨</div>
      ) : posts.length === 0 ? (
          <div style={styles.emptyState}>
              <p>Welcome to Nexo!</p>
              <button onClick={() => navigate("/create")} style={styles.createBtn}>Create First Post</button>
          </div>
      ) : (
        posts.map((post) => (
            <PostItem key={post._id} post={post} currentUser={user} />
        ))
      )}

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

const glassStyle = {
    background: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
};

const styles = {
    container: {
      background: "linear-gradient(135deg, #eef2f3 0%, #e0eafc 100%)",
      minHeight: "100vh", paddingBottom: "80px", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      ...glassStyle, position: "sticky", top: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 18px", height: "56px", borderBottom: "1px solid rgba(0,0,0,0.05)"
    },
    // ✅ العودة للون الأزرق
    headerIcons: { display: "flex", gap: "22px", alignItems: "center", color: "#007aff" },
    
    // ✅ تم إصلاح المسافة هنا (تقليل الهامش السفلي)
    storiesContainer: {
      ...glassStyle, padding: "12px 0", display: "flex", gap: "15px", overflowX: "auto",
      paddingLeft: "16px", marginBottom: "10px", borderRadius: "0 0 25px 25px", margin: "0 0 10px 0", borderTop: "none"
    },
    storyItem: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: "70px", cursor: "pointer" },
    storyRingUser: { width: "66px", height: "66px", borderRadius: "50%", position: "relative" },
    storyRing: {
        width: "66px", height: "66px", borderRadius: "50%", padding: "2px",
        background: "linear-gradient(45deg, #007aff 0%, #00c6ff 100%)", // ✅ حلقة الستوري زرقاء أيضاً
        display: "flex", justifyContent: "center", alignItems: "center",
    },
    storyImg: { width: "100%", height: "100%", borderRadius: "50%", border: "2px solid white", objectFit: "cover" },
    addStoryBadge: {
        position: "absolute", bottom: "2px", right: "2px", backgroundColor: "#007aff", color: "white", borderRadius: "50%",
        width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid white",
    },
    // ✅ ألوان النصوص زرقاء
    storyName: { fontSize: "11px", marginTop: "4px", color: "#004080", fontWeight: "500" },
    
    // ✅ تم إصلاح المسافة هنا (إضافة هامش علوي للبوست)
    post: {
      background: "white", marginBottom: "15px", borderRadius: "25px", paddingBottom: "12px", overflow: "visible", margin: "10px 10px 20px 10px",
      boxShadow: "0 2px 15px rgba(0,0,0,0.03)", border: "1px solid rgba(255,255,255,0.8)"
    },
    postHeader: { display: "flex", alignItems: "center", padding: "10px 14px" },
    userInfo: { display: "flex", alignItems: "center", cursor: "pointer" },
    userAvatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: "cover", border: "1px solid rgba(0,0,0,0.08)" },
    // ✅ ألوان النصوص زرقاء
    usernameText: { fontSize: "14px", fontWeight: "700", color: "#004080" },
    nameText: { fontSize: "11px", color: "#6688aa", marginTop: "1px" },
    
    followBtn: {
        fontSize: "12px", padding: "6px 16px", borderRadius: "8px", cursor: "pointer",
        fontWeight: "600", transition: "all 0.2s",
    },

    menuDropdown: {
        position: "absolute", top: "25px", right: "0", background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)", border: "1px solid #eee", borderRadius: "12px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)", zIndex: 50, width: "120px", overflow: "hidden"
    },
    menuItem: { padding: "10px 15px", fontSize: "13px", color: "#333", borderBottom: "1px solid #f5f5f5", fontWeight: "500" },

    postContentText: {
        padding: "0 14px 10px 14px", fontSize: "15px", lineHeight: "1.5", color: "#222",
        whiteSpace: "pre-line", textAlign: "left",
    },
    
    editInput: { width: "95%", border: "1px solid #ddd", borderRadius: "8px", padding: "8px", outline: "none", fontSize: "14px", fontFamily: "inherit" },
    saveBtn: { background: "#007aff", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" },
    cancelBtn: { background: "#eee", color: "#333", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px" },

    imageContainer: { width: "100%", backgroundColor: "#f8f8f8", display: "flex", justifyContent: "center", overflow: "hidden" },
    postImage: { width: "100%", height: "auto", maxHeight: "1350px", objectFit: "cover" },

    // ✅ إعادة اللون الأزرق لأيقونات التفاعل
    postActions: { padding: "12px 14px 0 14px", display: "flex", justifyContent: "space-between", color: "#007aff" },
    leftActions: { display: "flex", gap: "16px" },
    // ✅ ألوان النصوص زرقاء
    likesCount: { padding: "0 14px", fontWeight: "700", fontSize: "13px", marginTop: "8px", color: "#004080" },
    time: { padding: "0 14px", fontSize: "10px", color: "#6688aa", marginTop: "4px", marginBottom: "5px" },

    // ✅ إعادة اللون الأزرق للشريط السفلي
    bottomNav: {
      ...glassStyle, position: "fixed", bottom: "20px", left: "15px", right: "15px",
      height: "65px", display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 1000, borderRadius: "35px", color: "#007aff",
    },
    plusBtn: {
        background: 'linear-gradient(135deg, #007aff, #005bb5)', borderRadius: '50%', width: '50px', height: '50px',
        display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
        boxShadow: '0 8px 20px rgba(0, 122, 255, 0.35)', cursor: "pointer", transform: "translateY(-15px)"
    },
    profileIconNav: { width: "28px", height: "28px", borderRadius: "50%", overflow: "hidden", border: "2px solid #007aff", cursor: "pointer" },
    emptyState: { textAlign: "center", padding: "60px 20px", color: "#555", fontSize: "16px" },
    createBtn: { marginTop: "20px", padding: "12px 24px", background: "#007aff", color: "white", border: "none", borderRadius: "20px", fontWeight:"bold" }
};

export default Home;
