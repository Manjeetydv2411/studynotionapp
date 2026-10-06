// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")


console.log("capturePayment:", typeof capturePayment);
console.log("auth:", typeof auth);
console.log("isStudent:", typeof isStudent);
console.log("verifyPayment:", typeof verifyPayment);
console.log("sendPaymentSuccessEmail:", typeof sendPaymentSuccessEmail);

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);



module.exports = router