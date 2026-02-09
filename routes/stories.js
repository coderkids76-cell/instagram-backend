import express from "express";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const router = express.Router();

// --- إعدادات Cloudinary (تستخدم نفس إعدادات Koyeb التي ضبطناها للمنشورات) ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// إعداد مخزن خاص بالقصص في Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nexo_stories', // مجلد منفصل للقصص
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'], // أضفنا mp4 لدعم قصص الفيديو
  },
});

const upload = multer({ storage: storage });

// 1. رفع ستوري جديد (معدل لدعم Cloudinary)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const newStoryData = {
      userId: req.body.userId,
      text: req.body.text,
      type: req.body.type,
      music: req.body.music,
      location: req.body.location,
    };

    // إذا قام المستخدم برفع ملف (صورة أو فيديو)، نأخذ الرابط من Cloudinary
    if (req.file) {
      newStoryData.img = req.file.path;
    }

    const newStory = new Story(newStoryData);
    const savedStory = await newStory.save();
    res.status(200).json(savedStory);
  } catch (err) {
    console.error("Story Upload Error:", err);
    res.status(500).json("فشل رفع الستوري، تأكد من حجم الملف");
  }
});

// 2. جلب ستوري التايم لاين (Timeline Stories)
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userStories = await Story.find({ userId: currentUser._id });
    const friendStories = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Story.find({ userId: friendId });
      })
    );
    // دمج القصص وإرجاعها
    res.status(200).json(userStories.concat(...friendStories));
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;