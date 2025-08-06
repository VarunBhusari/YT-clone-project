import Video from "../models/video.js";
import Channel from "../models/channel.js";

export const getAllVideos = async (req, res) => {
    try {
        const { search, category, channelId } = req.query;
        let filter = {};
        if (search) filter.title = { $regex: search, $options: "i" };
        if (category && category !== "All") filter.category = category;
        if (channelId) filter.channel = channelId;

        const videos = await Video.find(filter)
            .populate("channel", "channelName channelBanner")
            .sort({ createdAt: -1 });

        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch videos.", error: error.message });
    }
};

export const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate("channel", "channelName channelBanner")
            .populate({
                path: "comments",
                populate: { path: "user", select: "username avatar" },
            });

        if (!video) return res.status(404).json({ message: "Video not found." });
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch video.", error: error.message });
    }
};

export const createVideo = async (req, res) => {
    try {
        const { title, description, thumbnailUrl, channel, category, videoUrl } = req.body;
        if (!title || !thumbnailUrl || !channel)
            return res.status(400).json({ message: "Title, thumbnail, and channel are required." });

        const channelDoc = await Channel.findById(channel);
        if (!channelDoc) return res.status(404).json({ message: "Channel not found." });
        if (channelDoc.owner.toString() !== req.user.userId)
            return res.status(403).json({ message: "Unauthorized to add videos to this channel." });

        const video = await Video.create({
            title,
            description,
            thumbnailUrl,
            videoUrl,
            channel,
            uploader: req.user.userId,
            category,
        });

        channelDoc.videos.push(video._id);
        await channelDoc.save();

        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: "Failed to create video.", error: error.message });
    }
};

export const updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found." });
        if (video.uploader.toString() !== req.user.userId)
            return res.status(403).json({ message: "Unauthorized." });

        const { title, description, thumbnailUrl, category, videoUrl } = req.body;
        if (title) video.title = title;
        if (description) video.description = description;
        if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
        if (category) video.category = category;
        if (videoUrl) video.videoUrl = videoUrl;

        await video.save();
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: "Failed to update video.", error: error.message });
    }
};

export const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Video not found." });
        if (video.uploader.toString() !== req.user.userId)
            return res.status(403).json({ message: "Unauthorized." });

        await video.deleteOne();
        await Channel.findByIdAndUpdate(video.channel, { $pull: { videos: video._id } });

        res.json({ message: "Video deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete video.", error: error.message });
    }
};
