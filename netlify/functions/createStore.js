// netlify/functions/createStore.js
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body);
  const storeName = body.storeName;

  if (!storeName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Store name is required" }),
    };
  }

  const store = getStore({
    name: storeName,
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_ACCESS_TOKEN,
  });

  try {
    // Optionally initialize the store with a dummy value
    await store.set("init", "Initialized");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Store created successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create store",
        details: error.message,
      }),
    };
  }
};
