// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Paper,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";

// // Neumorphic styled Paper component
// const NeumorphicPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(2),
//   borderRadius: theme.spacing(2),
//   boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff",
// }));
// function ImageCarousel() {
//   const images = [
//     { url: "/modric.jpeg", alt: "Modric" },
//     { url: "/madrid.jpeg", alt: "Madrid" },
//     { url: "/ozil.jpeg", alt: "Ozil" },
//     { url: "/ronaldo-1.jpeg", alt: "Ronaldo" },
//     { url: "/benzema.jpeg", alt: "Benzema" },
//     { url: "/messi.jpeg", alt: "Messi" },
//   ];

//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [imageWidth, setImageWidth] = useState(500);
//   const [imageHeight, setImageHeight] = useState(500);
//   const [fit, setFit] = useState("contain");
//   const [format, setFormat] = useState("jpg");
//   const [quality, setQuality] = useState(50);
//   const [error, setError] = useState(false);
//   const [helperText, setHelperText] = useState(
//     "Value must be between 1 and 100"
//   );
//   const [fileSize, setFileSize] = useState(0);
//   const [prevFileSize, setPrevFileSize] = useState(0);
//   const handleChange = (event) => {
//     const value = event.target.value;
//     setQuality(value);

//     if (value < 1 || value > 100) {
//       setError(true);
//       setHelperText(
//         `Please enter a value between 1 and 100.
//         Resetting to closest value for the url.`
//       );
//       if (value > 100) {
//         setQuality(100);
//       }
//     } else {
//       setError(false);
//       setHelperText("Value must be between 1 and 100");
//     }
//   };
//   const baseUrl = "https://mayank-cdn-test.netlify.app/.netlify/images";

//   const buildImageUrl = () => {
//     const { url } = images[selectedImageIndex];
//     return `${baseUrl}?url=${encodeURIComponent(
//       url
//     )}&w=${imageWidth}&h=${imageHeight}&fit=${fit}&fm=${format}&q=${quality}`;
//   };

//   const fetchImageSize = async () => {
//     setPrevFileSize(fileSize);
//     const response = await fetch(buildImageUrl());
//     const blob = await response.blob();
//     setFileSize(blob.size / 1024); // Convert bytes to KB
//   };

//   const handleFitChange = (event) => {
//     setFit(event.target.value);
//   };
//   useEffect(() => {
//     fetchImageSize();
//   }, [imageWidth, imageHeight, fit, format, quality]);
//   return (
//     <Box sx={{ p: 4 }}>
//       <Paper
//         sx={{ mb: 2, p: 2, textAlign: "center", backgroundColor: "#b0c7c7" }}
//       >
//         <Typography
//           variant="caption"
//           sx={{
//             wordWrap: "break-word",
//             fontWeight: "bold",
//             fontSize: "1em",
//             color: "crimson",
//           }}
//         >
//           {buildImageUrl()}
//         </Typography>
//       </Paper>
//       <Box sx={{ display: "flex", gap: 3 }}>
//         <Box sx={{ width: "25%", overflowY: "auto", maxHeight: "85vh" }}>
//           {images.map((img, index) => (
//             <Button
//               key={index}
//               onClick={() => setSelectedImageIndex(index)}
//               sx={{
//                 width: 100,
//                 height: 100,
//                 p: 0,
//                 m: 1,

//                 transition: "transform 0.3s, border 0.3s",
//                 "& img": {
//                   borderRadius: "10px",
//                   width: 100,
//                   height: 100,
//                   border:
//                     selectedImageIndex === index ? "4px solid green" : "0px",
//                   transform:
//                     selectedImageIndex === index ? "scale(1.1)" : "none",
//                   transition: "transform 0.3s, border 0.3s",
//                 },
//               }}
//             >
//               <img src={img.url} alt={img.alt} />
//             </Button>
//           ))}
//         </Box>

//         <NeumorphicPaper
//           sx={{
//             width: "50%",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: "#e2e3e3",
//           }}
//         >
//           <img src={buildImageUrl()} alt={images[selectedImageIndex].alt} />
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//             {fit}:{" "}
//             {fit === "contain"
//               ? "Resizes the image to fit within the given dimension while preserving its aspect ratio."
//               : fit === "cover"
//               ? "Resizes the image to fill the given dimension while preserving its aspect ratio, but may crop the image."
//               : "Stretches the image to fit the content box, regardless of its aspect ratio."}
//           </Typography>
//         </NeumorphicPaper>
//         <Box sx={{ width: "25%" }}>
//           <TextField
//             label="Width"
//             type="number"
//             value={imageWidth}
//             onChange={(e) => setImageWidth(e.target.value)}
//             variant="outlined"
//             size="small"
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Height"
//             type="number"
//             value={imageHeight}
//             onChange={(e) => setImageHeight(e.target.value)}
//             variant="outlined"
//             size="small"
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Quality"
//             type="number"
//             value={quality}
//             onChange={handleChange}
//             helperText={helperText}
//             error={error} // Conditionally render error state
//             variant="outlined"
//             size="small"
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Fit</InputLabel>
//             <Select value={fit} label="Fit" onChange={handleFitChange}>
//               <MenuItem value="contain">Contain</MenuItem>
//               <MenuItem value="cover">Cover</MenuItem>
//               <MenuItem value="fill">Fill</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth>
//             <InputLabel>Format</InputLabel>
//             <Select
//               value={format}
//               label="Format"
//               onChange={(e) => setFormat(e.target.value)}
//             >
//               <MenuItem value="webp">WebP</MenuItem>
//               <MenuItem value="jpg">JPG</MenuItem>
//               <MenuItem value="png">PNG</MenuItem>
//               <MenuItem value="avif">AVIF</MenuItem>
//             </Select>
//           </FormControl>
//           <Box sx={{ mt: 3 }}>
//             <Typography
//               variant="body2"
//               color="red"
//               style={{
//                 fontWeight: "bold",
//                 backgroundColor: "yellow",
//                 fontSize: "1.5em",

//                 borderRadius: 8,
//               }}
//             >
//               Size now: {fileSize.toFixed(2)} KB
//             </Typography>
//             <br />
//             <Typography
//               variant="body2"
//               color="#004dff"
//               style={{
//                 fontWeight: "bold",
//                 backgroundColor: "#e4e4e4",
//                 padding: 8,
//                 borderRadius: 8,
//               }}
//             >
//               Prev size @ [{imageWidth}W x {imageHeight}H x {quality}Q x {fit} x{" "}
//               {format.toUpperCase()}] : {prevFileSize.toFixed(2)} KB
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default ImageCarousel;
