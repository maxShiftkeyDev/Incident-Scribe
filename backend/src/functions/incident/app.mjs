import { DynamoDBClient, ScanCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient();
const INCIDENTS_TABLE = process.env.INCIDENTS_TABLE;

export async function handler(event) {
    const { httpMethod, path } = event;
    
    if (httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: "",
        };
    }
  

  try {
    if (httpMethod === "GET" && event.path?.endsWith("/incidents")) {
      const command = new ScanCommand({ TableName: INCIDENTS_TABLE });
      const result = await client.send(command);

      const incidents = result.Items.map(item => unmarshall(item));
      return response(200, incidents);
    }

    if (httpMethod === "POST" && event.path?.endsWith("/incidents")) {
      const body = JSON.parse(event.body);

      if (!body.id) {
        return response(400, { message: "Missing required field: id" });
      }

      const item = {
        incidentId: body.id, // use frontend-provided id
        title: body.title || "Untitled Incident",
        description: body.description || "",
        status: body.status || "open",
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: body.updatedAt || new Date().toISOString()
      };

      const command = new PutItemCommand({
        TableName: INCIDENTS_TABLE,
        Item: marshall(item)
      });

      await client.send(command);
      return response(201, { message: "Incident created", incidentId: item.incidentId });
    }

    return response(404, { message: "Not Found" });

  } catch (error) {
    console.error("Handler error:", error);
    return response(500, { message: "Internal Server Error", error: error.message });
  }
}

function response(statusCode, body) {
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // <--- this is critical
      },
      body: JSON.stringify(body),
    };
  }