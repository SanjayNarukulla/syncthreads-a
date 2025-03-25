const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Change this in production
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.sqlite" }),
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Dummy Users (Replace with Database in Production)
const users = [{ username: "admin", password: bcrypt.hashSync("password", 8) }];

/**
 * 🔐 Login Route (Session-based)
 */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = { username }; // Store user info in session
    return res.json({ message: "Login successful", username });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

/**
 * 📌 Dashboard Route (Session Auth)
 */
app.get("/api/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({
    message: `Welcome, ${req.session.user.username}!`,
    cards: [
      { id: 1, title: "Card 1" },
      { id: 2, title: "Card 2" },
    ],
  });
});

/**
 * 🚪 Logout Route (Destroy Session)
 */
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
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

app.get("/api/session", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "No active session" });
  }
  res.json({ username: req.session.user.username });
});
// Start Server
app.listen(5000, () => console.log("✅ Server running on port 5000"));
