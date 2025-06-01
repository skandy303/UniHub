import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LoginButton = ({ variant }) => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (variant === "landing") {
    return (
      !isAuthenticated && (
        <Button
          color="secondary"
          variant="contained"
          sx={{ fontWeight: "bold", fontSize: "1rem" }}
          onClick={() => loginWithRedirect()}
        >
          Log In
        </Button>
      )
    );
  }

  return (
    !isAuthenticated && (
      <Button
        color="primary"
        variant="contained"
        onClick={() => loginWithRedirect()}
      >
        Log In
      </Button>
    )
  );
};

export default LoginButton;
