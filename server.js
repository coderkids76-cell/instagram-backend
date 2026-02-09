import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";

// استيراد المسارات (Routes)
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import storyRoutes from "./routes/stories.js"; // 👈 تم الربط هنا لحل مشكلة الـ 404

dotenv.config();

// الاتصال بقاعدة البيانات MongoDB
connectDB(); // السجلات تظهر نجاح الاتصال

const app = express();

// --- إعدادات CORS الشاملة لربط Vercel بـ Koyeb ---
app.use(cors({
    origin: [
        "https://instagram-backend-esxi.vercel.app", // رابط موقعك الأساسي
        "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// إجابة فورية لطلبات OPTIONS (Preflight) لمنع أخطاء المتصفح
app.options("*", cors());

app.use(helmet({
    crossOriginResourcePolicy: false, // للسماح بتبادل الصور مع Cloudinary
}));

// السماح ببيانات كبيرة لرفع ملفات الميديا في Nexo
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(morgan("dev"));

// --- تعريف مسارات الـ API الأساسية ---
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes); // ✅ الآن السيرفر سيعرف مسار القصص

app.get("/", (req, res) => {
    res.send("🚀 Nexo Backend is Live and Ready!");
});

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
    console.error("💥 Server Error:", err.message);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// التشغيل على المنفذ المخصص من Koyeb
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});