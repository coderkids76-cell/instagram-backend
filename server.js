// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// ... بقية الـ imports الخاصة بك

dotenv.config();
connectDB();
const app = express();

// --- الحل النووي لـ CORS ---
app.use(cors({
    origin: function(origin, callback) {
        // سيسمح هذا السطر لأي دومين بالوصول مؤقتاً لحل المشكلة
        callback(null, true); 
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// إجابة إجبارية لطلبات OPTIONS قبل أي شيء آخر
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
// ... بقية المسارات (Routes)