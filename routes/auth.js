import express from "express";
// لاحظ إضافة .js في النهاية، هذا ضروري جداً في النظام الحديث
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
