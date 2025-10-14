const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const generateWebtoken=require("../utils/generate")
const User = require("../Models/UserModel");
const EmailToken = require("../Models/Emailtoken");
const sendmail = require("../testemail");

// =======================
// Rate Limiting
// =======================
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many verification attempts. Please try again later.",
});

const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many resend requests. Please wait a while.",
});

// =======================
// Helper Function
// =======================
const generateToken = () => {
  const number = crypto.randomInt(0, 1000000);
  return String(number).padStart(6, "0");
};

// =======================
// Signup Controller
// =======================
const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });
    if (user && user.isVerified) {
      return res.status(400).json({ message: "Email already registered and verified. Please log in." });
    }

    const code = generateToken();
    const salt = await bcrypt.genSalt(10);

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
      });
    }

    const tokenHash = await bcrypt.hash(code, salt);
    await EmailToken.deleteMany({ userId: user._id });
    await EmailToken.create({
      userId: user._id,
      tokenHash,
    });

    console.log(`Generated OTP for ${normalizedEmail}: ${code}`);

    // ✅ Send the code via email
    try {
      const mailInfo = await sendmail(normalizedEmail, code);
      console.log("Mail sent successfully:", mailInfo);
     
    } catch (mailErr) {
      console.error("Failed to send email:", mailErr);
      return res.status(500).json({
        status: "fail",
        message: "Could not send verification email. Please try again.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Verification code has been sent to your email.",
      email: normalizedEmail,
    });

  } catch (e) {
    console.error("Signup error:", e);
    res.status(500).json({
      status: "fail",
      message: e.message || "Server error during signup.",
    });
  }
};

// =======================
// Verify Email Controller
// =======================
const verify = async (req, res) => {
  try {
    const {email,code } = req.body;
    if (!code||!email) {
      return res.status(400).json({ message: "email and Verification code are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: "No account found for that email." });
    if (user.isVerified) return res.status(200).json({ message: "Account already verified." });

    const tokenDoc = await EmailToken.findOne({ userId: user._id });
    if (!tokenDoc) return res.status(400).json({ message: "No active verification token. Request a new code." });

    const isMatch = await bcrypt.compare(String(code), tokenDoc.tokenHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid verification code." });

    user.isVerified = true;
    await user.save();
    await EmailToken.deleteMany({ userId: user._id });

    return res.status(200).json({ message: "Email verified successfully. You can now log in." });

  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ message: "Server error during verification." });
  }
};

// =======================
// Login Controller (Placeholder)
// =======================
const loginController =async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({email});

  // console.log("fetched user Data", user);
  // console.log(await user.matchPassword(password));
  if (user && (await user.matchPassword(password))) {
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateWebtoken(user._id),
    };
    console.log(response);
    res.json(response);
  } else {
    res.status(401);
    throw new Error("Invalid UserName or Password");
  }
};
// =======================
// Get User Info Controller
// =======================
const getUserInfo = async (req, res) => {
  try {
    // req.user is attached by the auth middleware
    res.status(200).json({
      status: "success",
      user: req.user,
    });
  } catch (err) {
    console.error("Get user info error:", err);
    res.status(500).json({ message: "Server error while getting user info." });
  }
};

module.exports = {
  signupController,
  verify,
  loginController,
  verifyLimiter,
  resendLimiter,
  getUserInfo
};
