import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
    const { loginUser, signupUser, loading, error } = useContext(AuthContext);
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isRegister) {
            if (!form.username || !form.email || !form.password) return;
            const res = await signupUser(form.username, form.email, form.password);
            if (res.success) {
                const loginRes = await loginUser(form.email, form.password);
                if (loginRes.success) navigate("/");
            }
        } else {
            if (!form.email || !form.password) return;
            const res = await loginUser(form.email, form.password);
            if (res.success) navigate("/");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">{isRegister ? "Register" : "Sign In"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                {isRegister && (
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={loading}
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={loading}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={loading}
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 text-white rounded py-2 font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                    {loading ? "Processing..." : isRegister ? "Register" : "Sign In"}
                </button>
            </form>
            <button
                onClick={() => setIsRegister((prev) => !prev)}
                className="mt-4 text-red-600 hover:underline focus:outline-none"
                disabled={loading}
            >
                {isRegister ? "Already have an account? Sign In" : "No account? Register"}
            </button>
        </div>
    );
};

export default LoginPage;
