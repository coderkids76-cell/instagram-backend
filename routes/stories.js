import express from "express";
import Story from "../models/Story.js";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const router = express.Router();

// إعدادات Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'nexo_stories', allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'] },
});

const upload = multer({ storage: storage });

// رفع ستوري جديد
router.post("/", upload.single("img"), async (req, res) => {
  try {
    let imageUrl = "";

    // 1. إذا تم رفع ملف حقيقي عبر Multer
    if (req.file) {
      imageUrl = req.file.path;
    } 
    // 2. إذا كانت الصورة مرسلة كـ Base64 (للتوافق مع الكود القديم)
    else if (req.body.img && req.body.img.includes("base64")) {
      const uploadRes = await cloudinary.uploader.upload(req.body.img, { folder: "nexo_stories" });
      imageUrl = uploadRes.secure_url;
    }

    if (!imageUrl) return res.status(400).json("لم يتم استلام أي صورة للرفع");

    const newStory = new Story({
      userId: req.body.userId,
      img: imageUrl,
      type: req.body.type || "image",
      text: req.body.text,
      music: req.body.music
    });

    const savedStory = await newStory.save();
    res.status(200).json(savedStory);
  } catch (err) {
    console.error("Cloudinary Error:", err);
    // إرسال تفاصيل الخطأ للمتصفح بدلاً من 500 غامضة
    res.status(500).json({ message: "فشل الرفع لـ Cloudinary", error: err.message });
  }
});

// جلب التايم لاين (بقية الكود الخاص بك...)
export default router;