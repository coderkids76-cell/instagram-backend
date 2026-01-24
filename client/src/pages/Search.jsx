import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

// --- Icons ---
const Icons = {
  Home: () => <svg fill="none" stroke="#007aff" strokeWidth="2" height="26" viewBox="0 0 24 24" width="26"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  SearchFilled: () => <svg fill="#007aff" height="28" viewBox="0 0 24 24" width="28"><path d="M21.71 20.29l-3.68-3.68A8.963 8.963 0 0 0 20 11c0-4.96-4.04-9-9-9s-9 4.04-9 9 4.04 9 9 9c2.12 0 4.07-.74 5.61-1.97l3.68 3.68c.2.19.45.29.71.29s.51-.1.71-.29c.39-.39.39-1.03 0-1.42zM4 11c0-3.86 3.14-7 7-7s7 3.14 7 7c0 1.92-.78 3.66-2.04 4.93-.01.01-.02.01-.02.01-.01.01-.01.01-.01.02A6.98 6.98 0 0 1 11 18c-3.86 0-7-3.14-7-7z"></path></svg>,
  SearchIcon: () => <svg fill="#8e8e8e" height="16" viewBox="0 0 24 24" width="16"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 0 17c1.99 0 3.82-.7 5.27-1.87l4.35 4.36a1 1 0 0 0 1.41-1.41l-4.36-4.35A8.46 8.46 0 0 1 19 10.5z"></path></svg>,
  Plus: () => <svg fill="none" height="28" stroke="#007aff" strokeWidth="3" viewBox="0 0 24 24" width="28"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>,
  Reels: () => <svg fill="none" stroke="#007aff" strokeWidth="2" height="26" viewBox="0 0 24 24" width="26"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>,
  Close: () => <svg fill="#333" height="20" viewBox="0 0 24 24" width="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>,
  Heart: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  HeartFilled: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff3040" stroke="#ff3040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Comment: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path></svg>,
  Share: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
};

