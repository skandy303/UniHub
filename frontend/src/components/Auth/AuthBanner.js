import React from "react";
import { Box, Typography } from "@mui/material";
import LoginButton from "../Buttons/LoginButton";

import { useAuth0 } from "@auth0/auth0-react";

const AuthBanner = () => {
  const { isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <Box
        sx={{
          py: 20,
          px: 6,
          flexGrow: 1,
          height: 500,
          color: "secondary.main",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: "bold" }}>
          UniHub.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold", py: 2 }}>
          The only online marketplace you need.
        </Typography>
        <LoginButton variant={"landing"} />
      </Box>
    )
  );
};

export default AuthBanner;
