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
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <img
                src={channel.channelBanner}
                alt="channel banner"
                className="w-full h-44 object-cover rounded-md mb-6"
            />
            <div className="mb-6">
                <h2 className="text-3xl font-bold">{channel.channelName}</h2>
                <p className="text-gray-700 mt-2">{channel.description}</p>
                <div className="mt-1 font-semibold text-gray-600">
                    {channel.subscribers.toLocaleString()} subscribers
                </div>
            </div>

            {isMyChannel && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">
                        {editingVideo ? "Edit Video" : "Add a New Video"}
                    </h3>
                    <form
                        onSubmit={editingVideo ? handleSaveEdit : handleAddVideo}
                        className="flex flex-col gap-4 max-w-md"
                    >
                        <input
                            type="text"
                            name="title"
                            placeholder="Video Title"
                            value={videoForm.title}
                            onChange={handleFormChange}
                            required
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <input
                            type="text"
                            name="thumbnailUrl"
                            placeholder="Thumbnail URL (optional)"
                            value={videoForm.thumbnailUrl}
                            onChange={handleFormChange}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <textarea
                            name="description"
                            placeholder="Video Description"
                            value={videoForm.description}
                            onChange={handleFormChange}
                            required
                            className="border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 font-semibold"
                            >
                                {editingVideo ? "Save" : "Add Video"}
                            </button>
                            {editingVideo && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingVideo(null);
                                        setVideoForm({ title: "", description: "", thumbnailUrl: "" });
                                    }}
                                    className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div>
                <h3 className="text-2xl font-semibold mb-6">Channel Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {videos.length === 0 ? (
                        <p className="text-gray-600">No videos found for this channel.</p>
                    ) : (
                        videos.map((video) => (
                            <div
                                key={video.videoId}
                                className="bg-gray-100 rounded-md shadow-md p-4"
                            >
                                <Link to={`/video/${video.videoId}`}>
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        className="rounded-md object-cover w-full h-40"
                                    />
                                    <h4 className="font-semibold text-lg mt-3 truncate">
                                        {video.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">{video.views} views</p>
                                </Link>
                                {isMyChannel && (
                                    <div className="flex space-x-3 mt-3">
                                        <button
                                            className="text-yellow-500 hover:underline"
                                            onClick={() => handleEditVideo(video)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => handleDeleteVideo(video.videoId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

    );
};


export default ChannelPage;
