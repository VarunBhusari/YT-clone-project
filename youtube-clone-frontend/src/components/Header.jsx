import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { IoLogoYoutube } from "react-icons/io5";

const Header = ({ onSearch }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <header className="flex items-center justify-between bg-red-600 text-white p-4 sticky top-0 z-50">
            <button
                onClick={() => window.dispatchEvent(new CustomEvent("toggleSidebar"))}
                className="text-3xl"
                aria-label="Toggle Sidebar"
            >
                &#9776;
            </button>

            <Link to="/" className="flex items-center font-bold text-xl md:text-2xl">
                <IoLogoYoutube />
                YouTube Clone
            </Link>

            <form onSubmit={handleSearch} className="flex flex-grow mx-4 max-w-xl">
                <input
                    type="text"
                    placeholder="Search videos"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow px-3 py-2 bg-white rounded-l-md text-black focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-gray-200 text-black px-4 rounded-r-md hover:bg-gray-300"
                >
                    Search
                </button>
            </form>

            <div>
                {!user ? (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-white text-red-600 px-4 py-1 rounded-md font-semibold hover:bg-red-50"
                    >
                        Sign In
                    </button>
                ) : (
                    <div className="flex items-center space-x-4">
                        {/* Make username clickable to navigate to /profile */}
                        <Link
                            to="/profile"
                            className="hidden sm:inline cursor-pointer underline hover:text-gray-200"
                            aria-label="User Profile"
                        >
                            Hello, {user.username}
                        </Link>
                        <button
                            onClick={logoutUser}
                            className="bg-white text-red-600 px-3 py-1 rounded-md font-semibold hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
