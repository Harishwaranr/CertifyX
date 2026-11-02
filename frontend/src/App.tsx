import {
  ShieldCheck,
  FilePlus2,
  SearchCheck,
  Award,
  QrCode,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Cloud
} from "lucide-react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import GenerateCertificate from "./pages/GenerateCertificate";
import VerifyCertificate from "./pages/VerifyCertificate";

function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">
          <ShieldCheck size={30} />
          <span>CertifyX</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <Link to="/verify" className="nav-button">
          Verify Certificate
        </Link>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="tag">
              <CheckCircle2 size={15} />
              Secure Digital Certification
            </span>

            <h1>
              Certificates Made
              <span> Simple & Secure.</span>
            </h1>

            <p>
              Generate, manage and verify digital certificates
              with confidence. A smarter way to authenticate
              achievements and credentials.
            </p>

            <div className="hero-buttons">
              <Link to="/generate" className="primary-button">
                <FilePlus2 size={19} />
                Generate Certificate
                <ArrowRight size={17} />
              </Link>

              <Link to="/verify" className="secondary-button">
                <SearchCheck size={19} />
                Verify Certificate
              </Link>
            </div>

            <div className="trust">
              <ShieldCheck size={17} />
              Secure cloud-based certificate management
            </div>
          </div>

          <div className="hero-visual">
            <div className="certificate-card">
              <div className="certificate-top">
                <Award size={48} />
                <span>VERIFIED CREDENTIAL</span>
              </div>

              <div className="certificate-body">
                <small>CERTIFICATE OF COMPLETION</small>
                <h2>Certificate</h2>
                <p>This certificate is proudly presented to</p>
                <h3>Student Name</h3>
                <div className="certificate-line" />
                <p>For successfully completing the course</p>
                <strong>Course Name</strong>
              </div>

              <div className="certificate-bottom">
                <div>
                  <small>Certificate ID</small>
                  <strong>CERT-XXXXXXXX</strong>
                </div>
                <QrCode size={42} />
              </div>
            </div>

            <div className="floating-badge">
              <CheckCircle2 size={19} />
              Authentic & Verified
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <span>OUR FEATURES</span>
            <h2>Everything You Need</h2>
            <p>
              A complete platform for digital certificate management.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FilePlus2 size={27} />
              </div>
              <h3>Certificate Generation</h3>
              <p>
                Generate professional certificates with unique
                identification numbers.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <SearchCheck size={27} />
              </div>
              <h3>Instant Verification</h3>
              <p>
                Verify certificate authenticity using a unique
                Certificate ID.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <QrCode size={27} />
              </div>
              <h3>QR Code Verification</h3>
              <p>
                Scan QR codes to quickly access certificate
                verification details.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Cloud size={27} />
              </div>
              <h3>Cloud Storage</h3>
              <p>
                Store certificate documents securely using
                Amazon Web Services.
              </p>
            </div>
          </div>
        </section>

        <section className="cta" id="about">
          <LockKeyhole size={34} />
          <h2>Trust Every Certificate.</h2>
          <p>
            Making digital credentials easy to issue and
            authenticate.
          </p>

          <Link to="/verify" className="primary-button">
            Verify a Certificate
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <footer>
        <Link to="/" className="logo">
          <ShieldCheck size={24} />
          <span>CertifyX</span>
        </Link>

        <p>Digital Certificate Issuing & Verification System</p>

        <small>© 2026 CertifyX. All rights reserved.</small>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/generate"
          element={<GenerateCertificate />}
        />

        <Route
          path="/verify"
          element={<VerifyCertificate />}
        />

        <Route
          path="/verify/:id"
          element={<VerifyCertificate />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;