import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FilterBar from "../components/FilterBar";
import VideoGrid from "../components/VideoGrid";
import sampleVideos from "../sampleData/videos.json";

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
        <div style={{ display: "flex" }}>
            <Sidebar onSelectCategory={setSelectedCategory} />

            <div style={{ marginLeft: 220, padding: 20, flexGrow: 1 }}>
                <Header onSearch={setSearchTerm} />
                <FilterBar selectedFilter={selectedCategory} onChangeFilter={setSelectedCategory} />
                <VideoGrid videos={filteredVideos} />
            </div>
        </div>
    );
};

export default HomePage;
