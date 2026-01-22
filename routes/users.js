import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"; 

const router = express.Router();

// تحديث المستخدم
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    // التحقق من تكرار اليوزرنام
    if (req.body.username) {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
            return res.status(500).json({ message: "Username is already taken!" });
        }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body, // سيقوم بتحديث كل الحقول المرسلة بما فيها name و desc
      }, { new: true }); 
      
      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

// جلب المستخدم
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    
    if (!user) return res.status(404).json("User not found");
    
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
