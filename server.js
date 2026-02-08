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
connectDB();

const app = express();

// --- إعدادات CORS الشاملة لمنع خطأ ERR_FAILED ---
app.use(cors({
    origin: [
            "https://instagram-backend-esxi.vercel.app", // رابط Vercel الخاص بك
                    "http://localhost:5173",                     // للتطوير المحلي
                            "http://localhost:3000"
                                ],
                                    credentials: true,
                                        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                                            allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
                                            }));

                                            // إجابة صريحة لطلبات OPTIONS قبل معالجة أي مسارات أخرى
                                            app.options("*", cors());

                                            app.use(helmet({
                                                crossOriginResourcePolicy: false, // للسماح بظهور الصور في Vercel
                                                }));

                                                app.use(express.json({ limit: "50mb" })); 
                                                app.use(express.urlencoded({ limit: "50mb", extended: true }));
                                                app.use(morgan("dev"));

                                                // المسارات الأساسية
                                                app.use("/api/auth", authRoutes);
                                                app.use("/api/posts", postRoutes);
                                                app.use("/api/users", userRoutes);

                                                app.get("/", (req, res) => {
                                                    res.send("✅ Nexo Backend is Live and Connected to MongoDB!");
                                                    });

                                                    const PORT = process.env.PORT || 8000;
                                                    app.listen(PORT, () => {
                                                        console.log(`🚀 Server running on port ${PORT}`);
                                                        });
                                                        