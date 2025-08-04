import React from "react";

const filters = ["All", "Most Viewed", "Recent", "Trending"];

const FilterBar = ({ selectedFilter, onChangeFilter }) => (
    <div style={styles.container}>
        {filters.map(filter => (
            <button
                key={filter}
                onClick={() => onChangeFilter(filter)}
                style={{
                    ...styles.button,
                    backgroundColor: selectedFilter === filter ? "#FF0000" : "#f0f0f0",
                    color: selectedFilter === filter ? "white" : "black",
                }}
            >
                {filter}
            </button>
        ))}
    </div>
);

const styles = {
    container: {
        margin: "10px 0",
        display: "flex",
        gap: 10,
    },
    button: {
        border: "none",
        padding: "8px 12px",
        borderRadius: 20,
        cursor: "pointer",
    },
};

export default FilterBar;
