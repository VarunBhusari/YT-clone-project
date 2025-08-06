import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import ChannelPage from "./pages/ChannelPage";
import UserProfilePage from "./pages/UserProfilePage";



const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/video/:videoId" element={<VideoPlayerPage />} />
    <Route path="/channel/:channelId" element={<ChannelPage />} />
    <Route path="/profile" element={<UserProfilePage />} />
  </Routes>
);

export default App;
