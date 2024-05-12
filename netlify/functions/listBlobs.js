// netlify/functions/listBlobs.js
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const storeName = event.queryStringParameters.store || "your_store_name"; // Fallback to 'default_store' if none provided
  const store = getStore({
    name: storeName,
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_ACCESS_TOKEN,
  });

  try {
    const { blobs } = await store.list(); // You can add parameters for pagination here
    return {
      statusCode: 200,
      body: JSON.stringify(blobs),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
