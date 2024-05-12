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

    busboy.on("file", async (filenames, file, info) => {
      const { filename, encoding, mimeType } = info;

      console.log("INFO", info);

      let buffers = [];
      file.on("data", (data) => {
        buffers.push(data);
      });

      file.on("end", async () => {
        const imageBuffer = Buffer.concat(buffers);
        const imageBase64 = imageBuffer.toString("base64");

        const metadata = {
          filename,
          mimeType,
          imageBase64,
          encoding,
        }; // Add more metadata as needed

        try {
          await store.set(filename, imageBuffer, { metadata });
          console.log("Uploading image with key:", filename);

          resolve({
            statusCode: 200,
            body: JSON.stringify({
              message: "Image uploaded successfully!",
              key: filename,
              mimeType,
              encoding: encoding,
            }),
          });
        } catch (error) {
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
