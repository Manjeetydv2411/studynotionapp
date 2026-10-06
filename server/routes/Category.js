const express = require("express");

const {
    createCategory,
    showAllCategories,
    categoryPageDetails,
} = require("../controllers/Category");

const { auth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/createCategory", auth, isAdmin, createCategory);

router.get("/showAllCategories", showAllCategories);

router.post("/categoryPageDetails", categoryPageDetails);

module.exports = router;