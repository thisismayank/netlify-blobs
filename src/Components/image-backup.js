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
    if (!file || !selectedStore) {
      alert("Please select a file and a store first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("store", selectedStore);

    try {
      const response = await fetch("/.netlify/functions/uploadImage", {
        method: "POST",
        body: formData,
      });
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
      <div>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Select Store
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={selectedStore}
            onChange={handleStoreChange}
            label="Store"
          >
            {stores.map((store, index) => (
              <MenuItem key={index} value={store}>
                {store}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
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
          images
            .filter((img) => !isDeleted(img.key))
            .map((image, index) => (
              <div key={image.etag}>
                <button onClick={() => fetchImageWithKey(image.key)}>
                  {image.key}
                </button>
                <button onClick={() => deleteImage(image.key)}>Delete</button>
              </div>
            ))
        ) : (
          <p>No images to display.</p>
        )}
      </div>

      {imageData && (
        <div>
          <h3>Image: {imageData.filename}</h3>(
          <div>
            <p>Encoding: {imageData.encoding}</p>
            <p>Mime Type: {imageData.mimeType}</p>
            <p>Size: {formatBytes(imageData.size)} </p>
            <p>Base64: {imageData.imageBase64} </p>

            <button onClick={() => deleteImage(imageData.filename)}>
              Delete
            </button>
          </div>
          )
        </div>
      )}
    </Box>
  );
}

export default ImageManager;
{
  /* <img
                src={`data:image/jpeg;base64,${image.data}`}
                alt={image.metadata.filename}
                style={{ width: "100px", height: "auto" }}
              />
              <p>Filename: {image.metadata.filename}</p>
              <p>MIME type: {image.metadata.mimetype}</p> */
}
