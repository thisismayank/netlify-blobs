// netlify/functions/deleteBlob.js
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  console.log("httpMethod", event.queryStringParameters);
  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const storeName = event.queryStringParameters.store || "your_store_name";

    const { key } = JSON.parse(event.queryStringParameters.key);
    const store = getStore({
      name: storeName,
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_ACCESS_TOKEN,
    });
    const deleteData = await store.delete(key);

    console.log("deleteData", deleteData);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data has been deleted from Netlify Blobs",
      }),
    };
  } catch (error) {
    console.log("ERROR", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to delete data" }),
      details: error.message,
    };
  }
};
