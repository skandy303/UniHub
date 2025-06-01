import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { userLogin } from "./api/users";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProtectedRoute = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  const login = async () => {
    const token = await getAccessTokenSilently();

    try {
      await userLogin(token);
      // do smth with res (check if res contains error?)
    } catch (err) {
      console.log("User login failed");
    }
  };

  if (isLoading) {
    return (
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
      </Box>
    );
  }

  if (isAuthenticated) {
    login();
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
