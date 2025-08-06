import React, { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Sync auth header with axios
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    // Sync user state to localStorage
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    // Login function
    const loginUser = async (email, password) => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.post("/auth/login", { email, password });
            setUser(res.data.user);
            setToken(res.data.token);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
            return { success: false, message: err.response?.data?.message };
        } finally {
            setLoading(false);
        }
    };

    // Signup function
    const signupUser = async (username, email, password) => {
        setLoading(true);
        setError("");
        try {
            await axios.post("/auth/signup", { username, email, password });
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
            return { success: false, message: err.response?.data?.message };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logoutUser = () => {
        setUser(null);
        setToken("");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loginUser,
                signupUser,
                logoutUser,
                loading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
