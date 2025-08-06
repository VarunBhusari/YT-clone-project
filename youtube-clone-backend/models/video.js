import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        thumbnailUrl: { type: String, required: true },
        videoUrl: { type: String }, // optional, for actual video file
        channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
        uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        category: { type: String },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    },
    { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
