
const User = require("../models/User");
const Otp = require("../models/Otp");
const Profile = require("../models/Profile");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();


// ======================================================
// SEND OTP
// ======================================================

exports.sendOtp = async (req, res) => {
    try {
        // Get email from request body
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Check if user already exists
        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already exists",
            });
        }

        // Generate OTP
        let otp = OtpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("otp generated:", otp);

        // Check if OTP is unique
        let result = await Otp.findOne({ otp });

        while (result) {
            otp = OtpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            result = await Otp.findOne({ otp });
        }

        // Create OTP payload
        const otpPayload = {
            email,
            otp,
        };

        // Save OTP in database
        const otpBody = await Otp.create(otpPayload);

        console.log(otpBody);

        // Send response
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.log("SEND OTP ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// SIGN UP
// ======================================================

exports.signUp = async (req, res) => {
    try {
        // Get data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        // Validate required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp
        ) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password does not match",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Find latest OTP
        const recentOtp = await Otp.find({ email })
            .sort({ createdAt: -1 })
            .limit(1);

        console.log("Recent OTP:", recentOtp);

        // Check OTP exists
        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        // Check OTP
        if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: contactNumber || null,
        });

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            contactNumber,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Return response
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user,
        });

    } catch (error) {
        console.log("SIGNUP ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "User cannot register",
        });
    }
};


// ======================================================
// LOGIN
// ======================================================

exports.login = async (req, res) => {
    try {
        // Get data from request body
        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required, try again",
            });
        }

        // Find user
        const user = await User.findOne({ email }).populate(
            "additionalDetails"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Password incorrect",
            });
        }

        // Create JWT payload
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        };

        // Generate token
        const token = JWT.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
            }
        );

        // Add token to user
        user.token = token;
        user.password = undefined;

        // Cookie options
        const options = {
            expires: new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };

        // Send response
        return res
            .cookie("token", token, options)
            .status(200)
            .json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            });

    } catch (error) {
        console.log("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Login failure",
        });
    }
};


// ======================================================
// CHANGE PASSWORD
// ======================================================

exports.changePassword = async (req, res) => {
    try {
        // This function can be implemented later.

        return res.status(200).json({
            success: true,
            message: "Change password API",
        });

    } catch (error) {
        console.log("CHANGE PASSWORD ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to change password",
        });
    }
};




