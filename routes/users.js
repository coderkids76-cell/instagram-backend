import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// تحديث بيانات المستخدم
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
      
          // 1. إذا كان يريد تغيير كلمة المرور
              if (req.body.password) {
                    try {
                            const salt = await bcrypt.genSalt(10);
                                    req.body.password = await bcrypt.hash(req.body.password, salt);
                                          } catch (err) {
                                                  return res.status(500).json(err);
                                                        }
                                                            }

                                                                // 2. التحقق من تكرار اسم المستخدم (Username)
                                                                    if (req.body.username) {
                                                                            const existingUser = await User.findOne({ username: req.body.username });
                                                                                    // إذا وجدنا مستخدماً بنفس الاسم، وهو ليس نفس الشخص الذي يقوم بالتعديل
                                                                                            if (existingUser && existingUser._id.toString() !== req.params.id) {
                                                                                                        return res.status(500).json({ message: "Username is already taken!" });
                                                                                                                }
                                                                                                                    }

                                                                                                                        try {
                                                                                                                              // 3. تحديث البيانات
                                                                                                                                    const user = await User.findByIdAndUpdate(req.params.id, {
                                                                                                                                            $set: req.body,
                                                                                                                                                  }, { new: true }); // new: true ليرجع البيانات الجديدة
                                                                                                                                                        
                                                                                                                                                              res.status(200).json(user);
                                                                                                                                                                  } catch (err) {
                                                                                                                                                                        return res.status(500).json(err);
                                                                                                                                                                            }
                                                                                                                                                                              } else {
                                                                                                                                                                                  return res.status(403).json("You can update only your account!");
                                                                                                                                                                                    }
                                                                                                                                                                                    });

                                                                                                                                                                                    // جلب مستخدم (لصفحة البروفايل)
                                                                                                                                                                                    router.get("/", async (req, res) => {
                                                                                                                                                                                      const userId = req.query.userId;
                                                                                                                                                                                        const username = req.query.username;
                                                                                                                                                                                          try {
                                                                                                                                                                                              const user = userId
                                                                                                                                                                                                    ? await User.findById(userId)
                                                                                                                                                                                                          : await User.findOne({ username: username });
                                                                                                                                                                                                              const { password, updatedAt, ...other } = user._doc;
                                                                                                                                                                                                                  res.status(200).json(other);
                                                                                                                                                                                                                    } catch (err) {
                                                                                                                                                                                                                        res.status(500).json(err);
                                                                                                                                                                                                                          }
                                                                                                                                                                                                                          });

                                                                                                                                                                                                                          export default router;
                                                                                                                                                                                                                          