import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";
import { API_URL } from "../config"; 

// --- Icons (Nexo Blue Theme) ---
const Icons = {
  Back: () => <svg fill="#007aff" height="26" viewBox="0 0 24 24" width="26"><path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" transform="rotate(-90 12 12)"></path></svg>,
  Menu: () => <svg fill="#007aff" height="26" viewBox="0 0 24 24" width="26"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>,
  Grid: ({active}) => <svg fill={active ? "#007aff" : "#8e8e8e"} height="26" viewBox="0 0 24 24" width="26"><rect fill="none" height="18" stroke="currentColor" strokeWidth="2" width="18" x="3" y="3"></rect><line x1="9" x2="9" y1="3" y2="21" stroke="currentColor" strokeWidth="2"/><line x1="15" x2="15" y1="3" y2="21" stroke="currentColor" strokeWidth="2"/><line x1="21" x2="3" y1="9" y2="9" stroke="currentColor" strokeWidth="2"/><line x1="21" x2="3" y1="15" y2="15" stroke="currentColor" strokeWidth="2"/></svg>,
  Reels: ({active}) => <svg fill={active ? "#007aff" : "#8e8e8e"} height="26" viewBox="0 0 24 24" width="26"><path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.022 2.155 0 3.991-.009 4.614-.009ZM2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2c-1.689 0-3.151.253-4.328.675l2.647 4.965h4.283c.516.29.833.81.833 1.385v5.474c0 .828-.672 1.5-1.5 1.5H6.617c-.828 0-1.5-.672-1.5-1.5V9.025c0-.575.317-1.095.833-1.385h1.233l-2.05-3.839A8.15 8.15 0 0 0 2 8.552v3.449Z" stroke="currentColor" strokeWidth="2"></path></svg>,
  
  // Bottom Nav Icons
  Home: () => <svg fill="currentColor" height="26" width="26" viewBox="0 0 24 24"><path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>,
  Search: () => <svg fill="currentColor" height="26" width="26" viewBox="0 0 24 24"><path d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" fill="none" stroke="currentColor" strokeWidth="3"></path><line x1="16.511" x2="21.643" y1="16.511" y2="21.643" stroke="currentColor" strokeWidth="3"></line></svg>,
  Plus: () => <svg fill="none" height="28" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" width="28"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>,
  Camera: () => <svg fill="white" height="16" viewBox="0 0 24 24" width="16"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/><path d="M20 5h-3.17L15 3H9L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 14H4V7h4.04l1.83-2h4.26l1.83 2H20v12Z"/></svg>
};

