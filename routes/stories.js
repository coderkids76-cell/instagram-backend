import express from "express";
import Story from "../models/Story.js";
import User from "../models/User.js";

const router = express.Router();

// 1. رفع ستوري جديد (تم التحديث لاستقبال البيانات الجديدة)
router.post("/", async (req, res) => {
  const newStory = new Story(req.body); // سيأخذ music, location, text, type تلقائياً
    try {
        const savedStory = await newStory.save();
            res.status(200).json(savedStory);
              } catch (err) { res.status(500).json(err); }
              });

              // ... (باقي الكود كما هو: timeline و profile)
              // ...
              router.get("/timeline/:userId", async (req, res) => {
                try {
                    const currentUser = await User.findById(req.params.userId);
                        const userStories = await Story.find({ userId: currentUser._id });
                            const friendStories = await Promise.all(
                                  currentUser.followings.map((friendId) => {
                                          return Story.find({ userId: friendId });
                                                })
                                                    );
                                                        res.status(200).json(userStories.concat(...friendStories));
                                                          } catch (err) { res.status(500).json(err); }
                                                          });

                                                          export default router;
                                                          