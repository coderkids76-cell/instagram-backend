// routes/stories.js
import express from "express";
import Story from "../models/Story.js";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const router = express.Router();

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

router.post("/", upload.single("img"), async (req, res) => {
  try {
    let imageUrl = "";

    // 1. إذا وصل الملف كملف حقيقي (FormData)
    if (req.file) {
      imageUrl = req.file.path;
    } 
    // 2. إذا وصل الملف كنص Base64 (كما يظهر في صورتك الأخيرة)
    else if (req.body.img) {
      const uploadRes = await cloudinary.uploader.upload(req.body.img, {
        folder: "nexo_stories",
      });
      imageUrl = uploadRes.secure_url;
    }

    if (!imageUrl) return res.status(400).json("لم يتم استلام صورة");

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
    console.error(err);
    res.status(500).json({ message: "خطأ في السيرفر أو Cloudinary", error: err.message });
  }
});

export default router;