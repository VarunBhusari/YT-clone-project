import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext);
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple demo
        if (isRegister && (!form.username || !form.email || !form.password)) {
            setErr("All fields required.");
            return;
        }
        if (!isRegister && (!form.email || !form.password)) {
            setErr("Email and password required.");
            return;
        }

        // Fake user object
        const userObj = {
            username: form.username || "DemoUser",
            email: form.email,
        };
        loginUser(userObj);
        navigate("/");
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {isRegister ? "Register" : "Sign In"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                {isRegister && (
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                />
                {err && <div className="text-red-600 text-sm">{err}</div>}
                <button
                    type="submit"
                    className="bg-red-600 text-white rounded py-2 font-semibold hover:bg-red-700"
                >
                    {isRegister ? "Register" : "Sign In"}
                </button>
            </form>
            <button
                onClick={() => {
                    setIsRegister(!isRegister);
                    setErr("");
                }}
                className="mt-4 text-red-600 hover:underline"
            >
                {isRegister
                    ? "Have an account? Sign In"
                    : "No account? Register"}
            </button>
        </div>

    );
};

export default LoginPage;
