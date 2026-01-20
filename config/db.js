import mongoose from "mongoose";

const connectDB = async () => {
    try {
            console.log('Connecting to MongoDB...');
                    
                            // التحقق من وجود رابط قاعدة البيانات في ملف .env
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

                                                                                                                    export default connectDB;
                                                                                                                    