import React from "react";

const filters = ["All", "Most Viewed", "Recent", "Trending"];

const FilterBar = ({ selectedFilter, onChangeFilter }) => (
    <div className="flex gap-3 mb-6 flex-wrap">
        {filters.map((filter) => (
            <button
                key={filter}
                onClick={() => onChangeFilter(filter)}
                className={`px-4 py-1 rounded-full shadow-sm font-semibold transition ${selectedFilter === filter
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
            >
                {filter}
            </button>
        ))}
    </div>

);

export default FilterBar;
