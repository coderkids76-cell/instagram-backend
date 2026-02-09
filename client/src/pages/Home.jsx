import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Draggable from 'react-draggable';
import { API_URL } from "../config"; 

// --- أيقونات Nexo ---
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
  CloseWhite: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  MusicWhite: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>,
  TextWhite: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>,
  StickerWhite: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 15l-4 4h-4v-4l4-4 4 4z"></path><path d="M10 10l4-4h4v4l-4 4-4-4z"></path></svg>,
  Trash: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
};

// --- Music Modal ---
const MusicSearchModal = ({ onClose, onSelectMusic }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const audioRef = useRef(null);

    const searchMusic = async () => {
        if (!query.trim()) return;
        setSearching(true);
        try {
            const res = await axios.get(`https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=10`);
            setResults(res.data.results);
        } catch (err) { console.error(err); } 
        finally { setSearching(false); }
    };

    const playPreview = (url) => {
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play().catch(e => {});
        }
    };

    return (
        <div style={igStyles.musicModal}>
            <div style={igStyles.musicHeader}>
                <span style={{flex:1}}></span>
                <span style={{fontWeight:"bold", fontSize:"16px", color: "white"}}>Music</span>
                <div style={{flex:1, textAlign:"right", cursor:"pointer"}} onClick={onClose}><Icons.CloseWhite /></div>
            </div>
            <div style={{padding:"10px"}}>
                 <div style={igStyles.searchBar}>
                    <input style={igStyles.searchInput} placeholder="Search songs..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchMusic()} />
                </div>
            </div>
            <div style={igStyles.resultsList}>
                {searching ? <div style={{textAlign:"center", padding:"20px", color:"#aaa"}}>Searching...</div> : results?.map(track => (
                    <div key={track.trackId} style={igStyles.trackItem}>
                        <div style={{position:"relative", width:"50px", height:"50px", marginRight:"12px"}}>
                            <img src={track.artworkUrl60} style={{width:"100%", height:"100%", borderRadius:"6px"}} onClick={() => playPreview(track.previewUrl)}/>
                        </div>
                        <div style={{flex:1, cursor:"pointer"}} onClick={() => { onSelectMusic(track); onClose(); }}>
                            <div style={{fontWeight:"bold", fontSize:"14px", color:"white"}}>{track.trackName}</div>
                            <div style={{fontSize:"12px", color:"#aaa"}}>{track.artistName}</div>
                        </div>
                    </div>
                ))}
            </div>
            <audio ref={audioRef} style={{display:"none"}} />
        </div>
    );
};

