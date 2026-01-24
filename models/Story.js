import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
  {
      userId: { type: String, required: true },
          img: { type: String, required: true }, // رابط الصورة أو الفيديو (Base64)
              type: { type: String, enum: ['image', 'video'], default: 'image' }, // ✅ جديد: نوع الملف
                  text: { type: String, default: "" },      // ✅ جديد: نص الستوري
                      music: { type: String, default: "" },     // ✅ جديد: اسم الأغنية
                          location: { type: String, default: "" },  // ✅ جديد: الموقع
                              createdAt: { type: Date, default: Date.now, expires: 86400 } // حذف بعد 24 ساعة
                                }
                                );

                                export default mongoose.model("Story", StorySchema);
                                