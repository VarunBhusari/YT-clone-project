import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => (
    <div className="rounded overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
        <Link to={`/video/${video.videoId}`}>
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-3">
                <h4 className="font-semibold mb-1 truncate">{video.title}</h4>
                <p className="text-sm text-gray-600 truncate">{video.channelName}</p>
                <p className="text-xs text-gray-500 mt-1">{video.views.toLocaleString()} views</p>
            </div>
        </Link>
    </div>


);

export default VideoCard;
