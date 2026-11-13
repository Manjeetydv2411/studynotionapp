const jwt = require("jsonwebtoken")
require("dotenv").config()
const user = require("../models/User")

// auth
exports.auth = async (req, res, next) => {
    try {
        // Extract token
        const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.cookies.token ||
    req.body.token

console.log("AUTH TOKEN SOURCE:", req.header("Authorization") ? "HEADER" : "OTHER")
console.log("TOKEN EXISTS:", !!token)
console.log("TOKEN PARTS:", token ? token.split(".").length : 0)
console.log("VERIFY TOKEN LENGTH:", token ? token.length : 0)

        // If token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing",
            })
        }
console.log("JWT SECRET LOADED:", !!process.env.JWT_SECRET)
console.log("VERIFY JWT SECRET LOADED:", !!process.env.JWT_SECRET)
console.log("VERIFY JWT SECRET LENGTH:", process.env.JWT_SECRET?.length)
        // Verify token
        try {
            const decode = await jwt.verify(
                token,
                process.env.JWT_SECRET
            )

            console.log(decode)
            req.user = decode

        }  catch (error) {
    console.log("JWT VERIFY ERROR:", error.message)

    return res.status(401).json({
        success: false,
        message: "token is invalid",
    })
}

        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "something went wrong",
        })
    }
}


// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        console.log("IS STUDENT CHECK:", req.user.accountType)

        if (req.user.accountType !== "student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Students only",
            })
        }

        next()

    } catch (error) {
        console.log("IS STUDENT ERROR:", error)

        return res.status(401).json({
            success: false,
            message: "role is invalid",
        })
    }
}


// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor only",
            })
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "role is invalid",
        })
    }
}


// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only",
            })
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "role is invalid",
        })
    }
}


// isAdminOrInstructor
exports.isAdminOrInstructor = async (req, res, next) => {
    try {
        if (
            req.user.accountType !== "admin" &&
            req.user.accountType !== "instructor"
        ) {
            return res.status(401).json({
                success: false,
                message: "Only Admin or Instructor can access this route",
            })
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Role is invalid",
        })
    }
}