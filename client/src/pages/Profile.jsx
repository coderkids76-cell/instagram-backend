import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileIcons = {
  Back: () => <svg aria-label="Back" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" transform="rotate(-90 12 12)"></path></svg>,
  Menu: () => <svg aria-label="Settings" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>,
  DownArrow: () => <svg aria-label="Down Chevron" fill="currentColor" height="12" viewBox="0 0 24 24" width="12"><path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" transform="rotate(180 12 12)"></path></svg>,
  GridIcon: ({isActive}) => <svg aria-label="Posts" fill={isActive ? "#007aff" : "#8e8e8e"} height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>,
  ReelsIcon: ({isActive}) => <svg aria-label="Reels" fill={isActive ? "#007aff" : "#8e8e8e"} height="24" viewBox="0 0 24 24" width="24"><path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.022 2.155 0 3.991-.009 4.614-.009ZM2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2c-1.689 0-3.151.253-4.328.675l2.647 4.965h4.283c.516.29.833.81.833 1.385v5.474c0 .828-.672 1.5-1.5 1.5H6.617c-.828 0-1.5-.672-1.5-1.5V9.025c0-.575.317-1.095.833-1.385h1.233l-2.05-3.839A8.15 8.15 0 0 0 2 8.552v3.449Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>,
};

