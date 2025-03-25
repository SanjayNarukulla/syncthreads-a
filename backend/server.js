const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// Simulated User Database
const users = [{ username: "admin", password: bcrypt.hashSync("password", 8) }];

/**
 * 🛡️ Middleware for JWT Authentication
 */
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." }); // Changed to 401
  }
};

/**
 * 🔐 Login Route
 */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

/**
 * 📌 Dashboard Route (Protected)
 */
app.get("/api/dashboard", authenticateToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}!`,
    cards: [
      { id: 1, title: "Card 1" },
      { id: 2, title: "Card 2" },
    ],
  });
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
 * 🛠️ Session Check
 */
app.get("/api/session", authenticateToken, (req, res) => {
  res.json({ message: "Session active", user: req.user });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
