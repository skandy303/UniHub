import React from "react";

import { Box, CircularProgress } from "@mui/material";

const LoadingComponent = () => {
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100%",
    }}
  >
    <CircularProgress />
  </Box>;
};

export default LoadingComponent;