// --- Story Editor ---
const StoryEditor = ({ file, fileType, onClose, onUpload }) => {
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showMusicSearch, setShowMusicSearch] = useState(false);
    
    // Elements state
    const [textData, setTextData] = useState(null);
    const [musicData, setMusicData] = useState(null);
    
    // Trash state
    const [showTrash, setShowTrash] = useState(false);
    const [isHoveringTrash, setIsHoveringTrash] = useState(false);

    // Refs
    const textNodeRef = useRef(null);
    const musicNodeRef = useRef(null);

    useEffect(() => {
        if(file) setPreview(URL.createObjectURL(file));
        return () => { if(preview) URL.revokeObjectURL(preview); };
    }, [file]);

    const handleDragStart = () => setShowTrash(true);
    const handleDrag = (e, data) => {
        if (data.y > window.innerHeight - 150) setIsHoveringTrash(true);
        else setIsHoveringTrash(false);
    };
    
    const handleStopText = (e, data) => {
        setShowTrash(false);
        if (isHoveringTrash) { setTextData(null); setIsHoveringTrash(false); }
        else { setTextData(prev => ({ ...prev, x: data.x, y: data.y })); }
    };

    const handleStopMusic = (e, data) => {
        setShowTrash(false);
        if (isHoveringTrash) { setMusicData(null); setIsHoveringTrash(false); }
        else { setMusicData(prev => ({ ...prev, x: data.x, y: data.y })); }
    };

    // ✅✅✅ تحديث: الرفع باستخدام FormData لحل مشكلة Vercel ✅✅✅
    const handleUploadClick = async () => {
        if (!file) return;
        setIsUploading(true);

        // نرسل البيانات كـ Payload بسيط ليقوم المكون الأب Home بمعالجتها كـ FormData
        await onUpload({ 
            file: file, // نرسل الملف الأصلي لرفعه كـ Binary
            text: textData ? JSON.stringify(textData) : "", 
            music: musicData ? JSON.stringify(musicData) : "" 
        });
        setIsUploading(false);
    };

    return (
        <div style={igStyles.editorContainer}>
            <div style={igStyles.topBar}>
                <div onClick={onClose} style={{cursor:"pointer"}}><Icons.CloseWhite /></div>
                <div style={igStyles.topIconsRight}>
                    <div onClick={() => setShowMusicSearch(true)} style={{cursor:"pointer"}}><Icons.MusicWhite /></div>
                    <div onClick={() => { const t = prompt("Text:"); if(t) setTextData({content: t, x: 100, y: 300}); }} style={{cursor:"pointer"}}><Icons.TextWhite /></div>
                    <div style={{cursor:"pointer"}}><Icons.StickerWhite /></div>
                </div>
            </div>

            <div style={igStyles.previewArea}>
                {preview && (
                    fileType === "video" ? (
                        <video src={preview} autoPlay loop playsInline muted style={igStyles.fullScreenMedia} />
                    ) : (
                        <img src={preview} style={igStyles.fullScreenMedia} alt="preview"/>
                    )
                )}

                {textData && (
                    <Draggable nodeRef={textNodeRef} position={{x: textData.x, y: textData.y}} onStart={handleDragStart} onDrag={handleDrag} onStop={handleStopText} bounds="parent">
                        <div ref={textNodeRef} style={{...igStyles.draggableText, opacity: isHoveringTrash && showTrash ? 0.5 : 1}}>
                            {textData.content}
                        </div>
                    </Draggable>
                )}

                {musicData && (
                    <Draggable nodeRef={musicNodeRef} position={{x: musicData.x, y: musicData.y}} onStart={handleDragStart} onDrag={handleDrag} onStop={handleStopMusic} bounds="parent">
                        <div ref={musicNodeRef} style={{...igStyles.draggableMusic, opacity: isHoveringTrash && showTrash ? 0.5 : 1}}>
                            <span style={{marginRight:"8px"}}>🎵</span>
                            <div style={{display:"flex", flexDirection:"column"}}>
                                <span style={{fontWeight:"bold", fontSize:"12px"}}>{musicData.trackName.substring(0, 15)}</span>
                                <span style={{fontSize:"10px"}}>{musicData.artistName.substring(0, 15)}</span>
                            </div>
                        </div>
                    </Draggable>
                )}
            </div>

            {showTrash && (
                <div style={{
                    position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)",
                    background: isHoveringTrash ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)",
                    padding: "15px", borderRadius: "50%", transition: "all 0.2s", zIndex: 3050,
                    display: "flex", justifyContent: "center", alignItems: "center", width: "60px", height: "60px", border: "2px solid white"
                }}>
                    <Icons.Trash />
                </div>
            )}

            {!showTrash && (
                <div style={igStyles.bottomBar}>
                    <button disabled={isUploading} onClick={handleUploadClick} style={{...igStyles.shareButton, opacity: isUploading ? 0.7 : 1}}>
                        {isUploading ? "Sharing..." : "Share to Story >"}
                    </button>
                </div>
            )}

            {showMusicSearch && <MusicSearchModal onClose={() => setShowMusicSearch(false)} onSelectMusic={(track) => setMusicData({ ...track, x: 100, y: 150 })} />}
        </div>
    );
};

// --- Viewer ---
const StoryViewer = ({ story, onClose }) => {
    if (!story) return null;
    let musicData = null, textData = null;
    try { musicData = story.music ? JSON.parse(story.music) : null; } catch(e) {}
    try { textData = story.text ? JSON.parse(story.text) : null; } catch(e) {}

    return (
        <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"#000", zIndex:2000, display:"flex", justifyContent:"center", alignItems:"center"}}>
            <div style={{position:"relative", width:"100vw", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", overflow:"hidden", background: "#000"}}>
                {story.type === "video" ? (
                    <video src={story.img} autoPlay playsInline style={igStyles.fullScreenMedia} />
                ) : (
                    <img src={story.img} style={igStyles.fullScreenMedia} alt="story"/>
                )}
                {textData && <div style={{...igStyles.draggableText, position:"absolute", top:0, left:0, transform: `translate(${textData.x}px, ${textData.y}px)`, cursor:"default"}}>{textData.content}</div>}
                {musicData && <div style={{...igStyles.draggableMusic, position:"absolute", top:0, left:0, transform: `translate(${musicData.x}px, ${musicData.y}px)`, cursor:"default"}}>🎵 {musicData.trackName}</div>}
                <div onClick={onClose} style={{position:"absolute", top:20, right:20, cursor:"pointer", zIndex:2002}}><Icons.CloseWhite /></div>
            </div>
        </div>
    );
};

