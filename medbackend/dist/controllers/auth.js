import {} from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken, setTokenCookie, clearTokenCookie } from "../utils/jwt.js";
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = new User({ username, email, password: hash });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = signToken(user._id.toString());
        setTokenCookie(res, token);
        res.json({ message: "Logged in successfully" });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}
export function logout(req, res) {
    try {
        clearTokenCookie(res);
        res.json({ message: "Logged out successfully" });
    }
    catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}
//# sourceMappingURL=auth.js.map