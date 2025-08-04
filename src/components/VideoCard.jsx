import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => (
    <div style={styles.card}>
        <Link to={`/video/${video.videoId}`} style={styles.link}>
            <img src={video.thumbnailUrl} alt={video.title} style={styles.thumbnail} />
            <div>
                <h4 style={styles.title}>{video.title}</h4>
                <p style={styles.channel}>{video.channelName}</p>
                <p style={styles.views}>{video.views.toLocaleString()} views</p>
            </div>
        </Link>
    </div>
);

const styles = {
    card: {
        width: "100%",
        maxWidth: 320,
        marginBottom: 20,
        cursor: "pointer",
    },
    thumbnail: {
        width: "100%",
        borderRadius: 8,
    },
    link: {
        textDecoration: "none",
        color: "black",
    },
    title: {
        margin: "8px 0 4px",
    },
    channel: {
        color: "#555",
        fontSize: 14,
    },
    views: {
        color: "#777",
        fontSize: 12,
    },
};

export default VideoCard;
