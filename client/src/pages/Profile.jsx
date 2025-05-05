// Profile.jsx
import { useState, useEffect } from "react"
import { FaEdit, FaCamera } from "react-icons/fa"
import { Link } from "react-router-dom"

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    bio: ""
  })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://appgallery-ta1a.vercel.app/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile(data)
      setFormData({
        username: data.user.username,
        bio: data.user.bio || ""
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePhoto(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      
      const formDataToSend = new FormData()
      formDataToSend.append("username", formData.username)
      formDataToSend.append("bio", formData.bio)
      
      if (profilePhoto) {
        formDataToSend.append("profilePhoto", profilePhoto)
      }

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Refresh profile data
      fetchProfile()
      setEditing(false)
      setProfilePhoto(null)
      setPhotoPreview(null)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              {/* <div className="position-relative mb-4 mx-auto" style={{ width: "150px", height: "150px" }}>
                {editing ? (
                  <>
                  
<img
  src={photoPreview || (profile.user.profilePhoto ? `https://appgallery-ta1a.vercel.app/${profile.user.profilePhoto}` : "/placeholder-user.jpg")}
  alt="Profile"
  className="rounded-circle img-thumbnail"
  style={{ width: "150px", height: "150px", objectFit: "cover" }}
/>


                    <label htmlFor="profile-photo" className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer">
                      <FaCamera />
                      <input
                        type="file"
                        id="profile-photo"
                        className="d-none"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </>
                ) : (
                  <img
                    src={profile.user.profilePhoto ? `https://appgallery-ta1a.vercel.app/${profile.user.profilePhoto}` : "/placeholder-user.jpg"}
                    alt="Profile"
                    className="rounded-circle img-thumbnail"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                )}
              </div> */}
              
              {editing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setEditing(false)
                      setPhotoPreview(null)
                      setFormData({
                        username: profile.user.username,
                        bio: profile.user.bio || ""
                      })
                    }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h3>{profile.user.username}</h3>
                  <p className="text-muted">{profile.user.email}</p>
                  <p>{profile.user.bio || "No bio yet."}</p>
                  <button className="btn btn-primary" onClick={() => setEditing(true)}>
                    <FaEdit className="me-2" /> Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Profile Stats</h4>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col">
                  <h3>{profile.mediaCount}</h3>
                  <p className="text-muted">Media Uploads</p>
                </div>
                <div className="col">
                  <h3>{new Date(profile.user.createdAt).toLocaleDateString()}</h3>
                  <p className="text-muted">Joined Date</p>
                </div>
              </div>
              
              <div className="mt-4">
                <Link to="/gallery" className="btn btn-outline-primary w-100">
                  View My Gallery
                </Link>
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-header">
              <h4>Recent Activity</h4>
            </div>
            <div className="card-body">
              <p>Your recent activity will appear here.</p>
              {profile.mediaCount === 0 ? (
                <div className="alert alert-info">
                  You haven't uploaded any media yet. 
                  <Link to="/upload" className="ms-2">Upload now</Link>
                </div>
              ) : (
                <Link to="/gallery" className="btn btn-outline-primary">
                  View All Media
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
