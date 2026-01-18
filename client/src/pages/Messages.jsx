import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// --- أيقونات SVG (مطابقة للتصميم الأصلي) ---
const Icons = {
  Back: () => <svg aria-label="Atrás" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" transform="rotate(-90 12 12)"></path></svg>,
  Phone: () => <svg aria-label="Llamada de audio" color="currentColor" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M11.401 15.353a16.03 16.03 0 0 0 6.633-2.748 11.233 11.233 0 0 0 3.73-4.636 1.002 1.002 0 0 0-.256-1.127l-2.73-2.729a1.001 1.001 0 0 0-1.295-.107 13.918 13.918 0 0 1-2.936 1.365 1.001 1.001 0 0 0-.613.896l-.15 2.1a27.273 27.273 0 0 1-5.112 0l-.152-2.1a1.001 1.001 0 0 0-.613-.896 13.928 13.928 0 0 1-2.936-1.365 1.001 1.001 0 0 0-1.295.107L.946 6.843a1.002 1.002 0 0 0-.256 1.127 11.233 11.233 0 0 0 3.73 4.636 16.03 16.03 0 0 0 6.633 2.748 1.002 1.002 0 0 0 .348 0Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>,
  Video: () => <svg aria-label="Videollamada" color="currentColor" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24"><rect height="18" rx="3" ry="3" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" width="14.25" x="1.753" y="2.998"></rect><path d="M19.006 6.745a1.003 1.003 0 0 1 1.246-.922 17.52 17.52 0 0 1 0 12.35 1.003 1.003 0 0 1-1.246-.922l-1.92-5.253Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>,
  Verified: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095f6"><path d="M22.072 10.368L22.952 7.728C23.088 7.32 22.848 6.912 22.44 6.816L19.728 6.168C19.56 6.12 19.416 5.976 19.368 5.808L18.72 3.096C18.624 2.688 18.216 2.448 17.808 2.592L15.168 3.472C15 3.528 14.808 3.528 14.664 3.384L12.792 1.512C12.504 1.224 12.024 1.224 11.736 1.512L9.864 3.384C9.72 3.528 9.528 3.528 9.36 3.472L6.72 2.592C6.312 2.448 5.904 2.688 5.808 3.096L5.16 5.808C5.112 5.976 4.968 6.12 4.8 6.168L2.088 6.816C1.68 6.912 1.44 7.32 1.584 7.728L2.464 10.368C2.52 10.536 2.52 10.728 2.464 10.896L1.584 13.536C1.44 13.944 1.68 14.352 2.088 14.448L4.8 15.096C4.968 15.144 5.112 15.288 5.16 15.456L5.808 18.168C5.904 18.576 6.312 18.816 6.72 18.672L9.36 17.792C9.528 17.736 9.72 17.736 9.864 17.88L11.736 19.752C12.024 20.04 12.504 20.04 12.792 19.752L14.664 17.88C14.808 17.736 15 17.736 15.168 17.792L17.808 18.672C18.216 18.816 18.624 18.576 18.72 18.168L19.368 15.456C19.416 15.288 19.56 15.144 19.728 15.096L22.44 14.448C22.848 14.352 23.088 13.944 22.952 13.536L22.072 10.896C22.016 10.728 22.016 10.536 22.072 10.368ZM10.416 14.736L7.056 11.376C6.84 11.16 6.84 10.8 7.056 10.584C7.272 10.368 7.632 10.368 7.848 10.584L10.8 13.536L16.632 7.704C16.848 7.488 17.208 7.488 17.424 7.704C17.64 7.92 17.64 8.28 17.424 8.496L11.208 14.736C10.992 14.952 10.632 14.952 10.416 14.736Z"></path></svg>,
  
  // Footer Icons
  CameraWhite: () => <svg aria-label="Cámara" color="white" fill="currentColor" height="22" role="img" viewBox="0 0 24 24" width="22"><path d="M12.003 22.003a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Zm0-18a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8Zm0 13.5a5.5 5.5 0 1 1 5.5-5.5 5.506 5.506 0 0 1-5.5 5.5Zm0-9a3.5 3.5 0 1 0 3.5 3.5 3.504 3.504 0 0 0-3.5-3.5Z"></path></svg>,
  Mic: () => <svg aria-label="Mensaje de voz" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M19.5 10.671v.566a7.5 7.5 0 0 1-15 0v-.566a.75.75 0 0 1 1.5 0v.566a6 6 0 0 0 12 0v-.566a.75.75 0 0 1 1.5 0Z"></path><path d="M12 17a4 4 0 0 1-4-4V5a4 4 0 0 1 8 0v8a4 4 0 0 1-4 4Zm0-14.5a2.5 2.5 0 0 0-2.5 2.5v8a2.5 2.5 0 0 0 5 0V5a2.5 2.5 0 0 0-2.5-2.5Z"></path><path d="M12 22a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1Z"></path></svg>,
  Gallery: () => <svg aria-label="Elegir contenido multimedia" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M22 17.003a5.006 5.006 0 0 1-5 5h-10a5.006 5.006 0 0 1-5-5v-10a5.006 5.006 0 0 1 5-5h10a5.006 5.006 0 0 1 5 5ZM6.503 20.503h11a3.504 3.504 0 0 0 3.5-3.5v-2.316l-3.327-2.923a1.534 1.534 0 0 0-2.227.2l-3.236 3.992-1.927-1.127a1.535 1.535 0 0 0-1.896.257l-3.4 3.125a3.5 3.5 0 0 0 1.513 2.292Zm14-11.5v-2a3.504 3.504 0 0 0-3.5-3.5h-10a3.504 3.504 0 0 0-3.5 3.5v7.889l3.525-3.239a.034.034 0 0 1 .042-.006l2.913 1.704 3.755-4.632a.034.034 0 0 1 .05-.004l4.215 3.702V9.003Z"></path><circle cx="16.503" cy="7.503" r="2.25"></circle></svg>,
  Sticker: () => <svg aria-label="Stickers" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 22.003a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Zm0-18.5a8.5 8.5 0 1 0 8.5 8.5 8.51 8.51 0 0 0-8.5-8.5Z"></path><path d="M16.503 12.003a1 1 0 1 1 1-1 1.001 1.001 0 0 1-1 1Zm-9 0a1 1 0 1 1 1-1 1.001 1.001 0 0 1-1 1Zm4.5 4.5a3.504 3.504 0 0 1-3.5-3.5 1 1 0 0 1 2 0 1.5 1.5 0 0 0 3 0 1 1 0 0 1 2 0 3.504 3.504 0 0 1-3.5 3.5Z"></path></svg>,
  Plus: () => <svg aria-label="Ver más" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M12.003 22.003a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Zm0-18.5a8.5 8.5 0 1 0 8.5 8.5 8.51 8.51 0 0 0-8.5-8.5Z"></path><path d="M17.003 12.753h-4.25v4.25a.75.75 0 0 1-1.5 0v-4.25h-4.25a.75.75 0 0 1 0-1.5h4.25v-4.25a.75.75 0 0 1 1.5 0v4.25h4.25a.75.75 0 0 1 0 1.5Z"></path></svg>,
  
  // Call Controls
  EndCall: () => <svg width="36" height="36" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" fill="#ff3b30"></path></svg>,
  MicOff: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0.5"><line x1="1" y1="1" x2="23" y2="23" stroke="white" strokeWidth="2" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  MicOn: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 2.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>,
  VideoOn: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>,
  VideoOff: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0.5"><line x1="2" y1="2" x2="22" y2="22" stroke="white" strokeWidth="2"/><path d="M19 6.8v.02M19 13.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1H7.8L19 17.2V13.5z"/></svg>
};

