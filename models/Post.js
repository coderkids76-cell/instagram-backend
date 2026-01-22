import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
      userId: {
            type: String,
                  required: true,
                      },
                          desc: {
                                type: String,
                                      max: 500,
                                            default: ""
                                                },
                                                    img: {
                                                          type: String, // هنا يتم حفظ الصورة (Base64)
                                                                default: ""
                                                                    },
                                                                        likes: {
                                                                              type: Array,
                                                                                    default: [],
                                                                                        },
                                                                                          },
                                                                                            { timestamps: true }
                                                                                            );

                                                                                            export default mongoose.model("Post", PostSchema);
                                                                                            