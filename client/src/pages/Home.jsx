import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config"; 

// --- الأيقونات ---
const Icons = {
  Logo: () => <div style={{fontFamily: "'Billabong', cursive", fontSize: "32px", color: "#007aff", fontWeight: "bold", letterSpacing: "0.5px"}}>Nexo</div>, 
  HeartHeader: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Messenger: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Heart: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  HeartFilled: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff3040" stroke="#ff3040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Comment: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinejoin="round"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path></svg>,
  Share: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Save: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>,
  More: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>,
  HomeFilled: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="#007aff" stroke="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Search: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Plus: () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Reels: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>,
  Music: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>,
  Location: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Text: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>,
};

// --- المكونات الفرعية ---

// 1. عارض الستوري
const StoryViewer = ({ story, onClose }) => {
    if (!story) return null;
    return (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"black", zIndex:2000, display:"flex", justifyContent:"center", alignItems:"center"}}>
            <div style={{position:"relative", width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                {story.type === "video" ? (
                    <video src={story.img} autoPlay style={{maxHeight:"100%", maxWidth:"100%"}} />
                ) : (
                    <img src={story.img} style={{maxHeight:"100%", maxWidth:"100%"}} alt="story"/>
                )}
                
                {story.text && <div style={{position:"absolute", top:"50%", color:"white", background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:"10px", fontSize:"20px", fontWeight:"bold"}}>{story.text}</div>}
                {story.music && <div style={{position:"absolute", top:"50px", left:"20px", color:"white", background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:"20px"}}>🎵 {story.music}</div>}
                {story.location && <div style={{position:"absolute", top:"100px", left:"20px", color:"white", background:"linear-gradient(45deg, #ff0055, #ff0099)", padding:"5px 10px", borderRadius:"20px"}}>📍 {story.location}</div>}
                
                <div onClick={onClose} style={{position:"absolute", top:20, right:20, color:"white", fontSize:24, cursor:"pointer", zIndex:2001}}>✕</div>
            </div>
        </div>
    );
};

// 2. محرر الستوري
const StoryEditor = ({ file, fileType, onClose, onUpload }) => {
    const [text, setText] = useState("");
    const [music, setMusic] = useState("");
    const [location, setLocation] = useState("");
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if(file) setPreview(URL.createObjectURL(file));
    }, [file]);

    return (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"#111", zIndex:3000, display:"flex", flexDirection:"column"}}>
            <div style={{padding:"20px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span onClick={onClose} style={{color:"white", fontSize:"24px", cursor:"pointer"}}>✕</span>
                <div style={{display:"flex", gap:"20px"}}>
                    <div onClick={() => { const t = prompt("Enter text:"); if(t) setText(t); }}><Icons.Text /></div>
                    <div onClick={() => { const m = prompt("Add Music:"); if(m) setMusic(m); }}><Icons.Music /></div>
                    <div onClick={() => { const l = prompt("Add Location:"); if(l) setLocation(l); }}><Icons.Location /></div>
                </div>
            </div>
            <div style={{flex:1, position:"relative", display:"flex", justifyContent:"center", alignItems:"center", overflow:"hidden"}}>
                {fileType === "video" ? <video src={preview} autoPlay loop style={{maxHeight:"100%", maxWidth:"100%"}} /> : <img src={preview} style={{maxHeight:"100%", maxWidth:"100%"}} />}
                {text && <div style={{position:"absolute", top:"50%", color:"white", background:"rgba(0,0,0,0.5)", padding:"10px", borderRadius:"10px", fontSize:"24px", fontWeight:"bold"}}>{text}</div>}
                {music && <div style={{position:"absolute", top:"100px", color:"white", background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:"10px"}}>🎵 {music}</div>}
            </div>
            <div style={{padding:"20px", display:"flex", justifyContent:"flex-end"}}>
                <button 
                    disabled={isUploading}
                    onClick={() => { setIsUploading(true); onUpload({ text, music, location }); }} 
                    style={{background: isUploading ? "#555" : "white", color: "black", border: "none", padding:"10px 20px", borderRadius:"20px", fontWeight:"bold"}}
                >
                    {isUploading ? "Uploading..." : "Share to Story >"}
                </button>
            </div>
        </div>
    );
};

