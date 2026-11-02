
import express from "express";

import {
  PutObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";

import {
  s3Client,
  S3_BUCKET_NAME
} from "../config/s3";

const router = express.Router();

// ==========================================
// VALIDATE CERTIFICATE ID
// ==========================================

const isValidCertificateId = (id: string): boolean => {
  return /^[a-zA-Z0-9_-]+$/.test(id);
};

// ==========================================
// TEST S3 CONNECTION
// ==========================================

router.get("/test", (_req, res) => {
  return res.status(200).json({
    status: "success",
    message: "S3 routes are working!"
  });
});

// ==========================================
// UPLOAD CERTIFICATE PDF TO AWS S3
// ==========================================

router.post("/upload", async (req, res) => {
  try {
    const { certificateId, pdfBase64 } = req.body;

    // Validate required fields
    if (!certificateId || !pdfBase64) {
      return res.status(400).json({
        status: "error",
        message: "Certificate ID and PDF data are required."
      });
    }

    // Validate certificate ID
    if (
      typeof certificateId !== "string" ||
      !isValidCertificateId(certificateId)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid certificate ID."
      });
    }

    // Validate PDF data
    if (typeof pdfBase64 !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Invalid PDF data."
      });
    }

    // Support raw Base64 and PDF data URL
    const cleanBase64 = pdfBase64
      .replace(/^data:application\/pdf;base64,/i, "")
      .replace(/\s/g, "");

    // Validate Base64 format
    const base64Regex =
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

    if (
      !cleanBase64 ||
      !base64Regex.test(cleanBase64)
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Base64 data."
      });
    }

    // Convert Base64 into PDF Buffer
    const pdfBuffer = Buffer.from(cleanBase64, "base64");

    // Validate PDF signature
    if (pdfBuffer.subarray(0, 5).toString() !== "%PDF-") {
      return res.status(400).json({
        status: "error",
        message: "Invalid PDF file."
      });
    }

    // Generate S3 file path
    const fileName = `certificates/${certificateId}.pdf`;

    // Create S3 upload command
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName,
      Body: pdfBuffer,
      ContentType: "application/pdf"
    });

    // Upload PDF to AWS S3
    await s3Client.send(command);

    console.log("PDF uploaded successfully:", fileName);

    return res.status(200).json({
      status: "success",
      message: "Certificate uploaded successfully to AWS S3.",
      certificateId,
      fileName,
      bucket: S3_BUCKET_NAME
    });

  } catch (error) {
    console.error("S3 upload error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to upload certificate PDF to AWS S3."
    });
  }
});

// ==========================================
// DOWNLOAD CERTIFICATE PDF FROM AWS S3
// ==========================================

router.get("/download/:certificateId", async (req, res) => {
  try {

    // Convert route parameter to string
    const certificateId = String(
      req.params.certificateId ?? ""
    );

    console.log("S3 download requested:", certificateId);

    // Validate certificate ID
    if (!isValidCertificateId(certificateId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid certificate ID."
      });
    }

    // Generate S3 file path
    const fileName = `certificates/${certificateId}.pdf`;

    // Create S3 download command
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileName
    });

    // Retrieve PDF from AWS S3
    const result = await s3Client.send(command);

    // Check whether file exists
    if (!result.Body) {
      return res.status(404).json({
        status: "error",
        message: "Certificate PDF not found in S3."
      });
    }

    // Convert S3 response into Buffer
    const pdfBytes = await result.Body.transformToByteArray();

    const pdfBuffer = Buffer.from(pdfBytes);

    // Set PDF response headers
    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${certificateId}.pdf"`
    );

    res.setHeader("Content-Length", pdfBuffer.length);

    res.setHeader("Cache-Control", "no-store");

    // Send PDF to browser
    console.log("PDF downloaded successfully:", fileName);

    return res.status(200).end(pdfBuffer);

  } catch (error: any) {

    console.error("S3 download error:", error);

    // Handle missing S3 object
    if (
      error?.name === "NoSuchKey" ||
      error?.name === "NotFound" ||
      error?.$metadata?.httpStatusCode === 404
    ) {
      return res.status(404).json({
        status: "error",
        message: "Certificate PDF not found in AWS S3."
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to download certificate PDF from AWS S3."
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

export default router;
