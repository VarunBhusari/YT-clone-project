import Comment from "../models/comment.js";
import Video from "../models/video.js";

export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "Comment text required." });

        const video = await Video.findById(req.params.videoId);
        if (!video) return res.status(404).json({ message: "Video not found." });

        const comment = await Comment.create({
            video: video._id,
            user: req.user.userId,
            text,
        });

        video.comments.push(comment._id);
        await video.save();

        const populatedComment = await comment.populate("user", "username avatar");
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment.", error: error.message });
    }
};

export const getCommentsByVideo = async (req, res) => {
    try {
        const comments = await Comment.find({ video: req.params.videoId })
            .populate("user", "username avatar")
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch comments.", error: error.message });
    }
};

export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found." });
        if (comment.user.toString() !== req.user.userId)
            return res.status(403).json({ message: "Unauthorized." });

        if (!req.body.text) return res.status(400).json({ message: "Text is required." });

        comment.text = req.body.text;
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: "Failed to update comment.", error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found." });
        if (comment.user.toString() !== req.user.userId)
            return res.status(403).json({ message: "Unauthorized." });

        await comment.deleteOne();
        await Video.findByIdAndUpdate(comment.video, { $pull: { comments: comment._id } });

        res.json({ message: "Comment deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete comment.", error: error.message });
    }
};
