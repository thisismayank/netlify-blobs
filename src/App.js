import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import ImageManager from "./Components/imagemanager.component";
// import ImageCarousel from "./Components/imagecarousel.component";
import Navbar from "./Components/navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <ImageManager />
        {/* <Routes>
          <Route path="/" element={<ImageCarousel />} />
          <Route path="/blobs" element={<ImageManager />} />
        </Routes> */}
      </div>
    </Router>
  );
}

export default App;
