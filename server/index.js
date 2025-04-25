const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const dotenv = require("dotenv")

dotenv.config()

const userRoutes = require("./routes/users")
const mediaRoutes = require("./routes/media")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads"))) // <-- for image access
    

app.use("/api/users", userRoutes)
app.use("/api/media", mediaRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
