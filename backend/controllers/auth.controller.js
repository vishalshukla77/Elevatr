import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signup = async (req, res) => {
	try {
		const { name, username, email, password } = req.body;

		// Check for missing fields
		if (!name || !username || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Validate email format
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email format" });
		}

		// Validate password length
		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters long" });
		}

		// Check for existing email
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		// Check for existing username
		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			return res.status(400).json({ message: "Username already exists" });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const user = new User({
			name,
			email,
			password: hashedPassword,
			username,
		});

		await user.save();

		// Generate JWT
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "3d",
		});

		// Set cookie
		res.cookie("jwt-linkedin", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

		// Respond to client
		res.status(201).json({ message: "User registered successfully" });

		// Send welcome email
		const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`;
		try {
			await sendWelcomeEmail(user.email, user.name, profileUrl);
		} catch (emailError) {
			console.error("Error sending welcome Email", emailError);
		}
	} catch (error) {
		console.error("Error in signup:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Find user
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Generate token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "3d",
		});

		// Set cookie
		res.cookie("jwt-linkedin", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

		res.json({ message: "Logged in successfully" });
	} catch (error) {
		console.error("Error in login controller:", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req, res) => {
	res.clearCookie("jwt-linkedin");
	res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error.message);
		res.status(500).json({ message: "Server error" });
	}
};
