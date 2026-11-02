
import { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import {
  FilePlus2,
  Download,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

export interface Certificate {
  certificateId: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  organization: string;
  issueDate: string;
}

// Live AWS ECS backend URL
const API_BASE_URL =
  "https://ce-110abb7a64534905ac3d5de093af6dde.ecs.ap-south-1.on.aws";

function GenerateCertificate() {
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    courseName: "",
    organization: "",
    issueDate: new Date().toISOString().split("T")[0]
  });

  const [certificateId, setCertificateId] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const generateCertificate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setCertificateId("");
    setIsSaving(true);

    try {
      // Step 1: Generate a unique certificate ID.
      const id =
        "CERT-" +
        crypto.randomUUID()
          .replaceAll("-", "")
          .slice(0, 12)
          .toUpperCase();

      const certificate: Certificate = {
        certificateId: id,
        studentName: form.studentName.trim(),
        studentEmail: form.studentEmail.trim(),
        courseName: form.courseName.trim(),
        organization: form.organization.trim(),
        issueDate: form.issueDate
      };

      // Step 2: Save certificate details to AWS DynamoDB.
      const response = await fetch(
        `${API_BASE_URL}/api/certificates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(certificate)
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message ||
          "Failed to save certificate to AWS."
        );
      }

      // Step 3: Generate the verification QR code.
      const verificationUrl =
        `${window.location.origin}/verify/${id}`;

      const qrCode = await QRCode.toDataURL(verificationUrl);

      // Step 4: Generate the certificate PDF.
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      // Certificate border.
      pdf.setDrawColor(36, 87, 197);
      pdf.setLineWidth(2);
      pdf.rect(10, 10, 277, 190);

      // Certificate heading.
      pdf.setTextColor(36, 87, 197);
      pdf.setFontSize(26);
      pdf.text(
        "CERTIFICATE OF COMPLETION",
        148.5,
        43,
        { align: "center" }
      );

      // Recipient introduction.
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(14);
      pdf.text(
        "This certificate is proudly presented to",
        148.5,
        68,
        { align: "center" }
      );

      // Student name.
      pdf.setFontSize(28);
      pdf.setTextColor(20, 40, 80);
      pdf.text(
        certificate.studentName,
        148.5,
        88,
        { align: "center" }
      );

      // Course information.
      pdf.setFontSize(14);
      pdf.setTextColor(60, 60, 60);
      pdf.text(
        "For successfully completing the course",
        148.5,
        108,
        { align: "center" }
      );

      pdf.setFontSize(22);
      pdf.setTextColor(36, 87, 197);
      pdf.text(
        certificate.courseName,
        148.5,
        126,
        { align: "center" }
      );

      // Organization.
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      pdf.text(
        `Organization: ${certificate.organization}`,
        148.5,
        145,
        { align: "center" }
      );

      // Issue date.
      pdf.text(
        `Issue Date: ${certificate.issueDate}`,
        148.5,
        157,
        { align: "center" }
      );

      // Certificate ID.
      pdf.setFontSize(10);
      pdf.text(
        `Certificate ID: ${id}`,
        25,
        183
      );

      // QR code.
      pdf.addImage(
        qrCode,
        "PNG",
        250,
        155,
        25,
        25
      );

      // Step 5: Download the PDF.
      pdf.save(`${id}.pdf`);

      setCertificateId(id);

    } catch (err) {
      console.error(
        "Certificate generation failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate certificate. Please try again."
      );

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="generator-page">
      <nav className="generator-nav">
        <Link to="/" className="logo">
          <ShieldCheck size={28} />
          CertifyX
        </Link>

        <Link to="/" className="back-link">
          <ArrowLeft size={17} />
          Back to Home
        </Link>
      </nav>

      <div className="generator-container">
        <div className="generator-heading">
          <span>ADMINISTRATION</span>
          <h1>Generate Certificate</h1>
          <p>
            Enter recipient details to create a digital certificate.
          </p>
        </div>

        <form
          className="certificate-form"
          onSubmit={generateCertificate}
        >
          <div className="form-group">
            <label>Student Name</label>
            <input
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              placeholder="Enter student's full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Student Email</label>
            <input
              type="email"
              name="studentEmail"
              value={form.studentEmail}
              onChange={handleChange}
              placeholder="Enter student's email"
              required
            />
          </div>

          <div className="form-group">
            <label>Course Name</label>
            <input
              name="courseName"
              value={form.courseName}
              onChange={handleChange}
              placeholder="Enter course name"
              required
            />
          </div>

          <div className="form-group">
            <label>Organization Name</label>
            <input
              name="organization"
              value={form.organization}
              onChange={handleChange}
              placeholder="Enter organization name"
              required
            />
          </div>

          <div className="form-group">
            <label>Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="generate-button"
            disabled={isSaving}
          >
            <FilePlus2 size={19} />

            {isSaving
              ? "Saving to AWS..."
              : "Generate & Download Certificate"}
          </button>
        </form>

        {certificateId && (
          <div className="generated-result">
            <ShieldCheck size={35} />

            <h2>Certificate Generated!</h2>

            <p>
              Your certificate PDF has been downloaded.
            </p>

            <strong>
              Certificate ID: {certificateId}
            </strong>

            <p className="result-note">
              Your certificate details have been registered
              in AWS DynamoDB and are ready for verification.
            </p>

            <Link
              to={`/verify/${certificateId}`}
              className="generate-button"
              style={{
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <ShieldCheck size={18} />
              Verify This Certificate
            </Link>

            <button
              type="button"
              onClick={() => {
                setCertificateId("");
                setError("");

                setForm({
                  studentName: "",
                  studentEmail: "",
                  courseName: "",
                  organization: "",
                  issueDate: new Date()
                    .toISOString()
                    .split("T")[0]
                });
              }}
              className="generate-button"
              style={{ marginTop: "12px" }}
            >
              <Download size={18} />
              Generate Another Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateCertificate;
