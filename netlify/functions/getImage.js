// netlify/functions/getImage.js
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const key = event.queryStringParameters.key;
  if (!key) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing 'key' query parameter. Please provide an image key.",
      }),
    };
  }

  try {
    const store = getStore({
      name: "your_store_name",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_ACCESS_TOKEN,
    });
    const { data, etag, metadata } = await store.getWithMetadata(key, {
      type: "blob",
    });
    console.log("etag", etag);
    return {
      statusCode: 200,
      body: JSON.stringify({
        image: data.toString("base64"),
        metadata: { ...metadata, size: data.size },
      }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch image",
        details: error.message,
      }),
    };
  }
};
