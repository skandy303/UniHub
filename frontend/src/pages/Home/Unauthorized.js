// src/pages/NotFound/NotFound.js
import React from "react";
import { Box, Typography } from "@mui/material";

const Unauthorized = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 128px)", // Adjust the height to account for the header and footer
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1, // Add flexGrow to make the Box expand and center the content
          width: "100%",
          color: "primary.main",
        }}
      >
        <Typography variant="h1">Unauthorized</Typography>
      </Box>
    </Box>
  );
};

export default Unauthorized;
