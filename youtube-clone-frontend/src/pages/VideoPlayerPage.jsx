import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import sampleVideos from "../sampleData/videos.json";
import { AiTwotoneLike } from "react-icons/ai";
import { AiTwotoneDislike } from "react-icons/ai";



const VideoPlayerPage = () => {
    const { videoId } = useParams();
    const { user } = useContext(AuthContext);

    // Find video by ID
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [likeState, setLikeState] = useState({ likes: 0, dislikes: 0, userLike: null });

    useEffect(() => {
        const found = sampleVideos.find((v) => v.videoId === videoId);
        setVideo(found);
        if (found) setComments(found.comments || []);
        setLikeState({ likes: found.likes, dislikes: found.dislikes, userLike: null });
    }, [videoId]);

    // ADD COMMENT
    const [commentInput, setCommentInput] = useState("");

    const handleAddComment = () => {
        if (!user) return alert("Login to comment!");
        if (!commentInput.trim()) return;
        const newComment = {
            commentId: "comment" + Date.now(),
            userId: user.username,
            text: commentInput,
            timestamp: new Date().toISOString(),
        };
        setComments([...comments, newComment]);
        setCommentInput("");
    };

    // EDIT COMMENT
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const handleEditComment = (id, text) => {
        setEditingId(id);
        setEditText(text);
    };
    const handleSaveEdit = () => {
        setComments(comments.map(c => c.commentId === editingId ? { ...c, text: editText } : c));
        setEditingId(null);
        setEditText("");
    };

    // DELETE COMMENT
    const handleDeleteComment = (id) => {
        setComments(comments.filter(c => c.commentId !== id));
    };

    // LIKE / DISLIKE 
    const handleLike = () => {
        if (likeState.userLike === "like") return;
        setLikeState({
            ...likeState,
            likes: likeState.likes + 1,
            dislikes: likeState.userLike === "dislike" ? likeState.dislikes - 1 : likeState.dislikes,
            userLike: "like",
        });
    };
    const handleDislike = () => {
        if (likeState.userLike === "dislike") return;
        setLikeState({
            ...likeState,
            dislikes: likeState.dislikes + 1,
            likes: likeState.userLike === "like" ? likeState.likes - 1 : likeState.likes,
            userLike: "dislike",
        });
    };

    if (!video)
        return (
            <div style={{ margin: 30 }}>
                <h2>Video not found!</h2>
                <Link to="/">Back to Home</Link>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Video player or thumbnail */}
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="rounded-lg w-full md:w-96 h-auto object-cover"
                />
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
                    <p className="mb-3 text-gray-700">{video.description}</p>
                    <p className="mb-3">
                        <b>Channel: </b>
                        <Link
                            to={`/channel/${video.channelId}`}
                            className="text-red-600 hover:underline"
                        >
                            {video.channelName}
                        </Link>
                    </p>
                    <div className="flex items-center gap-6 text-gray-600">
                        <span>{video.views.toLocaleString()} views</span>
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <AiTwotoneLike />
                            <span>{likeState.likes}</span>
                        </button>
                        <button
                            onClick={handleDislike}
                            className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <AiTwotoneDislike />
                            <span>{likeState.dislikes}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <section className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>

                {user && (
                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button
                            onClick={handleAddComment}
                            className="bg-red-600 text-white px-4 rounded hover:bg-red-700"
                        >
                            Add
                        </button>
                    </div>
                )}

                <ul>
                    {comments.map((c) => (
                        <li
                            key={c.commentId}
                            className="mb-4 border-b border-gray-200 pb-2"
                        >
                            <b>{c.userId}:</b>{" "}
                            {editingId === c.commentId ? (
                                <>
                                    <input
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="border border-gray-300 rounded px-2 py-1 w-full max-w-md"
                                    />
                                    <div className="mt-1 space-x-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="text-green-600 hover:underline"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="text-gray-600 hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {c.text}{" "}
                                    <span className="text-gray-400 text-sm">
                                        ({new Date(c.timestamp).toLocaleString()})
                                    </span>
                                    {user && c.userId === user.username && (
                                        <span className="ml-4 space-x-3">
                                            <button
                                                onClick={() => handleEditComment(c.commentId, c.text)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(c.commentId)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </span>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>

    );
};

export default VideoPlayerPage;
