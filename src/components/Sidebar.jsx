import React, { useEffect, useState } from "react";

const categories = ["All", "Education", "Technology", "Coding", "Gaming", "Music"];

const Sidebar = ({ onSelectCategory }) => {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const toggleSidebar = () => setIsOpen(prev => !prev);
        const onResize = () => setIsOpen(window.innerWidth >= 768);

        window.addEventListener("toggleSidebar", toggleSidebar);
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("toggleSidebar", toggleSidebar);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <aside style={styles.sidebar}>
            <h3>Categories</h3>
            <ul style={styles.list}>
                {categories.map(cat => (
                    <li key={cat} style={styles.listItem}>
                        <button onClick={() => onSelectCategory(cat)} style={styles.btn}>
                            {cat}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: 200,
        backgroundColor: "#f9f9f9",
        padding: 20,
        height: "calc(100vh - 60px)",
        position: "fixed",
        top: 60,
        left: 0,
        overflowY: "auto",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    },
    list: {
        listStyle: "none",
        padding: 0,
    },
    listItem: {
        marginBottom: 10,
    },
    btn: {
        background: "none",
        border: "none",
        color: "blue",
        cursor: "pointer",
        fontSize: 16,
        padding: 0,
    },
};

export default Sidebar;
