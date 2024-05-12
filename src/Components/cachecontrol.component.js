// src/CacheDemo.js
import React, { useState } from "react";
import axios from "axios";

function CacheDemo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cacheStatus, setCacheStatus] = useState("");

  const fetchData = async (cacheControl) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/data", {
        headers: {
          "Netlify-CDN-Cache-Control": cacheControl,
        },
      });
      setData(response.data.slice(0, 5)); // Show only the first 5 items for brevity
      setCacheStatus(
        response.headers["cache-status"] || "No cache-status header"
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={() => fetchData("public, max-age=60")}>
        Fetch with Cache
      </button>
      <button onClick={() => fetchData("no-cache")}>Fetch without Cache</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Cache Status: {cacheStatus}</h3>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CacheDemo;
