
import "dotenv/config";

import express from "express";
import cors from "cors";

import {
  DynamoDBClient,
  DescribeTableCommand
} from "@aws-sdk/client-dynamodb";

import certificateRoutes from "./certificateRoutes";
import s3Routes from "./routes/s3Routes";

// ==========================================
// INITIALIZE EXPRESS APPLICATION
// ==========================================

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json({ limit: "20mb" }));

app.use(express.urlencoded({
  extended: true,
  limit: "20mb"
}));

// Request logger
app.use((req, _res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (_req, res) => {
  return res.status(200).json({
    status: "success",
    message: "CertifyX Backend is running!"
  });
});

// ==========================================
// CERTIFICATE ROUTES
// ==========================================

app.use("/api/certificates", certificateRoutes);

// ==========================================
// AWS S3 ROUTES
// ==========================================

// All routes inside s3Routes.ts are prefixed with /api/s3

app.use("/api/s3", s3Routes);

// S3 route verification
app.get("/api/s3", (_req, res) => {
  return res.status(200).json({
    status: "success",
    message: "AWS S3 API is working!",
    availableRoutes: [
      "GET /api/s3/test",
      "POST /api/s3/upload",
      "GET /api/s3/download/:certificateId"
    ]
  });
});

// ==========================================
// DYNAMODB CLIENT
// ==========================================

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1"
});

// ==========================================
// DYNAMODB HEALTH CHECK
// ==========================================

app.get("/api/health", async (_req, res) => {
  try {
    const tableName = process.env.DYNAMODB_TABLE;

    if (!tableName) {
      return res.status(500).json({
        status: "error",
        message: "DYNAMODB_TABLE is not configured in .env"
      });
    }

    const result = await dynamoClient.send(
      new DescribeTableCommand({
        TableName: tableName
      })
    );

    return res.status(200).json({
      status: "connected",
      database: "AWS DynamoDB",
      table: result.Table?.TableName,
      tableStatus: result.Table?.TableStatus
    });

  } catch (error) {
    console.error("DynamoDB connection error:", error);

    return res.status(500).json({
      status: "error",
      message: "Could not connect to DynamoDB"
    });
  }
});

// ==========================================
// HANDLE UNKNOWN ROUTES
// ==========================================

app.use((req, res) => {
  console.log(
    "404 - Route not found:",
    req.method,
    req.originalUrl
  );

  return res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((
  error: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  console.error("Backend error:", error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log("------------------------------------------");
  console.log("       CertifyX Backend Started");
  console.log("------------------------------------------");

  console.log(`Server: http://localhost:${PORT}`);

  console.log("\nCERTIFICATE API:");
  console.log("GET/POST /api/certificates");

  console.log("\nAWS S3 API:");
  console.log("GET  /api/s3/test");
  console.log("POST /api/s3/upload");
  console.log("GET  /api/s3/download/:certificateId");

  console.log("\nDYNAMODB API:");
  console.log("GET  /api/health");

  console.log("------------------------------------------");
});
