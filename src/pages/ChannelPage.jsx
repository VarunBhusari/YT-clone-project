import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import channels from "../sampleData/channels.json";
import videosData from "../sampleData/videos.json";

const ChannelPage = () => {
    const { channelId } = useParams();
    const { user } = useContext(AuthContext);

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [editingVideo, setEditingVideo] = useState(null);
    const [videoForm, setVideoForm] = useState({
        title: "",
        description: "",
        thumbnailUrl: ""
    });

    useEffect(() => {
        // Get channel
        const c = channels.find((ch) => ch.channelId === channelId);
        setChannel(c);
        // Get videos that belong to this channel
        setVideos(videosData.filter((v) => v.channelId === channelId));
    }, [channelId]);

    // Handle video add/edit form changes
    const handleFormChange = (e) => {
        setVideoForm({ ...videoForm, [e.target.name]: e.target.value });
    };

    // Add new video
    const handleAddVideo = (e) => {
        e.preventDefault();
        const newVid = {
            videoId: "video" + (Date.now()),
            title: videoForm.title,
            thumbnailUrl: videoForm.thumbnailUrl || "https://dummyimage.com/400x220/eee/333&text=Video",
            description: videoForm.description,
            channelName: channel.channelName,
            channelId: channel.channelId,
            uploader: channel.owner,
            views: 0,
            likes: 0,
            dislikes: 0,
            uploadDate: new Date().toISOString(),
            comments: [],
            category: "Education"
        };
        setVideos([newVid, ...videos]);
        setVideoForm({ title: "", description: "", thumbnailUrl: "" });
        // In real app: send POST to backend
    };

    // Edit video
    const handleEditVideo = (video) => {
        setEditingVideo(video.videoId);
        setVideoForm({
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl
        });
    };

    // Save edited video
    const handleSaveEdit = (e) => {
        e.preventDefault();
        setVideos(
            videos.map((v) =>
                v.videoId === editingVideo
                    ? { ...v, ...videoForm }
                    : v
            )
        );
        setEditingVideo(null);
        setVideoForm({ title: "", description: "", thumbnailUrl: "" });
        // In real app: send PUT to backend
    };

    // Delete video
    const handleDeleteVideo = (videoId) => {
        setVideos(videos.filter((v) => v.videoId !== videoId));
        // In real app: send DELETE to backend
    };

    if (!channel) return <div style={{ margin: 30 }}><h2>Channel not found</h2><Link to="/">Back</Link></div>;

    const isMyChannel = user && user.username === channel.owner; // assume username or id matches

    return (
        <div style={styles.wrapper}>
            <img src={channel.channelBanner} alt="banner" style={styles.banner} />
            <div style={styles.infoSection}>
                <h2>{channel.channelName}</h2>
                <p style={{ margin: "6px 0" }}>{channel.description}</p>
                <div>
                    <b>{channel.subscribers.toLocaleString()} subscribers</b>
                </div>
                {isMyChannel && (
                    <div style={{ marginTop: 18 }}>
                        <h3>{editingVideo ? "Edit Video" : "Add Video"}</h3>
                        <form onSubmit={editingVideo ? handleSaveEdit : handleAddVideo} style={styles.form}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={videoForm.title}
                                onChange={handleFormChange}
                                style={styles.input}
                                required
                            />
                            <input
                                type="text"
                                name="thumbnailUrl"
                                placeholder="Thumbnail URL"
                                value={videoForm.thumbnailUrl}
                                onChange={handleFormChange}
                                style={styles.input}
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={videoForm.description}
                                onChange={handleFormChange}
                                style={styles.input}
                                required
                            />
                            <button style={styles.addBtn} type="submit">
                                {editingVideo ? "Save" : "Add Video"}
                            </button>
                            {editingVideo && (
                                <button
                                    style={styles.cancelBtn}
                                    type="button"
                                    onClick={() => {
                                        setEditingVideo(null);
                                        setVideoForm({ title: "", description: "", thumbnailUrl: "" });
                                    }}>
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                )}
            </div>
            <hr style={{ margin: "30px 0" }} />
            <div>
                <h3>Videos</h3>
                <div style={styles.grid}>
                    {videos.length === 0 && <p>No videos found for this channel.</p>}
                    {videos.map((video) => (
                        <div key={video.videoId} style={styles.card}>
                            <Link to={`/video/${video.videoId}`}>
                                <img src={video.thumbnailUrl} alt={video.title} style={styles.thumb} />
                                <div>
                                    <h4>{video.title}</h4>
                                    <p style={{ fontSize: 14, color: "#666" }}>{video.views} views</p>
                                </div>
                            </Link>
                            {isMyChannel && (
                                <div style={styles.actionRow}>
                                    <button style={styles.editBtn} onClick={() => handleEditVideo(video)}>Edit</button>
                                    <button style={styles.deleteBtn} onClick={() => handleDeleteVideo(video.videoId)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    wrapper: { maxWidth: 900, margin: "40px auto", padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 2px 10px #eee" },
    banner: { width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 },
    infoSection: { margin: "20px 0" },
    form: { display: "flex", flexDirection: "column", gap: 12, marginTop: 10, maxWidth: 350 },
    input: { padding: 8, borderRadius: 5, border: "1px solid #ccc", fontSize: 15 },
    addBtn: { padding: "8px 0", background: "#FF0000", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" },
    cancelBtn: { padding: "8px 0", background: "#999", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", marginTop: 0 },
    grid: { marginTop: 15, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 },
    card: { background: "#fafafa", borderRadius: 7, boxShadow: "0 2px 6px #eee", padding: 12, position: "relative" },
    thumb: { width: "100%", borderRadius: 5, marginBottom: 7 },
    actionRow: { marginTop: 6, display: "flex", gap: 7 },
    editBtn: { background: "#ffb400", color: "#fff", border: "none", borderRadius: 4, padding: "3px 10px", cursor: "pointer" },
    deleteBtn: { background: "#e00", color: "#fff", border: "none", borderRadius: 4, padding: "3px 10px", cursor: "pointer" },
};

export default ChannelPage;
