import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
const Navbar = () => {
  const location = useLocation(); // Get current location

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "gainsboro" }}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          {location.pathname === "/blobs" && (
            <>
              <img src="./logo.png" alt="logo" height={30} width={100} />
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
                style={{ color: "#004646", fontWeight: "bold" }}
              >
                Netlify Blobs challenge
              </Typography>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <Button
                  color="primary"
                  variant="contained"
                  style={{ fontWeight: "bold" }}
                  sx={{ backgroundColor: "gainsboro", color: "#004646" }}
                >
                  Go To CDN <ExitToAppIcon />
                </Button>
              </Link>
            </>
          )}
          {location.pathname === "/" && (
            <>
              <img src="./logo.png" alt="logo" height={30} width={100} />
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
                style={{ color: "#004646", fontWeight: "bold" }}
              >
                Netlify CDN challenge
              </Typography>
              <Link
                to="/blobs"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  style={{ fontWeight: "bold" }}
                  sx={{ backgroundColor: "gainsboro", color: "#004646" }}
                >
                  Go To Blobs <ExitToAppIcon />
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
