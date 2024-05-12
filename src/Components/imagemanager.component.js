import React, { useState, useEffect } from "react";
import "./neumorphism.css";
import {
  Button,
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
        await response.json();
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

  return (
    <Box
      className="neumorphic"
      sx={{ p: 4, maxWidth: 800, margin: "auto", mt: 6 }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mb: 3 }}
      >
        {`Select store > upload > manage Files`}
      </Typography>

      <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
        <InputLabel id="store-select-label">Select Store</InputLabel>
        <Select
          labelId="store-select-label"
          id="demo-simple-select-standard"
          value={selectedStore}
          onChange={handleStoreChange}
          label="Store"
          className="neumorphic-inset"
        >
          {stores.map((store, index) => (
            <MenuItem key={index} value={store}>
              {store}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        className="neumorphic-button"
        onClick={fetchImages}
        sx={{ mb: 2, width: "100%" }}
      >
        Fetch Images from {selectedStore} Store
      </Button>

      <Divider sx={{ my: 2 }} />

      <input
        type="file"
        onChange={handleFileChange}
        accept="*"
        className="neumorphic-inset"
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />
      <Button
        className="neumorphic-button"
        onClick={handleUpload}
        sx={{ width: "100%", mb: 2 }}
      >
        Upload Image
      </Button>

      <Button
        className="neumorphic-button"
        onClick={createNewStore}
        sx={{ width: "100%" }}
      >
        Create New Store
      </Button>

      {images.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Uploaded Images in {selectedStore}
          </Typography>
          {images
            .filter((img) => !isDeleted(img.key))
            .map((image, index) => (
              <Box
                key={index}
                className="neumorphic-inset"
                sx={{ my: 1, p: 2 }}
              >
                <Button onClick={() => fetchImageWithKey(image.key)}>
                  {image.key}
                </Button>
                <Button
                  className="neumorphic-button"
                  onClick={() => deleteImage(image.key)}
                >
                  Delete
                </Button>
              </Box>
            ))}
        </Box>
      )}

      {imageData.filename && (
        <Box className="neumorphic-inset" sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6">Blob Details</Typography>
          <Typography>Filename: {imageData.filename}</Typography>
          <Typography>Encoding: {imageData.encoding}</Typography>
          <Typography>Mime Type: {imageData.mimeType}</Typography>
          <Typography>Size: {formatBytes(imageData.size)}</Typography>
          <Typography>Base64: {imageData.imageBase64}</Typography>
          <Button
            className="neumorphic-button"
            onClick={() => console.log("Deleting image")}
          >
            Delete
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ImageManager;
