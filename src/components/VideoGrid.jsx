import React from "react";
import VideoCard from "./VideoCard";

const VideoGrid = ({ videos }) => (
    <div style={styles.grid}>
        {videos.map(video => (
            <VideoCard key={video.videoId} video={video} />
        ))}
    </div>
);

const styles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
        gap: 20,
    },
};

export default VideoGrid;
