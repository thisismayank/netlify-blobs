// netlify/functions/listStores.js
const { listStores } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const { stores } = await listStores({
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_ACCESS_TOKEN,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(stores),
    };
  } catch (error) {
    console.error("Error listing stores:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to upload image",
        details: error.message,
      }),
    };
  }
};
