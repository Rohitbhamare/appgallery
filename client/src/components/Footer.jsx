function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>MediaGallery</h5>
            <p>A modern platform for storing and sharing your media files.</p>
          </div>
          <div className="col-md-3">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-white">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/upload" className="text-white">
                  Upload
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li>Email: info@mediagallery.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <hr className="bg-white" />
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} MediaGallery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
