
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

dotenv.config();

// AWS region
const region = process.env.AWS_REGION || "ap-south-1";

// Create DynamoDB client.
// Locally, AWS SDK can use environment credentials.
// On ECS, AWS SDK automatically uses the IAM Task Role.
const awsClient = new DynamoDBClient({
  region,
});

// Create DynamoDB Document Client
export const dynamoDB = DynamoDBDocumentClient.from(awsClient);

// Export AWS client
export { awsClient };
