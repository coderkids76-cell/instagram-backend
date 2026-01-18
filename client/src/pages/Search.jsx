import { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- أيقونات SVG حديثة ونظيفة ---
const ModernIcons = {
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#004080', opacity: 0.7}}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
};

const BottomIcons = {
  Home: () => <svg aria-label="Home" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>,
  Search: () => <svg aria-label="Search" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" x1="16.511" x2="21.643" y1="16.511" y2="21.643"></line></svg>,
  Plus: () => <svg aria-label="New Post" fill="none" height="24" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" width="24"><line x1="12" x2="12" y1="5" y2="19"></line><line x1="5" x2="19" y1="12" y2="12"></line></svg>,
  Reels: () => <svg aria-label="Reels" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.022 2.155 0 3.991-.009 4.614-.009ZM2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2c-1.689 0-3.151.253-4.328.675l2.647 4.965h4.283c.516.29.833.81.833 1.385v5.474c0 .828-.672 1.5-1.5 1.5H6.617c-.828 0-1.5-.672-1.5-1.5V9.025c0-.575.317-1.095.833-1.385h1.233l-2.05-3.839A8.15 8.15 0 0 0 2 8.552v3.449Z"></path></svg>,
};

function Search() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const exploreImages = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    img: `https://source.unsplash.com/random/400x${i % 3 === 0 ? 600 : 400}?sig=${i + 100}`,
  }));

  const tags = ["Travel", "Architecture", "Decor", "Art", "Food", "Style", "Music", "DIY"];

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
  };

  const styles = {
    container: {
      background: "linear-gradient(135deg, #f0f8ff 0%, #e6f0ff 50%, #f5faff 100%)",
      minHeight: "100vh",
      paddingBottom: "60px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    searchHeader: {
        ...glassStyle,
        position: "sticky",
        top: 0,
        zIndex: 10,
        padding: "10px 16px 15px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.3)",
        borderRadius: "0 0 24px 24px", 
    },
    searchBar: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)", 
        borderRadius: "16px",
        padding: "10px 14px",
        gap: "10px",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)", 
    },
    input: {
        border: "none",
        backgroundColor: "transparent",
        width: "100%",
        fontSize: "15px",
        outline: "none",
        color: "#004080",
        fontWeight: "500",
    },
    tagsContainer: {
        display: "flex",
        gap: "8px",
        paddingTop: "12px",
        overflowX: "auto",
        scrollbarWidth: "none",
    },
    tag: {
        ...glassStyle,
        padding: "6px 18px",
        borderRadius: "20px",
        fontWeight: "600",
        fontSize: "13px",
        whiteSpace: "nowrap",
        color: "#005bb5", 
        cursor: "pointer",
        background: "rgba(255, 255, 255, 0.4)", 
    },
    masonryGrid: {
        columnCount: 3, 
        columnGap: "6px",
        padding: "10px 8px",
    },
    gridItem: {
        marginBottom: "6px",
        breakInside: "avoid",
        overflow: "hidden",
        borderRadius: "12px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "relative",
    },
    image: {
        width: "100%",
        height: "auto",
        display: "block",
    },
    bottomNav: {
      position: "fixed",
      bottom: 0,
      width: "100%",
      height: "60px",
      backgroundColor: "rgba(255, 255, 255, 0.8)", 
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.5)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      zIndex: 100,
      paddingBottom: "4px",
      borderRadius: "20px 20px 0 0",
      boxShadow: "0 -4px 12px rgba(0, 122, 255, 0.1)",
      color: "#007aff",
    },
    profileIcon: {
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        overflow: "hidden",
        cursor: "pointer",
        border: "2px solid #007aff",
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Search Header */}
      <div style={styles.searchHeader}>
        <div style={styles.searchBar}>
            <ModernIcons.Search />
            <input 
                type="text" 
                placeholder="Search everything..." 
                style={styles.input}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
        </div>
        <div style={styles.tagsContainer}>
            {tags.map((tag, i) => (
                <div key={i} style={styles.tag}>{tag}</div>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div style={styles.masonryGrid}>
        {exploreImages.map((item) => (
            <div key={item.id} style={styles.gridItem}>
                <img src={item.img} style={styles.image} alt="explore" />
            </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={styles.bottomNav}>
        <div onClick={() => navigate("/home")} style={{cursor: "pointer", color: "#8e8e8e"}}><BottomIcons.Home /></div>
        
        <div style={{color: "#007aff"}}><BottomIcons.Search /></div>
        
        <div 
            style={{backgroundColor: '#007aff', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', boxShadow: '0 4px 10px rgba(0, 122, 255, 0.4)', cursor: "pointer"}}
            onClick={() => navigate("/create")} 
        >
            <BottomIcons.Plus />
        </div>
        
        {/* ✅ الإصلاح: إضافة onClick للذهاب إلى الريلز */}
        <div onClick={() => navigate("/reels")} style={{cursor: "pointer", color: "#8e8e8e"}}>
            <BottomIcons.Reels />
        </div>
        
        <div 
            style={{...styles.profileIcon, border: "none"}}
            onClick={() => navigate("/profile")}
        >
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60" style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="profile" />
        </div>
      </div>

    </div>
  );
}

export default Search;
