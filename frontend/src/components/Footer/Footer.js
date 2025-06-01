import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const Footer = () => {
  return (
    <Paper
      sx={{
        position: "relative",
        width: "100%",
        backgroundColor: "primary.main",
      }}
      component="footer"
      square
      variant="outlined"
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          mb: 2,
          flexDirection: "column",
          textAlign: "center",
          color: "secondary.main",
        }}
      >
        <Typography variant="title">UniHub</Typography>
        <Typography variant="caption">Copyright © 2023. UofTears</Typography>
      </Box>
    </Paper>
  );
};

export default Footer;
