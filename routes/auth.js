import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs"; // ✅ نستخدم bcryptjs لأنه آمن ويعمل على Vercel

const router = express.Router();

// 🟢 تسجيل حساب جديد (Register)
router.post("/register", async (req, res) => {
  try {
      // 1. تشفير كلمة المرور
          const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(req.body.password, salt);

                  // 2. إنشاء مستخدم جديد
                      const newUser = new User({
                            username: req.body.username,
                                  email: req.body.email,
                                        password: hashedPassword,
                                            });

                                                // 3. حفظ المستخدم في قاعدة البيانات
                                                    const user = await newUser.save();
                                                        res.status(200).json(user);
                                                          } catch (err) {
                                                              console.error(err);
                                                                  res.status(500).json(err);
                                                                    }
                                                                    });

                                                                    // 🔵 تسجيل الدخول (Login)
                                                                    router.post("/login", async (req, res) => {
                                                                      try {
                                                                          // 1. البحث عن المستخدم بالإيميل
                                                                              const user = await User.findOne({ email: req.body.email });
                                                                                  if (!user) {
                                                                                          return res.status(404).json("User not found");
                                                                                              }

                                                                                                  // 2. التحقق من كلمة المرور
                                                                                                      const validPassword = await bcrypt.compare(req.body.password, user.password);
                                                                                                          if (!validPassword) {
                                                                                                                  return res.status(400).json("Wrong password");
                                                                                                                      }

                                                                                                                          // 3. إرجاع بيانات المستخدم (للتخزين في LocalStorage)
                                                                                                                              res.status(200).json(user);
                                                                                                                                } catch (err) {
                                                                                                                                    console.error(err);
                                                                                                                                        res.status(500).json(err);
                                                                                                                                          }
                                                                                                                                          });

                                                                                                                                          export default router;
                                                                                                                                          