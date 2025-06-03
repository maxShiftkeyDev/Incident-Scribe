import axios from "axios";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secretsClient = new SecretsManagerClient();

export async function handler(event) {
  console.log("=== Incoming event ===", JSON.stringify(event, null, 2));

  const { httpMethod, path } = event;

  if (httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  try {
    if (httpMethod === "GET" && path?.endsWith("/channels")) {
      console.log("Handling GET /channels");

      // 1️⃣ Get Slack token from Secrets Manager
      const secretData = await secretsClient.send(
        new GetSecretValueCommand({
          SecretId: "slack/api-token",
        })
      );
      const secretString = secretData.SecretString;
      const slackToken = JSON.parse(secretString).slack_bot_token;
      if (!slackToken) {
        console.warn("No Slack bot token found in secret");
        return response(500, { message: "Slack bot token missing in secret" });
      }

      // 2️⃣ Call Slack API to list channels
      const slackResponse = await axios.get(
        "https://slack.com/api/conversations.list",
        {
          headers: {
            Authorization: `Bearer ${slackToken}`,
          },
          params: {
            types: "public_channel,private_channel",
          },
        }
      );

      // 3️⃣ Check Slack API response
      if (!slackResponse.data.ok) {
        console.warn(
          "Slack API returned error:",
          JSON.stringify(slackResponse.data, null, 2)
        );
        return response(500, {
          message: "Slack API error",
          error: slackResponse.data.error,
        });
      }

      console.log(
        "Slack channels fetched:",
        JSON.stringify(slackResponse.data.channels, null, 2)
      );

      // 4️⃣ Return channels
      return response(200, { channels: slackResponse.data.channels });
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
