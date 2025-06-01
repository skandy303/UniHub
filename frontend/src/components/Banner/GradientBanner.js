import * as React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const GradientBanner = ({ title }) => {
  return (
    <Paper
      sx={{
        position: "relative",
        width: "100%",
        backgroundImage: "linear-gradient(to top, #002A5C, #0056BD)",
        textAlign: "center",
        height: 200,
        color: "secondary.main",
        py: 10,
        borderRadius: 0,
      }}
    >
      <Typography variant="h4">{title}</Typography>
    </Paper>
  );
};

export default GradientBanner;
