import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FilterBar from "../components/FilterBar";
import VideoGrid from "../components/VideoGrid";
import sampleVideos from "../sampleData/videos.json";
import axios from "../api/axios";

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setVideos(sampleVideos);
    }, []);

    useEffect(() => {
        let tempVideos = [...videos];

        if (selectedCategory !== "All") {
            tempVideos = tempVideos.filter(video => video.category === selectedCategory);
        }

        if (searchTerm.trim() !== "") {
            tempVideos = tempVideos.filter(video =>
                video.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredVideos(tempVideos);
    }, [videos, selectedCategory, searchTerm]);

    return (
        <div>
            <Header onSearch={setSearchTerm} />
            <div className="flex pt-16 min-h-screen bg-gray-50">
                <Sidebar onSelectCategory={setSelectedCategory} />
                <main className="md:ml-6 flex-1 p-6">
                    <FilterBar
                        selectedFilter={selectedCategory}
                        onChangeFilter={setSelectedCategory}
                    />
                    <VideoGrid videos={filteredVideos} />
                </main>
            </div>
        </div>

    );
};

export default HomePage;
