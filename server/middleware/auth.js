const jwt = require("jsonwebtoken")
const User = require("../models/User")

const protect = async (req, res, next) => {
  let token

  try {
    // Check if authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      // Extract token
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Attach user to request, excluding password
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        return res.status(401).json({ message: "User not found" })
      }

      return next()
    }

    // If no token found
    return res.status(401).json({ message: "Not authorized, no token" })
  } catch (error) {
    console.error("Auth middleware error:", error)
    return res.status(401).json({ message: "Not authorized, token failed" })
  }
}

module.exports = { protect }
