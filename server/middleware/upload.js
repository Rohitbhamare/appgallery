const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)  // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    // Use current timestamp to ensure unique file names
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

// File filter function to accept only images and videos
const fileFilter = (req, file, cb) => {
  const isValid = file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")
  if (isValid) {
    cb(null, true)  // Accept the file
  } else {
    cb(new Error("Only image and video files are allowed!"), false)  // Reject the file
  }
}

// Initialize multer with storage configuration, file size limit, and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,  // 10MB size limit
  },
  fileFilter: fileFilter,
})

module.exports = { upload }
