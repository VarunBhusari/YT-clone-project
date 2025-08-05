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
        <aside className="fixed top-16 left-0 h-[calc(100vh-64px)] w-56 bg-gray-100 shadow-lg overflow-auto p-4 z-40 md:relative md:top-0 md:h-auto md:w-54">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul>
                {categories.map(cat => (
                    <li key={cat} className="mb-2">
                        <button
                            onClick={() => onSelectCategory(cat)}
                            className="w-full text-left px-3 py-2 rounded hover:bg-red-600 hover:text-white transition"
                        >
                            {cat}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>

    );
};



export default Sidebar;
