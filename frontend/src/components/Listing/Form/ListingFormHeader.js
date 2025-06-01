import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ListingFormHeader = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Replace with the correct path to the profile page
  };

  return (
    <Box
      sx={{
        color: "primary.main",
        p: 2,
      }}
      display="flex"
    >
      <ArrowBackIcon
        sx={{
          color: "primary.main",
          fontSize: 40,
          left: "10%",
          cursor: "pointer",
        }}
        onClick={handleBackClick}
      />
      <Typography
        variant="h4"
        sx={{
          left: "100%",
          right: "100%",
          width: "95%",
          textAlign: "center",
        }}
      >
        Create New Listing
      </Typography>
    </Box>
  );
};

export default ListingFormHeader;