// --- المودال المتطور والمربع (ExpandedPost) ---
const ExpandedPost = ({ post, currentUser }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?._id));
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [comment, setComment] = useState("");

    // جلب البيانات
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/users?userId=${post.userId}`);
                setUser(res.data);
                setIsFollowing(currentUser.followings.includes(res.data._id));
            } catch (err) { console.error(err); }
        };
        fetchUser();
    }, [post.userId, currentUser.followings]);

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
                await axios.put(`${API_URL}/api/users/${user._id}/unfollow`, { userId: currentUser._id });
            } else {
                await axios.put(`${API_URL}/api/users/${user._id}/follow`, { userId: currentUser._id });
            }
            setIsFollowing(!isFollowing);
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            if (isFollowing) {
                updatedUser.followings = updatedUser.followings.filter(id => id !== user._id);
            } else {
                updatedUser.followings.push(user._id);
            }
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) { console.log(err); }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: 'Nexo Post', text: post.desc, url: window.location.href }).catch(console.error);
        } else { alert("Sharing not supported"); }
    };

    const handleCommentSubmit = async () => {
        if (!comment.trim()) return;
        alert(`Comment sent: ${comment}`); // يمكنك استبدال هذا لاحقاً بربط API التعليقات
        setComment("");
    };

    return (
        <div 
            onClick={(e) => e.stopPropagation()} // ✅ منع إغلاق البطاقة عند النقر داخلها
            style={{
                background: "#ffffff",
                borderRadius: "24px",
                overflow: "hidden",
                width: "95%", 
                maxWidth: "450px", 
                maxHeight: "80vh", // ✅ تحديد الارتفاع للسماح بالسكرول
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                display: "flex", 
                flexDirection: "column",
                position: "relative"
            }}
        >
            
            {/* 1. Header (ثابت في الأعلى) */}
            <div style={{padding: "12px 15px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0", background: "#fff", zIndex: 2}}>
                <div style={{display: "flex", alignItems: "center", cursor: "pointer"}} onClick={() => navigate(`/profile/${user?.username}`)}>
                    <img 
                        src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        style={{width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", marginRight: "10px", border: "1px solid #eee"}}
                    />
                    <span style={{fontWeight: "700", fontSize: "14px", color: "#003366"}}>{user?.username}</span>
                </div>
                {user?._id !== currentUser._id && (
                    <button 
                        onClick={handleFollow}
                        style={{
                            background: isFollowing ? "#f0f2f5" : "#007aff",
                            color: isFollowing ? "#333" : "white",
                            border: "none", padding: "6px 14px", borderRadius: "20px",
                            fontWeight: "600", fontSize: "12px", cursor: "pointer", transition: "all 0.2s"
                        }}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                )}
            </div>
            
            {/* 2. Scrollable Body (محتوى قابل للسكرول) */}
            <div style={{flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", background: "#fff"}}>
                {/* حاوية الصورة */}
                <div style={{
                    width: "100%", 
                    display: "flex", alignItems: "center", justifyContent: "center", 
                    backgroundColor: "#f8f8f8", minHeight: "200px"
                }}>
                    <img src={post.img} style={{width: "100%", height: "auto", objectFit: "contain"}} alt="post" />
                </div>

                {/* الأزرار والوصف */}
                <div style={{padding: "15px", paddingBottom: "20px"}}>
                    <div style={{display: "flex", gap: "16px", marginBottom: "12px"}}>
                        <div onClick={handleLike} style={{cursor: "pointer", display:"flex", alignItems:"center"}}>
                            {isLiked ? <Icons.HeartFilled /> : <Icons.Heart />}
                        </div>
                        <div style={{cursor:"pointer"}}><Icons.Comment /></div>
                        <div onClick={handleShare} style={{cursor:"pointer"}}><Icons.Share /></div>
                    </div>
                    
                    <div style={{fontWeight: "700", fontSize: "14px", color: "#003366", marginBottom: "6px"}}>{likeCount} likes</div>
                    
                    <div style={{fontSize: "14px", color: "#333", lineHeight: "1.4"}}>
                        <span style={{fontWeight: "700", marginRight: "6px", color: "#003366"}}>{user?.username}</span>
                        {post.desc}
                    </div>
                </div>
            </div>

            {/* 3. Footer (خانة التعليق ثابتة في الأسفل) */}
            <div style={{
                borderTop: "1px solid #f0f0f0",
                padding: "12px 15px",
                display: "flex", alignItems: "center",
                background: "#fff",
                zIndex: 2
            }}>
                <div style={{
                    flex: 1,
                    display: "flex", alignItems: "center",
                    background: "#f0f2f5",
                    borderRadius: "25px",
                    padding: "10px 15px",
                    marginRight: "10px"
                }}>
                    <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                            flex: 1, border: "none", background: "transparent", 
                            outline: "none", fontSize: "14px", color: "#333"
                        }}
                    />
                </div>
                <div 
                    onClick={handleCommentSubmit} 
                    style={{
                        cursor: "pointer", 
                        color: comment.trim() ? "#007aff" : "#cce0ff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "color 0.2s"
                    }}
                >
                    <Icons.Send />
                </div>
            </div>
        </div>
    );
};

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [explorePosts, setExplorePosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch Explore Posts
  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts/explore/all`);
        setExplorePosts(res.data);
      } catch (err) { console.log(err); }
    };
    fetchExplorePosts();
  }, []);

  // Search Logic
  useEffect(() => {
    const searchUsers = async () => {
      if (query.length > 1) {
        try {
          const res = await axios.get(`${API_URL}/api/users/search/${query}`);
          setSearchResults(res.data);
        } catch (err) { console.log(err); } 
      } else { setSearchResults([]); }
    };
    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div style={styles.container}>
      <div style={styles.searchHeader}>
        <div style={styles.searchBox}>
            <div style={{paddingLeft: "10px", display: "flex"}}><Icons.SearchIcon /></div>
            <input style={styles.searchInput} placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && (<div onClick={() => setQuery("")} style={{paddingRight: "10px", cursor: "pointer"}}><Icons.Close /></div>)}
        </div>
      </div>

      <div style={styles.content}>
        {query.length > 0 ? (
            <div style={styles.resultsList}>
                 {searchResults.map((result) => (
                    <div key={result._id} style={styles.userRow} onClick={() => navigate(`/profile/${result.username}`)}>
                        <img src={result.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={styles.userAvatar} alt="user"/>
                        <div style={styles.userInfo}>
                            <div style={styles.username}>{result.username}</div>
                            <div style={styles.name}>{result.name || "Nexo User"}</div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div style={styles.gridContainer}>
                {explorePosts.map((post) => {
                    if (!post.img) return null;
                    return (
                        <div key={post._id} style={styles.gridItem} onClick={() => setSelectedPost(post)}>
                            <img src={post.img} style={styles.gridImage} alt="explore" loading="lazy" />
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* ✅ Modal Overlay (الغطاء الخلفي) */}
      {selectedPost && (
          <div 
            style={styles.modalOverlay} 
            onClick={() => setSelectedPost(null)} // ✅ عند الضغط هنا يتم الإغلاق
          >
              <div 
                style={{display:"flex", width:"100%", justifyContent:"center"}}
                onClick={(e) => e.stopPropagation()} // ✅ حماية إضافية لمنع الإغلاق الخاطئ
              >
                  <ExpandedPost post={selectedPost} currentUser={user} />
              </div>
          </div>
      )}

      <div style={styles.bottomNav}>
        <div onClick={() => navigate("/home")} style={{opacity: 0.6}}><Icons.Home /></div>
        <div onClick={() => navigate("/search")}><Icons.SearchFilled /></div>
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
    background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
};

const styles = {
    container: {
      background: "linear-gradient(180deg, #E2D1F9 0%, #dbeafe 100%)",
      minHeight: "100vh", paddingBottom: "80px", fontFamily: "sans-serif",
    },
    searchHeader: {
        padding: "10px 15px", position: "sticky", top: 0, zIndex: 10,
        background: "rgba(255,255,255,0.3)", backdropFilter: "blur(10px)",
    },
    searchBox: {
        display: "flex", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: "12px", height: "40px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    searchInput: { flex: 1, border: "none", background: "transparent", padding: "0 10px", fontSize: "15px", outline: "none", color: "#333" },
    content: { paddingTop: "5px" },
    gridContainer: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", paddingBottom: "20px" },
    gridItem: { aspectRatio: "1 / 1", position: "relative", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.2)", cursor: "pointer" },
    gridImage: { width: "100%", height: "100%", objectFit: "cover" },
    resultsList: { padding: "10px" },
    userRow: { ...glassStyle, display: "flex", alignItems: "center", padding: "10px", marginBottom: "10px", borderRadius: "15px", cursor: "pointer" },
    userAvatar: { width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(0,0,0,0.1)" },
    userInfo: { marginLeft: "12px", display: "flex", flexDirection: "column" },
    username: { fontWeight: "700", fontSize: "14px", color: "#003366" },
    name: { fontSize: "12px", color: "#666" },
    
    // ✅ تنسيق الخلفية المظللة للإغلاق
    modalOverlay: {
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
        display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px"
    },

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
    profileIconNav: { width: "30px", height: "30px", borderRadius: "50%", overflow: "hidden", border: "2px solid #007aff", cursor: "pointer" }
  };
