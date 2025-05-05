"use client"

import { useState, useEffect } from "react"
import { FaEdit, FaTrash } from "react-icons/fa"

function Gallery() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingMedia, setEditingMedia] = useState(null)
  const [editForm, setEditForm] = useState({
    title: "",
    caption: "",
  })

  const BASE_URL = "https://appgallery-zl5i.onrender.com"

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch media")
      }

      const data = await response.json()
      setMedia(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (mediaItem) => {
    setEditingMedia(mediaItem._id)
    setEditForm({
      title: mediaItem.title,
      caption: mediaItem.caption,
    })
  }

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/media/${editingMedia}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        throw new Error("Failed to update media")
      }

      fetchMedia()
      setEditingMedia(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}/api/media/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete media")
      }

      setMedia(media.filter((item) => item._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const renderMediaItem = (mediaItem) => {
    const isEditing = editingMedia === mediaItem._id
    const isVideo = mediaItem.mediaType.startsWith("video")
    const mediaSrc = `${BASE_URL}/${mediaItem.mediaPath}`

    return (
      <div className="col-md-4 mb-4" key={mediaItem._id}>
        <div className="media-card">
          {isVideo ? (
            <video className="media-video" controls src={mediaSrc} />
          ) : (
            <img className="media-img" src={mediaSrc} alt={mediaItem.title} />
          )}

          <div className="media-body">
            {isEditing ? (
              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="caption" className="form-label">Caption</label>
                  <textarea
                    className="form-control"
                    id="caption"
                    name="caption"
                    value={editForm.caption}
                    onChange={handleEditChange}
                    rows="3"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingMedia(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h5>{mediaItem.title}</h5>
                <p>{mediaItem.caption}</p>
                <p className="text-muted small">Uploaded on {new Date(mediaItem.createdAt).toLocaleDateString()}</p>
                <div className="media-actions">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(mediaItem)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(mediaItem._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container gallery-container">
      <h1 className="mb-4">Your Media Gallery</h1>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your media...</p>
        </div>
      ) : media.length === 0 ? (
        <div className="alert alert-info">
          <p>You haven't uploaded any media yet.</p>
          <a href="/upload" className="btn btn-primary mt-2">Upload Now</a>
        </div>
      ) : (
        <div className="row">{media.map(renderMediaItem)}</div>
      )}
    </div>
  )
}

export default Gallery
