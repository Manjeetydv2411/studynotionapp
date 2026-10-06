const mongoose = require("mongoose");
const mailSender = require("../utils/mailsender");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    otp: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60,
    },
});

// Function to send verification email
async function sendverificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email From StudyNotion",
            `Your OTP for StudyNotion is: ${otp}`
        );

        console.log("email sent successfully", mailResponse);
    } catch (error) {
        console.log("error while sending the email", error);
        throw error;
    }
}

// Send email before saving OTP
otpSchema.pre("save", async function () {
    await sendverificationEmail(this.email, this.otp);
});

module.exports = mongoose.model("Otp", otpSchema);