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
        <div style={styles.container}>
            <h2>{isRegister ? "Register" : "Sign In"}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                {isRegister && (
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        style={styles.input}
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    style={styles.input}
                />
                {err && <div style={styles.err}>{err}</div>}
                <button style={styles.btn} type="submit">
                    {isRegister ? "Register" : "Sign In"}
                </button>
            </form>
            <button
                style={styles.link}
                onClick={() => {
                    setIsRegister((prev) => !prev);
                    setErr("");
                }}
            >
                {isRegister ? "Have an account? Sign In" : "No account? Register"}
            </button>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: 350,
        margin: "60px auto",
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 2px 10px #ddd",
        padding: 24,
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    input: {
        padding: 10,
        fontSize: 16,
        borderRadius: 4,
        border: "1px solid #ddd",
    },
    btn: {
        marginTop: 8,
        padding: "10px 0",
        background: "#FF0000",
        border: "none",
        color: "#fff",
        borderRadius: 6,
        fontWeight: "bold",
        cursor: "pointer",
    },
    link: {
        marginTop: 12,
        background: "none",
        border: "none",
        color: "#FF0000",
        cursor: "pointer",
        textDecoration: "underline",
        fontSize: 15,
    },
    err: {
        color: "red",
        fontSize: 14,
    },
};

export default LoginPage;
