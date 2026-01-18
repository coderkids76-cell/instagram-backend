import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  
  // بيانات افتراضية (يمكنك جلبها من السيرفر لاحقاً)
  const [name, setName] = useState("Alex | UI/UX Designer");
  const [username, setUsername] = useState("alex_designs");
  const [bio, setBio] = useState("Creating clean & modern web experiences.");

  const handleSave = () => {
    // هنا سنرسل البيانات للسيرفر لاحقاً
    alert("Profile Saved Successfully! ✅");
    navigate("/profile"); // العودة للبروفايل
  };

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "white",
      minHeight: "100vh",
      fontFamily: "sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    },
    cancelBtn: {
      background: "none",
      border: "none",
      fontSize: "16px",
      cursor: "pointer",
    },
    saveBtn: {
      background: "none",
      border: "none",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#007aff",
      cursor: "pointer",
    },
    title: {
      fontWeight: "bold",
      fontSize: "18px",
    },
    profilePicSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "30px",
    },
    img: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        marginBottom: "10px",
        objectFit: "cover",
    },
    changePhotoText: {
        color: "#007aff",
        fontWeight: "600",
        fontSize: "14px",
        cursor: "pointer",
    },
    inputGroup: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        color: "#8e8e8e",
        marginBottom: "5px",
        fontSize: "13px",
    },
    input: {
        width: "100%",
        padding: "10px 0",
        border: "none",
        borderBottom: "1px solid #dbdbdb",
        fontSize: "16px",
        outline: "none",
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.cancelBtn} onClick={() => navigate("/profile")}>Cancel</button>
        <span style={styles.title}>Edit Profile</span>
        <button style={styles.saveBtn} onClick={handleSave}>Done</button>
      </div>

      {/* Change Photo */}
      <div style={styles.profilePicSection}>
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60" style={styles.img} />
        <span style={styles.changePhotoText}>Change Profile Photo</span>
      </div>

      {/* Inputs */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Name</label>
        <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Username</label>
        <input style={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Bio</label>
        <input style={styles.input} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
    </div>
  );
}

export default EditProfile;
