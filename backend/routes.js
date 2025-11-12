// routes.js
import express from "express";
import { signupUser, signinUser, verifyOtp } from "./controllers.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/verify-otp", verifyOtp);

export default router;
