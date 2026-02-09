import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

dotenv.config();
connectDB(); // السجلات تؤكد نجاح الاتصال هنا

const app = express();

// --- 1. إعدادات CORS الشاملة (يجب أن تكون أول Middleware) ---
app.use(cors({
    origin: function (origin, callback) {
        // سيسمح هذا السطر لجميع روابط Vercel الخاصة بك بالاتصال
        if (!origin || origin.includes("vercel.app") || origin.includes("localhost")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// --- 2. معالجة طلبات OPTIONS يدوياً وبشكل فوري ---
app.options("*", (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
});

// --- 3. إعدادات الأمان (تعطيل ما قد يحجب الصور والطلبات) ---
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));

// --- 4. المسارات (Routes) ---
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("✅ Nexo API is Live and Connected!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`); // يعمل بنجاح
});