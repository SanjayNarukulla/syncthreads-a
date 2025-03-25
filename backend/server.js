const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

// Allow frontend to send credentials
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Change this in production

// Dummy Users (Replace with Database in Production)
const users = [{ username: "admin", password: bcrypt.hashSync("password", 8) }];

/**
 * 🔐 Login Route (JWT Authentication)
 */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    return res.json({ message: "Login successful", token });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

/**
 * 📌 Dashboard Route (JWT Auth)
 */
app.get("/api/dashboard", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({
      message: `Welcome, ${decoded.username}!`,
      cards: [
        { id: 1, title: "Card 1" },
        { id: 2, title: "Card 2" },
      ],
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

/**
 * 🚪 Logout Route (Client-side Token Deletion)
 */
app.post("/api/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

/**
 * 🗺️ Map API (No Auth Required)
 */
const markers = [
  { position: [77.6, 12.97] }, // Bangalore
  { position: [78.4, 17.4] }, // Hyderabad
  { position: [72.8, 19.07] }, // Mumbai
  { position: [88.3, 22.57] }, // Kolkata
  { position: [77.2, 28.61] }, // Delhi
];

app.get("/api/map", (req, res) => {
  res.json({ markers });
});

/**
 * 🛠️ Session Check (Not needed anymore, but keeping for reference)
 */
app.get("/api/session", (req, res) => {
  res.status(401).json({ message: "No active session" });
});

// Start Server
app.listen(5000, () => console.log("✅ Server running on port 5000"));