// 3. عنصر البوست
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
      } catch (err) { console.error(err); }
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
      if (window.confirm("Delete this post?")) {
        try {
            await axios.delete(`${API_URL}/api/posts/${post._id}`, { data: { userId: currentUser._id } });
            window.location.reload(); 
        } catch (err) { alert("Failed to delete post"); }
      }
  };

  const handleUpdate = async () => {
      try {
          await axios.put(`${API_URL}/api/posts/${post._id}`, { userId: currentUser._id, desc: editDesc });
          setIsEditing(false); setShowMenu(false);
      } catch (err) { alert("Failed to update post"); }
  };

  const formatTime = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.post}>
      <div style={styles.postHeader}>
        <div style={styles.userInfo} onClick={() => navigate(`/profile/${user?.username}`)}>
          <img src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={styles.userAvatar} alt="user" />
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
      {isEditing ? (
          <div style={{padding: "10px 15px"}}>
              <textarea style={styles.editInput} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
              <div style={{display: "flex", gap: "10px", marginTop: "5px"}}>
                  <button style={styles.saveBtn} onClick={handleUpdate}>Save</button>
                  <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
          </div>
      ) : (
          post.desc && <div style={styles.postContentText}>{post.desc}</div>
      )}
      {post.img && (
        <div style={styles.imageContainer}>
             <img src={post.img} style={styles.postImage} alt="post" />
        </div>
      )}
      <div style={styles.postActions}>
        <div style={styles.leftActions}>
          <div onClick={handleLike} style={{cursor: "pointer", display:"flex", alignItems:"center", transform: isLiked ? "scale(1.1)" : "scale(1)", transition: "0.2s"}}>
            {isLiked ? <Icons.HeartFilled /> : <Icons.Heart />}
          </div>
          <div style={{cursor: "pointer"}}><Icons.Comment /></div>
          <div style={{cursor: "pointer"}} onClick={() => navigator.share?.({ title: 'Nexo', text: post.desc, url: window.location.href })}><Icons.Share /></div>
        </div>
        <div style={{cursor: "pointer"}}><Icons.Save /></div>
      </div>
      <div style={styles.likesCount}>{likeCount} likes</div>
      <div style={styles.time}>{formatTime(post.createdAt)}</div>
    </div>
  );
};

