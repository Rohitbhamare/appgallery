const express = require("express")
const router = express.Router()
const { uploadMedia, getMedia, getMediaById, updateMedia, deleteMedia } = require("../controllers/mediaController")
const { protect } = require("../middleware/auth")
const { upload } = require("../middleware/upload")

// Upload media
router.post("/upload", protect, upload.single("media"), uploadMedia)

// Get all media for a user
router.get("/", protect, getMedia)

// Get a single media item
router.get("/:id", protect, getMediaById)

// Update media
router.put("/:id", protect, updateMedia)

// Delete media
router.delete("/:id", protect, deleteMedia)

module.exports = router
