
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// AWS region
// Locally, credentials are loaded from the AWS environment.
// On ECS, credentials are automatically provided by the IAM Task Role.
const region = process.env.AWS_REGION || "ap-south-1";

// Create S3 client
export const s3Client = new S3Client({
  region,
});

// S3 bucket name
export const S3_BUCKET_NAME =
  process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME;

if (!S3_BUCKET_NAME) {
  throw new Error("S3_BUCKET_NAME is missing from environment variables");
}
