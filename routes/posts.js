import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";

const router = express.Router();

// 1. إنشاء منشور
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) { res.status(500).json(err); }
});

// 2. تحديث منشور
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated");
    } else { res.status(403).json("You can update only your post"); }
  } catch (err) { res.status(500).json(err); }
});

// 3. حذف منشور
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted");
    } else { res.status(403).json("You can delete only your post"); }
  } catch (err) { res.status(500).json(err); }
});

// 4. لايك / ديسلايك
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post disliked");
    }
  } catch (err) { res.status(500).json(err); }
});

// 5. جلب منشور معين
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) { res.status(500).json(err); }
});

// 6. Timeline (للمتابعين)
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => { return Post.find({ userId: friendId }); })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) { res.status(500).json(err); }
});

// 7. منشورات مستخدم معين (للبروفايل)
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json("User not found");
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) { res.status(500).json(err); }
});

// 8. ✅✅✅ الكود الجديد: جلب منشورات عشوائية (Explore)
router.get("/explore/all", async (req, res) => {
  try {
    // يجلب 20 منشور بشكل عشوائي من كل قاعدة البيانات
    const randomPosts = await Post.aggregate([ { $sample: { size: 10 } } ]);
    res.status(200).json(randomPosts);
  } catch (err) { res.status(500).json(err); }
});

export default router;
