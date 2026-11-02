
import express from "express";
import dotenv from "dotenv";

import {
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

import { dynamoDB } from "./config/database";

// Load environment variables
dotenv.config();

const router = express.Router();

// DynamoDB table configuration
const TABLE_NAME = process.env.DYNAMODB_TABLE;

if (!TABLE_NAME) {
  throw new Error("DYNAMODB_TABLE is missing from the .env file");
}

// Save a certificate to DynamoDB
router.post("/", async (req, res) => {
  try {
    const certificate = req.body;

    // Validate certificate ID
    if (!certificate || !certificate.certificateId) {
      return res.status(400).json({
        message: "Certificate ID is required",
      });
    }

    // Save certificate in DynamoDB
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          ...certificate,
          createdAt: new Date().toISOString(),
        },
      })
    );

    return res.status(201).json({
      message: "Certificate saved successfully",
      certificateId: certificate.certificateId,
    });

  } catch (error) {
    console.error("Save certificate error:", error);

    return res.status(500).json({
      message: "Failed to save certificate",
    });
  }
});

// Get a certificate by Certificate ID
router.get("/:id", async (req, res) => {
  try {
    const certificateId = req.params.id;

    // Retrieve certificate from DynamoDB
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          certificateId: certificateId,
        },
      })
    );

    // Check whether certificate exists
    if (!result.Item) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    return res.status(200).json(result.Item);

  } catch (error) {
    console.error("Get certificate error:", error);

    return res.status(500).json({
      message: "Failed to retrieve certificate",
    });
  }
});

export default router;
