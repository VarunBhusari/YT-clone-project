import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const UserProfilePage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // User channels list
    const [channels, setChannels] = useState([]);
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [error, setError] = useState("");

    // For channel form
    const [editingChannelId, setEditingChannelId] = useState(null);
    const [channelForm, setChannelForm] = useState({
        channelName: "",
        description: "",
        channelBanner: "",
    });
    const [submitting, setSubmitting] = useState(false);

    // Redirect to login if no user
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    // Fetch channels that belong to logged-in user
    useEffect(() => {
        const fetchUserChannels = async () => {
            setLoadingChannels(true);
            setError("");
            try {
                const res = await axios.get("/channels");
                // Filter channels owned by this user
                const userChannels = res.data.filter(
                    (ch) => ch.owner?._id === user.userId || ch.owner === user.userId
                );
                setChannels(userChannels);
            } catch (err) {
                setError("Failed to load channels.");
            } finally {
                setLoadingChannels(false);
            }
        };
        if (user) fetchUserChannels();
    }, [user]);

    // Handle form input changes
    const handleFormChange = (e) => {
        setChannelForm({ ...channelForm, [e.target.name]: e.target.value });
    };

    // Start editing a channel
    const handleEditChannel = (channel) => {
        setEditingChannelId(channel._id);
        setChannelForm({
            channelName: channel.channelName,
            description: channel.description || "",
            channelBanner: channel.channelBanner || "",
        });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingChannelId(null);
        setChannelForm({ channelName: "", description: "", channelBanner: "" });
    };

    // Add or update channel submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!channelForm.channelName.trim()) {
            setError("Channel Name is required.");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            if (editingChannelId) {
                // Update existing channel
                const res = await axios.put(`/channels/${editingChannelId}`, {
                    channelName: channelForm.channelName.trim(),
                    description: channelForm.description.trim(),
                    channelBanner: channelForm.channelBanner.trim(),
                });
                setChannels((prev) =>
                    prev.map((ch) => (ch._id === editingChannelId ? res.data : ch))
                );
                setEditingChannelId(null);
            } else {
                // Create new channel
                const res = await axios.post("/channels", {
                    channelName: channelForm.channelName.trim(),
                    description: channelForm.description.trim(),
                    channelBanner: channelForm.channelBanner.trim(),
                });
                setChannels((prev) => [...prev, res.data]);
            }
            setChannelForm({ channelName: "", description: "", channelBanner: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Channel operation failed.");
        } finally {
            setSubmitting(false);
        }
    };

    // Delete channel
    const handleDeleteChannel = async (channelId) => {
        if (!window.confirm("Are you sure you want to delete this channel?")) return;
        try {
            await axios.delete(`/channels/${channelId}`);
            setChannels((prev) => prev.filter((ch) => ch._id !== channelId));
            // If editing deleted channel, reset form
            if (editingChannelId === channelId) {
                handleCancelEdit();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete channel.");
        }
    };

    if (!user) return null; // Or loading screen

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>

            <div className="mb-10">
                <p className="text-lg">
                    <span className="font-semibold">Username:</span> {user.username}
                </p>
                <p className="text-lg">
                    <span className="font-semibold">Email:</span> {user.email}
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-6">Your Channels</h2>

                {loadingChannels ? (
                    <p>Loading channels...</p>
                ) : channels.length === 0 ? (
                    <p>You have no channels yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {channels.map((channel) => (
                            <div
                                key={channel._id}
                                className="bg-gray-100 rounded-md shadow-md p-4 relative hover:shadow-lg transition"
                            >
                                <Link
                                    to={`/channel/${channel._id}`}
                                    className="text-red-600 font-semibold text-lg hover:underline"
                                >
                                    {channel.channelName}
                                </Link>
                                {channel.description && (
                                    <p className="mt-2 text-gray-700">{channel.description}</p>
                                )}
                                {channel.channelBanner && (
                                    <img
                                        src={channel.channelBanner}
                                        alt="channel banner"
                                        className="mt-4 rounded-md object-cover w-full h-40"
                                    />
                                )}
                                {/* Edit/Delete controls */}
                                <div className="flex space-x-3 mt-4">
                                    <button
                                        onClick={() => handleEditChannel(channel)}
                                        className="text-yellow-500 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteChannel(channel._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-6">
                    {editingChannelId ? "Edit Channel" : "Create New Channel"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 max-w-md"
                >
                    <input
                        type="text"
                        name="channelName"
                        placeholder="Channel Name"
                        value={channelForm.channelName}
                        onChange={handleFormChange}
                        required
                        disabled={submitting}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <input
                        type="text"
                        name="channelBanner"
                        placeholder="Channel Banner URL (optional)"
                        value={channelForm.channelBanner}
                        onChange={handleFormChange}
                        disabled={submitting}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <textarea
                        name="description"
                        placeholder="Channel Description"
                        value={channelForm.description}
                        onChange={handleFormChange}
                        disabled={submitting}
                        rows={4}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {error && <p className="text-red-600">{error}</p>}

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50 font-semibold"
                        >
                            {submitting
                                ? "Saving..."
                                : editingChannelId
                                    ? "Save Channel"
                                    : "Create Channel"}
                        </button>
                        {editingChannelId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={submitting}
                                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 font-semibold"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfilePage;