// --- الصفحة الرئيسية (Home) ---
function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // حالات الستوري
  const [viewingStory, setViewingStory] = useState(null);
  const [editorFile, setEditorFile] = useState(null);
  const [editorFileType, setEditorFileType] = useState("image");

  const user = JSON.parse(localStorage.getItem("user"));
  const storyInputRef = useRef(null); 

  // ضغط الملفات قبل الرفع
  const compressMedia = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => resolve(e.target.result);
    });
  };

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    const fetchData = async () => {
      try {
        const postsRes = await axios.get(`${API_URL}/api/posts/timeline/${user._id}`);
        setPosts(postsRes.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)));
        
        const storiesRes = await axios.get(`${API_URL}/api/stories/timeline/${user._id}`);
        setStories(storiesRes.data);
        
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user?._id, navigate]);

  // ✅ 1. تم إصلاح المنطق هنا: لا يوجد رسالة تنبيه
  const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
          const isVideo = file.type.startsWith("video/");
          if (isVideo) {
              const video = document.createElement('video');
              video.preload = 'metadata';
              video.onloadedmetadata = function() {
                  window.URL.revokeObjectURL(video.src);
                  if (video.duration > 16) { alert("Video must be 15s or less!"); } 
                  else { setEditorFileType("video"); setEditorFile(file); }
              }
              video.src = URL.createObjectURL(file);
          } else {
              setEditorFileType("image");
              setEditorFile(file); // ✅ هذا سيفتح نافذة StoryEditor مباشرة
          }
      }
  };

  const handleUploadStory = async (metadata) => {
      try {
          const mediaBase64 = await compressMedia(editorFile);
          const payload = { userId: user._id, img: mediaBase64, type: editorFileType, ...metadata };
          
          const res = await axios.post(`${API_URL}/api/stories`, payload);
          setStories([...stories, res.data]); 
          setEditorFile(null); 
          alert("Story shared! ✨");
      } catch (err) { alert("Failed to upload"); }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Icons.Logo />
        <div style={styles.headerIcons}>
          <div style={{cursor: "pointer"}}><Icons.HeartHeader /></div>
          <div onClick={() => navigate("/messages")} style={{cursor: "pointer"}}><Icons.Messenger /></div>
        </div>
      </div>

      {/* ✅ قسم الستوري (بدون بيانات وهمية) */}
      <div style={styles.storiesContainer}>
        
        <div style={styles.storyItem} onClick={() => storyInputRef.current.click()}>
            <div style={styles.storyRingUser}>
                <img src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={styles.storyImg} alt="story" />
                <div style={styles.addStoryBadge}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
            </div>
            <span style={styles.storyName}>You</span>
        </div>
        <input type="file" ref={storyInputRef} style={{display: "none"}} accept="image/*,video/*" onChange={handleFileSelect} />

        {/* عرض ستوريات المتابعين القادمة من السيرفر فقط */}
        {stories.map((story) => (
          <div key={story._id} style={styles.storyItem} onClick={() => setViewingStory(story)}>
            <div style={styles.storyRing}>
                {story.type === 'video' ? (
                    <video src={story.img} style={{width: "100%", height: "100%", objectFit: "cover", borderRadius:"50%"}} />
                ) : (
                    <img src={story.img} style={styles.storyImg} alt="story" />
                )}
            </div>
            <span style={styles.storyName}>User</span>
          </div>
        ))}
      </div>

      {/* Modals */}
      {editorFile && <StoryEditor file={editorFile} fileType={editorFileType} onClose={() => setEditorFile(null)} onUpload={handleUploadStory} />}
      {viewingStory && <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />}

      {/* Feed */}
      {loading ? (
          <div style={styles.emptyState}>Loading...</div>
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

// --- Styles ---
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
      minHeight: "100vh", paddingBottom: "80px", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    },
    header: {
      ...glassStyle, position: "sticky", top: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 18px", height: "60px", borderBottom: "none", marginBottom: "10px", borderRadius: "0 0 20px 20px"
    },
    headerIcons: { display: "flex", gap: "22px", alignItems: "center" },
    
    storiesContainer: {
      ...glassStyle, padding: "15px 0", display: "flex", gap: "15px", overflowX: "auto",
      paddingLeft: "16px", marginBottom: "15px", borderRadius: "20px", margin: "0 10px 15px 10px"
    },
    storyItem: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: "72px", cursor: "pointer" },
    storyRingUser: { width: "68px", height: "68px", borderRadius: "50%", position: "relative" },
    storyRing: {
        width: "68px", height: "68px", borderRadius: "50%", padding: "2px",
        background: "linear-gradient(45deg, #007aff 0%, #00c6ff 100%)",
        display: "flex", justifyContent: "center", alignItems: "center",
    },
    storyImg: { width: "100%", height: "100%", borderRadius: "50%", border: "2px solid white", objectFit: "cover" },
    addStoryBadge: {
        position: "absolute", bottom: "2px", right: "2px", backgroundColor: "#007aff", color: "white", borderRadius: "50%",
        width: "22px", height: "22px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid white",
    },
    storyName: { fontSize: "11px", marginTop: "4px", color: "#004080", fontWeight: "600" },
    
    post: {
      ...glassStyle, marginBottom: "20px", borderRadius: "25px", paddingBottom: "12px", overflow: "visible", margin: "0 10px 20px 10px",
      background: "rgba(255, 255, 255, 0.6)",
    },
    postHeader: { display: "flex", alignItems: "center", padding: "12px 15px" },
    userInfo: { display: "flex", alignItems: "center", cursor: "pointer" },
    userAvatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: "cover" },
    usernameText: { fontSize: "14px", fontWeight: "700", color: "#003366" },
    nameText: { fontSize: "11px", color: "#6688aa", marginTop: "1px" },
    followBtn: { fontSize: "12px", padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" },
    menuDropdown: {
        position: "absolute", top: "30px", right: "0", background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)", border: "1px solid #eee", borderRadius: "12px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)", zIndex: 50, width: "120px", overflow: "hidden"
    },
    menuItem: { padding: "10px 15px", fontSize: "13px", color: "#333", borderBottom: "1px solid #f5f5f5", fontWeight: "500" },
    postContentText: { padding: "0 15px 10px 15px", fontSize: "15px", lineHeight: "1.5", color: "#333", textAlign: "left" },
    imageContainer: { width: "100%", backgroundColor: "rgba(0,0,0,0.02)", display: "flex", justifyContent: "center", overflow: "hidden" },
    postImage: { width: "100%", height: "auto", maxHeight: "1350px", objectFit: "cover" },
    postActions: { padding: "12px 15px 0 15px", display: "flex", justifyContent: "space-between", color: "#007aff" },
    leftActions: { display: "flex", gap: "18px" },
    likesCount: { padding: "0 15px", fontWeight: "700", fontSize: "13px", marginTop: "8px", color: "#003366" },
    time: { padding: "0 15px", fontSize: "10px", color: "#6688aa", marginTop: "4px", marginBottom: "5px" },
    editInput: { width: "93%", border: "1px solid #ddd", borderRadius: "8px", padding: "8px", outline: "none", fontSize: "14px", fontFamily: "inherit", background: "rgba(255,255,255,0.5)" },
    saveBtn: { background: "#007aff", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" },
    cancelBtn: { background: "rgba(0,0,0,0.05)", color: "#333", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px" },
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
    profileIconNav: { width: "30px", height: "30px", borderRadius: "50%", overflow: "hidden", border: "2px solid #007aff", cursor: "pointer" },
    emptyState: { textAlign: "center", padding: "60px 20px", color: "#555", fontSize: "16px" },
    createBtn: { marginTop: "20px", padding: "12px 24px", background: "#007aff", color: "white", border: "none", borderRadius: "20px", fontWeight:"bold" }
};

export default Home;
