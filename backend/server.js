// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory data (mock database)
let users = [];
let otpStore = {};

// Sign Up Route
app.post("/api/signup", (req, res) => {
  const { username, phone, password } = req.body;

  if (!username || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const exists = users.find((u) => u.phone === phone);
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, phone, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Sign In Route
app.post("/api/signin", (req, res) => {
  const { phone, password } = req.body;
  const user = users.find((u) => u.phone === phone && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate mock OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = otp;

  console.log(`Generated OTP for ${phone}: ${otp}`); // visible in terminal

  return res.json({ message: "OTP sent successfully", otp }); // just for testing
});

// Verify OTP Route
app.post("/api/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] && otpStore[phone] === otp) {
    delete otpStore[phone];
    return res.json({ message: "OTP verified successfully" });
  }

  return res.status(400).json({ message: "Invalid or expired OTP" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
