import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

// إعداد المسارات
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// ✅ التأكد من الاتصال بقاعدة البيانات مع معالجة الأخطاء
connectDB().then(() => {
    console.log("Database Connected Successfully");
    }).catch((err) => {
        console.error("Database Connection Failed:", err);
        });

        const app = express();

        // ✅ التغيير الجذري هنا: origin: true
        // هذا يسمح لأي موقع بالاتصال (حل سحري لمشاكل Vercel المعقدة)
        app.use(cors({
          origin: true, 
            credentials: true, 
              methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                allowedHeaders: ["Content-Type", "Authorization"]
                }));

                // إعداد مجلد الصور
                app.use("/images", express.static(path.join(__dirname, "public/images")));

                app.use(helmet());
                app.use(express.json());
                app.use(morgan("dev"));

                // --- إعدادات رفع الصور ---
                const storage = multer.diskStorage({
                  destination: (req, file, cb) => {
                      cb(null, "public/images");
                        },
                          filename: (req, file, cb) => {
                              cb(null, req.body.name);
                                },
                                });

                                const upload = multer({ storage: storage });

                                app.post("/api/upload", upload.single("file"), (req, res) => {
                                  try {
                                      return res.status(200).json("File uploaded successfully");
                                        } catch (error) {
                                            console.error(error);
                                                return res.status(500).json(error);
                                                  }
                                                  });

                                                  // المسارات
                                                  app.use("/api/auth", authRoutes);
                                                  app.use("/api/posts", postRoutes);

                                                  // مسار تجريبي للتأكد أن السيرفر يعمل
                                                  app.get("/", (req, res) => {
                                                    res.status(200).json({ message: "Server is working properly!" });
                                                    });

                                                    const PORT = process.env.PORT || 3000;

                                                    app.listen(PORT, () => {
                                                      console.log(`Server started on port ${PORT}`);
                                                      });
                                                      