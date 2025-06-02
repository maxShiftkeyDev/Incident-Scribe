import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient();
const INCIDENTS_TABLE = process.env.INCIDENTS_TABLE;

export async function handler(event) {
  console.log("=== Incoming event ===", JSON.stringify(event, null, 2));
  const { httpMethod, path, pathParameters } = event;

  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  try {
    // GET all incidents
    if (httpMethod === "GET" && path?.endsWith("/incidents")) {
      console.log("Handling GET /incidents");
      const command = new ScanCommand({ TableName: INCIDENTS_TABLE });
      const result = await client.send(command);
      console.log("DynamoDB Scan result:", JSON.stringify(result, null, 2));

      const incidents = result.Items.map((item) => unmarshall(item));
      console.log(
        "Unmarshalled incidents:",
        JSON.stringify(incidents, null, 2)
      );
      return response(200, incidents);
    }

    // POST new incident
    if (httpMethod === "POST" && path?.endsWith("/incidents")) {
      console.log("Handling POST /incidents");
      const body = JSON.parse(event.body);
      console.log("Parsed body:", JSON.stringify(body, null, 2));

      if (!body.incidentId) {
        console.warn("Missing required field: incidentId");
        return response(400, { message: "Missing required field: incidentId" });
      }

      const item = {
        incidentId: body.incidentId,
        title: body.title || "Untitled Incident",
        description: body.description || "",
        status: body.status || "open",
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: body.updatedAt || new Date().toISOString(),
        context: body.context || {},
      };

      console.log("Final item to put:", JSON.stringify(item, null, 2));

      const command = new PutItemCommand({
        TableName: INCIDENTS_TABLE,
        Item: marshall(item),
      });

      const putResult = await client.send(command);
      console.log(
        "DynamoDB PutItem result:",
        JSON.stringify(putResult, null, 2)
      );

      return response(201, {
        message: "Incident created",
        incidentId: item.incidentId,
      });
    }

    // PUT /incidents/{incidentId}/context to update the context field
    if (
      httpMethod === "PUT" &&
      path?.match(/^\/incidents\/[a-zA-Z0-9-]+\/context$/)
    ) {
      console.log("Handling PUT /incidents/{id}/context");
      console.log("PathParameters:", JSON.stringify(pathParameters, null, 2));
      const incidentId = pathParameters?.incidentId;
      console.log("Extracted incidentId:", incidentId);

      const body = JSON.parse(event.body);
      console.log("Parsed body:", JSON.stringify(body, null, 2));

      if (!body.context) {
        console.warn("Missing 'context' in request body");
        return response(400, { message: "Missing 'context' in request body" });
      }

      const updateCommand = new UpdateItemCommand({
        TableName: INCIDENTS_TABLE,
        Key: marshall({ incidentId }),
        UpdateExpression: "SET #ctx = :ctx, updatedAt = :updatedAt",
        ExpressionAttributeNames: { "#ctx": "context" },
        ExpressionAttributeValues: marshall({
          ":ctx": body.context,
          ":updatedAt": new Date().toISOString(),
        }),
        ReturnValues: "ALL_NEW",
      });

      console.log("UpdateItemCommand:", JSON.stringify(updateCommand, null, 2));
      const result = await client.send(updateCommand);
      console.log(
        "DynamoDB UpdateItem result:",
        JSON.stringify(result, null, 2)
      );

      const updatedItem = unmarshall(result.Attributes);
      console.log(
        "Unmarshalled updated item:",
        JSON.stringify(updatedItem, null, 2)
      );
      return response(200, {
        message: "Incident context updated",
        context: updatedItem.context,
      });
    }

    // PUT /incidents/{incidentId}/status to update the status field
    if (
      httpMethod === "PUT" &&
      path?.match(/^\/incidents\/[a-zA-Z0-9-]+\/status$/)
    ) {
      console.log("Handling PUT /incidents/{id}/status");
      console.log("PathParameters:", JSON.stringify(pathParameters, null, 2));
      const incidentId = pathParameters?.incidentId;
      console.log("Extracted incidentId:", incidentId);

      const body = JSON.parse(event.body);
      console.log("Parsed body:", JSON.stringify(body, null, 2));

      if (!body.status || !["open", "closed"].includes(body.status)) {
        console.warn("Invalid or missing 'status' in request body");
        return response(400, {
          message: "Invalid or missing 'status' in request body",
        });
      }

      const updateCommand = new UpdateItemCommand({
        TableName: INCIDENTS_TABLE,
        Key: marshall({ incidentId }),
        UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: marshall({
          ":status": body.status,
          ":updatedAt": new Date().toISOString(),
        }),
        ReturnValues: "ALL_NEW",
      });

      console.log("UpdateItemCommand:", JSON.stringify(updateCommand, null, 2));
      const result = await client.send(updateCommand);
      console.log(
        "DynamoDB UpdateItem result:",
        JSON.stringify(result, null, 2)
      );

      const updatedItem = unmarshall(result.Attributes);
      console.log(
        "Unmarshalled updated item:",
        JSON.stringify(updatedItem, null, 2)
      );
      return response(200, {
        message: "Incident status updated",
        status: updatedItem.status,
      });
    }

    console.warn("No matching route for path/method:", httpMethod, path);
    return response(404, { message: "Not Found" });
  } catch (error) {
    console.error("Handler error:", error);
    return response(500, {
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
