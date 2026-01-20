import User from "../models/User.js"; // تأكدنا من وجود .js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// تسجيل مستخدم جديد (Register)
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // التحقق هل البريد موجود مسبقاً
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists!" });

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء المستخدم الجديد
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully! 🎉" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تسجيل الدخول (Login)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. البحث عن المستخدم
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    // 2. التأكد من كلمة المرور
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Wrong password!" });

    // 3. إنشاء تذكرة الدخول (Token)
    // ملاحظة: يفضل وضع مفتاح التشفير في ملف .env لاحقاً
    const token = jwt.sign({ id: user._id }, "mySecretKey123", { expiresIn: "5d" });

    res.status(200).json({ message: "Login Successful! 🔓", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
