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
import userRoutes from "./routes/users.js"; // ✅ تأكد من وجود هذا الملف

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// ✅ إعداد CORS للسماح للواجهة بالاتصال
app.use(cors({
  origin: true,
    credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
        }));

        app.use(helmet());

        // ✅✅✅ الحل السحري: زيادة حجم البيانات المسموح به (للصور)
        app.use(express.json({ limit: "50mb" })); 
        app.use(express.urlencoded({ limit: "50mb", extended: true }));

        app.use(morgan("dev"));

        // المسارات
        app.use("/api/auth", authRoutes);
        app.use("/api/posts", postRoutes);
        app.use("/api/users", userRoutes); // ✅ مسار تعديل البروفايل

        app.get("/", (req, res) => {
          res.send("✅ Instagram Backend is Running!");
          });

          const PORT = process.env.PORT || 3000;
          app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
            });

            export default app;
            