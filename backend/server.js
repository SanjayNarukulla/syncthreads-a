const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://syncthreads-a-1.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const users = [{ username: "admin", password: bcrypt.hashSync("password", 8) }];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: "None",
      })
      .json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/api/dashboard", (req, res) => {
  console.log("Cookies received:", req.cookies); 
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    res.json({
      message: `Welcome, ${decoded.username}!`,
      cards: [
        { id: 1, title: "Card 1" },
        { id: 2, title: "Card 2" },
      ],
    });
  });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

// Map API
const markers = [
  { position: [77.6, 12.97] }, // Example marker 1 (Bangalore)
  { position: [78.4, 17.4] }, // Example marker 2 (Hyderabad)
  { position: [72.8, 19.07] }, // Example marker 3 (Mumbai)
  { position: [88.3, 22.57] }, // Example marker 4 (Kolkata)
  { position: [77.2, 28.61] }, // Example marker 5 (Delhi)
];

app.get("/api/map", (req, res) => {
  res.json({ markers });
});

app.listen(5000, () => console.log("Server running on port 5000"));
