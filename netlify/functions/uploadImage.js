// netlify/functions/uploadImage.js
const { getStore } = require("@netlify/blobs");
const Busboy = require("busboy");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const busboy = Busboy({ headers: event.headers });
  return new Promise((resolve, reject) => {
    const store = getStore({
      name: "your_store_name",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_ACCESS_TOKEN,
    });

    busboy.on("file", (filenames, file, info) => {
      const { filename, encoding, mimeType } = info;
      let buffers = [];

      file.on("data", (data) => {
        buffers.push(data); // Collect data chunks
      });

      file.on("end", async () => {
        const imageBuffer = Buffer.concat(buffers);
        const imageBase64 = imageBuffer.toString("base64"); // Convert the buffer to a base64 string

        const metadata = {
          filename,
          mimeType,
          encoding,
          imageBase64,
          // You could also store the base64 string size or other relevant metadata here
        };

        try {
          // Store the base64 string instead of the buffer
          await store.set(filename, imageBase64, { metadata });
          resolve({
            statusCode: 200,
            body: JSON.stringify({
              message: "Image uploaded successfully!",
              key: filename,
              mimeType,
              encoding,
            }),
          });
        } catch (error) {
          console.error("Failed to upload image:", error);
          reject({
            statusCode: 500,
            body: JSON.stringify({
              error: "Failed to upload image",
              details: error.message,
            }),
          });
        }
      });
    });

    busboy.on("finish", () => {
      console.log("Upload complete");
    });

    busboy.write(event.body, event.isBase64Encoded ? "base64" : "binary");
    busboy.end();
  });
};
