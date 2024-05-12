// netlify/functions/setBlob.js
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { key, value } = JSON.parse(event.body);
    const store = getStore({
      name: "your_store_name",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_ACCESS_TOKEN,
    }); // Replace with your actual store name
    await store.set(key, value);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data has been saved to Netlify Blobs" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to set data",
        details: error.message,
        stack: error.stack, // Only for development debugging purposes
      }),
    };
  }
};
