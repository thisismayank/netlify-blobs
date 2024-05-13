import React, { useState, useEffect } from "react";

import {
  Button,
  TextField,
  Box,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Divider,
} from "@mui/material";

function ImageManager() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [imageData, setImageData] = useState([]);

  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch("/.netlify/functions/listStores");
      if (response.ok) {
        const data = await response.json();
        setStores(data);
        if (data.length > 0) {
          setSelectedStore(data[0]); // Set the first store as default selected
          fetchImages(); // Optionally fetch images immediately upon selecting a store
        }
      } else {
        console.error("Failed to fetch stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };
  const fetchImageWithKey = async (key) => {
    console.log("fetch image key", key);
    const response = await fetch(
      `/.netlify/functions/getImage?key=${encodeURIComponent(key)}`
    );

    if (response.ok) {
      console.log("HERE");
      const data = await response.json();
      console.log("data", data);
      setImageData(data.metadata || []);
    }
  };
  const fetchImages = async () => {
    if (!selectedStore) return;
    try {
      const response = await fetch(
        `/.netlify/functions/listBlobs?store=${encodeURIComponent(
          selectedStore
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("RESPONSE", data);
        setImages(data);
      } else {
        console.error("Failed to fetch images");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file and a store first!");
      return;
    }

    console.log("SELECTED STORE", selectedStore);
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("store", selectedStore);

    try {
      const response = await fetch("/.netlify/functions/uploadImage", {
        method: "POST",
        body: formData,
      });

      console.log("upload image error", response);
      if (response.ok) {
        const data = await response.json();
        alert("Upload Successful!");
        fetchImages(); // Refresh images after upload
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      alert("Upload failed:", error.message);
    }
  };

  const deleteImage = async (key) => {
    if (!selectedStore) return;
    try {
      const response = await fetch(
        `/.netlify/functions/deleteBlob?key=${encodeURIComponent(
          key
        )}&store=${encodeURIComponent(selectedStore)}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        alert("Image deleted successfully");
        const deletedKey = `${key}-${new Date().getTime()}`; // Unique key for localStorage
        localStorage.setItem(deletedKey, key);
        fetchImages(); // Refresh images after deletion
      } else {
        alert("Failed to delete image");
      }
    } catch (error) {
      alert("Error deleting image:", error);
    }
  };

  const handleStoreChange = (e) => {
    setSelectedStore(e.target.value);
    fetchImages();
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024; // Or 1000 depending on what standard you want to use
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  console.log("IMAGE DATA", imageData);

  const createNewStore = async () => {
    const storeName = prompt("Enter new store name:");
    if (!storeName) {
      alert("Store name is required");
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/createStore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName }),
      });

      if (response.ok) {
        alert("Store created successfully!");
        fetchStores(); // Refresh store list
      } else {
        const error = await response.json();
        alert(`Failed to create store: ${error.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  const isDeleted = (key) => {
    return Object.keys(localStorage).some(
      (k) => localStorage.getItem(k) === key
    );
  };

  const neuStyle = {
    backgroundColor: "#e0e5ec",
    boxShadow: "4px 4px 10px #a3b1c6, -4px -4px 10px #ffffff",
    "&:hover": {
      boxShadow: "none",
      backgroundColor: "#e0e5ec",
    },
  };

  const [decodedContent, setDecodedContent] = useState("");

  const decodeBase64 = () => {
    try {
      const decodedData = atob(imageData.imageBase64); // Decode Base64 string
      setDecodedContent(decodedData);
      console.log(decodedData); // Log or process the decoded data
      // If the content represents an image, for example, you might set it as the source of an <img> element
    } catch (error) {
      console.error("Failed to decode Base64 string:", error);
    }
  };

  const handleCopy = async (data) => {
    try {
      await navigator.clipboard.writeText(data);
      alert("Data copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 0, pb: 0 }}
        style={{ textAlign: "center" }}
      >
        Netlify Blobs
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        // component="h1"
        style={{ textAlign: "center" }}
      >
        Upload and Manage Files
      </Typography>

      <select onChange={handleStoreChange} value={selectedStore}>
        {stores.map((store, index) => (
          <option key={index} value={store}>
            {store}
          </option>
        ))}
      </select>
      <button onClick={fetchImages}>Fetch Images</button>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload}>Upload Image</button>
      <button onClick={createNewStore}>Create New Store</button>

      <div>
        <h3>Uploaded Images in {selectedStore}</h3>
        {images.length > 0 ? (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">
              Uploaded Images in {selectedStore}
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <table style={{ width: "50%" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Image Key
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {images
                    .filter((img) => !isDeleted(img.key))
                    .map((image, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: "left", paddingLeft: "8px" }}>
                          {index + 1}. <strong>{image.key}</strong>
                        </td>
                        <td style={{ textAlign: "center", padding: "8px" }}>
                          <button
                            onClick={() => fetchImageWithKey(image.key)}
                            style={{
                              marginRight: "8px",
                              padding: "5px 10px",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              background: "#f0f0f0",
                            }}
                          >
                            Fetch
                          </button>
                          <button
                            onClick={() => deleteImage(image.key)}
                            style={{
                              padding: "5px 10px",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                              background: "#f44336",
                              color: "white",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Box>
        ) : (
          <p>No images to display.</p>
        )}
      </div>

      {imageData.filename && (
        <div
          style={{
            backgroundColor: "#e0e5ec", // Neumorphic background color
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "10px 10px 20px #bebebe, -10px -10px 20px #ffffff", // Neumorphic shadows
            margin: "20px 0",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "10px 0" }}>
            Encoding: <strong>{imageData.encoding}</strong>
          </p>
          <p style={{ margin: "10px 0" }}>
            Mime Type: <strong>{imageData.mimeType}</strong>
          </p>
          <p style={{ margin: "10px 0" }}>
            Size: <strong>{formatBytes(imageData.size)}</strong>
          </p>
          <p style={{ margin: "10px 0", wordWrap: "break-word" }}>
            Base64: <strong>{imageData.imageBase64}</strong>
          </p>
          <button
            onClick={() =>
              handleCopy(`data:image/jpeg;base64,${imageData.imageBase64}`)
            }
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              background: "#f44336",
              color: "white",
              boxShadow: "5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff",
              fontSize: "16px",
              margin: "auto",
              marginRight: 16,
              textAlign: "center",
            }}
          >
            Copy to clipboard. You can paste it in your url bar to display the
            contents
          </button>

          <button
            onClick={() => deleteImage(imageData.filename)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              background: "#f44336",
              color: "white",
              boxShadow: "5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff", // Neumorphic shadows for button
              fontSize: "16px",
            }}
          >
            Delete
          </button>
        </div>
      )}
    </Box>
  );
}

export default ImageManager;