function Messages() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // --- States ---
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  
  // Call States
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState("audio"); // 'audio' | 'video'
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  // User Data
  const chatUser = {
    name: "gizemtufekcipiskin",
    fullName: "gizemtufekcipiskin",
    category: "Chat empresarial",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    followers: "569 mil",
    posts: "1635"
  };

  // --- Load/Save Messages ---
  useEffect(() => {
    const savedMsgs = localStorage.getItem("chat_db");
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_db", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- Actions ---
  const handleSendMessage = (type = "text", content = inputText) => {
    if (!content && type === "text") return;
    const newMsg = {
      id: Date.now(),
      type, content, isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInputText("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video") ? "video" : "image";
      handleSendMessage(type, url);
    }
  };

  // --- Call Logic ---
  const startCall = (type) => {
    setCallType(type);
    setIsVideoEnabled(type === "video");
    setIsMuted(false);
    setIsCalling(true);
  };

  const endCall = () => {
    setIsCalling(false);
    setIsMuted(false);
    setIsVideoEnabled(false);
  };

  // --- Styles ---
  const styles = {
    container: {
      background: "#fff", height: "100vh", display: "flex", flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative", overflow: "hidden"
    },
    // Header
    header: {
      padding: "10px 15px", display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: "1px solid #efefef", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", zIndex: 10
    },
    headerUser: { display: "flex", alignItems: "center", gap: "10px" },
    headerAvatar: { width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" },
    headerInfo: { display: "flex", flexDirection: "column" },
    headerName: { fontWeight: "700", fontSize: "16px", display: "flex", alignItems: "center", gap: "4px" },
    headerSub: { fontSize: "12px", color: "#8e8e8e" },
    headerIcons: { display: "flex", gap: "24px", color: "#000", paddingRight: "5px" },

    // Chat
    chatArea: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", background: "white" },
    
    // Profile Card (Top of chat)
    profileCard: {
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        padding: "40px 20px 20px 20px"
    },
    bigAvatar: { width: "100px", height: "100px", borderRadius: "50%", marginBottom: "15px", objectFit: "cover" },
    bigName: { fontSize: "20px", fontWeight: "700", display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" },
    stats: { fontSize: "14px", color: "#262626" },
    subText: { fontSize: "13px", color: "#8e8e8e", marginTop: "5px" },
    viewBtn: { 
        background: "#efefef", padding: "8px 16px", borderRadius: "8px", 
        fontSize: "14px", fontWeight: "600", marginTop: "15px", cursor: "pointer"
    },
    infoText: { fontSize: "12px", color: "#8e8e8e", marginTop: "20px", maxWidth: "85%", lineHeight: "1.4" },

    // Messages
    msgRow: { display: "flex", marginBottom: "8px", padding: "0 15px", width: "100%" },
    myMsg: { justifyContent: "flex-end" },
    otherMsg: { justifyContent: "flex-start" },
    textBubble: {
        padding: "10px 16px", borderRadius: "22px", fontSize: "15px", lineHeight: "1.4", maxWidth: "75%", wordWrap: "break-word"
    },
    myBubbleColor: { background: "#0095f6", color: "white", borderBottomRightRadius: "4px" },
    otherBubbleColor: { background: "#efefef", color: "black", borderBottomLeftRadius: "4px" },
    mediaImg: { maxWidth: "70%", borderRadius: "20px", display: "block" }, // No Border

    // Footer (Instagram Style)
    footer: {
      padding: "10px 15px", display: "flex", alignItems: "center", gap: "10px",
      borderTop: "1px solid #efefef", background: "white",
      paddingBottom: "max(10px, env(safe-area-inset-bottom))"
    },
    cameraBtn: {
        background: "#0095f6", width: "40px", height: "40px", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0
    },
    inputWrapper: {
        flex: 1, background: "#efefef", borderRadius: "22px", height: "44px",
        display: "flex", alignItems: "center", padding: "0 15px"
    },
    input: {
        width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "15px", color: "black"
    },
    footerIcons: { display: "flex", gap: "12px", alignItems: "center", color: "#262626", marginLeft: "5px" },
    sendLink: { color: "#0095f6", fontWeight: "600", cursor: "pointer", marginLeft: "10px" },

    // Call Screen (Full Screen & Fixed)
    callScreen: {
        position: "fixed", inset: 0, zIndex: 100,
        background: "#202020", // Dark gray background
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        padding: "80px 30px 60px 30px"
    },
    callAvatarImg: { width: "100px", height: "100px", borderRadius: "50%", marginBottom: "20px" },
    callNameText: { color: "white", fontSize: "22px", fontWeight: "700", marginBottom: "8px" },
    callStatusText: { color: "#aaaaaa", fontSize: "14px" },
    
    callButtonsRow: { display: "flex", gap: "30px", alignItems: "center" },
    controlBtn: {
        width: "60px", height: "60px", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        backdropFilter: "blur(10px)", transition: "0.2s"
    },
    hangupBtn: {
        width: "70px", height: "70px", borderRadius: "50%", background: "#ff3b30",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        boxShadow: "0 4px 12px rgba(255, 59, 48, 0.4)"
    }
  };

  // Helper to get button style based on state
  const getBtnStyle = (active) => ({
      ...styles.controlBtn,
      background: active ? "white" : "rgba(255,255,255,0.15)",
      color: active ? "black" : "white"
  });

  return (
    <div style={styles.container}>
      
      {/* 1. Header */}
      <div style={styles.header}>
        <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
            <div onClick={() => navigate("/home")} style={{cursor: "pointer"}}><Icons.Back /></div>
            <div style={styles.headerUser}>
                <img src={chatUser.img} style={styles.headerAvatar} alt="user" />
                <div style={styles.headerInfo}>
                    <div style={styles.headerName}>{chatUser.name} <Icons.Verified /></div>
                    <div style={styles.headerSub}>{chatUser.category}</div>
                </div>
            </div>
        </div>
        <div style={styles.headerIcons}>
            <div onClick={() => startCall("audio")} style={{cursor:"pointer"}}><Icons.Phone /></div>
            <div onClick={() => startCall("video")} style={{cursor:"pointer"}}><Icons.Video /></div>
        </div>
      </div>

      {/* 2. Messages List */}
      <div style={styles.chatArea}>
        {/* Profile Info at top */}
        <div style={styles.profileCard}>
            <img src={chatUser.img} style={styles.bigAvatar} />
            <div style={styles.bigName}>{chatUser.fullName} <Icons.Verified /></div>
            <div style={styles.stats}>{chatUser.followers} seguidores · {chatUser.posts} publicaciones</div>
            <div style={styles.subText}>No os seguís mutuamente en Instagram</div>
            <div style={styles.viewBtn}>Ver perfil</div>
            <div style={styles.infoText}>{chatUser.bio} <span style={{color:"#0095f6"}}>Obtener información sobre los chats empresariales y tu privacidad.</span></div>
        </div>

        {/* Bubble Messages */}
        {messages.map((msg) => (
            <div key={msg.id} style={{...styles.msgRow, ...(msg.isMe ? styles.myMsg : styles.otherMsg)}}>
                
                {/* Text Message */}
                {msg.type === "text" && (
                    <div style={{...styles.textBubble, ...(msg.isMe ? styles.myBubbleColor : styles.otherBubbleColor)}}>
                        {msg.content}
                    </div>
                )}

                {/* Media Message */}
                {(msg.type === "image" || msg.type === "video") && (
                    msg.type === "image" 
                    ? <img src={msg.content} style={styles.mediaImg} alt="media" />
                    : <video src={msg.content} style={styles.mediaImg} controls />
                )}
            </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Footer Input */}
      <div style={styles.footer}>
        <div style={styles.cameraBtn} onClick={() => fileInputRef.current.click()}>
            <Icons.CameraWhite />
        </div>
        
        <div style={styles.inputWrapper}>
            <input 
                type="text" style={styles.input} placeholder="Envía un mensaje..."
                value={inputText} onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
        </div>

        {inputText ? (
            <div style={styles.sendLink} onClick={() => handleSendMessage()}>Enviar</div>
        ) : (
            <div style={styles.footerIcons}>
                <div style={{cursor:"pointer"}}><Icons.Mic /></div>
                <div onClick={() => fileInputRef.current.click()} style={{cursor:"pointer"}}><Icons.Gallery /></div>
                <Icons.Sticker />
                <Icons.Plus />
            </div>
        )}
        <input type="file" ref={fileInputRef} style={{display: "none"}} accept="image/*,video/*" onChange={handleFileUpload} />
      </div>

      {/* 4. Call Overlay */}
      {isCalling && (
          <div style={styles.callScreen}>
              <div style={{textAlign: "center"}}>
                  <img src={chatUser.img} style={styles.callAvatarImg} />
                  <div style={styles.callNameText}>{chatUser.name}</div>
                  <div style={styles.callStatusText}>
                      {isMuted ? "Silenciado" : (isVideoEnabled ? "Videollamada de Instagram..." : "Llamando...")}
                  </div>
              </div>
              
              <div style={styles.callButtonsRow}>
                  {/* Mute Button */}
                  <div style={getBtnStyle(isMuted)} onClick={() => setIsMuted(!isMuted)}>
                      {isMuted ? <Icons.MicOff /> : <Icons.MicOn />}
                  </div>
                  
                  {/* End Call */}
                  <div style={styles.hangupBtn} onClick={endCall}>
                      <Icons.EndCall />
                  </div>
                  
                  {/* Toggle Video */}
                  <div style={getBtnStyle(isVideoEnabled)} onClick={() => {
                      setIsVideoEnabled(!isVideoEnabled);
                      setCallType(isVideoEnabled ? "audio" : "video");
                  }}>
                      {isVideoEnabled ? <Icons.VideoOn /> : <Icons.VideoOff />}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}

export default Messages;