function Profile() {
  const navigate = useNavigate();
  // Get username from URL (if visiting someone else)
  const { username } = useParams(); 
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const [editData, setEditData] = useState({ username: "", name: "", bio: "" });
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Image Compression Helper
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) { navigate("/"); return; }
      try {
        setLoading(true);
        // Determine which user to fetch: from URL (search) or current logged in user (me)
        const query = username ? `username=${username}` : `userId=${currentUser._id}`;
        
        const userRes = await axios.get(`${API_URL}/api/users?${query}`);
        const fetchedUser = userRes.data;
        setUser(fetchedUser);

        // Check if I am following this user
        if (currentUser.followings.includes(fetchedUser._id)) {
            setIsFollowing(true);
        } else {
            setIsFollowing(false);
        }
        
        // Populate edit data only if it is my profile
        if (fetchedUser._id === currentUser._id) {
            setEditData({ 
                username: fetchedUser.username, 
                name: fetchedUser.name || "", 
                bio: fetchedUser.desc || "" 
            });
        }

        // Fetch user's posts
        const postsRes = await axios.get(`${API_URL}/api/posts/profile/${fetchedUser.username}`);
        setPosts(postsRes.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [username, currentUser._id, navigate]); 

  // Smart Follow Button Handler
  const handleFollow = async () => {
    try {
        if (isFollowing) {
            // Unfollow
            await axios.put(`${API_URL}/api/users/${user._id}/unfollow`, { userId: currentUser._id });
            // Update local state immediately
            setUser(prev => ({...prev, followers: prev.followers.filter(id => id !== currentUser._id)}));
        } else {
            // Follow
            await axios.put(`${API_URL}/api/users/${user._id}/follow`, { userId: currentUser._id });
            // Update local state immediately
            setUser(prev => ({...prev, followers: [...prev.followers, currentUser._id]}));
        }
        setIsFollowing(!isFollowing);

        // Update LocalStorage for the current user to remember following status
        const updatedCurrentUser = JSON.parse(localStorage.getItem("user"));
        if (isFollowing) {
             updatedCurrentUser.followings = updatedCurrentUser.followings.filter(id => id !== user._id);
        } else {
             updatedCurrentUser.followings.push(user._id);
        }
        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));

    } catch (err) {
        console.log(err);
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        await axios.put(`${API_URL}/api/users/${user._id}`, {
          userId: user._id,
          profilePicture: compressedBase64
        });
        
        setUser({ ...user, profilePicture: compressedBase64 });
        const updatedLocalUser = { ...currentUser, profilePicture: compressedBase64 };
        localStorage.setItem("user", JSON.stringify(updatedLocalUser));
        alert("Profile Picture Updated! ✨");
      } catch (err) {
        alert(`Failed: ${err.message}`);
      }
    }
  };

  const handleUpdateProfile = async () => {
    setError("");
    try {
      await axios.put(`${API_URL}/api/users/${user._id}`, {
        userId: user._id,
        username: editData.username.toLowerCase(),
        name: editData.name,
        desc: editData.bio
      });
      
      const newUserData = { 
        ...user, 
        username: editData.username.toLowerCase(), 
        name: editData.name, 
        desc: editData.bio 
      };
      
      setUser(newUserData);
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...newUserData }));

      setIsEditing(false);
      alert("Profile updated successfully! 🎉");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update.");
    }
  };

  const handleLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
  };

  // Is this my profile?
  const isMyProfile = user && currentUser && user._id === currentUser._id;

  // Styles
  const glassStyle = {
    background: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
  };

  const styles = {
    container: {
      background: "linear-gradient(180deg, #E2D1F9 0%, #dbeafe 100%)",
      minHeight: "100vh",
      paddingBottom: "80px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    header: {
      ...glassStyle, position: "sticky", top: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 16px", height: "50px", borderRadius: "0 0 20px 20px", marginBottom: "15px"
    },
    headerTitle: { fontWeight: "700", fontSize: "16px", color: "#003366" },
    infoCard: {
      ...glassStyle, margin: "0 15px", borderRadius: "24px", padding: "20px",
      display: "flex", flexDirection: "column", gap: "15px"
    },
    topSection: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    imgContainer: { position: "relative" },
    profileImg: {
        width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover",
        border: "3px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    },
    addBtn: {
        position: "absolute", bottom: "0", right: "0", background: "#007aff",
        width: "24px", height: "24px", borderRadius: "50%", display: "flex",
        alignItems: "center", justifyContent: "center", border: "2px solid white", cursor: "pointer"
    },
    stats: { display: "flex", gap: "20px", textAlign: "center", flex: 1, justifyContent: "center" },
    statNum: { fontWeight: "800", fontSize: "18px", color: "#003366" },
    statLabel: { fontSize: "12px", color: "#557799" },
    bioSection: {},
    name: { fontWeight: "800", fontSize: "18px", color: "#003366" },
    username: { fontSize: "14px", color: "#6688aa", fontWeight: "600", marginTop: "2px" },
    bio: { fontSize: "14px", color: "#445566", whiteSpace: "pre-line", marginTop: "8px" },
    actions: { display: "flex", gap: "10px", marginTop: "10px" },
    
    // Buttons
    editBtn: {
        flex: 1, padding: "8px", borderRadius: "12px", border: "none",
        background: "rgba(255,255,255,0.5)", color: "#007aff", fontWeight: "600",
        cursor: "pointer", fontSize: "13px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
    },
    followBtn: {
        flex: 1, padding: "8px", borderRadius: "12px", border: "none",
        background: isFollowing ? "rgba(255,255,255,0.5)" : "#007aff", 
        color: isFollowing ? "#333" : "white",
        fontWeight: "600", cursor: "pointer", fontSize: "13px", 
        boxShadow: "0 4px 10px rgba(0,122,255,0.2)"
    },

    tabs: {
        ...glassStyle, margin: "15px 15px", borderRadius: "16px",
        display: "flex", justifyContent: "space-around", padding: "8px 0"
    },
    grid: {
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px",
        padding: "0 2px", marginBottom: "20px"
    },
    gridItem: { aspectRatio: "1/1", background: "rgba(255,255,255,0.3)", overflow: "hidden" },
    gridImg: { width: "100%", height: "100%", objectFit: "cover" },
    
    modalOverlay: {
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.4)", backdropFilter: "blur(5px)",
        display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    },
    modal: {
        ...glassStyle, background: "rgba(255,255,255,0.95)", width: "85%",
        padding: "25px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "15px"
    },
    label: { fontSize: "12px", color: "#555", marginLeft: "5px", fontWeight: "600", marginBottom: "4px" },
    input: {
        padding: "12px", borderRadius: "12px", border: "1px solid #ddd",
        outline: "none", fontSize: "14px", background: "#f5f7fa", width: "100%", boxSizing: "border-box"
    },
    saveBtn: {
        background: "linear-gradient(45deg, #007aff, #00c6ff)", color: "white",
        padding: "12px", borderRadius: "12px", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "10px"
    },
    bottomNav: {
      ...glassStyle, position: "fixed", bottom: "20px", left: "15px", right: "15px",
      height: "65px", display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 1000, borderRadius: "35px", color: "#007aff",
    },
    profileIconNav: { width: "30px", height: "30px", borderRadius: "50%", overflow: "hidden", border: "2px solid #007aff", cursor: "pointer" }
  };

  if (loading) return <div style={{height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f8ff"}}>Loading Profile...</div>;

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        {/* Back button returns to Home */}
        <div onClick={() => navigate("/home")} style={{cursor: "pointer"}}><Icons.Back /></div>
        <div style={styles.headerTitle}>{user?.username}</div>
        
        {/* Show Menu only if it's my profile */}
        {isMyProfile ? (
            <div onClick={handleLogout} style={{cursor: "pointer"}}><Icons.Menu /></div>
        ) : (
            <div style={{width: 26}}></div>
        )}
      </div>

      <div style={styles.infoCard}>
        <div style={styles.topSection}>
            <div style={styles.imgContainer}>
                <img src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={styles.profileImg} alt="profile" />
                {isMyProfile && (
                    <>
                        <div style={styles.addBtn} onClick={() => document.getElementById("pPic").click()}>
                            <Icons.Camera />
                        </div>
                        <input type="file" id="pPic" style={{display: "none"}} accept="image/*" onChange={handleProfilePicUpload}/>
                    </>
                )}
            </div>
            <div style={styles.stats}>
                <div><div style={styles.statNum}>{posts.length}</div><div style={styles.statLabel}>Posts</div></div>
                <div><div style={styles.statNum}>{user?.followers?.length || 0}</div><div style={styles.statLabel}>Followers</div></div>
                <div><div style={styles.statNum}>{user?.followings?.length || 0}</div><div style={styles.statLabel}>Following</div></div>
            </div>
        </div>

        <div style={styles.bioSection}>
            <div style={styles.name}>{user?.name || "User Name"}</div>
            <div style={styles.username}>@{user?.username}</div>
            <div style={styles.bio}>{user?.desc || "No bio yet."}</div>
        </div>

        <div style={styles.actions}>
            {/* Dynamic Buttons */}
            {isMyProfile ? (
                <>
                    <button style={styles.editBtn} onClick={() => setIsEditing(true)}>Edit Profile</button>
                    <button style={styles.editBtn}>Share Profile</button>
                </>
            ) : (
                <>
                    <button style={styles.followBtn} onClick={handleFollow}>
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button style={styles.editBtn} onClick={() => alert("Message feature coming soon!")}>Message</button>
                </>
            )}
        </div>
      </div>

      <div style={styles.tabs}>
        <div onClick={() => setActiveTab("posts")} style={{opacity: activeTab === "posts" ? 1 : 0.5}}><Icons.Grid active={activeTab === "posts"}/></div>
        <div onClick={() => setActiveTab("reels")} style={{opacity: activeTab === "reels" ? 1 : 0.5}}><Icons.Reels active={activeTab === "reels"}/></div>
      </div>

      <div style={styles.grid}>
        {activeTab === "posts" && posts.map((post) => {
             // Hide text-only posts
             if (!post.img) return null;
             return (
                 <div key={post._id} style={styles.gridItem}>
                     <img src={post.img} style={styles.gridImg} loading="lazy" alt="post" />
                 </div>
             );
        })}
        {activeTab === "reels" && (
            <div style={{gridColumn: "1/-1", textAlign:"center", padding:"40px", color:"#555"}}>Coming Soon 🎬</div>
        )}
      </div>

      {isEditing && isMyProfile && (
        <div style={styles.modalOverlay} onClick={() => setIsEditing(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 style={{margin: "0 0 10px 0", color: "#003366"}}>Edit Profile</h3>
                {error && <div style={{color: "red", fontSize: "12px", background:"#fee", padding:"5px", borderRadius:"5px", marginBottom:"10px"}}>{error}</div>}

                <div><div style={styles.label}>Name</div><input style={styles.input} value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} placeholder="Your Name" /></div>
                <div><div style={styles.label}>Username</div><input style={styles.input} value={editData.username} onChange={(e) => setEditData({...editData, username: e.target.value.toLowerCase()})} placeholder="username" /></div>
                <div><div style={styles.label}>Bio</div><textarea style={{...styles.input, resize: "none", height: "80px"}} value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})} placeholder="Write something about you..." /></div>

                <button style={styles.saveBtn} onClick={handleUpdateProfile}>Save Changes</button>
            </div>
        </div>
      )}

      <div style={styles.bottomNav}>
        <div onClick={() => navigate("/home")} style={{cursor: "pointer", opacity: 0.6}}><Icons.Home /></div>
        <div onClick={() => navigate("/search")} style={{cursor: "pointer", opacity: 0.6}}><Icons.Search /></div>
        <div onClick={() => navigate("/create")} style={{background: 'linear-gradient(135deg, #007aff, #005bb5)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', boxShadow: '0 8px 20px rgba(0, 122, 255, 0.4)', cursor: "pointer", transform: "translateY(-15px)"}}>
            <Icons.Plus />
        </div>
        <div onClick={() => navigate("/reels")} style={{cursor: "pointer", opacity: 0.6}}><Icons.Reels /></div>
        <div style={styles.profileIconNav} onClick={() => navigate("/profile")}>
            <img src={currentUser?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="nav-profile" />
        </div>
      </div>
    </div>
  );
}

export default Profile;
