const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");
const Profile = require("./models/Profile");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("Database connected");

        const existingAdmin = await User.findOne({
            accountType: "admin",
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const firstName = "Admin";
        const lastName = "User";
        const email = "admin@studynotion.com";
        const password = "Admin@123";

        const hashedPassword = await bcrypt.hash(password, 10);

        const profile = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: "StudyNotion Administrator",
            contactNumber: null,
        });

        const admin = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType: "admin",
            additionalDetails: profile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        console.log("Admin created successfully");
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Admin ID:", admin._id);

        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();