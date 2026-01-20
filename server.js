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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// ✅ إعدادات CORS
app.use(cors({
  origin: true,
    credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
        }));

        // مجلد الصور (لن نعتمد عليه في الرفع بعد الآن، لكن نتركه للعرض)
        app.use("/images", express.static(path.join(__dirname, "public/images")));

        app.use(helmet());

        // ✅✅✅ زيادة حجم البيانات المسموح به لرفع الصور كـ Base64
        app.use(express.json({ limit: "50mb" })); 
        app.use(express.urlencoded({ limit: "50mb", extended: true }));

        app.use(morgan("dev"));

        // (تم إزالة كود Multer لأننا لن نستخدمه في الرفع بعد الآن)

        // المسارات
        app.use("/api/auth", authRoutes);
        app.use("/api/posts", postRoutes);

        app.get("/", (req, res) => {
          res.send("✅ Instagram Backend is Running!");
          });

          const PORT = process.env.PORT || 3000;
          app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
            });

            export default app;
            