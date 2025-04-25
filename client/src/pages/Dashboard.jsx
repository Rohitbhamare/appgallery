import { Link } from "react-router-dom"
import { FaImages, FaUpload, FaUser } from "react-icons/fa"

function Dashboard({ user }) {
  return (
    <div className="container py-5">
      <div className="welcome-banner mb-5">
        <h1>Welcome, {user?.username}!</h1>
        <p className="lead">Manage your media collection and upload new content.</p>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card dashboard-card h-100">
            <div className="card-body text-center p-4">
              <FaImages className="display-1 text-primary mb-3" />
              <h3>View Gallery</h3>
              <p>Browse through all your uploaded photos and videos.</p>
              <Link to="/gallery" className="btn btn-primary mt-3">
                Go to Gallery
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card dashboard-card h-100">
            <div className="card-body text-center p-4">
              <FaUpload className="display-1 text-success mb-3" />
              <h3>Upload Media</h3>
              <p>Add new photos and videos to your collection.</p>
              <Link to="/upload" className="btn btn-success mt-3">
                Upload Now
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card dashboard-card h-100">
            <div className="card-body text-center p-4">
              <FaUser className="display-1 text-info mb-3" />
              <h3>Account Info</h3>
              <p>View and manage your account details.</p>
              <Link to="/profile" className="btn btn-info mt-3">
  View Profile
</Link>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  )
}

export default Dashboard
