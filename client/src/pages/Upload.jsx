"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaCloudUploadAlt } from "react-icons/fa"

function Upload() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("caption", formData.caption)
      formDataToSend.append("media", file)

      const response = await fetch("https://appgallery-ta1a.vercel.app/api/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Upload failed")
      }

      // Redirect to gallery on success
      navigate("/gallery")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="upload-container">
        <h2 className="text-center mb-4">Upload Media</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className={`drop-zone ${dragActive ? "bg-light" : ""}`}
            onClick={() => fileInputRef.current.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="d-none"
            />
            <FaCloudUploadAlt className="display-1 text-primary mb-3" />
            <h3>Drag & Drop or Click to Upload</h3>
            <p className="text-muted">Supported formats: JPG, PNG, GIF, MP4, MOV</p>
          </div>

          {preview && (
            <div className="text-center mb-4">
              {file.type.startsWith("video") ? (
                <video src={preview} className="upload-preview" controls />
              ) : (
                <img src={preview || "/placeholder.svg"} alt="Preview" className="upload-preview" />
              )}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="caption" className="form-label">
              Caption
            </label>
            <textarea
              className="form-control"
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading || !file}>
            {loading ? "Uploading..." : "Upload Media"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Upload
