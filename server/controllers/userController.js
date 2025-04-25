const User = require("../models/User");
const Media = require("../models/Media"); // Make sure you import the correct Media model
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Authenticate user & get token
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Send user data and token
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user profile with media count
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const mediaCount = await Media.countDocuments({ user: req.user.id });

    res.json({ user, mediaCount });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
// exports.updateUserProfile = async (req, res) => {
//   try {
//     const { username, bio } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update fields if provided
//     if (username) user.username = username;
//     if (bio) user.bio = bio;

//     // If file is uploaded, update profile photo
//     if (req.file) {
//       user.profilePhoto = req.file.path.replace("uploads/", "");
//     }

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       username: updatedUser.username,
//       email: updatedUser.email,
//       profilePhoto: updatedUser.profilePhoto,
//       bio: updatedUser.bio,
//     });
//   } catch (error) {
//     console.error("Profile update error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Update user profile
// controllers/userController.js (or wherever updateUserProfile is located)
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (bio) user.bio = bio;

    // If file is uploaded, update profile photo
    if (req.file) {
      user.profilePhoto = req.file.filename;  // Save only the filename, not the absolute path
    }

    const updatedUser = await user.save();

    // Send back the updated user info with the relative path
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePhoto: `/uploads/${updatedUser.profilePhoto}`, // The URL to access the photo
      bio: updatedUser.bio,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: error.message });
  }
};

