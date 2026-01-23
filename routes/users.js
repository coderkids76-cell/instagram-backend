import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"; // ✅ استخدام المكتبة الآمنة

const router = express.Router();

// 1. تحديث بيانات المستخدم (Update User)
router.put("/:id", async (req, res) => {
  // التحقق من الصلاحية (هل هو صاحب الحساب؟)
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    
    // أ) تشفير كلمة المرور إذا تم تغييرها
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    // ب) التحقق من أن اليوزرنام غير مكرر
    if (req.body.username) {
        try {
            const existingUser = await User.findOne({ username: req.body.username });
            // إذا وجدنا مستخدماً بنفس الاسم، وله ID مختلف عن المستخدم الحالي
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({ message: "Username is already taken!" });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    // ج) تحديث البيانات في قاعدة البيانات
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body, // يقوم بتحديث كل الحقول المرسلة (name, desc, img...)
      }, { new: true }); // new: true ليرجع البيانات الجديدة بعد التحديث
      
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

// 2. حذف المستخدم (Delete User)
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

// 3. جلب بيانات مستخدم (Get User)
// يعمل بطريقتين: إما بالـ ID أو بالـ Username
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    
    if (!user) return res.status(404).json("User not found");

    // إخفاء كلمة المرور وتاريخ التحديث قبل إرسال البيانات
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. متابعة مستخدم (Follow User)
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) { // لا يمكن متابعة نفسك
    try {
      const user = await User.findById(req.params.id); // الشخص الذي نريد متابعته
      const currentUser = await User.findById(req.body.userId); // أنا

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant follow yourself");
  }
});

// 5. إلغاء المتابعة (Unfollow User)
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You cant unfollow yourself");
  }
});

// 6. جلب قائمة الأصدقاء (Friends) - اختياري لكن مفيد للمستقبل
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});
// 7. البحث عن مستخدمين (Search Users)
router.get("/search/:query", async (req, res) => {
  const query = req.params.query;
    try {
        // يبحث عن أي مستخدم يحتوي اسمه أو اليوزرنام على النص المكتوب (غير حساس لحالة الأحرف)
            const users = await User.find({
                  $or: [
                          { username: { $regex: query, $options: "i" } },
                                  { name: { $regex: query, $options: "i" } }
                                        ]
                                            }).limit(10); // نكتفي بأول 10 نتائج
                                                
                                                    res.status(200).json(users);
                                                      } catch (err) {
                                                          res.status(500).json(err);
                                                            }
                                                            });
                                                            

export default router;
