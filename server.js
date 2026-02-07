import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// الاتصال بقاعدة البيانات مع إضافة تسجيل للأخطاء للمساعدة في Koyeb Logs
connectDB();

const app = express();

// --- إعدادات CORS المحدثة لربط Vercel بـ Koyeb ---
app.use(cors({
    // استبدل هذا الرابط برابط الـ Frontend الخاص بك على Vercel
    origin: "https://instagram-backend-esxi.vercel.app", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet());

// السماح ببيانات كبيرة لرفع صور تطبيق Nexo
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(morgan("dev"));

// تعريف المسارات الأساسية
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// رسالة التأكد من تشغيل السيرفر
app.get("/", (req, res) => {
    res.send("✅ Instagram Backend (Nexo) is Running on Koyeb!");
});

// معالج الأخطاء العام لمساعدتك في اكتشاف المشاكل من Logs المنصة
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// استخدام المنفذ الذي توفره Koyeb تلقائياً
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});

export default app;