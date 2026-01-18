const mongoose = require('mongoose');

const connectDB = async () => {
    try {
            // سنتجاهل التحذير مؤقتاً ونستخدم اتصالاً بسيطاً
                    console.log('Connecting to MongoDB...');
                            // ملاحظة: الرابط سيأتي من ملف .env لاحقاً
                                    if(!process.env.MONGO_URI){
                                                console.log('Note: MONGO_URI is not set yet.');
                                                            return;
                                                                    }
                                                                            await mongoose.connect(process.env.MONGO_URI);
                                                                                    console.log('MongoDB Connected Successfully');
                                                                                        } catch (error) {
                                                                                                console.error('MongoDB Connection Error:', error);
                                                                                                        process.exit(1);
                                                                                                            }
                                                                                                            };

                                                                                                            module.exports = connectDB;
                                                                                                            