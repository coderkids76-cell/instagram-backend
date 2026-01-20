import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer"; // 1. مكتبة رفع الصور
import path from "path";
import { fileURLToPath } from "url"; // ضروري للتعامل مع المسارات في ES6
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

// إعداد المسارات (لأننا نستخدم type: module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// إعداد مجلد الصور ليكون عاماً ويمكن الوصول إليه
// أي صورة توضع في public/images يمكن رؤيتها عبر الرابط /images/filename.png
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- إعدادات رفع الصور (Multer) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      // تحديد مكان الحفظ
          cb(null, "public/images");
            },
              filename: (req, file, cb) => {
                  // تحديد اسم الملف (نأخذه من البيانات القادمة من الواجهة)
                      cb(null, req.body.name);
                        },
                        });

                        const upload = multer({ storage: storage });

                        // رابط رفع الصور
                        app.post("/api/upload", upload.single("file"), (req, res) => {
                          try {
                              return res.status(200).json("File uploaded successfully");
                                } catch (error) {
                                    console.error(error);
                                      }
                                      });
                                      // ------------------------------------

                                      // المسارات الأساسية
                                      app.use("/api/auth", authRoutes);
                                      app.use("/api/posts", postRoutes);

                                      app.get("/", (req, res) => {
                                        res.send("Instagram Backend is Running! 🚀");
                                        });

                                        const PORT = process.env.PORT || 3000;

                                        app.listen(PORT, () => {
                                          console.log(`Server started on port ${PORT}`);
                                          });
                                          