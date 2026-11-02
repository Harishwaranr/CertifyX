
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ShieldCheck,
  SearchCheck,
  ArrowLeft,
  XCircle,
  CheckCircle2,
  LoaderCircle
} from "lucide-react";

import type { Certificate } from "./GenerateCertificate";

// Live AWS ECS backend URL
const API_BASE_URL =
  "https://ce-110abb7a64534905ac3d5de093af6dde.ecs.ap-south-1.on.aws";

type VerificationStatus =
  | "idle"
  | "empty"
  | "checking"
  | "valid"
  | "invalid"
  | "error";

function VerifyCertificate() {
  const { id } = useParams<{ id: string }>();

  const [certificateId, setCertificateId] = useState(
    id ? decodeURIComponent(id).toUpperCase() : ""
  );

  const [status, setStatus] =
    useState<VerificationStatus>("idle");

  const [certificate, setCertificate] =
    useState<Certificate | null>(null);

  // Verify a certificate using AWS DynamoDB through the backend.
  const verifyCertificate = async (value: string) => {
    const enteredId = value.trim().toUpperCase();

    if (!enteredId) {
      setCertificate(null);
      setStatus("empty");
      return;
    }

    setStatus("checking");
    setCertificate(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/certificates/${encodeURIComponent(
          enteredId
        )}`
      );

      if (response.status === 404) {
        setStatus("invalid");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to contact the verification service."
        );
      }

      const result: Certificate = await response.json();

      if (
        !result ||
        !result.certificateId ||
        result.certificateId.toUpperCase() !== enteredId
      ) {
        setStatus("invalid");
        return;
      }

      setCertificate(result);
      setStatus("valid");
    } catch (error) {
      console.error("Certificate verification error:", error);
      setCertificate(null);
      setStatus("error");
    }
  };

  // Automatically verify when someone opens a QR verification link.
  useEffect(() => {
    if (!id) return;

    const decodedId = decodeURIComponent(id).toUpperCase();

    const timer = window.setTimeout(() => {
      setCertificateId(decodedId);
      void verifyCertificate(decodedId);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [id]);

  const handleVerify = () => {
    void verifyCertificate(certificateId);
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-icon">
          <ShieldCheck size={42} />
        </div>

        <h1>Verify Certificate</h1>

        <p>
          Enter your unique Certificate ID to check its authenticity.
        </p>

        <label htmlFor="certificateId">
          Certificate ID
        </label>

        <input
          id="certificateId"
          type="text"
          placeholder="Enter Certificate ID"
          value={certificateId}
          onChange={(e) => {
            setCertificateId(e.target.value);
            setStatus("idle");
            setCertificate(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleVerify();
            }
          }}
        />

        <button
          onClick={handleVerify}
          disabled={status === "checking"}
        >
          {status === "checking" ? (
            <LoaderCircle size={20} />
          ) : (
            <SearchCheck size={20} />
          )}

          {status === "checking"
            ? "Checking AWS..."
            : "Verify Certificate"}
        </button>

        {status === "empty" && (
          <p className="error-message">
            Please enter a Certificate ID.
          </p>
        )}

        {status === "checking" && (
          <p>
            Checking certificate records in AWS DynamoDB...
          </p>
        )}

        {status === "valid" && certificate && (
          <div className="verification-result verified-result">
            <CheckCircle2 size={38} />

            <h3>Certificate Verified!</h3>

            <p>
              This certificate is registered in AWS DynamoDB
              and its Certificate ID matches the requested record.
            </p>

            <div className="certificate-details">
              <p>
                <strong>Certificate ID:</strong>{" "}
                {certificate.certificateId}
              </p>

              <p>
                <strong>Student Name:</strong>{" "}
                {certificate.studentName}
              </p>

              <p>
                <strong>Student Email:</strong>{" "}
                {certificate.studentEmail}
              </p>

              <p>
                <strong>Course:</strong>{" "}
                {certificate.courseName}
              </p>

              <p>
                <strong>Organization:</strong>{" "}
                {certificate.organization}
              </p>

              <p>
                <strong>Issue Date:</strong>{" "}
                {certificate.issueDate}
              </p>
            </div>
          </div>
        )}

        {status === "invalid" && (
          <div className="verification-result invalid-result">
            <XCircle size={35} />

            <h3>Invalid Certificate</h3>

            <p>
              No registered certificate was found with this ID.
              Please check the Certificate ID and try again.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="verification-result invalid-result">
            <XCircle size={35} />

            <h3>Verification Service Unavailable</h3>

            <p>
              We could not connect to the certificate verification
              service. Please make sure the backend is running
              and try again.
            </p>
          </div>
        )}

        <Link to="/" className="back-link">
          <ArrowLeft size={17} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default VerifyCertificate;
