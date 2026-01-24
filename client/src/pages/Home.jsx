import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config"; 

// --- Icons ---
const Icons = {
  Logo: () => <div style={{fontFamily: "'Billabong', cursive", fontSize: "32px", color: "#007aff", fontWeight: "bold", letterSpacing: "0.5px"}}>Nexo</div>, 
  HeartHeader: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Messenger: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  
  // أدوات الستوري
  Music: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>,
  Location: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Text: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>,

  // Bottom Nav
  HomeFilled: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="#007aff" stroke="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Search: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Plus: () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Reels: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>,
  
  // Post Icons
  Heart: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  HeartFilled: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff3040" stroke="#ff3040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Comment: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinejoin="round"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path></svg>,
  Share: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Save: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>,
  More: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>,
};

// --- مكون PostItem (كما هو سابقاً) ---
const PostItem = ({ post, currentUser }) => {
  // (نفس الكود السابق للبوست، لم يتغير)
  return (
    <div style={styles.post}>
       {/* (محتوى البوست نفسه من الردود السابقة لتوفير المساحة، تأكد من نسخه هنا أو استخدام المكون السابق) */}
       <div style={{padding:"20px", textAlign:"center"}}>Post Content Here</div>
    </div>
  );
};

// --- ✅ مكون عرض الستوري (Story Viewer) ---
const StoryViewer = ({ story, onClose }) => {
    if (!story) return null;
    return (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"black", zIndex:2000, display:"flex", justifyContent:"center", alignItems:"center"}}>
            <div style={{position:"relative", width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                
                {/* عرض المحتوى حسب النوع */}
                {story.type === "video" ? (
                    <video src={story.img} autoPlay style={{maxHeight:"100%", maxWidth:"100%"}} />
                ) : (
                    <img src={story.img} style={{maxHeight:"100%", maxWidth:"100%"}} alt="story"/>
                )}

                {/* Overlays (Text, Music, Location) */}
                {story.text && (
                    <div style={{position:"absolute", top:"50%", color:"white", background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:"10px", fontSize:"20px", fontWeight:"bold"}}>
                        {story.text}
                    </div>
                )}
                {story.music && (
                    <div style={{position:"absolute", top:"50px", left:"20px", color:"white", background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:"20px", display:"flex", alignItems:"center", gap:"5px"}}>
                        🎵 {story.music}
                    </div>
                )}
                {story.location && (
                    <div style={{position:"absolute", top:"100px", left:"20px", color:"white", background:"linear-gradient(45deg, #ff0055, #ff0099)", padding:"5px 10px", borderRadius:"20px", display:"flex", alignItems:"center", gap:"5px"}}>
                        📍 {story.location}
                    </div>
                )}

                {/* زر الإغلاق */}
                <div onClick={onClose} style={{position:"absolute", top:20, right:20, color:"white", fontSize:24, cursor:"pointer", zIndex:2001}}>✕</div>
            </div>
        </div>
    );
};

