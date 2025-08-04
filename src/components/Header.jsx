import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = ({ onSearch }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <header style={styles.header}>
            <button
                style={styles.menuBtn}
                onClick={() => {
                    window.dispatchEvent(new CustomEvent("toggleSidebar"));
                }}
            >
                &#9776;
            </button>

            <Link to="/" style={styles.logo}>
                YouTube Clone
            </Link>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search videos"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </form>

            <div>
                {!user ? (
                    <button onClick={() => navigate("/login")} style={styles.signInBtn}>
                        Sign In
                    </button>
                ) : (
                    <>
                        <span style={{ marginRight: 10 }}>Welcome, {user.username}</span>
                        <button onClick={logoutUser} style={styles.signInBtn}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

const styles = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#FF0000",
        color: "white",
    },
    menuBtn: {
        fontSize: 24,
        cursor: "pointer",
        background: "none",
        border: "none",
        color: "white",
    },
    logo: {
        fontWeight: "bold",
        fontSize: 22,
        textDecoration: "none",
        color: "white",
    },
    searchInput: {
        padding: 8,
        borderRadius: 4,
        border: "none",
        width: 300,
    },
    signInBtn: {
        background: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: 4,
        cursor: "pointer",
    },
};

export default Header;
