import { Link } from "react-router-dom"
import { FaCloudUploadAlt, FaImages, FaUserFriends } from "react-icons/fa"

function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4">Store & Share Your Memories</h1>
          <p className="lead mb-5">A modern platform for uploading, organizing, and sharing your photos and videos.</p>
          <div>
            <Link to="/register" className="btn btn-light btn-lg me-3">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose MediaGallery?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card feature-card p-4">
                <div className="text-center">
                  <FaCloudUploadAlt className="feature-icon" />
                  <h3>Easy Uploads</h3>
                  <p>Quickly upload your photos and videos with our modern, drag-and-drop interface.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card feature-card p-4">
                <div className="text-center">
                  <FaImages className="feature-icon" />
                  <h3>Organized Gallery</h3>
                  <p>Keep your media organized and easily accessible in a beautiful gallery.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card feature-card p-4">
                <div className="text-center">
                  <FaUserFriends className="feature-icon" />
                  <h3>Secure Storage</h3>
                  <p>Your memories are safe with us. We use the latest security measures.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="mb-4">Ready to get started?</h2>
          <p className="lead mb-4">Join thousands of users who trust MediaGallery with their precious memories.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing
