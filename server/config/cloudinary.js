const cloudinary = require("cloudinary").v2;

exports.cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        });

        console.log("Cloudinary configured successfully");

        console.log("Cloudinary config check:", {
            cloud_name: cloudinary.config().cloud_name ? "LOADED" : "MISSING",
            api_key: cloudinary.config().api_key ? "LOADED" : "MISSING",
            api_secret: cloudinary.config().api_secret ? "LOADED" : "MISSING",
        });

    } catch (error) {
        console.log("Cloudinary config error:", error);
    }
};