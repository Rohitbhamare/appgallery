const Media = require("../models/Media")
const fs = require("fs")
const path = require("path")

// @desc    Upload media
// @route   POST /api/media/upload
// @access  Private
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, caption } = req.body;

    // ✅ Store only the relative path for web access
    const relativePath = `uploads/${req.file.filename}`;

    const media = await Media.create({
      user: req.user.id,
      title,
      caption,
      mediaPath: relativePath,
      mediaType: req.file.mimetype,
    });

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all media for a user
// @route   GET /api/media
// @access  Private
exports.getMedia = async (req, res) => {
  try {
    const media = await Media.find({ user: req.user.id }).sort({ createdAt: -1 })

    res.json(media)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get a single media item
// @route   GET /api/media/:id
// @access  Private
exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)

    // Check if media exists
    if (!media) {
      return res.status(404).json({ message: "Media not found" })
    }

    // Check if user owns the media
    if (media.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    res.json(media)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update media
// @route   PUT /api/media/:id
// @access  Private
exports.updateMedia = async (req, res) => {
  try {
    const { title, caption } = req.body

    const media = await Media.findById(req.params.id)

    // Check if media exists
    if (!media) {
      return res.status(404).json({ message: "Media not found" })
    }

    // Check if user owns the media
    if (media.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Update media
    media.title = title || media.title
    media.caption = caption || media.caption

    const updatedMedia = await media.save()

    res.json(updatedMedia)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)

    // Check if media exists
    if (!media) {
      return res.status(404).json({ message: "Media not found" })
    }

    // Check if user owns the media
    if (media.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" })
    }

    // Delete file from filesystem
    if (fs.existsSync(media.mediaPath)) {
      fs.unlinkSync(media.mediaPath)
    }

    // Delete from database
    await media.deleteOne()

    res.json({ message: "Media removed" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