// --- ✅ مكون محرر الستوري (Story Editor) ---
const StoryEditor = ({ file, fileType, onClose, onUpload }) => {
    const [text, setText] = useState("");
    const [music, setMusic] = useState("");
    const [location, setLocation] = useState("");
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if(file) setPreview(URL.createObjectURL(file));
    }, [file]);

    return (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"#111", zIndex:3000, display:"flex", flexDirection:"column"}}>
            {/* Top Toolbar */}
            <div style={{padding:"20px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span onClick={onClose} style={{color:"white", fontSize:"24px", cursor:"pointer"}}>✕</span>
                <div style={{display:"flex", gap:"20px"}}>
                    <div style={{cursor:"pointer"}} onClick={() => {
                        const t = prompt("Enter text:");
                        if(t) setText(t);
                    }}><Icons.Text /></div>
                    <div style={{cursor:"pointer"}} onClick={() => {
                        const m = prompt("Add Music (Song Name):");
                        if(m) setMusic(m);
                    }}><Icons.Music /></div>
                    <div style={{cursor:"pointer"}} onClick={() => {
                        const l = prompt("Add Location:");
                        if(l) setLocation(l);
                    }}><Icons.Location /></div>
                </div>
            </div>

            {/* Preview Area */}
            <div style={{flex:1, position:"relative", display:"flex", justifyContent:"center", alignItems:"center", overflow:"hidden"}}>
                {fileType === "video" ? (
                    <video src={preview} autoPlay loop style={{maxHeight:"100%", maxWidth:"100%"}} />
                ) : (
                    <img src={preview} style={{maxHeight:"100%", maxWidth:"100%"}} />
                )}

                {/* Overlays Preview */}
                {text && <div style={{position:"absolute", top:"50%", color:"white", background:"rgba(0,0,0,0.5)", padding:"10px", borderRadius:"10px", fontSize:"24px", fontWeight:"bold", textAlign:"center"}}>{text}</div>}
                {music && <div style={{position:"absolute", top:"10%", left:"10%", color:"white", background:"rgba(255,255,255,0.2)", padding:"8px 15px", borderRadius:"20px"}}>🎵 {music}</div>}
                {location && <div style={{position:"absolute", top:"18%", left:"10%", color:"white", background:"linear-gradient(45deg, #ff0055, #ff0099)", padding:"8px 15px", borderRadius:"20px"}}>📍 {location}</div>}
            </div>

            {/* Bottom Bar */}
            <div style={{padding:"20px", display:"flex", justifyContent:"flex-end"}}>
                <button 
                    onClick={() => onUpload({ text, music, location })}
                    style={{background:"white", color:"black", border:"none", padding:"10px 20px", borderRadius:"20px", fontWeight:"bold", fontSize:"16px"}}
                >
                    Share to Story 
                </button>
            </div>
        </div>
    );
};

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  
  // حالات الستوري
  const [viewingStory, setViewingStory] = useState(null);
  const [editorFile, setEditorFile] = useState(null); // الملف المختار للمحرر
  const [editorFileType, setEditorFileType] = useState("image");
  
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const storyInputRef = useRef(null);

  const compressMedia = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => resolve(e.target.result); // Base64
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
      } catch (err) { console.log(err); setLoading(false); }
    };
    fetchData();
  }, [user?._id, navigate]);

  // 1. اختيار الملف وفحصه
  const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
          const isVideo = file.type.startsWith("video/");
          
          if (isVideo) {
              // التحقق من المدة (أقل من 15 ثانية)
              const video = document.createElement('video');
              video.preload = 'metadata';
              video.onloadedmetadata = function() {
                  window.URL.revokeObjectURL(video.src);
                  if (video.duration > 16) { // سماحية بسيطة
                      alert("Video must be 15 seconds or less!");
                  } else {
                      setEditorFileType("video");
                      setEditorFile(file); // فتح المحرر
                  }
              }
              video.src = URL.createObjectURL(file);
          } else {
              setEditorFileType("image");
              setEditorFile(file); // فتح المحرر للصورة
          }
      }
  };

  // 2. رفع الستوري من المحرر
  const handleUploadStory = async (metadata) => {
      try {
          const mediaBase64 = await compressMedia(editorFile);
          
          const payload = {
              userId: user._id,
              img: mediaBase64,
              type: editorFileType,
              text: metadata.text,
              music: metadata.music,
              location: metadata.location
          };

          const res = await axios.post(`${API_URL}/api/stories`, payload);
          setStories([...stories, res.data]);
          setEditorFile(null); // إغلاق المحرر
          alert("Story shared successfully! ✨");
      } catch (err) {
          alert("Failed to upload story (File might be too large)");
          console.error(err);
      }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Icons.Logo />
        <div style={styles.headerIcons}>
          <div style={{cursor: "pointer"}}><Icons.HeartHeader /></div>
          <div onClick={() => navigate("/messages")} style={{cursor: "pointer"}}><Icons.Messenger /></div>
        </div>
      </div>

      {/* Stories Section */}
      <div style={styles.storiesContainer}>
        <div style={styles.storyItem} onClick={() => storyInputRef.current.click()}>
            <div style={styles.storyRingUser}>
                <img src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={styles.storyImg} alt="story" />
                <div style={styles.addStoryBadge}>+</div>
            </div>
            <span style={styles.storyName}>You</span>
        </div>
        
        {/* ✅ Input يقبل صور وفيديو */}
        <input type="file" ref={storyInputRef} style={{display: "none"}} accept="image/*,video/*" onChange={handleFileSelect} />

        {stories.map((story) => (
             <div key={story._id} style={styles.storyItem} onClick={() => setViewingStory(story)}>
                <div style={styles.storyRing}>
                    {/* نعرض صورة مصغرة إذا كان فيديو نعرض بوستر افتراضي أو نفس الفيديو */}
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

      {/* ✅ Story Editor Modal */}
      {editorFile && (
          <StoryEditor 
            file={editorFile} 
            fileType={editorFileType}
            onClose={() => setEditorFile(null)} 
            onUpload={handleUploadStory} 
          />
      )}

      {/* ✅ Story Viewer Modal */}
      {viewingStory && <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />}

      {/* Feed */}
      {posts.map((post) => (
          // هنا يجب استخدام مكون PostItem الكامل الذي لديك
          <div key={post._id} style={styles.post}>
              {/* (صورة مؤقتة، استخدم PostItem الخاص بك) */}
              <img src={post.img} style={{width:"100%"}} />
              <div style={{padding:"10px"}}>{post.desc}</div>
          </div>
      ))}
      
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
      padding: "0 18px", height: "60px", marginBottom: "10px", borderRadius: "0 0 20px 20px"
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
        background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
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
};

export default Home;
