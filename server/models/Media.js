const mongoose = require("mongoose")

const MediaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  caption: {
    type: String,
    trim: true,
  },
  mediaPath: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Media", MediaSchema)