// --- PostItem ---
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
                <button onClick={handleFollow} style={{...styles.followBtn, background: isFollowing ? "rgba(0,122,255,0.1)" : "#007aff", color: isFollowing ? "#007aff" : "#fff"}}>
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
                            <div style={styles.menuItem}>Report</div>
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
          <div onClick={handleLike} style={{cursor: "pointer"}}>{isLiked ? <Icons.HeartFilled /> : <Icons.Heart />}</div>
          <div style={{cursor: "pointer"}}><Icons.Comment /></div>
          <div style={{cursor: "pointer"}}><Icons.Share /></div>
        </div>
        <div style={{cursor: "pointer"}}><Icons.Save /></div>
      </div>
      <div style={styles.likesCount}>{likeCount} likes</div>
    </div>
  );
};

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [viewingStory, setViewingStory] = useState(null);
  const [editorFile, setEditorFile] = useState(null);
  const [editorFileType, setEditorFileType] = useState("image");
  const user = JSON.parse(localStorage.getItem("user"));
  const storyInputRef = useRef(null); 

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

  const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
          const isVideo = file.type.startsWith("video/");
          if (isVideo) {
              const video = document.createElement('video');
              video.preload = 'metadata';
              video.onloadedmetadata = function() {
                  window.URL.revokeObjectURL(video.src);
                  if (video.duration > 31) { alert("Video must be 30s or less!"); } 
                  else { setEditorFileType("video"); setEditorFile(file); }
              }
              video.src = URL.createObjectURL(file);
          } else {
              setEditorFileType("image");
              setEditorFile(file);
          }
      }
  };

  // ✅✅✅ تحديث: دالة الرفع النهائية باستخدام FormData ✅✅✅
  const handleUploadComplete = async (payload) => {
      try {
          const formData = new FormData();
          formData.append("userId", user._id);
          formData.append("type", editorFileType);
          formData.append("img", payload.file); // رفع الملف كـ Binary لـ Cloudinary
          formData.append("text", payload.text);
          formData.append("music", payload.music);

          const res = await axios.post(`${API_URL}/api/stories`, formData, {
              headers: { "Content-Type": "multipart/form-data" }
          });

          setStories([...stories, res.data]); 
          setEditorFile(null); 
          alert("Story uploaded successfully! 🎉");
          window.location.reload(); // تحديث الصفحة لرؤية الستوري الجديدة
      } catch (err) {
          console.error(err);
          alert("فشل الرفع. حاول استخدام صورة أصغر أو ملف فيديو مضغوط.");
      }
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

      {editorFile && <StoryEditor file={editorFile} fileType={editorFileType} onClose={() => setEditorFile(null)} onUpload={handleUploadComplete} />}
      {viewingStory && <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />}

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

const glassStyle = { background: "rgba(255, 255, 255, 0.5)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.4)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)" };

const styles = {
    container: { background: "linear-gradient(180deg, #E2D1F9 0%, #dbeafe 100%)", minHeight: "100vh", paddingBottom: "80px", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" },
    header: { ...glassStyle, position: "sticky", top: 0, zIndex: 100, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 18px", height: "60px", borderBottom: "none", marginBottom: "10px", borderRadius: "0 0 20px 20px" },
    headerIcons: { display: "flex", gap: "22px", alignItems: "center" },
    storiesContainer: { ...glassStyle, padding: "15px 0", display: "flex", gap: "15px", overflowX: "auto", paddingLeft: "16px", marginBottom: "15px", borderRadius: "20px", margin: "0 10px 15px 10px" },
    storyItem: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: "72px", cursor: "pointer" },
    storyRingUser: { width: "68px", height: "68px", borderRadius: "50%", position: "relative" },
    storyRing: { width: "68px", height: "68px", borderRadius: "50%", padding: "2px", background: "linear-gradient(45deg, #007aff 0%, #00c6ff 100%)", display: "flex", justifyContent: "center", alignItems: "center" },
    storyImg: { width: "100%", height: "100%", borderRadius: "50%", border: "2px solid white", objectFit: "cover" },
    addStoryBadge: { position: "absolute", bottom: "2px", right: "2px", backgroundColor: "#007aff", color: "white", borderRadius: "50%", width: "22px", height: "22px", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid white" },
    storyName: { fontSize: "11px", marginTop: "4px", color: "#004080", fontWeight: "600" },
    post: { ...glassStyle, marginBottom: "20px", borderRadius: "25px", paddingBottom: "12px", overflow: "visible", margin: "0 10px 20px 10px", background: "rgba(255, 255, 255, 0.6)" },
    postHeader: { display: "flex", alignItems: "center", padding: "12px 15px" },
    userInfo: { display: "flex", alignItems: "center", cursor: "pointer" },
    userAvatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: "cover" },
    usernameText: { fontSize: "14px", fontWeight: "700", color: "#003366" },
    nameText: { fontSize: "11px", color: "#6688aa", marginTop: "1px" },
    followBtn: { fontSize: "12px", padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" },
    menuDropdown: { position: "absolute", top: "30px", right: "0", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", border: "1px solid #eee", borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.1)", zIndex: 50, width: "120px", overflow: "hidden" },
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
    bottomNav: { ...glassStyle, position: "fixed", bottom: "20px", left: "15px", right: "15px", height: "65px", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 1000, borderRadius: "35px", color: "#007aff" },
    plusBtn: { background: 'linear-gradient(135deg, #007aff, #005bb5)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', boxShadow: '0 8px 20px rgba(0, 122, 255, 0.35)', cursor: "pointer", transform: "translateY(-15px)" },
    profileIconNav: { width: "30px", height: "30px", borderRadius: "50%", overflow: "hidden", border: "2px solid #007aff", cursor: "pointer" },
    emptyState: { textAlign: "center", padding: "60px 20px", color: "#555", fontSize: "16px" },
    createBtn: { marginTop: "20px", padding: "12px 24px", background: "#007aff", color: "white", border: "none", borderRadius: "20px", fontWeight:"bold" }
};

const igStyles = {
    editorContainer: { position:"fixed", top:0, left:0, right:0, bottom:0, background:"#000", zIndex:3000, display:"flex", flexDirection:"column" },
    topBar: { padding:"15px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"absolute", top:0, left:0, right:0, zIndex:10 },
    topIconsRight: { display:"flex", gap:"25px" },
    fullScreenMedia: { width:"100vw", height:"100vh", objectFit:"cover", position:"absolute", top:0, left:0 },
    previewArea: { flex:1, position:"relative", display:"flex", justifyContent:"center", alignItems:"center", overflow:"hidden", background:"#000" },
    bottomBar: { padding:"20px", display:"flex", justifyContent:"flex-end", position:"absolute", bottom:0, left:0, right:0, zIndex:10 },
    shareButton: { background:"white", color:"black", border:"none", padding:"12px 24px", borderRadius:"30px", fontWeight:"bold", fontSize:"16px" },
    draggableText: { position:"absolute", color:"white", background:"rgba(0,0,0,0.5)", padding:"5px 15px", borderRadius:"12px", fontSize:"22px", fontWeight:"600", cursor:"move", textAlign:"center", maxWidth:"80%" },
    draggableMusic: { position:"absolute", color:"white", background:"rgba(255,255,255,0.2)", backdropFilter:"blur(5px)", padding:"10px 15px", borderRadius:"12px", cursor:"move", display:"flex", alignItems:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.2)" },
    musicModal: { position:"fixed", bottom:0, left:0, right:0, height:"70vh", background:"#1a1a1a", borderTopLeftRadius:"20px", borderTopRightRadius:"20px", zIndex:3100, display:"flex", flexDirection:"column", boxShadow:"0 -5px 20px rgba(0,0,0,0.5)" },
    musicHeader: { padding:"15px", display:"flex", justifyContent:"center", alignItems:"center", borderBottom:"1px solid #333" },
    searchBar: { background:"#333", padding:"8px 12px", borderRadius:"10px", display:"flex", alignItems:"center" },
    searchInput: { background:"transparent", border:"none", outline:"none", color:"white", width:"100%", fontSize:"16px", marginLeft:"10px" },
    resultsList: { flex:1, overflowY:"auto", padding:"10px" },
    trackItem: { display:"flex", alignItems:"center", padding:"10px", borderBottom:"1px solid #333" }
};

export default Home;