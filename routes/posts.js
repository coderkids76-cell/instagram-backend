import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// 1. إنشاء منشور جديد
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
            res.status(200).json(savedPost);
              } catch (err) {
                  res.status(500).json(err);
                    }
                    });

                    // 2. جلب جميع المنشورات (سنحتاجه للصفحة الرئيسية)
                    router.get("/timeline/all", async (req, res) => {
                      try {
                          const posts = await Post.find().sort({ createdAt: -1 }); // الأحدث أولاً
                              res.status(200).json(posts);
                                } catch (err) {
                                    res.status(500).json(err);
                                      }
                                      });

                                      export default router;
                                      