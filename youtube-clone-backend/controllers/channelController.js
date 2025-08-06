import Channel from "../models/channel.js";
import User from "../models/user.js";

export const createChannel = async (req, res) => {
    try {
        const { channelName, description, channelBanner } = req.body;
        if (!channelName)
            return res.status(400).json({ message: "Channel name is required." });

        const exists = await Channel.findOne({ channelName });
        if (exists)
            return res.status(409).json({ message: "Channel name already exists." });

        const channel = await Channel.create({
            channelName,
            description,
            channelBanner,
            owner: req.user.userId,
        });

        await User.findByIdAndUpdate(req.user.userId, { $push: { channels: channel._id } });

        res.status(201).json(channel);
    } catch (error) {
        res.status(500).json({ message: "Failed to create channel.", error: error.message });
    }
};

export const getAllChannels = async (req, res) => {
    try {
        const channels = await Channel.find().populate("owner", "username email avatar");
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch channels.", error: error.message });
    }
};

export const getChannelById = async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id).populate("owner", "username email avatar");
        if (!channel) return res.status(404).json({ message: "Channel not found." });
        res.json(channel);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch channel.", error: error.message });
    }
};

export const updateChannel = async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if (!channel) return res.status(404).json({ message: "Channel not found." });
        if (channel.owner.toString() !== req.user.userId)
            return res.status(403).json({ message: "Unauthorized." });

        const { channelName, description, channelBanner } = req.body;
        if (channelName) channel.channelName = channelName;
        if (description) channel.description = description;
        if (channelBanner) channel.channelBanner = channelBanner;

        await channel.save();
        res.json(channel);
    } catch (error) {
        res.status(500).json({ message: "Failed to update channel.", error: error.message });
    }
};

export const deleteChannel = async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if (!channel) return res.status(404).json({ message: "Channel not found." });
        if (channel.owner.toString() !== req.user.userId)
            return res.status(403).json({ message: "Unauthorized." });

        await channel.deleteOne();
        res.json({ message: "Channel deleted." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete channel.", error: error.message });
    }
};
