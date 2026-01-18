const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// تسجيل مستخدم جديد
exports.registerUser = async (req, res) => {
  try {
      const { username, email, password } = req.body;
          const userExists = await User.findOne({ email });
              if (userExists) return res.status(400).json({ message: "Email already exists!" });

                  const salt = await bcrypt.genSalt(10);
                      const hashedPassword = await bcrypt.hash(password, salt);

                          const newUser = new User({ username, email, password: hashedPassword });
                              await newUser.save();

                                  res.status(201).json({ message: "User registered successfully! 🎉" });
                                    } catch (error) {
                                        res.status(500).json({ error: error.message });
                                          }
                                          };

                                          // تسجيل الدخول (الجديد)
                                          exports.loginUser = async (req, res) => {
                                            try {
                                                const { email, password } = req.body;
                                                    
                                                        // 1. البحث عن المستخدم
                                                            const user = await User.findOne({ email });
                                                                if (!user) return res.status(404).json({ message: "User not found!" });

                                                                    // 2. التأكد من كلمة المرور
                                                                        const validPassword = await bcrypt.compare(password, user.password);
                                                                            if (!validPassword) return res.status(400).json({ message: "Wrong password!" });

                                                                                // 3. إنشاء تذكرة الدخول (Token)
                                                                                    const token = jwt.sign({ id: user._id }, "mySecretKey123", { expiresIn: "5d" });

                                                                                        res.status(200).json({ message: "Login Successful! 🔓", token, user });
                                                                                          } catch (error) {
                                                                                              res.status(500).json({ error: error.message });
                                                                                                }
                                                                                                };
                                                                                                