const BottomIcons = {
  Home: () => <svg aria-label="Home" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>,
  Search: () => <svg aria-label="Search" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" x1="16.511" x2="21.643" y1="16.511" y2="21.643"></line></svg>,
  Plus: () => <svg aria-label="New Post" fill="none" height="24" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" width="24"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>,
  Reels: () => <svg aria-label="Reels" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.022 2.155 0 3.991-.009 4.614-.009ZM2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2c-1.689 0-3.151.253-4.328.675l2.647 4.965h4.283c.516.29.833.81.833 1.385v5.474c0 .828-.672 1.5-1.5 1.5H6.617c-.828 0-1.5-.672-1.5-1.5V9.025c0-.575.317-1.095.833-1.385h1.233l-2.05-3.839A8.15 8.15 0 0 0 2 8.552v3.449Z"></path></svg>,
};

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const isMyProfile = true; 
  
  // ✅ State لتخزين المنشورات والريلز
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    
    // جلب البيانات من الذاكرة
    const saved = JSON.parse(localStorage.getItem("myPosts")) || [];
    setMyPosts(saved);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Nexo Profile', url: window.location.href });
    } else {
      alert("Link copied to clipboard! 📋");
    }
  };

  const user = {
    username: "alex_designs",
    name: "Alex | UI/UX Designer",
    category: "Digital Creator",
    bio: "Creating clean & modern web experiences. \n📍 Morocco \n👇 Check my latest work!",
    website: "alexdesigns.com",
    img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
    postsCount: 152 + myPosts.length, // تحديث العداد
    followers: "12.4K",
    following: 345,
    followedBy: ["sara_des", "travel_99"]
  };

  const staticPosts = Array.from({ length: 12 }, (_, i) => ({
    id: i, img: `https://source.unsplash.com/random/300x300?sig=${i}`
  }));

  // تصفية البيانات
  const myReels = myPosts.filter(p => p.type === "video");
  const myImages = myPosts.filter(p => p.type === "image");
  
  // دمج الصور الجديدة مع القديمة
  const finalPosts = [...myImages, ...staticPosts];

  const styles = {
    container: {
      backgroundColor: "#f0f8ff",
      minHeight: "100vh",
      paddingBottom: "60px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: "#004080",
    },
    header: {
      position: "sticky", top: 0, zIndex: 100, backgroundColor: "rgba(240, 248, 255, 0.95)",
      backdropFilter: "blur(10px)", display: "flex", justifyContent: "space-between",
      alignItems: "center", padding: "10px 16px", height: "44px", borderBottom: "1px solid #cce5ff", color: "#007aff",
    },
    headerTitle: { fontWeight: "700", fontSize: "16px", display: "flex", alignItems: "center", gap: "5px", color: "#004080" },
    infoSection: { padding: "20px 16px 0 16px", backgroundColor: "white" },
    topHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px" },
    profileImageContainer: { position: "relative", marginRight: "20px" },
    profileImage: { width: "80px", height: "80px", borderRadius: "50%", border: "2px solid #007aff", padding: "2px", backgroundColor: "white" },
    addBadge: {
        position: "absolute", bottom: "2px", right: "2px", backgroundColor: "#007aff", color: "white",
        borderRadius: "50%", width: "24px", height: "24px", display: "flex", justifyContent: "center",
        alignItems: "center", fontSize: "18px", border: "2px solid white", cursor: "pointer", zIndex: 5,
    },
    statsContainer: { display: "flex", justifyContent: "space-around", flex: 1, textAlign: "center" },
    statNumber: { fontWeight: "700", fontSize: "18px", color: "#004080" },
    statLabel: { fontSize: "13px", color: "#0066cc" },
    bioSection: { paddingBottom: "15px" },
    fullName: { fontWeight: "700", fontSize: "14px" },
    category: { color: "#0066cc", fontSize: "13px", marginBottom: "5px" },
    bioText: { fontSize: "14px", whiteSpace: "pre-line", lineHeight: "1.3" },
    websiteLink: { color: "#007aff", fontWeight: "600", textDecoration: "none" },
    followedBy: { display: "flex", alignItems: "center", fontSize: "12px", color: "#0066cc", marginTop: "10px" },
    followedByImgs: { display: "flex", marginRight: "5px" },
    followedImg: { width: "18px", height: "18px", borderRadius: "50%", border: "1px solid white", marginLeft: "-6px" },
    actionButtons: { display: "flex", gap: "6px", paddingBottom: "15px" },
    blueButton: { flex: 1, backgroundColor: "#007aff", color: "white", border: "none", borderRadius: "8px", padding: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer" },
    grayButton: { flex: 1, backgroundColor: "#f0f8ff", color: "#007aff", border: "1px solid #cce5ff", borderRadius: "8px", padding: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer" },
    iconButton: { backgroundColor: "#f0f8ff", border: "1px solid #cce5ff", borderRadius: "8px", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#007aff", cursor: "pointer" },
    tabsContainer: { display: "flex", justifyContent: "space-around", borderTop: "1px solid #cce5ff", backgroundColor: "white", marginTop: "10px" },
    tab: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 0", cursor: "pointer", color: "#8e8e8e" },
    activeTab: { color: "#007aff", borderBottom: "2px solid #007aff" },
    gridContainer: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", backgroundColor: "white" },
    gridItem: { aspectRatio: "1 / 1", backgroundColor: "#e1e1e1", overflow: "hidden", position: "relative" },
    gridImage: { width: "100%", height: "100%", objectFit: "cover" },
    bottomNav: {
      position: "fixed", bottom: 0, width: "100%", height: "60px", backgroundColor: "white",
      borderTop: "1px solid #cce5ff", display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 100, paddingBottom: "4px", borderRadius: "20px 20px 0 0",
      boxShadow: "0 -4px 12px rgba(0, 122, 255, 0.1)", color: "#007aff",
    },
    profileIconNav: { width: "28px", height: "28px", borderRadius: "50%", overflow: "hidden", border: "2px solid #007aff" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div onClick={() => navigate("/home")} style={{cursor: "pointer"}}><ProfileIcons.Back /></div>
        <div style={styles.headerTitle}>{user.username} <ProfileIcons.DownArrow /></div>
        <div><ProfileIcons.Menu /></div>
      </div>

      <div style={{backgroundColor: "white"}}>
        <div style={styles.infoSection}>
            <div style={styles.topHeader}>
                <div style={styles.profileImageContainer}>
                    <img src={user.img} style={styles.profileImage} alt="profile" />
                    <input type="file" id="storyUpload" style={{display: "none"}} onChange={(e) => alert(`Story Uploaded: ${e.target.files[0].name}`)} />
                    {isMyProfile && (
                        <div style={styles.addBadge} onClick={() => document.getElementById("storyUpload").click()}>+</div>
                    )}
                </div>
                <div style={styles.statsContainer}>
                    <div><div style={styles.statNumber}>{user.postsCount}</div><div style={styles.statLabel}>Posts</div></div>
                    <div><div style={styles.statNumber}>{user.followers}</div><div style={styles.statLabel}>Followers</div></div>
                    <div><div style={styles.statNumber}>{user.following}</div><div style={styles.statLabel}>Following</div></div>
                </div>
            </div>

            <div style={styles.bioSection}>
                <div style={styles.fullName}>{user.name}</div>
                <div style={styles.category}>{user.category}</div>
                <div style={styles.bioText}>{user.bio}</div>
                <div>🔗 <a href={`https://${user.website}`} style={styles.websiteLink}>{user.website}</a></div>
                <div style={styles.followedBy}>
                    <div style={styles.followedByImgs}>
                        <img src="https://i.pravatar.cc/50?img=1" style={styles.followedImg} />
                        <img src="https://i.pravatar.cc/50?img=2" style={styles.followedImg} />
                        <img src="https://i.pravatar.cc/50?img=3" style={{...styles.followedImg, marginLeft: "-8px"}} />
                    </div>
                    Followed by {user.followedBy[0]}, {user.followedBy[1]} and 3 others
                </div>
            </div>

            <div style={styles.actionButtons}>
                {isMyProfile ? (
                    <>
                        <button style={styles.grayButton} onClick={() => navigate("/edit-profile")}>Edit Profile</button>
                        <button style={styles.grayButton} onClick={handleShare}>Share Profile</button>
                    </>
                ) : (
                    <>
                        <button style={styles.blueButton}>Follow</button>
                        <button style={styles.grayButton}>Message</button>
                        <button style={styles.grayButton} onClick={handleShare}>Share Profile</button>
                    </>
                )}
                <div style={styles.iconButton}><ProfileIcons.DownArrow /></div>
            </div>
        </div>

        <div style={styles.tabsContainer}>
            <div style={{...styles.tab, ...(activeTab === "posts" ? styles.activeTab : {})}} onClick={() => setActiveTab("posts")}>
                <ProfileIcons.GridIcon isActive={activeTab === "posts"} />
            </div>
            <div style={{...styles.tab, ...(activeTab === "reels" ? styles.activeTab : {})}} onClick={() => setActiveTab("reels")}>
                <ProfileIcons.ReelsIcon isActive={activeTab === "reels"} />
            </div>
        </div>
      </div>

      <div style={styles.gridContainer}>
          {/* عرض الصور */}
          {activeTab === "posts" && finalPosts.map((post, index) => (
              <div key={index} style={styles.gridItem}>
                  <img src={post.url || post.img} style={styles.gridImage} alt="post" />
              </div>
          ))}

          {/* ✅ عرض الريلز */}
          {activeTab === "reels" && (
              myReels.length > 0 ? (
                  myReels.map((reel, index) => (
                      <div key={index} style={{...styles.gridItem, aspectRatio: "9/16"}}>
                          <video src={reel.url} style={styles.gridImage} muted />
                          <div style={{position: "absolute", bottom: "5px", left: "5px", color: "white", fontSize: "12px", textShadow: "0 1px 2px black"}}>▶ 0</div>
                      </div>
                  ))
              ) : (
                  <div style={{gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#888", fontSize: "14px"}}>
                      <div style={{fontSize: "40px", marginBottom: "10px"}}>🎬</div>
                      No Reels yet.<br/>Tap + to create one!
                  </div>
              )
          )}
      </div>

      <div style={styles.bottomNav}>
        <div onClick={() => navigate("/home")} style={{cursor: "pointer"}}><BottomIcons.Home /></div>
        <div onClick={() => navigate("/search")} style={{cursor: "pointer"}}><BottomIcons.Search /></div>
        <div style={{backgroundColor: '#007aff', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', boxShadow: '0 4px 10px rgba(0, 122, 255, 0.4)', cursor: "pointer"}} onClick={() => navigate("/create")}>
            <BottomIcons.Plus />
        </div>
        <div onClick={() => navigate("/reels")} style={{cursor: "pointer"}}><BottomIcons.Reels /></div>
        <div style={styles.profileIconNav}>
            <img src={user.img} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="profile" />
        </div>
      </div>
    </div>
  );
}

export default Profile;
