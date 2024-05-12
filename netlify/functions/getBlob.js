// netlify/functions/getBlob.js
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const key = event.queryStringParameters.key;
  if (!key) {
    return { statusCode: 400, body: "Missing key parameter" };
  }

  try {
    const store = getStore({
      name: "your_store_name",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_ACCESS_TOKEN,
    });
    const data = await store.get(key);

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to get data",
        details: error.message,
        stack: error.stack, // Only for development debugging purposes
      }),
    };
  }
};
