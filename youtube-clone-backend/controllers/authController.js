import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();


export const signup = async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields required." });
        }

        // Check existing email
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hash,
            avatar,
        });

        res.status(201).json({
            message: "User registered.",
            user: {
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
};



// controllers/authController.js

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { username: user.username, email: user.email, avatar: user.avatar, userId: user._id },
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};



export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found." });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch user.", error: err.message });
    }
};
