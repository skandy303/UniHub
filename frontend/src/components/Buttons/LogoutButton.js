import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

import { userLogout } from "../../api/users";

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  const handleLogout = async () => {
    const res = await userLogout();
    // do smth with res (check if res contains error?)
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    isAuthenticated && (
      <Button
        color="primary"
        variant="contained"
        onClick={() => handleLogout()}
      >
        Log Out
      </Button>
    )
  );
};

export default LogoutButton;
