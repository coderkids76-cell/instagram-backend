import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddPost from "./pages/AddPost";
import Search from "./pages/Search";
import Reels from "./pages/Reels";
import Messages from "./pages/Messages"; // ✅ استيراد صفحة الرسائل

function App() {
  return (
      <BrowserRouter>
            <Routes>
                    <Route path="/" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                                    <Route path="/home" element={<Home />} />
                                            <Route path="/profile" element={<Profile />} />
                                                    <Route path="/edit-profile" element={<EditProfile />} />
                                                            <Route path="/create" element={<AddPost />} />
                                                                    <Route path="/search" element={<Search />} />
                                                                            <Route path="/reels" element={<Reels />} />
                                                                                    <Route path="/messages" element={<Messages />} /> {/* ✅ المسار الجديد */}
                                                                                          </Routes>
                                                                                              </BrowserRouter>
                                                                                                );
                                                                                                }

                                                                                                export default App;
                                                                                                