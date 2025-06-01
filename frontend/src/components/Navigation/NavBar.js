import * as React from "react";
import { useNavigate } from "react-router-dom";
import LoginButton from "../Buttons/LoginButton";
import LogoutButton from "../Buttons/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const NavBar = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar color="secondary" position="static">
          <Toolbar>
            <Typography
              color="primary"
              variant="h4"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              UniHub
            </Typography>
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
                margin: { xs: 0, sm: 1 },
              }}
            >
              <Button
                key="Home"
                sx={{ color: "primary" }}
                onClick={() => navigate("/home")}
              >
                Home
              </Button>
              <Button
                key="Profile"
                sx={{ color: "primary" }}
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
              <Button
                key="Messages"
                sx={{ color: "primary" }}
                onClick={() => navigate("/messages")}
              >
                Messages
              </Button>
            </Box>
            <LoginButton />
            <LogoutButton />
          </Toolbar>
        </AppBar>
      </Box>
    );
  }

  return false;
};

export default NavBar;
