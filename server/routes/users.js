const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { protect } = require("../middleware/auth")
const { upload } = require("../middleware/upload")

// Public routes
router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)

// Protected routes
router.get("/me", protect, userController.getMe)
router.get("/verify", protect, userController.verifyToken)

// Profile routes
router.get("/profile", protect, userController.getUserProfile)
router.put("/profile", protect, upload.single("profilePhoto"), userController.updateUserProfile)

module.exports = router
