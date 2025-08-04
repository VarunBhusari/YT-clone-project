import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import sampleVideos from "../sampleData/videos.json";

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
        <div style={styles.wrapper}>
            <div style={styles.videoSection}>
                {/* Replace with <video> tag when doing real uploads */}
                <img src={video.thumbnailUrl} alt={video.title} style={styles.thumbnail} />
                <div style={styles.details}>
                    <h2>{video.title}</h2>
                    <p>{video.description}</p>
                    <p>
                        <b>Channel:</b> <Link to={`/channel/${video.channelId}`}>{video.channelName}</Link>
                    </p>
                    <div style={styles.stats}>
                        <span>{video.views.toLocaleString()} views</span>
                        <button onClick={handleLike} style={styles.likeBtn}>
                            👍 {likeState.likes}
                        </button>
                        <button onClick={handleDislike} style={styles.dislikeBtn}>
                            👎 {likeState.dislikes}
                        </button>
                    </div>
                </div>
            </div>
            <div style={styles.commentSection}>
                <h3>Comments</h3>
                {user && (
                    <div style={styles.commentInputArea}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            style={styles.commentInput}
                        />
                        <button style={styles.addCommentBtn} onClick={handleAddComment}>
                            Add
                        </button>
                    </div>
                )}
                <ul style={styles.commentList}>
                    {comments.map((c) => (
                        <li key={c.commentId} style={styles.commentItem}>
                            <b>{c.userId}:</b>{" "}
                            {editingId === c.commentId ? (
                                <>
                                    <input
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        style={styles.commentInput}
                                    />
                                    <button style={styles.saveCommentBtn} onClick={handleSaveEdit}>Save</button>
                                    <button style={styles.cancelEditBtn} onClick={() => setEditingId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    {c.text}{" "}
                                    <span style={{ color: "#666", fontSize: 12 }}>
                                        ({new Date(c.timestamp).toLocaleString()})
                                    </span>
                                    {user && c.userId === user.username && (
                                        <>
                                            <button
                                                style={styles.editCommentBtn}
                                                onClick={() => handleEditComment(c.commentId, c.text)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={styles.deleteCommentBtn}
                                                onClick={() => handleDeleteComment(c.commentId)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const styles = {
    wrapper: { maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 10, padding: 20, boxShadow: "0 2px 10px #eee" },
    videoSection: { display: "flex", gap: 32 },
    thumbnail: { width: 420, borderRadius: 10, border: "1px solid #eee" },
    details: { flex: 1, paddingTop: 18 },
    stats: { marginTop: 12, display: "flex", alignItems: "center", gap: 12 },
    likeBtn: { border: "none", background: "#e3e3e3", borderRadius: 6, padding: "4px 10px", cursor: "pointer" },
    dislikeBtn: { border: "none", background: "#e3e3e3", borderRadius: 6, padding: "4px 10px", cursor: "pointer" },
    commentSection: { marginTop: 30 },
    commentInputArea: { display: "flex", gap: 10, marginBottom: 8 },
    commentInput: { flex: 1, padding: 6, border: "1px solid #ddd", borderRadius: 4 },
    addCommentBtn: { padding: "6px 10px", border: "none", background: "#FF0000", color: "#fff", borderRadius: 4, cursor: "pointer" },
    commentList: { listStyle: "none", padding: 0, marginBottom: 0, marginTop: 2 },
    commentItem: { marginBottom: 12, fontSize: 16 },
    editCommentBtn: { marginLeft: 10, color: "blue", background: "none", border: "none", cursor: "pointer" },
    deleteCommentBtn: { marginLeft: 6, color: "red", background: "none", border: "none", cursor: "pointer" },
    saveCommentBtn: { marginLeft: 6, color: "green", background: "none", border: "none", cursor: "pointer" },
    cancelEditBtn: { marginLeft: 6, color: "#666", background: "none", border: "none", cursor: "pointer" },
};

export default VideoPlayerPage;
