// controllers.js
import { generateOtp } from "./utils.js";

let users = [];
let otpStore = {};

export const signupUser = (req, res) => {
  const { username, phone, password } = req.body;

  if (!username || !phone || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = users.find((u) => u.phone === phone);
  if (exists) return res.status(409).json({ message: "User already exists" });

  users.push({ username, phone, password });
  res.status(201).json({ message: "Signup successful" });
};

export const signinUser = (req, res) => {
  const { phone, password } = req.body;
  const user = users.find((u) => u.phone === phone && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const otp = generateOtp();
  otpStore[phone] = otp;

  console.log(`OTP for ${phone}: ${otp}`); // just for testing
  res.json({ message: "OTP sent", otp });
};

export const verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  if (otpStore[phone] && otpStore[phone] === otp) {
    delete otpStore[phone];
    return res.json({ message: "OTP verified successfully" });
  }
  res.status(400).json({ message: "Invalid or expired OTP" });
};

