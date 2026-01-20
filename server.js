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
connectDB();

const app = express();

// ✅ إعدادات CORS الصحيحة (هذا هو الحل لمشكلتك)
// يسمح فقط للواجهة الخاصة بك بالاتصال
app.use(cors({
  origin: ["https://instagram-backend-esxi.vercel.app", "http://localhost:5173"], // رابط الواجهة + رابط التجربة المحلية
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // العمليات المسموحة
      credentials: true, // للسماح بمرور التوكن والكوكيز
        allowedHeaders: ["Content-Type", "Authorization"]
        }));

        // التأكد من قبول الطلبات التمهيدية (Pre-flight requests)
        app.options('*', cors());

        // إعداد مجلد الصور
        app.use("/images", express.static(path.join(__dirname, "public/images")));

        app.use(helmet());
        app.use(express.json());
        app.use(morgan("dev"));

        // --- إعدادات رفع الصور (Multer) ---
        // ⚠️ ملاحظة: الصور المرفوعة هنا ستختفي بعد فترة في Vercel لأنه لا يدعم تخزين الملفات الدائم
        // (لحل دائم لاحقاً يجب استخدام Cloudinary، لكن دعنا نصلح الاتصال أولاً)
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
                                      }
                                      });

                                      // المسارات
                                      app.use("/api/auth", authRoutes);
                                      app.use("/api/posts", postRoutes);

                                      app.get("/", (req, res) => {
                                        res.send("Instagram Backend is Running! 🚀");
                                        });

                                        const PORT = process.env.PORT || 3000;

                                        app.listen(PORT, () => {
                                          console.log(`Server started on port ${PORT}`);
                                          });
                                          