import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

// --- أيقونات (الأزرق الناعم) ---
const Icons = {
  Home: () => <svg fill="none" stroke="#007aff" strokeWidth="2" height="26" viewBox="0 0 24 24" width="26"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  SearchFilled: () => <svg fill="#007aff" height="28" viewBox="0 0 24 24" width="28"><path d="M21.71 20.29l-3.68-3.68A8.963 8.963 0 0 0 20 11c0-4.96-4.04-9-9-9s-9 4.04-9 9 4.04 9 9 9c2.12 0 4.07-.74 5.61-1.97l3.68 3.68c.2.19.45.29.71.29s.51-.1.71-.29c.39-.39.39-1.03 0-1.42zM4 11c0-3.86 3.14-7 7-7s7 3.14 7 7c0 1.92-.78 3.66-2.04 4.93-.01.01-.02.01-.02.01-.01.01-.01.01-.01.02A6.98 6.98 0 0 1 11 18c-3.86 0-7-3.14-7-7z"></path></svg>,
  SearchIcon: () => <svg fill="#8e8e8e" height="16" viewBox="0 0 24 24" width="16"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 0 17c1.99 0 3.82-.7 5.27-1.87l4.35 4.36a1 1 0 0 0 1.41-1.41l-4.36-4.35A8.46 8.46 0 0 1 19 10.5z"></path></svg>,
  Plus: () => <svg fill="none" height="28" stroke="#007aff" strokeWidth="3" viewBox="0 0 24 24" width="28"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>,
  Reels: () => <svg fill="none" stroke="#007aff" strokeWidth="2" height="26" viewBox="0 0 24 24" width="26"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>,
  Close: () => <svg fill="#333" height="20" viewBox="0 0 24 24" width="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>,
};

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [explorePosts, setExplorePosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. جلب منشورات عشوائية (Explore) عند فتح الصفحة
  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        // في الحقيقة، يجب أن يكون هناك Endpoint خاص بالـ Explore
        // لكننا سنستخدم التايم لاين مؤقتاً ونخلطه عشوائياً
        const res = await axios.get(`${API_URL}/api/posts/timeline/${user._id}`);
        // خلط المصفوفة عشوائياً (Shuffle)
        const shuffled = res.data.sort(() => 0.5 - Math.random());
        setExplorePosts(shuffled);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExplorePosts();
  }, [user._id]);

  // 2. البحث عن مستخدمين عند الكتابة
  useEffect(() => {
    const searchUsers = async () => {
      if (query.length > 1) {
        setLoading(true);
        try {
          const res = await axios.get(`${API_URL}/api/users/search/${query}`);
          setSearchResults(res.data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    };
    
    // تأخير بسيط لتقليل الطلبات للسيرفر (Debounce)
    const timeoutId = setTimeout(() => {
        searchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div style={styles.container}>
      
      {/* --- Search Bar Header --- */}
      <div style={styles.searchHeader}>
        <div style={styles.searchBox}>
            <div style={{paddingLeft: "10px", display: "flex"}}><Icons.SearchIcon /></div>
            <input 
                style={styles.searchInput} 
                placeholder="Search" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
                <div onClick={() => setQuery("")} style={{paddingRight: "10px", cursor: "pointer", display: "flex"}}>
                    <Icons.Close />
                </div>
            )}
        </div>
      </div>

      {/* --- Content Area --- */}
      <div style={styles.content}>
        
        {/* A. عرض نتائج البحث إذا كان هناك نص */}
        {query.length > 0 ? (
            <div style={styles.resultsList}>
                {loading ? (
                    <div style={{textAlign: "center", padding: "20px", color: "#666"}}>Searching...</div>
                ) : searchResults.length === 0 ? (
                    <div style={{textAlign: "center", padding: "20px", color: "#666"}}>No users found.</div>
                ) : (
                    searchResults.map((result) => (
                        <div key={result._id} style={styles.userRow} onClick={() => navigate(`/profile`)}>
                            <img 
                                src={result.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                style={styles.userAvatar} 
                                alt="user"
                            />
                            <div style={styles.userInfo}>
                                <div style={styles.username}>{result.username}</div>
                                <div style={styles.name}>{result.name || "Nexo User"}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        ) : (
            // B. عرض شبكة الاستكشاف (Explore Grid) إذا كان البحث فارغاً
            <div style={styles.gridContainer}>
                {explorePosts.map((post) => {
                    if (!post.img) return null; // إخفاء المنشورات النصية
                    return (
                        <div key={post._id} style={styles.gridItem}>
                            <img src={post.img} style={styles.gridImage} alt="explore" loading="lazy" />
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* --- Bottom Nav --- */}
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

// --- Styles (Glassmorphism + Grid Layout) ---
const glassStyle = {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
};

const styles = {
    container: {
      background: "linear-gradient(180deg, #E2D1F9 0%, #dbeafe 100%)",
      minHeight: "100vh",
      paddingBottom: "80px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    
    // Search Header
    searchHeader: {
        padding: "10px 15px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(255,255,255,0.3)", // خلفية شفافة جداً للهيدر
        backdropFilter: "blur(10px)",
    },
    searchBox: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: "12px",
        height: "40px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    searchInput: {
        flex: 1,
        border: "none",
        background: "transparent",
        padding: "0 10px",
        fontSize: "15px",
        outline: "none",
        color: "#333",
    },

    // Content
    content: {
        paddingTop: "5px",
    },

    // Explore Grid
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // 3 أعمدة
        gap: "2px", // مسافة صغيرة جداً مثل انستقرام
        paddingBottom: "20px",
    },
    gridItem: {
        aspectRatio: "1 / 1", // مربع
        position: "relative",
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    gridImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    // Search Results List
    resultsList: {
        padding: "10px",
    },
    userRow: {
        ...glassStyle,
        display: "flex",
        alignItems: "center",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "15px",
        cursor: "pointer",
    },
    userAvatar: {
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid rgba(0,0,0,0.1)",
    },
    userInfo: {
        marginLeft: "12px",
        display: "flex",
        flexDirection: "column",
    },
    username: {
        fontWeight: "700",
        fontSize: "14px",
        color: "#003366",
    },
    name: {
        fontSize: "12px",
        color: "#666",
    },

    // Bottom Nav
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
